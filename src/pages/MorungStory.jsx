import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { recordAndSync, speakText, handleVoiceCommand } from '../services/gameStorage';
import { ArrowLeft, Mic, MicOff, Volume2, BookmarkPlus, Sparkles, UserCheck, Play, ChevronDown, CheckCircle2 } from 'lucide-react';

const FOLK_TALES = [
  {
    id: 'ao_tiger_boy',
    title: 'The Brave Boy and the Tiger',
    tribe: 'Ao Naga Folk Tale',
    fullStoryNarration:
      'Long ago in a misty Naga village surrounded by high pine hills, a young boy named Temba met a wise elder tiger in the bamboo forest. The tiger did not growl. Instead, it lowered its head gently and looked into Temba’s eyes with deep wisdom.',
    promptQuestion: 'What did the tiger say to the brave boy to create friendship?',
    expectedKeywords: ['boy', 'friend', 'bamboo', 'help', 'path', 'share', 'peace', 'forest'],
    fullStoryConclusion:
      'The tiger smiled warmly and said: "Do not fear, brave boy. We share this forest together in peace and mutual respect."',
  },
  {
    id: 'angami_hornbill',
    title: 'The Golden Hornbill of Mount Japfu',
    tribe: 'Angami Folk Tale',
    fullStoryNarration:
      'High upon the misty summit of Mount Japfu, the great Golden Hornbill perched atop a tall pine tree. When the morning sun touched its feathers, it flew down to the village Morung and sang ancient songs of blessing.',
    promptQuestion: 'What sacred gift did the Hornbill bring to the Angami village?',
    expectedKeywords: ['gift', 'grain', 'feather', 'rain', 'song', 'peace', 'harvest', 'corn'],
    fullStoryConclusion:
      'The Hornbill dropped a sacred golden grain of corn into the elder’s hands, bringing bountiful harvests across the green valley.',
  },
  {
    id: 'konyak_drummer',
    title: 'The Great Log Drum of the Hills',
    tribe: 'Konyak Folk Tale',
    fullStoryNarration:
      'In the high mountain village of the Konyak warriors, the village chief carved a great log drum from a single ancient fallen oak. When the first storm clouds gathered, the villagers gathered to sound the drum across the valleys.',
    promptQuestion: 'What message did the log drum echo to the neighbouring hills?',
    expectedKeywords: ['peace', 'gather', 'rain', 'dance', 'welcome', 'friend', 'celebrate'],
    fullStoryConclusion:
      'The drum echoed: "Come together in celebration, for the rain brings life and food to all our families!"',
  },
  {
    id: 'sumi_fire_river',
    title: 'The Spirit of the Dzükou Brook',
    tribe: 'Sumi Folk Tale',
    fullStoryNarration:
      'During a cold winter twilight, a grandmother led the children beside the crystal waters of the Dzükou stream. A glowing river stone shone softly under the moonlight, radiating gentle warmth against the mountain frost.',
    promptQuestion: 'What did the children do with the warm glowing brook stone?',
    expectedKeywords: ['warm', 'hearth', 'fire', 'elder', 'home', 'care', 'blessing'],
    fullStoryConclusion:
      'The children placed the stone gently in the center of the Morung hearth to keep all the village elders warm through winter.',
  },
];

export function MorungStory() {
  const navigate = useNavigate();
  const { currentUser: user } = useApp();

  const [currentStoryIdx, setCurrentStoryIdx] = useState(0);
  const [gameState, setGameState] = useState('narrating'); // 'narrating' | 'question' | 'evaluating' | 'family_chapter'
  const [isListening, setIsListening] = useState(false);
  const [patientResponse, setPatientResponse] = useState('');
  const [elderFeedback, setElderFeedback] = useState('');
  const [familyStories, setFamilyStories] = useState([]);
  const [newFamilyStory, setNewFamilyStory] = useState('');
  const [promptCount, setPromptCount] = useState(0);

  const recognitionRef = useRef(null);
  const story = FOLK_TALES[currentStoryIdx];

  // Narration when story changes
  useEffect(() => {
    handlePlayFullStory();
  }, [currentStoryIdx]);

  const handlePlayFullStory = () => {
    setGameState('narrating');
    setElderFeedback('');
    setPatientResponse('');
    if (isListening) stopListening();

    speakText(
      `Here is a traditional Naga folk tale: ${story.title}. ${story.fullStoryNarration}`
    );
  };

  const handleAskCompletionPrompt = () => {
    setGameState('question');
    setElderFeedback('');
    speakText(`Now, can you complete the story? ${story.promptQuestion}`);
  };

  const startListening = () => {
    setIsListening(true);
    setPatientResponse('');
    recognitionRef.current = handleVoiceCommand(
      (spokenText) => {
        setIsListening(false);
        if (spokenText) {
          setPatientResponse(spokenText);
          evaluateResponse(spokenText);
        }
      },
      () => {
        setIsListening(false);
      }
    );
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch (err) {
        console.warn('Mic abort caught:', err);
      }
      recognitionRef.current = null;
    }
    setIsListening(false);
    speakText('Microphone muted.');
  };

  const evaluateResponse = (text) => {
    setGameState('evaluating');
    const lower = text.toLowerCase();
    const matched = story.expectedKeywords.some((kw) => lower.includes(kw));

    if (matched || text.length > 5) {
      setElderFeedback(`Elder's Warm Praise: "Ah, wonderful memory! ${story.fullStoryConclusion}"`);
      speakText(`Ah, wonderful memory! ${story.fullStoryConclusion}`);

      recordAndSync(user?.uid, 'naga-storytelling', {
        attempts: 1,
        timeTakenSeconds: 45,
        accuracy: 90,
        difficulty: 'adaptive',
      });
    } else {
      setPromptCount((prev) => prev + 1);
      if (promptCount >= 2) {
        setElderFeedback(`Elder's Narration: "${story.fullStoryConclusion}"`);
        speakText(story.fullStoryConclusion);
      } else {
        setElderFeedback('Elder: "That is close! Think of what a wise friend in the forest would say..."');
        speakText('That is close! Think of what a wise friend in the forest would say...');
      }
    }
  };

  const handleSaveFamilyChapter = () => {
    if (!newFamilyStory.trim()) return;
    const updated = [...familyStories, { text: newFamilyStory, date: new Date().toLocaleDateString() }];
    setFamilyStories(updated);
    setNewFamilyStory('');
    speakText('Your personal story chapter has been saved into your memory archive.');
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
          <span className="bg-red-100 text-red-900 text-sm px-3 py-1 rounded-full font-semibold border border-red-300">
            Nagaland Morung Story 🦅
          </span>
          <button
            onClick={() => speakText('Village Elder Storytelling. Listen to the tale first, then complete the story by voice.')}
            className="p-2 bg-red-700 text-white rounded-full hover:bg-red-800 transition shadow-sm"
          >
            <Volume2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* ── Top Story Dropdown Selector ── */}
      <div className="bg-white p-4 rounded-2xl border-2 border-red-900/20 shadow-sm mb-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">📜</span>
          <span className="text-xs md:text-sm font-bold text-stone-800 uppercase tracking-wide">
            Select Naga Folk Tale:
          </span>
        </div>
        <div className="relative w-full sm:w-80">
          <select
            value={currentStoryIdx}
            onChange={(e) => setCurrentStoryIdx(Number(e.target.value))}
            className="w-full bg-[#FAF6EE] text-amber-950 font-bold text-sm px-4 py-3 rounded-xl border-2 border-amber-900/30 focus:border-red-700 outline-none shadow-inner cursor-pointer"
          >
            {FOLK_TALES.map((item, idx) => (
              <option key={item.id} value={idx}>
                {item.title} ({item.tribe})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Morung Longhouse Container */}
      <div className="bg-white rounded-3xl p-6 shadow-md border-2 border-red-900/10 space-y-6">
        
        {/* Animated Village Elder Scene & Story Card */}
        <div className="bg-[#4E2A1E] text-amber-50 p-6 md:p-8 rounded-3xl border-4 border-amber-900/40 shadow-xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-center gap-6">
            
            {/* Elder Character Avatar */}
            <div className="w-28 h-28 md:w-36 md:h-36 rounded-full bg-amber-900/90 border-4 border-amber-500/60 flex items-center justify-center text-5xl md:text-6xl shadow-inner shrink-0 relative">
              <span>🧙‍♂️</span>
              <div className="absolute -bottom-2 bg-amber-600 text-[11px] text-white px-2.5 py-0.5 rounded-full font-bold shadow">
                Naga Elder
              </div>
            </div>

            {/* Story Content Box */}
            <div className="flex-1 text-center md:text-left space-y-2">
              <div className="inline-block bg-amber-900/80 text-amber-200 text-xs px-3 py-1 rounded-full font-semibold">
                {story.tribe}
              </div>
              <h2 className="text-xl md:text-2xl font-extrabold text-amber-100">{story.title}</h2>
              
              {/* Part 1: Full Story Narration */}
              <div className="p-4 bg-amber-950/60 rounded-2xl border border-amber-800/40">
                <p className="text-amber-100/95 leading-relaxed text-base md:text-lg italic font-serif">
                  "{story.fullStoryNarration}"
                </p>
              </div>

              {/* Part 2: Question Prompt (Ask Player to Complete) */}
              {gameState !== 'narrating' && (
                <div className="mt-3 p-4 bg-red-950/80 rounded-2xl border-2 border-amber-500 text-amber-200 font-bold text-base md:text-lg animate-fade-in shadow-md">
                  ❓ <span className="underline">Elder's Question:</span> {story.promptQuestion}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Feedback Display */}
        {elderFeedback && (
          <div className="bg-amber-50 border-2 border-amber-300 p-5 rounded-2xl text-amber-950 font-bold text-base shadow-sm">
            {elderFeedback}
          </div>
        )}

        {/* ── Microphone Interaction & Mute Toggle ── */}
        <div className="bg-[#FAF6EE] p-6 rounded-3xl border-2 border-amber-900/20 text-center space-y-4">
          <p className="text-sm font-bold text-[#4A3728] uppercase">
            {isListening ? '🔴 Recording your voice… Speak now or tap to Mute!' : 'Tap Microphone to Speak & Complete the Tale:'}
          </p>

          <div className="flex justify-center items-center gap-4">
            {!isListening ? (
              <button
                onClick={startListening}
                className="w-20 h-20 rounded-full bg-red-700 hover:bg-red-800 text-white flex items-center justify-center shadow-lg transition transform active:scale-95 border-3 border-red-900"
                title="Start Recording"
              >
                <Mic className="w-9 h-9" />
              </button>
            ) : (
              <button
                onClick={stopListening}
                className="w-20 h-20 rounded-full bg-stone-900 hover:bg-black text-white flex items-center justify-center shadow-2xl transition transform active:scale-95 ring-8 ring-red-400 animate-pulse border-3 border-red-600"
                title="Mute / Stop Mic"
              >
                <MicOff className="w-9 h-9 text-red-400" />
              </button>
            )}
          </div>

          <p className="text-xs font-semibold text-stone-500">
            {isListening ? 'Tap the dark microphone icon anytime to mute/stop.' : 'Microphone is standby.'}
          </p>

          {patientResponse && (
            <div className="bg-white p-3 rounded-xl border border-stone-300 text-stone-800 font-medium italic text-sm">
              Your response: "{patientResponse}"
            </div>
          )}
        </div>

        {/* Action Flow Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-stone-200">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePlayFullStory}
              className="bg-amber-700 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-amber-800 shadow-sm transition flex items-center gap-1.5 text-sm"
            >
              <Play className="w-4 h-4 fill-current" /> Re-listen to Tale
            </button>

            <button
              onClick={handleAskCompletionPrompt}
              className="bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-emerald-800 shadow-sm transition text-sm"
            >
              Ask Me to Complete ❓
            </button>
          </div>

          <button
            onClick={() => setGameState(gameState === 'family_chapter' ? 'narrating' : 'family_chapter')}
            className="flex items-center space-x-2 bg-red-800 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-red-900 shadow-sm transition text-sm"
          >
            <BookmarkPlus className="w-4 h-4" />
            <span>Family Memory Archive</span>
          </button>
        </div>

        {/* Family Story Archive Module */}
        {gameState === 'family_chapter' && (
          <div className="p-6 bg-red-50 rounded-3xl border-2 border-red-200 space-y-4">
            <h3 className="text-lg font-bold text-red-950 flex items-center gap-2">
              <BookmarkPlus className="w-5 h-5 text-red-700" />
              <span>Personal Family Memory Archive</span>
            </h3>
            <p className="text-xs text-red-900/80">
              Preserve your own fond stories and family memories for your children and grandchildren.
            </p>

            <textarea
              value={newFamilyStory}
              onChange={(e) => setNewFamilyStory(e.target.value)}
              placeholder="Type or dictate your personal family memory here..."
              className="w-full p-4 rounded-xl border border-red-300 text-stone-800 text-sm focus:ring-2 ring-red-500 outline-none bg-white"
              rows={3}
            />

            <button
              onClick={handleSaveFamilyChapter}
              className="bg-red-800 text-white text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-red-900 transition"
            >
              Save Chapter to Family Archive
            </button>

            {familyStories.length > 0 && (
              <div className="space-y-2 pt-2">
                <p className="text-xs font-bold text-red-900 uppercase">Saved Family Chapters:</p>
                {familyStories.map((item, idx) => (
                  <div key={idx} className="bg-white p-3 rounded-lg border border-red-200 text-xs text-stone-700">
                    <span className="font-bold text-red-800">Chapter {idx + 1} ({item.date}):</span> "{item.text}"
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

