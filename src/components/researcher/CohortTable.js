import React, { useState } from 'react';

const CONDITION_BADGE = {
  none:     { cls: 'badge-teal',  label: 'None'     },
  mild:     { cls: 'badge-amber', label: 'Mild'     },
  moderate: { cls: 'badge-red',   label: 'Moderate' },
};

const COLS = [
  { key: 'subjectId',   label: 'Subject ID',    get: r => r.subjectId },
  { key: 'date',        label: 'Date',           get: r => r.date },
  { key: 'topCondition',label: 'Condition',      get: r => r.topCondition },
  { key: 'confidence',  label: 'Confidence',     get: r => r.confidence },
  { key: 'phq9',        label: 'PHQ-9',          get: r => r.questionnaire?.phq9?.score ?? '—' },
  { key: 'gad7',        label: 'GAD-7',          get: r => r.questionnaire?.gad7?.score ?? '—' },
  { key: 'neuroticism', label: 'Neuro z',        get: r => r.wellbeing?.neuroticism?.zscore?.toFixed(2) ?? '—' },
  { key: 'traitAnxiety',label: 'Anxiety z',      get: r => r.wellbeing?.traitAnxiety?.zscore?.toFixed(2) ?? '—' },
  { key: 'stress',      label: 'Stress z',       get: r => r.wellbeing?.chronicStress?.zscore?.toFixed(2) ?? '—' },
];

export default function CohortTable({ history, selectedSubjects, setSelectedSubjects, onRowClick, conditionFilter }) {
  const [sortKey, setSortKey]   = useState('date');
  const [sortDir, setSortDir]   = useState('desc');

  function handleSort(key) {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  }

  function toggleSelect(id) {
    setSelectedSubjects(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  }

  const filtered = conditionFilter
    ? history.filter(r => r.topCondition === conditionFilter)
    : history;

  const sorted = [...filtered].sort((a, b) => {
    const col = COLS.find(c => c.key === sortKey);
    if (!col) return 0;
    const va = col.get(a);
    const vb = col.get(b);
    const cmp = String(va ?? '').localeCompare(String(vb ?? ''), undefined, { numeric: true });
    return sortDir === 'asc' ? cmp : -cmp;
  });

  return (
    <div style={{ overflowX: 'auto' }}>
      <table className="data-table">
        <thead>
          <tr>
            <th style={{ width: 32 }} />
            {COLS.map(c => (
              <th key={c.key} onClick={() => handleSort(c.key)}>
                {c.label} {sortKey === c.key ? (sortDir === 'asc' ? '↑' : '↓') : ''}
              </th>
            ))}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map(r => {
            const badge = CONDITION_BADGE[r.topCondition] || CONDITION_BADGE.mild;
            const isSelected = selectedSubjects.includes(r.id);
            return (
              <tr key={r.id} className={isSelected ? 'selected' : ''}>
                <td>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleSelect(r.id)}
                    style={{ cursor: 'pointer' }}
                  />
                </td>
                <td style={{ fontFamily: 'var(--mono)', fontSize: 12, fontWeight: 600 }}>{r.subjectId}</td>
                <td style={{ fontSize: 12, color: '#57606A' }}>{r.date}</td>
                <td><span className={`badge ${badge.cls}`} style={{ fontSize: 11 }}>{badge.label}</span></td>
                <td style={{ fontSize: 12 }}>{r.confidence}</td>
                <td style={{ fontFamily: 'var(--mono)', fontSize: 12 }}>{COLS[4].get(r)}</td>
                <td style={{ fontFamily: 'var(--mono)', fontSize: 12 }}>{COLS[5].get(r)}</td>
                <td style={{ fontFamily: 'var(--mono)', fontSize: 12 }}>{COLS[6].get(r)}</td>
                <td style={{ fontFamily: 'var(--mono)', fontSize: 12 }}>{COLS[7].get(r)}</td>
                <td style={{ fontFamily: 'var(--mono)', fontSize: 12 }}>{COLS[8].get(r)}</td>
                <td>
                  <button className="btn btn-sm" onClick={() => onRowClick(r)} style={{ fontSize: 11 }}>
                    View
                  </button>
                </td>
              </tr>
            );
          })}
          {sorted.length === 0 && (
            <tr><td colSpan={COLS.length + 2} style={{ textAlign: 'center', padding: '24px 0', color: '#8B949E', fontSize: 13 }}>
              No results match the current filter.
            </td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
