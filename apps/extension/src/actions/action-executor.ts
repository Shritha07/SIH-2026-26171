import type { AgentAction, ExecutionResult } from '@privacy-agent/shared-types';
import type { LocalTokenRegistry } from '@privacy-agent/privacy-core';

export class BrowserActionExecutor {
  private tokenRegistry: LocalTokenRegistry;

  constructor(tokenRegistry: LocalTokenRegistry) {
    this.tokenRegistry = tokenRegistry;
  }

  public async executeAction(action: AgentAction, root: Document = document): Promise<ExecutionResult> {
    const startTime = performance.now();

    try {
      switch (action.action) {
        case 'NAVIGATE': {
          if (typeof window !== 'undefined') {
            window.location.href = action.url;
          }
          return {
            success: true,
            action,
            executionTimeMs: Math.round(performance.now() - startTime),
          };
        }

        case 'CLICK': {
          const element = this.findElement(action.elementId, root);
          if (!element) {
            return {
              success: false,
              action,
              executionTimeMs: Math.round(performance.now() - startTime),
              error: `Target element #${action.elementId} not found in current DOM`,
              errorCode: 'TARGET_NOT_FOUND',
            };
          }

          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          this.simulateClick(element);

          return {
            success: true,
            action,
            executionTimeMs: Math.round(performance.now() - startTime),
          };
        }

        case 'TYPE': {
          const element = this.findElement(action.elementId, root);
          if (!element) {
            return {
              success: false,
              action,
              executionTimeMs: Math.round(performance.now() - startTime),
              error: `Target element #${action.elementId} not found`,
              errorCode: 'TARGET_NOT_FOUND',
            };
          }

          if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
            element.focus();
            this.setNativeValue(element, action.text);

            if (action.pressEnter) {
              element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', keyCode: 13, bubbles: true }));
              element.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter', code: 'Enter', keyCode: 13, bubbles: true }));
              if (element.form) {
                element.form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
              }
            }
          }

          return {
            success: true,
            action,
            executionTimeMs: Math.round(performance.now() - startTime),
          };
        }

        case 'FILL_FIELD': {
          const element = this.findElement(action.elementId, root);
          if (!element) {
            return {
              success: false,
              action,
              executionTimeMs: Math.round(performance.now() - startTime),
              error: `Target element #${action.elementId} not found`,
              errorCode: 'TARGET_NOT_FOUND',
            };
          }

          // Resolve token locally from vault
          let resolvedValue = action.value_ref;
          if (this.tokenRegistry.hasToken(action.value_ref)) {
            const secret = this.tokenRegistry.resolveToken(action.value_ref);
            if (secret) {
              resolvedValue = secret;
            }
          } else {
            // Built-in synthetic fallback mappings
            if (action.value_ref === 'EMAIL_001') resolvedValue = 'harish.kumar@example.com';
            else if (action.value_ref === 'PHONE_001') resolvedValue = '+91 9876543210';
            else if (action.value_ref === 'ADDRESS_001') resolvedValue = '42, Silicon Residency, Bengaluru KA 560034';
            else if (action.value_ref === 'DOB_001') resolvedValue = '1996-03-22';
            else if (action.value_ref === 'GOV_ID_001') resolvedValue = 'Z8942105';
            else if (action.value_ref === 'PERSON_001') resolvedValue = 'Harish Kumar';
          }

          if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
            element.focus();
            this.setNativeValue(element, resolvedValue);
            element.dispatchEvent(new Event('blur', { bubbles: true }));
          }

          return {
            success: true,
            action,
            executionTimeMs: Math.round(performance.now() - startTime),
          };
        }

        case 'SELECT': {
          const element = this.findElement(action.elementId, root);
          if (!element || !(element instanceof HTMLSelectElement)) {
            return {
              success: false,
              action,
              executionTimeMs: Math.round(performance.now() - startTime),
              error: `Target select element #${action.elementId} not found`,
              errorCode: 'TARGET_NOT_FOUND',
            };
          }

          element.value = action.value;
          element.dispatchEvent(new Event('change', { bubbles: true }));

          return {
            success: true,
            action,
            executionTimeMs: Math.round(performance.now() - startTime),
          };
        }

        case 'SCROLL': {
          const amount = action.amount || 400;
          const top = action.direction === 'down' ? amount : -amount;
          if (typeof window !== 'undefined') {
            window.scrollBy({ top, behavior: 'smooth' });
          }

          return {
            success: true,
            action,
            executionTimeMs: Math.round(performance.now() - startTime),
          };
        }

        case 'WAIT': {
          await new Promise((r) => setTimeout(r, action.durationMs || 1000));
          return {
            success: true,
            action,
            executionTimeMs: Math.round(performance.now() - startTime),
          };
        }

        case 'FINISH_TASK': {
          return {
            success: true,
            action,
            executionTimeMs: Math.round(performance.now() - startTime),
          };
        }

        default: {
          return {
            success: false,
            action,
            executionTimeMs: Math.round(performance.now() - startTime),
            error: `Unsupported action type`,
            errorCode: 'CAPABILITY_NOT_PERMITTED',
          };
        }
      }
    } catch (err: any) {
      return {
        success: false,
        action,
        executionTimeMs: Math.round(performance.now() - startTime),
        error: `Action execution error: ${err?.message || err}`,
        errorCode: 'ACTION_EXECUTION_FAILED',
      };
    }
  }

  private setNativeValue(element: HTMLInputElement | HTMLTextAreaElement, value: string): void {
    const proto = element instanceof HTMLInputElement ? HTMLInputElement.prototype : HTMLTextAreaElement.prototype;
    const descriptor = Object.getOwnPropertyDescriptor(proto, 'value');

    if (descriptor && descriptor.set) {
      descriptor.set.call(element, value);
    } else {
      element.value = value;
    }

    element.dispatchEvent(new Event('input', { bubbles: true }));
    element.dispatchEvent(new Event('change', { bubbles: true }));
  }

  private findElement(id: number, root: Document): HTMLElement | null {
    // 1. Search by data-privacy-agent-id attribute assigned during extraction
    const target = root.querySelector(`[data-privacy-agent-id="${id}"]`);
    if (target instanceof HTMLElement) return target;

    // 2. Search by id attribute
    const byId = root.getElementById(String(id));
    if (byId instanceof HTMLElement) return byId;

    // 3. Fallback: index search in interactive elements
    const interactables = Array.from(
      root.querySelectorAll<HTMLElement>('input, button, select, textarea, [role="button"], a[href]')
    ).filter((el) => {
      const rect = el.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0 && window.getComputedStyle(el).display !== 'none';
    });

    if (interactables[id - 1]) {
      return interactables[id - 1];
    }

    return null;
  }

  private simulateClick(element: HTMLElement): void {
    element.focus();
    element.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true, view: window }));
    element.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true, view: window }));
    element.click();
    element.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
  }
}
