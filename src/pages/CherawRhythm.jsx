import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { recordAndSync, speakText } from '../services/gameStorage';
import { ArrowLeft, RefreshCw, Volume2, Music, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

export function CherawRhythm() {
  const navigate = useNavigate();
  const { currentUser: user } = useApp();

  const [gridDifficulty, setGridDifficulty] = useState('4-bamboo'); // '4-bamboo' (2x2) | '6-bamboo' (3x3)
  const [bamboosOpen, setBamboosOpen] = useState(false);
  const [activeTargetCell, setActiveTargetCell] = useState(0);
  const [score, setScore] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [streak, setStreak] = useState(0);
  const [feedback, setFeedback] = useState('Watch the rhythm! Tap the bright green opening when the bamboos slide open.');
  const [isPlaying, setIsPlaying] = useState(false);

  const tempoRef = useRef(1300); // ms per pulse cycle

  // Audio synthesizer for Mizo bamboo beats & wood clap
  const playBambooBeat = (type = 'open') => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      if (type === 'open') {
        // High melodious wooden resonant ping
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
        gain.gain.setValueAtTime(0.25, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.35);
      } else if (type === 'clap') {
        // Snappy wooden bamboo clap sound
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(160, ctx.currentTime);
        gain.gain.setValueAtTime(0.4, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.12);
      } else if (type === 'success') {
        // Melodic success chord
        osc.type = 'sine';
        osc.frequency.setValueAtTime(659.25, ctx.currentTime); // E5
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
      }
    } catch {
      // Audio fallback silent
    }
  };

  const totalCells = gridDifficulty === '4-bamboo' ? 4 : 9; // 2x2 or 3x3 grid

  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setInterval(() => {
        setBamboosOpen((prev) => {
          const next = !prev;
          if (next) {
            playBambooBeat('open');
            // Pick a random chamber cell for the player to step/tap into
            setActiveTargetCell(Math.floor(Math.random() * totalCells));
          } else {
            playBambooBeat('clap');
          }
          return next;
        });
      }, tempoRef.current);
    }

    return () => clearInterval(timer);
  }, [isPlaying, totalCells]);

  const startGame = () => {
    setIsPlaying(true);
    setScore(0);
    setTotalAttempts(0);
    setStreak(0);
    setFeedback('🎋 Bamboos are moving! Tap the glowing OPEN chamber in rhythm!');
    speakText('Mizoram Cheraw Bamboo Dance Rhythm Tap. Watch the moving bamboo grid and tap inside the open gap when poles slide apart.');
  };

  const handleChamberClick = (cellIndex) => {
    if (!isPlaying) return;
    setTotalAttempts((prev) => prev + 1);

    if (bamboosOpen) {
      if (cellIndex === activeTargetCell || gridDifficulty === '4-bamboo') {
        setScore((prev) => prev + 1);
        setStreak((prev) => prev + 1);
        playBambooBeat('success');
        setFeedback('✨ Splendid Step! In exact harmony with the Mizo rhythm!');
      } else {
        setScore((prev) => prev + 1);
        playBambooBeat('success');
        setFeedback('✨ Good step inside the open bamboo grid!');
      }
    } else {
      setStreak(0);
      playBambooBeat('clap');
      setFeedback('⚠️ Bamboo poles clapped shut! Wait for the next opening.');
    }
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

    speakText(`Session completed. You made ${score} rhythmically accurate steps with ${accuracy} percent accuracy.`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 pb-32">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate('/home')}
          className="flex items-center space-x-2 text-[#4A3728] hover:text-amber-800 transition font-medium"
        >
          <ArrowLeft className="w-6 h-6" />
          <span>Back to Games</span>
        </button>
        <div className="flex items-center space-x-3">
          <span className="bg-emerald-100 text-emerald-900 text-sm px-3 py-1 rounded-full font-semibold border border-emerald-300">
            Mizoram Cheraw Dance 🎋
          </span>
          <button
            onClick={() => speakText('Cheraw Rhythm Tap Game. Tap the glowing opening when 4 bamboo poles slide apart.')}
            className="p-2 bg-emerald-700 text-white rounded-full hover:bg-emerald-800 transition shadow-sm"
          >
            <Volume2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-3xl p-6 shadow-md border-2 border-emerald-900/10">
        <div className="text-center mb-6">
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#4A3728] flex items-center justify-center gap-2">
            🎋 Cheraw Bamboo Rhythm Grid
          </h1>
          <p className="text-stone-700 font-semibold text-base mt-1">{feedback}</p>
        </div>

        {/* Difficulty & Pattern Mode Selector */}
        <div className="flex justify-center items-center gap-3 mb-4">
          <button
            onClick={() => setGridDifficulty('4-bamboo')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition border-2 ${
              gridDifficulty === '4-bamboo'
                ? 'bg-emerald-700 text-white border-emerald-900 shadow-sm'
                : 'bg-stone-100 text-stone-700 border-stone-300 hover:bg-stone-200'
            }`}
          >
            🎋 4-Bamboo Grid (2 Horiz + 2 Vert)
          </button>
          <button
            onClick={() => setGridDifficulty('6-bamboo')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition border-2 ${
              gridDifficulty === '6-bamboo'
                ? 'bg-emerald-700 text-white border-emerald-900 shadow-sm'
                : 'bg-stone-100 text-stone-700 border-stone-300 hover:bg-stone-200'
            }`}
          >
            🎋 6-Bamboo Matrix (3 Horiz + 3 Vert)
          </button>
        </div>

        {/* ── Interactive Bamboo Grid Visualizer ── */}
        <div className="bg-[#FAF4E6] p-6 md:p-8 rounded-3xl border-4 border-amber-900/30 shadow-inner my-4 relative min-h-[340px] md:min-h-[420px] flex items-center justify-center overflow-hidden">
          
          {/* Subtle Stage Motif */}
          <div className="absolute inset-0 bg-gradient-to-b from-amber-100/40 via-transparent to-amber-900/10 pointer-events-none" />

          {/* Dynamic Interactive Chamber Cells (2x2 or 3x3) */}
          <div
            className={`grid gap-4 md:gap-6 w-full max-w-md h-72 md:h-80 relative z-10 ${
              gridDifficulty === '4-bamboo' ? 'grid-cols-2 grid-rows-2' : 'grid-cols-3 grid-rows-3'
            }`}
          >
            {Array.from({ length: totalCells }).map((_, idx) => {
              const isTarget = activeTargetCell === idx;
              return (
                <button
                  key={idx}
                  onClick={() => handleChamberClick(idx)}
                  disabled={!isPlaying}
                  className={`rounded-2xl border-4 flex flex-col items-center justify-center font-extrabold text-sm md:text-base transition-all duration-300 transform active:scale-95 shadow-md ${
                    !isPlaying
                      ? 'bg-amber-800/10 border-amber-900/30 text-amber-950/60 cursor-not-allowed'
                      : bamboosOpen
                      ? isTarget
                        ? 'bg-emerald-500 border-emerald-200 text-white ring-8 ring-emerald-400/60 scale-105 animate-pulse shadow-emerald-500/50 cursor-pointer'
                        : 'bg-emerald-100/90 border-emerald-400 text-emerald-900 hover:bg-emerald-200 cursor-pointer'
                      : 'bg-amber-950/80 border-amber-950 text-amber-200/50 cursor-not-allowed opacity-90'
                  }`}
                >
                  <Music className={`w-6 h-6 mb-1 ${bamboosOpen ? 'text-white animate-bounce' : 'opacity-40'}`} />
                  <span>{bamboosOpen ? (isTarget ? 'TAP HERE! 🦶' : 'OPEN') : 'WAIT...'}</span>
                </button>
              );
            })}
          </div>

          {/* ── 2 or 3 Parallel HORIZONTAL Bamboo Poles ── */}
          {gridDifficulty === '4-bamboo' ? (
            <>
              {/* Horizontal Pole 1 (Top) */}
              <div
                className={`absolute left-0 right-0 h-6 md:h-8 bg-gradient-to-r from-amber-800 via-amber-700 to-amber-900 border-y-2 border-amber-950 shadow-lg rounded-full pointer-events-none transition-all duration-300 z-20 ${
                  bamboosOpen ? 'top-3 -translate-y-2' : 'top-1/3 translate-y-2'
                }`}
              >
                <div className="flex justify-around items-center h-full px-4 opacity-40">
                  <span className="w-1.5 h-full bg-amber-950" />
                  <span className="w-1.5 h-full bg-amber-950" />
                  <span className="w-1.5 h-full bg-amber-950" />
                </div>
              </div>

              {/* Horizontal Pole 2 (Bottom) */}
              <div
                className={`absolute left-0 right-0 h-6 md:h-8 bg-gradient-to-r from-amber-800 via-amber-700 to-amber-900 border-y-2 border-amber-950 shadow-lg rounded-full pointer-events-none transition-all duration-300 z-20 ${
                  bamboosOpen ? 'bottom-3 translate-y-2' : 'bottom-1/3 -translate-y-2'
                }`}
              >
                <div className="flex justify-around items-center h-full px-4 opacity-40">
                  <span className="w-1.5 h-full bg-amber-950" />
                  <span className="w-1.5 h-full bg-amber-950" />
                  <span className="w-1.5 h-full bg-amber-950" />
                </div>
              </div>
            </>
          ) : (
            <>
              {/* 3 Horizontal Poles */}
              <div
                className={`absolute left-0 right-0 h-5 md:h-6 bg-gradient-to-r from-amber-800 via-amber-700 to-amber-900 border-y-2 border-amber-950 shadow-lg rounded-full pointer-events-none transition-all duration-300 z-20 ${
                  bamboosOpen ? 'top-2' : 'top-1/4'
                }`}
              />
              <div
                className={`absolute left-0 right-0 h-5 md:h-6 bg-gradient-to-r from-amber-800 via-amber-700 to-amber-900 border-y-2 border-amber-950 shadow-lg rounded-full pointer-events-none transition-all duration-300 z-20 ${
                  bamboosOpen ? 'top-1/2 -translate-y-1/2 scale-y-75' : 'top-1/2 -translate-y-1/2'
                }`}
              />
              <div
                className={`absolute left-0 right-0 h-5 md:h-6 bg-gradient-to-r from-amber-800 via-amber-700 to-amber-900 border-y-2 border-amber-950 shadow-lg rounded-full pointer-events-none transition-all duration-300 z-20 ${
                  bamboosOpen ? 'bottom-2' : 'bottom-1/4'
                }`}
              />
            </>
          )}

          {/* ── 2 or 3 Parallel VERTICAL Bamboo Poles ── */}
          {gridDifficulty === '4-bamboo' ? (
            <>
              {/* Vertical Pole 1 (Left) */}
              <div
                className={`absolute top-0 bottom-0 w-6 md:w-8 bg-gradient-to-b from-amber-800 via-amber-700 to-amber-900 border-x-2 border-amber-950 shadow-lg rounded-full pointer-events-none transition-all duration-300 z-20 ${
                  bamboosOpen ? 'left-3 -translate-x-2' : 'left-1/3 translate-x-2'
                }`}
              >
                <div className="flex flex-col justify-around items-center w-full h-full py-4 opacity-40">
                  <span className="h-1.5 w-full bg-amber-950" />
                  <span className="h-1.5 w-full bg-amber-950" />
                  <span className="h-1.5 w-full bg-amber-950" />
                </div>
              </div>

              {/* Vertical Pole 2 (Right) */}
              <div
                className={`absolute top-0 bottom-0 w-6 md:w-8 bg-gradient-to-b from-amber-800 via-amber-700 to-amber-900 border-x-2 border-amber-950 shadow-lg rounded-full pointer-events-none transition-all duration-300 z-20 ${
                  bamboosOpen ? 'right-3 translate-x-2' : 'right-1/3 -translate-x-2'
                }`}
              >
                <div className="flex flex-col justify-around items-center w-full h-full py-4 opacity-40">
                  <span className="h-1.5 w-full bg-amber-950" />
                  <span className="h-1.5 w-full bg-amber-950" />
                  <span className="h-1.5 w-full bg-amber-950" />
                </div>
              </div>
            </>
          ) : (
            <>
              {/* 3 Vertical Poles */}
              <div
                className={`absolute top-0 bottom-0 w-5 md:w-6 bg-gradient-to-b from-amber-800 via-amber-700 to-amber-900 border-x-2 border-amber-950 shadow-lg rounded-full pointer-events-none transition-all duration-300 z-20 ${
                  bamboosOpen ? 'left-2' : 'left-1/4'
                }`}
              />
              <div
                className={`absolute top-0 bottom-0 w-5 md:w-6 bg-gradient-to-b from-amber-800 via-amber-700 to-amber-900 border-x-2 border-amber-950 shadow-lg rounded-full pointer-events-none transition-all duration-300 z-20 ${
                  bamboosOpen ? 'left-1/2 -translate-x-1/2 scale-x-75' : 'left-1/2 -translate-x-1/2'
                }`}
              />
              <div
                className={`absolute top-0 bottom-0 w-5 md:w-6 bg-gradient-to-b from-amber-800 via-amber-700 to-amber-900 border-x-2 border-amber-950 shadow-lg rounded-full pointer-events-none transition-all duration-300 z-20 ${
                  bamboosOpen ? 'right-2' : 'right-1/4'
                }`}
              />
            </>
          )}
        </div>

        {/* Score & Status Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-emerald-50 p-4 rounded-2xl text-center border border-emerald-200">
            <p className="text-xs font-bold text-emerald-800 uppercase">Successful Taps</p>
            <p className="text-3xl font-extrabold text-emerald-900 mt-1">{score}</p>
          </div>
          <div className="bg-stone-50 p-4 rounded-2xl text-center border border-stone-200">
            <p className="text-xs font-bold text-stone-600 uppercase">Total Attempts</p>
            <p className="text-3xl font-extrabold text-stone-800 mt-1">{totalAttempts}</p>
          </div>
          <div className="bg-amber-50 p-4 rounded-2xl text-center border border-amber-200 col-span-2 md:col-span-1">
            <p className="text-xs font-bold text-amber-800 uppercase">Rhythm Streak</p>
            <p className="text-3xl font-extrabold text-amber-900 mt-1">🔥 {streak}</p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex justify-center space-x-4">
          {!isPlaying ? (
            <button
              onClick={startGame}
              className="bg-emerald-700 text-white font-bold text-lg px-8 py-3.5 rounded-2xl hover:bg-emerald-800 shadow-lg transition flex items-center space-x-2"
            >
              <Sparkles className="w-5 h-5" />
              <span>Start Cheraw Bamboo Rhythm</span>
            </button>
          ) : (
            <button
              onClick={handleEndGame}
              className="bg-stone-800 text-white font-bold text-base px-6 py-3 rounded-2xl hover:bg-stone-900 shadow-md transition"
            >
              Finish Session & Save Score
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

