import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff, CheckCircle2, Volume2, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { recordAndSync, speakText } from '../services/gameStorage';
import { useApp } from '../context/AppContext';

const RECALL_ITEMS = [
  {
    id: 1,
    title: 'Majuli Island Boat Ride',
    region: 'Assam',
    imageEmoji: '⛵',
    desc: 'A serene wooden boat glides across the Brahmaputra River in Majuli.',
    question: 'What type of transport was floating in the water?',
    options: ['Wooden Boat ⛵', 'Red Bus 🚌', 'Aeroplane ✈️'],
    correct: 'Wooden Boat ⛵'
  },
  {
    id: 2,
    title: 'Manipuri Innaphi Shawl',
    region: 'Manipur',
    imageEmoji: '🧣',
    desc: 'Grandma’s beautiful handcrafted pink & golden embroidery shawl.',
    question: 'What color was the beautiful traditional shawl?',
    options: ['Pink & Golden 🌸', 'Deep Black ⬛', 'Bright Yellow 🟨'],
    correct: 'Pink & Golden 🌸'
  }
];

export const PhotoRecall = () => {
  const navigate = useNavigate();
  const { currentUser } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [stage, setStage] = useState('observe'); // 'observe' | 'question' | 'feedback'
  const [selectedOption, setSelectedOption] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [startTime, setStartTime] = useState(null);

  const currentItem = RECALL_ITEMS[currentIndex];

  useEffect(() => {
    setStage('observe');
    setStartTime(Date.now());
    speakText(`Observe this picture carefully: ${currentItem.title}`);
  }, [currentIndex]);

  const handleDoneObserving = () => {
    setStage('question');
    speakText(currentItem.question);
  };

  const handleAnswerSelect = (option) => {
    setSelectedOption(option);
    const isCorrect = option === currentItem.correct;
    const duration = Math.round((Date.now() - startTime) / 1000);

    if (isCorrect) {
      setFeedback("Wonderful! You recalled it perfectly! 🌸");
      confetti({ particleCount: 50 });
      speakText("Wonderful! You recalled it perfectly!");
    } else {
      // Gentle dementia feedback rule: "Good try, let's look again"
      setFeedback("Good try! Let's look again together at the picture.");
      speakText("Good try! Let's look again together.");
    }

    recordAndSync(currentUser?.uid, 'photo-recall', {
      attempts: 1,
      timeTakenSeconds: duration,
      accuracy: isCorrect ? 100 : 50
    });

    setStage('feedback');
  };

  return (
    <div className="pb-24 pt-4 px-4 max-w-md mx-auto space-y-5">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/home')}
          className="touch-target bg-white border-2 border-[#857464] text-[#1B1C19] rounded-2xl px-4 py-2 font-bold flex items-center gap-2 shadow-xs"
        >
          <ArrowLeft className="w-6 h-6" /> Back
        </button>
        <h2 className="text-2xl font-bold text-[#1B1C19]">Photo Recall</h2>
        <button
          onClick={() => speakText(currentItem.desc)}
          className="touch-target bg-[#FFDCBB] border-2 border-[#BA7517] text-[#855000] rounded-2xl p-3 font-bold shadow-xs"
        >
          <Volume2 className="w-6 h-6" />
        </button>
      </div>

      {/* Stage 1: Observe Image */}
      {stage === 'observe' && (
        <div className="bg-white border-3 border-[#BA7517] rounded-3xl p-5 space-y-4 text-center shadow-lg">
          <div className="inline-flex items-center gap-1 bg-[#FFDCBB] px-3 py-1 rounded-full text-xs font-bold text-[#855000]">
            <Sparkles className="w-4 h-4 text-[#BA7517]" /> Regional Memory: {currentItem.region}
          </div>
          
          <div className="w-full h-48 bg-[#FBF9F4] rounded-2xl border-2 border-[#E4E2DD] flex flex-col items-center justify-center p-4">
            <span className="text-7xl mb-2">{currentItem.imageEmoji}</span>
            <h3 className="text-xl font-bold text-[#1B1C19]">{currentItem.title}</h3>
          </div>

          <p className="text-lg text-[#524436] font-medium leading-snug">
            {currentItem.desc}
          </p>

          <button
            onClick={handleDoneObserving}
            className="w-full touch-target bg-[#BA7517] hover:bg-[#855000] text-white font-bold text-2xl py-4 rounded-2xl border-2 border-[#673D00] shadow-md flex items-center justify-center gap-2"
          >
            <EyeOff className="w-7 h-7" /> Ready for Question
          </button>
        </div>
      )}

      {/* Stage 2 & 3: Question & Gentle Feedback */}
      {stage !== 'observe' && (
        <div className="bg-white border-3 border-[#BA7517] rounded-3xl p-5 space-y-5 shadow-lg">
          <h3 className="text-2xl font-bold text-[#1B1C19] leading-snug text-center">
            {currentItem.question}
          </h3>

          <div className="space-y-3">
            {currentItem.options.map((option, idx) => (
              <button
                key={idx}
                disabled={stage === 'feedback'}
                onClick={() => handleAnswerSelect(option)}
                className={`w-full touch-target p-4 rounded-2xl font-bold text-xl text-left border-2 transition ${
                  selectedOption === option
                    ? option === currentItem.correct
                      ? 'bg-[#B5F086] border-[#386A0E] text-[#265100]'
                      : 'bg-[#FFDBD0] border-[#9C3E1F] text-[#802A0B]'
                    : 'bg-[#F9F7F2] border-[#857464] text-[#1B1C19] hover:bg-[#FFDCBB]'
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          {stage === 'feedback' && (
            <div className="space-y-4 text-center pt-2">
              <div className="p-4 rounded-2xl bg-[#FFF8F0] border-2 border-[#BA7517] font-bold text-lg text-[#855000]">
                {feedback}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStage('observe')}
                  className="flex-1 touch-target bg-[#F0EEE9] text-[#1B1C19] font-bold text-lg py-3 rounded-2xl border-2 border-[#857464]"
                >
                  View Picture Again
                </button>
                <button
                  onClick={() => setCurrentIndex((prev) => (prev + 1) % RECALL_ITEMS.length)}
                  className="flex-1 touch-target bg-[#386A0E] text-white font-bold text-lg py-3 rounded-2xl border-2 border-[#0C2000]"
                >
                  Next Memory
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
