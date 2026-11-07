import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { ShieldCheck, Play, Square, ExternalLink, Lock } from 'lucide-react';
export const PopupApp = () => {
    const [taskPrompt, setTaskPrompt] = useState('Find an HP Victus with 16GB RAM under ₹80,000, choose the highest-rated option, add it to cart, and proceed to address.');
    const [isRunning, setIsRunning] = useState(false);
    const [statusText, setStatusText] = useState('Idle - Ready');
    useEffect(() => {
        chrome.runtime.sendMessage({ type: 'GET_TASK_STATUS' }, (res) => {
            if (res?.state?.isRunning) {
                setIsRunning(true);
                setStatusText(`Running step ${res.state.stepCount}...`);
            }
        });
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
    return (<div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ backgroundColor: '#0284C7', padding: '6px', borderRadius: '8px' }}>
            <ShieldCheck size={18} color="#FFFFFF"/>
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#F8FAFC' }}>Privacy Agent</h1>
            <p style={{ margin: 0, fontSize: '11px', color: '#94A3B8' }}>On-Device Perception Active</p>
          </div>
        </div>
        <span style={{
            fontSize: '10px',
            padding: '2px 8px',
            borderRadius: '12px',
            backgroundColor: isRunning ? '#065F46' : '#1E293B',
            color: isRunning ? '#34D399' : '#94A3B8',
            border: `1px solid ${isRunning ? '#059669' : '#334155'}`,
        }}>
          {isRunning ? 'AGENT RUNNING' : 'IDLE'}
        </span>
      </div>

      {/* Privacy Guarantee Badge */}
      <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#0F172A',
            border: '1px solid #1E293B',
            borderRadius: '8px',
            padding: '8px 10px',
            fontSize: '11px',
            color: '#38BDF8',
        }}>
        <Lock size={14}/>
        <span>Raw PII Never Leaves Device (0 Leaks Invariant)</span>
      </div>

      {/* Task Input */}
      <div>
        <label style={{ fontSize: '11px', color: '#94A3B8', display: 'block', marginBottom: '6px' }}>
          Autonomous Goal Prompt:
        </label>
        <textarea rows={3} value={taskPrompt} onChange={(e) => setTaskPrompt(e.target.value)} disabled={isRunning} style={{
            width: '100%',
            backgroundColor: '#1E293B',
            border: '1px solid #334155',
            borderRadius: '6px',
            padding: '8px',
            color: '#F8FAFC',
            fontSize: '12px',
            boxSizing: 'border-box',
            resize: 'none',
        }}/>
      </div>

      {/* Preset Buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <span style={{ fontSize: '10px', color: '#64748B' }}>Quick Demo Presets:</span>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          <button onClick={() => setTaskPrompt('Find an HP Victus with 16GB RAM under ₹80,000 and add to cart.')} style={{
            fontSize: '10px',
            padding: '4px 8px',
            backgroundColor: '#1E293B',
            color: '#CBD5E1',
            border: '1px solid #334155',
            borderRadius: '4px',
            cursor: 'pointer',
        }}>
            🛒 E-Commerce Cart
          </button>
          <button onClick={() => setTaskPrompt('Fill my job application using my saved profile and submit it.')} style={{
            fontSize: '10px',
            padding: '4px 8px',
            backgroundColor: '#1E293B',
            color: '#CBD5E1',
            border: '1px solid #334155',
            borderRadius: '4px',
            cursor: 'pointer',
        }}>
            💼 Job Form Autofill
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '8px' }}>
        {!isRunning ? (<button onClick={handleStartTask} style={{
                flex: 1,
                backgroundColor: '#0284C7',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '6px',
                padding: '8px',
                fontSize: '12px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                cursor: 'pointer',
            }}>
            <Play size={14}/> Start Agent
          </button>) : (<button onClick={handleStopTask} style={{
                flex: 1,
                backgroundColor: '#DC2626',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '6px',
                padding: '8px',
                fontSize: '12px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                cursor: 'pointer',
            }}>
            <Square size={14}/> Stop Agent
          </button>)}

        <button onClick={openDashboard} title="Open Judge Observability Dashboard" style={{
            backgroundColor: '#1E293B',
            color: '#38BDF8',
            border: '1px solid #334155',
            borderRadius: '6px',
            padding: '8px 12px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '11px',
        }}>
          <ExternalLink size={14}/> Dashboard
        </button>
      </div>

      {/* Footer Status */}
      <div style={{ fontSize: '10px', color: '#64748B', textAlign: 'center' }}>
        Status: {statusText}
      </div>
    </div>);
};
const root = document.getElementById('root');
if (root) {
    createRoot(root).render(<PopupApp />);
}
//# sourceMappingURL=popup.js.map