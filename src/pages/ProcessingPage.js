import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

/*
  This page simulates what will happen when connected to the real backend.

  Real flow (once you build the FastAPI backend):
    POST /api/analyse  →  FormData { file, subject_id, age, sex }
    ← { topClass, topLabel, topProb, probs, regions, summary, entropy }

  For now, we simulate the processing steps with timers and return mock data
  that matches the exact shape the results page expects.
*/

const STEPS = [
  { id: 'upload',   label: 'File received',             duration: 600  },
  { id: 'preproc',  label: 'Preprocessing image',       duration: 900  },
  { id: 'forward',  label: 'CNN forward pass',          duration: 1200 },
  { id: 'gradcam',  label: 'Generating Grad-CAM',       duration: 900  },
  { id: 'report',   label: 'Building report',           duration: 600  },
];

// Mock result — replace with real API response
function getMockResult(subjectMeta) {
  return {
    id:         `RPT-${Date.now()}`,
    subjectId:  subjectMeta.id || 'SUB-000',
    date:       new Date().toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' }),
    topClass:   'MID',
    topLabel:   'Mild dementia',
    topProb:    0.71,
    confidence: 'High',
    entropy:    0.22,
    probs:      { MID: 0.71, MOD: 0.03, NOD: 0.08, VMD: 0.18 },
    regions: [
      { name: 'Hippocampus (L)',     score: 0.88 },
      { name: 'Entorhinal cortex',   score: 0.74 },
      { name: 'Temporal lobe (L)',   score: 0.61 },
      { name: 'Parietal cortex',     score: 0.48 },
    ],
    summary: 'Analysis indicates mild Alzheimer\'s dementia (MID) with 71% posterior probability. Elevated activation in the left hippocampus and entorhinal cortex — regions central to early memory consolidation — is consistent with this staging.',
  };
}

export default function ProcessingPage({ uploadedFile, subjectMeta, onResult }) {
  const navigate     = useNavigate();
  const [step, setStep]       = useState(0);   // which step is active
  const [done, setDone]       = useState([]);   // completed step ids
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // If user navigates here directly without a file, send them back
    if (!uploadedFile) { navigate('/upload'); return; }

    let currentStep = 0;
    const totalDuration = STEPS.reduce((s, st) => s + st.duration, 0);
    let elapsed = 0;

    function runStep(i) {
      if (i >= STEPS.length) {
        // All steps done — generate result and navigate
        const result = getMockResult(subjectMeta);
        onResult(result);
        setTimeout(() => navigate('/results'), 400);
        return;
      }
      setStep(i);
      setTimeout(() => {
        elapsed += STEPS[i].duration;
        setProgress(Math.round((elapsed / totalDuration) * 100));
        setDone(prev => [...prev, STEPS[i].id]);
        runStep(i + 1);
      }, STEPS[i].duration);
    }

    runStep(0);

  }, []);

  return (
    <div style={{
      minHeight: 'calc(100vh - 52px)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: 40, gap: 36,
      background: '#F6F8FA',
    }}>

      {/* Pulsing brain icon */}
      <div style={{
        width: 72, height: 72, borderRadius: '50%',
        background: 'rgba(79,107,237,.1)',
        border: '1px solid rgba(79,107,237,.25)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 32,
        animation: 'pulse 2s ease-in-out infinite',
      }}>
        🧠
      </div>

      {/* Title */}
      <div style={{ textAlign: 'center' }}>
        <h2 style={{ fontSize: 22, fontWeight: 600, color: '#24292F', marginBottom: 6 }}>
          Analysing scan
        </h2>
        <p style={{ fontSize: 14, color: '#57606A' }}>
          {uploadedFile?.name} · {subjectMeta.id || 'Unknown subject'}
        </p>
      </div>

      {/* Steps */}
      <div style={{ width: '100%', maxWidth: 360, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {STEPS.map((s, i) => {
          const isDone    = done.includes(s.id);
          const isActive  = step === i && !isDone;
          return (
            <div
              key={s.id}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                opacity: i > step ? 0.35 : 1,
                transition: 'opacity .3s',
              }}
            >
              {/* Icon */}
              <div style={{
                width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: isDone ? 'rgba(126,231,208,.15)' : isActive ? 'rgba(79,107,237,.1)' : '#EFF1F3',
                border: `1px solid ${isDone ? 'rgba(14,127,111,.3)' : isActive ? 'rgba(79,107,237,.3)' : '#D0D7DE'}`,
                fontSize: 13,
                animation: isActive ? 'spin 1.2s linear infinite' : 'none',
              }}>
                {isDone ? '✓' : isActive ? '↻' : '○'}
              </div>

              {/* Label */}
              <span style={{
                fontSize: 13, fontWeight: isDone || isActive ? 500 : 400,
                color: isDone ? '#0E7F6F' : isActive ? '#4F6BED' : '#57606A',
              }}>
                {s.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Progress bar */}
      <div style={{ width: '100%', maxWidth: 360 }}>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          marginTop: 6, fontSize: 11, fontFamily: 'var(--mono)', color: '#8B949E',
        }}>
          <span>Processing</span>
          <span>{progress}%</span>
        </div>
      </div>
    </div>
  );
}
