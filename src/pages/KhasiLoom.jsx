import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { recordAndSync, speakText } from '../services/gameStorage';
import { ArrowLeft, RefreshCw, Volume2, Eye, CheckCircle2, Sparkles } from 'lucide-react';

const KHASI_COLORS = [
  { id: 'gold', name: 'Silk Gold', hex: '#EAB308', bg: 'bg-yellow-500' },
  { id: 'indigo', name: 'Deep Indigo', hex: '#312E81', bg: 'bg-indigo-900' },
  { id: 'crimson', name: 'Khasi Crimson', hex: '#991B1B', bg: 'bg-red-800' },
  { id: 'ivory', name: 'Natural Ivory', hex: '#F5F5F4', bg: 'bg-stone-100' },
];

export function KhasiLoom() {
  const navigate = useNavigate();
  const { currentUser: user } = useApp();

  const [gridSize, setGridSize] = useState(3);
  const [targetPattern, setTargetPattern] = useState([]);
  const [userPattern, setUserPattern] = useState([]);
  const [selectedColor, setSelectedColor] = useState(KHASI_COLORS[0]);
  const [phase, setPhase] = useState('memorize'); // 'memorize' | 'weaving' | 'completed'
  const [timerLeft, setTimerLeft] = useState(8);
  const [attempts, setAttempts] = useState(0);
  const [startTime, setStartTime] = useState(Date.now());
  const [accuracy, setAccuracy] = useState(100);

  // Generate a random jainsem weaving pattern
  const generatePattern = (size) => {
    const totalCells = size * size;
    const newPattern = [];
    for (let i = 0; i < totalCells; i++) {
      const colorIndex = Math.floor(Math.random() * (size === 2 ? 2 : 3));
      newPattern.push(KHASI_COLORS[colorIndex]);
    }
    setTargetPattern(newPattern);
    setUserPattern(Array(totalCells).fill(KHASI_COLORS[3])); // Default ivory
  };

  const startNewGame = () => {
    setPhase('memorize');
    setTimerLeft(8);
    setAttempts(0);
    setStartTime(Date.now());
    generatePattern(gridSize);
    speakText('Study the Khasi Jainsem weaving pattern on the loom. You have 8 seconds before it is covered.');
  };

  useEffect(() => {
    startNewGame();
  }, [gridSize]);

  useEffect(() => {
    let interval;
    if (phase === 'memorize' && timerLeft > 0) {
      interval = setInterval(() => {
        setTimerLeft((prev) => prev - 1);
      }, 1000);
    } else if (phase === 'memorize' && timerLeft === 0) {
      setPhase('weaving');
      speakText('The pattern is covered! Now tap the cells to recreate the woven pattern from memory.');
    }
    return () => clearInterval(interval);
  }, [phase, timerLeft]);

  const handleCellClick = (index) => {
    if (phase !== 'weaving') return;

    const updated = [...userPattern];
    updated[index] = selectedColor;
    setUserPattern(updated);
  };

  const handleCheckWeave = () => {
    let correct = 0;
    targetPattern.forEach((color, idx) => {
      if (color.id === userPattern[idx].id) correct++;
    });

    const calculatedAccuracy = Math.round((correct / targetPattern.length) * 100);
    setAccuracy(calculatedAccuracy);
    setPhase('completed');
    setAttempts((prev) => prev + 1);

    const timeTaken = Math.round((Date.now() - startTime) / 1000);
    recordAndSync(user?.uid, 'khasi-loom', {
      attempts: attempts + 1,
      timeTakenSeconds: timeTaken,
      accuracy: calculatedAccuracy,
      difficulty: gridSize === 2 ? 'easier' : 'standard',
    });

    if (calculatedAccuracy >= 80) {
      speakText(`Wonderful! You achieved ${calculatedAccuracy} percent accuracy on your Jainsem weave!`);
    } else {
      speakText(`Good try! You achieved ${calculatedAccuracy} percent accuracy. Gentle practice makes progress.`);
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
            Meghalaya Khasi Weave 🧵
          </span>
          <button
            onClick={() => speakText('Khasi Jainsem Loom Game. Recreate traditional weaving patterns from memory.')}
            className="p-2 bg-amber-600 text-white rounded-full hover:bg-amber-700 transition"
            title="Read instructions aloud"
          >
            <Volume2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Game Container */}
      <div className="bg-white rounded-2xl p-6 shadow-md border-2 border-amber-900/10">
        <div className="text-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-[#4A3728] flex items-center justify-center gap-2">
            🧵 Khasi Jainsem Pattern Loom
          </h1>
          <p className="text-stone-600 text-sm mt-1">
            {phase === 'memorize' && `Study the woven pattern carefully (${timerLeft}s remaining)`}
            {phase === 'weaving' && 'Select a thread color below, then tap the grid to recreate the pattern.'}
            {phase === 'completed' && `Weaving Complete! Accuracy: ${accuracy}%`}
          </p>
        </div>

        {/* Phase Banners */}
        {phase === 'memorize' && (
          <div className="bg-amber-50 border border-amber-200 text-amber-900 p-4 rounded-xl mb-6 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Eye className="w-6 h-6 text-amber-700 animate-pulse" />
              <span className="font-semibold text-lg">Memorize Pattern: {timerLeft}s</span>
            </div>
            <button
              onClick={() => {
                setTimerLeft(0);
                setPhase('weaving');
              }}
              className="bg-amber-700 text-white text-sm px-4 py-2 rounded-lg font-medium hover:bg-amber-800"
            >
              Start Weaving Now
            </button>
          </div>
        )}

        {/* Loom Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Target Pattern (Top / Reference Loom) */}
          <div className="bg-[#FAF6EE] p-5 rounded-2xl border-4 border-[#5C3A21] shadow-inner relative">
            <h3 className="text-center font-bold text-[#4A3728] mb-3 flex items-center justify-center gap-2">
              <span>Traditional Loom Pattern</span>
            </h3>

            {phase === 'weaving' ? (
              <div className="h-64 bg-[#3E2723] rounded-xl flex flex-col items-center justify-center text-amber-100 p-6 text-center shadow-lg">
                <div className="w-16 h-16 rounded-full bg-amber-800/60 flex items-center justify-center mb-3">
                  🧵
                </div>
                <p className="text-lg font-bold">Loom Covered with Woven Cloth</p>
                <p className="text-xs text-amber-200/80 mt-2">Recreate what you remembered on the grid on the right.</p>
              </div>
            ) : (
              <div
                className="grid gap-2 p-2 bg-[#4E342E] rounded-xl shadow-md"
                style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}
              >
                {targetPattern.map((color, idx) => (
                  <div
                    key={idx}
                    className={`h-16 md:h-20 rounded-lg shadow-md border-2 border-stone-800 flex items-center justify-center transition-all ${color.bg}`}
                  >
                    <span className="text-xs font-bold opacity-30 text-white">{idx + 1}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* User Working Loom */}
          <div className="bg-[#FDFBF7] p-5 rounded-2xl border-4 border-amber-800/30 shadow-sm">
            <h3 className="text-center font-bold text-[#4A3728] mb-3">Your Recreated Jainsem Weave</h3>

            <div
              className="grid gap-2 p-2 bg-[#3E2723] rounded-xl shadow-md"
              style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}
            >
              {userPattern.map((color, idx) => (
                <button
                  key={idx}
                  onClick={() => handleCellClick(idx)}
                  disabled={phase !== 'weaving'}
                  className={`h-16 md:h-20 rounded-lg shadow-md border-2 border-stone-700 flex items-center justify-center transition-all transform active:scale-95 ${color.bg} ${
                    phase === 'weaving' ? 'hover:ring-4 ring-amber-400 cursor-pointer' : ''
                  }`}
                >
                  <span className="text-xs font-bold opacity-40 text-stone-700">{color.name[0]}</span>
                </button>
              ))}
            </div>

            {/* Thread Palette (Color Picker) */}
            {phase === 'weaving' && (
              <div className="mt-5">
                <p className="text-xs font-bold text-stone-600 mb-2 uppercase text-center">Select Thread Color:</p>
                <div className="flex justify-center space-x-3">
                  {KHASI_COLORS.map((color) => (
                    <button
                      key={color.id}
                      onClick={() => setSelectedColor(color)}
                      className={`flex flex-col items-center p-2 rounded-xl border-2 transition ${
                        selectedColor.id === color.id
                          ? 'border-amber-700 bg-amber-100 shadow-md ring-2 ring-amber-500'
                          : 'border-stone-200 bg-white hover:bg-stone-50'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full ${color.bg} shadow-inner border border-stone-300`} />
                      <span className="text-[10px] font-medium mt-1 text-stone-700">{color.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-stone-200">
          <div className="flex items-center space-x-3">
            <span className="text-xs font-bold text-stone-500">Loom Grid Size:</span>
            <button
              onClick={() => setGridSize(2)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                gridSize === 2 ? 'bg-amber-700 text-white' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              2x2 (Easier)
            </button>
            <button
              onClick={() => setGridSize(3)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                gridSize === 3 ? 'bg-amber-700 text-white' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              3x3 (Standard)
            </button>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={startNewGame}
              className="flex items-center space-x-2 bg-stone-100 text-stone-700 px-4 py-2.5 rounded-xl font-bold hover:bg-stone-200 transition"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reset Loom</span>
            </button>

            {phase === 'weaving' && (
              <button
                onClick={handleCheckWeave}
                className="flex items-center space-x-2 bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-emerald-800 shadow-md transition"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>Check Weave</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
