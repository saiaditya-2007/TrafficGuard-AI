import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, MessageSquare } from 'lucide-react';
import { getAssistantResponse, SUGGESTED_PROMPTS, INITIAL_MESSAGES } from '../data/assistantKnowledge';
import type { ChatMessage } from '../types';

let msgCounter = 100;

function formatMessage(text: string) {
  // Simple markdown-like rendering
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

export default function AssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `u-${++msgCounter}`,
      role: 'user',
      content: text.trim(),
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response delay
    await new Promise(r => setTimeout(r, 800 + Math.random() * 600));

    const response = getAssistantResponse(text);
    const aiMsg: ChatMessage = {
      id: `a-${++msgCounter}`,
      role: 'assistant',
      content: response,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    };

    setIsTyping(false);
    setMessages(prev => [...prev, aiMsg]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: '20px', overflow: 'hidden' }}>
      <div className="page-header" style={{ flexShrink: 0 }}>
        <div>
          <h2>TrafficGuard Assistant</h2>
          <p>Ask about Hyderabad road safety data — powered by simulated AI knowledge</p>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '6px 12px', background: 'var(--brand-dim)',
          border: '1px solid rgba(59,130,246,0.3)', borderRadius: 6
        }}>
          <Bot size={12} color="var(--brand-bright)" />
          <span style={{ fontSize: '0.7rem', color: 'var(--brand-bright)', fontWeight: 600 }}>
            AI Assistant — DEMO MODE
          </span>
        </div>
      </div>

      <div className="card chat-container" style={{ flex: 1, minHeight: 0 }}>
        {/* Messages */}
        <div className="chat-messages">
          {messages.map(msg => (
            <div key={msg.id} className={`chat-msg ${msg.role}`}>
              <div className={`chat-avatar ${msg.role === 'assistant' ? 'ai-avatar' : 'user-avatar'}`}>
                {msg.role === 'assistant' ? <Bot size={14} /> : <User size={14} />}
              </div>
              <div>
                <div className={`chat-bubble ${msg.role === 'assistant' ? 'ai' : 'user'}`}>
                  {msg.role === 'assistant'
                    ? formatMessage(msg.content)
                    : msg.content
                  }
                </div>
                <div style={{
                  fontSize: '0.58rem', color: 'var(--text-muted)', marginTop: 3,
                  textAlign: msg.role === 'user' ? 'right' : 'left', paddingInline: 4
                }}>
                  {msg.timestamp}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="chat-msg">
              <div className="chat-avatar ai-avatar"><Bot size={14} /></div>
              <div className="chat-bubble ai" style={{ display: 'flex', gap: 4, alignItems: 'center', padding: '10px 14px' }}>
                {[0.0, 0.2, 0.4].map(delay => (
                  <div
                    key={delay}
                    style={{
                      width: 7, height: 7, borderRadius: '50%',
                      background: 'var(--brand-bright)',
                      animation: `bounce 1s ease ${delay}s infinite`
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Suggested prompts */}
        {messages.length <= 2 && (
          <div className="suggested-prompts">
            {SUGGESTED_PROMPTS.map(prompt => (
              <button
                key={prompt}
                className="prompt-chip"
                onClick={() => sendMessage(prompt)}
              >
                {prompt}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="chat-input-area">
          <MessageSquare size={16} color="var(--text-muted)" style={{ flexShrink: 0, marginTop: 6 }} />
          <input
            className="chat-input"
            placeholder="Ask about Hyderabad road safety data..."
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
