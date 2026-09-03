import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { recordAndSync, speakText } from '../services/gameStorage';
import { ArrowLeft, Volume2, Sparkles, Heart, RefreshCw, Footprints, Wind, Sun, Mountain } from 'lucide-react';

const TRAIL_WAYPOINTS = [
  { id: 1, name: 'Compassion Wheel', motif: '☸️', soundNote: 261.63, description: 'Valley of Rhododendrons', distanceMeters: 50 },
  { id: 2, name: 'Peace Wheel', motif: '☸️', soundNote: 329.63, description: 'Misty Pine Ridge', distanceMeters: 100 },
  { id: 3, name: 'Wisdom Wheel', motif: '☸️', soundNote: 392.00, description: 'High Mountain Stream Crossing', distanceMeters: 150 },
  { id: 4, name: 'Harmony Sanctuary', motif: '☸️', soundNote: 523.25, description: 'Golden Monastery Gateway', distanceMeters: 200 },
];

export function MonasteryWalk() {
  const navigate = useNavigate();
  const { currentUser: user } = useApp();

  const [walkProgress, setWalkProgress] = useState(0); // 0 to 100%
  const [currentWaypointIdx, setCurrentWaypointIdx] = useState(0);
  const [spunWheels, setSpunWheels] = useState([]);
  const [activeSpinning, setActiveSpinning] = useState(null);
  const [isWalking, setIsWalking] = useState(false);
  const [stepCount, setStepCount] = useState(0);

  // Play resonant singing bowl tone
  const playBowlChime = (freq) => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.35, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.2);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 2.2);
    } catch {
      // Audio fallback
    }
  };

  const playFootstepTone = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(90, ctx.currentTime);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch {
      // Audio fallback
    }
  };

  const handleWalkStep = () => {
    setIsWalking(true);
    playFootstepTone();
    setStepCount((prev) => prev + 1);

    const nextProgress = Math.min(100, walkProgress + 10);
    setWalkProgress(nextProgress);

    // Calculate which waypoint we have arrived at
    const reachedIdx = Math.min(TRAIL_WAYPOINTS.length - 1, Math.floor((nextProgress / 100) * TRAIL_WAYPOINTS.length));
    if (reachedIdx !== currentWaypointIdx) {
      setCurrentWaypointIdx(reachedIdx);
      speakText(`You have reached ${TRAIL_WAYPOINTS[reachedIdx].name} at ${TRAIL_WAYPOINTS[reachedIdx].description}.`);
    }

    setTimeout(() => setIsWalking(false), 400);
  };

  const handleSpinCurrentWheel = (wheel) => {
    setActiveSpinning(wheel.id);
    playBowlChime(wheel.soundNote);

    setTimeout(() => setActiveSpinning(null), 1200);

    if (!spunWheels.includes(wheel.id)) {
      const updated = [...spunWheels, wheel.id];
      setSpunWheels(updated);

      if (updated.length === TRAIL_WAYPOINTS.length) {
        speakText('You have walked the serene mountain trail and spun all monastery prayer wheels in blessing.');
        recordAndSync(user?.uid, 'monastery-walk', {
          attempts: 1,
          timeTakenSeconds: 90,
          accuracy: 100,
          difficulty: 'low-stim',
        });
      }
    }
  };

  const currentWheel = TRAIL_WAYPOINTS[currentWaypointIdx];
  const isCurrentSpun = spunWheels.includes(currentWheel.id);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 pb-32">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigate('/home')}
          className="flex items-center space-x-2 text-[#2D3748] hover:text-indigo-900 transition font-medium"
        >
          <ArrowLeft className="w-6 h-6" />
          <span>Back to Games</span>
        </button>
        <div className="flex items-center space-x-3">
          <span className="bg-indigo-100 text-indigo-900 text-sm px-3 py-1 rounded-full font-semibold border border-indigo-300">
            Arunachal & Sikkim Mountain Trail 🏔️
          </span>
          <button
            onClick={() => speakText('Monastery Prayer Wheel Sanctuary Walk. Walk the peaceful mountain trail and spin wheels along the path.')}
            className="p-2 bg-indigo-700 text-white rounded-full hover:bg-indigo-800 transition shadow-sm"
          >
            <Volume2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Low-Stimulation Sanctuary Container */}
      <div className="bg-slate-900 text-indigo-100 rounded-3xl p-6 md:p-8 shadow-2xl border-4 border-indigo-900/50 space-y-6">
        
        <div className="text-center space-y-2">
          <h1 className="text-2xl md:text-3xl font-extrabold text-indigo-100 flex items-center justify-center gap-2">
            🏔️ Monastery Scenic Trail & Prayer Wheels
          </h1>
          <p className="text-indigo-200/90 text-sm md:text-base">
            A tranquil scenic walking simulation through Arunachal & Sikkim mountain paths.
          </p>
          <div className="inline-flex items-center space-x-2 bg-indigo-950/80 px-4 py-1 rounded-full text-xs font-semibold text-indigo-300 border border-indigo-800">
            <Heart className="w-4 h-4 text-emerald-400" />
            <span>Zero Failure Pressure — Calming & Sundowning Relief</span>
          </div>
        </div>

        {/* ── Panoramic Himalayan Landscape Canvas ── */}
        <div className="relative h-64 md:h-80 rounded-3xl overflow-hidden border-2 border-indigo-700/50 shadow-2xl bg-gradient-to-b from-[#0F172A] via-[#1E1B4B] to-[#0A0F1D]">
          
          {/* Animated Mountain Layers with Parallax Drift */}
          <div
            className="absolute inset-0 bg-cover bg-bottom opacity-40 transition-transform duration-1000"
            style={{
              backgroundImage: 'radial-gradient(ellipse at top, #4338CA 0%, transparent 70%)',
              transform: `translateX(-${walkProgress * 0.2}%)`,
            }}
          />

          {/* Majestic Mountain Peaks Silhouette */}
          <div className="absolute inset-x-0 bottom-16 h-36 flex items-end justify-around opacity-30 pointer-events-none">
            <div className="w-0 h-0 border-l-[120px] border-l-transparent border-r-[120px] border-r-transparent border-b-[140px] border-b-indigo-400" />
            <div className="w-0 h-0 border-l-[160px] border-l-transparent border-r-[160px] border-r-transparent border-b-[180px] border-b-indigo-300" />
            <div className="w-0 h-0 border-l-[100px] border-l-transparent border-r-[100px] border-r-transparent border-b-[120px] border-b-indigo-500" />
          </div>

          {/* Gentle Mountain Mist overlay */}
          <div className="absolute inset-0 bg-indigo-500/10 pointer-events-none animate-pulse" />

          {/* Scenic Trail Footpath with Stones */}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-stone-900 via-[#1A202C] to-transparent border-b-4 border-amber-800/40">
            <div className="flex justify-between items-center h-full px-8 opacity-60">
              <span className="text-xl">🪨</span>
              <span className="text-lg">🌿</span>
              <span className="text-xl">🌸</span>
              <span className="text-lg">🪨</span>
              <span className="text-xl">🌿</span>
            </div>
          </div>

          {/* Walking Avatar Simulation along the trail */}
          <div
            className={`absolute bottom-6 transition-all duration-700 flex flex-col items-center z-20 ${
              isWalking ? 'scale-110 -translate-y-2' : ''
            }`}
            style={{ left: `${Math.min(85, Math.max(10, walkProgress))}%` }}
          >
            <div className="text-4xl filter drop-shadow-lg">
              {isWalking ? '🚶‍♂️' : '🧘‍♂️'}
            </div>
            <span className="text-[10px] font-bold bg-black/60 px-2 py-0.5 rounded-full text-indigo-200 mt-1 border border-indigo-500/40">
              {patientName || 'Walker'}
            </span>
          </div>

          {/* Monastery Gateway at the Trail End */}
          <div className="absolute right-4 bottom-8 text-5xl opacity-90 filter drop-shadow-lg pointer-events-none">
            ⛩️
          </div>

          {/* Trail Progress Ribbon */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between bg-slate-950/70 backdrop-blur-xs px-4 py-2 rounded-2xl border border-indigo-700/40 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-indigo-300">
              <Mountain className="w-4 h-4 text-indigo-400" />
              <span>Trail Progress: {walkProgress}%</span>
            </span>
            <span className="text-amber-300 font-bold">
              👟 {stepCount} Mindful Steps Taken
            </span>
          </div>
        </div>

        {/* ── Active Waypoint & Interactive Prayer Wheel ── */}
        <div className="bg-gradient-to-r from-slate-950 to-indigo-950 p-6 rounded-3xl border-2 border-indigo-700/40 shadow-inner flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-block bg-indigo-900/80 text-indigo-200 text-xs px-3 py-1 rounded-full font-bold">
              Waypoint {currentWaypointIdx + 1} of {TRAIL_WAYPOINTS.length}
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-amber-200">{currentWheel.name}</h3>
            <p className="text-indigo-300 text-sm">{currentWheel.description}</p>
            <p className="text-xs text-indigo-400">
              {isCurrentSpun ? '✨ Spun in Blessing & Mindfulness' : 'Tap the brass prayer wheel to spin and sound the resonant bowl.'}
            </p>
          </div>

          {/* Prayer Wheel Interaction */}
          <button
            onClick={() => handleSpinCurrentWheel(currentWheel)}
            className={`w-32 h-36 rounded-3xl border-3 flex flex-col items-center justify-center p-3 transition-all duration-700 transform shadow-2xl shrink-0 ${
              activeSpinning === currentWheel.id
                ? 'bg-amber-600/50 border-amber-300 rotate-180 scale-105 shadow-amber-500/30'
                : isCurrentSpun
                ? 'bg-indigo-900/70 border-indigo-400 text-indigo-200'
                : 'bg-slate-800 border-amber-500/60 text-amber-200 hover:scale-105 hover:bg-slate-700 cursor-pointer'
            }`}
          >
            <span className={`text-5xl mb-2 transition-transform duration-700 ${activeSpinning === currentWheel.id ? 'rotate-[360deg]' : ''}`}>
              {currentWheel.motif}
            </span>
            <span className="text-xs font-bold text-center">
              {activeSpinning === currentWheel.id ? 'Resonating...' : isCurrentSpun ? 'Blessing Spun' : 'Tap to Spin ☸️'}
            </span>
          </button>
        </div>

        {/* ── All 4 Waypoints Row Indicator ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {TRAIL_WAYPOINTS.map((w, idx) => {
            const isSpun = spunWheels.includes(w.id);
            const isCurrent = currentWaypointIdx === idx;
            return (
              <div
                key={w.id}
                className={`p-3 rounded-2xl border text-center transition ${
                  isCurrent
                    ? 'bg-indigo-800/80 border-amber-400 text-white shadow-md'
                    : isSpun
                    ? 'bg-indigo-950/60 border-indigo-600/40 text-indigo-300'
                    : 'bg-slate-900/60 border-slate-800 text-indigo-400/50'
                }`}
              >
                <span className="text-2xl mb-1 block">{w.motif}</span>
                <p className="text-xs font-bold truncate">{w.name}</p>
                <span className="text-[10px] text-amber-300">
                  {isSpun ? '✓ Spun' : isCurrent ? '📍 Here' : `${w.distanceMeters}m`}
                </span>
              </div>
            );
          })}
        </div>

        {/* ── Action Footstep Buttons ── */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <button
            onClick={handleWalkStep}
            className="w-full sm:w-auto bg-gradient-to-r from-emerald-700 to-teal-700 hover:from-emerald-600 hover:to-teal-600 text-white font-extrabold text-lg px-8 py-4 rounded-2xl shadow-xl transition transform active:scale-95 flex items-center justify-center space-x-3 border-2 border-emerald-400"
          >
            <Footprints className="w-6 h-6 animate-bounce" />
            <span>Walk Forward Along Trail</span>
          </button>

          <button
            onClick={() => {
              setWalkProgress(0);
              setCurrentWaypointIdx(0);
              setSpunWheels([]);
              setStepCount(0);
              speakText('Beginning a fresh peaceful trail walk toward the monastery.');
            }}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-indigo-950 text-indigo-300 px-6 py-4 rounded-2xl text-sm font-semibold hover:bg-indigo-900 transition border border-indigo-800"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Restart Trail</span>
          </button>
        </div>
      </div>
    </div>
  );
}

