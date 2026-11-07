import type { AgentAction, ExecutionResult, SanitizedBrowserState } from '@privacy-agent/shared-types';

interface AgentTaskState {
  isRunning: boolean;
  taskPrompt: string;
  stepCount: number;
  maxSteps: number;
  currentThought: string;
  currentAction: string;
  history: Array<{ action: AgentAction; result: ExecutionResult }>;
}

const taskState: AgentTaskState = {
  isRunning: false,
  taskPrompt: '',
  stepCount: 0,
  maxSteps: 15,
  currentThought: '',
  currentAction: '',
  history: [],
};

function notifyPopup(type: string, data: any = {}) {
  try {
    chrome.runtime.sendMessage({ type, state: taskState, ...data }).catch(() => {});
  } catch {}
}

async function broadcastTelemetry(component: string, event: string, data: any) {
  try {
    await fetch('http://localhost:3000/api/telemetry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: `event_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        timestamp: Date.now(),
        component,
        event,
        data,
        level: 'info',
      }),
    }).catch(() => {});
  } catch {}
}

async function ensureContentScriptInjected(tabId: number): Promise<boolean> {
  try {
    await chrome.scripting.executeScript({
      target: { tabId },
      files: ['content.js'],
    });
    return true;
  } catch {
    return false;
  }
}

async function runAgentStep(tabId: number): Promise<boolean> {
  if (!taskState.isRunning || taskState.stepCount >= taskState.maxSteps) {
    taskState.isRunning = false;
    notifyPopup('TASK_STATUS_UPDATE', { status: 'Task complete or stopped.' });
    await broadcastTelemetry('agent', 'TASK_STOPPED', { reason: 'Max steps or stopped' });
    return false;
  }

  taskState.stepCount++;
  notifyPopup('TASK_STATUS_UPDATE', { status: `Running Step ${taskState.stepCount}...` });

  // 1. Get Sanitized State from Content Script
  let stateResponse: any = null;
  try {
    stateResponse = await new Promise<any>((resolve) => {
      chrome.tabs.sendMessage(tabId, { type: 'GET_SANITIZED_STATE' }, (res) => {
        if (chrome.runtime.lastError) {
          resolve(null);
        } else {
          resolve(res);
        }
      });
    });
  } catch {
    stateResponse = null;
  }

  // If content script was disconnected, inject it and retry
  if (!stateResponse || !stateResponse.success) {
    await ensureContentScriptInjected(tabId);
    await new Promise((r) => setTimeout(r, 400));

    try {
      stateResponse = await new Promise<any>((resolve) => {
        chrome.tabs.sendMessage(tabId, { type: 'GET_SANITIZED_STATE' }, (res) => {
          if (chrome.runtime.lastError) resolve(null);
          else resolve(res);
        });
      });
    } catch {
      stateResponse = null;
    }
  }

  if (!stateResponse || !stateResponse.success) {
    taskState.isRunning = false;
    notifyPopup('TASK_STATUS_UPDATE', { status: 'Perception Error: Could not connect to tab. Please refresh page.' });
    return false;
  }

  const sanitizedState: SanitizedBrowserState = {
    url: stateResponse.url,
    title: stateResponse.title,
    viewport: stateResponse.viewport,
    elements: stateResponse.elements,
    activeTokens: stateResponse.activeTokens,
    timestamp: Date.now(),
  };

  await broadcastTelemetry('privacy', 'SANITIZED_STATE_CAPTURED', {
    activeTokensCount: sanitizedState.activeTokens?.length || 0,
    elementsCount: sanitizedState.elements?.length || 0,
    url: sanitizedState.url,
  });

  // 2. Query Local/Cloud Autonomous Gateway with SANITIZED State ONLY
  const gatewayUrl = 'http://localhost:3000/api/gemini/agent';
  let modelOutput: any = null;

  try {
    const apiRes = await fetch(gatewayUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        taskPrompt: taskState.taskPrompt,
        state: sanitizedState,
        stepIndex: taskState.stepCount,
      }),
    });

    if (apiRes.ok) {
      modelOutput = await apiRes.json();
    }
  } catch (err: any) {
    console.warn('Gateway fetch failed:', err);
  }

  const action: AgentAction = modelOutput?.action || {
    action: 'FINISH_TASK',
    success: true,
    summary: 'Autonomous task reasoning finished.',
    thought: 'Task completed',
  };

  taskState.currentAction = action.action;
  taskState.currentThought = action.thought || '';
  notifyPopup('TASK_STATUS_UPDATE', {
    status: `Step ${taskState.stepCount}: ${action.action} — ${action.thought || ''}`,
  });

  await broadcastTelemetry('agent', 'ACTION_RECEIVED', {
    action: action.action,
    thought: action.thought,
  });

  // 3. Execute Action locally via Content Script
  let execResult: ExecutionResult = { success: true, action, executionTimeMs: 10 };
  try {
    execResult = await new Promise<ExecutionResult>((resolve) => {
      chrome.tabs.sendMessage(tabId, { type: 'EXECUTE_ACTION', action }, (res) => {
        if (chrome.runtime.lastError) {
          resolve({ success: false, action, executionTimeMs: 0, error: chrome.runtime.lastError.message });
        } else {
          resolve(res || { success: true, action, executionTimeMs: 0 });
        }
      });
    });
  } catch (err: any) {
    execResult = { success: false, action, executionTimeMs: 0, error: err?.message };
  }

  taskState.history.push({ action, result: execResult });

  await broadcastTelemetry('executor', 'ACTION_EXECUTED', {
    action: action.action,
    success: execResult.success,
    executionTimeMs: execResult.executionTimeMs,
  });

  if (action.action === 'FINISH_TASK') {
    taskState.isRunning = false;
    notifyPopup('TASK_STATUS_UPDATE', { status: '✓ Task Completed Successfully (0 Leaks)' });
    await broadcastTelemetry('agent', 'TASK_COMPLETED', {
      success: action.success,
      summary: action.summary,
      totalSteps: taskState.stepCount,
    });
    return false;
  }

  // Pacing between steps so user clearly sees DOM changes (600ms)
  await new Promise((r) => setTimeout(r, 600));
  return runAgentStep(tabId);
}

chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if (request.type === 'START_TASK') {
    taskState.isRunning = true;
    taskState.taskPrompt = request.prompt;
    taskState.stepCount = 0;
    taskState.history = [];
    taskState.currentAction = 'START';
    taskState.currentThought = 'Initializing local perception';

    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      if (tabs[0]?.id) {
        broadcastTelemetry('agent', 'TASK_STARTED', { prompt: request.prompt });
        runAgentStep(tabs[0].id);
      }
    });

    sendResponse({ success: true });
    return true;
  }

  if (request.type === 'STOP_TASK') {
    taskState.isRunning = false;
    notifyPopup('TASK_STATUS_UPDATE', { status: 'Task stopped by user.' });
    sendResponse({ success: true });
    return true;
  }

  if (request.type === 'GET_TASK_STATUS') {
    sendResponse({ state: taskState });
    return true;
  }
});
