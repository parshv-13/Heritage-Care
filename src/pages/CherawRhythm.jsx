import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { recordAndSync, speakText } from '../services/gameStorage';
import { ArrowLeft, Volume2, Music, CheckCircle2 } from 'lucide-react';

export function CherawRhythm() {
  const navigate = useNavigate();
  const { currentUser: user } = useApp();

  const [gridDifficulty, setGridDifficulty] = useState('4-bamboo'); // '4-bamboo' (4 cells) | '6-bamboo' (9 cells)
  const [bamboosOpen, setBamboosOpen] = useState(false);
  const [activeTargetCell, setActiveTargetCell] = useState(0);
  const [score, setScore] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [streak, setStreak] = useState(0);
  const [feedback, setFeedback] = useState('Watch the rhythm. Tap the OPEN chamber when poles slide open.');
  const [isPlaying, setIsPlaying] = useState(false);

  const tempoRef = useRef(1300); // ms per pulse cycle

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

  const totalCells = gridDifficulty === '4-bamboo' ? 4 : 9;

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
  }, [isPlaying, totalCells]);

  const startGame = () => {
    setIsPlaying(true);
    setScore(0);
    setTotalAttempts(0);
    setStreak(0);
    setFeedback('Bamboo grid is active. Tap the highlighted OPEN chamber in rhythm.');
    speakText('Mizoram Cheraw Bamboo Dance Rhythm Tap. Tap the open chamber when poles slide apart.');
  };

  const handleChamberClick = (cellIndex) => {
    if (!isPlaying) return;
    setTotalAttempts((prev) => prev + 1);

    if (bamboosOpen) {
      setScore((prev) => prev + 1);
      setStreak((prev) => prev + 1);
      playBambooBeat('success');
      setFeedback('Accurate step in rhythm with the bamboo beat.');
    } else {
      setStreak(0);
      playBambooBeat('clap');
      setFeedback('Poles clapped shut. Wait for the next opening.');
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

    speakText(`Session completed. You made ${score} accurate steps.`);
  };

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
            Mizoram Cheraw Dance
          </span>
          <button
            onClick={() => speakText('Cheraw Rhythm Tap Game. Tap the open chamber when bamboo poles slide apart.')}
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
            Cheraw Bamboo Rhythm Grid
          </h1>
          <p className="text-base font-bold text-[#0B3C5D] mt-1">{feedback}</p>
        </div>

        {/* Difficulty Selection */}
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => setGridDifficulty('4-bamboo')}
            className={`h-16 px-6 rounded-lg font-bold text-base border-2 cursor-pointer ${
              gridDifficulty === '4-bamboo'
                ? 'bg-[#0B3C5D] text-white border-[#0B3C5D]'
                : 'bg-[#FFFFFF] text-[#1A1A1A] border-[#1A1A1A] hover:bg-[#F9F9F9]'
            }`}
          >
            4-Chamber Grid (2x2)
          </button>
          <button
            onClick={() => setGridDifficulty('6-bamboo')}
            className={`h-16 px-6 rounded-lg font-bold text-base border-2 cursor-pointer ${
              gridDifficulty === '6-bamboo'
                ? 'bg-[#0B3C5D] text-white border-[#0B3C5D]'
                : 'bg-[#FFFFFF] text-[#1A1A1A] border-[#1A1A1A] hover:bg-[#F9F9F9]'
            }`}
          >
            9-Chamber Matrix (3x3)
          </button>
        </div>

        {/* Rhythm Grid */}
        <div className="bg-[#F9F9F9] border-2 border-[#1A1A1A] p-6 rounded-lg">
          <div
            className={`grid gap-4 max-w-md mx-auto ${
              gridDifficulty === '4-bamboo' ? 'grid-cols-2' : 'grid-cols-3'
            }`}
          >
            {Array.from({ length: totalCells }).map((_, idx) => {
              const isTarget = activeTargetCell === idx;
              return (
                <button
                  key={idx}
                  onClick={() => handleChamberClick(idx)}
                  disabled={!isPlaying}
                  className={`h-28 rounded-lg border-2 font-bold text-base flex flex-col items-center justify-center gap-1 ${
                    !isPlaying
                      ? 'bg-[#FFFFFF] text-[#777777] border-[#CCCCCC] cursor-not-allowed'
                      : bamboosOpen
                      ? isTarget
                        ? 'bg-[#1D6F42] text-white border-[#1D6F42] cursor-pointer'
                        : 'bg-[#FFFFFF] text-[#1A1A1A] border-[#1A1A1A] hover:bg-[#F9F9F9] cursor-pointer'
                      : 'bg-[#1A1A1A] text-[#FFFFFF] border-[#1A1A1A] cursor-not-allowed'
                  }`}
                >
                  <Music className="w-6 h-6" />
                  <span>{bamboosOpen ? (isTarget ? 'TAP HERE' : 'OPEN') : 'CLOSED'}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Metrics Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[#F9F9F9] border-2 border-[#1A1A1A] p-4 rounded-lg">
            <span className="text-xs font-bold uppercase text-[#333333]">Successful Steps</span>
            <p className="text-2xl font-bold text-[#1A1A1A] mt-1">{score}</p>
          </div>
          <div className="bg-[#F9F9F9] border-2 border-[#1A1A1A] p-4 rounded-lg">
            <span className="text-xs font-bold uppercase text-[#333333]">Total Attempts</span>
            <p className="text-2xl font-bold text-[#1A1A1A] mt-1">{totalAttempts}</p>
          </div>
          <div className="bg-[#F9F9F9] border-2 border-[#1A1A1A] p-4 rounded-lg">
            <span className="text-xs font-bold uppercase text-[#333333]">Rhythm Streak</span>
            <p className="text-2xl font-bold text-[#1A1A1A] mt-1">{streak}</p>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4 border-t-2 border-[#1A1A1A]">
          {!isPlaying ? (
            <button
              onClick={startGame}
              className="w-full sm:w-auto h-16 px-8 bg-[#0B3C5D] hover:bg-[#08283E] text-white font-bold text-lg rounded-lg border-2 border-[#0B3C5D] flex items-center justify-center gap-3 cursor-pointer"
            >
              <Music className="w-5 h-5" />
              <span>Start Cheraw Rhythm Exercise</span>
            </button>
          ) : (
            <button
              onClick={handleEndGame}
              className="w-full sm:w-auto h-16 px-8 bg-[#1A1A1A] hover:bg-[#333333] text-white font-bold text-lg rounded-lg border-2 border-[#1A1A1A] flex items-center justify-center gap-3 cursor-pointer"
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
