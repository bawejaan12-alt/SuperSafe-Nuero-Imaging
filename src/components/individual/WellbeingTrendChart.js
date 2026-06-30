import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, Legend,
} from 'recharts';

const LINES = [
  { key: 'neuroticism',   color: '#4F6BED', label: 'Neuroticism'    },
  { key: 'traitAnxiety',  color: '#F0A500', label: 'Trait anxiety'  },
  { key: 'chronicStress', color: '#F85149', label: 'Chronic stress' },
];

export default function WellbeingTrendChart({ history }) {
  if (!history || history.length < 1) {
    return (
      <div style={{ padding: '32px 0', textAlign: 'center', color: '#8B949E', fontSize: 13 }}>
        Complete at least one scan to see trends.
      </div>
    );
  }

  const data = [...history].reverse().map(r => ({
    date: r.date,
    neuroticism:   r.wellbeing?.neuroticism?.raw   ?? null,
    traitAnxiety:  r.wellbeing?.traitAnxiety?.raw  ?? null,
    chronicStress: r.wellbeing?.chronicStress?.raw ?? null,
  }));

  return (
    <div style={{ width: '100%', height: 220 }}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 4, right: 10, bottom: 4, left: -20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F0F2F4" />
          <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#8B949E' }} />
          <YAxis tick={{ fontSize: 11, fill: '#8B949E' }} />
          <Tooltip
            contentStyle={{ fontSize: 12, border: '1px solid #E1E4E8', borderRadius: 6, fontFamily: 'var(--mono)' }}
            formatter={(value, name) => [value?.toFixed(1), name]}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          {LINES.map(l => (
            <Line
              key={l.key} type="monotone" dataKey={l.key} name={l.label}
              stroke={l.color} strokeWidth={2} dot={{ r: 4, fill: l.color }}
              connectNulls
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
