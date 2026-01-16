import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Onboarding from './pages/Onboarding';
import ProfileSetup from './pages/ProfileSetup';
import Home from './pages/Home';
import Experiments from './pages/Experiments';
import ExperimentDetail from './pages/ExperimentDetail';
import Progress from './pages/Progress';
import TabNavigation from './components/TabNavigation';

function MainApp() {
  const [activeTab, setActiveTab] = useState<
    'home' | 'experiments' | 'progress'
  >('home');

  return (
    <div className="relative">
      {activeTab === 'home' && <Home />}
      {activeTab === 'experiments' && <Experiments />}
      {activeTab === 'progress' && <Progress />}
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}

function ProtectedRoute() {
  const onboardingCompleted = localStorage.getItem('onboarding_completed');
  const profileCompleted = localStorage.getItem('profile_completed');

  // İlk açılış - onboarding göster
  if (onboardingCompleted !== 'true') {
    return <Navigate to="/onboarding" replace />;
  }

  // Onboarding tamamlandı ama profil yok - profile setup göster
  if (profileCompleted !== 'true') {
    return <Navigate to="/profile-setup" replace />;
  }

  // Her şey tamam - ana sayfayı göster
  return <MainApp />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/profile-setup" element={<ProfileSetup />} />
        <Route
          path="/experiment/:experimentId"
          element={<ExperimentDetail />}
        />
        <Route path="/" element={<ProtectedRoute />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
