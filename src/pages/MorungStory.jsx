import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { recordAndSync, speakText, handleVoiceCommand } from '../services/gameStorage';
import { ArrowLeft, Mic, MicOff, Volume2, BookmarkPlus, Play } from 'lucide-react';

const FOLK_TALES = [
  {
    id: 'ao_tiger_boy',
    title: 'The Brave Boy and the Tiger',
    tribe: 'Ao Naga Folk Tale',
    fullStoryNarration:
      'Long ago in a Naga village surrounded by high pine hills, a young boy named Temba met an elder tiger in the bamboo forest. The tiger did not growl. Instead, it lowered its head gently and looked into Temba’s eyes with calm wisdom.',
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
      'High upon the summit of Mount Japfu, the great Golden Hornbill perched atop a tall pine tree. When the morning sun touched its feathers, it flew down to the village Morung and sang ancient songs of blessing.',
    promptQuestion: 'What gift did the Hornbill bring to the Angami village?',
    expectedKeywords: ['gift', 'grain', 'feather', 'rain', 'song', 'peace', 'harvest', 'corn'],
    fullStoryConclusion:
      'The Hornbill dropped a golden grain of corn into the elder’s hands, bringing bountiful harvests across the green valley.',
  },
  {
    id: 'konyak_drummer',
    title: 'The Great Log Drum of the Hills',
    tribe: 'Konyak Folk Tale',
    fullStoryNarration:
      'In the mountain village of the Konyak tribe, the village chief carved a great log drum from a single ancient fallen oak. When the first storm clouds gathered, the villagers gathered to sound the drum across the valleys.',
    promptQuestion: 'What message did the log drum echo to the neighbouring hills?',
    expectedKeywords: ['peace', 'gather', 'rain', 'dance', 'welcome', 'friend', 'celebrate'],
    fullStoryConclusion:
      'The drum echoed: "Come together in celebration, for the rain brings life and food to all our families!"',
  },
  {
    id: 'sumi_fire_river',
    title: 'The Spirit of the Dzukou Brook',
    tribe: 'Sumi Folk Tale',
    fullStoryNarration:
      'During a cold winter twilight, a grandmother led the children beside the clear waters of the Dzukou stream. A warm river stone shone under the moonlight, radiating gentle heat against the mountain frost.',
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
  const [gameState, setGameState] = useState('narrating');
  const [isListening, setIsListening] = useState(false);
  const [patientResponse, setPatientResponse] = useState('');
  const [elderFeedback, setElderFeedback] = useState('');
  const [familyStories, setFamilyStories] = useState([]);
  const [newFamilyStory, setNewFamilyStory] = useState('');
  const [promptCount, setPromptCount] = useState(0);

  const recognitionRef = useRef(null);
  const story = FOLK_TALES[currentStoryIdx];

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
      setElderFeedback(`Elder Feedback: "Wonderful memory! ${story.fullStoryConclusion}"`);
      speakText(`Wonderful memory! ${story.fullStoryConclusion}`);

      recordAndSync(user?.uid, 'naga-storytelling', {
        attempts: 1,
        timeTakenSeconds: 45,
        accuracy: 90,
        difficulty: 'adaptive',
      });
    } else {
      setPromptCount((prev) => prev + 1);
      if (promptCount >= 2) {
        setElderFeedback(`Elder Narration: "${story.fullStoryConclusion}"`);
        speakText(story.fullStoryConclusion);
      } else {
        setElderFeedback('Elder: "That is close. Think of what a wise friend in the forest would say..."');
        speakText('That is close. Think of what a wise friend in the forest would say.');
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
            Nagaland Morung Story
          </span>
          <button
            onClick={() => speakText('Village Elder Storytelling. Listen to the tale first, then complete the story by voice.')}
            className="h-16 px-6 bg-[#0B3C5D] hover:bg-[#08283E] text-white font-bold rounded-lg border-2 border-[#0B3C5D] flex items-center gap-2 cursor-pointer"
          >
            <Volume2 className="w-6 h-6" />
            <span>Read Aloud</span>
          </button>
        </div>
      </div>

      {/* Story Dropdown Selector */}
      <div className="bg-[#F9F9F9] p-4 rounded-lg border-2 border-[#1A1A1A] space-y-2">
        <label className="block text-sm font-bold text-[#1A1A1A]">Select Folk Story to Read:</label>
        <select
          value={currentStoryIdx}
          onChange={(e) => setCurrentStoryIdx(Number(e.target.value))}
          className="w-full bg-[#FFFFFF] text-[#1A1A1A] font-bold text-base px-4 py-3 rounded-lg border-2 border-[#1A1A1A] cursor-pointer"
        >
          {FOLK_TALES.map((item, idx) => (
            <option key={item.id} value={idx}>
              {item.title} ({item.tribe})
            </option>
          ))}
        </select>
      </div>

      {/* Main Container */}
      <div className="bg-[#FFFFFF] border-2 border-[#1A1A1A] rounded-lg p-6 space-y-6">
        <div className="space-y-2">
          <span className="inline-block bg-[#F9F9F9] border border-[#1A1A1A] text-xs font-bold px-3 py-1 rounded text-[#1A1A1A]">
            {story.tribe}
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1A1A1A]">{story.title}</h1>
          <p className="text-lg text-[#1A1A1A] leading-relaxed border-l-4 border-[#0B3C5D] pl-4 py-1">
            "{story.fullStoryNarration}"
          </p>
        </div>

        {/* Question Prompt */}
        {gameState !== 'narrating' && (
          <div className="p-4 bg-[#F9F9F9] rounded-lg border-2 border-[#0B3C5D] space-y-1">
            <span className="text-xs font-bold uppercase text-[#0B3C5D]">Story Question:</span>
            <p className="text-xl font-bold text-[#1A1A1A]">{story.promptQuestion}</p>
          </div>
        )}

        {/* Feedback Display */}
        {elderFeedback && (
          <div className="bg-[#F9F9F9] border-2 border-[#1D6F42] p-4 rounded-lg font-bold text-base text-[#1A1A1A]">
            {elderFeedback}
          </div>
        )}

        {/* Microphone Interaction */}
        <div className="bg-[#F9F9F9] border-2 border-[#1A1A1A] p-6 rounded-lg space-y-4">
          <p className="text-base font-bold text-[#1A1A1A]">
            {isListening ? 'Microphone is active. Speak your answer now:' : 'Tap the microphone button to answer by voice:'}
          </p>

          <div className="flex flex-wrap items-center gap-4">
            {!isListening ? (
              <button
                onClick={startListening}
                className="h-16 px-8 bg-[#0B3C5D] hover:bg-[#08283E] text-white font-bold text-lg rounded-lg border-2 border-[#0B3C5D] flex items-center gap-3 cursor-pointer"
              >
                <Mic className="w-6 h-6" />
                <span>Start Speaking</span>
              </button>
            ) : (
              <button
                onClick={stopListening}
                className="h-16 px-8 bg-[#802A0B] hover:bg-[#5C1D06] text-white font-bold text-lg rounded-lg border-2 border-[#802A0B] flex items-center gap-3 cursor-pointer"
              >
                <MicOff className="w-6 h-6" />
                <span>Mute / Stop Microphone</span>
              </button>
            )}

            <button
              onClick={handleAskCompletionPrompt}
              className="h-16 px-6 bg-[#FFFFFF] hover:bg-[#F9F9F9] text-[#1A1A1A] font-bold text-base rounded-lg border-2 border-[#1A1A1A] cursor-pointer"
            >
              Ask Question Prompt
            </button>
          </div>

          {patientResponse && (
            <div className="bg-[#FFFFFF] p-3 rounded-lg border-2 border-[#CCCCCC] text-[#1A1A1A] font-medium text-base">
              Recorded response: "{patientResponse}"
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t-2 border-[#1A1A1A]">
          <button
            onClick={handlePlayFullStory}
            className="h-16 px-6 bg-[#0B3C5D] hover:bg-[#08283E] text-white font-bold text-base rounded-lg border-2 border-[#0B3C5D] flex items-center gap-2 cursor-pointer"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>Re-listen to Tale</span>
          </button>

          <button
            onClick={() => setGameState(gameState === 'family_chapter' ? 'narrating' : 'family_chapter')}
            className="h-16 px-6 bg-[#FFFFFF] hover:bg-[#F9F9F9] text-[#1A1A1A] font-bold text-base rounded-lg border-2 border-[#1A1A1A] flex items-center gap-2 cursor-pointer"
          >
            <BookmarkPlus className="w-5 h-5 text-[#0B3C5D]" />
            <span>Family Memory Archive</span>
          </button>
        </div>

        {/* Family Archive */}
        {gameState === 'family_chapter' && (
          <div className="bg-[#F9F9F9] border-2 border-[#1A1A1A] p-6 rounded-lg space-y-4">
            <h2 className="text-xl font-bold text-[#1A1A1A]">Personal Family Memory Archive</h2>
            <p className="text-sm text-[#333333]">
              Type or dictate personal family stories and memories to preserve them.
            </p>
            <textarea
              value={newFamilyStory}
              onChange={(e) => setNewFamilyStory(e.target.value)}
              placeholder="Enter your personal memory or story here..."
              className="w-full p-4 rounded-lg border-2 border-[#1A1A1A] text-[#1A1A1A] text-base bg-[#FFFFFF]"
              rows={3}
            />
            <button
              onClick={handleSaveFamilyChapter}
              className="h-16 px-6 bg-[#0B3C5D] hover:bg-[#08283E] text-white font-bold text-base rounded-lg border-2 border-[#0B3C5D] cursor-pointer"
            >
              Save Story to Archive
            </button>

            {familyStories.length > 0 && (
              <div className="space-y-2 pt-2">
                <p className="text-sm font-bold text-[#1A1A1A]">Saved Stories:</p>
                {familyStories.map((item, idx) => (
                  <div key={idx} className="bg-[#FFFFFF] p-3 rounded-lg border-2 border-[#CCCCCC] text-sm text-[#1A1A1A]">
                    <span className="font-bold">Story {idx + 1} ({item.date}):</span> "{item.text}"
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
