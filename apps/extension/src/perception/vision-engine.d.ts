import type { BoundingBox } from '@privacy-agent/shared-types';
export interface VisionModelPerformanceMetrics {
    backend: 'webgpu' | 'wasm' | 'cpu';
    initializationLatencyMs: number;
    lastInferenceLatencyMs: number;
    memoryEstimateMb: number;
    isReady: boolean;
}
export declare class OnDeviceVisionEngine {
    private isInitialized;
    private backendType;
    private initLatencyMs;
    private lastInferenceLatencyMs;
    initialize(): Promise<VisionModelPerformanceMetrics>;
    /**
     * Performs on-device visual element detection and visual patch classification over screenshot canvas.
     */
    analyzeVisualRegions(canvas: HTMLCanvasElement | OffscreenCanvas): Promise<{
        detectedVisualElements: Array<{
            label: string;
            confidence: number;
            bbox: BoundingBox;
        }>;
        inferenceTimeMs: number;
    }>;
    getMetrics(): VisionModelPerformanceMetrics;
}
//# sourceMappingURL=vision-engine.d.ts.map