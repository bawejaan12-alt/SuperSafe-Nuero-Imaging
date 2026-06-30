import React from 'react';
import { useNavigate } from 'react-router-dom';
import GradCamViewer from '../components/GradCamViewer';

const CLASS_META = {
  MID: { label: 'Mild dementia',      badge: 'badge-amber', color: '#996800' },
  MOD: { label: 'Moderate dementia',  badge: 'badge-red',   color: '#B91C1C' },
  NOD: { label: 'No dementia',        badge: 'badge-teal',  color: '#0E7F6F' },
  VMD: { label: 'Very mild dementia', badge: 'badge-blue',  color: '#4F6BED' },
};

const PROB_COLORS = {
  MID: '#F0A500',
  MOD: '#F85149',
  NOD: '#7EE7D0',
  VMD: '#4F6BED',
};

export default function ResultsPage({ result, subjectMeta }) {
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

  const meta = CLASS_META[result.topClass] || CLASS_META.MID;

  return (
    <div className="fade-up" style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 24px 48px' }}>

      {/* ── Top bar ──────────────────────────────────────────────────────── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 12, marginBottom: 24,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button className="btn btn-sm" onClick={() => navigate('/upload')}>
            ← New scan
          </button>
          <h1 style={{ fontSize: 17, fontWeight: 600, color: '#24292F' }}>
            {result.subjectId || 'SUB-000'} — Analysis results
          </h1>
          <span className={`badge ${meta.badge}`}>{result.topClass} · {meta.label}</span>
          <span className={`badge ${result.confidence === 'High' ? 'badge-teal' : 'badge-amber'}`}>
            {result.confidence} confidence
          </span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-sm" onClick={() => window.print()}>Export PDF</button>
          <button className="btn btn-sm" onClick={() => navigate('/history')}>
            View history
          </button>
        </div>
      </div>

      {/* ── Summary banner ───────────────────────────────────────────────── */}
      <div style={{
        background: '#0D1117', borderRadius: 12, padding: '18px 22px',
        marginBottom: 20, display: 'flex', gap: 20, alignItems: 'flex-start',
        flexWrap: 'wrap',
      }}>
        <div style={{ flex: 1, minWidth: 260 }}>
          <div style={{
            fontFamily: 'var(--mono)', fontSize: 10, color: '#4F6BED',
            letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 6,
          }}>
            Summary
          </div>
          <p style={{ fontSize: 14, color: '#C9D1D9', lineHeight: 1.7 }}>
            {result.summary}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <Stat label="Top stage"  value={result.topClass} sub={meta.label}    color={meta.color} />
          <Stat label="Probability" value={`${Math.round(result.topProb * 100)}%`} sub="posterior" />
          <Stat label="Entropy"    value={result.entropy.toFixed(2)} sub="low = certain" />
        </div>
      </div>

      {/* ── Three columns ────────────────────────────────────────────────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr) minmax(0,1fr)',
        gap: 16,
      }}>

        {/* Column 1: Stage probabilities */}
        <div className="card">
          <div className="section-label">Stage probabilities</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {Object.entries(result.probs)
              .sort(([,a],[,b]) => b - a)
              .map(([cls, prob]) => (
                <ProbRow
                  key={cls}
                  label={cls}
                  sublabel={CLASS_META[cls]?.label}
                  prob={prob}
                  color={PROB_COLORS[cls]}
                  isTop={cls === result.topClass}
                />
              ))
            }
          </div>

          <hr className="divider" style={{ margin: '18px 0' }} />
          <div className="section-label">Scan details</div>
          <MetaRow label="Subject ID"    value={result.subjectId} />
          <MetaRow label="Analysis date" value={result.date} />
          <MetaRow label="Model"         value="NeuroCNN v1.2" />
          <MetaRow label="Scan quality"  value="Passed" valueColor="#0E7F6F" />
        </div>

        {/* Column 2: Grad-CAM */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div className="section-label">Grad-CAM brain activation</div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <GradCamViewer topClass={result.topClass} size={200} />
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
                    background: r.score > 0.7 ? '#F85149' : r.score > 0.4 ? '#F0A500' : '#4F6BED',
                  }} />
                </div>
                <span style={{
                  fontFamily: 'var(--mono)', fontSize: 12,
                  color: r.score > 0.7 ? '#B91C1C' : '#57606A',
                  minWidth: 32, textAlign: 'right',
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
            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}
              onClick={() => window.print()}>
              Download report (PDF)
            </button>
            <button className="btn" style={{ width: '100%', justifyContent: 'center' }}
              onClick={() => navigate('/history')}>
              View all history
            </button>
            <button className="btn" style={{ width: '100%', justifyContent: 'center' }}
              onClick={() => navigate('/upload')}>
              Analyse another scan
            </button>
          </div>

          <div className="card">
            <div className="section-label">Model provenance</div>
            <MetaRow label="Architecture" value="2D ResNet CNN" />
            <MetaRow label="Dataset"      value="MCND (Alzheimer's)" />
            <MetaRow label="Classes"      value="MID · MOD · NOD · VMD" />
            <MetaRow label="Val. AUC"     value="0.84 macro" />
            <MetaRow label="Interpretability" value="Grad-CAM (enc4)" />
          </div>

          <div style={{
            padding: '12px 16px', borderRadius: 10,
            background: 'rgba(240,165,0,.06)',
            border: '1px solid rgba(240,165,0,.2)',
          }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#996800', marginBottom: 4 }}>
              Research use only
            </div>
            <div style={{ fontSize: 12, color: '#57606A', lineHeight: 1.5 }}>
              This report is AI-generated and does not constitute a clinical diagnosis.
              All findings must be reviewed by a qualified clinician.
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
          <span style={{
            fontSize: 13, fontWeight: isTop ? 600 : 400,
            color: isTop ? '#24292F' : '#57606A',
          }}>
            {label}
          </span>
          {sublabel && (
            <span style={{ fontSize: 12, color: '#8B949E', marginLeft: 6 }}>
              {sublabel}
            </span>
          )}
        </div>
        <span style={{
          fontFamily: 'var(--mono)', fontSize: 13,
          fontWeight: isTop ? 600 : 400,
          color: isTop ? color : '#8B949E',
        }}>
          {Math.round(prob * 100)}%
        </span>
      </div>
      <div className="prob-track">
        <div className="prob-fill" style={{ width: `${prob * 100}%`, background: color }} />
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
      <div style={{ fontFamily: 'var(--mono)', fontSize: 22, fontWeight: 500, color: color || '#F0F6FC', lineHeight: 1 }}>
        {value}
      </div>
      {sub && <div style={{ fontSize: 11, color: '#8B949E', marginTop: 3 }}>{sub}</div>}
    </div>
  );
}

function MetaRow({ label, value, valueColor }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid #F0F2F4' }}>
      <span style={{ fontSize: 12, color: '#8B949E' }}>{label}</span>
      <span style={{ fontSize: 12, color: valueColor || '#24292F', fontFamily: 'var(--mono)' }}>{value}</span>
    </div>
  );
}
