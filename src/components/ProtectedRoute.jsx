import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';

/**
 * Wrap any route that requires a logged-in user.
 * - Shows loader while Firebase resolves auth state
 * - Redirects unauthenticated users to /login
 * - Redirects NEW users (onboardingCompleted === false) to /onboarding ONCE
 * - Returning users (onboardingCompleted === true) pass straight through
 */
export const ProtectedRoute = ({ children }) => {
  // Single hook call — never call hooks conditionally
  const { currentUser, loadingAuth, onboardingCompleted } = useApp();
  const location = useLocation();

  // ── 1. Still waiting for Firebase to resolve auth ──
  if (loadingAuth) {
    return (
      <div className="min-h-screen bg-[#F9F7F2] flex flex-col items-center justify-center space-y-5">
        <div className="w-20 h-20 bg-[#BA7517] rounded-full flex items-center justify-center text-5xl shadow-lg border-4 border-[#673D00] animate-pulse">
          🌺
        </div>
        <p className="text-2xl font-bold text-[#855000]">Heritage Care</p>
        <p className="text-base font-medium text-[#524436] animate-pulse">Loading your session…</p>
      </div>
    );
  }

  // ── 2. Not logged in → go to login ────────────────
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // ── 3. New user hasn't completed onboarding yet ───
  //    Skip this guard when already ON the onboarding page to prevent loop
  if (!onboardingCompleted && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  // ── 4. Returning user with profile loaded → allow ─
  return children;
};
