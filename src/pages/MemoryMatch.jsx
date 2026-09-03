import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, RefreshCw, Trophy, Volume2, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { recordAndSync, getNextDifficulty, speakText } from '../services/gameStorage';
import { useApp } from '../context/AppContext';

export const MemoryMatch = () => {
  const navigate = useNavigate();
  const { currentUser, currentTheme, userState } = useApp();
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [attempts, setAttempts] = useState(0);
  const [isWon, setIsWon] = useState(false);
  const [difficulty, setDifficulty] = useState('standard');
  const [startTime, setStartTime] = useState(null);

  // Initialize deck based on active North East state regional theme
  const initGame = () => {
    const activeDifficulty = getNextDifficulty('memory-match');
    setDifficulty(activeDifficulty);

    const baseItems = currentTheme.gameItems || [
      { id: '1', name: 'Jaapi', symbol: '👒', prompt: 'Traditional Bamboo Jaapi' },
      { id: '2', name: 'Rhino', symbol: '🦏', prompt: 'One-horned Rhino' },
      { id: '3', name: 'Tea Leaf', symbol: '🍃', prompt: 'Fresh Tea Leaves' },
      { id: '4', name: 'Dhol', symbol: '🥁', prompt: 'Cultural Drum' }
    ];

    // For standard/easier, use 4 items (8 cards total - 2x4 grid).
    const deck = [...baseItems, ...baseItems]
      .sort(() => Math.random() - 0.5)
      .map((item, index) => ({ ...item, uniqueId: index }));

    setCards(deck);
    setFlipped([]);
    setMatched([]);
    setAttempts(0);
    setIsWon(false);
    setStartTime(Date.now());

    speakText(`Welcome to ${userState} Memory Match. Find the matching pairs at your own comfortable pace.`);
  };

  useEffect(() => {
    initGame();
  }, [userState]);

  const handleCardClick = (index) => {
    if (flipped.length === 2 || flipped.includes(index) || matched.includes(cards[index].uniqueId)) {
      return;
    }

    // Voice hint on flip
    const clickedCard = cards[index];
    speakText(clickedCard.name);

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      const firstCard = cards[newFlipped[0]];
      const secondCard = cards[newFlipped[1]];
      const finalAttempts = attempts + 1;
      setAttempts(finalAttempts);

      if (firstCard.id === secondCard.id) {
        // Match found!
        const newMatched = [...matched, firstCard.uniqueId, secondCard.uniqueId];
        setMatched(newMatched);
        setFlipped([]);

        speakText(`Wonderful! You matched the ${firstCard.name}!`);

        // Check Win
        if (newMatched.length === cards.length) {
          handleWin(finalAttempts, newMatched.length / 2);
        }
      } else {
        // No match - gentle flip back after delay
        setTimeout(() => {
          setFlipped([]);
        }, 1200);
      }
    }
  };

  const handleWin = (finalAttempts, matchedCount) => {
    setIsWon(true);
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    speakText("Great job! You have matched all the regional cards!");

    const duration = Math.round((Date.now() - startTime) / 1000);
    const accuracy = Math.max(40, Math.round((matchedCount / finalAttempts) * 100));

    recordAndSync(currentUser?.uid, 'memory-match', {
      attempts: finalAttempts,
      timeTakenSeconds: duration,
      accuracy: accuracy,
      difficulty: difficulty,
      state: userState
    });
  };

  return (
    <div className="min-h-screen bg-[#F9F7F2] pb-24 pt-4 px-4 max-w-md mx-auto space-y-5">
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b-2 border-[#E4E2DD] pb-3">
        <button
          onClick={() => navigate('/home')}
          className="touch-target bg-white border-2 rounded-2xl p-2 text-[#1B1C19] flex items-center gap-1 font-bold shadow-sm"
          style={{ borderColor: currentTheme.primary }}
        >
          <ArrowLeft className="w-6 h-6" /> Back
        </button>

        <div className="text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-[#855000]">
            📍 {userState} Theme
          </span>
          <h2 className="text-xl font-bold text-[#1B1C19]">Memory Match</h2>
        </div>

        <button
          onClick={initGame}
          className="touch-target bg-white border-2 border-[#857464] rounded-2xl p-2 text-[#1B1C19] font-bold shadow-sm"
          aria-label="Restart Game"
        >
          <RefreshCw className="w-6 h-6" />
        </button>
      </div>

      {/* Voice Assistant Hint */}
      <div 
        className="border-2 rounded-2xl p-4 flex items-center justify-between shadow-sm"
        style={{ backgroundColor: `${currentTheme.primary}15`, borderColor: currentTheme.primary }}
      >
        <div className="space-y-1">
          <p className="text-sm font-bold text-[#1B1C19]">Tap any card to turn it over</p>
          <p className="text-xs font-medium text-[#524436]">Take your time • Gentle memory practice</p>
        </div>
        <button 
          onClick={() => speakText(`Match the pairs of ${currentTheme.name} cultural items`)}
          className="p-3 text-white rounded-xl touch-target shadow"
          style={{ backgroundColor: currentTheme.primary }}
        >
          <Volume2 className="w-6 h-6" />
        </button>
      </div>

      {/* 2x4 Game Card Grid */}
      <div className="grid grid-cols-2 gap-4 pt-2">
        {cards.map((card, index) => {
          const isFlipped = flipped.includes(index) || matched.includes(card.uniqueId);
          const isMatchedCard = matched.includes(card.uniqueId);

          return (
            <button
              key={index}
              onClick={() => handleCardClick(index)}
              className={`touch-target h-36 rounded-3xl border-3 font-bold text-lg flex flex-col items-center justify-center p-3 transition-all duration-300 transform active:scale-95 shadow-md ${
                isFlipped
                  ? isMatchedCard
                    ? 'bg-[#B5F086] border-[#386A0E] text-[#1B1C19]'
                    : 'bg-white text-[#1B1C19]'
                  : 'text-white'
              }`}
              style={{
                backgroundColor: !isFlipped ? currentTheme.primary : undefined,
                borderColor: !isFlipped ? (currentTheme.secondary || '#673D00') : undefined
              }}
            >
              {isFlipped ? (
                <div className="text-center space-y-1 animate-fade-in">
                  <span className="text-4xl">{card.symbol}</span>
                  <p className="text-xs font-bold text-[#1B1C19] line-clamp-1">{card.name}</p>
                </div>
              ) : (
                <div className="flex flex-col items-center space-y-1 opacity-80">
                  <span className="text-3xl">🌺</span>
                  <span className="text-xs font-bold tracking-wider">TAP</span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Completion Modal */}
      {isWon && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white border-4 border-[#386A0E] rounded-3xl p-6 text-center max-w-sm w-full space-y-5 shadow-2xl animate-bounce-short">
            <div className="w-20 h-20 bg-[#B5F086] border-2 border-[#386A0E] rounded-full flex items-center justify-center mx-auto text-4xl shadow">
              🏆
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-[#1B1C19]">Wonderful Job!</h3>
              <p className="text-base text-[#524436] font-semibold">
                You matched all {userState} cards gracefully!
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={initGame}
                className="flex-1 touch-target bg-[#386A0E] text-white font-bold py-3 rounded-2xl text-lg shadow-md border-2 border-[#0C2000]"
              >
                Play Again
              </button>
              <button
                onClick={() => navigate('/home')}
                className="flex-1 touch-target bg-[#FFDCBB] text-[#855000] font-bold py-3 rounded-2xl text-lg shadow-md border-2 border-[#BA7517]"
              >
                Go Home
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
