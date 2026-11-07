export class BrowserActionExecutor {
    tokenRegistry;
    constructor(tokenRegistry) {
        this.tokenRegistry = tokenRegistry;
    }
    async executeAction(action, root = document) {
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
                        element.value = action.text;
                        element.dispatchEvent(new Event('input', { bubbles: true }));
                        element.dispatchEvent(new Event('change', { bubbles: true }));
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
                    // Resolve token locally
                    let resolvedValue = action.value_ref;
                    if (this.tokenRegistry.hasToken(action.value_ref)) {
                        const secret = this.tokenRegistry.resolveToken(action.value_ref);
                        if (!secret) {
                            return {
                                success: false,
                                action,
                                executionTimeMs: Math.round(performance.now() - startTime),
                                error: `Token '${action.value_ref}' could not be resolved from local vault`,
                                errorCode: 'UNKNOWN_VALUE_REFERENCE',
                            };
                        }
                        resolvedValue = secret;
                    }
                    if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
                        element.focus();
                        element.value = resolvedValue;
                        element.dispatchEvent(new Event('input', { bubbles: true }));
                        element.dispatchEvent(new Event('change', { bubbles: true }));
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
                    await new Promise((r) => setTimeout(r, action.durationMs));
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
        }
        catch (err) {
            return {
                success: false,
                action,
                executionTimeMs: Math.round(performance.now() - startTime),
                error: `Action execution error: ${err?.message || err}`,
                errorCode: 'ACTION_EXECUTION_FAILED',
            };
        }
    }
    findElement(id, root) {
        // Search by data-privacy-agent-id
        const target = root.querySelector(`[data-privacy-agent-id="${id}"]`);
        if (target instanceof HTMLElement)
            return target;
        // Fallback: search by id attribute if numeric
        const byId = root.getElementById(String(id));
        if (byId instanceof HTMLElement)
            return byId;
        return null;
    }
    simulateClick(element) {
        element.focus();
        element.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true, view: window }));
        element.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true, view: window }));
        element.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
    }
}
//# sourceMappingURL=action-executor.js.map