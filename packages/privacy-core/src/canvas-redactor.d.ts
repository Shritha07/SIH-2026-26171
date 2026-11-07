import type { BoundingBox, PIIEntity } from '@privacy-agent/shared-types';
export interface RedactionResult {
    maskedCount: number;
    totalSensitivePixels: number;
    totalMaskedPixels: number;
    redactionPrecision: number;
    safetyScore: number;
}
export declare class CanvasRedactionEngine {
    private padding;
    /**
     * Applies solid block masking with token watermark onto an HTML Canvas 2D context.
     */
    redactCanvas(ctx: CanvasRenderingContext2D, entities: PIIEntity[]): RedactionResult;
    /**
     * Mathematical calculation of redaction coverage for headless/evaluation environments.
     */
    calculateRedactionMetrics(viewport: {
        width: number;
        height: number;
    }, sensitiveBoxes: BoundingBox[]): RedactionResult;
}
//# sourceMappingURL=canvas-redactor.d.ts.map