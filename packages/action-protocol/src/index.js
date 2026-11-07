import { z } from 'zod';
export const PROHIBITED_ACTIONS = [
    'GET_SECRET',
    'READ_SECRET',
    'RETURN_SECRET',
    'DUMP_VAULT',
    'GET_VAULT',
    'READ_VAULT',
    'EXPORT_COOKIES',
    'EVAL_SCRIPT',
    'EXECUTE_RAW_JS',
];
export const NavigateActionSchema = z.object({
    action: z.literal('NAVIGATE'),
    url: z.string().url(),
    thought: z.string().default('Navigating to URL'),
});
export const ClickActionSchema = z.object({
    action: z.literal('CLICK'),
    elementId: z.number().int().nonnegative(),
    thought: z.string().default('Clicking element'),
});
export const TypeActionSchema = z.object({
    action: z.literal('TYPE'),
    elementId: z.number().int().nonnegative(),
    text: z.string(),
    pressEnter: z.boolean().optional().default(false),
    thought: z.string().default('Typing text'),
});
export const FillFieldActionSchema = z.object({
    action: z.literal('FILL_FIELD'),
    elementId: z.number().int().nonnegative(),
    value_ref: z.string().min(1),
    thought: z.string().default('Filling form field with value reference'),
});
export const SelectActionSchema = z.object({
    action: z.literal('SELECT'),
    elementId: z.number().int().nonnegative(),
    value: z.string(),
    thought: z.string().default('Selecting option'),
});
export const ScrollActionSchema = z.object({
    action: z.literal('SCROLL'),
    direction: z.enum(['up', 'down']).default('down'),
    amount: z.number().positive().optional().default(400),
    thought: z.string().default('Scrolling page'),
});
export const WaitActionSchema = z.object({
    action: z.literal('WAIT'),
    durationMs: z.number().int().positive().max(10000).default(1000),
    thought: z.string().default('Waiting for page state to settle'),
});
export const FinishTaskActionSchema = z.object({
    action: z.literal('FINISH_TASK'),
    success: z.boolean(),
    summary: z.string(),
    thought: z.string().default('Task completed'),
});
export const AgentActionSchema = z.discriminatedUnion('action', [
    NavigateActionSchema,
    ClickActionSchema,
    TypeActionSchema,
    FillFieldActionSchema,
    SelectActionSchema,
    ScrollActionSchema,
    WaitActionSchema,
    FinishTaskActionSchema,
]);
/**
 * Validates an action object received from the cloud model.
 * Enforces fail-closed security and schema adherence.
 */
export function validateAgentAction(raw) {
    if (!raw || typeof raw !== 'object') {
        return {
            valid: false,
            error: 'Action payload must be a non-null JSON object',
            errorCode: 'INVALID_ACTION_SCHEMA',
        };
    }
    const obj = raw;
    const actionName = String(obj.action || '').toUpperCase();
    // Check prohibited action names
    if (PROHIBITED_ACTIONS.includes(actionName)) {
        return {
            valid: false,
            error: `Security Violation: Action '${actionName}' is prohibited. Cloud agents cannot read raw secrets.`,
            errorCode: 'CAPABILITY_NOT_PERMITTED',
        };
    }
    const parseResult = AgentActionSchema.safeParse(raw);
    if (!parseResult.success) {
        return {
            valid: false,
            error: `Invalid action schema: ${parseResult.error.message}`,
            errorCode: 'INVALID_ACTION_SCHEMA',
        };
    }
    return {
        valid: true,
        action: parseResult.data,
    };
}
/**
 * Robust extractor for JSON action payloads returned by Gemini LLM text outputs.
 */
export function extractActionFromModelResponse(text) {
    try {
        // 1. Check if direct JSON string
        const trimmed = text.trim();
        if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
            const parsed = JSON.parse(trimmed);
            return validateAgentAction(parsed);
        }
        // 2. Extract from markdown ```json ... ``` blocks
        const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
        if (jsonMatch && jsonMatch[1]) {
            const parsed = JSON.parse(jsonMatch[1].trim());
            return validateAgentAction(parsed);
        }
        // 3. Find first outer JSON object {...}
        const firstBrace = text.indexOf('{');
        const lastBrace = text.lastIndexOf('}');
        if (firstBrace !== -1 && lastBrace > firstBrace) {
            const parsed = JSON.parse(text.slice(firstBrace, lastBrace + 1));
            return validateAgentAction(parsed);
        }
        return {
            valid: false,
            error: 'Could not extract JSON action from model output',
            errorCode: 'INVALID_ACTION_SCHEMA',
        };
    }
    catch (err) {
        return {
            valid: false,
            error: `Failed to parse action JSON: ${err?.message || err}`,
            errorCode: 'INVALID_ACTION_SCHEMA',
        };
    }
}
//# sourceMappingURL=index.js.map