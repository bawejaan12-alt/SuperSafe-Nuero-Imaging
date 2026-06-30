import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PhysioSection from '../components/questionnaire/PhysioSection';
import Phq9Section   from '../components/questionnaire/Phq9Section';
import Gad7Section   from '../components/questionnaire/Gad7Section';
import Pss10Section  from '../components/questionnaire/Pss10Section';
import TipiSection   from '../components/questionnaire/TipiSection';

const STEPS = [
  {
    id: 'physio',
    title: 'Physical health markers',
    plainTitle: 'Your physical health',
    subtitle: 'Blood pressure, heart rate, sleep, and activity',
  },
  {
    id: 'phq9',
    title: 'PHQ-9 — Depression scale',
    plainTitle: 'How have you been feeling?',
    subtitle: 'Patient Health Questionnaire (9 items)',
  },
  {
    id: 'gad7',
    title: 'GAD-7 — Anxiety scale',
    plainTitle: 'Worry and anxiety',
    subtitle: 'Generalised Anxiety Disorder scale (7 items)',
  },
  {
    id: 'pss10',
    title: 'PSS-10 — Perceived stress',
    plainTitle: 'Stress in the last month',
    subtitle: 'Perceived Stress Scale (10 items)',
  },
  {
    id: 'tipi',
    title: 'TIPI — Personality',
    plainTitle: 'A bit about your personality',
    subtitle: 'Ten-Item Personality Inventory',
  },
];

export default function QuestionnairePage({ setQuestionnaireData, userRole, uploadedFile }) {
  const navigate = useNavigate();
  const isClinician = userRole === 'clinician';
  const isResearcher = isClinician; // alias for tab label logic

  useEffect(() => {
    if (isClinician) navigate('/processing', { replace: true });
  }, [isClinician, navigate]);

  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState({
    physiological: { systolic: '', diastolic: '', heartRate: '', hrv: '', sleepHours: '', exerciseFrequency: '' },
    phq9Answers:   Array(9).fill(0),
    gad7Answers:   Array(7).fill(0),
    pss10Answers:  Array(10).fill(0),
    tipiAnswers:   Array(10).fill(4),
  });

  if (isClinician) return null;

  if (!uploadedFile) {
    navigate('/upload');
    return null;
  }

  function handleFinish() {
    setQuestionnaireData(draft);
    navigate('/processing');
  }

  function handleSkip() {
    setQuestionnaireData(null);
    navigate('/processing');
  }

  const currentStep = STEPS[step];
  const title = isResearcher ? currentStep.title : currentStep.plainTitle;

  return (
    <div style={{ minHeight: 'calc(100vh - 52px)', background: 'var(--ink)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ maxWidth: 720, margin: '0 auto', width: '100%', padding: '32px 24px 48px' }}>

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div className="step-dots">
              {STEPS.map((s, i) => (
                <span key={s.id} className={`step-dot${i === step ? ' active' : i < step ? ' done' : ''}`} />
              ))}
            </div>
            <button
              type="button"
              className="btn btn-sm"
              onClick={handleSkip}
              style={{ color: '#8B949E', fontSize: 12 }}
            >
              Skip questionnaire
            </button>
          </div>

          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: '#8B949E', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 6 }}>
            Step {step + 1} of {STEPS.length}
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 600, color: '#24292F', marginBottom: 4 }}>{title}</h2>
          <div style={{ fontSize: 13, color: '#8B949E' }}>{currentStep.subtitle}</div>
        </div>

        {/* ── Step content ────────────────────────────────────────────────── */}
        <div className="card" style={{ padding: '24px 28px', marginBottom: 24 }}>
          {step === 0 && (
            <PhysioSection
              values={draft.physiological}
              onChange={v => setDraft(d => ({ ...d, physiological: v }))}
            />
          )}
          {step === 1 && (
            <Phq9Section
              answers={draft.phq9Answers}
              onChange={v => setDraft(d => ({ ...d, phq9Answers: v }))}
              researcherMode={isResearcher}
            />
          )}
          {step === 2 && (
            <Gad7Section
              answers={draft.gad7Answers}
              onChange={v => setDraft(d => ({ ...d, gad7Answers: v }))}
              researcherMode={isResearcher}
            />
          )}
          {step === 3 && (
            <Pss10Section
              answers={draft.pss10Answers}
              onChange={v => setDraft(d => ({ ...d, pss10Answers: v }))}
              researcherMode={isResearcher}
            />
          )}
          {step === 4 && (
            <TipiSection
              answers={draft.tipiAnswers}
              onChange={v => setDraft(d => ({ ...d, tipiAnswers: v }))}
              researcherMode={isResearcher}
            />
          )}
        </div>

        {/* ── Nav buttons ─────────────────────────────────────────────────── */}
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <button
            type="button"
            className="btn"
            onClick={() => setStep(s => s - 1)}
            disabled={step === 0}
            style={{ opacity: step === 0 ? 0.4 : 1 }}
          >
            ← Back
          </button>
          {step < STEPS.length - 1 ? (
            <button type="button" className="btn btn-primary" onClick={() => setStep(s => s + 1)}>
              Next →
            </button>
          ) : (
            <button type="button" className="btn btn-primary" onClick={handleFinish}>
              Finish & analyse →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
