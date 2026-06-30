import React, { useState } from 'react';
import GradCamViewer from '../GradCamViewer';

export default function BrainAnalysisTab({ result, userRole }) {
  const [selectedRois, setSelectedRois] = useState(new Set());

  function toggleRoi(name) {
    setSelectedRois(prev => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });
  }

  const hasFilter = selectedRois.size > 0;
  const displayedRegions = hasFilter
    ? result.regions.filter(r => selectedRois.has(r.name))
    : result.regions;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 16 }}>

      {/* Grad-CAM */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div className="section-label">Grad-CAM brain activation map</div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <GradCamViewer condition={result.topCondition} size={220} />
        </div>
        <div style={{ fontSize: 12, color: '#8B949E', lineHeight: 1.5 }}>
          Grad-CAM visualises which brain regions contributed most to the model's prediction.
          Warm colours (red/orange) indicate high activation; cool colours (teal/blue) indicate low activation.
        </div>
      </div>

      {/* Regions */}
      <div className="card">
        <div className="section-label" style={{ marginBottom: 14 }}>Activated regions</div>

        {userRole === 'researcher' && (
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 11, color: '#8B949E', marginBottom: 8 }}>Filter by region of interest</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {result.regions.map(r => (
                <button
                  key={r.name}
                  type="button"
                  className={`chip${selectedRois.has(r.name) ? ' active' : ''}`}
                  onClick={() => toggleRoi(r.name)}
                >
                  {r.name}
                </button>
              ))}
              {hasFilter && (
                <button type="button" className="chip" onClick={() => setSelectedRois(new Set())} style={{ color: '#8B949E' }}>
                  Clear
                </button>
              )}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {displayedRegions.map(r => (
            <div key={r.name} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '6px 8px', borderRadius: 6,
              background: hasFilter && selectedRois.has(r.name) ? 'rgba(79,107,237,.06)' : 'transparent',
            }}>
              <span style={{ fontSize: 13, color: '#24292F', flex: 1 }}>{r.name}</span>
              <div style={{ width: 80, height: 5, background: '#EFF1F3', borderRadius: 99, overflow: 'hidden' }}>
                <div style={{
                  width: `${r.score * 100}%`, height: '100%', borderRadius: 99,
                  background: r.score > 0.7 ? '#F85149' : r.score > 0.4 ? '#F0A500' : '#7EE7D0',
                }} />
              </div>
              <span style={{
                fontFamily: 'var(--mono)', fontSize: 12,
                color: r.score > 0.7 ? '#B91C1C' : '#57606A', minWidth: 36, textAlign: 'right',
              }}>
                {r.score.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
