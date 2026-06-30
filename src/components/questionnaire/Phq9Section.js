import React from 'react';
import LikertScale from './LikertScale';

const SCALE = ['Not at all', 'Several days', 'More than half', 'Nearly every day'];

const ITEMS = [
  'Little interest or pleasure in doing things',
  'Feeling down, depressed, or hopeless',
  'Trouble falling or staying asleep, or sleeping too much',
  'Feeling tired or having little energy',
  'Poor appetite or overeating',
  'Feeling bad about yourself — or that you are a failure or have let yourself or your family down',
  'Trouble concentrating on things, such as reading the newspaper or watching television',
  'Moving or speaking so slowly that other people could have noticed. Or the opposite — being so fidgety or restless that you have been moving around a lot more than usual',
  'Thoughts that you would be better off dead, or of hurting yourself in some way',
];

export default function Phq9Section({ answers, onChange, researcherMode }) {
  return (
    <div>
      <p style={{ fontSize: 13, color: '#57606A', marginBottom: 4, lineHeight: 1.6 }}>
        {researcherMode
          ? 'PHQ-9 — Over the last 2 weeks, how often have you been bothered by the following?'
          : 'Over the last 2 weeks, how often have you been bothered by any of the following problems?'}
      </p>
      <p style={{ fontSize: 11, color: '#8B949E', marginBottom: 20 }}>0 = Not at all · 3 = Nearly every day</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {ITEMS.map((item, i) => (
          <div key={i}>
            <div style={{ fontSize: 13, color: '#24292F', marginBottom: 8, lineHeight: 1.4 }}>
              {researcherMode && <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: '#8B949E', marginRight: 6 }}>PHQ{i + 1}</span>}
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
