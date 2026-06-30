import React from 'react';

function mean(arr) { return arr.length ? arr.reduce((s, v) => s + v, 0) / arr.length : 0; }
function std(arr) {
  if (arr.length < 2) return 0;
  const m = mean(arr);
  return Math.sqrt(arr.reduce((s, v) => s + (v - m) ** 2, 0) / arr.length);
}

const DIMS = [
  { key: 'neuroticism',   label: 'Neuroticism',    path: r => r.wellbeing?.neuroticism?.zscore  },
  { key: 'traitAnxiety',  label: 'Trait anxiety',  path: r => r.wellbeing?.traitAnxiety?.zscore  },
  { key: 'chronicStress', label: 'Chronic stress', path: r => r.wellbeing?.chronicStress?.zscore },
  { key: 'phq9',          label: 'PHQ-9',           path: r => r.questionnaire?.phq9?.score       },
  { key: 'gad7',          label: 'GAD-7',           path: r => r.questionnaire?.gad7?.score       },
];

export default function GroupStatsPanel({ history }) {
  const conditionCounts = { none: 0, mild: 0, moderate: 0 };
  history.forEach(r => { if (conditionCounts[r.topCondition] !== undefined) conditionCounts[r.topCondition]++; });

  return (
    <div className="card" style={{ marginBottom: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div className="section-label" style={{ margin: 0 }}>Group statistics (n={history.length})</div>
        <div style={{ display: 'flex', gap: 10 }}>
          {Object.entries(conditionCounts).map(([c, n]) => (
            <span key={c} style={{ fontSize: 12, color: 'var(--fog)' }}>
              <span style={{ fontFamily: 'var(--mono)', fontWeight: 600, color: 'var(--white)' }}>{n}</span> {c}
            </span>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
        {DIMS.map(({ key, label, path }) => {
          const vals = history.map(path).filter(v => v != null);
          const m = mean(vals);
          const s = std(vals);
          return (
            <div key={key} style={{
              textAlign: 'center', padding: '12px 8px', borderRadius: 8,
              background: 'var(--surface-light)', border: '1px solid var(--line)',
            }}>
              <div style={{ fontSize: 10, color: 'var(--fog)', marginBottom: 6, fontFamily: 'var(--mono)' }}>{label}</div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 16, fontWeight: 500, color: 'var(--white)' }}>
                {vals.length ? m.toFixed(2) : '—'}
              </div>
              <div style={{ fontSize: 10, color: 'var(--fog)', marginTop: 2 }}>
                {vals.length ? `± ${s.toFixed(2)}` : 'no data'}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
