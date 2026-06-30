import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const linkStyle = ({ isActive }) => ({
  display: 'inline-flex', alignItems: 'center', padding: '5px 12px', borderRadius: 6,
  fontSize: 13, fontWeight: 500,
  color: isActive ? '#f0f0ff' : '#94a3b8',
  background: isActive ? 'rgba(139,92,246,.15)' : 'transparent',
  transition: 'color .15s, background .15s', textDecoration: 'none',
});

export default function Nav({ modelStatus = {}, userRole, setRole }) {
  const navigate     = useNavigate();
  const { signOut }  = useAuth();
  const isMock       = modelStatus?.mode === 'mock';

  async function handleSignOut() {
    setRole(null);
    await signOut();
    navigate('/login');
  }

  return (
    <nav style={{
      background: '#1a1a2e', borderBottom: '1px solid #3d3d6b', height: 52,
      display: 'flex', alignItems: 'center', padding: '0 24px', gap: 8,
      position: 'sticky', top: 0, zIndex: 100,
    }}>
      {/* Logo */}
      <div style={{
        fontFamily: "'DM Mono', monospace", fontSize: 15, fontWeight: 500,
        color: '#f0f0ff', display: 'flex', alignItems: 'center', gap: 8, marginRight: 20,
      }}>
        <span style={{ fontSize: 18 }}>🧠</span>
        NeuroInsight
      </div>

      {/* Links */}
      <div style={{ display: 'flex', gap: 2, flex: 1 }}>
        <NavLink to="/upload"  style={linkStyle}>
          {userRole === 'clinician' ? 'New scan' : 'New analysis'}
        </NavLink>
        <NavLink to="/history" style={linkStyle}>History</NavLink>
        {userRole === 'clinician' && (
          <NavLink to="/cohort" style={linkStyle}>Cohort</NavLink>
        )}
        {userRole === 'personal' && (
          <NavLink to="/dashboard" style={linkStyle}>My Dashboard</NavLink>
        )}
      </div>

      {/* Right side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {/* Model status */}
        <span style={{
          fontSize: 10, fontFamily: "'DM Mono', monospace",
          color: modelStatus?.online ? '#a78bfa' : '#94a3b8',
          display: 'flex', alignItems: 'center', gap: 5,
        }}>
          <span style={{
            width: 6, height: 6, borderRadius: '50%',
            background: modelStatus?.online ? '#8b5cf6' : '#94a3b8',
            boxShadow: modelStatus?.online ? '0 0 6px #8b5cf6' : 'none',
          }} />
          {modelStatus?.online === null || modelStatus?.online === undefined
            ? 'Checking model…'
            : isMock
              ? 'Demo mode'
              : modelStatus?.online
                ? 'Model online'
                : 'Model offline'}
        </span>

        {/* Research disclaimer */}
        <span style={{
          fontSize: 11, fontFamily: "'DM Mono', monospace", color: '#F0A500',
          background: 'rgba(240,165,0,.1)', border: '1px solid rgba(240,165,0,.2)',
          borderRadius: 99, padding: '3px 10px',
        }}>
          Research use only
        </span>

        {/* Role badge */}
        {userRole && (
          <span style={{
            fontSize: 11, fontFamily: "'DM Mono', monospace",
            color: userRole === 'clinician' ? '#a78bfa' : '#8b5cf6',
            background: userRole === 'clinician' ? 'rgba(167,139,250,.12)' : 'rgba(139,92,246,.12)',
            border: `1px solid ${userRole === 'clinician' ? 'rgba(167,139,250,.3)' : 'rgba(139,92,246,.3)'}`,
            borderRadius: 99, padding: '3px 10px', textTransform: 'capitalize',
          }}>
            {userRole}
          </span>
        )}

        {/* Sign out */}
        <button
          onClick={handleSignOut}
          style={{
            fontSize: 11, color: '#94a3b8', background: 'transparent',
            border: '1px solid #3d3d6b', borderRadius: 6, padding: '4px 10px',
            cursor: 'pointer', fontFamily: 'inherit',
            transition: 'color .15s, border-color .15s',
          }}
          onMouseEnter={e => { e.target.style.color = '#f0f0ff'; e.target.style.borderColor = '#8b5cf6'; }}
          onMouseLeave={e => { e.target.style.color = '#94a3b8'; e.target.style.borderColor = '#3d3d6b'; }}
        >
          Sign out
        </button>
      </div>
    </nav>
  );
}
