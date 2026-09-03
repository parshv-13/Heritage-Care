import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, Sparkles, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { speakText } from '../services/gameStorage';

export const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const { currentTheme } = useApp();

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      // Prevent default Chrome install banner
      e.preventDefault();
      setDeferredPrompt(e);
      // Show custom elder-friendly install prompt
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Also check if app is already installed / running in standalone mode
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShowPrompt(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    speakText("Installing Heritage Care app to your home screen");

    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        console.log('[PWA] User accepted installation prompt');
      }
      setDeferredPrompt(null);
      setShowPrompt(false);
    } else {
      // Fallback instructions for iOS / browsers that don't support beforeinstallprompt
      alert("To install: Tap your browser's Share/Menu button (⋮) and select 'Add to Home Screen'!");
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 max-w-md mx-auto z-50 animate-bounce-subtle">
      <div 
        className="bg-white border-3 rounded-3xl p-5 shadow-2xl space-y-3 relative overflow-hidden"
        style={{ borderColor: currentTheme.primary }}
      >
        {/* Top Decorative Cultural Stripe */}
        <div 
          className="h-2 w-full absolute top-0 left-0 right-0"
          style={{ background: currentTheme.borderPattern || currentTheme.primary }}
        />

        <button 
          onClick={handleDismiss}
          className="absolute top-3 right-3 p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full"
          aria-label="Close prompt"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 pt-1">
          <div 
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-md border-2"
            style={{ backgroundColor: `${currentTheme.primary}20`, borderColor: currentTheme.primary }}
          >
            📱
          </div>
          <div>
            <h3 className="text-xl font-bold text-[#1B1C19] flex items-center gap-1.5">
              Install App on Phone <Sparkles className="w-4 h-4 text-[#BA7517]" />
            </h3>
            <p className="text-sm font-semibold text-[#855000]">
              Play offline anytime without internet!
            </p>
          </div>
        </div>

        <div className="space-y-1 text-xs text-[#524436] font-medium bg-[#F9F7F2] p-2.5 rounded-xl border border-gray-200">
          <div className="flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-[#386A0E]" /> 1-Tap Home Screen Access for Elders
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-[#386A0E]" /> Full Offline Memory Match & Reminders
          </div>
        </div>

        <div className="flex gap-2 pt-1">
          <button
            onClick={handleInstallClick}
            className="flex-1 touch-target text-white font-bold text-lg py-3 rounded-2xl shadow-md flex items-center justify-center gap-2 transition border-2"
            style={{ backgroundColor: currentTheme.primary, borderColor: currentTheme.accent || currentTheme.primary }}
          >
            <Download className="w-6 h-6" /> Install Heritage Care
          </button>
          <button
            onClick={handleDismiss}
            className="px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-2xl text-sm"
          >
            Later
          </button>
        </div>
      </div>
    </div>
  );
};
