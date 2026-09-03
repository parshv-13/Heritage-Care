import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, RefreshCw, Volume2, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { recordAndSync, speakText } from '../services/gameStorage';
import { useApp } from '../context/AppContext';

const JIGSAW_PIECES = [
  { id: 1, label: 'Piece A (Top Left)', color: 'bg-[#FFDCBB]', symbol: '🌸', border: 'border-r-4 border-b-4 border-[#BA7517]' },
  { id: 2, label: 'Piece B (Top Right)', color: 'bg-[#B5F086]', symbol: '🦏', border: 'border-l-4 border-b-4 border-[#386A0E]' },
  { id: 3, label: 'Piece C (Bottom Left)', color: 'bg-[#FFDBD0]', symbol: '🌿', border: 'border-r-4 border-t-4 border-[#9C3E1F]' },
  { id: 4, label: 'Piece D (Bottom Right)', color: 'bg-[#EAE8E3]', symbol: '☕', border: 'border-l-4 border-t-4 border-[#857464]' }
];

export const Jigsaw = () => {
  const navigate = useNavigate();
  const { currentUser } = useApp();
  const [placed, setPlaced] = useState({ 1: false, 2: false, 3: false, 4: false });
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [isWon, setIsWon] = useState(false);

  const handlePieceSelect = (pieceId) => {
    setSelectedPiece(pieceId);
    speakText(`Selected piece ${pieceId}. Tap the matching target slot.`);
  };

  const handleSlotClick = (slotId) => {
    if (!selectedPiece) return;

    if (selectedPiece === slotId) {
      const updated = { ...placed, [slotId]: true };
      setPlaced(updated);
      setSelectedPiece(null);
      speakText(`Great! Piece ${slotId} snapped into place!`);

      if (Object.values(updated).every(Boolean)) {
        setIsWon(true);
        confetti({ particleCount: 70 });
        speakText("Congratulations! You completed the Heritage Jigsaw puzzle!");
        recordAndSync(currentUser?.uid, 'jigsaw', { attempts: 4, timeTakenSeconds: 30, accuracy: 100 });
      }
    } else {
      speakText("Try another spot! That piece belongs elsewhere.");
    }
  };

  const resetPuzzle = () => {
    setPlaced({ 1: false, 2: false, 3: false, 4: false });
    setSelectedPiece(null);
    setIsWon(false);
  };

  return (
    <div className="pb-24 pt-4 px-4 max-w-md mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/home')}
          className="touch-target bg-white border-2 border-[#857464] text-[#1B1C19] rounded-2xl px-4 py-2 font-bold flex items-center gap-2 shadow-xs"
        >
          <ArrowLeft className="w-6 h-6" /> Back
        </button>
        <h2 className="text-2xl font-bold text-[#1B1C19]">Heritage Jigsaw</h2>
        <button
          onClick={resetPuzzle}
          className="touch-target bg-[#FFDCBB] border-2 border-[#BA7517] text-[#855000] rounded-2xl p-3 font-bold shadow-xs"
        >
          <RefreshCw className="w-6 h-6" />
        </button>
      </div>

      <div className="bg-[#FFF8F0] border-2 border-[#BA7517] rounded-2xl p-4 flex items-center justify-between">
        <p className="text-lg font-bold text-[#855000]">
          Tap a piece below, then tap its matching place in the grid!
        </p>
      </div>

      {/* Target Jigsaw Frame (2x2 Grid) */}
      <div className="bg-white border-4 border-[#BA7517] rounded-3xl p-4 shadow-lg">
        <h3 className="text-center font-bold text-lg text-[#1B1C19] mb-3">North-East Heritage Board</h3>
        <div className="grid grid-cols-2 gap-2 h-64 border-2 border-dashed border-[#857464] p-2 rounded-2xl bg-[#FBF9F4]">
          {[1, 2, 3, 4].map((slotId) => {
            const piece = JIGSAW_PIECES.find(p => p.id === slotId);
            const isSnap = placed[slotId];

            return (
              <button
                key={slotId}
                onClick={() => handleSlotClick(slotId)}
                className={`touch-target rounded-xl flex items-center justify-center font-bold text-xl border-2 transition ${
                  isSnap
                    ? `${piece.color} ${piece.border} border-solid text-[#1B1C19]`
                    : selectedPiece === slotId
                    ? 'border-4 border-[#BA7517] bg-[#FFDCBB]/40 animate-pulse'
                    : 'border-dashed border-[#857464] bg-white hover:bg-[#F0EEE9]'
                }`}
              >
                {isSnap ? (
                  <div className="flex flex-col items-center">
                    <span className="text-4xl">{piece.symbol}</span>
                    <span className="text-xs font-bold mt-1">Placed</span>
                  </div>
                ) : (
                  <span className="text-base text-[#857464]">Slot {slotId}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tray of Available Pieces */}
      {!isWon && (
        <div className="bg-[#F0EEE9] border-2 border-[#857464] rounded-2xl p-4 space-y-2">
          <p className="font-bold text-[#1B1C19] text-base">Select Puzzle Pieces:</p>
          <div className="grid grid-cols-2 gap-3">
            {JIGSAW_PIECES.map((piece) => {
              if (placed[piece.id]) return null;
              const isSelected = selectedPiece === piece.id;

              return (
                <button
                  key={piece.id}
                  onClick={() => handlePieceSelect(piece.id)}
                  className={`touch-target p-3 rounded-2xl border-3 font-bold text-lg flex items-center justify-center gap-2 shadow-xs transition ${
                    isSelected
                      ? 'bg-[#BA7517] text-white border-[#673D00] scale-105'
                      : 'bg-white text-[#1B1C19] border-[#857464] hover:bg-[#FFDCBB]'
                  }`}
                >
                  <span className="text-2xl">{piece.symbol}</span>
                  <span>Piece {piece.id}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Win Banner */}
      {isWon && (
        <div className="bg-[#B5F086] border-4 border-[#386A0E] rounded-3xl p-6 text-center space-y-4 shadow-xl">
          <h3 className="text-3xl font-bold text-[#265100]">Puzzle Assembled! 🎉</h3>
          <p className="text-lg text-[#3D6F13] font-semibold">
            All 4 pieces fit into place nicely.
          </p>
          <button
            onClick={() => navigate('/home')}
            className="touch-target w-full bg-[#386A0E] text-white font-bold text-xl py-4 rounded-2xl border-2 border-[#0C2000]"
          >
            Return Home
          </button>
        </div>
      )}
    </div>
  );
};
