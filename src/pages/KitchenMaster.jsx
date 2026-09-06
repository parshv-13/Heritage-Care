import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { recordAndSync, speakText } from '../services/gameStorage';
import { ArrowLeft, RefreshCw, Volume2, CheckCircle2, ChevronRight } from 'lucide-react';

const RECIPES = [
  {
    id: 'masor_tenga',
    name: 'Assamese Masor Tenga (Tangy Fish Curry)',
    state: 'Assam',
    steps: [
      { id: 1, title: 'Step 1: Wash & Marinate Fish', detail: 'Lightly salt freshwater Rohu fish with turmeric powder.' },
      { id: 2, title: 'Step 2: Temper Mustard Oil', detail: 'Sizzle fenugreek (methi) & mustard seeds in pure mustard oil.' },
      { id: 3, title: 'Step 3: Simmer Tomatoes & Outenga', detail: 'Simmer tangy elephant apple (outenga) & juicy tomatoes.' },
      { id: 4, title: 'Step 4: Garnish with Kaji Nemu', detail: 'Finish sour broth with fragrant fresh lemon leaves & coriander.' },
    ],
  },
  {
    id: 'bambooshot_pork',
    name: 'Nagaland Smoked Dish & Fermented Bamboo Shoot',
    state: 'Nagaland',
    steps: [
      { id: 1, title: 'Step 1: Rinse Bamboo Shoot', detail: 'Rinse fresh shredded fermented bamboo shoot (Bastanga).' },
      { id: 2, title: 'Step 2: Crush King Chili', detail: 'Gently crush smoky Naga king chili with fresh ginger-garlic.' },
      { id: 3, title: 'Step 3: Simmer in Clay Pot', detail: 'Simmer cuts & bamboo shoot together slowly over low flame.' },
      { id: 4, title: 'Step 4: Plate with Steamed Rice', detail: 'Serve warm alongside local sticky mountain rice.' },
    ],
  },
  {
    id: 'jadoh_meghalaya',
    name: 'Meghalaya Khasi Jadoh Rice',
    state: 'Meghalaya',
    steps: [
      { id: 1, title: 'Step 1: Wash Hill Rice', detail: 'Rinse aromatic Meghalaya red hill rice thoroughly in water.' },
      { id: 2, title: 'Step 2: Saute Onions & Sesame', detail: 'Fry golden sliced onions with crushed black sesame paste (Nei-iong).' },
      { id: 3, title: 'Step 3: Combine Broth & Spices', detail: 'Add spiced rich broth, bay leaves, ginger, and turmeric.' },
      { id: 4, title: 'Step 4: Dum Cook & Garnish', detail: 'Cover pot tightly until rice is fluffy and aromatic.' },
    ],
  },
  {
    id: 'kangshoi_manipur',
    name: 'Manipuri Kangshoi Vegetable Stew',
    state: 'Manipur',
    steps: [
      { id: 1, title: 'Step 1: Prepare Seasonal Greens', detail: 'Chop fresh lotus roots, mustard greens, and yardlong beans.' },
      { id: 2, title: 'Step 2: Roast Fermented Ngari', detail: 'Roast traditional fermented Ngari over flame for aroma.' },
      { id: 3, title: 'Step 3: Boil Broth with Maroi', detail: 'Simmer vegetables in boiling water with roasted seasoning & chives (Maroi).' },
      { id: 4, title: 'Step 4: Serve Warm Broth', detail: 'Serve medicinal hot vegetable broth immediately.' },
    ],
  },
];

export function KitchenMaster() {
  const navigate = useNavigate();
  const { currentUser: user } = useApp();

  const [recipeIdx, setRecipeIdx] = useState(0);
  const [userSequence, setUserSequence] = useState([]);
  const [phase, setPhase] = useState('guided');
  const [feedback, setFeedback] = useState('Select the cooking steps in the correct culinary sequence:');

  const recipe = RECIPES[recipeIdx];

  const handleSelectStep = (step) => {
    if (userSequence.some((s) => s.id === step.id)) return;

    const nextSeq = [...userSequence, step];
    setUserSequence(nextSeq);
    speakText(`Selected ${step.title}`);

    if (nextSeq.length === recipe.steps.length) {
      let correct = true;
      nextSeq.forEach((item, index) => {
        if (item.id !== recipe.steps[index].id) correct = false;
      });

      if (correct) {
        setPhase('completed');
        setFeedback(`Completed: You prepared ${recipe.name} in exact culinary order.`);
        speakText(`Wonderful. You prepared ${recipe.name} in exact culinary order.`);

        recordAndSync(user?.uid, 'kitchen-master', {
          attempts: 1,
          timeTakenSeconds: 60,
          accuracy: 100,
          difficulty: 'standard',
        });
      } else {
        setFeedback('Sequence order mismatch. Reset the steps to try arranging them again.');
        speakText('Let us review the culinary order together.');
      }
    }
  };

  const handleReset = () => {
    setUserSequence([]);
    setPhase('guided');
    setFeedback('Select the first step to begin cooking.');
  };

  const handleRecipeChange = (idx) => {
    setRecipeIdx(idx);
    setUserSequence([]);
    setPhase('guided');
    setFeedback(`Selected ${RECIPES[idx].name}. Select the first step.`);
    speakText(`Now preparing ${RECIPES[idx].name}.`);
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
            Regional Heritage Kitchen
          </span>
          <button
            onClick={() => speakText(`Traditional Kitchen Master. Prepare ${recipe.name} step by step in proper order.`)}
            className="h-16 px-6 bg-[#0B3C5D] hover:bg-[#08283E] text-white font-bold rounded-lg border-2 border-[#0B3C5D] flex items-center gap-2 cursor-pointer"
          >
            <Volume2 className="w-6 h-6" />
            <span>Read Aloud</span>
          </button>
        </div>
      </div>

      {/* Recipe Dropdown Selector */}
      <div className="bg-[#F9F9F9] p-4 rounded-lg border-2 border-[#1A1A1A] space-y-2">
        <label className="block text-sm font-bold text-[#1A1A1A]">Select Recipe to Prepare:</label>
        <select
          value={recipeIdx}
          onChange={(e) => handleRecipeChange(Number(e.target.value))}
          className="w-full bg-[#FFFFFF] text-[#1A1A1A] font-bold text-base px-4 py-3 rounded-lg border-2 border-[#1A1A1A] cursor-pointer"
        >
          {RECIPES.map((r, idx) => (
            <option key={r.id} value={idx}>
              {r.name} ({r.state})
            </option>
          ))}
        </select>
      </div>

      {/* Main Container */}
      <div className="bg-[#FFFFFF] border-2 border-[#1A1A1A] rounded-lg p-6 space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1A1A1A]">
            Traditional Kitchen Master
          </h1>
          <p className="text-lg font-bold text-[#0B3C5D] mt-1">{recipe.name}</p>
          <p className="text-base text-[#333333] mt-1">{feedback}</p>
        </div>

        {/* Selected Sequence Slots */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-[#1A1A1A]">Active Cooking Pot Sequence:</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {recipe.steps.map((_, idx) => {
              const placedStep = userSequence[idx];
              return (
                <div
                  key={idx}
                  className={`p-4 rounded-lg border-2 space-y-1 ${
                    placedStep
                      ? 'bg-[#F9F9F9] border-[#0B3C5D] text-[#1A1A1A]'
                      : 'bg-[#FFFFFF] border-dashed border-[#CCCCCC] text-[#777777]'
                  }`}
                >
                  <span className="text-xs font-bold uppercase text-[#0B3C5D]">Slot {idx + 1}</span>
                  {placedStep ? (
                    <div>
                      <p className="text-base font-bold text-[#1A1A1A]">{placedStep.title}</p>
                      <p className="text-xs text-[#333333] mt-1">{placedStep.detail}</p>
                    </div>
                  ) : (
                    <p className="text-sm font-medium text-[#777777]">Empty Slot</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Chooser List */}
        {phase !== 'completed' && (
          <div className="space-y-3 pt-2">
            <h2 className="text-lg font-bold text-[#1A1A1A]">Available Preparation Steps:</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recipe.steps.map((step) => {
                const isSelected = userSequence.some((s) => s.id === step.id);
                return (
                  <button
                    key={step.id}
                    onClick={() => handleSelectStep(step)}
                    disabled={isSelected}
                    className={`p-4 rounded-lg border-2 text-left space-y-1 ${
                      isSelected
                        ? 'bg-[#F9F9F9] border-[#CCCCCC] text-[#777777] cursor-not-allowed'
                        : 'bg-[#FFFFFF] hover:bg-[#F9F9F9] border-[#1A1A1A] text-[#1A1A1A] cursor-pointer'
                    }`}
                  >
                    <h3 className="font-bold text-base text-[#1A1A1A]">{step.title}</h3>
                    <p className="text-sm text-[#333333]">{step.detail}</p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Completed Message */}
        {phase === 'completed' && (
          <div className="p-6 bg-[#F9F9F9] rounded-lg border-2 border-[#1D6F42] space-y-2">
            <h2 className="text-xl font-bold text-[#1D6F42]">Dish Successfully Prepared</h2>
            <p className="text-base text-[#1A1A1A]">
              All 4 culinary steps have been completed in correct sequential order.
            </p>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t-2 border-[#1A1A1A]">
          <button
            onClick={() => handleRecipeChange((recipeIdx + 1) % RECIPES.length)}
            className="h-16 px-6 bg-[#FFFFFF] hover:bg-[#F9F9F9] text-[#1A1A1A] font-bold text-base rounded-lg border-2 border-[#1A1A1A] flex items-center gap-2 cursor-pointer"
          >
            <span>Next Recipe</span>
            <ChevronRight className="w-5 h-5" />
          </button>

          <button
            onClick={handleReset}
            className="h-16 px-6 bg-[#0B3C5D] hover:bg-[#08283E] text-white font-bold text-base rounded-lg border-2 border-[#0B3C5D] flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw className="w-5 h-5" />
            <span>Reset Pot & Steps</span>
          </button>
        </div>
      </div>
    </div>
  );
}
