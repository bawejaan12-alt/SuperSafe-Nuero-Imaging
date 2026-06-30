import React from 'react';

/*
  Renders the Grad-CAM heatmap for stress/wellbeing conditions.
  In production this is replaced by the real PNG returned from the backend.

  Props:
    condition — 'none' | 'mild' | 'moderate'
    size      — px size of the rendered SVG
*/

const REGION_CONFIGS = {
  none: [
    { cx: 66,  cy: 76, rx: 14, ry: 10, intensity: 0.20 },
    { cx: 110, cy: 76, rx: 12, ry: 9,  intensity: 0.16 },
  ],
  mild: [
    { cx: 66,  cy: 76,  rx: 22, ry: 16, intensity: 0.58 },
    { cx: 110, cy: 76,  rx: 18, ry: 13, intensity: 0.48 },
    { cx: 80,  cy: 56,  rx: 14, ry: 10, intensity: 0.44 },
    { cx: 70,  cy: 96,  rx: 14, ry: 10, intensity: 0.33 },
  ],
  moderate: [
    { cx: 66,  cy: 76,  rx: 30, ry: 22, intensity: 0.88 },
    { cx: 110, cy: 76,  rx: 26, ry: 19, intensity: 0.79 },
    { cx: 80,  cy: 56,  rx: 20, ry: 14, intensity: 0.71 },
    { cx: 70,  cy: 96,  rx: 18, ry: 13, intensity: 0.63 },
    { cx: 95,  cy: 100, rx: 14, ry: 10, intensity: 0.41 },
  ],
};

function intensityToColor(intensity) {
  // Low → teal (#7EE7D0), Mid → blue (#4F6BED), High → red (#F85149)
  if (intensity < 0.5) {
    const t = intensity * 2;
    const r = Math.round(126 + t * (79 - 126));
    const g = Math.round(231 + t * (107 - 231));
    const b = Math.round(208 + t * (237 - 208));
    return `rgb(${r},${g},${b})`;
  }
  const t = (intensity - 0.5) * 2;
  const r = Math.round(79  + t * (248 - 79));
  const g = Math.round(107 + t * (81  - 107));
  const b = Math.round(237 + t * (73  - 237));
  return `rgb(${r},${g},${b})`;
}

export default function GradCamViewer({ condition = 'mild', size = 180 }) {
  const regions = REGION_CONFIGS[condition] || REGION_CONFIGS.mild;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <svg
        width={size} height={size} viewBox="0 0 160 160"
        style={{ borderRadius: 8 }}
        role="img"
        aria-label={`Grad-CAM brain activation heatmap — ${condition} stress condition`}
      >
        <ellipse cx="80" cy="80" rx="70" ry="62" fill="#1C2333" />
        <ellipse cx="80" cy="76" rx="56" ry="50" fill="#0D1117" opacity="0.6" />
        <path d="M80 22 Q84 52 80 76 Q76 52 80 22" fill="none" stroke="#30363D" strokeWidth="0.8" />

        {regions.map((r, i) => (
          <ellipse key={i} cx={r.cx} cy={r.cy} rx={r.rx} ry={r.ry}
            fill={intensityToColor(r.intensity)} opacity={0.75} />
        ))}

        <ellipse cx="80" cy="80" rx="70" ry="62" fill="none" stroke="#30363D" strokeWidth="1" />
        <text x="80" y="150" textAnchor="middle" fontSize="8" fill="#8B949E" fontFamily="'DM Mono', monospace">
          AXIAL · z=16mm
        </text>
      </svg>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 10, color: '#8B949E', fontFamily: 'var(--mono)' }}>low</span>
        <div style={{ width: 80, height: 4, borderRadius: 99, background: 'linear-gradient(to right, #7EE7D0, #4F6BED, #F85149)' }} />
        <span style={{ fontSize: 10, color: '#8B949E', fontFamily: 'var(--mono)' }}>high</span>
      </div>
      <span style={{ fontSize: 10, color: '#8B949E', fontFamily: 'var(--mono)' }}>
        target: {condition}
      </span>
    </div>
  );
}
