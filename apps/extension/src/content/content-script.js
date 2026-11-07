import { DOMPerceptionExtractor } from '../perception/dom-extractor';
import { PIIDetectionEngine } from '@privacy-agent/privacy-core';
import { BrowserActionExecutor } from '../actions/action-executor';
const extractor = new DOMPerceptionExtractor();
const piiEngine = new PIIDetectionEngine();
const executor = new BrowserActionExecutor(piiEngine.getTokenRegistry());
let highlightOverlay = null;
function createOrGetOverlay() {
    if (!highlightOverlay) {
        highlightOverlay = document.createElement('div');
        highlightOverlay.id = 'privacy-agent-highlight-overlay';
        highlightOverlay.style.position = 'fixed';
        highlightOverlay.style.pointerEvents = 'none';
        highlightOverlay.style.zIndex = '999999';
        highlightOverlay.style.border = '2px solid #0284C7';
        highlightOverlay.style.backgroundColor = 'rgba(2, 132, 199, 0.15)';
        highlightOverlay.style.borderRadius = '4px';
        highlightOverlay.style.transition = 'all 0.2s ease-in-out';
        highlightOverlay.style.display = 'none';
        document.body.appendChild(highlightOverlay);
    }
    return highlightOverlay;
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
        const action = request.action;
        // Highlight target element if present
        if ('elementId' in action) {
            const target = document.querySelector(`[data-privacy-agent-id="${action.elementId}"]`);
            if (target instanceof HTMLElement) {
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
            sendResponse(result);
        });
        return true;
    }
    if (request.type === 'CLEAR_HIGHLIGHTS') {
        if (highlightOverlay) {
            highlightOverlay.style.display = 'none';
        }
        sendResponse({ success: true });
        return true;
    }
});
//# sourceMappingURL=content-script.js.map