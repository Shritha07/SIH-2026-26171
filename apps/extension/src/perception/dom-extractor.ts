import type { BoundingBox } from '@privacy-agent/shared-types';

export interface RawExtractedElement {
  id: number;
  tag: string;
  type?: string;
  name?: string;
  placeholder?: string;
  label?: string;
  value?: string;
  text?: string;
  role?: string;
  isInteractive: boolean;
  bbox: BoundingBox;
  attributes: Record<string, string>;
}

export class DOMPerceptionExtractor {
  private elementIdCounter = 1;

  public extractInteractiveDOM(root: Document = document): RawExtractedElement[] {
    this.elementIdCounter = 1;
    const extracted: RawExtractedElement[] = [];

    // Clear old data attributes
    root.querySelectorAll('[data-privacy-agent-id]').forEach((el) => {
      el.removeAttribute('data-privacy-agent-id');
    });

    // 1. Primary interactive selector (prioritized first)
    const primarySelector = 'button, input, textarea, select, a[href], [role="button"], [role="checkbox"], [role="radio"], [role="tab"], [role="option"], [tabindex]:not([tabindex="-1"]), [data-testid]';
    const primaryNodes = Array.from(root.querySelectorAll<HTMLElement>(primarySelector));

    // 2. Secondary content selector (headings, labels)
    const secondarySelector = 'h1, h2, h3, h4, label, [role="heading"]';
    const secondaryNodes = Array.from(root.querySelectorAll<HTMLElement>(secondarySelector));

    // Combined with interactive elements guaranteed to be at the top of the list
    const combinedNodes = Array.from(new Set([...primaryNodes, ...secondaryNodes]));

    const viewportWidth = window.innerWidth || 1280;
    const viewportHeight = window.innerHeight || 800;

    for (const node of combinedNodes) {
      if (!(node instanceof HTMLElement)) continue;

      // Check visibility
      const style = window.getComputedStyle(node);
      if (
        style.display === 'none' ||
        style.visibility === 'hidden' ||
        style.opacity === '0' ||
        node.hasAttribute('hidden')
      ) {
        continue;
      }

      const rect = node.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) continue;

      const isInteractive =
        ['BUTTON', 'INPUT', 'TEXTAREA', 'SELECT', 'A'].includes(node.tagName) ||
        node.hasAttribute('role') ||
        node.onclick !== null ||
        node.hasAttribute('data-testid') ||
        node.hasAttribute('tabindex');

      const tag = node.tagName.toLowerCase();
      const inputType = node instanceof HTMLInputElement ? node.type : undefined;
      const inputValue =
        node instanceof HTMLInputElement || node instanceof HTMLTextAreaElement || node instanceof HTMLSelectElement
          ? node.value
          : undefined;

      const ariaLabel = node.getAttribute('aria-label') || '';
      const placeholder = node.getAttribute('placeholder') || '';
      const name = node.getAttribute('name') || node.id || '';
      const rawText = (node.innerText || node.textContent || '').trim().slice(0, 100);

      const attributes: Record<string, string> = {};
      for (let i = 0; i < node.attributes.length; i++) {
        const attr = node.attributes[i];
        if (['id', 'name', 'class', 'role', 'type', 'autocomplete', 'href', 'title', 'data-testid'].includes(attr.name)) {
          attributes[attr.name] = attr.value;
        }
      }

      // Assign numeric agent ID
      const currentId = this.elementIdCounter++;
      node.setAttribute('data-privacy-agent-id', String(currentId));

      extracted.push({
        id: currentId,
        tag,
        type: inputType,
        name,
        placeholder,
        label: ariaLabel || placeholder || rawText || name,
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
