import React, { useState } from 'react';

export default function LemonImportGuide() {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ border: '1px solid #E1E4E8', borderRadius: 10, overflow: 'hidden' }}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '14px 18px', background: '#F6F8FA', border: 'none', cursor: 'pointer', textAlign: 'left',
        }}
      >
        <span style={{ fontSize: 13, fontWeight: 600, color: '#24292F' }}>MPI-LEMON dataset import guide</span>
        <span style={{ color: '#8B949E', fontSize: 12 }}>{open ? '▲ Collapse' : '▼ Expand'}</span>
      </button>

      {open && (
        <div style={{ padding: '18px 20px', background: '#FFFFFF', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Section title="About the dataset">
            The Leipzig Study for Mind-Body-Emotion Interactions (LEMON) dataset is a multi-modal dataset from the
            Max Planck Institute. It contains resting-state fMRI, EEG, physiological, and behavioural data from
            228 healthy young adults (aged 20–35) and 153 older adults (aged 59–77).
          </Section>

          <Section title="Download">
            The dataset is available through OpenNeuro at <code>ds000221</code>.
            Visit <strong>openneuro.org</strong> and search for "LEMON" or use the CLI:
            <pre style={{ margin: '8px 0 0', padding: '10px 14px', background: '#F6F8FA', borderRadius: 6, fontSize: 12, fontFamily: 'var(--mono)', overflowX: 'auto' }}>
{`openneuro download --snapshot 1.0.0 ds000221 ./lemon`}
            </pre>
          </Section>

          <Section title="Expected file structure">
            <pre style={{ margin: '8px 0 0', padding: '10px 14px', background: '#F6F8FA', borderRadius: 6, fontSize: 12, fontFamily: 'var(--mono)', overflowX: 'auto' }}>
{`lemon/
  sub-010002/
    func/
      sub-010002_task-rest_bold.nii.gz   ← upload this
  sub-010003/
    ...`}
            </pre>
          </Section>

          <Section title="Preprocessing steps">
            Before uploading to this app:
            <ol style={{ margin: '8px 0 0', paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 4 }}>
              <li style={{ fontSize: 13, color: '#57606A' }}>Remove the first 5 volumes (dummy scans).</li>
              <li style={{ fontSize: 13, color: '#57606A' }}>Slice-timing correction and motion correction (fMRIPrep recommended).</li>
              <li style={{ fontSize: 13, color: '#57606A' }}>Spatial normalisation to MNI152 space.</li>
              <li style={{ fontSize: 13, color: '#57606A' }}>Spatial smoothing with a 6 mm FWHM Gaussian kernel.</li>
              <li style={{ fontSize: 13, color: '#57606A' }}>Upload the preprocessed <code>_bold.nii.gz</code> file — the model handles mean-image extraction and resampling.</li>
            </ol>
          </Section>

          <Section title="Companion phenotypic data">
            Questionnaire scores (NEO-FFI, STAI, TICS) are available in <code>phenotype/</code> within the dataset.
            The PHQ-9 and GAD-7 data used in this app can be cross-referenced with the LEMON CESD and BAI instruments.
          </Section>
        </div>
      )}
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div>
      <div style={{ fontSize: 12, fontWeight: 600, color: '#24292F', marginBottom: 6 }}>{title}</div>
      <div style={{ fontSize: 13, color: '#57606A', lineHeight: 1.6 }}>{children}</div>
    </div>
  );
}
