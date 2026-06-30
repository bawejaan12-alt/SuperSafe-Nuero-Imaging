import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TabBar           from '../components/results/TabBar';
import OverviewTab      from '../components/results/OverviewTab';
import BrainAnalysisTab from '../components/results/BrainAnalysisTab';
import QuestionnaireTab from '../components/results/QuestionnaireTab';
import CorrelationsTab  from '../components/results/CorrelationsTab';

const CONDITION_META = {
  none:     { label: 'No elevated stress',      badge: 'badge-teal'  },
  mild:     { label: 'Mild stress indicators',  badge: 'badge-amber' },
  moderate: { label: 'Elevated stress markers', badge: 'badge-red'   },
};

const TABS = [
  { id: 'overview',       label: 'Overview'       },
  { id: 'brain',          label: 'Brain analysis' },
  { id: 'questionnaire',  label: 'Questionnaire'  },
  { id: 'correlations',   label: 'Correlations'   },
];

export default function ResultsPage({ result, userRole }) {
  const navigate   = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  if (!result) {
    return (
      <div style={{ padding: 48, textAlign: 'center' }}>
        <p style={{ color: '#57606A', marginBottom: 16 }}>No results to display.</p>
        <button className="btn btn-primary" onClick={() => navigate('/upload')}>Upload a scan</button>
      </div>
    );
  }

  const meta = CONDITION_META[result.topCondition] || CONDITION_META.mild;

  return (
    <div className="fade-up" style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 24px 48px' }}>

      {/* ── Top bar ───────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <button className="btn btn-sm" onClick={() => navigate('/upload')}>← New scan</button>
          <h1 style={{ fontSize: 17, fontWeight: 600, color: '#24292F' }}>
            {result.subjectId} — Wellbeing analysis
          </h1>
          <span className={`badge ${meta.badge}`}>{meta.label}</span>
          <span className={`badge ${result.confidence === 'High' ? 'badge-teal' : result.confidence === 'Medium' ? 'badge-amber' : 'badge-red'}`}>
            {result.confidence} confidence
          </span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-sm" onClick={() => window.print()}>Export PDF</button>
          <button className="btn btn-sm" onClick={() => navigate('/history')}>View history</button>
        </div>
      </div>

      {/* ── Tabs ──────────────────────────────────────────────────────── */}
      <TabBar tabs={TABS} active={activeTab} onChange={setActiveTab} />

      {/* ── Tab content ───────────────────────────────────────────────── */}
      {activeTab === 'overview'      && <OverviewTab      result={result} />}
      {activeTab === 'brain'         && <BrainAnalysisTab result={result} userRole={userRole} />}
      {activeTab === 'questionnaire' && <QuestionnaireTab result={result} userRole={userRole} />}
      {activeTab === 'correlations'  && <CorrelationsTab  result={result} userRole={userRole} />}
    </div>
  );
}
