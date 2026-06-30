import React from 'react';

const CONDITION_COLORS = { none: '#7EE7D0', mild: '#F0A500', moderate: '#F85149' };
const WB_LABELS = { neuroticism: 'Neuroticism', traitAnxiety: 'Trait anxiety', chronicStress: 'Chronic stress' };

export default function ComparisonModal({ subjects, onClose }) {
  if (subjects.length < 2) return null;
  const [a, b] = subjects;

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: '#24292F' }}>Side-by-side comparison</h2>
          <button className="btn btn-sm" onClick={onClose}>Close ✕</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          {[a, b].map(r => (
            <SubjectColumn key={r.id} result={r} />
          ))}
        </div>
      </div>
    </div>
  );
}

function SubjectColumn({ result }) {
  const color = CONDITION_COLORS[result.topCondition] || '#8B949E';
  return (
    <div>
      <div style={{ fontFamily: 'var(--mono)', fontSize: 14, fontWeight: 500, color: '#24292F', marginBottom: 2 }}>
        {result.subjectId}
      </div>
      <div style={{ fontSize: 12, color: '#8B949E', marginBottom: 12 }}>{result.date}</div>

      {/* Condition */}
      <div style={{ padding: '10px 14px', borderRadius: 8, background: '#F6F8FA', border: '1px solid #E1E4E8', marginBottom: 12 }}>
        <div style={{ fontSize: 11, color: '#8B949E', marginBottom: 4 }}>Top condition</div>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 18, fontWeight: 500, color, textTransform: 'capitalize' }}>
          {result.topCondition}
        </div>
        <div style={{ fontSize: 12, color: '#57606A', marginTop: 2 }}>
          {Math.round(result.conditionProbs[result.topCondition] * 100)}% · {result.confidence} confidence
        </div>
      </div>

      {/* Wellbeing */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 11, color: '#8B949E', marginBottom: 8, textTransform: 'uppercase', fontFamily: 'var(--mono)', letterSpacing: '.08em' }}>
          Wellbeing z-scores
        </div>
        {Object.entries(result.wellbeing || {}).map(([k, v]) => (
          <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #F0F2F4' }}>
            <span style={{ fontSize: 12, color: '#57606A' }}>{WB_LABELS[k] || k}</span>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 12, color: v.zscore > 1 ? '#F85149' : v.zscore > 0.3 ? '#F0A500' : '#0E7F6F' }}>
              {v.zscore > 0 ? '+' : ''}{v.zscore?.toFixed(2)}σ
            </span>
          </div>
        ))}
      </div>

      {/* Questionnaire */}
      {result.questionnaire && (
        <div>
          <div style={{ fontSize: 11, color: '#8B949E', marginBottom: 8, textTransform: 'uppercase', fontFamily: 'var(--mono)', letterSpacing: '.08em' }}>
            Questionnaire
          </div>
          {result.questionnaire.phq9 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #F0F2F4' }}>
              <span style={{ fontSize: 12, color: '#57606A' }}>PHQ-9</span>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 12, color: '#24292F' }}>{result.questionnaire.phq9.score} ({result.questionnaire.phq9.severity})</span>
            </div>
          )}
          {result.questionnaire.gad7 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #F0F2F4' }}>
              <span style={{ fontSize: 12, color: '#57606A' }}>GAD-7</span>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 12, color: '#24292F' }}>{result.questionnaire.gad7.score} ({result.questionnaire.gad7.severity})</span>
            </div>
          )}
          {result.questionnaire.pss10 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
              <span style={{ fontSize: 12, color: '#57606A' }}>PSS-10</span>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 12, color: '#24292F' }}>{result.questionnaire.pss10.score}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
