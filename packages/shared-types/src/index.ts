export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type PIICategory =
  | 'PERSON'
  | 'EMAIL'
  | 'PHONE'
  | 'ADDRESS'
  | 'DOB'
  | 'GOV_ID'
  | 'FINANCIAL'
  | 'SECRET';

export interface PIIEntity {
  id: string;
  category: PIICategory;
  rawValue: string;
  token: string;
  bbox?: BoundingBox;
  confidence: number;
  detectionSource: 'DOM_SEMANTICS' | 'REGEX' | 'OCR' | 'VISION_MODEL' | 'VAULT_MATCH';
  elementId?: number;
}

export interface PrivacyToken {
  token: string;
  category: PIICategory;
  label: string;
  createdAt: number;
}

export interface SanitizedDOMElement {
  id: number;
  tag: string;
  role?: string;
  type?: string;
  name?: string;
  label: string;
  placeholder?: string;
  value?: string;
  isMasked: boolean;
  tokenRef?: string;
  bbox: BoundingBox;
  isInteractive: boolean;
  attributes?: Record<string, string>;
}

export interface SanitizedBrowserState {
  url: string;
  title: string;
  viewport: {
    width: number;
    height: number;
  };
  elements: SanitizedDOMElement[];
  redactedScreenshotBase64?: string;
  activeTokens: string[];
  timestamp: number;
}

export type ActionType =
  | 'NAVIGATE'
  | 'CLICK'
  | 'TYPE'
  | 'FILL_FIELD'
  | 'SELECT'
  | 'SCROLL'
  | 'WAIT'
  | 'FINISH_TASK';

export interface BaseAction {
  action: ActionType;
  thought: string;
}

export interface NavigateAction extends BaseAction {
  action: 'NAVIGATE';
  url: string;
}

export interface ClickAction extends BaseAction {
  action: 'CLICK';
  elementId: number;
}

export interface TypeAction extends BaseAction {
  action: 'TYPE';
  elementId: number;
  text: string;
  pressEnter?: boolean;
}

export interface FillFieldAction extends BaseAction {
  action: 'FILL_FIELD';
  elementId: number;
  value_ref: string; // Token reference e.g. "EMAIL_001" or plain text if not a token
}

export interface SelectAction extends BaseAction {
  action: 'SELECT';
  elementId: number;
  value: string;
}

export interface ScrollAction extends BaseAction {
  action: 'SCROLL';
  direction: 'up' | 'down';
  amount?: number;
}

export interface WaitAction extends BaseAction {
  action: 'WAIT';
  durationMs: number;
}

export interface FinishTaskAction extends BaseAction {
  action: 'FINISH_TASK';
  success: boolean;
  summary: string;
}

export type AgentAction =
  | NavigateAction
  | ClickAction
  | TypeAction
  | FillFieldAction
  | SelectAction
  | ScrollAction
  | WaitAction
  | FinishTaskAction;

export interface ExecutionResult {
  success: boolean;
  action: AgentAction;
  executionTimeMs: number;
  error?: string;
  errorCode?:
    | 'CAPABILITY_NOT_PERMITTED'
    | 'UNKNOWN_VALUE_REFERENCE'
    | 'TARGET_NOT_FOUND'
    | 'SECURITY_POLICY_VIOLATION'
    | 'ACTION_EXECUTION_FAILED';
}

export interface VaultProfile {
  id: string;
  profileName: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  dob?: string;
  passportNumber?: string;
  nationalId?: string;
  gpa?: string;
  resumeFileName?: string;
  customFields?: Record<string, string>;
}

export type TelemetryComponent = 'agent' | 'privacy' | 'network' | 'executor' | 'vault';

export interface TelemetryEvent {
  id: string;
  timestamp: number;
  component: TelemetryComponent;
  event: string;
  data: Record<string, any>;
  level: 'info' | 'warn' | 'error' | 'security';
}

export interface BenchmarkMetrics {
  visualContextAccuracy: number; // 0 - 100%
  piiPrecision: number;          // 0 - 100%
  piiRecall: number;             // 0 - 100%
  redactionPrecision: number;    // 0 - 100%
  redactionSafetyRate: number;   // 100% (zero raw leaks)
  averageInferenceLatencyMs: number;
  averagePerceptionLatencyMs: number;
  averageRedactionLatencyMs: number;
  averageE2ELatencyMs: number;
  memoryUsageMb: number;
  rawPiiLeaksObserved: number;   // Expected: 0
  testedSamplesCount: number;
}
