import React from 'react';
import LikertScale from './LikertScale';

const SCALE = ['Not at all', 'Several days', 'More than half', 'Nearly every day'];

const ITEMS = [
  'Feeling nervous, anxious, or on edge',
  'Not being able to stop or control worrying',
  'Worrying too much about different things',
  'Trouble relaxing',
  'Being so restless that it is hard to sit still',
  'Becoming easily annoyed or irritable',
  'Feeling afraid, as if something awful might happen',
];

export default function Gad7Section({ answers, onChange, researcherMode }) {
  return (
    <div>
      <p style={{ fontSize: 13, color: '#57606A', marginBottom: 4, lineHeight: 1.6 }}>
        {researcherMode
          ? 'GAD-7 — Over the last 2 weeks, how often have you been bothered by the following?'
          : 'Over the last 2 weeks, how often have you been troubled by the following?'}
      </p>
      <p style={{ fontSize: 11, color: '#8B949E', marginBottom: 20 }}>0 = Not at all · 3 = Nearly every day</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {ITEMS.map((item, i) => (
          <div key={i}>
            <div style={{ fontSize: 13, color: '#24292F', marginBottom: 8, lineHeight: 1.4 }}>
              {researcherMode && <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: '#8B949E', marginRight: 6 }}>GAD{i + 1}</span>}
              {item}
            </div>
            <LikertScale
              options={SCALE}
              value={answers[i]}
              onChange={v => { const a = [...answers]; a[i] = v; onChange(a); }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
