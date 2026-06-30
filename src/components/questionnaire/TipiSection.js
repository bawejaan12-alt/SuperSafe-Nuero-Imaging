import React from 'react';

const ITEMS = [
  'Extraverted, enthusiastic',
  'Critical, quarrelsome',
  'Dependable, self-disciplined',
  'Anxious, easily upset',
  'Open to new experiences, complex',
  'Reserved, quiet',
  'Sympathetic, warm',
  'Disorganised, careless',
  'Calm, emotionally stable',
  'Conventional, uncreative',
];

const SCALE = [1,2,3,4,5,6,7];
const LABELS = { 1: 'Disagree strongly', 4: 'Neither', 7: 'Agree strongly' };

export default function TipiSection({ answers, onChange, researcherMode }) {
  return (
    <div>
      <p style={{ fontSize: 13, color: '#57606A', marginBottom: 4, lineHeight: 1.6 }}>
        {researcherMode
          ? 'TIPI (Ten-Item Personality Inventory) — rate your agreement with each pair of traits.'
          : 'Rate how well each pair of words describes you. There are no right or wrong answers.'}
      </p>
      <p style={{ fontSize: 11, color: '#8B949E', marginBottom: 20 }}>1 = Disagree strongly · 7 = Agree strongly</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {ITEMS.map((item, i) => (
          <div key={i}>
            <div style={{ fontSize: 13, color: '#24292F', marginBottom: 8 }}>
              {researcherMode && <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: '#8B949E', marginRight: 6 }}>T{i + 1}</span>}
              I see myself as: <strong>{item}</strong>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {SCALE.map(v => (
                <button
                  key={v}
                  type="button"
                  className={`likert-option${answers[i] === v ? ' selected' : ''}`}
                  onClick={() => { const a = [...answers]; a[i] = v; onChange(a); }}
                  style={{ minWidth: 0 }}
                >
                  <div style={{ fontWeight: 600, marginBottom: 2 }}>{v}</div>
                  {LABELS[v] && <div style={{ fontSize: 9, lineHeight: 1.2 }}>{LABELS[v]}</div>}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
