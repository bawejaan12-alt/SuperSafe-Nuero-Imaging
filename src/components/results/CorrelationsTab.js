import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CorrelationsTab({ result, userRole }) {
  const navigate = useNavigate();
  const insights = result.multiModalInsights;

  if (!insights || insights.length === 0) {
    return (
      <div style={{ padding: '48px 0', textAlign: 'center' }}>
        <div style={{ fontSize: 32, marginBottom: 14 }}>🔗</div>
        <div style={{ fontSize: 16, fontWeight: 600, color: '#24292F', marginBottom: 8 }}>No correlation data</div>
        <div style={{ fontSize: 13, color: '#57606A', marginBottom: 20, maxWidth: 380, margin: '0 auto 20px' }}>
          Complete the questionnaire during your next scan to see how fMRI signals correlate with self-reported and physiological indicators.
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/upload')}>
          Start a new scan
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ padding: '12px 16px', borderRadius: 8, background: 'rgba(79,107,237,.06)', border: '1px solid rgba(79,107,237,.2)' }}>
        <div style={{ fontSize: 13, color: '#4F6BED', lineHeight: 1.5 }}>
          Multi-modal correlations compare what your brain scan shows with what you reported in your questionnaire and physiological readings.
          Concordant results mean the signals agree; discordant results are often clinically informative.
        </div>
      </div>

      {insights.map((insight, i) => (
        <InsightRow key={i} insight={insight} researcherMode={userRole === 'researcher'} />
      ))}
    </div>
  );
}

function InsightRow({ insight, researcherMode }) {
  const [expanded, setExpanded] = useState(false);
  const isConcordant = insight.alignment === 'concordant';

  return (
    <div className="card" style={{ padding: '16px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>

        {/* Domain */}
        <div style={{ minWidth: 110 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#24292F' }}>{insight.domain}</div>
          <span style={{
            display: 'inline-block', marginTop: 4, fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 99,
            background: isConcordant ? 'rgba(126,231,208,.15)' : 'rgba(240,165,0,.12)',
            color: isConcordant ? '#0E7F6F' : '#996800',
            border: `1px solid ${isConcordant ? 'rgba(126,231,208,.3)' : 'rgba(240,165,0,.3)'}`,
          }}>
            {isConcordant ? 'Concordant' : 'Discordant'}
          </span>
        </div>

        {/* Signal bars — researcher only */}
        {researcherMode && (
          <div style={{ flex: 1, display: 'flex', gap: 14, alignItems: 'flex-start' }}>
            {insight.fmriSignal != null && <SignalBar label="fMRI" value={insight.fmriSignal} color="#4F6BED" />}
            {insight.questionnaireScore != null && <SignalBar label="Questionnaire" value={insight.questionnaireScore} color="#F0A500" />}
            {insight.physioScore != null && <SignalBar label="Physiological" value={insight.physioScore} color="#7EE7D0" />}
          </div>
        )}

        {/* Insight text */}
        <div style={{ flex: researcherMode ? 'none' : 1, maxWidth: researcherMode ? 300 : '100%' }}>
          <button
            type="button"
            onClick={() => setExpanded(e => !e)}
            style={{ fontSize: 13, color: '#24292F', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: 0, lineHeight: 1.5 }}
          >
            {expanded ? insight.insight : insight.insight.slice(0, 90) + (insight.insight.length > 90 ? '…' : '')}
            {insight.insight.length > 90 && (
              <span style={{ color: '#4F6BED', marginLeft: 4 }}>{expanded ? ' Less' : ' More'}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function SignalBar({ label, value, color }) {
  return (
    <div style={{ minWidth: 80 }}>
      <div style={{ fontSize: 10, color: '#8B949E', marginBottom: 4, fontFamily: 'var(--mono)' }}>{label}</div>
      <div style={{ height: 5, background: '#EFF1F3', borderRadius: 99, overflow: 'hidden', marginBottom: 3 }}>
        <div style={{ width: `${value * 100}%`, height: '100%', background: color, borderRadius: 99 }} />
      </div>
      <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: '#57606A' }}>{value.toFixed(2)}</div>
    </div>
  );
}
