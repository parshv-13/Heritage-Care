import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { recordAndSync, speakText } from '../services/gameStorage';
import { ArrowLeft, Volume2, Music, CheckCircle2, Footprints, Flame } from 'lucide-react';

export function CherawRhythm() {
  const navigate = useNavigate();
  const { currentUser: user } = useApp();

  const [gridDifficulty, setGridDifficulty] = useState('4-bamboo'); // '4-bamboo' (2x2) | '6-bamboo' (3x3)
  const [bamboosOpen, setBamboosOpen] = useState(false);
  const [activeTargetCell, setActiveTargetCell] = useState(0);
  const [steppedCell, setSteppedCell] = useState(null);
  const [lastStepSuccess, setLastStepSuccess] = useState(null);
  const [score, setScore] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [streak, setStreak] = useState(0);
  const [feedback, setFeedback] = useState('Watch the rhythm. Tap the OPEN chamber when the bamboos slide apart.');
  const [isPlaying, setIsPlaying] = useState(false);
  const [speedLevel, setSpeedLevel] = useState(1); // 1 = slowest, goes up to 8

  const INITIAL_TEMPO = 1300;
  const MIN_TEMPO = 600;
  const TEMPO_STEP = 90; // ms to reduce per speed level
  const tempoRef = useRef(INITIAL_TEMPO); // ms per pulse cycle

  const playBambooBeat = (type = 'open') => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      if (type === 'open') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(587.33, ctx.currentTime);
        gain.gain.setValueAtTime(0.25, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.35);
      } else if (type === 'clap') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(160, ctx.currentTime);
        gain.gain.setValueAtTime(0.4, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.12);
      } else if (type === 'success') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(659.25, ctx.currentTime);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.35);
      }
    } catch {
      // Audio fallback
    }
  };

  const is2x2 = gridDifficulty === '4-bamboo';
  const totalCells = is2x2 ? 4 : 9;
  const gridSize = is2x2 ? 2 : 3;

  // Increase speed every 5 successful steps
  useEffect(() => {
    if (score > 0 && score % 5 === 0) {
      const newLevel = Math.min(8, Math.floor(score / 5) + 1);
      if (newLevel !== speedLevel) {
        setSpeedLevel(newLevel);
        const newTempo = Math.max(MIN_TEMPO, INITIAL_TEMPO - (newLevel - 1) * TEMPO_STEP);
        tempoRef.current = newTempo;
        setFeedback(`🔥 Speed Level ${newLevel}! Bamboo rhythm is faster now — stay in tempo!`);
      }
    }
  }, [score]);

  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setInterval(() => {
        setBamboosOpen((prev) => {
          const next = !prev;
          if (next) {
            playBambooBeat('open');
            setActiveTargetCell(Math.floor(Math.random() * totalCells));
          } else {
            playBambooBeat('clap');
          }
          return next;
        });
      }, tempoRef.current);
    }

    return () => clearInterval(timer);
  }, [isPlaying, totalCells, speedLevel]);

  const startGame = () => {
    setIsPlaying(true);
    setScore(0);
    setTotalAttempts(0);
    setStreak(0);
    setSpeedLevel(1);
    tempoRef.current = INITIAL_TEMPO;
    setSteppedCell(null);
    setLastStepSuccess(null);
    setFeedback('Bamboo grid is active! When poles slide apart, tap into the open space.');
    speakText('Mizoram Cheraw Bamboo Dance. Tap into the open bamboo chamber in rhythm.');
  };

  const handleChamberClick = (cellIndex) => {
    if (!isPlaying) return;
    setTotalAttempts((prev) => prev + 1);
    setSteppedCell(cellIndex);

    if (bamboosOpen) {
      setScore((prev) => prev + 1);
      setStreak((prev) => prev + 1);
      setLastStepSuccess(true);
      playBambooBeat('success');
      setFeedback('Perfect step! You tapped the open chamber in harmony with the Cheraw rhythm.');
    } else {
      setStreak(0);
      setLastStepSuccess(false);
      playBambooBeat('clap');
      setFeedback('Watch out! The bamboo poles clapped shut. Wait for them to slide open!');
    }

    // Clear step indicator after a short interval
    setTimeout(() => {
      setSteppedCell(null);
    }, 450);
  };

  const handleEndGame = () => {
    setIsPlaying(false);
    const accuracy = totalAttempts > 0 ? Math.round((score / totalAttempts) * 100) : 100;

    recordAndSync(user?.uid, 'cheraw-rhythm', {
      attempts: totalAttempts,
      timeTakenSeconds: 30,
      accuracy,
      difficulty: gridDifficulty,
    });

    speakText(`Session completed. You made ${score} accurate steps.`);
  };

  return (
    <div className="bg-[#FFFFFF] dark:bg-[#121214] pb-32 pt-6 px-4 max-w-4xl mx-auto space-y-6 text-left transition-colors">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-[#1A1A1A] dark:border-[#3F3F46] pb-4">
        <button
          onClick={() => navigate('/home')}
          className="h-16 px-6 bg-[#FFFFFF] dark:bg-[#27272A] hover:bg-[#F9F9F9] dark:hover:bg-[#3F3F46] text-[#1A1A1A] dark:text-[#F4F4F5] font-bold rounded-lg border-2 border-[#1A1A1A] dark:border-[#52525B] flex items-center gap-3 cursor-pointer self-start"
        >
          <ArrowLeft className="w-6 h-6" />
          <span>Back to Games</span>
        </button>
        <div className="flex items-center gap-3">
          <span className="bg-[#F9F9F9] dark:bg-[#27272A] text-[#1A1A1A] dark:text-[#E4E4E7] text-sm px-3 py-1 rounded border-2 border-[#1A1A1A] dark:border-[#52525B] font-bold">
            Mizoram Cheraw Dance
          </span>
          <button
            onClick={() => speakText('Cheraw Rhythm Tap Game. Tap the open chamber when bamboo poles slide apart.')}
            className="h-16 px-6 bg-[#0B3C5D] dark:bg-[#0284C7] hover:bg-[#08283E] dark:hover:bg-[#0369A1] text-white font-bold rounded-lg border-2 border-[#0B3C5D] dark:border-[#0284C7] flex items-center gap-2 cursor-pointer"
          >
            <Volume2 className="w-6 h-6" />
            <span>Read Aloud</span>
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-[#FFFFFF] dark:bg-[#18181B] border-2 border-[#1A1A1A] dark:border-[#3F3F46] rounded-lg p-6 space-y-6 transition-colors">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1A1A1A] dark:text-[#F4F4F5]">
            Cheraw Bamboo Rhythm Grid
          </h1>
          <p className="text-base font-bold text-[#0B3C5D] dark:text-[#38BDF8] mt-1">{feedback}</p>
        </div>

        {/* Difficulty Selection */}
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => {
              if (!isPlaying) setGridDifficulty('4-bamboo');
            }}
            disabled={isPlaying}
            className={`h-16 px-6 rounded-lg font-bold text-base border-2 transition-all ${
              gridDifficulty === '4-bamboo'
                ? 'bg-[#0B3C5D] text-white border-[#0B3C5D] dark:bg-[#0284C7] dark:border-[#0284C7]'
                : 'bg-[#FFFFFF] dark:bg-[#27272A] text-[#1A1A1A] dark:text-[#F4F4F5] border-[#1A1A1A] dark:border-[#52525B] hover:bg-[#F9F9F9] dark:hover:bg-[#3F3F46]'
            } ${isPlaying ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            4-Chamber Grid (2x2)
          </button>
          <button
            onClick={() => {
              if (!isPlaying) setGridDifficulty('6-bamboo');
            }}
            disabled={isPlaying}
            className={`h-16 px-6 rounded-lg font-bold text-base border-2 transition-all ${
              gridDifficulty === '6-bamboo'
                ? 'bg-[#0B3C5D] text-white border-[#0B3C5D] dark:bg-[#0284C7] dark:border-[#0284C7]'
                : 'bg-[#FFFFFF] dark:bg-[#27272A] text-[#1A1A1A] dark:text-[#F4F4F5] border-[#1A1A1A] dark:border-[#52525B] hover:bg-[#F9F9F9] dark:hover:bg-[#3F3F46]'
            } ${isPlaying ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            9-Chamber Matrix (3x3)
          </button>
        </div>

          <div className="flex items-center justify-between p-4 bg-[#F9F9F9] dark:bg-[#27272A] border-2 border-[#1A1A1A] dark:border-[#52525B] rounded-lg">
            <div className="flex items-center gap-3">
              <span
                className={`w-4 h-4 rounded-full ${
                  !isPlaying
                    ? 'bg-[#A1A1AA]'
                    : bamboosOpen
                    ? 'bg-[#10B981]'
                    : 'bg-[#EF4444]'
                }`}
                style={isPlaying && bamboosOpen ? { animation: 'pulse 1s infinite' } : {}}
              />
              <span className="font-bold text-base text-[#1A1A1A] dark:text-[#F4F4F5]">
                {!isPlaying
                  ? 'Ready to Start'
                  : bamboosOpen
                  ? 'POLES OPEN: STEP IN NOW!'
                  : 'POLES CLAPPED: WAIT!'}
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm font-bold text-[#555555] dark:text-[#A1A1AA]">
              <span>Speed Lv.{speedLevel}</span>
              <span className="text-xs opacity-70">{Math.round(tempoRef.current / 10) / 100}s beat</span>
            </div>
          </div>

        {/* Traditional Bamboo Dance Grid Stage */}
        <div className="relative bg-[#F4F1EA] dark:bg-[#202024] border-4 border-[#8B5A2B] dark:border-[#A27B5C] p-6 sm:p-8 rounded-xl overflow-hidden shadow-inner select-none transition-colors">
          {/* Subtle Ground Mat Texture lines */}
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#8B5A2B_1px,transparent_1px)] [background-size:16px_16px]" />

          {/* Bamboo Grid Chambers */}
          <div
            className={`relative z-10 grid gap-4 max-w-md mx-auto transition-all duration-300 ${
              is2x2 ? 'grid-cols-2' : 'grid-cols-3'
            }`}
            style={{
              padding: bamboosOpen ? '16px' : '4px',
            }}
          >
            {Array.from({ length: totalCells }).map((_, idx) => {
              const isTarget = activeTargetCell === idx;
              const wasJustStepped = steppedCell === idx;

              return (
                <button
                  key={idx}
                  onClick={() => handleChamberClick(idx)}
                  disabled={!isPlaying}
                  aria-label={`Bamboo Chamber ${idx + 1} ${bamboosOpen ? 'Open' : 'Closed'}`}
                  className={`relative h-28 sm:h-32 rounded-xl font-bold text-base flex flex-col items-center justify-center p-2 transition-all duration-200 border-3 overflow-hidden ${
                    !isPlaying
                      ? 'bg-[#E5E0D8] dark:bg-[#2D2D30] text-[#78716C] dark:text-[#A1A1AA] border-[#D6CEBF] dark:border-[#3F3F46] cursor-not-allowed'
                      : bamboosOpen
                      ? isTarget
                        ? 'bg-[#15803D] text-white border-[#166534] shadow-md scale-102 ring-4 ring-[#86EFAC]/60 cursor-pointer'
                        : 'bg-[#FFFFFF] dark:bg-[#2D2D30] text-[#1A1A1A] dark:text-[#F4F4F5] border-[#166534] hover:bg-[#F0FDF4] dark:hover:bg-[#3F3F46] cursor-pointer'
                      : 'bg-[#451A03] dark:bg-[#3E1F11] text-[#FECDD3] border-[#78350F] cursor-pointer opacity-90'
                  }`}
                >
                  {/* Visual Stepping Footprint Animation */}
                  {wasJustStepped && (
                    <div className="absolute inset-0 flex items-center justify-center bg-[#FEF08A]/80 dark:bg-[#854D0E]/80 z-20 animate-pulse">
                      <Footprints
                        className={`w-12 h-12 ${
                          lastStepSuccess ? 'text-[#15803D]' : 'text-[#DC2626]'
                        }`}
                      />
                    </div>
                  )}

                  <Music className="w-6 h-6 mb-1 shrink-0" />
                  <span className="text-sm sm:text-base font-extrabold tracking-wide">
                    {bamboosOpen ? (isTarget ? 'TAP HERE' : 'OPEN SPACE') : 'POLE SHUT'}
                  </span>
                  <span className="text-[11px] font-semibold opacity-80 mt-0.5">
                    Chamber #{idx + 1}
                  </span>
                </button>
              );
            })}
          </div>

          {/* VISIBLE MOVING BAMBOO POLES */}
          {/* Top & Bottom Horizontal Bamboo Poles */}
          <div
            className="absolute left-0 right-0 h-7 pointer-events-none transition-all duration-300 flex items-center justify-between px-3 z-20 shadow-md"
            style={{
              top: bamboosOpen ? '2px' : '38%',
              background: 'linear-gradient(180deg, #997438 0%, #684B1F 50%, #4D3715 100%)',
              borderRadius: '9999px',
              border: '2px solid #3E2711',
            }}
          >
            <div className="w-full flex justify-around opacity-40">
              <span className="w-1 h-5 bg-[#3E2711] rounded-full" />
              <span className="w-1 h-5 bg-[#3E2711] rounded-full" />
              <span className="w-1 h-5 bg-[#3E2711] rounded-full" />
              <span className="w-1 h-5 bg-[#3E2711] rounded-full" />
            </div>
          </div>

          <div
            className="absolute left-0 right-0 h-7 pointer-events-none transition-all duration-300 flex items-center justify-between px-3 z-20 shadow-md"
            style={{
              bottom: bamboosOpen ? '2px' : '38%',
              background: 'linear-gradient(180deg, #997438 0%, #684B1F 50%, #4D3715 100%)',
              borderRadius: '9999px',
              border: '2px solid #3E2711',
            }}
          >
            <div className="w-full flex justify-around opacity-40">
              <span className="w-1 h-5 bg-[#3E2711] rounded-full" />
              <span className="w-1 h-5 bg-[#3E2711] rounded-full" />
              <span className="w-1 h-5 bg-[#3E2711] rounded-full" />
              <span className="w-1 h-5 bg-[#3E2711] rounded-full" />
            </div>
          </div>

          {/* Left & Right Vertical Bamboo Poles */}
          <div
            className="absolute top-0 bottom-0 w-7 pointer-events-none transition-all duration-300 flex flex-col justify-around py-3 z-20 shadow-md"
            style={{
              left: bamboosOpen ? '2px' : '38%',
              background: 'linear-gradient(90deg, #8A652E 0%, #5B4018 50%, #3D2B10 100%)',
              borderRadius: '9999px',
              border: '2px solid #3E2711',
            }}
          >
            <span className="h-1 w-5 bg-[#3E2711] rounded-full mx-auto opacity-40" />
            <span className="h-1 w-5 bg-[#3E2711] rounded-full mx-auto opacity-40" />
            <span className="h-1 w-5 bg-[#3E2711] rounded-full mx-auto opacity-40" />
            <span className="h-1 w-5 bg-[#3E2711] rounded-full mx-auto opacity-40" />
          </div>

          <div
            className="absolute top-0 bottom-0 w-7 pointer-events-none transition-all duration-300 flex flex-col justify-around py-3 z-20 shadow-md"
            style={{
              right: bamboosOpen ? '2px' : '38%',
              background: 'linear-gradient(90deg, #8A652E 0%, #5B4018 50%, #3D2B10 100%)',
              borderRadius: '9999px',
              border: '2px solid #3E2711',
            }}
          >
            <span className="h-1 w-5 bg-[#3E2711] rounded-full mx-auto opacity-40" />
            <span className="h-1 w-5 bg-[#3E2711] rounded-full mx-auto opacity-40" />
            <span className="h-1 w-5 bg-[#3E2711] rounded-full mx-auto opacity-40" />
            <span className="h-1 w-5 bg-[#3E2711] rounded-full mx-auto opacity-40" />
          </div>
        </div>

        {/* Metrics Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[#F9F9F9] dark:bg-[#27272A] border-2 border-[#1A1A1A] dark:border-[#52525B] p-4 rounded-lg">
            <span className="text-xs font-bold uppercase text-[#333333] dark:text-[#A1A1AA]">
              Successful Steps
            </span>
            <p className="text-2xl font-bold text-[#1A1A1A] dark:text-[#F4F4F5] mt-1">{score}</p>
          </div>
          <div className="bg-[#F9F9F9] dark:bg-[#27272A] border-2 border-[#1A1A1A] dark:border-[#52525B] p-4 rounded-lg">
            <span className="text-xs font-bold uppercase text-[#333333] dark:text-[#A1A1AA]">
              Total Step Attempts
            </span>
            <p className="text-2xl font-bold text-[#1A1A1A] dark:text-[#F4F4F5] mt-1">
              {totalAttempts}
            </p>
          </div>
          <div className="bg-[#F9F9F9] dark:bg-[#27272A] border-2 border-[#1A1A1A] dark:border-[#52525B] p-4 rounded-lg flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase text-[#333333] dark:text-[#A1A1AA]">
                Rhythm Streak
              </span>
              <p className="text-2xl font-bold text-[#1A1A1A] dark:text-[#F4F4F5] mt-1">{streak}</p>
            </div>
            {streak > 2 && <Flame className="w-8 h-8 text-[#F97316]" />}
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4 border-t-2 border-[#1A1A1A] dark:border-[#3F3F46]">
          {!isPlaying ? (
            <button
              onClick={startGame}
              className="w-full sm:w-auto h-16 px-8 bg-[#0B3C5D] dark:bg-[#0284C7] hover:bg-[#08283E] dark:hover:bg-[#0369A1] text-white font-bold text-lg rounded-lg border-2 border-[#0B3C5D] dark:border-[#0284C7] flex items-center justify-center gap-3 cursor-pointer"
            >
              <Music className="w-5 h-5" />
              <span>Start Cheraw Rhythm Exercise</span>
            </button>
          ) : (
            <button
              onClick={handleEndGame}
              className="w-full sm:w-auto h-16 px-8 bg-[#1A1A1A] dark:bg-[#27272A] hover:bg-[#333333] dark:hover:bg-[#3F3F46] text-white font-bold text-lg rounded-lg border-2 border-[#1A1A1A] dark:border-[#52525B] flex items-center justify-center gap-3 cursor-pointer"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>Finish Session & Save Score</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
