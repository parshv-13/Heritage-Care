import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, ArrowUp, ArrowDown, RefreshCw, Volume2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { recordAndSync, speakText } from '../services/gameStorage';
import { useApp } from '../context/AppContext';

const INITIAL_ROUTINE_CARDS = [
  { id: '1', step: '1', text: 'Wake up & Smile', icon: '🌅', hint: 'First step in the morning' },
  { id: '2', step: '2', text: 'Brush Teeth & Wash Face', icon: '🪥', hint: 'Fresh start for hygiene' },
  { id: '3', step: '3', text: 'Sip Warm Assam Tea', icon: '☕', hint: 'Warm tea for energy' },
  { id: '4', step: '4', text: 'Take Morning Medicine', icon: '💊', hint: 'Keep heart healthy' }
];

export const DailyRoutine = () => {
  const navigate = useNavigate();
  const { currentUser, currentTheme, userState } = useApp();
  const [cards, setCards] = useState([]);
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [startTime, setStartTime] = useState(null);

  const startNewGame = () => {
    // Adapt drink step to region
    const regionalDrink = userState === 'Assam' ? 'Sip Warm Assam Tea ☕' :
                          userState === 'Manipur' ? 'Sip Manipuri Green Tea 🍵' :
                          userState === 'Meghalaya' ? 'Sip Warm Herbal Water 🍵' :
                          userState === 'Nagaland' ? 'Sip Fresh Warm Tea ☕' :
                          userState === 'Tripura' ? 'Sip Spiced Warm Tea 🍵' :
                          userState === 'Mizoram' ? 'Sip Mizo Herbal Tea 🍵' : 'Sip Warm Herbal Tea 🍵';

    const adaptedCards = INITIAL_ROUTINE_CARDS.map(c => 
      c.id === '3' ? { ...c, text: regionalDrink } : c
    );

    const shuffled = [...adaptedCards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setAttempts(0);
    setFeedback(null);
    setIsCompleted(false);
    setStartTime(Date.now());
  };

  useEffect(() => {
    startNewGame();
    speakText("Welcome to Sequence It. Arrange your morning daily routine steps in the correct order.");
  }, []);

  const moveCard = (index, direction) => {
    const newCards = [...cards];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= cards.length) return;

    // Swap items
    const temp = newCards[index];
    newCards[index] = newCards[targetIndex];
    newCards[targetIndex] = temp;

    setCards(newCards);
    speakText(`Moved ${temp.text}`);
  };

  const checkSequence = () => {
    setAttempts(prev => prev + 1);

    const isCorrect = cards.every((card, idx) => card.step === String(idx + 1));

    if (isCorrect) {
      setIsCompleted(true);
      setFeedback({ type: 'success', text: "Wonderful! Perfect order for your morning routine!" });
      
      const duration = Math.round((Date.now() - startTime) / 1000);
      recordAndSync(currentUser?.uid, 'daily-routine', {
        attempts: attempts + 1,
        timeTakenSeconds: duration,
        accuracy: 100
      });

      confetti({ particleCount: 70, spread: 60 });
      speakText("Wonderful! You arranged your daily routine in perfect order!");
    } else {
      // Gentle elderly-focused error feedback (no harsh failure messages)
      setFeedback({ 
        type: 'gentle', 
        text: "Good try! Let's take a look again at what comes first after waking up." 
      });
      speakText("Good try! Let's take a look again together.");
    }
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
        <h2 className="text-2xl font-bold text-[#1B1C19]">Sequence It</h2>
        <button
          onClick={startNewGame}
          className="touch-target bg-[#FFDCBB] border-2 border-[#BA7517] text-[#855000] rounded-2xl p-3 font-bold shadow-xs"
        >
          <RefreshCw className="w-6 h-6" />
        </button>
      </div>

      {/* Dementia Friendly Instruction Banner */}
      <div 
        className="border-2 rounded-2xl p-4 flex items-center justify-between shadow-xs"
        style={{ backgroundColor: `${currentTheme.primary}15`, borderColor: currentTheme.primary }}
      >
        <div>
          <h3 className="text-xl font-bold" style={{ color: currentTheme.primary }}>Order Your Morning Routine</h3>
          <p className="text-base text-[#524436] font-medium mt-1">
            Use the up and down arrows to place steps from 1 to 4.
          </p>
        </div>
        <button 
          onClick={() => speakText("Use the up and down buttons to place your daily morning steps in correct order.")}
          className="p-3 text-white rounded-2xl touch-target"
          style={{ backgroundColor: currentTheme.primary }}
        >
          <Volume2 className="w-6 h-6" />
        </button>
      </div>

      {/* Routine Cards List */}
      <div className="space-y-3">
        {cards.map((card, index) => (
          <div
            key={card.id}
            className={`bg-white border-3 rounded-2xl p-4 flex items-center justify-between shadow-md transition ${
              isCompleted ? 'border-[#386A0E] bg-[#B5F086]/20' : 'border-[#BA7517]'
            }`}
          >
            <div className="flex items-center space-x-3">
              <span className="w-10 h-10 rounded-full bg-[#FFDCBB] border-2 border-[#BA7517] text-[#855000] font-bold text-xl flex items-center justify-center">
                {index + 1}
              </span>
              <span className="text-3xl">{card.icon}</span>
              <div>
                <p className="text-xl font-bold text-[#1B1C19]">{card.text}</p>
                <p className="text-xs text-[#855000] font-semibold">{card.hint}</p>
              </div>
            </div>

            {/* Re-ordering Arrow Buttons (Dementia-accessible large tap zones) */}
            {!isCompleted && (
              <div className="flex flex-col gap-1">
                <button
                  disabled={index === 0}
                  onClick={() => moveCard(index, 'up')}
                  className={`touch-target p-2 rounded-xl border ${
                    index === 0 ? 'bg-gray-100 text-gray-300 border-gray-200' : 'bg-[#F0EEE9] text-[#1B1C19] border-[#857464] hover:bg-[#BA7517] hover:text-white'
                  }`}
                  aria-label="Move step up"
                >
                  <ArrowUp className="w-6 h-6" />
                </button>
                <button
                  disabled={index === cards.length - 1}
                  onClick={() => moveCard(index, 'down')}
                  className={`touch-target p-2 rounded-xl border ${
                    index === cards.length - 1 ? 'bg-gray-100 text-gray-300 border-gray-200' : 'bg-[#F0EEE9] text-[#1B1C19] border-[#857464] hover:bg-[#BA7517] hover:text-white'
                  }`}
                  aria-label="Move step down"
                >
                  <ArrowDown className="w-6 h-6" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Gentle Feedback Banner */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl border-2 font-bold text-lg text-center ${
            feedback.type === 'success'
              ? 'bg-[#B5F086] border-[#386A0E] text-[#265100]'
              : 'bg-[#FFDBD0] border-[#9C3E1F] text-[#802A0B]'
          }`}
        >
          {feedback.text}
        </div>
      )}

      {/* Action Button */}
      {!isCompleted ? (
        <button
          onClick={checkSequence}
          className="w-full touch-target bg-[#386A0E] hover:bg-[#265100] text-white font-bold text-2xl py-4 rounded-2xl border-2 border-[#0C2000] shadow-lg flex items-center justify-center gap-3 transition"
        >
          <CheckCircle2 className="w-8 h-8" /> Check My Sequence
        </button>
      ) : (
        <button
          onClick={() => navigate('/home')}
          className="w-full touch-target bg-[#BA7517] text-white font-bold text-2xl py-4 rounded-2xl border-2 border-[#673D00] shadow-lg"
        >
          Return Home
        </button>
      )}
    </div>
  );
};
