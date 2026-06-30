import React from 'react';
import { useNavigate } from 'react-router-dom';
import GradCamViewer from '../components/GradCamViewer';

const CONDITION_META = {
  none:     { label: 'No elevated stress',      badge: 'badge-teal',  color: '#0E7F6F' },
  mild:     { label: 'Mild stress indicators',  badge: 'badge-amber', color: '#996800' },
  moderate: { label: 'Elevated stress markers', badge: 'badge-red',   color: '#B91C1C' },
};

const CONDITION_COLORS = { none: '#7EE7D0', mild: '#F0A500', moderate: '#F85149' };

const WB_META = {
  neuroticism:   { label: 'Neuroticism',     unit: '/4',  desc: 'NEO-FFI personality scale' },
  traitAnxiety:  { label: 'Trait anxiety',   unit: '/80', desc: 'STAI trait subscale' },
  chronicStress: { label: 'Chronic stress',  unit: '/40', desc: 'TICS screening score' },
};

export default function ResultsPage({ result }) {
  const navigate = useNavigate();

  if (!result) {
    return (
      <div style={{ padding: 48, textAlign: 'center' }}>
        <p style={{ color: '#57606A', marginBottom: 16 }}>No results to display.</p>
        <button className="btn btn-primary" onClick={() => navigate('/upload')}>
          Upload a scan
        </button>
      </div>
    );
  }

  const meta = CONDITION_META[result.topCondition] || CONDITION_META.mild;

  return (
    <div className="fade-up" style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 24px 48px' }}>

      {/* ── Top bar ──────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <button className="btn btn-sm" onClick={() => navigate('/upload')}>← New scan</button>
          <h1 style={{ fontSize: 17, fontWeight: 600, color: '#24292F' }}>
            {result.subjectId} — Wellbeing analysis
          </h1>
          <span className={`badge ${meta.badge}`}>{meta.label}</span>
          <span className={`badge ${result.confidence === 'High' ? 'badge-teal' : result.confidence === 'Medium' ? 'badge-amber' : 'badge-red'}`}>
            {result.confidence} confidence
          </span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-sm" onClick={() => window.print()}>Export PDF</button>
          <button className="btn btn-sm" onClick={() => navigate('/history')}>View history</button>
        </div>
      </div>

      {/* ── Summary banner ───────────────────────────────────────────────── */}
      <div style={{
        background: '#0D1117', borderRadius: 12, padding: '18px 22px', marginBottom: 20,
        display: 'flex', gap: 20, alignItems: 'flex-start', flexWrap: 'wrap',
      }}>
        <div style={{ flex: 1, minWidth: 260 }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: '#7EE7D0', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 6 }}>
            Summary
          </div>
          <p style={{ fontSize: 14, color: '#C9D1D9', lineHeight: 1.7 }}>{result.summary}</p>
        </div>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <Stat label="Condition"   value={result.topCondition} sub={meta.label} color={meta.color} />
          <Stat label="Probability" value={`${Math.round(result.conditionProbs[result.topCondition] * 100)}%`} sub="posterior" />
          <Stat label="Entropy"     value={result.entropy.toFixed(2)} sub="low = certain" />
        </div>
      </div>

      {/* ── Three columns ────────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr) minmax(0,1fr)', gap: 16 }}>

        {/* Column 1: Condition probabilities + wellbeing scores */}
        <div className="card">
          <div className="section-label">Stress condition probabilities</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 18 }}>
            {Object.entries(result.conditionProbs)
              .sort(([, a], [, b]) => b - a)
              .map(([cls, prob]) => (
                <ProbRow
                  key={cls}
                  label={cls}
                  sublabel={CONDITION_META[cls]?.label}
                  prob={prob}
                  color={CONDITION_COLORS[cls]}
                  isTop={cls === result.topCondition}
                />
              ))}
          </div>

          <hr className="divider" style={{ margin: '18px 0' }} />
          <div className="section-label">Wellbeing scores</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {Object.entries(result.wellbeing).map(([key, val]) => (
              <WellbeingRow key={key} keyName={key} value={val} />
            ))}
          </div>
        </div>

        {/* Column 2: Grad-CAM */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div className="section-label">Grad-CAM brain activation</div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <GradCamViewer condition={result.topCondition} size={200} />
          </div>

          <hr className="divider" />
          <div className="section-label">Top activated regions</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {result.regions.map(r => (
              <div key={r.name} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 13, color: '#24292F', flex: 1 }}>{r.name}</span>
                <div style={{ width: 70, height: 4, background: '#EFF1F3', borderRadius: 99, overflow: 'hidden' }}>
                  <div style={{
                    width: `${r.score * 100}%`, height: '100%', borderRadius: 99,
                    background: r.score > 0.7 ? '#F85149' : r.score > 0.4 ? '#F0A500' : '#7EE7D0',
                  }} />
                </div>
                <span style={{
                  fontFamily: 'var(--mono)', fontSize: 12,
                  color: r.score > 0.7 ? '#B91C1C' : '#57606A', minWidth: 32, textAlign: 'right',
                }}>
                  {r.score.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Column 3: Actions + model info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div className="section-label">Actions</div>
            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => window.print()}>
              Download report (PDF)
            </button>
            <button className="btn" style={{ width: '100%', justifyContent: 'center' }} onClick={() => navigate('/history')}>
              View all history
            </button>
            <button className="btn" style={{ width: '100%', justifyContent: 'center' }} onClick={() => navigate('/upload')}>
              Analyse another scan
            </button>
          </div>

          <div className="card">
            <div className="section-label">Model provenance</div>
            <MetaRow label="Architecture"  value="3D CNN, 10 layers" />
            <MetaRow label="Dataset"       value="MPI-LEMON" />
            <MetaRow label="Targets"       value="Stress · NEO · STAI · TICS" />
            <MetaRow label="Interpretability" value="Grad-CAM (last conv block)" />
          </div>

          <div style={{ padding: '12px 16px', borderRadius: 10, background: 'rgba(240,165,0,.06)', border: '1px solid rgba(240,165,0,.2)' }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#996800', marginBottom: 4 }}>Research use only</div>
            <div style={{ fontSize: 12, color: '#57606A', lineHeight: 1.5 }}>
              This report does not constitute a clinical diagnosis. Wellbeing indicators
              should be interpreted alongside professional assessment.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Small components ──────────────────────────────────────────────────────────

function ProbRow({ label, sublabel, prob, color, isTop }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <div>
          <span style={{ fontSize: 13, fontWeight: isTop ? 600 : 400, color: isTop ? '#24292F' : '#57606A', textTransform: 'capitalize' }}>
            {label}
          </span>
          {sublabel && <span style={{ fontSize: 12, color: '#8B949E', marginLeft: 6 }}>{sublabel}</span>}
        </div>
        <span style={{ fontFamily: 'var(--mono)', fontSize: 13, fontWeight: isTop ? 600 : 400, color: isTop ? color : '#8B949E' }}>
          {Math.round(prob * 100)}%
        </span>
      </div>
      <div className="prob-track">
        <div className="prob-fill" style={{ width: `${prob * 100}%`, background: color }} />
      </div>
    </div>
  );
}

function WellbeingRow({ keyName, value }) {
  const meta = WB_META[keyName] || { label: keyName, unit: '', desc: '' };
  const z = value.zscore;
  const absZ = Math.min(Math.abs(z), 3);
  const pct  = 50 + (z / 3) * 50;   // map z-score [-3,3] to [0,100]%
  const color = z > 1 ? '#F85149' : z > 0.3 ? '#F0A500' : z < -0.5 ? '#7EE7D0' : '#4F6BED';

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <div>
          <span style={{ fontSize: 13, color: '#24292F', fontWeight: 500 }}>{meta.label}</span>
          <span style={{ fontSize: 11, color: '#8B949E', marginLeft: 6 }}>{meta.desc}</span>
        </div>
        <span style={{ fontFamily: 'var(--mono)', fontSize: 12, color, fontWeight: 500 }}>
          {z > 0 ? '+' : ''}{z.toFixed(1)}σ
        </span>
      </div>
      <div style={{ position: 'relative', height: 5, background: '#EFF1F3', borderRadius: 99 }}>
        <div style={{ position: 'absolute', left: '50%', top: -2, width: 1, height: 9, background: '#D0D7DE' }} />
        <div style={{
          position: 'absolute', top: -1.5, width: 8, height: 8, borderRadius: '50%',
          left: `calc(${pct}% - 4px)`, background: color, border: '2px solid #fff', boxShadow: '0 0 0 1px ' + color,
        }} />
      </div>
      <div style={{ fontSize: 10, color: '#8B949E', marginTop: 2 }}>
        Raw score: {value.raw.toFixed(1)} {meta.unit}
      </div>
    </div>
  );
}

function Stat({ label, value, sub, color }) {
  return (
    <div style={{ minWidth: 80 }}>
      <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: '#8B949E', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '.06em' }}>
        {label}
      </div>
      <div style={{ fontFamily: 'var(--mono)', fontSize: 22, fontWeight: 500, color: color || '#F0F6FC', lineHeight: 1, textTransform: 'capitalize' }}>
        {value}
      </div>
      {sub && <div style={{ fontSize: 11, color: '#8B949E', marginTop: 3 }}>{sub}</div>}
    </div>
  );
}

function MetaRow({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid #F0F2F4' }}>
      <span style={{ fontSize: 12, color: '#8B949E' }}>{label}</span>
      <span style={{ fontSize: 12, color: '#24292F', fontFamily: 'var(--mono)' }}>{value}</span>
    </div>
  );
}
