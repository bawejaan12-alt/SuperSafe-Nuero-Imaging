import React from 'react';

const CATEGORY_COLORS = {
  Sleep:                { bg: 'rgba(79,107,237,.08)',  border: 'rgba(79,107,237,.2)',  color: '#4F6BED' },
  Exercise:             { bg: 'rgba(126,231,208,.08)', border: 'rgba(126,231,208,.3)', color: '#0E7F6F' },
  Mindfulness:          { bg: 'rgba(126,231,208,.08)', border: 'rgba(126,231,208,.3)', color: '#0E7F6F' },
  Breathing:            { bg: 'rgba(126,231,208,.08)', border: 'rgba(126,231,208,.3)', color: '#0E7F6F' },
  Activity:             { bg: 'rgba(240,165,0,.08)',   border: 'rgba(240,165,0,.2)',   color: '#996800' },
  'Stress reduction':   { bg: 'rgba(240,165,0,.08)',   border: 'rgba(240,165,0,.2)',   color: '#996800' },
  'Professional support':{ bg: 'rgba(248,81,73,.08)',  border: 'rgba(248,81,73,.2)',   color: '#B91C1C' },
};

function getStyle(category) {
  return CATEGORY_COLORS[category] || { bg: 'rgba(79,107,237,.08)', border: 'rgba(79,107,237,.2)', color: '#4F6BED' };
}

export default function RecommendationsList({ recommendations }) {
  if (!recommendations || recommendations.length === 0) return null;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {recommendations.map((rec, i) => {
        const s = getStyle(rec.category);
        return (
          <div key={i} style={{ padding: '14px 16px', borderRadius: 10, background: s.bg, border: `1px solid ${s.border}` }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: s.color, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 4 }}>
              {rec.category}
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#24292F', marginBottom: 4 }}>{rec.action}</div>
            <div style={{ fontSize: 13, color: '#57606A', lineHeight: 1.5 }}>{rec.rationale}</div>
          </div>
        );
      })}
    </div>
  );
}
