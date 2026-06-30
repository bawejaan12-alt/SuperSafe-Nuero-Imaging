import React from 'react';

export default function LikertScale({ options, value, onChange }) {
  return (
    <div className="likert-row">
      {options.map((opt, i) => (
        <button
          key={i}
          type="button"
          className={`likert-option${value === i ? ' selected' : ''}`}
          onClick={() => onChange(i)}
        >
          <div style={{ fontWeight: 600, marginBottom: 2 }}>{i}</div>
          <div style={{ fontSize: 10, lineHeight: 1.2 }}>{opt}</div>
        </button>
      ))}
    </div>
  );
}
