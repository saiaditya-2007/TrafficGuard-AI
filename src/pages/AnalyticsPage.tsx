import React from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area
} from 'recharts';
import { ANALYTICS_DATA } from '../data/mockData';
import { BarChart3 } from 'lucide-react';

const CUSTOM_TOOLTIP_STYLE = {
  background: 'var(--bg-elevated)',
  border: '1px solid var(--border)',
  borderRadius: 8,
  padding: '8px 12px',
  fontSize: '0.72rem',
  color: 'var(--text-primary)',
};

function ChartCard({ title, children, span = 1 }: { title: string; children: React.ReactNode; span?: number }) {
  return (
    <div
      className="card"
      style={{
        gridColumn: span > 1 ? `span ${span}` : undefined,
        overflow: 'hidden'
      }}
    >
      <div className="card-header">
        <span className="card-title">{title}</span>
        <span style={{ fontSize: '0.6rem', color: 'var(--amber)', fontWeight: 700,
          background: 'var(--amber-dim)', padding: '2px 8px', borderRadius: 4 }}>
          SIMULATED DATA
        </span>
      </div>
      <div className="chart-container" style={{ height: 240 }}>
        {children}
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  const { violationsByType, violationsByHour, weeklyTrend, areaComparison, resolutionStats } = ANALYTICS_DATA;

  const totalViolations = violationsByType.reduce((s, v) => s + v.count, 0);

  return (
    <div style={{ height: '100%', overflow: 'auto', padding: 20 }}>
      <div className="page-header">
        <div>
          <h2>Analytics Dashboard</h2>
          <p>Violation trends, patterns and resolution metrics for Hyderabad · SIMULATED DEMO DATA</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <BarChart3 size={14} color="var(--brand)" />
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            Week of 7–13 Sep 2026
          </span>
        </div>
      </div>

      {/* Summary row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 16 }}>
        {[
          { label: 'Total Violations', value: totalViolations, color: 'var(--brand)' },
          { label: 'Weekly Avg/Day', value: Math.round(totalViolations / 7), color: 'var(--cyan)' },
          { label: 'Peak Hour', value: '7 PM', color: 'var(--crimson)' },
          { label: 'Resolution Rate', value: '71%', color: 'var(--emerald)' },
        ].map(s => (
          <div key={s.label} className="card" style={{ padding: '14px 16px' }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 900, color: s.color }}>
              {typeof s.value === 'number' ? s.value.toLocaleString() : s.value}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
        {/* Violations by Type */}
        <ChartCard title="Violations by Type">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={violationsByType} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 10 }} />
              <Tooltip contentStyle={CUSTOM_TOOLTIP_STYLE} cursor={{ fill: 'rgba(59,130,246,0.05)' }} />
              <Bar dataKey="count" name="Violations" radius={[4, 4, 0, 0]}>
                {violationsByType.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Resolution Stats (Pie) */}
        <ChartCard title="Resolution Statistics">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={resolutionStats}
                cx="40%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={3}
                dataKey="count"
                nameKey="status"
              >
                {resolutionStats.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={CUSTOM_TOOLTIP_STYLE} formatter={(v: any) => v.toLocaleString()} />
              <Legend
                layout="vertical"
                align="right"
                verticalAlign="middle"
                iconType="circle"
                iconSize={8}
                formatter={(val) => <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{val}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Violations by Hour */}
        <ChartCard title="Violations by Hour (24-Hour Distribution)" span={2}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={violationsByHour} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="hourGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="hour" tick={{ fill: 'var(--text-muted)', fontSize: 9 }} interval={2} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 10 }} />
              <Tooltip contentStyle={CUSTOM_TOOLTIP_STYLE} cursor={{ stroke: 'var(--border)' }} />
              <Area
                type="monotone"
                dataKey="count"
                name="Violations"
                stroke="#EF4444"
                fill="url(#hourGrad)"
                strokeWidth={2}
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Weekly Trend */}
        <ChartCard title="Weekly Trend (7-Day)">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weeklyTrend} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="day" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 10 }} />
              <Tooltip contentStyle={CUSTOM_TOOLTIP_STYLE} />
              <Legend iconType="circle" iconSize={8}
                formatter={(val) => <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{val}</span>} />
              <Line type="monotone" dataKey="incidents" name="Total Incidents" stroke="#EF4444" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="verified" name="Verified" stroke="#10B981" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Area Comparison */}
        <ChartCard title="Area Comparison — Incidents vs Resolved">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={areaComparison} margin={{ top: 8, right: 8, left: -20, bottom: 0 }} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
              <XAxis type="number" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} />
              <YAxis dataKey="area" type="category" width={80} tick={{ fill: 'var(--text-muted)', fontSize: 10 }} />
              <Tooltip contentStyle={CUSTOM_TOOLTIP_STYLE} />
              <Legend iconType="circle" iconSize={8}
                formatter={(val) => <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{val}</span>} />
              <Bar dataKey="incidents" name="Total Incidents" fill="#EF4444" radius={[0, 4, 4, 0]} />
              <Bar dataKey="resolved" name="Resolved" fill="#10B981" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
