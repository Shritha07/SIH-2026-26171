export class DOMPerceptionExtractor {
    elementIdCounter = 1;
    extractInteractiveDOM(root = document) {
        this.elementIdCounter = 1;
        const extracted = [];
        // Query interactive and content nodes
        const selector = 'button, input, textarea, select, a[href], [role="button"], [role="link"], [role="checkbox"], [role="radio"], [role="tab"], [role="option"], [tabindex]:not([tabindex="-1"]), p, h1, h2, h3, h4, h5, h6, span, label, td, th, li';
        const nodes = Array.from(root.querySelectorAll(selector));
        const viewportWidth = window.innerWidth || 1280;
        const viewportHeight = window.innerHeight || 800;
        for (const node of nodes) {
            if (!(node instanceof HTMLElement))
                continue;
            // Check visibility
            const style = window.getComputedStyle(node);
            if (style.display === 'none' ||
                style.visibility === 'hidden' ||
                style.opacity === '0' ||
                node.hasAttribute('hidden')) {
                continue;
            }
            const rect = node.getBoundingClientRect();
            // Skip offscreen or 0-area elements
            if (rect.width <= 0 || rect.height <= 0)
                continue;
            if (rect.bottom < 0 || rect.top > viewportHeight || rect.right < 0 || rect.left > viewportWidth) {
                continue;
            }
            const isInteractive = ['BUTTON', 'INPUT', 'TEXTAREA', 'SELECT', 'A'].includes(node.tagName) ||
                node.hasAttribute('role') ||
                node.onclick !== null ||
                node.hasAttribute('tabindex');
            const tag = node.tagName.toLowerCase();
            const inputType = node instanceof HTMLInputElement ? node.type : undefined;
            const inputValue = node instanceof HTMLInputElement || node instanceof HTMLTextAreaElement || node instanceof HTMLSelectElement
                ? node.value
                : undefined;
            // Compute accessible label / text
            const ariaLabel = node.getAttribute('aria-label') || '';
            const placeholder = node.getAttribute('placeholder') || '';
            const name = node.getAttribute('name') || node.id || '';
            const rawText = (node.innerText || node.textContent || '').trim().slice(0, 150);
            // Collect all key attributes
            const attributes = {};
            for (let i = 0; i < node.attributes.length; i++) {
                const attr = node.attributes[i];
                if (['id', 'name', 'class', 'role', 'type', 'autocomplete', 'href', 'title', 'data-testid'].includes(attr.name)) {
                    attributes[attr.name] = attr.value;
                }
            }
            // Assign ephemeral numeric data attribute for browser action execution
            const currentId = this.elementIdCounter++;
            node.setAttribute('data-privacy-agent-id', String(currentId));
            extracted.push({
                id: currentId,
                tag,
                type: inputType,
                name,
                placeholder,
                label: ariaLabel || rawText || placeholder || name,
                value: inputValue,
                text: rawText,
                role: attributes.role,
                isInteractive,
                bbox: {
                    x: Math.round(rect.left),
                    y: Math.round(rect.top),
                    width: Math.round(rect.width),
                    height: Math.round(rect.height),
                },
                attributes,
            });
        }
        return extracted;
    }
}
//# sourceMappingURL=dom-extractor.js.map