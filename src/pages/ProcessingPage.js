import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { analyseScan, analyseWearable } from '../api/neuroModel';

const SCAN_STEPS = [
  { id: 'upload',  label: 'File received',              duration: 500 },
  { id: 'preproc', label: 'Extracting mean fMRI map',   duration: 800 },
  { id: 'forward', label: 'Running CNN inference',       duration: 1100 },
  { id: 'gradcam', label: 'Generating Grad-CAM',         duration: 800 },
  { id: 'report',  label: 'Building clinical report',    duration: 500 },
];

const WEARABLE_STEPS = [
  { id: 'read',     label: 'Reading wearable data',        duration: 500 },
  { id: 'extract',  label: 'Extracting patterns',          duration: 800 },
  { id: 'correlate',label: 'Correlating with reference profiles', duration: 900 },
  { id: 'insights', label: 'Generating insights',          duration: 700 },
  { id: 'report',   label: 'Building report',              duration: 400 },
];

export default function ProcessingPage({ userRole, uploadedFile, wearableData, subjectMeta, questionnaireData, onResult }) {
  const navigate = useNavigate();
  const isClinician = userRole === 'clinician';
  const STEPS = isClinician ? SCAN_STEPS : WEARABLE_STEPS;

  const [step, setStep]         = useState(0);
  const [done, setDone]         = useState([]);
  const [progress, setProgress] = useState(0);
  const [error, setError]       = useState(null);
  const calledRef = useRef(false);

  useEffect(() => {
    if (isClinician && !uploadedFile) { navigate('/upload'); return; }
    if (!isClinician && !wearableData) { navigate('/upload'); return; }
    if (calledRef.current) return;
    calledRef.current = true;

    let cancelled = false;
    const totalDuration = STEPS.reduce((s, st) => s + st.duration, 0);
    let elapsed = 0;

    const analysisPromise = isClinician
      ? analyseScan(uploadedFile, subjectMeta, questionnaireData)
      : analyseWearable({ ...wearableData, subjectId: subjectMeta?.id }, questionnaireData);

    function animateStep(i) {
      if (cancelled) return;
      if (i >= STEPS.length) return;
      setStep(i);
      setTimeout(() => {
        if (cancelled) return;
        elapsed += STEPS[i].duration;
        setProgress(Math.round((elapsed / totalDuration) * 100));
        setDone(prev => [...prev, STEPS[i].id]);
        animateStep(i + 1);
      }, STEPS[i].duration);
    }
    animateStep(0);

    const minAnimTime = new Promise(res => setTimeout(res, totalDuration));

    Promise.all([analysisPromise, minAnimTime])
      .then(([result]) => {
        if (cancelled) return;
        onResult(result);
        setTimeout(() => navigate('/results'), 300);
      })
      .catch(err => {
        if (cancelled) return;
        setError(err.message || 'Analysis failed. Please try again.');
      });

    return () => { cancelled = true; };
  }, []); // eslint-disable-line

  if (error) {
    return (
      <div style={{
        minHeight: 'calc(100vh - 52px)', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 16, padding: 40,
        background: 'var(--ink)',
      }}>
        <div style={{ fontSize: 32 }}>⚠️</div>
        <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--white)' }}>Analysis failed</div>
        <div style={{ fontSize: 13, color: 'var(--fog)', maxWidth: 360, textAlign: 'center' }}>{error}</div>
        <button className="btn btn-primary" onClick={() => navigate('/upload')}>
          ← Back to upload
        </button>
      </div>
    );
  }

  const label = isClinician ? 'Analysing scan' : 'Analysing your health data';
  const subtitle = isClinician
    ? `${uploadedFile?.name} · ${subjectMeta?.id || 'Unknown subject'}`
    : `${subjectMeta?.id || 'Personal analysis'}`;

  return (
    <div style={{
      minHeight: 'calc(100vh - 52px)', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', padding: 40, gap: 36,
      background: 'var(--ink)',
    }}>
      <div style={{
        width: 72, height: 72, borderRadius: '50%',
        background: 'rgba(139,92,246,.12)', border: '1px solid rgba(139,92,246,.3)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32,
        animation: 'pulse 2s ease-in-out infinite',
      }}>
        🧠
      </div>

      <div style={{ textAlign: 'center' }}>
        <h2 style={{ fontSize: 22, fontWeight: 600, color: 'var(--white)', marginBottom: 6 }}>
          {label}
        </h2>
        <p style={{ fontSize: 14, color: 'var(--fog)' }}>{subtitle}</p>
      </div>

      <div style={{ width: '100%', maxWidth: 360, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {STEPS.map((s, i) => {
          const isDone   = done.includes(s.id);
          const isActive = step === i && !isDone;
          return (
            <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 12, opacity: i > step ? 0.35 : 1, transition: 'opacity .3s' }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: isDone ? 'rgba(139,92,246,.15)' : isActive ? 'rgba(139,92,246,.1)' : 'var(--surface-light)',
                border: `1px solid ${isDone ? 'rgba(139,92,246,.5)' : isActive ? 'var(--accent)' : 'var(--line)'}`,
                fontSize: 13, animation: isActive ? 'spin 1.2s linear infinite' : 'none',
                color: isDone ? 'var(--accent2)' : isActive ? 'var(--accent)' : 'var(--fog)',
              }}>
                {isDone ? '✓' : isActive ? '↻' : '○'}
              </div>
              <span style={{
                fontSize: 13, fontWeight: isDone || isActive ? 500 : 400,
                color: isDone ? 'var(--accent2)' : isActive ? 'var(--white)' : 'var(--fog)',
              }}>
                {s.label}
              </span>
            </div>
          );
        })}
      </div>

      <div style={{ width: '100%', maxWidth: 360 }}>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--fog)' }}>
          <span>Processing</span>
          <span>{progress}%</span>
        </div>
      </div>
    </div>
  );
}
