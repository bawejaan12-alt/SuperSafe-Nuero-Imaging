import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import NeuralBackground from '../components/NeuralBackground';

export default function LoginPage() {
  const { signInWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  async function handleGoogle() {
    setLoading(true);
    setError('');
    try {
      await signInWithGoogle();
      // Page will redirect to Google — no navigate() needed
    } catch (err) {
      setError(err.message || 'Could not start Google sign-in. Please try again.');
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#1a1a2e', display: 'flex',
      alignItems: 'center', justifyContent: 'center', padding: 24,
      position: 'relative', overflow: 'hidden',
    }}>
      <NeuralBackground />

      <div style={{
        position: 'relative', zIndex: 1, width: '100%', maxWidth: 400,
        background: '#252542', border: '1px solid #3d3d6b', borderRadius: 16,
        padding: '40px 32px', boxShadow: '0 8px 40px rgba(0,0,0,.4)',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🧠</div>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 22, fontWeight: 500, color: '#f0f0ff', marginBottom: 8 }}>
            NeuroInsight
          </div>
          <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.5 }}>
            fMRI & wearable mental wellbeing analysis
          </div>
        </div>

        {/* Sign in section */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 12, color: '#64748b', textAlign: 'center', marginBottom: 20 }}>
            Sign in to continue
          </div>

          <button
            onClick={handleGoogle}
            disabled={loading}
            style={{
              width: '100%', padding: '12px 16px', borderRadius: 10,
              border: '1px solid #3d3d6b',
              background: loading ? '#2a2a4a' : '#1a1a2e',
              color: loading ? '#64748b' : '#f0f0ff',
              fontSize: 14, fontWeight: 500,
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
              transition: 'background .15s, border-color .15s',
            }}
            onMouseEnter={e => { if (!loading) { e.currentTarget.style.background = '#252542'; e.currentTarget.style.borderColor = '#8b5cf6'; }}}
            onMouseLeave={e => { e.currentTarget.style.background = loading ? '#2a2a4a' : '#1a1a2e'; e.currentTarget.style.borderColor = '#3d3d6b'; }}
          >
            {loading ? (
              <span style={{ fontSize: 13, color: '#94a3b8' }}>Redirecting to Google…</span>
            ) : (
              <>
                <GoogleIcon />
                Continue with Google
              </>
            )}
          </button>
        </div>

        {error && (
          <div style={{
            padding: '10px 12px', borderRadius: 8, marginBottom: 16,
            background: 'rgba(248,81,73,.1)', border: '1px solid rgba(248,81,73,.3)',
            fontSize: 13, color: '#fca5a5', textAlign: 'center',
          }}>
            {error}
          </div>
        )}

        <div style={{
          paddingTop: 20, borderTop: '1px solid #3d3d6b',
          fontSize: 11, color: '#64748b', textAlign: 'center', lineHeight: 1.6,
        }}>
          Research use only · Not a clinical diagnostic tool<br />
          Your Google account is only used for authentication.<br />
          No data is shared with Google.
        </div>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
      <path d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  );
}
