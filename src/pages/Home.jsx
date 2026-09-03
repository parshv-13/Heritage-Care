import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Brain, Sparkles, Volume2, ArrowRight, HeartHandshake, MapPin, Play } from 'lucide-react';
import { speakText } from '../services/gameStorage';

const GAMES_LIST = [
  {
    id: 'khasi-loom',
    title: 'Khasi Jainsem Loom Weave',
    state: 'Meghalaya 🧵',
    domain: 'Visual Pattern Memory',
    path: '/game/khasi-loom',
    icon: '🧵',
    color: 'bg-amber-50 border-amber-300 text-amber-950',
    btnBg: 'bg-amber-700 hover:bg-amber-800 text-white',
  },
  {
    id: 'cheraw-rhythm',
    title: 'Cheraw Bamboo Rhythm Tap',
    state: 'Mizoram 🎋',
    domain: 'Divided Attention & Rhythm',
    path: '/game/cheraw-rhythm',
    icon: '🎋',
    color: 'bg-emerald-50 border-emerald-300 text-emerald-950',
    btnBg: 'bg-emerald-700 hover:bg-emerald-800 text-white',
  },
  {
    id: 'morung-story',
    title: 'Village Elder Morung Storytelling',
    state: 'Nagaland 🦅',
    domain: 'Voice Reminiscence & Semantic',
    path: '/game/morung-story',
    icon: '🦅',
    color: 'bg-red-50 border-red-300 text-red-950',
    btnBg: 'bg-red-800 hover:bg-red-900 text-white',
  },
  {
    id: 'wangala-drums',
    title: 'Wangala 100-Drums Echo',
    state: 'Meghalaya Garo 🥁',
    domain: 'Auditory Sequential Pattern',
    path: '/game/wangala-drums',
    icon: '🥁',
    color: 'bg-amber-50 border-amber-400 text-amber-950',
    btnBg: 'bg-amber-800 hover:bg-amber-900 text-white',
  },
  {
    id: 'kitchen-master',
    title: 'Traditional Kitchen Master',
    state: 'Assam & NE 🍲',
    domain: 'Procedural Cooking Recall',
    path: '/game/kitchen-master',
    icon: '🍲',
    color: 'bg-orange-50 border-orange-300 text-orange-950',
    btnBg: 'bg-orange-700 hover:bg-orange-800 text-white',
  },
  {
    id: 'monastery-walk',
    title: 'Monastery Prayer Wheel Walk',
    state: 'Arunachal & Sikkim ☸️',
    domain: 'Calming Low-Stimulation',
    path: '/game/monastery-walk',
    icon: '☸️',
    color: 'bg-indigo-50 border-indigo-300 text-indigo-950',
    btnBg: 'bg-indigo-700 hover:bg-indigo-800 text-white',
  },
  {
    id: 'kaziranga-recall',
    title: 'Kaziranga Grassland Recall',
    state: 'Assam Kaziranga 🦏',
    domain: 'Visual Detail & Spot-the-Change',
    path: '/game/kaziranga-recall',
    icon: '🦏',
    color: 'bg-emerald-50 border-emerald-300 text-emerald-950',
    btnBg: 'bg-emerald-800 hover:bg-emerald-900 text-white',
  },
];

export const Home = () => {
  const navigate = useNavigate();
  const { currentTheme, t, patientName, reminders, toggleReminder, userState, userLanguage } = useApp();

  const handleVoiceHelp = () => {
    speakText(`Hello ${patientName}! Welcome to your ${currentTheme.name} heritage memory app. ${currentTheme.greeting}`);
  };

  return (
    <div className="min-h-screen bg-[#F9F7F2] pb-24 pt-4 px-4 max-w-4xl mx-auto space-y-6">
      {/* 1. Regional Cultural Greeting Header */}
      <div
        className="w-full rounded-3xl p-6 shadow-lg border-3 text-white space-y-3 relative overflow-hidden transition-all duration-300"
        style={{
          backgroundColor: currentTheme.primary,
          borderColor: currentTheme.secondary || '#673D00',
        }}
      >
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full">
              📍 {userState} • {userLanguage}
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold">{currentTheme.greeting}</h2>
            <p className="text-lg opacity-90">{patientName}</p>
          </div>
          <button
            onClick={handleVoiceHelp}
            aria-label="Read Greeting"
            className="p-3 bg-white/20 hover:bg-white/30 rounded-2xl touch-target text-white"
          >
            <Volume2 className="w-8 h-8" />
          </button>
        </div>

        {/* State Cultural Motif Ribbon */}
        <div className="pt-2 border-t border-white/20 text-xs font-semibold flex items-center justify-between text-white/90">
          <span>{currentTheme.motifs.slice(0, 3).join(' ')}</span>
          <button
            onClick={() => navigate('/onboarding')}
            className="text-xs underline hover:text-white flex items-center gap-1 font-bold"
          >
            <MapPin className="w-3.5 h-3.5" /> Change Region
          </button>
        </div>
      </div>

      {/* 2. Today's Reminders Preview */}
      <section className="bg-white border-2 rounded-3xl p-5 shadow-md space-y-3" style={{ borderColor: currentTheme.primary }}>
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-[#1B1C19] flex items-center gap-2">
            🔔 {t.reminders}
          </h3>
          <button
            onClick={() => navigate('/reminders')}
            className="text-sm font-bold flex items-center gap-1 hover:underline"
            style={{ color: currentTheme.primary }}
          >
            {t.viewAll} <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {reminders.length > 0 ? (
          <div className="bg-[#FAF8F5] border border-[#E4E2DD] p-4 rounded-2xl flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold text-[#855000]">{reminders[0].time}</span>
              <p className="text-base font-bold text-[#1B1C19]">{reminders[0].title}</p>
            </div>
            <button
              onClick={() => toggleReminder(reminders[0].id)}
              className={`touch-target px-4 py-2 rounded-xl font-bold text-sm border-2 transition ${
                reminders[0].taken
                  ? 'bg-[#386A0E] text-white border-[#0C2000]'
                  : 'bg-white text-[#1B1C19] border-[#BA7517]'
              }`}
            >
              {reminders[0].taken ? 'Done ✓' : t.check}
            </button>
          </div>
        ) : (
          <p className="text-sm text-gray-500">No pending reminders.</p>
        )}
      </section>

      {/* 3. All 7 Cognitive Memory Games */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-extrabold text-[#1B1C19] flex items-center gap-2">
            🧠 Culturally Unified Cognitive Games (7 Titles)
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {GAMES_LIST.map((game) => (
            <div
              key={game.id}
              className={`p-5 rounded-2xl border-2 shadow-sm flex flex-col justify-between ${game.color}`}
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-4xl">{game.icon}</span>
                  <span className="text-xs font-bold bg-white/80 px-2.5 py-1 rounded-full border border-stone-200">
                    {game.state}
                  </span>
                </div>
                <h4 className="text-lg font-extrabold text-stone-900">{game.title}</h4>
                <p className="text-xs font-semibold text-stone-600 mt-1">Domain: {game.domain}</p>
              </div>

              <button
                onClick={() => navigate(game.path)}
                className={`mt-4 w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 shadow-sm transition ${game.btnBg}`}
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Play Game</span>
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
