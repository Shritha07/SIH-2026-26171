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
export declare class DOMPerceptionExtractor {
    private elementIdCounter;
    extractInteractiveDOM(root?: Document): RawExtractedElement[];
}
//# sourceMappingURL=dom-extractor.d.ts.map