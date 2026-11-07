import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { ShieldCheck, Play, Square, ExternalLink, Sparkles, CheckCircle2, Lock, Zap } from 'lucide-react';

export const PopupApp: React.FC = () => {
  const [taskPrompt, setTaskPrompt] = useState(
    'Find an HP Victus with 16GB RAM under ₹80,000, choose the highest-rated option, add it to cart, and proceed to address.'
  );
  const [isRunning, setIsRunning] = useState(false);
  const [statusText, setStatusText] = useState('Idle - Ready');
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // 1. Initial status query
    chrome.runtime.sendMessage({ type: 'GET_TASK_STATUS' }, (res) => {
      if (res?.state?.isRunning) {
        setIsRunning(true);
        setCurrentStep(res.state.stepCount);
        setStatusText(`Running step ${res.state.stepCount}: ${res.state.currentAction || ''}`);
      }
    });

    // 2. Real-time background event listener
    const listener = (msg: any) => {
      if (msg.type === 'TASK_STATUS_UPDATE') {
        if (msg.status) setStatusText(msg.status);
        if (msg.state) {
          setIsRunning(msg.state.isRunning);
          setCurrentStep(msg.state.stepCount);
        }
      }
    };

    chrome.runtime.onMessage.addListener(listener);
    return () => chrome.runtime.onMessage.removeListener(listener);
  }, []);

  const handleStartTask = () => {
    setIsRunning(true);
    setStatusText('Initiating local perception & agent loop...');
    chrome.runtime.sendMessage({ type: 'START_TASK', prompt: taskPrompt });
  };

  const handleStopTask = () => {
    setIsRunning(false);
    setStatusText('Task stopped.');
    chrome.runtime.sendMessage({ type: 'STOP_TASK' });
  };

  const openDashboard = () => {
    chrome.tabs.create({ url: 'http://localhost:3000/dashboard' });
  };

  return (
    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', width: '340px', backgroundColor: '#0B0F17', color: '#F8FAFC', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ backgroundColor: '#0284C7', padding: '6px', borderRadius: '8px' }}>
            <ShieldCheck size={18} color="#FFFFFF" />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '13px', fontWeight: 700, color: '#F8FAFC' }}>ISRO Privacy Agent</h1>
            <p style={{ margin: 0, fontSize: '10px', color: '#94A3B8' }}>On-Device Perception Active</p>
          </div>
        </div>
        <span
          style={{
            fontSize: '9px',
            fontFamily: 'monospace',
            fontWeight: 700,
            padding: '3px 8px',
            borderRadius: '12px',
            backgroundColor: isRunning ? '#065F46' : '#1E293B',
            color: isRunning ? '#34D399' : '#94A3B8',
            border: `1px solid ${isRunning ? '#059669' : '#334155'}`,
          }}
        >
          {isRunning ? '● RUNNING' : 'IDLE'}
        </span>
      </div>

      {/* Privacy Guarantee Badge */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          backgroundColor: '#0F172A',
          border: '1px solid #1E293B',
          borderRadius: '8px',
          padding: '6px 8px',
          fontSize: '10px',
          color: '#38BDF8',
          fontFamily: 'monospace',
        }}
      >
        <Lock size={12} color="#38BDF8" />
        <span>0 Raw PII Leaks · Vault Protected</span>
      </div>

      {/* Task Input */}
      <div>
        <label style={{ fontSize: '11px', color: '#94A3B8', display: 'block', marginBottom: '4px', fontWeight: 600 }}>
          Autonomous Goal Prompt:
        </label>
        <textarea
          rows={3}
          value={taskPrompt}
          onChange={(e) => setTaskPrompt(e.target.value)}
          disabled={isRunning}
          placeholder="Enter goal for the agent..."
          style={{
            width: '100%',
            backgroundColor: '#161F30',
            border: '1px solid #334155',
            borderRadius: '8px',
            padding: '8px',
            color: '#F8FAFC',
            fontSize: '11px',
            boxSizing: 'border-box',
            resize: 'none',
            lineHeight: '1.4',
          }}
        />
      </div>

      {/* Preset Buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <span style={{ fontSize: '10px', color: '#64748B', fontWeight: 600 }}>Quick Demo Presets:</span>
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
          {[
            { label: '🛍️ Store', prompt: 'Find HP Victus 16GB under ₹80,000, add to cart, apply coupon ISRO2025, and checkout with local address' },
            { label: '💼 Jobs', prompt: 'Apply for Senior Full Stack Engineer (AI) using my saved profile and resume token' },
            { label: '✈️ Flights', prompt: 'Find BLR to DEL flight, select IndiGo, choose Economy Flexi tier, and complete passenger KYC' },
            { label: '🏥 Clinic', prompt: 'Book appointment with Dr. Arvind Nambiar (Cardiology) for 10:30 AM slot and complete intake' },
            { label: '🛡️ Insurance', prompt: 'Compare 1 Crore Platinum Health Shield plan, calculate 28yo quote, and submit KYC application' },
          ].map((preset) => (
            <button
              key={preset.label}
              onClick={() => setTaskPrompt(preset.prompt)}
              style={{
                fontSize: '10px',
                padding: '4px 7px',
                backgroundColor: '#161F30',
                color: '#CBD5E1',
                border: '1px solid #334155',
                borderRadius: '6px',
                cursor: 'pointer',
              }}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '8px' }}>
        {!isRunning ? (
          <button
            onClick={handleStartTask}
            style={{
              flex: 1,
              backgroundColor: '#0284C7',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              padding: '9px',
              fontSize: '12px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              cursor: 'pointer',
            }}
          >
            <Play size={14} /> Start Agent
          </button>
        ) : (
          <button
            onClick={handleStopTask}
            style={{
              flex: 1,
              backgroundColor: '#DC2626',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              padding: '9px',
              fontSize: '12px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              cursor: 'pointer',
            }}
          >
            <Square size={14} /> Stop Agent
          </button>
        )}

        <button
          onClick={openDashboard}
          title="Open Judge Observability Dashboard"
          style={{
            backgroundColor: '#1E293B',
            color: '#38BDF8',
            border: '1px solid #334155',
            borderRadius: '8px',
            padding: '9px 12px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '11px',
            fontWeight: 600,
          }}
        >
          <ExternalLink size={13} /> Dashboard
        </button>
      </div>

      {/* Status Log Box */}
      <div
        style={{
          fontSize: '10px',
          color: isRunning ? '#38BDF8' : '#94A3B8',
          backgroundColor: '#070B12',
          border: '1px solid #1E293B',
          borderRadius: '6px',
          padding: '6px 8px',
          fontFamily: 'monospace',
          minHeight: '28px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        Status: {statusText}
      </div>
    </div>
  );
};

const root = document.getElementById('root');
if (root) {
  createRoot(root).render(<PopupApp />);
}
