import React from 'react';
import { useNavigate } from 'react-router-dom';
import WellbeingTrendChart from '../components/individual/WellbeingTrendChart';
import RecommendationsList from '../components/individual/RecommendationsList';

const CONDITION_PLAIN = {
  none:     { headline: "You're looking good", sub: 'No significant stress indicators detected in your most recent scan.', color: '#0E7F6F', bg: 'rgba(126,231,208,.1)', border: 'rgba(126,231,208,.3)' },
  mild:     { headline: 'Mild signals detected', sub: 'Your scan shows some elevated activity in stress-related brain regions. Nothing alarming, but worth paying attention to.', color: '#996800', bg: 'rgba(240,165,0,.08)', border: 'rgba(240,165,0,.2)' },
  moderate: { headline: 'Elevated stress markers', sub: 'Your scan shows notably elevated activity across multiple stress-related brain regions. Consider the recommendations below.', color: '#B91C1C', bg: 'rgba(248,81,73,.08)', border: 'rgba(248,81,73,.2)' },
};

const CONCORDANCE_MESSAGES = {
  concordant: 'Your brain activity matches what you reported — the signals are in agreement.',
  discordant: 'Interesting finding: your brain activity and questionnaire responses tell slightly different stories.',
};

export default function IndividualDashboard({ history, result }) {
  const navigate = useNavigate();
  const latest   = result || history[0] || null;

  if (!latest) {
    return (
      <div style={{ padding: 48, textAlign: 'center' }}>
        <div style={{ fontSize: 32, marginBottom: 14 }}>🧠</div>
        <div style={{ fontSize: 16, fontWeight: 600, color: '#24292F', marginBottom: 8 }}>No scans yet</div>
        <div style={{ fontSize: 13, color: '#57606A', marginBottom: 20 }}>
          Upload your first scan to start tracking your wellbeing over time.
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/upload')}>Upload a scan</button>
      </div>
    );
  }

  const condMeta = CONDITION_PLAIN[latest.topCondition] || CONDITION_PLAIN.mild;

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '28px 24px 48px' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
        <h1 style={{ fontSize: 20, fontWeight: 600, color: '#24292F' }}>My wellbeing dashboard</h1>
        <button className="btn btn-primary btn-sm" onClick={() => navigate('/upload')}>New scan</button>
      </div>

      {/* Personal summary banner */}
      <div style={{
        padding: '18px 22px', borderRadius: 12, marginBottom: 20,
        background: condMeta.bg, border: `1px solid ${condMeta.border}`,
      }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: condMeta.color, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 6 }}>
          Latest result · {latest.date}
        </div>
        <div style={{ fontSize: 18, fontWeight: 600, color: '#24292F', marginBottom: 4 }}>{condMeta.headline}</div>
        <div style={{ fontSize: 14, color: '#57606A', lineHeight: 1.6 }}>{condMeta.sub}</div>
      </div>

      {/* Trend chart */}
      {history.length > 0 && (
        <div className="card" style={{ marginBottom: 20 }}>
          <div className="section-label">Wellbeing over time</div>
          <WellbeingTrendChart history={history} />
          <div style={{ fontSize: 11, color: '#8B949E', marginTop: 8 }}>
            Raw scores from each scan. Lower is generally better for neuroticism, trait anxiety, and chronic stress.
          </div>
        </div>
      )}

      {/* Multi-modal score cards */}
      {latest.multiModalInsights && latest.multiModalInsights.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <div className="section-label" style={{ marginBottom: 12 }}>How your indicators compare</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
            {latest.multiModalInsights.map((ins, i) => (
              <div key={i} className="card" style={{ padding: '14px 16px' }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#24292F', marginBottom: 4 }}>{ins.domain}</div>
                <div style={{
                  display: 'inline-block', fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 99, marginBottom: 8,
                  background: ins.alignment === 'concordant' ? 'rgba(126,231,208,.15)' : 'rgba(240,165,0,.1)',
                  color: ins.alignment === 'concordant' ? '#0E7F6F' : '#996800',
                }}>
                  {ins.alignment === 'concordant' ? 'In agreement' : 'Mismatch detected'}
                </div>
                <div style={{ fontSize: 13, color: '#57606A', lineHeight: 1.5 }}>
                  {CONCORDANCE_MESSAGES[ins.alignment]}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {latest.recommendations?.length > 0 && (
        <div>
          <div className="section-label" style={{ marginBottom: 12 }}>Personalised recommendations</div>
          <RecommendationsList recommendations={latest.recommendations} />
        </div>
      )}

      {/* Disclaimer */}
      <div style={{ marginTop: 28, padding: '12px 16px', borderRadius: 8, background: 'rgba(240,165,0,.06)', border: '1px solid rgba(240,165,0,.2)' }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: '#996800', marginBottom: 3 }}>Not a clinical diagnosis</div>
        <div style={{ fontSize: 12, color: '#57606A', lineHeight: 1.5 }}>
          These insights are research-grade indicators. Please consult a qualified mental health professional if you are concerned about your wellbeing.
        </div>
      </div>
    </div>
  );
}
