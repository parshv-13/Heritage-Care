import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { recordAndSync, speakText } from '../services/gameStorage';
import { ArrowLeft, RefreshCw, Volume2, Music2, Sparkles, CheckCircle } from 'lucide-react';

const GARO_DRUMS = [
  { id: 0, name: 'Kram Drum 1', pitch: 220, color: 'bg-amber-700 hover:bg-amber-600', activeBg: 'bg-amber-400 ring-8 ring-amber-300' },
  { id: 1, name: 'Kram Drum 2', pitch: 330, color: 'bg-red-800 hover:bg-red-700', activeBg: 'bg-red-400 ring-8 ring-red-300' },
  { id: 2, name: 'Kram Drum 3', pitch: 440, color: 'bg-emerald-800 hover:bg-emerald-700', activeBg: 'bg-emerald-400 ring-8 ring-emerald-300' },
  { id: 3, name: 'Kram Drum 4', pitch: 550, color: 'bg-indigo-800 hover:bg-indigo-700', activeBg: 'bg-indigo-400 ring-8 ring-indigo-300' },
];

export function WangalaDrums() {
  const navigate = useNavigate();
  const { currentUser: user } = useApp();

  const [sequence, setSequence] = useState([]);
  const [playerInput, setPlayerInput] = useState([]);
  const [activeDrumId, setActiveDrumId] = useState(null);
  const [phase, setPhase] = useState('idle'); // 'idle' | 'playing' | 'player_turn' | 'success'
  const [level, setLevel] = useState(1);
  const [feedback, setFeedback] = useState('Listen to the 100-Drums Garo Wangala rhythm sequence!');

  // Audio drum pitch generator
  const playDrumBeat = (pitch) => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(pitch, ctx.currentTime);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch {
      // Audio fallback silent
    }
  };

  const startNewGame = () => {
    setLevel(1);
    const firstSeq = [Math.floor(Math.random() * 4), Math.floor(Math.random() * 4)];
    setSequence(firstSeq);
    setPlayerInput([]);
    setPhase('playing');
    setFeedback('Listen carefully to the drum sequence...');
    speakText('Meghalaya Garo Wangala Festival Drum Echo. Listen to the drum pattern and repeat it back.');
    playSequence(firstSeq);
  };

  const playSequence = (seqToPlay) => {
    setPhase('playing');
    seqToPlay.forEach((drumIdx, step) => {
      setTimeout(() => {
        setActiveDrumId(drumIdx);
        playDrumBeat(GARO_DRUMS[drumIdx].pitch);

        setTimeout(() => {
          setActiveDrumId(null);
          if (step === seqToPlay.length - 1) {
            setPhase('player_turn');
            setFeedback('Your turn! Tap the drums back in exact order.');
          }
        }, 400);
      }, (step + 1) * 700);
    });
  };

  const handleDrumTap = (drumIdx) => {
    if (phase !== 'player_turn') return;

    setActiveDrumId(drumIdx);
    playDrumBeat(GARO_DRUMS[drumIdx].pitch);
    setTimeout(() => setActiveDrumId(null), 250);

    const newInput = [...playerInput, drumIdx];
    setPlayerInput(newInput);

    const currentStep = newInput.length - 1;
    if (newInput[currentStep] !== sequence[currentStep]) {
      setFeedback('⚠️ Sequence mismatch! Resetting drum pattern...');
      speakText('Gentle try! Let us repeat the rhythm sequence together.');
      setTimeout(() => playSequence(sequence), 1200);
      setPlayerInput([]);
      return;
    }

    if (newInput.length === sequence.length) {
      // Passed level
      const nextLevel = level + 1;
      setLevel(nextLevel);
      setFeedback(`✨ Great job! Passed Level ${level}! Next drum added.`);

      recordAndSync(user?.uid, 'wangala-drums', {
        attempts: level,
        timeTakenSeconds: 30,
        accuracy: 100,
        difficulty: level > 3 ? 'harder' : 'standard',
      });

      const nextSeq = [...sequence, Math.floor(Math.random() * 4)];
      setSequence(nextSeq);
      setPlayerInput([]);
      setTimeout(() => playSequence(nextSeq), 1500);
    }
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
          <span className="bg-amber-100 text-amber-900 text-sm px-3 py-1 rounded-full font-semibold border border-amber-300">
            Garo Wangala Festival 🥁
          </span>
          <button
            onClick={() => speakText('Wangala Drumbeat Echo. Repeat the drum pattern played by the Garo festival drummers.')}
            className="p-2 bg-amber-700 text-white rounded-full hover:bg-amber-800 transition"
          >
            <Volume2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Game Container */}
      <div className="bg-white rounded-2xl p-6 shadow-md border-2 border-amber-900/10">
        <div className="text-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-[#4A3728] flex items-center justify-center gap-2">
            🥁 Wangala 100-Drums Echo
          </h1>
          <p className="text-stone-600 text-sm mt-1">{feedback}</p>
        </div>

        {/* Level Indicator */}
        <div className="flex justify-center items-center gap-6 mb-6">
          <div className="bg-amber-50 px-4 py-2 rounded-xl border border-amber-200 text-amber-900 font-bold text-sm">
            Rhythm Level: {level}
          </div>
          <div className="bg-stone-50 px-4 py-2 rounded-xl border border-stone-200 text-stone-700 font-bold text-sm">
            Sequence Length: {sequence.length} Beats
          </div>
        </div>

        {/* Drums Stage */}
        <div className="bg-[#4A2B18] p-8 rounded-2xl border-4 border-amber-900/40 shadow-inner my-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {GARO_DRUMS.map((drum) => (
              <button
                key={drum.id}
                onClick={() => handleDrumTap(drum.id)}
                disabled={phase !== 'player_turn'}
                className={`h-36 md:h-44 rounded-2xl flex flex-col items-center justify-center text-white font-bold shadow-xl border-4 border-amber-900/50 transition transform active:scale-95 ${
                  activeDrumId === drum.id ? drum.activeBg : drum.color
                } ${phase === 'player_turn' ? 'cursor-pointer hover:scale-105' : 'cursor-not-allowed'}`}
              >
                <span className="text-4xl mb-2">🪘</span>
                <span className="text-sm font-semibold">{drum.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={startNewGame}
            className="bg-amber-700 text-white font-bold text-lg px-8 py-3.5 rounded-xl hover:bg-amber-800 shadow-md transition flex items-center space-x-2"
          >
            <RefreshCw className="w-5 h-5" />
            <span>{phase === 'idle' ? 'Start Wangala Drum Echo' : 'Restart Festival Drums'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
