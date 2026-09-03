import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { recordAndSync, speakText } from '../services/gameStorage';
import { ArrowLeft, RefreshCw, Volume2, Eye, Sparkles, CheckCircle } from 'lucide-react';

const KAZIRANGA_ANIMALS = [
  { id: 'rhino', name: 'One-Horned Rhino', icon: '🦏', details: 'Standing near elephant grass' },
  { id: 'buffalo', name: 'Wild Water Buffalo', icon: '🐂', details: 'Bathing near water body' },
  { id: 'deer', name: 'Swamp Deer', icon: '🦌', details: 'Grazing in open meadow' },
  { id: 'hornbill', name: 'Great Indian Hornbill', icon: '🦅', details: 'Perched on tall tree' },
];

export function KazirangaRecall() {
  const navigate = useNavigate();
  const { currentUser: user } = useApp();

  const [phase, setPhase] = useState('observe'); // 'observe' | 'spot_change' | 'delayed_recall' | 'completed'
  const [removedAnimal, setRemovedAnimal] = useState(null);
  const [selectedRecall, setSelectedRecall] = useState(null);
  const [feedback, setFeedback] = useState('Study the Kaziranga grassland animals carefully!');

  const handleStartSpotChange = () => {
    // Randomly hide one animal
    const randIdx = Math.floor(Math.random() * KAZIRANGA_ANIMALS.length);
    const hidden = KAZIRANGA_ANIMALS[randIdx];
    setRemovedAnimal(hidden);
    setPhase('spot_change');
    setFeedback('One animal left the grassland! Which animal is missing?');
    speakText('The scene changed! Tap or tell which animal left the Kaziranga grassland.');
  };

  const handleSelectAnimalSpot = (animal) => {
    if (animal.id === removedAnimal.id) {
      setFeedback(`✨ Correct! The ${removedAnimal.name} was missing!`);
      speakText(`Correct! The ${removedAnimal.name} left the grassland.`);
      setPhase('delayed_recall');

      recordAndSync(user?.uid, 'kaziranga-recall', {
        attempts: 1,
        timeTakenSeconds: 40,
        accuracy: 100,
        difficulty: 'standard',
      });
    } else {
      setFeedback('⚠️ Not quite! Look closely at the empty spot on the grass.');
      speakText('Look closely at which animal was there before.');
    }
  };

  const handleResetScene = () => {
    setPhase('observe');
    setRemovedAnimal(null);
    setSelectedRecall(null);
    setFeedback('Study the Kaziranga grassland animals carefully!');
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
            Assam Kaziranga Park 🦏
          </span>
          <button
            onClick={() => speakText('Kaziranga Grassland Recall. Observe the animals and spot what changed.')}
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
            🦏 Kaziranga Grassland Recall
          </h1>
          <p className="text-stone-600 text-sm mt-1">{feedback}</p>
        </div>

        {/* Grassland Scene Canvas */}
        <div className="bg-[#2D4A1D] p-8 rounded-2xl border-4 border-amber-900/30 shadow-xl my-6 relative overflow-hidden min-h-[300px] flex flex-col justify-center">
          {/* Decorative Grass motif */}
          <div className="absolute inset-x-0 bottom-0 h-16 bg-[#1F3614] opacity-80" />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 relative z-10">
            {KAZIRANGA_ANIMALS.map((animal) => {
              const isHidden = phase === 'spot_change' && removedAnimal?.id === animal.id;
              return (
                <div
                  key={animal.id}
                  className={`h-40 rounded-2xl border-2 border-emerald-500/40 p-4 flex flex-col items-center justify-center text-center transition-all ${
                    isHidden
                      ? 'bg-emerald-950/60 border-dashed border-amber-400/80 animate-pulse'
                      : 'bg-emerald-900/80 text-emerald-100 shadow-md'
                  }`}
                >
                  {isHidden ? (
                    <span className="text-3xl text-amber-300 font-bold">❓</span>
                  ) : (
                    <>
                      <span className="text-5xl mb-2">{animal.icon}</span>
                      <span className="font-bold text-xs">{animal.name}</span>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Spot-the-Change Selector Options */}
        {phase === 'spot_change' && (
          <div className="bg-amber-50 p-6 rounded-2xl border-2 border-amber-200 mb-6">
            <p className="text-center text-sm font-bold text-amber-900 mb-4">Which animal is missing from the grassland?</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {KAZIRANGA_ANIMALS.map((animal) => (
                <button
                  key={animal.id}
                  onClick={() => handleSelectAnimalSpot(animal)}
                  className="bg-white p-3 rounded-xl border border-amber-300 flex items-center space-x-3 hover:bg-amber-100 transition text-left"
                >
                  <span className="text-2xl">{animal.icon}</span>
                  <span className="text-xs font-bold text-stone-800">{animal.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="flex justify-center space-x-4">
          {phase === 'observe' ? (
            <button
              onClick={handleStartSpotChange}
              className="bg-emerald-700 text-white font-bold text-lg px-8 py-3.5 rounded-xl hover:bg-emerald-800 shadow-md transition"
            >
              Start Spot-the-Change Challenge
            </button>
          ) : (
            <button
              onClick={handleResetScene}
              className="bg-amber-700 text-white font-bold text-base px-6 py-3 rounded-xl hover:bg-amber-800 shadow-md transition flex items-center space-x-2"
            >
              <RefreshCw className="w-5 h-5" />
              <span>Observe Landscape Again</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
