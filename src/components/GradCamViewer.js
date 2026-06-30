import React from 'react';

/*
  Renders the Grad-CAM heatmap.

  In production: the backend returns a base64 PNG from gradcam.py
  and you render it with <img src={`data:image/png;base64,${data}`} />.

  Here we render an SVG placeholder that visually represents what the
  heatmap looks like for demonstration purposes.

  Props:
    topClass  — "MID" | "MOD" | "NOD" | "VMD"
    regions   — array of { name, score }
*/

const REGION_CONFIGS = {
  MID: [
    { cx: 70,  cy: 76,  rx: 28, ry: 20, intensity: 0.85 },
    { cx: 116, cy: 76,  rx: 23, ry: 17, intensity: 0.62 },
    { cx: 68,  cy: 96,  rx: 18, ry: 13, intensity: 0.70 },
    { cx: 92,  cy: 108, rx: 16, ry: 11, intensity: 0.45 },
  ],
  VMD: [
    { cx: 70,  cy: 76,  rx: 22, ry: 16, intensity: 0.60 },
    { cx: 116, cy: 76,  rx: 18, ry: 13, intensity: 0.48 },
    { cx: 68,  cy: 96,  rx: 14, ry: 10, intensity: 0.52 },
    { cx: 92,  cy: 108, rx: 12, ry:  8, intensity: 0.30 },
  ],
  NOD: [
    { cx: 70,  cy: 76,  rx: 12, ry:  9, intensity: 0.18 },
    { cx: 116, cy: 76,  rx: 10, ry:  7, intensity: 0.14 },
  ],
  MOD: [
    { cx: 70,  cy: 76,  rx: 34, ry: 26, intensity: 0.92 },
    { cx: 116, cy: 76,  rx: 30, ry: 22, intensity: 0.80 },
    { cx: 68,  cy: 96,  rx: 24, ry: 17, intensity: 0.88 },
    { cx: 92,  cy: 108, rx: 22, ry: 15, intensity: 0.70 },
    { cx: 55,  cy: 60,  rx: 16, ry: 12, intensity: 0.65 },
  ],
};

function intensityToColor(intensity) {
  // Low  → blue (#4F6BED)
  // Mid  → purple (#9B59B6)
  // High → red (#F85149)
  if (intensity < 0.5) {
    const t = intensity * 2;
    const r = Math.round(79  + t * (155 - 79));
    const g = Math.round(107 + t * (89  - 107));
    const b = Math.round(237 + t * (182 - 237));
    return `rgb(${r},${g},${b})`;
  } else {
    const t = (intensity - 0.5) * 2;
    const r = Math.round(155 + t * (248 - 155));
    const g = Math.round(89  + t * (81  - 89));
    const b = Math.round(182 + t * (73  - 182));
    return `rgb(${r},${g},${b})`;
  }
}

export default function GradCamViewer({ topClass = 'MID', size = 180 }) {
  const regions = REGION_CONFIGS[topClass] || REGION_CONFIGS.MID;
  const scale   = size / 160;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <svg
        width={size} height={size}
        viewBox="0 0 160 160"
        style={{ borderRadius: 8 }}
        role="img"
        aria-label={`Grad-CAM brain activation heatmap for ${topClass} classification`}
      >
        {/* Brain outline */}
        <ellipse cx="80" cy="80" rx="70" ry="62" fill="#1C2333" />
        <ellipse cx="80" cy="76" rx="56" ry="50" fill="#0D1117" opacity="0.6" />

        {/* Midline sulcus */}
        <path
          d="M80 22 Q84 52 80 76 Q76 52 80 22"
          fill="none" stroke="#30363D" strokeWidth="0.8"
        />

        {/* Activation regions */}
        {regions.map((r, i) => (
          <ellipse
            key={i}
            cx={r.cx} cy={r.cy} rx={r.rx} ry={r.ry}
            fill={intensityToColor(r.intensity)}
            opacity={0.75}
          />
        ))}

        {/* Outer cortex ring */}
        <ellipse
          cx="80" cy="80" rx="70" ry="62"
          fill="none" stroke="#30363D" strokeWidth="1"
        />

        {/* Slice label */}
        <text
          x="80" y="150" textAnchor="middle"
          fontSize="8" fill="#8B949E"
          fontFamily="'DM Mono', monospace"
        >
          AXIAL · z=+2mm
        </text>
      </svg>

      {/* Colorbar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 10, color: '#8B949E', fontFamily: 'var(--mono)' }}>low</span>
        <div style={{
          width: 80, height: 4, borderRadius: 99,
          background: 'linear-gradient(to right, #4F6BED, #9B59B6, #F85149)',
        }} />
        <span style={{ fontSize: 10, color: '#8B949E', fontFamily: 'var(--mono)' }}>high</span>
      </div>
      <span style={{ fontSize: 10, color: '#8B949E', fontFamily: 'var(--mono)' }}>
        target: {topClass}
      </span>
    </div>
  );
}
