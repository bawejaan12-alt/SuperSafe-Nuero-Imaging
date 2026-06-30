import React from 'react';
import LikertScale from './LikertScale';

const SCALE = ['Never', 'Almost never', 'Sometimes', 'Fairly often', 'Very often'];

const ITEMS = [
  'Been upset because of something that happened unexpectedly?',
  'Felt that you were unable to control the important things in your life?',
  'Felt nervous and stressed?',
  'Felt confident about your ability to handle your personal problems?',
  'Felt that things were going your way?',
  'Found that you could not cope with all the things that you had to do?',
  'Been able to control irritations in your life?',
  'Felt that you were on top of things?',
  'Been angered because of things that were outside of your control?',
  'Felt difficulties were piling up so high that you could not overcome them?',
];

export default function Pss10Section({ answers, onChange, researcherMode }) {
  return (
    <div>
      <p style={{ fontSize: 13, color: '#57606A', marginBottom: 4, lineHeight: 1.6 }}>
        {researcherMode
          ? 'PSS-10 — In the last month, how often have you felt or thought the following?'
          : 'In the last month, how often have you felt the following?'}
      </p>
      <p style={{ fontSize: 11, color: '#8B949E', marginBottom: 20 }}>0 = Never · 4 = Very often</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {ITEMS.map((item, i) => (
          <div key={i}>
            <div style={{ fontSize: 13, color: '#24292F', marginBottom: 8, lineHeight: 1.4 }}>
              {researcherMode && <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: '#8B949E', marginRight: 6 }}>PSS{i + 1}</span>}
              In the last month, have you {item.charAt(0).toLowerCase() + item.slice(1)}
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
