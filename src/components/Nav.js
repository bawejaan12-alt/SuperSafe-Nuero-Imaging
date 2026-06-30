import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const styles = {
  nav: {
    background: '#0D1117',
    borderBottom: '1px solid #30363D',
    height: 52,
    display: 'flex',
    alignItems: 'center',
    padding: '0 24px',
    gap: 8,
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  logo: {
    fontFamily: "'DM Mono', monospace",
    fontSize: 15,
    fontWeight: 500,
    color: '#F0F6FC',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginRight: 20,
  },
  dot: {
    width: 8, height: 8, borderRadius: '50%',
    background: '#4F6BED',
    boxShadow: '0 0 8px #4F6BED',
  },
  links: {
    display: 'flex', gap: 2, flex: 1,
  },
  right: {
    display: 'flex', alignItems: 'center', gap: 10,
  },
  disclaimer: {
    fontSize: 11,
    fontFamily: "'DM Mono', monospace",
    color: '#F0A500',
    background: 'rgba(240,165,0,.1)',
    border: '1px solid rgba(240,165,0,.2)',
    borderRadius: 99,
    padding: '3px 10px',
  },
  avatar: {
    width: 30, height: 30, borderRadius: '50%',
    background: 'rgba(79,107,237,.2)',
    border: '1px solid rgba(79,107,237,.4)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 11, fontWeight: 600, color: '#4F6BED',
    fontFamily: "'DM Mono', monospace",
  },
};

// Active style for nav links
const linkStyle = ({ isActive }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  padding: '5px 12px',
  borderRadius: 6,
  fontSize: 13,
  fontWeight: 500,
  color: isActive ? '#F0F6FC' : '#8B949E',
  background: isActive ? 'rgba(240,246,252,.08)' : 'transparent',
  transition: 'color .15s, background .15s',
  textDecoration: 'none',
});

export default function Nav() {
  return (
    <nav style={styles.nav}>
      <div style={styles.logo}>
        <span style={styles.dot} />
        NeuroInsight
      </div>

      <div style={styles.links}>
        <NavLink to="/upload"  style={linkStyle}>New scan</NavLink>
        <NavLink to="/history" style={linkStyle}>History</NavLink>
      </div>

      <div style={styles.right}>
        <span style={styles.disclaimer}>Research use only</span>
        <div style={styles.avatar}>AP</div>
      </div>
    </nav>
  );
}
