import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Nav from './components/Nav';
import StatusBanner from './components/StatusBanner';
import UploadPage          from './pages/UploadPage';
import ProcessingPage      from './pages/ProcessingPage';
import ResultsPage         from './pages/ResultsPage';
import HistoryPage         from './pages/HistoryPage';
import LandingPage         from './pages/LandingPage';
import QuestionnairePage   from './pages/QuestionnairePage';
import ClinicalDashboard   from './pages/ClinicalDashboard';
import PersonalDashboard   from './pages/PersonalDashboard';
import LoginPage           from './pages/LoginPage';
import AuthCallbackPage    from './pages/AuthCallbackPage';
import { checkModelStatus, fetchHistory } from './api/neuroModel';

function AppRoutes() {
  const [userRole, setUserRoleState] = useState(
    () => localStorage.getItem('ni_role') || null
  );
  const [uploadedFile, setUploadedFile]       = useState(null);
  const [wearableData, setWearableData]       = useState(null);
  const [subjectMeta, setSubjectMeta]         = useState({ id: '', age: '', sex: '', notes: '' });
  const [questionnaireData, setQuestionnaireData] = useState(null);
  const [result, setResult]                   = useState(null);
  const [history, setHistory]                 = useState([]);
  const [modelStatus, setModelStatus]         = useState({ online: null });
  const [selectedSubjects, setSelectedSubjects] = useState([]);

  function setRole(role) {
    setUserRoleState(role);
    if (role) localStorage.setItem('ni_role', role);
    else localStorage.removeItem('ni_role');
  }

  useEffect(() => {
    checkModelStatus().then(setModelStatus);
    fetchHistory().then(setHistory).catch(() => setHistory([]));
  }, []);

  function onResult(res) {
    setResult(res);
    setHistory(prev => [res, ...prev]);
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/auth/callback" element={<AuthCallbackPage />} />

        {/* Protected routes */}
        <Route path="/" element={
          <ProtectedRoute>
            <Nav modelStatus={modelStatus} userRole={userRole} setRole={setRole} />
            {modelStatus.online === false && <StatusBanner />}
            <main style={{ flex: 1 }}>
              {userRole
                ? <Navigate to="/upload" replace />
                : <LandingPage userRole={userRole} setRole={setRole} />}
            </main>
          </ProtectedRoute>
        } />

        <Route path="/upload" element={
          <ProtectedRoute>
            <Nav modelStatus={modelStatus} userRole={userRole} setRole={setRole} />
            {modelStatus.online === false && <StatusBanner />}
            <main style={{ flex: 1 }}>
              <UploadPage
                userRole={userRole}
                uploadedFile={uploadedFile}
                setUploadedFile={f => { setUploadedFile(f); if (!f) setQuestionnaireData(null); }}
                wearableData={wearableData}
                setWearableData={setWearableData}
                subjectMeta={subjectMeta}
                setSubjectMeta={setSubjectMeta}
              />
            </main>
          </ProtectedRoute>
        } />

        <Route path="/questionnaire" element={
          <ProtectedRoute>
            <Nav modelStatus={modelStatus} userRole={userRole} setRole={setRole} />
            <main style={{ flex: 1 }}>
              <QuestionnairePage
                setQuestionnaireData={setQuestionnaireData}
                userRole={userRole}
                uploadedFile={uploadedFile}
              />
            </main>
          </ProtectedRoute>
        } />

        <Route path="/processing" element={
          <ProtectedRoute>
            <Nav modelStatus={modelStatus} userRole={userRole} setRole={setRole} />
            <main style={{ flex: 1 }}>
              <ProcessingPage
                userRole={userRole}
                uploadedFile={uploadedFile}
                wearableData={wearableData}
                subjectMeta={subjectMeta}
                questionnaireData={questionnaireData}
                onResult={onResult}
              />
            </main>
          </ProtectedRoute>
        } />

        <Route path="/results" element={
          <ProtectedRoute>
            <Nav modelStatus={modelStatus} userRole={userRole} setRole={setRole} />
            <main style={{ flex: 1 }}>
              <ResultsPage result={result} userRole={userRole} />
            </main>
          </ProtectedRoute>
        } />

        <Route path="/history" element={
          <ProtectedRoute>
            <Nav modelStatus={modelStatus} userRole={userRole} setRole={setRole} />
            <main style={{ flex: 1 }}>
              <HistoryPage history={history} setResult={setResult} />
            </main>
          </ProtectedRoute>
        } />

        <Route path="/cohort" element={
          <ProtectedRoute>
            <Nav modelStatus={modelStatus} userRole={userRole} setRole={setRole} />
            <main style={{ flex: 1 }}>
              {userRole === 'clinician'
                ? <ClinicalDashboard
                    history={history}
                    setResult={setResult}
                    selectedSubjects={selectedSubjects}
                    setSelectedSubjects={setSelectedSubjects}
                  />
                : <Navigate to="/" replace />}
            </main>
          </ProtectedRoute>
        } />

        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Nav modelStatus={modelStatus} userRole={userRole} setRole={setRole} />
            <main style={{ flex: 1 }}>
              {userRole === 'personal'
                ? <PersonalDashboard history={history} result={result} />
                : <Navigate to="/" replace />}
            </main>
          </ProtectedRoute>
        } />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
