import React from 'react';
import { useNavigate } from 'react-router-dom';
import NeuralBackground from '../components/NeuralBackground';

const ROLES = [
  {
    id: 'clinician',
    icon: '🔬',
    title: 'Clinician',
    tagline: 'For healthcare professionals & researchers',
    features: [
      'Upload resting-state fMRI scans',
      'Brain activation heatmap (Grad-CAM)',
      'DMN, Salience & Executive Control network analysis',
      'Cohort management & statistics',
      'MPI-LEMON dataset guide',
    ],
  },
  {
    id: 'personal',
    icon: '🩺',
    title: 'Personal',
    tagline: 'Track your own mental wellbeing',
    features: [
      'Upload data exported from Apple Watch or Fitbit',
      'Optional wellbeing questionnaire',
      'Plain-English mental health insights',
      'Trend tracking over time',
      'Personalised recommendations',
    ],
  },
];

const PREVIEW_CARDS = [
  { label: 'Brain activation', text: 'Grad-CAM heatmaps highlight regions driving the prediction — DMN, Salience Network, and Executive Control.' },
  { label: 'Wearable analysis', text: 'Upload your Apple Health or Fitbit export and get mental wellness insights derived from HRV, sleep, and activity patterns.' },
  { label: 'Multi-modal correlation', text: 'Cross-reference wearable signals with validated questionnaire scores (PHQ-9, GAD-7, PSS-10) for richer insight.' },
];

export default function LandingPage({ userRole, setRole }) {
  const navigate = useNavigate();
  const [selected, setSelected] = React.useState(userRole || null);

  function handleStart() {
    if (!selected) return;
    setRole(selected);
    navigate('/upload');
  }

  return (
    <div style={{ minHeight: 'calc(100vh - 52px)', display: 'flex', flexDirection: 'column', background: 'var(--ink)' }}>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div style={{ position: 'relative', overflow: 'hidden', padding: '56px 24px 48px', textAlign: 'center' }}>
        <NeuralBackground />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 640, margin: '0 auto' }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: 'var(--accent2)', letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 14 }}>
            NeuroCNN v1 · MPI-LEMON · Multi-modal wellbeing
          </div>
          <h1 style={{ fontFamily: "'DM Mono', monospace", fontSize: 36, fontWeight: 500, color: 'var(--white)', lineHeight: 1.2, marginBottom: 14 }}>
            🧠 NeuroInsight
          </h1>
          <p style={{ color: 'var(--fog)', fontSize: 15, lineHeight: 1.7, maxWidth: 500, margin: '0 auto 28px' }}>
            Analyse resting-state fMRI scans or wearable health data alongside validated questionnaires to surface meaningful mental wellbeing insights.
          </p>
        </div>
      </div>

      {/* ── Role selection ────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 780, margin: '0 auto', width: '100%', padding: '0 24px' }}>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: 'var(--fog)', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 16, textAlign: 'center' }}>
          Who are you?
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
          {ROLES.map(role => (
            <div
              key={role.id}
              className={`role-card${selected === role.id ? ' selected' : ''}`}
              onClick={() => setSelected(role.id)}
            >
              <div style={{ fontSize: 28, marginBottom: 10 }}>{role.icon}</div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 16, fontWeight: 500, color: 'var(--white)', marginBottom: 4 }}>
                {role.title}
              </div>
              <div style={{ fontSize: 12, color: 'var(--accent2)', marginBottom: 14 }}>{role.tagline}</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {role.features.map(f => (
                  <li key={f} style={{ fontSize: 13, color: 'var(--fog)', display: 'flex', gap: 8 }}>
                    <span style={{ color: 'var(--accent2)', flexShrink: 0 }}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <button
            onClick={handleStart}
            disabled={!selected}
            className="btn btn-primary btn-lg"
            style={{ opacity: selected ? 1 : 0.45, cursor: selected ? 'pointer' : 'not-allowed' }}
          >
            Get started →
          </button>
          <div style={{ fontSize: 12, color: '#57606A', marginTop: 10 }}>
            You can sign out and switch roles at any time.
          </div>
        </div>
      </div>

      {/* ── Preview strip ─────────────────────────────────────────────────── */}
      <div style={{ background: 'var(--slate)', borderTop: '1px solid var(--line)', padding: '32px 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: 'var(--fog)', textTransform: 'uppercase', letterSpacing: '.1em', textAlign: 'center', marginBottom: 20 }}>
            What you get
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {PREVIEW_CARDS.map(c => (
              <div key={c.label} style={{ background: 'var(--surface-light)', borderRadius: 10, padding: '18px 20px', border: '1px solid var(--line)' }}>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: 'var(--accent2)', marginBottom: 8 }}>{c.label}</div>
                <div style={{ fontSize: 13, color: 'var(--fog)', lineHeight: 1.6 }}>{c.text}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
