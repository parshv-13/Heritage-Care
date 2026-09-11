import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { recordAndSync, speakText } from '../services/gameStorage';
import { ArrowLeft, RefreshCw, Volume2, Eye, Award, CheckCircle2 } from 'lucide-react';

const ALL_KAZIRANGA_ANIMALS = [
  { id: 'rhino', name: 'One-Horned Rhino', emoji: '🦏', details: 'Standing proudly in elephant grass meadow' },
  { id: 'buffalo', name: 'Wild Water Buffalo', emoji: '🐃', details: 'Resting beside fresh wetlands stream' },
  { id: 'deer', name: 'Swamp Deer (Barasingha)', emoji: '🦌', details: 'Grazing peacefully in open forest clearing' },
  { id: 'hornbill', name: 'Great Indian Hornbill', emoji: '🪶', details: 'Perched high atop a tall holong tree canopy' },
  { id: 'tiger', name: 'Royal Bengal Tiger', emoji: '🐅', details: 'Prowling stealthily through reed thickets' },
  { id: 'elephant', name: 'Asian Wild Elephant', emoji: '🐘', details: 'Trunk raised beside the Diphlu riverbank' },
  { id: 'langur', name: 'Capped Langur', emoji: '🐒', details: 'Leaping between fruit branches of the forest' },
  { id: 'dolphin', name: 'Gangetic River Dolphin', emoji: '🐬', details: 'Breaching surfacing waves in the Brahmaputra' },
  { id: 'leopard', name: 'Clouded Leopard', emoji: '🐆', details: 'Resting quietly on shaded forest branches' },
  { id: 'otter', name: 'Smooth-Coated Otter', emoji: '🦦', details: 'Playing along the river marsh edge' }
];

// Shuffle helper
function shuffleArray(arr) {
  const cloned = [...arr];
  for (let i = cloned.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cloned[i], cloned[j]] = [cloned[j], cloned[i]];
  }
  return cloned;
}

// Select 4 random distinct animals
function pickRandomSet(pool, count = 4) {
  return shuffleArray(pool).slice(0, count);
}

export function KazirangaRecall() {
  const navigate = useNavigate();
  const { currentUser: user } = useApp();

  const [activeAnimals, setActiveAnimals] = useState(() => pickRandomSet(ALL_KAZIRANGA_ANIMALS, 4));
  const [phase, setPhase] = useState('observe'); // 'observe' | 'spot_change' | 'delayed_recall'
  const [removedAnimal, setRemovedAnimal] = useState(null);
  const [previousRemovedId, setPreviousRemovedId] = useState(null);
  const [shuffledOptions, setShuffledOptions] = useState([]);
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('Observe all 4 Kaziranga grassland animals carefully.');

  const handleStartSpotChange = () => {
    // Pick an animal to remove, actively avoiding picking the exact same animal as the previous round
    const candidates = activeAnimals.filter((a) => a.id !== previousRemovedId);
    const poolToPickFrom = candidates.length > 0 ? candidates : activeAnimals;
    const chosen = poolToPickFrom[Math.floor(Math.random() * poolToPickFrom.length)];

    setRemovedAnimal(chosen);
    setPreviousRemovedId(chosen.id);

    // Prepare answer choices: the 4 animals currently on screen, shuffled randomly
    setShuffledOptions(shuffleArray(activeAnimals));

    setPhase('spot_change');
    setFeedback(`One animal departed from the grassland! Identify which animal left.`);
    speakText('The grassland scene changed. Which animal is now missing?');
  };

  const handleSelectAnimalSpot = (animal) => {
    if (animal.id === removedAnimal.id) {
      setScore((prev) => prev + 1);
      setFeedback(`Correct! The ${removedAnimal.name} departed from the habitat.`);
      speakText(`Correct! The ${removedAnimal.name} left the grassland.`);
      setPhase('delayed_recall');

      recordAndSync(user?.uid, 'kaziranga-recall', {
        attempts: round,
        timeTakenSeconds: 30,
        accuracy: 100,
        round: round,
        difficulty: 'standard',
      });
    } else {
      setFeedback(`Not quite! The ${animal.name} is still in the grassland. Look for the empty spot.`);
      speakText('Look closely at the empty spot.');
    }
  };

  const handleNextRound = () => {
    const newAnimals = pickRandomSet(ALL_KAZIRANGA_ANIMALS, 4);
    setActiveAnimals(newAnimals);
    setRemovedAnimal(null);
    setPhase('observe');
    setRound((prev) => prev + 1);
    setFeedback('New grassland scene! Observe all 4 animals carefully.');
    speakText('Observe all 4 animals carefully.');
  };

  const handleResetScene = () => {
    setPhase('observe');
    setRemovedAnimal(null);
    setFeedback('Observe all 4 Kaziranga grassland animals carefully.');
  };

  return (
    <div className="bg-[#FFFFFF] dark:bg-[#121214] pb-32 pt-6 px-4 max-w-4xl mx-auto space-y-6 text-left transition-colors">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-[#1A1A1A] dark:border-[#3F3F46] pb-4">
        <button
          onClick={() => navigate('/home')}
          className="h-16 px-6 bg-[#FFFFFF] dark:bg-[#27272A] hover:bg-[#F9F9F9] dark:hover:bg-[#3F3F46] text-[#1A1A1A] dark:text-[#F4F4F5] font-bold rounded-lg border-2 border-[#1A1A1A] dark:border-[#52525B] flex items-center gap-3 cursor-pointer self-start"
        >
          <ArrowLeft className="w-6 h-6" />
          <span>Back to Games</span>
        </button>
        <div className="flex items-center gap-3">
          <span className="bg-[#F9F9F9] dark:bg-[#27272A] text-[#1A1A1A] dark:text-[#E4E4E7] text-sm px-3 py-1 rounded border-2 border-[#1A1A1A] dark:border-[#52525B] font-bold">
            Assam Kaziranga Park
          </span>
          <button
            onClick={() => speakText('Kaziranga Grassland Recall. Observe the animals and spot what changed.')}
            className="h-16 px-6 bg-[#0B3C5D] dark:bg-[#0284C7] hover:bg-[#08283E] dark:hover:bg-[#0369A1] text-white font-bold rounded-lg border-2 border-[#0B3C5D] dark:border-[#0284C7] flex items-center gap-2 cursor-pointer"
          >
            <Volume2 className="w-6 h-6" />
            <span>Read Aloud</span>
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-[#FFFFFF] dark:bg-[#18181B] border-2 border-[#1A1A1A] dark:border-[#3F3F46] rounded-lg p-6 space-y-6 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1A1A1A] dark:text-[#F4F4F5]">
              Kaziranga Grassland Recall
            </h1>
            <p className="text-base font-bold text-[#0B3C5D] dark:text-[#38BDF8] mt-1">{feedback}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-wider bg-[#F9F9F9] dark:bg-[#27272A] border-2 border-[#1A1A1A] dark:border-[#52525B] px-3 py-1.5 rounded-lg text-[#1A1A1A] dark:text-[#E4E4E7]">
              Round {round} • Score {score}
            </span>
          </div>
        </div>

        {/* Animals Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {activeAnimals.map((animal, idx) => {
            const isHidden = phase === 'spot_change' && removedAnimal?.id === animal.id;
            return (
              <div
                key={animal.id}
                className={`p-4 rounded-lg border-2 space-y-2 text-left transition-all min-h-[190px] flex flex-col justify-between ${
                  isHidden
                    ? 'bg-[#FEF2F2] dark:bg-[#450A0A] border-dashed border-[#DC2626] dark:border-[#F87171]'
                    : 'bg-[#FFFFFF] dark:bg-[#27272A] border-[#1A1A1A] dark:border-[#52525B]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase text-[#0B3C5D] dark:text-[#38BDF8]">
                      Spot #{idx + 1}
                    </span>
                    <span className="text-2xl">{isHidden ? '❓' : animal.emoji}</span>
                  </div>

                  {isHidden ? (
                    <div className="py-4">
                      <p className="text-lg font-bold text-[#DC2626] dark:text-[#F87171]">[Departed Animal]</p>
                      <p className="text-xs text-[#666666] dark:text-[#A1A1AA] mt-1">Which animal was here before?</p>
                    </div>
                  ) : (
                    <div className="mt-2">
                      <h2 className="text-lg font-bold text-[#1A1A1A] dark:text-[#F4F4F5]">{animal.name}</h2>
                      <p className="text-xs text-[#444444] dark:text-[#D4D4D8] mt-1 line-clamp-3">{animal.details}</p>
                    </div>
                  )}
                </div>

                <div className="text-[11px] font-semibold text-[#888888] dark:text-[#A1A1AA] uppercase">
                  {isHidden ? 'EMPTY ZONE' : 'PRESENT IN HABITAT'}
                </div>
              </div>
            );
          })}
        </div>

        {/* Spot The Change Selector */}
        {phase === 'spot_change' && (
          <div className="bg-[#F9F9F9] dark:bg-[#27272A] border-2 border-[#1A1A1A] dark:border-[#52525B] p-6 rounded-lg space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-[#1A1A1A] dark:text-[#F4F4F5]">
                Select which animal is missing from the grassland:
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {shuffledOptions.map((animal) => (
                <button
                  key={animal.id}
                  onClick={() => handleSelectAnimalSpot(animal)}
                  className="min-h-16 px-6 py-3 bg-[#FFFFFF] dark:bg-[#18181B] hover:bg-[#F9F9F9] dark:hover:bg-[#3F3F46] border-2 border-[#1A1A1A] dark:border-[#52525B] text-[#1A1A1A] dark:text-[#F4F4F5] font-bold text-base rounded-lg flex items-center justify-between cursor-pointer text-left gap-3"
                >
                  <span className="flex items-center gap-3">
                    <span className="text-2xl shrink-0">{animal.emoji}</span>
                    <span>{animal.name}</span>
                  </span>
                  <Eye className="w-5 h-5 text-[#0B3C5D] dark:text-[#38BDF8] shrink-0" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Completion Card */}
        {phase === 'delayed_recall' && (
          <div className="bg-[#ECFDF5] dark:bg-[#064E3B] border-2 border-[#1D6F42] dark:border-[#34D399] p-6 rounded-lg space-y-4 text-left">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-8 h-8 text-[#1D6F42] dark:text-[#34D399]" />
              <div>
                <h3 className="text-xl font-bold text-[#1D6F42] dark:text-[#A7F3D0]">
                  Excellent Observation!
                </h3>
                <p className="text-sm font-semibold text-[#065F46] dark:text-[#D1FAE5]">
                  You successfully noticed that the {removedAnimal?.name} left the grassland habitat.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="pt-4 border-t-2 border-[#1A1A1A] dark:border-[#3F3F46] flex flex-wrap gap-4">
          {phase === 'observe' && (
            <button
              onClick={handleStartSpotChange}
              className="w-full sm:w-auto h-16 px-8 bg-[#0B3C5D] dark:bg-[#0284C7] hover:bg-[#08283E] dark:hover:bg-[#0369A1] text-white font-bold text-lg rounded-lg border-2 border-[#0B3C5D] dark:border-[#0284C7] flex items-center justify-center gap-3 cursor-pointer"
            >
              <Eye className="w-6 h-6" />
              <span>Start Spot-the-Change Challenge</span>
            </button>
          )}

          {phase === 'spot_change' && (
            <button
              onClick={handleResetScene}
              className="w-full sm:w-auto h-16 px-8 bg-[#FFFFFF] dark:bg-[#27272A] hover:bg-[#F9F9F9] dark:hover:bg-[#3F3F46] text-[#1A1A1A] dark:text-[#F4F4F5] font-bold text-base rounded-lg border-2 border-[#1A1A1A] dark:border-[#52525B] flex items-center justify-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-5 h-5" />
              <span>Show All Animals Again</span>
            </button>
          )}

          {phase === 'delayed_recall' && (
            <button
              onClick={handleNextRound}
              className="w-full sm:w-auto h-16 px-8 bg-[#1D6F42] dark:bg-[#059669] hover:bg-[#15803D] dark:hover:bg-[#047857] text-white font-bold text-lg rounded-lg border-2 border-[#1D6F42] dark:border-[#059669] flex items-center justify-center gap-3 cursor-pointer"
            >
              <Award className="w-6 h-6" />
              <span>Play Next Round (Different Animals)</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
