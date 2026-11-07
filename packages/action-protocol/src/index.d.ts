import { z } from 'zod';
import type { AgentAction } from '@privacy-agent/shared-types';
export declare const PROHIBITED_ACTIONS: readonly ["GET_SECRET", "READ_SECRET", "RETURN_SECRET", "DUMP_VAULT", "GET_VAULT", "READ_VAULT", "EXPORT_COOKIES", "EVAL_SCRIPT", "EXECUTE_RAW_JS"];
export declare const NavigateActionSchema: z.ZodObject<{
    action: z.ZodLiteral<"NAVIGATE">;
    url: z.ZodString;
    thought: z.ZodDefault<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    action: "NAVIGATE";
    url: string;
    thought: string;
}, {
    action: "NAVIGATE";
    url: string;
    thought?: string | undefined;
}>;
export declare const ClickActionSchema: z.ZodObject<{
    action: z.ZodLiteral<"CLICK">;
    elementId: z.ZodNumber;
    thought: z.ZodDefault<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    action: "CLICK";
    thought: string;
    elementId: number;
}, {
    action: "CLICK";
    elementId: number;
    thought?: string | undefined;
}>;
export declare const TypeActionSchema: z.ZodObject<{
    action: z.ZodLiteral<"TYPE">;
    elementId: z.ZodNumber;
    text: z.ZodString;
    pressEnter: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    thought: z.ZodDefault<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    action: "TYPE";
    thought: string;
    elementId: number;
    text: string;
    pressEnter: boolean;
}, {
    action: "TYPE";
    elementId: number;
    text: string;
    thought?: string | undefined;
    pressEnter?: boolean | undefined;
}>;
export declare const FillFieldActionSchema: z.ZodObject<{
    action: z.ZodLiteral<"FILL_FIELD">;
    elementId: z.ZodNumber;
    value_ref: z.ZodString;
    thought: z.ZodDefault<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    action: "FILL_FIELD";
    thought: string;
    elementId: number;
    value_ref: string;
}, {
    action: "FILL_FIELD";
    elementId: number;
    value_ref: string;
    thought?: string | undefined;
}>;
export declare const SelectActionSchema: z.ZodObject<{
    action: z.ZodLiteral<"SELECT">;
    elementId: z.ZodNumber;
    value: z.ZodString;
    thought: z.ZodDefault<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    action: "SELECT";
    value: string;
    thought: string;
    elementId: number;
}, {
    action: "SELECT";
    value: string;
    elementId: number;
    thought?: string | undefined;
}>;
export declare const ScrollActionSchema: z.ZodObject<{
    action: z.ZodLiteral<"SCROLL">;
    direction: z.ZodDefault<z.ZodEnum<["up", "down"]>>;
    amount: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    thought: z.ZodDefault<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    action: "SCROLL";
    thought: string;
    direction: "up" | "down";
    amount: number;
}, {
    action: "SCROLL";
    thought?: string | undefined;
    direction?: "up" | "down" | undefined;
    amount?: number | undefined;
}>;
export declare const WaitActionSchema: z.ZodObject<{
    action: z.ZodLiteral<"WAIT">;
    durationMs: z.ZodDefault<z.ZodNumber>;
    thought: z.ZodDefault<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    action: "WAIT";
    thought: string;
    durationMs: number;
}, {
    action: "WAIT";
    thought?: string | undefined;
    durationMs?: number | undefined;
}>;
export declare const FinishTaskActionSchema: z.ZodObject<{
    action: z.ZodLiteral<"FINISH_TASK">;
    success: z.ZodBoolean;
    summary: z.ZodString;
    thought: z.ZodDefault<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    action: "FINISH_TASK";
    thought: string;
    success: boolean;
    summary: string;
}, {
    action: "FINISH_TASK";
    success: boolean;
    summary: string;
    thought?: string | undefined;
}>;
export declare const AgentActionSchema: z.ZodDiscriminatedUnion<"action", [z.ZodObject<{
    action: z.ZodLiteral<"NAVIGATE">;
    url: z.ZodString;
    thought: z.ZodDefault<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    action: "NAVIGATE";
    url: string;
    thought: string;
}, {
    action: "NAVIGATE";
    url: string;
    thought?: string | undefined;
}>, z.ZodObject<{
    action: z.ZodLiteral<"CLICK">;
    elementId: z.ZodNumber;
    thought: z.ZodDefault<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    action: "CLICK";
    thought: string;
    elementId: number;
}, {
    action: "CLICK";
    elementId: number;
    thought?: string | undefined;
}>, z.ZodObject<{
    action: z.ZodLiteral<"TYPE">;
    elementId: z.ZodNumber;
    text: z.ZodString;
    pressEnter: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    thought: z.ZodDefault<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    action: "TYPE";
    thought: string;
    elementId: number;
    text: string;
    pressEnter: boolean;
}, {
    action: "TYPE";
    elementId: number;
    text: string;
    thought?: string | undefined;
    pressEnter?: boolean | undefined;
}>, z.ZodObject<{
    action: z.ZodLiteral<"FILL_FIELD">;
    elementId: z.ZodNumber;
    value_ref: z.ZodString;
    thought: z.ZodDefault<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    action: "FILL_FIELD";
    thought: string;
    elementId: number;
    value_ref: string;
}, {
    action: "FILL_FIELD";
    elementId: number;
    value_ref: string;
    thought?: string | undefined;
}>, z.ZodObject<{
    action: z.ZodLiteral<"SELECT">;
    elementId: z.ZodNumber;
    value: z.ZodString;
    thought: z.ZodDefault<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    action: "SELECT";
    value: string;
    thought: string;
    elementId: number;
}, {
    action: "SELECT";
    value: string;
    elementId: number;
    thought?: string | undefined;
}>, z.ZodObject<{
    action: z.ZodLiteral<"SCROLL">;
    direction: z.ZodDefault<z.ZodEnum<["up", "down"]>>;
    amount: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    thought: z.ZodDefault<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    action: "SCROLL";
    thought: string;
    direction: "up" | "down";
    amount: number;
}, {
    action: "SCROLL";
    thought?: string | undefined;
    direction?: "up" | "down" | undefined;
    amount?: number | undefined;
}>, z.ZodObject<{
    action: z.ZodLiteral<"WAIT">;
    durationMs: z.ZodDefault<z.ZodNumber>;
    thought: z.ZodDefault<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    action: "WAIT";
    thought: string;
    durationMs: number;
}, {
    action: "WAIT";
    thought?: string | undefined;
    durationMs?: number | undefined;
}>, z.ZodObject<{
    action: z.ZodLiteral<"FINISH_TASK">;
    success: z.ZodBoolean;
    summary: z.ZodString;
    thought: z.ZodDefault<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    action: "FINISH_TASK";
    thought: string;
    success: boolean;
    summary: string;
}, {
    action: "FINISH_TASK";
    success: boolean;
    summary: string;
    thought?: string | undefined;
}>]>;
export interface ValidationResult {
    valid: boolean;
    action?: AgentAction;
    error?: string;
    errorCode?: 'CAPABILITY_NOT_PERMITTED' | 'INVALID_ACTION_SCHEMA';
}
/**
 * Validates an action object received from the cloud model.
 * Enforces fail-closed security and schema adherence.
 */
export declare function validateAgentAction(raw: unknown): ValidationResult;
/**
 * Robust extractor for JSON action payloads returned by Gemini LLM text outputs.
 */
export declare function extractActionFromModelResponse(text: string): ValidationResult;
//# sourceMappingURL=index.d.ts.map