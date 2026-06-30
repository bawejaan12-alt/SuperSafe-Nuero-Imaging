import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';
import NeuralBackground from '../components/NeuralBackground';

/* ── Clinician (fMRI) steps ─────────────────────────────────────────────── */
const CLINICIAN_STEPS = [
  { n: '01', title: 'Upload fMRI scan',     body: 'Resting-state NIfTI file (.nii / .nii.gz). Eyes-open session preferred (LEMON protocol).' },
  { n: '02', title: 'Preprocessing',         body: 'BOLD signal extracted, resampled, and normalised for the CNN.' },
  { n: '03', title: 'Network analysis',      body: 'DMN, Salience, and Executive Control network activation estimated via Grad-CAM.' },
  { n: '04', title: 'Clinical report',       body: 'Region heatmaps, fALFF estimates, and network-level interpretation.' },
];

/* ── Personal (wearable) steps ──────────────────────────────────────────── */
const PERSONAL_STEPS = [
  { n: '01', title: 'Upload wearable data', body: 'Export from Apple Health (XML) or Fitbit / Health Auto Export (CSV), or enter metrics manually.' },
  { n: '02', title: 'Pattern extraction',    body: 'HRV, resting heart rate, sleep quality, and activity levels parsed from your data.' },
  { n: '03', title: 'Wellbeing analysis',    body: 'Patterns cross-referenced with reference profiles to estimate stress, anxiety, and mood markers.' },
  { n: '04', title: 'Insights report',       body: 'Plain-English summary, trend charts, and personalised recommendations.' },
];

export default function UploadPage({
  userRole,
  uploadedFile, setUploadedFile,
  wearableData, setWearableData,
  subjectMeta,  setSubjectMeta,
}) {
  const navigate = useNavigate();
  const isClinician = userRole === 'clinician';
  const steps = isClinician ? CLINICIAN_STEPS : PERSONAL_STEPS;

  return (
    <div style={{ minHeight: 'calc(100vh - 52px)', display: 'flex', flexDirection: 'column', background: 'var(--ink)' }}>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div style={{
        position: 'relative', overflow: 'hidden', background: 'var(--ink)',
        padding: '48px 24px 40px',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        textAlign: 'center', gap: 12,
      }}>
        <NeuralBackground />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--accent2)',
            letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 10,
          }}>
            {isClinician ? 'NeuroCNN v1 · MPI-LEMON Dataset · Clinical analysis' : 'Wearable analysis · Mental wellbeing insights'}
          </div>
          <h1 style={{
            fontFamily: 'var(--mono)', fontSize: 30, fontWeight: 500,
            color: 'var(--white)', lineHeight: 1.2, marginBottom: 10,
          }}>
            {isClinician ? 'Upload a resting-state fMRI scan' : 'Upload your health data'}
          </h1>
          <p style={{ color: 'var(--fog)', fontSize: 14, maxWidth: 520, margin: '0 auto' }}>
            {isClinician
              ? 'Estimates stress-related brain activity and resting-state network signatures — DMN, Salience Network, and Executive Control.'
              : 'Upload an export from Apple Health, Fitbit, or a compatible wearable — or enter your metrics manually.'}
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

        {/* Left */}
        <div style={{ paddingRight: 32 }}>
          {isClinician
            ? <ClinicianUpload
                uploadedFile={uploadedFile}
                setUploadedFile={setUploadedFile}
                subjectMeta={subjectMeta}
                setSubjectMeta={setSubjectMeta}
              />
            : <PersonalUpload
                wearableData={wearableData}
                setWearableData={setWearableData}
                subjectMeta={subjectMeta}
                setSubjectMeta={setSubjectMeta}
              />
          }
        </div>

        {/* Right: how it works */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div>
            <div className="section-label">How it works</div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {steps.map((s, i) => (
                <div key={s.n} style={{ display: 'flex', gap: 14, paddingBottom: 20, position: 'relative' }}>
                  {i < steps.length - 1 && (
                    <div style={{ position: 'absolute', left: 17, top: 32, width: 1, height: 'calc(100% - 12px)', background: 'var(--line)' }} />
                  )}
                  <div className="step-circle">{s.n}</div>
                  <div style={{ paddingTop: 6 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--white)', marginBottom: 3 }}>{s.title}</div>
                    <div style={{ fontSize: 13, color: 'var(--fog)', lineHeight: 1.5 }}>{s.body}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{
            padding: '12px 16px', borderRadius: 8,
            background: 'rgba(240,165,0,.08)', border: '1px solid rgba(240,165,0,.2)',
          }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#F0A500', marginBottom: 3 }}>Research use only</div>
            <div style={{ fontSize: 12, color: 'var(--fog)', lineHeight: 1.5 }}>
              This tool does not constitute a clinical diagnosis. Results should be interpreted alongside professional assessment.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Clinician upload panel ─────────────────────────────────────────────── */
function ClinicianUpload({ uploadedFile, setUploadedFile, subjectMeta, setSubjectMeta }) {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const onDrop = useCallback(files => {
    setError('');
    const f = files[0];
    if (!f) return;
    const ok = /\.(nii|gz)$/i.test(f.name);
    if (!ok) { setError('Please upload a NIfTI file (.nii or .nii.gz).'); return; }
    setUploadedFile(f);
  }, [setUploadedFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, multiple: false,
    accept: { 'application/octet-stream': ['.nii', '.gz'] },
  });

  function handleSubmit() {
    if (!uploadedFile) { setError('Please select a scan file first.'); return; }
    if (!subjectMeta.id.trim()) { setError('Please enter a subject ID.'); return; }
    navigate('/processing');
  }

  function clearFile(e) { e.stopPropagation(); setUploadedFile(null); setError(''); }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div
        {...getRootProps()}
        style={{
          border: `2px dashed ${isDragActive ? 'var(--accent)' : 'var(--line)'}`,
          borderRadius: 12, padding: '44px 24px', textAlign: 'center',
          background: isDragActive ? 'rgba(139,92,246,.06)' : 'var(--slate)',
          cursor: 'pointer', transition: 'border-color .2s, background .2s',
        }}
      >
        <input {...getInputProps()} />
        <div style={{ fontSize: 32, marginBottom: 12 }}>🧠</div>
        {uploadedFile ? (
          <>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--accent2)', marginBottom: 4 }}>
              ✓ {uploadedFile.name}
            </div>
            <div style={{ fontSize: 12, color: 'var(--fog)', marginBottom: 10 }}>
              {(uploadedFile.size / 1024).toFixed(0)} KB
            </div>
            <button className="btn btn-sm" type="button" onClick={clearFile}>Remove file</button>
          </>
        ) : (
          <>
            <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--white)', marginBottom: 6 }}>
              {isDragActive ? 'Drop NIfTI file here' : 'Drop fMRI scan here'}
            </div>
            <div style={{ fontSize: 13, color: 'var(--fog)', marginBottom: 16 }}>
              NIfTI (.nii / .nii.gz) — resting-state BOLD
            </div>
            <button className="btn btn-sm btn-primary" type="button">Browse files</button>
          </>
        )}
      </div>

      {error && <ErrorBox>{error}</ErrorBox>}

      <div className="card" style={{ padding: '18px 20px' }}>
        <div className="section-label">Subject details</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <Field label="Subject ID *" placeholder="e.g. SUB-042"
            value={subjectMeta.id} onChange={v => setSubjectMeta(p => ({ ...p, id: v }))} />
          <Field label="Age" placeholder="e.g. 27" type="number"
            value={subjectMeta.age} onChange={v => setSubjectMeta(p => ({ ...p, age: v }))} />
          <SelectField label="Sex" value={subjectMeta.sex} onChange={v => setSubjectMeta(p => ({ ...p, sex: v }))} />
          <Field label="Notes (optional)" placeholder="Medications, artefacts, etc."
            value={subjectMeta.notes} onChange={v => setSubjectMeta(p => ({ ...p, notes: v }))} />
        </div>
      </div>

      <button className="btn btn-primary btn-lg" onClick={handleSubmit} style={{ alignSelf: 'flex-start' }}>
        Run fMRI analysis →
      </button>
    </div>
  );
}

/* ── Personal upload panel ──────────────────────────────────────────────── */
function PersonalUpload({ wearableData, setWearableData, subjectMeta, setSubjectMeta }) {
  const navigate = useNavigate();
  const [error, setError]           = useState('');
  const [wearableFile, setWearableFile] = useState(null);
  const [manual, setManual]         = useState({ hrv: '', heartRate: '', sleepHours: '', exerciseDays: '' });

  const onDrop = useCallback(files => {
    setError('');
    const f = files[0];
    if (!f) return;
    const ok = /\.(csv|xml|json)$/i.test(f.name);
    if (!ok) { setError('Please upload a CSV, XML, or JSON file exported from your wearable.'); return; }
    setWearableFile(f);
    setWearableData({ file: f, manual });
  }, [setWearableData, manual]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, multiple: false,
    accept: {
      'text/csv': ['.csv'],
      'text/xml': ['.xml'],
      'application/json': ['.json'],
    },
  });

  function clearFile(e) { e.stopPropagation(); setWearableFile(null); setWearableData(null); setError(''); }

  function handleManualChange(field, value) {
    const next = { ...manual, [field]: value };
    setManual(next);
    if (wearableFile) setWearableData({ file: wearableFile, manual: next });
    else setWearableData({ file: null, manual: next });
  }

  function handleSubmit() {
    const hasFile   = !!wearableFile;
    const hasManual = Object.values(manual).some(v => v.trim() !== '');
    if (!hasFile && !hasManual) { setError('Please upload a file or enter at least one metric manually.'); return; }
    if (!subjectMeta.id.trim()) { setError('Please enter your name or an identifier.'); return; }
    if (!wearableData) setWearableData({ file: null, manual });
    navigate('/questionnaire');
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* File upload */}
      <div
        {...getRootProps()}
        style={{
          border: `2px dashed ${isDragActive ? 'var(--accent)' : 'var(--line)'}`,
          borderRadius: 12, padding: '36px 24px', textAlign: 'center',
          background: isDragActive ? 'rgba(139,92,246,.06)' : 'var(--slate)',
          cursor: 'pointer', transition: 'border-color .2s, background .2s',
        }}
      >
        <input {...getInputProps()} />
        <div style={{ fontSize: 28, marginBottom: 10 }}>⌚</div>
        {wearableFile ? (
          <>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--accent2)', marginBottom: 4 }}>
              ✓ {wearableFile.name}
            </div>
            <div style={{ fontSize: 12, color: 'var(--fog)', marginBottom: 10 }}>
              {(wearableFile.size / 1024).toFixed(0)} KB
            </div>
            <button className="btn btn-sm" type="button" onClick={clearFile}>Remove file</button>
          </>
        ) : (
          <>
            <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--white)', marginBottom: 6 }}>
              {isDragActive ? 'Drop export file here' : 'Drop your wearable export here'}
            </div>
            <div style={{ fontSize: 12, color: 'var(--fog)', marginBottom: 4 }}>
              Apple Health (XML) · Fitbit / Health Auto Export (CSV) · JSON
            </div>
            <div style={{ fontSize: 11, color: 'var(--accent2)', marginBottom: 14 }}>
              In Apple Health: tap your profile → Export All Health Data
            </div>
            <button className="btn btn-sm btn-primary" type="button">Browse files</button>
          </>
        )}
      </div>

      {/* Manual entry */}
      <div className="card" style={{ padding: '18px 20px' }}>
        <div className="section-label">Or enter metrics manually</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <Field label="HRV — SDNN (ms)" placeholder="e.g. 42"
            value={manual.hrv} onChange={v => handleManualChange('hrv', v)} type="number" />
          <Field label="Resting heart rate (bpm)" placeholder="e.g. 62"
            value={manual.heartRate} onChange={v => handleManualChange('heartRate', v)} type="number" />
          <Field label="Average sleep (hours/night)" placeholder="e.g. 7.2"
            value={manual.sleepHours} onChange={v => handleManualChange('sleepHours', v)} type="number" />
          <Field label="Exercise days per week" placeholder="e.g. 3"
            value={manual.exerciseDays} onChange={v => handleManualChange('exerciseDays', v)} type="number" />
        </div>
      </div>

      {error && <ErrorBox>{error}</ErrorBox>}

      <div className="card" style={{ padding: '18px 20px' }}>
        <div className="section-label">About you</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <Field label="Name / identifier *" placeholder="e.g. Alex"
            value={subjectMeta.id} onChange={v => setSubjectMeta(p => ({ ...p, id: v }))} />
          <Field label="Age" placeholder="e.g. 29" type="number"
            value={subjectMeta.age} onChange={v => setSubjectMeta(p => ({ ...p, age: v }))} />
          <SelectField label="Sex" value={subjectMeta.sex} onChange={v => setSubjectMeta(p => ({ ...p, sex: v }))} />
          <Field label="Notes (optional)" placeholder="Recent events, sleep changes, etc."
            value={subjectMeta.notes} onChange={v => setSubjectMeta(p => ({ ...p, notes: v }))} />
        </div>
      </div>

      <button className="btn btn-primary btn-lg" onClick={handleSubmit} style={{ alignSelf: 'flex-start' }}>
        Continue to questionnaire →
      </button>
    </div>
  );
}

/* ── Shared sub-components ───────────────────────────────────────────────── */
function ErrorBox({ children }) {
  return (
    <div style={{
      padding: '10px 14px', borderRadius: 8,
      background: 'rgba(248,81,73,.08)', border: '1px solid rgba(248,81,73,.25)',
      fontSize: 13, color: '#fca5a5',
    }}>
      {children}
    </div>
  );
}

function Field({ label, placeholder, value, onChange, type = 'text' }) {
  return (
    <div>
      <label style={{ fontSize: 11, color: 'var(--fog)', display: 'block', marginBottom: 5 }}>{label}</label>
      <input
        type={type} placeholder={placeholder} value={value}
        onChange={e => onChange(e.target.value)}
        className="field-dark"
      />
    </div>
  );
}

function SelectField({ label, value, onChange }) {
  return (
    <div>
      <label style={{ fontSize: 11, color: 'var(--fog)', display: 'block', marginBottom: 5 }}>{label}</label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="field-dark"
      >
        <option value="">Not specified</option>
        <option value="F">Female</option>
        <option value="M">Male</option>
      </select>
    </div>
  );
}
