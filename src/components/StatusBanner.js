import React from 'react';

export default function StatusBanner() {
  return (
    <div style={{
      background: 'rgba(248,81,73,.06)',
      borderBottom: '1px solid rgba(248,81,73,.2)',
      padding: '8px 24px',
      textAlign: 'center',
      fontSize: 12,
      color: '#B91C1C',
    }}>
      Model backend isn't reachable — running in demo mode with mock results.
      See <code style={{ fontFamily: 'var(--mono)', background: 'rgba(248,81,73,.1)', padding: '1px 5px', borderRadius: 4 }}>src/api/neuroModel.js</code> to connect your TensorFlow model.
    </div>
  );
}
