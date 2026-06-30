import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Nav from './components/Nav';
import StatusBanner from './components/StatusBanner';
import UploadPage     from './pages/UploadPage';
import ProcessingPage from './pages/ProcessingPage';
import ResultsPage    from './pages/ResultsPage';
import HistoryPage    from './pages/HistoryPage';
import { checkModelStatus, fetchHistory } from './api/neuroModel';

export default function App() {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [subjectMeta, setSubjectMeta]   = useState({ id: '', age: '', sex: '', notes: '' });
  const [result, setResult]             = useState(null);
  const [history, setHistory]           = useState([]);
  const [modelStatus, setModelStatus]   = useState({ online: null });

  // Check backend status once on load — drives the "model offline" banner
  useEffect(() => {
    checkModelStatus().then(setModelStatus);
    fetchHistory().then(setHistory).catch(() => setHistory([]));
  }, []);

  function onResult(res) {
    setResult(res);
    setHistory(prev => [res, ...prev]);
  }

  return (
    <BrowserRouter>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Nav modelStatus={modelStatus} />
        {modelStatus.online === false && <StatusBanner />}
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
              <ResultsPage result={result} />
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
