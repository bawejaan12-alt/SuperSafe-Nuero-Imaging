import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CONDITION_META = {
  none:     { badge: 'badge-teal',  label: 'No elevated stress' },
  mild:     { badge: 'badge-amber', label: 'Mild stress' },
  moderate: { badge: 'badge-red',   label: 'Elevated stress' },
};

export default function HistoryPage({ history, setResult }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const filtered = (history || []).filter(r =>
    r.subjectId?.toLowerCase().includes(query.toLowerCase()) ||
    r.topCondition?.toLowerCase().includes(query.toLowerCase())
  );

  function viewResult(r) {
    setResult(r);
    navigate('/results');
  }

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '28px 24px 48px' }}>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 600, color: 'var(--white)', marginBottom: 4 }}>Analysis history</h1>
          <p style={{ fontSize: 13, color: 'var(--fog)' }}>
            {history.length} total scan{history.length !== 1 ? 's' : ''} analysed
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <input
            type="search" placeholder="Search subject ID or condition…"
            value={query} onChange={e => setQuery(e.target.value)}
            className="field-dark"
            style={{ width: 240 }}
          />
          <button className="btn btn-primary btn-sm" onClick={() => navigate('/upload')}>+ New scan</button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState query={query} onNew={() => navigate('/upload')} />
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--surface-light)', borderBottom: '1px solid var(--line)' }}>
                {['Subject', 'Date', 'Condition', 'Probability', 'Confidence', ''].map(h => (
                  <th key={h} style={{
                    padding: '10px 16px', textAlign: 'left', fontSize: 11, fontFamily: 'var(--mono)',
                    fontWeight: 500, color: 'var(--fog)', textTransform: 'uppercase', letterSpacing: '.06em', whiteSpace: 'nowrap',
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => {
                const meta = CONDITION_META[r.topCondition] || CONDITION_META.mild;
                const topProb = r.conditionProbs?.[r.topCondition] ?? 0;
                return (
                  <tr
                    key={r.id || i} onClick={() => viewResult(r)}
                    style={{ borderBottom: '1px solid var(--line)', cursor: 'pointer', transition: 'background .12s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-light)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontFamily: 'var(--mono)', fontSize: 13, fontWeight: 500, color: 'var(--white)' }}>{r.subjectId}</div>
                      <div style={{ fontSize: 11, color: 'var(--fog)', marginTop: 2 }}>{r.id}</div>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 13, color: 'var(--fog)', whiteSpace: 'nowrap' }}>{r.date}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span className={`badge ${meta.badge}`}>{meta.label}</span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 60, height: 4, background: 'var(--line)', borderRadius: 99, overflow: 'hidden' }}>
                          <div style={{
                            width: `${topProb * 100}%`, height: '100%', borderRadius: 99,
                            background: topProb > 0.75 ? '#34d399' : topProb > 0.5 ? '#F0A500' : '#F85149',
                          }} />
                        </div>
                        <span style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--fog)' }}>{Math.round(topProb * 100)}%</span>
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span className={`badge ${r.confidence === 'High' ? 'badge-teal' : r.confidence === 'Medium' ? 'badge-amber' : 'badge-red'}`}>
                        {r.confidence}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                      <button className="btn btn-sm" onClick={e => { e.stopPropagation(); viewResult(r); }}>View →</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function EmptyState({ query, onNew }) {
  return (
    <div style={{
      textAlign: 'center', padding: '64px 24px',
      border: '1px dashed var(--line)', borderRadius: 12,
      background: 'var(--slate)',
    }}>
      <div style={{ fontSize: 36, marginBottom: 12 }}>🧠</div>
      <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--white)', marginBottom: 6 }}>
        {query ? `No results for "${query}"` : 'No analyses yet'}
      </div>
      <div style={{ fontSize: 13, color: 'var(--fog)', marginBottom: 20 }}>
        {query ? 'Try a different subject ID or condition name.' : 'Upload your first scan to get started.'}
      </div>
      {!query && <button className="btn btn-primary" onClick={onNew}>Upload a scan</button>}
    </div>
  );
}
