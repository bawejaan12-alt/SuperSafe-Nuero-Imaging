import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { analyseScan } from '../api/neuroModel';

const STEPS = [
  { id: 'upload',  label: 'File received',          duration: 500 },
  { id: 'preproc', label: 'Extracting mean fMRI map', duration: 800 },
  { id: 'forward', label: 'Running CNN inference',    duration: 1100 },
  { id: 'gradcam', label: 'Generating Grad-CAM',      duration: 800 },
  { id: 'report',  label: 'Building report',          duration: 500 },
];

export default function ProcessingPage({ uploadedFile, subjectMeta, onResult }) {
  const navigate = useNavigate();
  const [step, setStep]         = useState(0);
  const [done, setDone]         = useState([]);
  const [progress, setProgress] = useState(0);
  const [error, setError]       = useState(null);
  const calledRef = useRef(false);

  useEffect(() => {
    if (!uploadedFile) { navigate('/upload'); return; }
    if (calledRef.current) return;   // guard against double-invoke in StrictMode
    calledRef.current = true;

    let cancelled = false;
    const totalDuration = STEPS.reduce((s, st) => s + st.duration, 0);
    let elapsed = 0;

    // Kick off the real (or mock) analysis call immediately in the background —
    // the step animation below is purely visual and runs in parallel.
    const analysisPromise = analyseScan(uploadedFile, subjectMeta);

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

    // Wait for both the animation and the real analysis to finish,
    // then navigate. This way a slow backend doesn't get raced past
    // by the visual steps.
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
    // Intentionally empty dependency array — this effect should run once
    // on mount only. uploadedFile/subjectMeta are read at trigger time.
  }, []); // eslint-disable-line

  if (error) {
    return (
      <div style={{
        minHeight: 'calc(100vh - 52px)', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 16, padding: 40,
      }}>
        <div style={{ fontSize: 32 }}>⚠️</div>
        <div style={{ fontSize: 16, fontWeight: 600, color: '#24292F' }}>Analysis failed</div>
        <div style={{ fontSize: 13, color: '#57606A', maxWidth: 360, textAlign: 'center' }}>{error}</div>
        <button className="btn btn-primary" onClick={() => navigate('/upload')}>
          ← Back to upload
        </button>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: 'calc(100vh - 52px)', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', padding: 40, gap: 36, background: '#F6F8FA',
    }}>
      <div style={{
        width: 72, height: 72, borderRadius: '50%',
        background: 'rgba(126,231,208,.12)', border: '1px solid rgba(126,231,208,.3)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32,
        animation: 'pulse 2s ease-in-out infinite',
      }}>
        🧠
      </div>

      <div style={{ textAlign: 'center' }}>
        <h2 style={{ fontSize: 22, fontWeight: 600, color: '#24292F', marginBottom: 6 }}>
          Analysing scan
        </h2>
        <p style={{ fontSize: 14, color: '#57606A' }}>
          {uploadedFile?.name} · {subjectMeta.id || 'Unknown subject'}
        </p>
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
                background: isDone ? 'rgba(126,231,208,.15)' : isActive ? 'rgba(79,107,237,.1)' : '#EFF1F3',
                border: `1px solid ${isDone ? 'rgba(14,127,111,.3)' : isActive ? 'rgba(79,107,237,.3)' : '#D0D7DE'}`,
                fontSize: 13, animation: isActive ? 'spin 1.2s linear infinite' : 'none',
              }}>
                {isDone ? '✓' : isActive ? '↻' : '○'}
              </div>
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

      <div style={{ width: '100%', maxWidth: 360 }}>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 11, fontFamily: 'var(--mono)', color: '#8B949E' }}>
          <span>Processing</span>
          <span>{progress}%</span>
        </div>
      </div>
    </div>
  );
}
