import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Navbar, BottomNav } from './components/Navigation';
import { ProtectedRoute } from './components/ProtectedRoute';
import { PWAInstallPrompt } from './components/PWAInstallPrompt';

// Pages
import { Login } from './pages/Login';
import { Onboarding } from './pages/Onboarding';
import { Home } from './pages/Home';
import { MemoryMatch } from './pages/MemoryMatch';
import { DailyRoutine } from './pages/DailyRoutine';
import { PhotoRecall } from './pages/PhotoRecall';
import { Jigsaw } from './pages/Jigsaw';
import { Reminders } from './pages/Reminders';
import { Family } from './pages/Family';
import { Progress } from './pages/Progress';

// Culturally Unified Games
import { KhasiLoom } from './pages/KhasiLoom';
import { CherawRhythm } from './pages/CherawRhythm';
import { MorungStory } from './pages/MorungStory';
import { WangalaDrums } from './pages/WangalaDrums';
import { KitchenMaster } from './pages/KitchenMaster';
import { MonasteryWalk } from './pages/MonasteryWalk';
import { KazirangaRecall } from './pages/KazirangaRecall';

// Register service worker for PWA offline support
const registerSW = () => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => console.log('[PWA] SW registered:', reg.scope))
        .catch((err) => console.log('[PWA] SW registration failed:', err));
    });
  }
};

/** Layout wrapper shown for authenticated pages */
const AppLayout = ({ children }) => (
  <div className="min-h-screen bg-[#FFFFFF] dark:bg-[#121214] text-[#1A1A1A] dark:text-[#E4E4E7] flex flex-col font-sans transition-colors">
    <Navbar />
    <main className="flex-1 pb-32 overflow-y-auto">{children}</main>
    <PWAInstallPrompt />
    <BottomNav />
  </div>
);

export function App() {
  useEffect(() => {
    registerSW();
  }, []);

  return (
    <AppProvider>
      <Router>
        <Routes>
          {/* Public route */}
          <Route path="/login" element={<Login />} />

          {/* Protected routes */}
          <Route
            path="/onboarding"
            element={
              <ProtectedRoute>
                <Onboarding />
              </ProtectedRoute>
            }
          />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Home />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/game/memory-match"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <MemoryMatch />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/game/daily-routine"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <DailyRoutine />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/game/photo-recall"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <PhotoRecall />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/game/jigsaw"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Jigsaw />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/game/khasi-loom"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <KhasiLoom />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/game/cheraw-rhythm"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <CherawRhythm />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/game/morung-story"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <MorungStory />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/game/wangala-drums"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <WangalaDrums />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/game/kitchen-master"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <KitchenMaster />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/game/monastery-walk"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <MonasteryWalk />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/game/kaziranga-recall"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <KazirangaRecall />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/reminders"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Reminders />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/family"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Family />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/progress"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Progress />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;
