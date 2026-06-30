import React from 'react';

const FIELDS = [
  { key: 'systolic',          label: 'Systolic BP',       unit: 'mmHg', placeholder: 'e.g. 120' },
  { key: 'diastolic',         label: 'Diastolic BP',      unit: 'mmHg', placeholder: 'e.g. 80'  },
  { key: 'heartRate',         label: 'Resting heart rate',unit: 'bpm',  placeholder: 'e.g. 68'  },
  { key: 'hrv',               label: 'HRV / RMSSD',       unit: 'ms',   placeholder: 'e.g. 45'  },
  { key: 'sleepHours',        label: 'Avg sleep',         unit: 'hrs/night', placeholder: 'e.g. 7' },
  { key: 'exerciseFrequency', label: 'Exercise',          unit: 'days/week', placeholder: 'e.g. 3' },
];

const fieldStyle = {
  width: '100%', padding: '8px 10px', border: '1px solid #D0D7DE', borderRadius: 6,
  fontSize: 13, color: '#24292F', background: '#FFFFFF', outline: 'none', boxSizing: 'border-box',
};

export default function PhysioSection({ values, onChange }) {
  return (
    <div>
      <p style={{ fontSize: 13, color: '#57606A', marginBottom: 20, lineHeight: 1.6 }}>
        These physiological markers help correlate brain activity with cardiovascular and lifestyle factors.
        All fields are optional — enter what you have available.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {FIELDS.map(f => (
          <div key={f.key}>
            <label style={{ fontSize: 12, color: '#57606A', display: 'block', marginBottom: 5 }}>
              {f.label} <span style={{ color: '#8B949E' }}>({f.unit})</span>
            </label>
            <input
              type="number"
              placeholder={f.placeholder}
              value={values[f.key] || ''}
              onChange={e => onChange({ ...values, [f.key]: e.target.value })}
              style={fieldStyle}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
