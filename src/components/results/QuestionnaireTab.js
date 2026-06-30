import React from 'react';
import { useNavigate } from 'react-router-dom';

const SEVERITY_COLOR = {
  minimal: '#7EE7D0', mild: '#4F6BED', moderate: '#F0A500',
  'moderately severe': '#F0A500', severe: '#F85149',
};

const BIG_FIVE = [
  { key: 'O', label: 'Openness' },
  { key: 'C', label: 'Conscientiousness' },
  { key: 'E', label: 'Extraversion' },
  { key: 'A', label: 'Agreeableness' },
  { key: 'N', label: 'Neuroticism' },
];

export default function QuestionnaireTab({ result, userRole }) {
  const navigate = useNavigate();

  if (!result.questionnaire) {
    return (
      <div style={{ padding: '48px 0', textAlign: 'center' }}>
        <div style={{ fontSize: 32, marginBottom: 14 }}>📋</div>
        <div style={{ fontSize: 16, fontWeight: 600, color: '#24292F', marginBottom: 8 }}>No questionnaire data</div>
        <div style={{ fontSize: 13, color: '#57606A', marginBottom: 20, maxWidth: 380, margin: '0 auto 20px' }}>
          No questionnaire was completed for this analysis. Complete one during the next scan to see correlations here.
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/upload')}>
          Start a new scan
        </button>
      </div>
    );
  }

  const { phq9, gad7, pss10, tipi } = result.questionnaire;
  const physio = result.physiological;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Physio grid */}
      {physio && (
        <div className="card">
          <div className="section-label">Physical health markers</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            <PhysioCell label="Blood pressure" value={`${physio.systolic}/${physio.diastolic}`} unit="mmHg"
              note={physio.systolic > 130 ? 'Elevated' : 'Normal range'} />
            <PhysioCell label="Heart rate" value={physio.heartRate} unit="bpm"
              note={physio.heartRate > 80 ? 'Slightly elevated' : 'Normal'} />
            <PhysioCell label="HRV / RMSSD" value={physio.hrv} unit="ms"
              note={physio.hrv < 30 ? 'Low variability' : 'Adequate'} />
            <PhysioCell label="Sleep" value={physio.sleepHours} unit="hrs/night"
              note={physio.sleepHours < 6 ? 'Below recommended' : 'Adequate'} />
            <PhysioCell label="Exercise" value={physio.exerciseFrequency} unit="days/week"
              note={physio.exerciseFrequency < 2 ? 'Low activity' : 'Active'} />
          </div>
        </div>
      )}

      {/* Questionnaire scores */}
      <div className="card">
        <div className="section-label">Validated questionnaire scores</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {phq9 && <ScoreGauge label="PHQ-9" sublabel="Depression" score={phq9.score} max={27} severity={phq9.severity} />}
          {gad7 && <ScoreGauge label="GAD-7" sublabel="Anxiety" score={gad7.score} max={21} severity={gad7.severity} />}
          {pss10 && <ScoreGauge label="PSS-10" sublabel="Perceived stress" score={pss10.score} max={40} />}
        </div>
      </div>

      {/* TIPI Big Five */}
      {tipi && (
        <div className="card">
          <div className="section-label">Big Five personality profile (TIPI)</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 4 }}>
            {BIG_FIVE.map(({ key, label }) => (
              <div key={key}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ fontSize: 13, color: '#24292F' }}>{label}</span>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 12, color: '#57606A' }}>
                    {tipi[key]?.toFixed(1)} / 7
                  </span>
                </div>
                <div style={{ height: 5, background: '#EFF1F3', borderRadius: 99, overflow: 'hidden' }}>
                  <div style={{ width: `${((tipi[key] || 0) / 7) * 100}%`, height: '100%', background: '#4F6BED', borderRadius: 99 }} />
                </div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 12, color: '#8B949E', marginTop: 12, lineHeight: 1.5 }}>
            TIPI scores are trait estimates — they describe stable tendencies, not states. Scores range from 1 (low) to 7 (high) per trait.
          </p>
        </div>
      )}
    </div>
  );
}

function PhysioCell({ label, value, unit, note }) {
  return (
    <div style={{ padding: '12px 14px', borderRadius: 8, background: '#F6F8FA', border: '1px solid #E1E4E8' }}>
      <div style={{ fontSize: 11, color: '#8B949E', marginBottom: 4 }}>{label}</div>
      <div style={{ fontFamily: 'var(--mono)', fontSize: 18, fontWeight: 500, color: '#24292F' }}>
        {value} <span style={{ fontSize: 11, fontWeight: 400, color: '#8B949E' }}>{unit}</span>
      </div>
      {note && <div style={{ fontSize: 11, color: '#57606A', marginTop: 3 }}>{note}</div>}
    </div>
  );
}

function ScoreGauge({ label, sublabel, score, max, severity }) {
  const pct = Math.min((score / max) * 100, 100);
  const color = severity ? (SEVERITY_COLOR[severity] || '#4F6BED') : '#4F6BED';
  return (
    <div style={{ textAlign: 'center', padding: '14px 12px', borderRadius: 10, background: '#F6F8FA', border: '1px solid #E1E4E8' }}>
      <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: '#8B949E', marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 11, color: '#57606A', marginBottom: 10 }}>{sublabel}</div>
      <div style={{ fontFamily: 'var(--mono)', fontSize: 28, fontWeight: 500, color, lineHeight: 1, marginBottom: 8 }}>
        {score}
      </div>
      <div style={{ height: 5, background: '#E1E4E8', borderRadius: 99, overflow: 'hidden', marginBottom: 6 }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 99 }} />
      </div>
      {severity && (
        <div style={{ fontSize: 11, fontWeight: 600, color, textTransform: 'capitalize' }}>{severity}</div>
      )}
      <div style={{ fontSize: 10, color: '#8B949E', marginTop: 2 }}>out of {max}</div>
    </div>
  );
}
