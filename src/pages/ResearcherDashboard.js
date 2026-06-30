import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GroupStatsPanel  from '../components/researcher/GroupStatsPanel';
import CohortTable      from '../components/researcher/CohortTable';
import ComparisonModal  from '../components/researcher/ComparisonModal';
import LemonImportGuide from '../components/researcher/LemonImportGuide';
import { exportCohortCsv, exportCohortJson } from '../utils/exportCsv';

const CONDITIONS = ['none', 'mild', 'moderate'];

export default function ResearcherDashboard({ history, setResult, selectedSubjects, setSelectedSubjects }) {
  const navigate = useNavigate();
  const [conditionFilter, setConditionFilter] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const comparisonSubjects = selectedSubjects
    .slice(0, 2)
    .map(id => history.find(r => r.id === id))
    .filter(Boolean);

  function handleRowClick(result) {
    setResult(result);
    navigate('/results');
  }

  function handleCompare() {
    if (comparisonSubjects.length === 2) setShowModal(true);
  }

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '28px 24px 48px' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 600, color: 'var(--white)', marginBottom: 4 }}>Cohort dashboard</h1>
          <div style={{ fontSize: 13, color: 'var(--fog)' }}>{history.length} subjects · Clinician mode</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-sm" onClick={() => exportCohortCsv(history)}>Export CSV</button>
          <button className="btn btn-sm" onClick={() => exportCohortJson(history)}>Export JSON</button>
          <button className="btn btn-sm btn-primary" onClick={() => navigate('/upload')}>+ New scan</button>
        </div>
      </div>

      {/* Group stats */}
      <GroupStatsPanel history={history} />

      {/* Filter chips */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ fontSize: 12, color: 'var(--fog)' }}>Filter:</span>
        <button type="button" className={`chip${!conditionFilter ? ' active' : ''}`} onClick={() => setConditionFilter(null)}>
          All
        </button>
        {CONDITIONS.map(c => (
          <button key={c} type="button" className={`chip${conditionFilter === c ? ' active' : ''}`} onClick={() => setConditionFilter(c)}>
            {c.charAt(0).toUpperCase() + c.slice(1)}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: 20 }}>
        <CohortTable
          history={history}
          selectedSubjects={selectedSubjects}
          setSelectedSubjects={setSelectedSubjects}
          onRowClick={handleRowClick}
          conditionFilter={conditionFilter}
        />
      </div>

      {/* LEMON guide */}
      <div style={{ marginBottom: 24 }}>
        <LemonImportGuide />
      </div>

      {/* Sticky compare bar */}
      {selectedSubjects.length > 0 && (
        <div style={{
          position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
          background: 'var(--slate)', border: '1px solid var(--line)', borderRadius: 10,
          padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 14,
          boxShadow: '0 4px 20px rgba(0,0,0,.3)', zIndex: 50,
        }}>
          <span style={{ fontSize: 13, color: 'var(--fog)' }}>
            {selectedSubjects.length} selected
          </span>
          <button
            className="btn btn-primary btn-sm"
            disabled={selectedSubjects.length < 2}
            onClick={handleCompare}
            style={{ opacity: selectedSubjects.length < 2 ? 0.5 : 1 }}
          >
            Compare 2 subjects →
          </button>
          <button
            className="btn btn-sm"
            onClick={() => setSelectedSubjects([])}
            style={{ color: 'var(--fog)' }}
          >
            Clear
          </button>
        </div>
      )}

      {showModal && (
        <ComparisonModal subjects={comparisonSubjects} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}
