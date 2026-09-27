import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, MessageSquare, Brain, Database, CheckCircle2 } from 'lucide-react';
import { getAssistantResponse, SUGGESTED_PROMPTS, INITIAL_MESSAGES } from '../data/assistantKnowledge';
import { BACKEND_URL } from '../data/api';
import type { ChatMessage } from '../types';

let msgCounter = 100;

// ── Hindsight memory integration ──────────────────────────────────────────────
// The assistant calls POST /api/assistant/chat on the backend, which:
//   RECALL  — fetches relevant Hindsight memories before composing the response
//   REFLECT — synthesises memories for preference/context questions
//   RETAIN  — stores user messages containing durable preferences/project context
//
// Graceful fallback: if the backend is unreachable or HINDSIGHT_BASE_URL is not set
// on the server, the frontend falls back to local keyword-matching.

interface BackendChatResponse {
  success: boolean;
  response: string;
  memoryUsed: boolean;
  memoryOp: 'recall' | 'reflect' | null;
  retained: boolean;
  memoryEnabled: boolean;
  error?: string;
}

interface MemoryStatus {
  enabled: boolean;
  bankId: string;
}

// Session scoping for multi-officer memory isolation
function getOfficerSessionId(): string {
  try {
    let sid = window.sessionStorage.getItem('tg_officer_session_id');
    if (!sid) {
      sid = 'officer-' + Math.random().toString(36).slice(2, 8);
      window.sessionStorage.setItem('tg_officer_session_id', sid);
    }
    return sid;
  } catch {
    return 'officer-central';
  }
}

async function callBackendChat(message: string): Promise<BackendChatResponse | null> {
  const sessionId = getOfficerSessionId();
  try {
    const res = await fetch(`${BACKEND_URL}/api/assistant/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, sessionId }),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function fetchMemoryStatus(): Promise<MemoryStatus | null> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/assistant/memory-status`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

function formatMessage(text: string) {
  const lines = text.split('\n');
  return lines.map((line, i) => {
    if (line.startsWith('• ')) {
      const content = line.slice(2).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      return <div key={i} style={{ marginBottom: 4 }}>• <span dangerouslySetInnerHTML={{ __html: content }} /></div>;
    }
    const content = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    return <div key={i} style={{ marginBottom: line === '' ? 8 : 0 }} dangerouslySetInnerHTML={{ __html: content }} />;
  });
}

interface MemoryBadgeProps {
  op: 'recall' | 'reflect' | 'retained' | null;
}

function MemoryBadge({ op }: MemoryBadgeProps) {
  if (!op) return null;
  const cfg: Record<string, { label: string; color: string; bg: string }> = {
    recall:   { label: 'Memory recalled',  color: 'var(--cyan)',          bg: 'rgba(6,182,212,0.12)'  },
    reflect:  { label: 'Memory reflected', color: 'var(--brand-bright)',  bg: 'rgba(59,130,246,0.12)' },
    retained: { label: 'Memory stored',    color: 'var(--emerald)',        bg: 'rgba(16,185,129,0.12)' },
  };
  const c = cfg[op];
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 5, marginTop: 5,
      fontSize: '0.62rem', fontWeight: 700, padding: '2px 8px', borderRadius: 12,
      background: c.bg, color: c.color, border: `1px solid ${c.color}40`,
    }}>
      {op === 'recall' ? '🧠' : op === 'reflect' ? '🔍' : '💾'} {c.label}
    </div>
  );
}

export default function AssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [memoryStatus, setMemoryStatus] = useState<MemoryStatus | null>(null);
  const [memoryMeta, setMemoryMeta] = useState<Record<string, { op: 'recall' | 'reflect' | 'retained' | null; retained: boolean }>>({});
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMemoryStatus().then(status => { if (status) setMemoryStatus(status); });
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsgId = `u-${++msgCounter}`;
    const userMsg: ChatMessage = {
      id: userMsgId,
      role: 'user',
      content: text.trim(),
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    await new Promise(r => setTimeout(r, 400 + Math.random() * 400));

    // STEP 1: Try the Hindsight-powered backend
    const backendResp = await callBackendChat(text);
    const aiMsgId = `a-${++msgCounter}`;

    if (backendResp?.success) {
      const aiMsg: ChatMessage = {
        id: aiMsgId,
        role: 'assistant',
        content: backendResp.response,
        timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      };
      setIsTyping(false);
      setMessages(prev => [...prev, aiMsg]);

      if (backendResp.memoryUsed || backendResp.retained) {
        setMemoryMeta(prev => ({
          ...prev,
          [aiMsgId]: { op: backendResp.memoryOp, retained: backendResp.retained },
        }));
      }

      if (backendResp.retained) {
        setMemoryMeta(prev => ({ ...prev, [userMsgId]: { op: 'retained', retained: true } }));
        fetchMemoryStatus().then(s => { if (s) setMemoryStatus(s); });
      }
    } else {
      // STEP 2: Fallback to local keyword-matching (no backend / Hindsight offline)
      const response = getAssistantResponse(text);
      const aiMsg: ChatMessage = {
        id: aiMsgId,
        role: 'assistant',
        content: response,
        timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      };
      setIsTyping(false);
      setMessages(prev => [...prev, aiMsg]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const memoryEnabled = memoryStatus?.enabled ?? false;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: '20px', overflow: 'hidden' }}>
      <div className="page-header" style={{ flexShrink: 0 }}>
        <div>
          <h2>TrafficGuard Assistant</h2>
          <p>Ask about Hyderabad road safety data — powered by simulated AI knowledge</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>

          {/* Hindsight Memory indicator */}
          <div
            style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px',
              background: memoryEnabled ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${memoryEnabled ? 'rgba(16,185,129,0.4)' : 'var(--border)'}`,
              borderRadius: 6,
            }}
            title={memoryEnabled ? `Active Hindsight Bank: ${memoryStatus?.bankId || 'trafficguard-assistant'}` : "Hindsight service in standby mode. Set HINDSIGHT_BASE_URL to enable live memory banking."}
          >
            <Brain size={12} color={memoryEnabled ? 'var(--emerald)' : 'var(--text-muted)'} />
            <span style={{ fontSize: '0.7rem', color: memoryEnabled ? 'var(--emerald)' : 'var(--text-muted)', fontWeight: 700 }}>
              {memoryEnabled ? 'Hindsight Memory Active' : 'Hindsight Memory Standby'}
            </span>
            {memoryEnabled && <CheckCircle2 size={11} color="var(--emerald)" />}
          </div>

          {/* Memory bank ID */}
          {memoryStatus?.bankId && (
            <div
              style={{
                display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px',
                background: memoryEnabled ? 'rgba(6,182,212,0.08)' : 'rgba(255,255,255,0.02)',
                border: `1px solid ${memoryEnabled ? 'rgba(6,182,212,0.25)' : 'var(--border)'}`,
                borderRadius: 6,
              }}
              title="Target Hindsight Memory Bank"
            >
              <Database size={11} color={memoryEnabled ? 'var(--cyan)' : 'var(--text-muted)'} />
              <span style={{ fontSize: '0.65rem', color: memoryEnabled ? 'var(--cyan)' : 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                {memoryStatus.bankId}
              </span>
            </div>
          )}

          {/* AI Demo badge */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px',
            background: 'var(--brand-dim)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: 6
          }}>
            <Bot size={12} color="var(--brand-bright)" />
            <span style={{ fontSize: '0.7rem', color: 'var(--brand-bright)', fontWeight: 600 }}>
              AI Assistant — DEMO MODE
            </span>
          </div>
        </div>
      </div>

      <div className="card chat-container" style={{ flex: 1, minHeight: 0 }}>
        <div className="chat-messages">
          {messages.map(msg => (
            <div key={msg.id} className={`chat-msg ${msg.role}`}>
              <div className={`chat-avatar ${msg.role === 'assistant' ? 'ai-avatar' : 'user-avatar'}`}>
                {msg.role === 'assistant' ? <Bot size={14} /> : <User size={14} />}
              </div>
              <div>
                <div className={`chat-bubble ${msg.role === 'assistant' ? 'ai' : 'user'}`}>
                  {msg.role === 'assistant' ? formatMessage(msg.content) : msg.content}
                </div>
                <div style={{
                  fontSize: '0.58rem', color: 'var(--text-muted)', marginTop: 3,
                  textAlign: msg.role === 'user' ? 'right' : 'left', paddingInline: 4
                }}>
                  {msg.timestamp}
                </div>
                {/* Memory operation badges */}
                {memoryMeta[msg.id] && (
                  <div style={{ paddingInline: 4, textAlign: msg.role === 'user' ? 'right' : 'left' }}>
                    {memoryMeta[msg.id].retained && msg.role === 'user' && <MemoryBadge op="retained" />}
                    {msg.role === 'assistant' && memoryMeta[msg.id].op && <MemoryBadge op={memoryMeta[msg.id].op} />}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="chat-msg">
              <div className="chat-avatar ai-avatar"><Bot size={14} /></div>
              <div className="chat-bubble ai" style={{ display: 'flex', gap: 4, alignItems: 'center', padding: '10px 14px' }}>
                {[0.0, 0.2, 0.4].map(delay => (
                  <div key={delay} style={{
                    width: 7, height: 7, borderRadius: '50%', background: 'var(--brand-bright)',
                    animation: `bounce 1s ease ${delay}s infinite`
                  }} />
                ))}
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Suggested prompts + memory demo chips */}
        {messages.length <= 2 && (
          <div className="suggested-prompts">
            {SUGGESTED_PROMPTS.map(prompt => (
              <button key={prompt} className="prompt-chip" onClick={() => sendMessage(prompt)}>
                {prompt}
              </button>
            ))}
            <button
              className="prompt-chip"
              style={{ borderColor: 'rgba(16,185,129,0.5)', color: 'var(--emerald)' }}
              onClick={() => sendMessage('For this project, evidence review should always require authorized officer verification.')}
            >
              💾 Store Policy (Retain Demo)
            </button>
            <button
              className="prompt-chip"
              style={{ borderColor: 'rgba(6,182,212,0.5)', color: 'var(--cyan)' }}
              onClick={() => sendMessage('Who needs to verify evidence before review?')}
            >
              🔍 Recall Policy (Recall Demo)
            </button>
            <button
              className="prompt-chip"
              style={{ borderColor: 'rgba(16,185,129,0.3)', color: 'var(--text-secondary)' }}
              onClick={() => sendMessage('Remember that I want traffic reports focused on Hyderabad north corridors.')}
            >
              🧠 Store Preference (North Corridors)
            </button>
            <button
              className="prompt-chip"
              style={{ borderColor: 'rgba(6,182,212,0.3)', color: 'var(--text-secondary)' }}
              onClick={() => sendMessage('What should you focus on when giving me traffic reports?')}
            >
              🔍 Recall Preference (Synthesis)
            </button>
          </div>
        )}

        {/* Input area */}
        <div className="chat-input-area">
          <MessageSquare size={16} color="var(--text-muted)" style={{ flexShrink: 0, marginTop: 6 }} />
          <input
            className="chat-input"
            placeholder={memoryEnabled ? 'Ask or tell me something to remember...' : 'Ask about Hyderabad road safety data...'}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isTyping}
          />
          <button
            className="btn btn-primary"
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isTyping}
            style={{ padding: '8px 14px' }}
          >
            <Send size={14} />
          </button>
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
          40% { transform: scale(1.2); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
