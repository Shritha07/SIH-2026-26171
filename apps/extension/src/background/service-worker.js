const taskState = {
    isRunning: false,
    taskPrompt: '',
    stepCount: 0,
    maxSteps: 15,
    history: [],
};
async function broadcastTelemetry(component, event, data) {
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
        }).catch(() => { });
    }
    catch { }
}
async function runAgentStep(tabId) {
    if (!taskState.isRunning || taskState.stepCount >= taskState.maxSteps) {
        taskState.isRunning = false;
        await broadcastTelemetry('agent', 'TASK_STOPPED', { reason: 'Max steps or stopped' });
        return false;
    }
    taskState.stepCount++;
    // 1. Get Sanitized State from Content Script
    const stateResponse = await new Promise((resolve) => {
        chrome.tabs.sendMessage(tabId, { type: 'GET_SANITIZED_STATE' }, (res) => resolve(res));
    });
    if (!stateResponse || !stateResponse.success) {
        await broadcastTelemetry('agent', 'PERCEPTION_ERROR', { error: 'Failed to capture sanitized DOM state' });
        return false;
    }
    const sanitizedState = {
        url: stateResponse.url,
        title: stateResponse.title,
        viewport: stateResponse.viewport,
        elements: stateResponse.elements,
        activeTokens: stateResponse.activeTokens,
        timestamp: Date.now(),
    };
    await broadcastTelemetry('privacy', 'SANITIZED_STATE_CAPTURED', {
        activeTokensCount: sanitizedState.activeTokens.length,
        elementsCount: sanitizedState.elements.length,
        url: sanitizedState.url,
    });
    // 2. Query Secure Gemini Gateway with SANITIZED state ONLY
    const gatewayUrl = 'http://localhost:3000/api/gemini/agent';
    const apiRes = await fetch(gatewayUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            taskPrompt: taskState.taskPrompt,
            state: sanitizedState,
            stepIndex: taskState.stepCount,
        }),
    });
    if (!apiRes.ok) {
        const errText = await apiRes.text();
        await broadcastTelemetry('agent', 'GATEWAY_ERROR', { status: apiRes.status, error: errText });
        return false;
    }
    const modelOutput = await apiRes.json();
    const action = modelOutput.action;
    await broadcastTelemetry('agent', 'ACTION_RECEIVED', {
        action: action.action,
        thought: action.thought,
    });
    // 3. Execute Action locally via Content Script
    const execResult = await new Promise((resolve) => {
        chrome.tabs.sendMessage(tabId, { type: 'EXECUTE_ACTION', action }, (res) => resolve(res));
    });
    taskState.history.push({ action, result: execResult });
    await broadcastTelemetry('executor', 'ACTION_EXECUTED', {
        action: action.action,
        success: execResult.success,
        executionTimeMs: execResult.executionTimeMs,
    });
    if (action.action === 'FINISH_TASK') {
        taskState.isRunning = false;
        await broadcastTelemetry('agent', 'TASK_COMPLETED', {
            success: action.success,
            summary: action.summary,
            totalSteps: taskState.stepCount,
        });
        return false;
    }
    // Wait 1.5s for page to settle and continue loop
    await new Promise((r) => setTimeout(r, 1500));
    return runAgentStep(tabId);
}
chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
    if (request.type === 'START_TASK') {
        taskState.isRunning = true;
        taskState.taskPrompt = request.prompt;
        taskState.stepCount = 0;
        taskState.history = [];
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
        sendResponse({ success: true });
        return true;
    }
    if (request.type === 'GET_TASK_STATUS') {
        sendResponse({ state: taskState });
        return true;
    }
});
export {};
//# sourceMappingURL=service-worker.js.map