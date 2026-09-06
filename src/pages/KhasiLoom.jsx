import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { recordAndSync, speakText } from '../services/gameStorage';
import { ArrowLeft, RefreshCw, Volume2, CheckCircle2 } from 'lucide-react';

const KHASI_COLORS = [
  { id: 'gold', name: 'Silk Gold', hex: '#D49B00', bg: 'bg-[#D49B00] text-white' },
  { id: 'indigo', name: 'Deep Indigo', hex: '#0B3C5D', bg: 'bg-[#0B3C5D] text-white' },
  { id: 'crimson', name: 'Khasi Crimson', hex: '#802A0B', bg: 'bg-[#802A0B] text-white' },
  { id: 'ivory', name: 'Natural Ivory', hex: '#F9F9F9', bg: 'bg-[#F9F9F9] text-[#1A1A1A]' },
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

  const generatePattern = (size) => {
    const totalCells = size * size;
    const newPattern = [];
    for (let i = 0; i < totalCells; i++) {
      const colorIndex = Math.floor(Math.random() * (size === 2 ? 2 : 3));
      newPattern.push(KHASI_COLORS[colorIndex]);
    }
    setTargetPattern(newPattern);
    setUserPattern(Array(totalCells).fill(KHASI_COLORS[3]));
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
      speakText('The pattern is covered. Select a thread color and tap cells to recreate the pattern from memory.');
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
      speakText(`Wonderful. You achieved ${calculatedAccuracy} percent accuracy on your Jainsem weave.`);
    } else {
      speakText(`Good try. You achieved ${calculatedAccuracy} percent accuracy.`);
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
            Meghalaya Khasi Weave
          </span>
          <button
            onClick={() => speakText('Khasi Jainsem Loom Game. Recreate traditional weaving patterns from memory.')}
            className="h-16 px-6 bg-[#0B3C5D] hover:bg-[#08283E] text-white font-bold rounded-lg border-2 border-[#0B3C5D] flex items-center gap-2 cursor-pointer"
          >
            <Volume2 className="w-6 h-6" />
            <span>Read Aloud</span>
          </button>
        </div>
      </div>

      {/* Main Game Container */}
      <div className="bg-[#FFFFFF] border-2 border-[#1A1A1A] rounded-lg p-6 space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1A1A1A]">
            Khasi Jainsem Pattern Loom
          </h1>
          <p className="text-base text-[#333333] mt-1">
            {phase === 'memorize' && `Study the pattern carefully: ${timerLeft} seconds remaining.`}
            {phase === 'weaving' && 'Select a thread color below, then tap the grid to recreate the weave.'}
            {phase === 'completed' && `Weaving Complete. Accuracy Score: ${accuracy}%`}
          </p>
        </div>

        {/* Phase Banner */}
        {phase === 'memorize' && (
          <div className="bg-[#F9F9F9] border-2 border-[#1A1A1A] p-4 rounded-lg flex items-center justify-between">
            <span className="font-bold text-lg text-[#1A1A1A]">Memorize Window: {timerLeft}s</span>
            <button
              onClick={() => {
                setTimerLeft(0);
                setPhase('weaving');
              }}
              className="h-16 px-6 bg-[#0B3C5D] hover:bg-[#08283E] text-white font-bold text-base rounded-lg border-2 border-[#0B3C5D] cursor-pointer"
            >
              Start Weaving Now
            </button>
          </div>
        )}

        {/* Loom Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Target Reference Loom */}
          <div className="bg-[#F9F9F9] border-2 border-[#1A1A1A] p-4 rounded-lg space-y-3">
            <h2 className="text-lg font-bold text-[#1A1A1A]">
              Traditional Reference Pattern
            </h2>

            {phase === 'weaving' ? (
              <div className="h-64 bg-[#1A1A1A] text-white rounded-lg flex flex-col items-center justify-center p-6 text-center">
                <p className="text-lg font-bold">Loom Pattern Covered</p>
                <p className="text-sm text-[#CCCCCC] mt-1">Recreate what you remembered on the right grid.</p>
              </div>
            ) : (
              <div
                className="grid gap-2 p-3 bg-[#FFFFFF] border-2 border-[#1A1A1A] rounded-lg"
                style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}
              >
                {targetPattern.map((color, idx) => (
                  <div
                    key={idx}
                    className={`h-20 rounded border-2 border-[#1A1A1A] flex items-center justify-center font-bold text-xs ${color.bg}`}
                  >
                    Cell {idx + 1}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* User Working Loom */}
          <div className="bg-[#FFFFFF] border-2 border-[#1A1A1A] p-4 rounded-lg space-y-4">
            <h2 className="text-lg font-bold text-[#1A1A1A]">
              Your Recreated Weave
            </h2>

            <div
              className="grid gap-2 p-3 bg-[#F9F9F9] border-2 border-[#1A1A1A] rounded-lg"
              style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}
            >
              {userPattern.map((color, idx) => (
                <button
                  key={idx}
                  onClick={() => handleCellClick(idx)}
                  disabled={phase !== 'weaving'}
                  className={`h-20 rounded border-2 border-[#1A1A1A] flex items-center justify-center font-bold text-xs ${color.bg} ${
                    phase === 'weaving' ? 'cursor-pointer' : ''
                  }`}
                >
                  {color.name}
                </button>
              ))}
            </div>

            {/* Thread Palette */}
            {phase === 'weaving' && (
              <div className="space-y-2">
                <p className="text-sm font-bold text-[#1A1A1A]">Choose Active Thread Color:</p>
                <div className="grid grid-cols-2 gap-2">
                  {KHASI_COLORS.map((color) => (
                    <button
                      key={color.id}
                      onClick={() => setSelectedColor(color)}
                      className={`h-16 px-4 rounded-lg border-2 font-bold text-sm flex items-center gap-3 cursor-pointer ${
                        selectedColor.id === color.id
                          ? 'border-[#1A1A1A] bg-[#0B3C5D] text-white'
                          : 'border-[#CCCCCC] bg-[#FFFFFF] text-[#1A1A1A] hover:bg-[#F9F9F9]'
                      }`}
                    >
                      <span
                        className="w-6 h-6 rounded border border-[#1A1A1A] shrink-0"
                        style={{ backgroundColor: color.hex }}
                      />
                      <span>{color.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Grid size and Check Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t-2 border-[#1A1A1A]">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-[#1A1A1A]">Grid Size:</span>
            <button
              onClick={() => setGridSize(2)}
              className={`h-16 px-6 rounded-lg font-bold text-base border-2 cursor-pointer ${
                gridSize === 2
                  ? 'bg-[#0B3C5D] text-white border-[#0B3C5D]'
                  : 'bg-[#FFFFFF] text-[#1A1A1A] border-[#1A1A1A] hover:bg-[#F9F9F9]'
              }`}
            >
              2x2 (4 Cells)
            </button>
            <button
              onClick={() => setGridSize(3)}
              className={`h-16 px-6 rounded-lg font-bold text-base border-2 cursor-pointer ${
                gridSize === 3
                  ? 'bg-[#0B3C5D] text-white border-[#0B3C5D]'
                  : 'bg-[#FFFFFF] text-[#1A1A1A] border-[#1A1A1A] hover:bg-[#F9F9F9]'
              }`}
            >
              3x3 (9 Cells)
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={startNewGame}
              className="h-16 px-6 bg-[#FFFFFF] hover:bg-[#F9F9F9] text-[#1A1A1A] font-bold text-base rounded-lg border-2 border-[#1A1A1A] flex items-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-5 h-5" />
              <span>Reset Loom</span>
            </button>

            {phase === 'weaving' && (
              <button
                onClick={handleCheckWeave}
                className="h-16 px-8 bg-[#1D6F42] hover:bg-[#155431] text-white font-bold text-lg rounded-lg border-2 border-[#1D6F42] flex items-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-6 h-6" />
                <span>Check My Weave</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
