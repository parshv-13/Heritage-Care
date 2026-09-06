import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Volume2, ArrowRight, Play, MapPin, CheckCircle2, Clock } from 'lucide-react';
import { speakText } from '../services/gameStorage';

const GAMES_LIST = [
  {
    id: 'khasi-loom',
    title: 'Khasi Jainsem Loom Weave',
    state: 'Meghalaya',
    domain: 'Visual Pattern Memory',
    path: '/game/khasi-loom',
    description: 'Memorize the geometric fabric weave pattern and recreate it accurately on the loom.',
  },
  {
    id: 'cheraw-rhythm',
    title: 'Cheraw Bamboo Rhythm Tap',
    state: 'Mizoram',
    domain: 'Divided Attention & Motor Timing',
    path: '/game/cheraw-rhythm',
    description: 'Step into the open bamboo grid in harmony with the traditional tempo.',
  },
  {
    id: 'morung-story',
    title: 'Village Elder Morung Storytelling',
    state: 'Nagaland',
    domain: 'Voice Reminiscence & Semantic Recall',
    path: '/game/morung-story',
    description: 'Listen to folklore narrations and complete traditional stories using your voice.',
  },
  {
    id: 'wangala-drums',
    title: 'Wangala 100-Drums Echo',
    state: 'Meghalaya Garo',
    domain: 'Auditory Sequential Memory',
    path: '/game/wangala-drums',
    description: 'Listen to the drumbeat sequence and tap back each rhythm in exact order.',
  },
  {
    id: 'kitchen-master',
    title: 'Traditional Kitchen Master',
    state: 'Assam & North East',
    domain: 'Procedural Cooking Recall',
    path: '/game/kitchen-master',
    description: 'Arrange traditional culinary steps in proper order from preparation to serving.',
  },
  {
    id: 'monastery-walk',
    title: 'Monastery Prayer Wheel Walk',
    state: 'Arunachal & Sikkim',
    domain: 'Calming Low-Stimulation',
    path: '/game/monastery-walk',
    description: 'Tranquil mountain walking simulation with prayer wheel resonance for relaxation.',
  },
  {
    id: 'kaziranga-recall',
    title: 'Kaziranga Grassland Recall',
    state: 'Assam Kaziranga',
    domain: 'Visual Detail & Spot-the-Change',
    path: '/game/kaziranga-recall',
    description: 'Observe native wildlife in grassland habitat and identify which animal departed.',
  },
];

export const Home = () => {
  const navigate = useNavigate();
  const { currentTheme, t, patientName, reminders, toggleReminder, userState, userLanguage } = useApp();

  const handleVoiceHelp = () => {
    speakText(`Hello ${patientName}. Welcome to your memory care platform. ${currentTheme.greeting}`);
  };

  return (
    <div className="bg-[#FFFFFF] pb-32 pt-8 px-4 max-w-4xl mx-auto space-y-8 text-left">
      {/* 1. Header Profile Banner */}
      <section className="bg-[#F9F9F9] border-2 border-[#1A1A1A] rounded-lg p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="inline-block text-xs font-bold uppercase tracking-wider bg-[#FFFFFF] border-2 border-[#1A1A1A] px-3 py-1 rounded-md text-[#1A1A1A]">
              Region: {userState} • Language: {userLanguage}
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1A1A1A]">
              {currentTheme.greeting}
            </h1>
            <p className="text-lg text-[#333333] font-semibold">
              Patient: {patientName}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleVoiceHelp}
              aria-label="Read Greeting Aloud"
              className="h-16 px-6 bg-[#0B3C5D] hover:bg-[#08283E] text-white font-bold rounded-lg flex items-center gap-2 border-2 border-[#0B3C5D] cursor-pointer"
            >
              <Volume2 className="w-6 h-6" />
              <span className="text-base">Read Aloud</span>
            </button>
            <button
              onClick={() => navigate('/onboarding')}
              className="h-16 px-4 bg-[#FFFFFF] hover:bg-[#F9F9F9] text-[#1A1A1A] font-bold rounded-lg flex items-center gap-2 border-2 border-[#1A1A1A] cursor-pointer"
            >
              <MapPin className="w-5 h-5 text-[#0B3C5D]" />
              <span className="text-sm">Change Region</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. Today's Reminders Banner */}
      <section className="bg-[#FFFFFF] border-2 border-[#1A1A1A] rounded-lg p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-[#1A1A1A] flex items-center gap-2">
            <Clock className="w-6 h-6 text-[#0B3C5D]" />
            <span>Today's Priority Reminders</span>
          </h2>
          <button
            onClick={() => navigate('/reminders')}
            className="text-base font-bold text-[#0B3C5D] underline flex items-center gap-1 hover:text-[#08283E] cursor-pointer"
          >
            <span>View All Reminders</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {reminders.length > 0 ? (
          <div className="bg-[#F9F9F9] border-2 border-[#CCCCCC] p-4 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-sm font-bold text-[#0B3C5D]">{reminders[0].time}</span>
              <p className="text-lg font-bold text-[#1A1A1A]">{reminders[0].title}</p>
              <span className="inline-block text-xs font-semibold px-2 py-0.5 rounded border border-[#CCCCCC] bg-[#FFFFFF] text-[#333333]">
                Category: {reminders[0].category}
              </span>
            </div>
            <button
              onClick={() => toggleReminder(reminders[0].id)}
              className={`h-16 px-6 rounded-lg font-bold text-base border-2 cursor-pointer flex items-center justify-center gap-2 ${
                reminders[0].taken
                  ? 'bg-[#1D6F42] text-white border-[#1D6F42]'
                  : 'bg-[#0B3C5D] text-white border-[#0B3C5D] hover:bg-[#08283E]'
              }`}
            >
              {reminders[0].taken ? (
                <>
                  <CheckCircle2 className="w-6 h-6" />
                  <span>Completed</span>
                </>
              ) : (
                <span>Mark as Done</span>
              )}
            </button>
          </div>
        ) : (
          <p className="text-base text-[#333333]">No pending reminders scheduled for today.</p>
        )}
      </section>

      {/* 3. All 7 Cognitive Memory Games */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-[#1A1A1A]">
            Cognitive Memory & Activity Games
          </h2>
          <p className="text-base text-[#333333] mt-1">
            Clinical activities adapted with North East cultural anchors. Zero failure pressure.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {GAMES_LIST.map((game) => (
            <div
              key={game.id}
              className="bg-[#FFFFFF] border-2 border-[#1A1A1A] rounded-lg p-6 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider bg-[#F9F9F9] border border-[#CCCCCC] px-3 py-1 rounded text-[#1A1A1A]">
                    {game.state}
                  </span>
                  <span className="text-xs font-bold text-[#0B3C5D]">
                    {game.domain}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-[#1A1A1A]">
                  {game.title}
                </h3>
                <p className="text-base text-[#333333] leading-normal">
                  {game.description}
                </p>
              </div>

              <button
                onClick={() => navigate(game.path)}
                className="w-full h-16 bg-[#0B3C5D] hover:bg-[#08283E] text-white font-bold text-lg rounded-lg border-2 border-[#0B3C5D] flex items-center justify-center gap-3 cursor-pointer"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>Launch {game.title}</span>
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
