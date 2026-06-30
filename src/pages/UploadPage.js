import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';
import NeuralBackground from '../components/NeuralBackground';

const STEPS = [
  { n: '01', title: 'Upload your scan',    body: 'JPEG slices or NIfTI volumes. Any standard MRI output is accepted.' },
  { n: '02', title: 'Preprocessing',        body: 'Image is resized to 224×224, normalised, and passed into the CNN.' },
  { n: '03', title: 'Stage prediction',     body: 'Model outputs probabilities for all four Alzheimer\'s stages with a Grad-CAM heatmap.' },
  { n: '04', title: 'Review and export',    body: 'Download the full report or save it to the subject\'s history.' },
];

export default function UploadPage({ uploadedFile, setUploadedFile, subjectMeta, setSubjectMeta }) {
  const navigate = useNavigate();
  const [error, setError]  = useState('');

  const onDrop = useCallback(files => {
    setError('');
    const f = files[0];
    if (!f) return;
    // Accept JPEG, PNG, NIfTI
    const ok = /\.(jpe?g|png|nii|nii\.gz)$/i.test(f.name);
    if (!ok) { setError('Unsupported format. Please upload a JPEG, PNG, or NIfTI file.'); return; }
    setUploadedFile(f);
  }, [setUploadedFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, multiple: false,
    accept: { 'image/jpeg': ['.jpg', '.jpeg'], 'image/png': ['.png'] },
  });

  function handleSubmit() {
    if (!uploadedFile) { setError('Please select a scan file first.'); return; }
    navigate('/processing');
  }

  return (
    <div style={{ minHeight: 'calc(100vh - 52px)', display: 'flex', flexDirection: 'column' }}>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div style={{
        position: 'relative', overflow: 'hidden',
        background: '#0D1117',
        padding: '48px 24px 40px',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        textAlign: 'center', gap: 12,
      }}>
        <NeuralBackground />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            fontFamily: 'var(--mono)', fontSize: 11, color: '#4F6BED',
            letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 10,
          }}>
            NeuroCNN v1.2 · MCND Dataset · Alzheimer's staging
          </div>
          <h1 style={{
            fontFamily: 'var(--mono)', fontSize: 32, fontWeight: 500,
            color: '#F0F6FC', lineHeight: 1.2, marginBottom: 10,
          }}>
            Upload a brain MRI scan
          </h1>
          <p style={{ color: '#8B949E', fontSize: 14, maxWidth: 480, margin: '0 auto' }}>
            The model classifies Alzheimer's progression stage from structural MRI
            and highlights the brain regions that drove the decision.
          </p>
        </div>
      </div>

      {/* ── Body ─────────────────────────────────────────────────────────── */}
      <div style={{
        flex: 1, display: 'grid',
        gridTemplateColumns: 'minmax(0,1.2fr) minmax(0,0.8fr)',
        gap: 0, maxWidth: 1100, margin: '0 auto', width: '100%', padding: '32px 24px',
        alignItems: 'start',
      }}>

        {/* Left: upload + form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, paddingRight: 32 }}>

          {/* Dropzone */}
          <div
            {...getRootProps()}
            style={{
              border: `2px dashed ${isDragActive ? '#4F6BED' : '#D0D7DE'}`,
              borderRadius: 12,
              padding: '44px 24px',
              textAlign: 'center',
              background: isDragActive ? 'rgba(79,107,237,.04)' : '#FAFBFC',
              cursor: 'pointer',
              transition: 'border-color .2s, background .2s',
            }}
          >
            <input {...getInputProps()} />
            <div style={{ fontSize: 32, marginBottom: 12 }}>🧠</div>
            {uploadedFile ? (
              <>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#0E7F6F', marginBottom: 4 }}>
                  ✓ {uploadedFile.name}
                </div>
                <div style={{ fontSize: 12, color: '#8B949E' }}>
                  {(uploadedFile.size / 1024).toFixed(0)} KB · Click to replace
                </div>
              </>
            ) : (
              <>
                <div style={{ fontSize: 15, fontWeight: 500, color: '#24292F', marginBottom: 6 }}>
                  {isDragActive ? 'Drop file here' : 'Drop scan file here'}
                </div>
                <div style={{ fontSize: 13, color: '#8B949E', marginBottom: 16 }}>
                  JPEG · PNG · NIfTI (.nii / .nii.gz)
                </div>
                <button className="btn btn-sm" type="button">Browse files</button>
              </>
            )}
          </div>

          {error && (
            <div style={{
              padding: '10px 14px', borderRadius: 8,
              background: 'rgba(248,81,73,.08)',
              border: '1px solid rgba(248,81,73,.2)',
              fontSize: 13, color: '#B91C1C',
            }}>
              {error}
            </div>
          )}

          {/* Subject details */}
          <div className="card" style={{ padding: '18px 20px' }}>
            <div className="section-label">Subject details</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <Field
                label="Subject ID"
                placeholder="e.g. SUB-042"
                value={subjectMeta.id}
                onChange={v => setSubjectMeta(p => ({ ...p, id: v }))}
              />
              <Field
                label="Age"
                placeholder="e.g. 72"
                type="number"
                value={subjectMeta.age}
                onChange={v => setSubjectMeta(p => ({ ...p, age: v }))}
              />
              <div>
                <label style={{ fontSize: 11, color: '#57606A', display: 'block', marginBottom: 5 }}>
                  Sex
                </label>
                <select
                  value={subjectMeta.sex}
                  onChange={e => setSubjectMeta(p => ({ ...p, sex: e.target.value }))}
                  style={fieldStyle}
                >
                  <option value="">Not specified</option>
                  <option value="F">Female</option>
                  <option value="M">Male</option>
                </select>
              </div>
              <Field
                label="Clinical notes (optional)"
                placeholder="Any relevant context"
                value={subjectMeta.notes}
                onChange={v => setSubjectMeta(p => ({ ...p, notes: v }))}
              />
            </div>
          </div>

          <button
            className="btn btn-primary btn-lg"
            onClick={handleSubmit}
            style={{ alignSelf: 'flex-start' }}
          >
            Run analysis →
          </button>
        </div>

        {/* Right: how it works */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div>
            <div className="section-label">How it works</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {STEPS.map((s, i) => (
                <div key={s.n} style={{ display: 'flex', gap: 14, paddingBottom: 20, position: 'relative' }}>
                  {/* Vertical line connecting steps */}
                  {i < STEPS.length - 1 && (
                    <div style={{
                      position: 'absolute', left: 17, top: 32,
                      width: 1, height: 'calc(100% - 12px)',
                      background: '#E1E4E8',
                    }} />
                  )}
                  <div style={{
                    width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
                    background: '#F6F8FA', border: '1px solid #E1E4E8',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 500, color: '#57606A',
                    position: 'relative', zIndex: 1,
                  }}>
                    {s.n}
                  </div>
                  <div style={{ paddingTop: 6 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#24292F', marginBottom: 3 }}>
                      {s.title}
                    </div>
                    <div style={{ fontSize: 13, color: '#57606A', lineHeight: 1.5 }}>
                      {s.body}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Disclaimer */}
          <div style={{
            padding: '12px 16px', borderRadius: 8,
            background: 'rgba(240,165,0,.06)',
            border: '1px solid rgba(240,165,0,.2)',
          }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#996800', marginBottom: 3 }}>
              Research use only
            </div>
            <div style={{ fontSize: 12, color: '#57606A', lineHeight: 1.5 }}>
              This tool does not constitute a clinical diagnosis. All outputs must be
              reviewed by a qualified clinician before any action is taken.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Reusable field ────────────────────────────────────────────────────────────
const fieldStyle = {
  width: '100%', padding: '7px 10px',
  border: '1px solid #D0D7DE', borderRadius: 6,
  fontSize: 13, color: '#24292F',
  background: '#FFFFFF', outline: 'none',
};

function Field({ label, placeholder, value, onChange, type = 'text' }) {
  return (
    <div>
      <label style={{ fontSize: 11, color: '#57606A', display: 'block', marginBottom: 5 }}>
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        style={fieldStyle}
      />
    </div>
  );
}
