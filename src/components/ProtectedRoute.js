import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute({ children }) {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#1a1a2e',
      }}>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, color: '#a78bfa' }}>
          Loading…
        </div>
      </div>
    );
  }

  if (!session) return <Navigate to="/login" replace />;
  return children;
}
