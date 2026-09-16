import React from 'react';
import { AI_INSIGHTS } from '../data/mockData';
import { Brain, AlertTriangle, TrendingUp, Lightbulb } from 'lucide-react';

export default function AiInsightsPage() {
  return (
    <div style={{ height: '100%', overflow: 'auto', padding: 20 }}>
      <div className="page-header">
        <div>
          <h2>AI Urban Safety Insights</h2>
          <p>AI-generated patterns and recommendations — for authority review and consideration</p>
        </div>
        <div style={{
          padding: '6px 12px', background: 'var(--violet-dim)',
          border: '1px solid rgba(139,92,246,0.3)', borderRadius: 6,
          display: 'flex', alignItems: 'center', gap: 6
        }}>
          <Brain size={12} color="var(--violet)" />
          <span style={{ fontSize: '0.7rem', color: 'var(--violet)', fontWeight: 600 }}>
            AI-Generated Recommendations
          </span>
        </div>
      </div>

      {/* Disclaimer */}
      <div style={{
        padding: '12px 16px', marginBottom: 20,
        background: 'var(--brand-dim)', border: '1px solid rgba(59,130,246,0.3)',
        borderRadius: 'var(--radius)', display: 'flex', alignItems: 'flex-start', gap: 10
      }}>
        <AlertTriangle size={14} color="var(--brand-bright)" style={{ flexShrink: 0, marginTop: 2 }} />
        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          These insights are <strong>AI-generated recommendations</strong> based on simulated incident pattern analysis.
          All suggestions require review, validation, and authorization by relevant urban planning and traffic authorities before any action is taken.
          <span style={{ color: 'var(--amber)', fontWeight: 600, marginLeft: 6 }}> All data is simulated for demonstration purposes.</span>
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(480px, 1fr))', gap: 16 }}>
        {AI_INSIGHTS.map(insight => (
          <div key={insight.id} className="insight-card">
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12, gap: 12 }}>
              <div>
                <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '1px',
                  color: 'var(--violet)', textTransform: 'uppercase', marginBottom: 4 }}>
                  {insight.area}
                </div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>{insight.title}</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
                <span className={`badge ${insight.priority === 'HIGH' ? 'critical' : insight.priority === 'MEDIUM' ? 'medium' : 'low'}`}>
                  {insight.priority}
                </span>
                <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>
                  {insight.incidentCount} incidents
                </span>
              </div>
            </div>

            {/* Stats strip */}
            <div style={{
              display: 'flex', gap: 12, marginBottom: 12,
              padding: '8px 10px', background: 'var(--bg-elevated)',
              borderRadius: 'var(--radius-sm)', flexWrap: 'wrap'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <TrendingUp size={11} color="var(--crimson)" />
                <span style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>
                  {insight.trend}
                </span>
              </div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>·</div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>
                {insight.incidentCount} incidents tracked
              </div>
            </div>

            {/* Observation */}
            <div style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                <Brain size={11} color="var(--cyan)" />
                <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--cyan)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                  AI Observation
                </span>
              </div>
              <p style={{
                fontSize: '0.78rem', color: 'var(--text-secondary)',
                lineHeight: 1.7, fontStyle: 'italic',
                padding: '10px', background: 'var(--bg-elevated)',
                borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--cyan)'
              }}>
                "{insight.observation}"
              </p>
            </div>

            {/* Suggestion */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                <Lightbulb size={11} color="var(--amber)" />
                <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--amber)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                  Suggested Consideration
                </span>
              </div>
              <p style={{
                fontSize: '0.78rem', color: 'var(--text-secondary)',
                lineHeight: 1.7,
                padding: '10px', background: 'rgba(245,158,11,0.05)',
                borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--amber)'
              }}>
                {insight.suggestion}
              </p>
            </div>

            <div style={{
              marginTop: 14, fontSize: '0.6rem', color: 'var(--text-muted)',
              padding: '6px 10px', background: 'var(--bg-elevated)', borderRadius: 4
            }}>
              ⚠ AI-generated recommendation for authority review. Not an enforcement directive.
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
