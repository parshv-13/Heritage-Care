import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { recordAndSync, speakText } from '../services/gameStorage';
import { ArrowLeft, RefreshCw, Volume2, Music, CheckCircle2 } from 'lucide-react';

const GARO_DRUMS = [
  { id: 0, name: 'Kram Drum 1 (Low Note)', pitch: 220 },
  { id: 1, name: 'Kram Drum 2 (Mid-Low Note)', pitch: 330 },
  { id: 2, name: 'Kram Drum 3 (Mid-High Note)', pitch: 440 },
  { id: 3, name: 'Kram Drum 4 (High Note)', pitch: 550 },
];

export function WangalaDrums() {
  const navigate = useNavigate();
  const { currentUser: user } = useApp();

  const [sequence, setSequence] = useState([]);
  const [playerInput, setPlayerInput] = useState([]);
  const [activeDrumId, setActiveDrumId] = useState(null);
  const [phase, setPhase] = useState('idle'); // 'idle' | 'playing' | 'player_turn' | 'success'
  const [level, setLevel] = useState(1);
  const [feedback, setFeedback] = useState('Listen to the Wangala 100-Drums rhythm sequence.');

  const playDrumBeat = (pitch) => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(pitch, ctx.currentTime);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch {
      // Audio fallback
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
            setFeedback('Your turn: Tap the drums in the exact order played.');
          }
        }, 150);
      }, (step + 1) * 700);
    });
  };

  const handleDrumTap = (drumIdx) => {
    if (phase !== 'player_turn') return;

    setActiveDrumId(drumIdx);
    playDrumBeat(GARO_DRUMS[drumIdx].pitch);
    setTimeout(() => setActiveDrumId(null), 150);

    const newInput = [...playerInput, drumIdx];
    setPlayerInput(newInput);

    const currentStep = newInput.length - 1;
    if (newInput[currentStep] !== sequence[currentStep]) {
      setFeedback('Sequence mismatch. Repeating the pattern for practice.');
      speakText('Let us repeat the rhythm pattern together.');
      setTimeout(() => playSequence(sequence), 1000);
      setPlayerInput([]);
      return;
    }

    if (newInput.length === sequence.length) {
      const nextLevel = level + 1;
      setLevel(nextLevel);
      setFeedback(`Completed Level ${level}. Adding the next drum beat.`);

      recordAndSync(user?.uid, 'wangala-drums', {
        attempts: level,
        timeTakenSeconds: 30,
        accuracy: 100,
        difficulty: level > 3 ? 'harder' : 'standard',
      });

      const nextSeq = [...sequence, Math.floor(Math.random() * 4)];
      setSequence(nextSeq);
      setPlayerInput([]);
      setTimeout(() => playSequence(nextSeq), 1200);
    }
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
            Garo Wangala Festival
          </span>
          <button
            onClick={() => speakText('Wangala Drumbeat Echo. Repeat the drum pattern played by the Garo festival drummers.')}
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
            Wangala 100-Drums Echo
          </h1>
          <p className="text-base font-bold text-[#0B3C5D] mt-1">{feedback}</p>
        </div>

        {/* Level and Sequence Progress */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-[#F9F9F9] border-2 border-[#1A1A1A] p-4 rounded-lg">
            <span className="text-xs font-bold uppercase text-[#333333]">Current Difficulty</span>
            <p className="text-xl font-bold text-[#1A1A1A] mt-1">Level {level}</p>
          </div>
          <div className="bg-[#F9F9F9] border-2 border-[#1A1A1A] p-4 rounded-lg">
            <span className="text-xs font-bold uppercase text-[#333333]">Sequence Length</span>
            <p className="text-xl font-bold text-[#1A1A1A] mt-1">{sequence.length} Drum Beats</p>
          </div>
        </div>

        {/* Drums Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {GARO_DRUMS.map((drum) => {
            const isPlayingThis = activeDrumId === drum.id;
            return (
              <button
                key={drum.id}
                onClick={() => handleDrumTap(drum.id)}
                disabled={phase !== 'player_turn'}
                className={`h-28 rounded-lg border-2 p-4 text-left flex items-center justify-between transition-colors ${
                  isPlayingThis
                    ? 'bg-[#0B3C5D] text-white border-[#0B3C5D]'
                    : phase === 'player_turn'
                    ? 'bg-[#FFFFFF] hover:bg-[#F9F9F9] text-[#1A1A1A] border-[#1A1A1A] cursor-pointer'
                    : 'bg-[#F9F9F9] text-[#777777] border-[#CCCCCC] cursor-not-allowed'
                }`}
              >
                <div className="space-y-1">
                  <h3 className="text-lg font-bold">{drum.name}</h3>
                  <p className="text-xs">{drum.pitch} Hz Pitch</p>
                </div>
                <Music className="w-8 h-8 shrink-0" />
              </button>
            );
          })}
        </div>

        {/* Actions */}
        <div className="pt-4 border-t-2 border-[#1A1A1A]">
          <button
            onClick={startNewGame}
            className="w-full sm:w-auto h-16 px-8 bg-[#0B3C5D] hover:bg-[#08283E] text-white font-bold text-lg rounded-lg border-2 border-[#0B3C5D] flex items-center justify-center gap-3 cursor-pointer"
          >
            <RefreshCw className="w-5 h-5" />
            <span>{phase === 'idle' ? 'Start Wangala Drum Echo' : 'Restart Drum Sequence'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
