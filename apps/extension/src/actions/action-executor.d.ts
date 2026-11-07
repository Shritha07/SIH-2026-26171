import type { AgentAction, ExecutionResult } from '@privacy-agent/shared-types';
import type { LocalTokenRegistry } from '@privacy-agent/privacy-core';
export declare class BrowserActionExecutor {
    private tokenRegistry;
    constructor(tokenRegistry: LocalTokenRegistry);
    executeAction(action: AgentAction, root?: Document): Promise<ExecutionResult>;
    private findElement;
    private simulateClick;
}
//# sourceMappingURL=action-executor.d.ts.map