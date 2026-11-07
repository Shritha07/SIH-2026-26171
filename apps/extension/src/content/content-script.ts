import { DOMPerceptionExtractor } from '../perception/dom-extractor';
import { PIIDetectionEngine } from '@privacy-agent/privacy-core';
import { BrowserActionExecutor } from '../actions/action-executor';
import type { AgentAction } from '@privacy-agent/shared-types';

const extractor = new DOMPerceptionExtractor();
const piiEngine = new PIIDetectionEngine();
const executor = new BrowserActionExecutor(piiEngine.getTokenRegistry());

let highlightOverlay: HTMLDivElement | null = null;
let statusBanner: HTMLDivElement | null = null;

function createOrGetOverlay(): HTMLDivElement {
  if (!highlightOverlay) {
    highlightOverlay = document.createElement('div');
    highlightOverlay.id = 'privacy-agent-highlight-overlay';
    highlightOverlay.style.position = 'fixed';
    highlightOverlay.style.pointerEvents = 'none';
    highlightOverlay.style.zIndex = '9999999';
    highlightOverlay.style.border = '3px solid #10B981';
    highlightOverlay.style.boxShadow = '0 0 20px rgba(16, 185, 129, 0.6)';
    highlightOverlay.style.backgroundColor = 'rgba(16, 185, 129, 0.15)';
    highlightOverlay.style.borderRadius = '8px';
    highlightOverlay.style.transition = 'all 0.15s ease-in-out';
    highlightOverlay.style.display = 'none';
    document.body.appendChild(highlightOverlay);
  }
  return highlightOverlay;
}

function showOnPageStatus(text: string, actionType?: string) {
  if (!statusBanner) {
    statusBanner = document.createElement('div');
    statusBanner.id = 'privacy-agent-live-hud';
    statusBanner.style.position = 'fixed';
    statusBanner.style.top = '20px';
    statusBanner.style.left = '50%';
    statusBanner.style.transform = 'translateX(-50%)';
    statusBanner.style.zIndex = '9999999';
    statusBanner.style.backgroundColor = 'rgba(11, 15, 23, 0.92)';
    statusBanner.style.backdropFilter = 'blur(16px)';
    statusBanner.style.border = '1px solid rgba(56, 189, 248, 0.5)';
    statusBanner.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.7), 0 0 15px rgba(56, 189, 248, 0.25)';
    statusBanner.style.borderRadius = '9999px';
    statusBanner.style.padding = '8px 20px';
    statusBanner.style.color = '#FFFFFF';
    statusBanner.style.fontSize = '12px';
    statusBanner.style.fontWeight = '700';
    statusBanner.style.fontFamily = 'system-ui, -apple-system, sans-serif';
    statusBanner.style.display = 'flex';
    statusBanner.style.alignItems = 'center';
    statusBanner.style.gap = '10px';
    statusBanner.style.pointerEvents = 'none';
    statusBanner.style.transition = 'all 0.2s ease-in-out';
    document.body.appendChild(statusBanner);
  }

  statusBanner.innerHTML = `
    <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background-color:#10B981;box-shadow:0 0 8px #10B981;"></span>
    <span style="color:#38BDF8;font-family:monospace;font-size:11px;">[AGENT ACTIVE]</span>
    <span>${text}</span>
  `;
  statusBanner.style.display = 'flex';
}

function hideOnPageStatus() {
  if (statusBanner) {
    statusBanner.style.display = 'none';
  }
}

// Listen for messages from background script
chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if (request.type === 'GET_SANITIZED_STATE') {
    const rawElements = extractor.extractInteractiveDOM(document);
    const { sanitizedElements, detectedEntities } = piiEngine.detectAndSanitizeElements(rawElements);

    sendResponse({
      success: true,
      url: window.location.href,
      title: document.title,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
      elements: sanitizedElements,
      activeTokens: piiEngine.getTokenRegistry().getActiveTokens().map((t) => t.token),
      detectedEntitiesCount: detectedEntities.length,
      timestamp: Date.now(),
    });
    return true;
  }

  if (request.type === 'EXECUTE_ACTION') {
    const action: AgentAction = request.action;

    // Show live HUD banner on the page
    const thoughtText = action.thought || `${action.action} on page`;
    showOnPageStatus(thoughtText, action.action);

    // Highlight target element if present
    if ('elementId' in action) {
      const target = document.querySelector(`[data-privacy-agent-id="${action.elementId}"]`);
      if (target instanceof HTMLElement) {
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const rect = target.getBoundingClientRect();
        const overlay = createOrGetOverlay();
        overlay.style.top = `${rect.top}px`;
        overlay.style.left = `${rect.left}px`;
        overlay.style.width = `${rect.width}px`;
        overlay.style.height = `${rect.height}px`;
        overlay.style.display = 'block';
      }
    }

    executor.executeAction(action, document).then((result) => {
      if (action.action === 'FINISH_TASK') {
        showOnPageStatus('✓ Task Completed Successfully (0 Leaks)', 'DONE');
        setTimeout(() => {
          hideOnPageStatus();
          if (highlightOverlay) highlightOverlay.style.display = 'none';
        }, 3000);
      }
      sendResponse(result);
    });
    return true;
  }

  if (request.type === 'CLEAR_HIGHLIGHTS') {
    if (highlightOverlay) {
      highlightOverlay.style.display = 'none';
    }
    hideOnPageStatus();
    sendResponse({ success: true });
    return true;
  }
});
