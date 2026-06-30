import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Nav from './components/Nav';
import UploadPage    from './pages/UploadPage';
import ProcessingPage from './pages/ProcessingPage';
import ResultsPage   from './pages/ResultsPage';
import HistoryPage   from './pages/HistoryPage';

/*
  Global app state lives here and is passed down as props.
  In a real app you'd use Context or a state library (Zustand, Redux).
  For clarity at this stage, plain useState is fine.
*/
export default function App() {
  // The file the user uploaded
  const [uploadedFile, setUploadedFile] = useState(null);
  // Subject metadata from the upload form
  const [subjectMeta, setSubjectMeta] = useState({ id: '', age: '', sex: '', notes: '' });
  // The analysis result returned from the backend (or mock)
  const [result, setResult] = useState(null);
  // All past analyses for the history page
  const [history, setHistory] = useState(MOCK_HISTORY);

  // Called when a new result comes in — add to history automatically
  function onResult(res) {
    setResult(res);
    setHistory(prev => [res, ...prev]);
  }

  return (
    <BrowserRouter>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Nav />
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Navigate to="/upload" replace />} />
            <Route path="/upload" element={
              <UploadPage
                uploadedFile={uploadedFile}
                setUploadedFile={setUploadedFile}
                subjectMeta={subjectMeta}
                setSubjectMeta={setSubjectMeta}
              />
            } />
            <Route path="/processing" element={
              <ProcessingPage
                uploadedFile={uploadedFile}
                subjectMeta={subjectMeta}
                onResult={onResult}
              />
            } />
            <Route path="/results" element={
              <ResultsPage result={result} subjectMeta={subjectMeta} />
            } />
            <Route path="/history" element={
              <HistoryPage history={history} setResult={setResult} />
            } />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

// ── Mock history data — replace with real API calls ─────────────────────────
const MOCK_HISTORY = [
  {
    id: 'RPT-2026-06-19-039',
    subjectId: 'SUB-039', date: '19 Jun 2026',
    topClass: 'NOD', topLabel: 'No dementia', topProb: 0.88,
    confidence: 'High', entropy: 0.11,
    probs: { MID: 0.06, MOD: 0.01, NOD: 0.88, VMD: 0.05 },
    regions: [
      { name: 'Hippocampus (L)', score: 0.22 },
      { name: 'Temporal lobe', score: 0.18 },
    ],
    summary: 'No significant indicators of dementia detected. Activation patterns are within normal range across all monitored regions.',
  },
  {
    id: 'RPT-2026-06-14-035',
    subjectId: 'SUB-035', date: '14 Jun 2026',
    topClass: 'VMD', topLabel: 'Very mild dementia', topProb: 0.64,
    confidence: 'Medium', entropy: 0.41,
    probs: { MID: 0.22, MOD: 0.03, NOD: 0.11, VMD: 0.64 },
    regions: [
      { name: 'Hippocampus (L)', score: 0.61 },
      { name: 'Entorhinal cortex', score: 0.54 },
      { name: 'Temporal lobe', score: 0.38 },
    ],
    summary: 'Subtle indicators of very mild cognitive decline. Mildly elevated hippocampal activation warrants monitoring.',
  },
];
