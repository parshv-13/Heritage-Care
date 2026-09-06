import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { recordAndSync, speakText } from '../services/gameStorage';
import { ArrowLeft, Volume2, Footprints, RotateCcw, CheckCircle2 } from 'lucide-react';

const TRAIL_WAYPOINTS = [
  { id: 1, name: 'Compassion Wheel', motif: '☸️', soundNote: 261.63, description: 'Valley of Rhododendrons Trail', distanceMeters: 50 },
  { id: 2, name: 'Peace Wheel', motif: '☸️', soundNote: 329.63, description: 'Misty Pine Forest Ridge', distanceMeters: 100 },
  { id: 3, name: 'Wisdom Wheel', motif: '☸️', soundNote: 392.00, description: 'High Mountain Stream Crossing', distanceMeters: 150 },
  { id: 4, name: 'Harmony Sanctuary', motif: '☸️', soundNote: 523.25, description: 'Golden Monastery Gateway', distanceMeters: 200 },
];

export function MonasteryWalk() {
  const navigate = useNavigate();
  const { currentUser: user, patientName } = useApp();

  const [walkProgress, setWalkProgress] = useState(0); // 0 to 100%
  const [currentWaypointIdx, setCurrentWaypointIdx] = useState(0);
  const [spunWheels, setSpunWheels] = useState([]);
  const [activeSpinning, setActiveSpinning] = useState(null);
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
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.0);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 2.0);
    } catch {
      // Fallback
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
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } catch {
      // Fallback
    }
  };

  const handleWalkStep = () => {
    playFootstepTone();
    setStepCount((prev) => prev + 1);

    const nextProgress = Math.min(100, walkProgress + 10);
    setWalkProgress(nextProgress);

    const reachedIdx = Math.min(TRAIL_WAYPOINTS.length - 1, Math.floor((nextProgress / 100) * TRAIL_WAYPOINTS.length));
    if (reachedIdx !== currentWaypointIdx) {
      setCurrentWaypointIdx(reachedIdx);
      speakText(`You have reached ${TRAIL_WAYPOINTS[reachedIdx].name} at ${TRAIL_WAYPOINTS[reachedIdx].description}.`);
    }
  };

  const handleSpinCurrentWheel = (wheel) => {
    setActiveSpinning(wheel.id);
    playBowlChime(wheel.soundNote);

    setTimeout(() => setActiveSpinning(null), 150);

    if (!spunWheels.includes(wheel.id)) {
      const updated = [...spunWheels, wheel.id];
      setSpunWheels(updated);

      if (updated.length === TRAIL_WAYPOINTS.length) {
        speakText('You have completed the mountain trail and spun all monastery prayer wheels in mindfulness.');
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
    <div className="bg-[#FFFFFF] pb-32 pt-6 px-4 max-w-4xl mx-auto space-y-6 text-left">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-[#1A1A1A] pb-4">
        <button
          onClick={() => navigate('/home')}
          className="h-16 px-6 bg-[#FFFFFF] hover:bg-[#F9F9F9] text-[#1A1A1A] font-bold rounded-lg border-2 border-[#1A1A1A] flex items-center gap-3 cursor-pointer self-start"
        >
          <ArrowLeft className="w-6 h-6" />
          <span>Back to Games</span>
        </button>
        <div className="flex items-center gap-3">
          <span className="bg-[#F9F9F9] text-[#1A1A1A] text-sm px-3 py-1 rounded border-2 border-[#1A1A1A] font-bold">
            Arunachal & Sikkim Trail
          </span>
          <button
            onClick={() => speakText('Monastery Prayer Wheel Sanctuary Walk. Walk the mountain trail and spin wheels along the path.')}
            className="h-16 px-6 bg-[#0B3C5D] hover:bg-[#08283E] text-white font-bold rounded-lg border-2 border-[#0B3C5D] flex items-center gap-2 cursor-pointer"
          >
            <Volume2 className="w-6 h-6" />
            <span>Read Aloud</span>
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-[#FFFFFF] border-2 border-[#1A1A1A] rounded-lg p-6 space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1A1A1A]">
            Monastery Scenic Trail & Prayer Wheels
          </h1>
          <p className="text-base text-[#333333] mt-1">
            Low-stimulation peaceful walking exercise. Zero failure pressure.
          </p>
          <p className="text-sm font-semibold text-[#0B3C5D] mt-1">
            Walker: {patientName || 'Senior Walker'} • Progress: {walkProgress}% • Mindful Steps: {stepCount}
          </p>
        </div>

        {/* Trail Progress Meter */}
        <div className="bg-[#F9F9F9] border-2 border-[#1A1A1A] rounded-lg p-6 space-y-3">
          <div className="flex justify-between items-center text-base font-bold text-[#1A1A1A]">
            <span>Trail Distance Walked</span>
            <span>{walkProgress}% Completed</span>
          </div>
          <div className="w-full bg-[#FFFFFF] border-2 border-[#1A1A1A] h-8 rounded-lg overflow-hidden p-1">
            <div
              className="bg-[#0B3C5D] h-full rounded"
              style={{ width: `${walkProgress}%` }}
            />
          </div>
        </div>

        {/* Active Waypoint Panel */}
        <div className="bg-[#F9F9F9] border-2 border-[#1A1A1A] rounded-lg p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="inline-block bg-[#FFFFFF] border border-[#1A1A1A] text-xs font-bold px-3 py-1 rounded text-[#1A1A1A]">
              Waypoint {currentWaypointIdx + 1} of {TRAIL_WAYPOINTS.length}
            </span>
            <h2 className="text-2xl font-bold text-[#1A1A1A]">{currentWheel.name}</h2>
            <p className="text-base text-[#333333]">{currentWheel.description}</p>
            <p className="text-sm font-bold text-[#0B3C5D]">
              {isCurrentSpun ? 'Status: Spun in Blessing and Mindfulness' : 'Action Required: Tap the button to spin the brass prayer wheel.'}
            </p>
          </div>

          <button
            onClick={() => handleSpinCurrentWheel(currentWheel)}
            className={`h-20 px-8 rounded-lg font-bold text-lg border-2 flex items-center justify-center gap-3 cursor-pointer shrink-0 ${
              isCurrentSpun
                ? 'bg-[#1D6F42] text-white border-[#1D6F42]'
                : 'bg-[#0B3C5D] hover:bg-[#08283E] text-white border-[#0B3C5D]'
            }`}
          >
            <span className="text-2xl">{currentWheel.motif}</span>
            <span>{isCurrentSpun ? 'Wheel Spun (Sounded)' : 'Spin Prayer Wheel'}</span>
          </button>
        </div>

        {/* Waypoints Status List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {TRAIL_WAYPOINTS.map((w, idx) => {
            const isSpun = spunWheels.includes(w.id);
            const isCurrent = currentWaypointIdx === idx;
            return (
              <div
                key={w.id}
                className={`p-4 rounded-lg border-2 text-left space-y-1 ${
                  isCurrent
                    ? 'bg-[#FFFFFF] border-[#0B3C5D]'
                    : isSpun
                    ? 'bg-[#F9F9F9] border-[#1D6F42]'
                    : 'bg-[#FFFFFF] border-[#CCCCCC]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xl">{w.motif}</span>
                  {isSpun && <CheckCircle2 className="w-5 h-5 text-[#1D6F42]" />}
                </div>
                <h3 className="text-sm font-bold text-[#1A1A1A]">{w.name}</h3>
                <p className="text-xs text-[#333333]">{w.distanceMeters} meters along trail</p>
                <p className="text-xs font-bold text-[#0B3C5D]">
                  {isSpun ? 'Completed' : isCurrent ? 'Current Position' : 'Upcoming'}
                </p>
              </div>
            );
          })}
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4 border-t-2 border-[#1A1A1A]">
          <button
            onClick={handleWalkStep}
            className="h-16 px-8 bg-[#0B3C5D] hover:bg-[#08283E] text-white font-bold text-lg rounded-lg border-2 border-[#0B3C5D] flex items-center justify-center gap-3 cursor-pointer flex-1"
          >
            <Footprints className="w-6 h-6" />
            <span>Walk Forward Along Trail (+10%)</span>
          </button>

          <button
            onClick={() => {
              setWalkProgress(0);
              setCurrentWaypointIdx(0);
              setSpunWheels([]);
              setStepCount(0);
              speakText('Beginning a fresh peaceful trail walk.');
            }}
            className="h-16 px-6 bg-[#FFFFFF] hover:bg-[#F9F9F9] text-[#1A1A1A] font-bold text-base rounded-lg border-2 border-[#1A1A1A] flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Restart Trail</span>
          </button>
        </div>
      </div>
    </div>
  );
}
