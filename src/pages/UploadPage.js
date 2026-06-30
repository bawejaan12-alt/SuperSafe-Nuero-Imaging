import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';
import NeuralBackground from '../components/NeuralBackground';

/* ── How it works steps ─────────────────────────────────────────────────── */
const CLINICIAN_STEPS = [
  { n: 1, title: 'Upload your scan',   body: 'NIfTI volumes (.nii / .nii.gz). The model accepts standard resting-state fMRI output from most major scanners.' },
  { n: 2, title: 'Preprocessing',      body: 'The BOLD signal is resampled, normalised, and fALFF computed for the CNN.' },
  { n: 3, title: 'Prediction',         body: 'The model outputs trait anxiety, chronic stress, and neuroticism estimates with a Grad-CAM heatmap showing which regions drove the prediction.' },
  { n: 4, title: 'Review and export',  body: 'Download a PDF report or save to the patient\'s history.' },
];

const PERSONAL_STEPS = [
  { n: 1, title: 'Upload your data',   body: 'Export from Apple Health (XML) or Fitbit / Health Auto Export (CSV), or enter metrics manually.' },
  { n: 2, title: 'Pattern extraction', body: 'HRV, resting heart rate, sleep quality, and activity levels are parsed from your data.' },
  { n: 3, title: 'Wellbeing analysis', body: 'Patterns are cross-referenced with reference profiles to estimate stress and anxiety markers.' },
  { n: 4, title: 'Review and export',  body: 'Plain-English summary, trend charts, and personalised recommendations.' },
];

export default function UploadPage({
  userRole,
  uploadedFile, setUploadedFile,
  wearableData, setWearableData,
  subjectMeta,  setSubjectMeta,
}) {
  const isClinician = userRole === 'clinician';
  const steps = isClinician ? CLINICIAN_STEPS : PERSONAL_STEPS;

  return (
    <div style={{
      minHeight: 'calc(100vh - 52px)',
      background: 'var(--ink)',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      padding: '28px 20px',
    }}>
      {/* Outer card */}
      <div style={{
        width: '100%', maxWidth: 1080,
        background: 'var(--slate)',
        border: '1px solid var(--line)',
        borderRadius: 14,
        display: 'grid',
        gridTemplateColumns: '1fr 1px 340px',
        overflow: 'hidden',
        boxShadow: 'var(--shadow)',
      }}>

        {/* ── Left column ──────────────────────────────────────────────── */}
        <div style={{ padding: '32px 32px 28px', display: 'flex', flexDirection: 'column', gap: 20 }}>
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

        {/* ── Vertical divider ─────────────────────────────────────────── */}
        <div style={{ background: 'var(--line)' }} />

        {/* ── Right column: How it works ───────────────────────────────── */}
        <div style={{ padding: '32px 28px', background: 'var(--surface-light)' }}>
          <h2 style={{
            fontSize: 22, fontWeight: 600, color: 'var(--white)',
            marginBottom: 28, letterSpacing: '-.01em',
          }}>
            How it works
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {steps.map((s, i) => (
              <div key={s.n} style={{ display: 'flex', gap: 14, paddingBottom: i < steps.length - 1 ? 24 : 0, position: 'relative' }}>
                {i < steps.length - 1 && (
                  <div style={{
                    position: 'absolute', left: 19, top: 42,
                    width: 1, height: 'calc(100% - 20px)',
                    background: 'var(--line)',
                  }} />
                )}
                <div className="step-circle">{s.n}</div>
                <div style={{ paddingTop: 6 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--white)', marginBottom: 4 }}>
                    {s.title}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--fog)', lineHeight: 1.55 }}>
                    {s.body}
                  </div>
                </div>
              </div>
            ))}
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
    if (!/\.(nii|gz)$/i.test(f.name)) { setError('Please upload a NIfTI file (.nii or .nii.gz).'); return; }
    setUploadedFile(f);
  }, [setUploadedFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, multiple: false,
    accept: { 'application/octet-stream': ['.nii', '.gz'] },
  });

  function handleSubmit() {
    if (!uploadedFile) { setError('Please select a scan file first.'); return; }
    if (!subjectMeta.id.trim()) { setError('Please enter a Subject ID.'); return; }
    navigate('/processing');
  }

  function clearFile(e) { e.stopPropagation(); setUploadedFile(null); setError(''); }

  return (
    <>
      {/* Title */}
      <div>
        <h1 style={{ fontSize: 24, fontWeight: 600, color: 'var(--white)', marginBottom: 4 }}>
          Upload MRI Scan
        </h1>
        <p style={{ fontSize: 13, color: 'var(--fog)' }}>
          Accepted formats: NIfTI (.nii / .nii.gz)
        </p>
      </div>

      {/* Dropzone */}
      <div
        {...getRootProps()}
        style={{
          border: `2px dashed ${isDragActive ? 'var(--accent)' : '#3a3a45'}`,
          borderRadius: 10,
          padding: '52px 24px',
          textAlign: 'center',
          background: isDragActive ? 'rgba(139,92,246,.06)' : 'transparent',
          cursor: 'pointer',
          transition: 'border-color .2s, background .2s',
        }}
      >
        <input {...getInputProps()} />
        {uploadedFile ? (
          <>
            <div style={{ fontSize: 32, marginBottom: 10 }}>✓</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--accent2)', marginBottom: 4 }}>
              {uploadedFile.name}
            </div>
            <div style={{ fontSize: 12, color: 'var(--fog)', marginBottom: 12 }}>
              {(uploadedFile.size / 1024).toFixed(0)} KB
            </div>
            <button className="btn btn-sm" type="button" onClick={clearFile}>Remove file</button>
          </>
        ) : (
          <>
            <div style={{ marginBottom: 10 }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--fog)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 8px' }}>
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--white)', marginBottom: 4 }}>
              {isDragActive ? 'Drop here' : 'Drop files here'}
            </div>
            <div style={{ fontSize: 13, color: 'var(--fog)', marginBottom: 16 }}>
              or click to browse your computer
            </div>
            <button className="btn btn-sm" type="button" style={{ pointerEvents: 'none' }}>
              Choose File
            </button>
          </>
        )}
      </div>

      {error && <ErrorBox>{error}</ErrorBox>}

      {/* Bottom row: Subject details + Run Analysis */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 220px', gap: 16, alignItems: 'start' }}>

        {/* Subject details */}
        <div style={{
          background: 'var(--surface-light)', border: '1px solid var(--line)',
          borderRadius: 10, padding: '18px 20px',
        }}>
          <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--white)', marginBottom: 14 }}>
            Subject details
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Field label="Subject ID" placeholder="e.g. SUB-042"
              value={subjectMeta.id} onChange={v => setSubjectMeta(p => ({ ...p, id: v }))} />
            <Field label="Age" placeholder="e.g. 27" type="number"
              value={subjectMeta.age} onChange={v => setSubjectMeta(p => ({ ...p, age: v }))} />
            <SelectField label="Sex" value={subjectMeta.sex} onChange={v => setSubjectMeta(p => ({ ...p, sex: v }))} />
            <Field label="Clinical Notes" placeholder="Optional"
              value={subjectMeta.notes} onChange={v => setSubjectMeta(p => ({ ...p, notes: v }))} />
          </div>
        </div>

        {/* Run Analysis card */}
        <div style={{
          background: 'var(--surface-light)', border: '1px solid var(--line)',
          borderRadius: 10, padding: '18px 20px',
          display: 'flex', flexDirection: 'column', gap: 14,
        }}>
          <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--white)' }}>
            Run Analysis
          </div>
          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            style={{ width: '100%', justifyContent: 'center', padding: '11px 0', fontSize: 15, borderRadius: 8 }}
          >
            Run ↗
          </button>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--danger)', marginBottom: 4 }}>
              Research use only
            </div>
            <div style={{ fontSize: 11, color: 'var(--fog)', lineHeight: 1.55 }}>
              This tool does not constitute a clinical diagnosis. All output should be reviewed and is not meant for clinical purposes.
            </div>
          </div>
        </div>

      </div>
    </>
  );
}

/* ── Personal upload panel ──────────────────────────────────────────────── */
function PersonalUpload({ wearableData, setWearableData, subjectMeta, setSubjectMeta }) {
  const navigate = useNavigate();
  const [error, setError]               = useState('');
  const [wearableFile, setWearableFile] = useState(null);
  const [manual, setManual]             = useState({ hrv: '', heartRate: '', sleepHours: '', exerciseDays: '' });

  const onDrop = useCallback(files => {
    setError('');
    const f = files[0];
    if (!f) return;
    if (!/\.(csv|xml|json)$/i.test(f.name)) { setError('Please upload a CSV, XML, or JSON file.'); return; }
    setWearableFile(f);
    setWearableData({ file: f, manual });
  }, [setWearableData, manual]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, multiple: false,
    accept: { 'text/csv': ['.csv'], 'text/xml': ['.xml'], 'application/json': ['.json'] },
  });

  function clearFile(e) { e.stopPropagation(); setWearableFile(null); setWearableData(null); setError(''); }

  function handleManualChange(field, value) {
    const next = { ...manual, [field]: value };
    setManual(next);
    setWearableData(wearableFile ? { file: wearableFile, manual: next } : { file: null, manual: next });
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
    <>
      <div>
        <h1 style={{ fontSize: 24, fontWeight: 600, color: 'var(--white)', marginBottom: 4 }}>
          Upload Health Data
        </h1>
        <p style={{ fontSize: 13, color: 'var(--fog)' }}>
          Accepted formats: CSV, XML (Apple Health), JSON
        </p>
      </div>

      {/* Dropzone */}
      <div
        {...getRootProps()}
        style={{
          border: `2px dashed ${isDragActive ? 'var(--accent)' : '#3a3a45'}`,
          borderRadius: 10, padding: '44px 24px', textAlign: 'center',
          background: isDragActive ? 'rgba(139,92,246,.06)' : 'transparent',
          cursor: 'pointer', transition: 'border-color .2s, background .2s',
        }}
      >
        <input {...getInputProps()} />
        {wearableFile ? (
          <>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--accent2)', marginBottom: 4 }}>✓ {wearableFile.name}</div>
            <div style={{ fontSize: 12, color: 'var(--fog)', marginBottom: 12 }}>{(wearableFile.size / 1024).toFixed(0)} KB</div>
            <button className="btn btn-sm" type="button" onClick={clearFile}>Remove</button>
          </>
        ) : (
          <>
            <div style={{ fontSize: 26, marginBottom: 8 }}>⌚</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--white)', marginBottom: 4 }}>
              {isDragActive ? 'Drop here' : 'Drop your wearable export here'}
            </div>
            <div style={{ fontSize: 12, color: 'var(--fog)', marginBottom: 4 }}>
              Apple Health (XML) · Fitbit CSV · JSON
            </div>
            <div style={{ fontSize: 11, color: 'var(--accent2)', marginBottom: 14 }}>
              Apple Health: tap your profile → Export All Health Data
            </div>
            <button className="btn btn-sm" type="button" style={{ pointerEvents: 'none' }}>Choose File</button>
          </>
        )}
      </div>

      {/* Manual entry */}
      <div style={{ background: 'var(--surface-light)', border: '1px solid var(--line)', borderRadius: 10, padding: '18px 20px' }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--white)', marginBottom: 12 }}>Or enter metrics manually</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Field label="HRV — SDNN (ms)" placeholder="e.g. 42" value={manual.hrv} onChange={v => handleManualChange('hrv', v)} type="number" />
          <Field label="Resting heart rate (bpm)" placeholder="e.g. 62" value={manual.heartRate} onChange={v => handleManualChange('heartRate', v)} type="number" />
          <Field label="Avg sleep (hrs/night)" placeholder="e.g. 7.2" value={manual.sleepHours} onChange={v => handleManualChange('sleepHours', v)} type="number" />
          <Field label="Exercise days/week" placeholder="e.g. 3" value={manual.exerciseDays} onChange={v => handleManualChange('exerciseDays', v)} type="number" />
        </div>
      </div>

      {error && <ErrorBox>{error}</ErrorBox>}

      {/* Bottom row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 220px', gap: 16, alignItems: 'start' }}>
        <div style={{ background: 'var(--surface-light)', border: '1px solid var(--line)', borderRadius: 10, padding: '18px 20px' }}>
          <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--white)', marginBottom: 14 }}>About you</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Field label="Name / identifier" placeholder="e.g. Alex" value={subjectMeta.id} onChange={v => setSubjectMeta(p => ({ ...p, id: v }))} />
            <Field label="Age" placeholder="e.g. 29" type="number" value={subjectMeta.age} onChange={v => setSubjectMeta(p => ({ ...p, age: v }))} />
            <SelectField label="Sex" value={subjectMeta.sex} onChange={v => setSubjectMeta(p => ({ ...p, sex: v }))} />
            <Field label="Notes" placeholder="Optional" value={subjectMeta.notes} onChange={v => setSubjectMeta(p => ({ ...p, notes: v }))} />
          </div>
        </div>

        <div style={{ background: 'var(--surface-light)', border: '1px solid var(--line)', borderRadius: 10, padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--white)' }}>Continue</div>
          <button className="btn btn-primary" onClick={handleSubmit} style={{ width: '100%', justifyContent: 'center', padding: '11px 0', fontSize: 15, borderRadius: 8 }}>
            Next →
          </button>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--danger)', marginBottom: 4 }}>Research use only</div>
            <div style={{ fontSize: 11, color: 'var(--fog)', lineHeight: 1.55 }}>
              This tool does not constitute a clinical diagnosis.
            </div>
          </div>
        </div>
      </div>
    </>
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
      <select value={value} onChange={e => onChange(e.target.value)} className="field-dark">
        <option value="">Not specified</option>
        <option value="F">Female</option>
        <option value="M">Male</option>
      </select>
    </div>
  );
}
