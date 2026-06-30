import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    let done = false;

    // Supabase detects the #access_token hash automatically (detectSessionInUrl: true)
    // and fires SIGNED_IN on onAuthStateChange. We just wait for it.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (done) return;
      if (event === 'SIGNED_IN' && session) {
        done = true;
        navigate('/', { replace: true });
      }
    });

    // Also check if there's already a session (e.g. fast redirect)
    supabase.auth.getSession().then(({ data }) => {
      if (done) return;
      if (data.session) {
        done = true;
        navigate('/', { replace: true });
      }
    });

    // If nothing resolves in 8 seconds, show an error
    const timeout = setTimeout(() => {
      if (!done) {
        done = true;
        setError('Sign-in timed out. Please try again.');
      }
    }, 8000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, [navigate]);

  if (error) {
    return (
      <div style={{
        minHeight: '100vh', background: '#1a1a2e', display: 'flex',
        alignItems: 'center', justifyContent: 'center', padding: 24,
      }}>
        <div style={{
          background: '#252542', border: '1px solid #3d3d6b', borderRadius: 16,
          padding: '32px 28px', maxWidth: 380, width: '100%', textAlign: 'center',
        }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>⚠️</div>
          <div style={{ fontSize: 15, fontWeight: 600, color: '#f0f0ff', marginBottom: 8 }}>
            Sign-in failed
          </div>
          <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: 20, lineHeight: 1.6 }}>
            {error}
          </div>
          <button
            onClick={() => navigate('/login', { replace: true })}
            style={{
              padding: '10px 20px', borderRadius: 8, border: 'none',
              background: '#8b5cf6', color: '#fff', fontSize: 14,
              fontWeight: 600, cursor: 'pointer',
            }}
          >
            Back to login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#1a1a2e', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, color: '#a78bfa' }}>
        Signing you in…
      </div>
    </div>
  );
}
