import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { recordAndSync, speakText } from '../services/gameStorage';
import { ArrowLeft, RefreshCw, Volume2, Eye } from 'lucide-react';

const KAZIRANGA_ANIMALS = [
  { id: 'rhino', name: 'One-Horned Rhino', details: 'Standing near elephant grass meadow' },
  { id: 'buffalo', name: 'Wild Water Buffalo', details: 'Resting near water body stream' },
  { id: 'deer', name: 'Swamp Deer', details: 'Grazing in open forest clearing' },
  { id: 'hornbill', name: 'Great Indian Hornbill', details: 'Perched on tall holong tree' },
];

export function KazirangaRecall() {
  const navigate = useNavigate();
  const { currentUser: user } = useApp();

  const [phase, setPhase] = useState('observe'); // 'observe' | 'spot_change' | 'delayed_recall'
  const [removedAnimal, setRemovedAnimal] = useState(null);
  const [feedback, setFeedback] = useState('Observe all 4 Kaziranga grassland animals carefully.');

  const handleStartSpotChange = () => {
    const randIdx = Math.floor(Math.random() * KAZIRANGA_ANIMALS.length);
    const hidden = KAZIRANGA_ANIMALS[randIdx];
    setRemovedAnimal(hidden);
    setPhase('spot_change');
    setFeedback('One animal departed from the grassland. Identify which animal is missing.');
    speakText('The scene changed. Identify which animal left the Kaziranga grassland.');
  };

  const handleSelectAnimalSpot = (animal) => {
    if (animal.id === removedAnimal.id) {
      setFeedback(`Correct: The ${removedAnimal.name} was missing from the habitat.`);
      speakText(`Correct. The ${removedAnimal.name} left the grassland.`);
      setPhase('delayed_recall');

      recordAndSync(user?.uid, 'kaziranga-recall', {
        attempts: 1,
        timeTakenSeconds: 40,
        accuracy: 100,
        difficulty: 'standard',
      });
    } else {
      setFeedback('That animal is still present. Look closely at which spot is empty.');
      speakText('Look closely at which animal was there before.');
    }
  };

  const handleResetScene = () => {
    setPhase('observe');
    setRemovedAnimal(null);
    setFeedback('Observe all 4 Kaziranga grassland animals carefully.');
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
            Assam Kaziranga Park
          </span>
          <button
            onClick={() => speakText('Kaziranga Grassland Recall. Observe the animals and spot what changed.')}
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
            Kaziranga Grassland Recall
          </h1>
          <p className="text-base font-bold text-[#0B3C5D] mt-1">{feedback}</p>
        </div>

        {/* Animals Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {KAZIRANGA_ANIMALS.map((animal) => {
            const isHidden = phase === 'spot_change' && removedAnimal?.id === animal.id;
            return (
              <div
                key={animal.id}
                className={`p-4 rounded-lg border-2 space-y-2 text-left ${
                  isHidden
                    ? 'bg-[#F9F9F9] border-dashed border-[#1A1A1A]'
                    : 'bg-[#FFFFFF] border-[#1A1A1A]'
                }`}
              >
                <span className="text-xs font-bold uppercase text-[#0B3C5D]">Habitat Location</span>
                {isHidden ? (
                  <div className="py-6">
                    <p className="text-lg font-bold text-[#1A1A1A]">[Departed Animal]</p>
                    <p className="text-xs text-[#777777]">Identify missing wildlife</p>
                  </div>
                ) : (
                  <div>
                    <h2 className="text-lg font-bold text-[#1A1A1A]">{animal.name}</h2>
                    <p className="text-xs text-[#333333] mt-1">{animal.details}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Spot The Change Selector */}
        {phase === 'spot_change' && (
          <div className="bg-[#F9F9F9] border-2 border-[#1A1A1A] p-6 rounded-lg space-y-4">
            <h2 className="text-lg font-bold text-[#1A1A1A]">Select which animal is missing:</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {KAZIRANGA_ANIMALS.map((animal) => (
                <button
                  key={animal.id}
                  onClick={() => handleSelectAnimalSpot(animal)}
                  className="h-16 px-6 bg-[#FFFFFF] hover:bg-[#F9F9F9] border-2 border-[#1A1A1A] text-[#1A1A1A] font-bold text-base rounded-lg flex items-center justify-between cursor-pointer"
                >
                  <span>{animal.name}</span>
                  <Eye className="w-5 h-5 text-[#0B3C5D]" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="pt-4 border-t-2 border-[#1A1A1A]">
          {phase === 'observe' ? (
            <button
              onClick={handleStartSpotChange}
              className="w-full sm:w-auto h-16 px-8 bg-[#0B3C5D] hover:bg-[#08283E] text-white font-bold text-lg rounded-lg border-2 border-[#0B3C5D] flex items-center justify-center gap-3 cursor-pointer"
            >
              <Eye className="w-6 h-6" />
              <span>Start Spot-the-Change Challenge</span>
            </button>
          ) : (
            <button
              onClick={handleResetScene}
              className="w-full sm:w-auto h-16 px-8 bg-[#0B3C5D] hover:bg-[#08283E] text-white font-bold text-base rounded-lg border-2 border-[#0B3C5D] flex items-center justify-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-5 h-5" />
              <span>Observe All Animals Again</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
