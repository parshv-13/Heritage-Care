import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { recordAndSync, speakText } from '../services/gameStorage';
import { ArrowLeft, RefreshCw, Volume2, Utensils, CheckCircle2, Eye, EyeOff, Sparkles, ChefHat } from 'lucide-react';

const RECIPES = [
  {
    id: 'masor_tenga',
    name: 'Assamese Masor Tenga (Tangy Fish Curry)',
    state: 'Assam 🐟',
    steps: [
      { id: 1, title: 'Wash & Marinate Fish', detail: 'Lightly salt freshwater Rohu fish with turmeric powder.', icon: '🐟' },
      { id: 2, title: 'Temper Mustard Oil', detail: 'Sizzle fenugreek (methi) & mustard seeds in mustard oil.', icon: '🍳' },
      { id: 3, title: 'Simmer Tomatoes & Outenga', detail: 'Simmer tangy elephant apple (outenga) & juicy tomatoes.', icon: '🍅' },
      { id: 4, title: 'Garnish with Kaji Nemu', detail: 'Finish sour broth with fragrant fresh lemon leaves & coriander.', icon: '🌿' },
    ],
  },
  {
    id: 'bambooshot_pork',
    name: 'Nagaland Smoked Pork & Fermented Bamboo Shoot',
    state: 'Nagaland 🎋',
    steps: [
      { id: 1, title: 'Rinse Fermented Bamboo Shoot', detail: 'Rinse fresh shredded fermented bamboo shoot (Bastanga).', icon: '🎋' },
      { id: 2, title: 'Crush Naga King Chili (Raja Mircha)', detail: 'Gently crush smoky Naga king chili with ginger-garlic.', icon: '🌶️' },
      { id: 3, title: 'Slow Cook in Traditional Clay Pot', detail: 'Simmer smoked pork cuts & bamboo shoot together without excess oil.', icon: '🍲' },
      { id: 4, title: 'Plate with Steamed Mountain Rice', detail: 'Serve warm alongside local sticky mountain rice.', icon: '🍚' },
    ],
  },
  {
    id: 'jadoh_meghalaya',
    name: 'Meghalaya Khasi Jadoh Rice',
    state: 'Meghalaya 🍚',
    steps: [
      { id: 1, title: 'Wash Short Grain Hill Rice', detail: 'Rinse aromatic Meghalaya red hill rice thoroughly.', icon: '🌾' },
      { id: 2, title: 'Sauté Onions & Black Sesame', detail: 'Fry golden sliced onions with crushed black sesame paste (Nei-iong).', icon: '🧅' },
      { id: 3, title: 'Combine Broth & Spices', detail: 'Add spiced rich broth, bay leaves, ginger, and turmeric.', icon: '🍲' },
      { id: 4, title: 'Dum Cook & Garnish', detail: 'Cover pot tightly until rice is fluffy, garnish with fresh mint.', icon: '🌿' },
    ],
  },
  {
    id: 'kangshoi_manipur',
    name: 'Manipuri Kangshoi Vegetable Stew',
    state: 'Manipur 🥗',
    steps: [
      { id: 1, title: 'Prepare Fresh Seasonal Greens', detail: 'Chop lotus roots, mustard greens, and yardlong beans.', icon: '🥬' },
      { id: 2, title: 'Roast Fermented Ngari Fish', detail: 'Roast traditional fermented Ngari fish over flame for umami aroma.', icon: '🐟' },
      { id: 3, title: 'Boil Broth with Ginger & Maroi', detail: 'Simmer vegetables in boiling water with roasted Ngari & chives (Maroi).', icon: '🍲' },
      { id: 4, title: 'Serve Healthy Warm Broth', detail: 'Serve pure, oil-free medicinal hot vegetable stew.', icon: '🥣' },
    ],
  },
  {
    id: 'mui_borok_tripura',
    name: 'Tripura Mui Borok Berma Stew',
    state: 'Tripura 🥣',
    steps: [
      { id: 1, title: 'Clean Bamboo Shoots & Veggies', detail: 'Slice fresh local bamboo shoots, eggplant, and green beans.', icon: '🎋' },
      { id: 2, title: 'Add Traditional Berma Fish', detail: 'Drop authentic fermented sun-dried Berma fish into boiling pot.', icon: '🐟' },
      { id: 3, title: 'Add Crushed Garlic & Fresh Chilies', detail: 'Pound fresh mountain green chilies and garlic cloves into the broth.', icon: '🌶️' },
      { id: 4, title: 'Simmer to Flavorful Aroma', detail: 'Boil to oil-free spicy perfection with herbs.', icon: '🍲' },
    ],
  },
  {
    id: 'thukpa_sikkim',
    name: 'Sikkim Himalayan Thukpa & Momos',
    state: 'Sikkim 🥟',
    steps: [
      { id: 1, title: 'Knead Dough & Shape Wrappers', detail: 'Roll thin round dough wrappers for hand-folded momos.', icon: '🥟' },
      { id: 2, title: 'Steam Dumplings in Tiered Steamer', detail: 'Steam dumplings (Moktu) over boiling fragrant water.', icon: '♨️' },
      { id: 3, title: 'Boil Wheat Hand-Pulled Noodles', detail: 'Cook fresh wheat noodles in vegetable herbal broth.', icon: '🍜' },
      { id: 4, title: 'Top with Dalle Chili Dip', detail: 'Pour hot soup over noodles and serve with spicy round Dalle Khursani chutney.', icon: '🌶️' },
    ],
  },
];

export function KitchenMaster() {
  const navigate = useNavigate();
  const { currentUser: user } = useApp();

  const [recipeIdx, setRecipeIdx] = useState(0);
  const [userSequence, setUserSequence] = useState([]);
  const [phase, setPhase] = useState('guided'); // 'guided' | 'recall' | 'completed'
  const [hideImages, setHideImages] = useState(false);
  const [feedback, setFeedback] = useState('Select the steps in the exact traditional culinary sequence!');

  const recipe = RECIPES[recipeIdx];

  const handleSelectStep = (step) => {
    if (userSequence.some((s) => s.id === step.id)) return;

    const nextSeq = [...userSequence, step];
    setUserSequence(nextSeq);
    speakText(`Step ${nextSeq.length}: ${step.title}`);

    if (nextSeq.length === recipe.steps.length) {
      // Check sequence order correctness
      let correct = true;
      nextSeq.forEach((item, index) => {
        if (item.id !== recipe.steps[index].id) correct = false;
      });

      if (correct) {
        setPhase('completed');
        setFeedback(`✨ Delicious! You prepared ${recipe.name} in exact culinary order!`);
        speakText(`Delicious! You prepared ${recipe.name} in exact culinary order!`);

        recordAndSync(user?.uid, 'kitchen-master', {
          attempts: 1,
          timeTakenSeconds: 60,
          accuracy: 100,
          difficulty: hideImages ? 'harder' : 'standard',
        });
      } else {
        setFeedback('⚠️ Sequence order mismatch. Try arranging the cooking steps again.');
        speakText('Let us review the culinary order together.');
      }
    }
  };

  const handleReset = () => {
    setUserSequence([]);
    setPhase(hideImages ? 'recall' : 'guided');
    setFeedback('Select the first step to begin cooking.');
  };

  const handleRecipeChange = (idx) => {
    setRecipeIdx(idx);
    setUserSequence([]);
    setPhase(hideImages ? 'recall' : 'guided');
    setFeedback(`Selected ${RECIPES[idx].name}. Select the first step.`);
    speakText(`Now preparing ${RECIPES[idx].name}.`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 pb-32">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigate('/home')}
          className="flex items-center space-x-2 text-[#4A3728] hover:text-amber-800 transition font-medium"
        >
          <ArrowLeft className="w-6 h-6" />
          <span>Back to Games</span>
        </button>
        <div className="flex items-center space-x-3">
          <span className="bg-[#BA7517]/20 text-amber-900 text-sm px-3 py-1 rounded-full font-semibold border border-amber-300">
            Regional Heritage Kitchen 🍲
          </span>
          <button
            onClick={() => speakText(`Traditional Kitchen Master. Prepare ${recipe.name} step by step in proper order.`)}
            className="p-2 bg-amber-700 text-white rounded-full hover:bg-amber-800 transition shadow-sm"
          >
            <Volume2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* ── Top Dish Dropdown Selector ── */}
      <div className="bg-white p-4 rounded-2xl border-2 border-amber-900/20 shadow-sm mb-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ChefHat className="w-6 h-6 text-amber-800" />
          <span className="text-xs md:text-sm font-bold text-stone-800 uppercase tracking-wide">
            Select Traditional Dish:
          </span>
        </div>
        <div className="relative w-full sm:w-80">
          <select
            value={recipeIdx}
            onChange={(e) => handleRecipeChange(Number(e.target.value))}
            className="w-full bg-[#FAF6EE] text-amber-950 font-bold text-sm px-4 py-3 rounded-xl border-2 border-amber-900/30 focus:border-amber-700 outline-none shadow-inner cursor-pointer"
          >
            {RECIPES.map((r, idx) => (
              <option key={r.id} value={idx}>
                {r.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Game Container */}
      <div className="bg-white rounded-3xl p-6 shadow-md border-2 border-amber-900/10 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#4A3728] flex items-center justify-center gap-2">
            🍳 Traditional Kitchen Master
          </h1>
          <p className="text-amber-900 font-bold text-lg mt-1">{recipe.name}</p>
          <p className="text-stone-600 text-sm mt-1">{feedback}</p>
        </div>

        {/* Recipe Step Slot Board */}
        <div className="bg-[#FAF6EE] p-6 rounded-3xl border-2 border-amber-900/20 shadow-inner">
          <h3 className="text-center font-bold text-[#4A3728] mb-4">Cooking Pot Sequence:</h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {recipe.steps.map((_, idx) => {
              const placedStep = userSequence[idx];
              return (
                <div
                  key={idx}
                  className={`h-32 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-3 text-center transition-all ${
                    placedStep
                      ? 'bg-amber-100 border-amber-600 text-amber-950 shadow-sm'
                      : 'bg-stone-50 border-stone-300 text-stone-400'
                  }`}
                >
                  <span className="text-xs font-bold text-amber-800 mb-1">Step {idx + 1}</span>
                  {placedStep ? (
                    <>
                      <span className="text-3xl mb-1">{placedStep.icon}</span>
                      <span className="text-xs font-bold">{placedStep.title}</span>
                    </>
                  ) : (
                    <span className="text-xs text-stone-400">Empty Slot</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Chooser Cards */}
        {phase !== 'completed' && (
          <div>
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-sm font-bold text-stone-700 uppercase">Available Ingredients & Steps:</h4>
              <button
                onClick={() => {
                  setHideImages(!hideImages);
                  setPhase(!hideImages ? 'recall' : 'guided');
                }}
                className="flex items-center space-x-1 text-xs font-bold text-amber-800 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200"
              >
                {hideImages ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                <span>{hideImages ? 'Show Visual Prompts' : 'Hide Images (Memory Recall Mode)'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recipe.steps.map((step) => {
                const isSelected = userSequence.some((s) => s.id === step.id);
                return (
                  <button
                    key={step.id}
                    onClick={() => handleSelectStep(step)}
                    disabled={isSelected}
                    className={`p-4 rounded-2xl border-2 text-left flex items-center space-x-4 transition transform active:scale-98 ${
                      isSelected
                        ? 'bg-stone-100 border-stone-200 opacity-50 cursor-not-allowed'
                        : 'bg-white border-amber-800/30 hover:border-amber-700 hover:bg-amber-50/50 shadow-sm cursor-pointer'
                    }`}
                  >
                    {!hideImages && <span className="text-4xl">{step.icon}</span>}
                    <div>
                      <h5 className="font-bold text-stone-800 text-base">{step.title}</h5>
                      <p className="text-xs text-stone-500">{step.detail}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Success Banner */}
        {phase === 'completed' && (
          <div className="p-6 bg-emerald-50 rounded-2xl border-2 border-emerald-300 text-center space-y-3">
            <h3 className="text-2xl font-extrabold text-emerald-900">Grand Feast Prepared! 🍲</h3>
            <p className="text-sm text-emerald-800 font-semibold">
              You followed all 4 culinary steps in traditional heritage sequence.
            </p>
          </div>
        )}

        {/* Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-stone-200">
          <button
            onClick={() => handleRecipeChange((recipeIdx + 1) % RECIPES.length)}
            className="text-stone-700 text-sm font-bold bg-stone-100 px-4 py-2.5 rounded-xl hover:bg-stone-200 transition"
          >
            Next Recipe ➡️
          </button>

          <button
            onClick={handleReset}
            className="flex items-center space-x-2 bg-amber-700 text-white font-bold px-6 py-2.5 rounded-xl hover:bg-amber-800 shadow-md transition"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reset Pot & Steps</span>
          </button>
        </div>
      </div>
    </div>
  );
}

