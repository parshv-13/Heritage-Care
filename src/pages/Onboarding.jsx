import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { REGIONAL_THEMES } from '../config/regionalThemes';
import { MapPin, Globe, User, Shield, ArrowRight, Volume2 } from 'lucide-react';
import { speakText } from '../services/gameStorage';

export const Onboarding = () => {
  const navigate = useNavigate();
  const { saveUserOnboardingDetails, patientName: existingName } = useApp();

  const [name, setName] = useState(existingName || 'Grandma Kangkan');
  const [selectedState, setSelectedState] = useState('Assam');
  const [selectedLang, setSelectedLang] = useState('English');
  const [caregiverName, setCaregiverName] = useState('');
  const [caregiverPhone, setCaregiverPhone] = useState('');

  const states = Object.keys(REGIONAL_THEMES);
  const languages = [
    { id: 'English', label: 'English' },
    { id: 'Hindi', label: 'हिंदी (Hindi)' },
    { id: 'Local', label: `Local (${REGIONAL_THEMES[selectedState]?.localLang || 'Regional'})` }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    speakText(`Setup complete for ${name} from ${selectedState}. Enjoy your memory care games.`);
    saveUserOnboardingDetails({
      name,
      state: selectedState,
      language: selectedLang,
      caregiverName,
      caregiverPhone
    });
    navigate('/home');
  };

  const theme = REGIONAL_THEMES[selectedState];

  return (
    <div className="min-h-screen bg-[#F9F7F2] py-8 px-4 flex flex-col justify-center items-center max-w-md mx-auto space-y-6">
      {/* Top Banner */}
      <div className="w-full text-center space-y-2">
        <div 
          className="w-20 h-20 rounded-full mx-auto flex items-center justify-center text-4xl shadow-lg border-4 border-white transition-all duration-300"
          style={{ backgroundColor: theme.primary }}
        >
          🌺
        </div>
        <h1 className="text-3xl font-bold text-[#1B1C19]">Welcome to Heritage Care</h1>
        <p className="text-base font-semibold text-[#524436]">
          Let's customize the app for your home state & language
        </p>
      </div>

      {/* Onboarding Form Card */}
      <form 
        onSubmit={handleSubmit}
        className="w-full bg-white border-3 rounded-3xl p-6 shadow-xl space-y-6 transition-all duration-300"
        style={{ borderColor: theme.primary }}
      >
        <div className="flex items-center justify-between border-b-2 border-[#E4E2DD] pb-3">
          <h2 className="text-2xl font-bold text-[#1B1C19]">Patient Profile</h2>
          <button 
            type="button"
            onClick={() => speakText("Please select your name, home state in North East India, and your preferred language.")}
            className="p-2 rounded-xl touch-target text-white"
            style={{ backgroundColor: theme.primary }}
            aria-label="Read Instructions"
          >
            <Volume2 className="w-6 h-6" />
          </button>
        </div>

        {/* 1. Patient Name */}
        <div className="space-y-2">
          <label className="block text-lg font-bold text-[#1B1C19] flex items-center gap-2">
            <User className="w-5 h-5" style={{ color: theme.primary }} /> Patient / Elder Name
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Grandma Kangkan / Grandpa Baruah"
            className="w-full p-4 rounded-xl border-2 text-lg font-bold text-[#1B1C19] bg-white focus:outline-none focus:ring-4"
            style={{ borderColor: theme.primary }}
          />
        </div>

        {/* 2. Select North East State (Changes Theme Colors & Border Motifs) */}
        <div className="space-y-2">
          <label className="block text-lg font-bold text-[#1B1C19] flex items-center gap-2">
            <MapPin className="w-5 h-5" style={{ color: theme.primary }} /> Where do you live? (North East State)
          </label>
          <div className="grid grid-cols-2 gap-2">
            {states.map((st) => {
              const isSel = selectedState === st;
              const stTheme = REGIONAL_THEMES[st];
              return (
                <button
                  key={st}
                  type="button"
                  onClick={() => {
                    setSelectedState(st);
                    speakText(`Selected state ${st}`);
                  }}
                  className={`touch-target p-3 rounded-2xl font-bold text-base border-2 text-left transition flex flex-col justify-between ${
                    isSel
                      ? 'text-white shadow-md scale-105'
                      : 'bg-[#F0EEE9] text-[#1B1C19] border-[#857464] hover:bg-white'
                  }`}
                  style={{
                    backgroundColor: isSel ? stTheme.primary : undefined,
                    borderColor: isSel ? stTheme.primary : undefined
                  }}
                >
                  <span className="text-lg">{st}</span>
                  <span className="text-xs opacity-90">{stTheme.localLang.split('/')[0]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Regional Preview Banner */}
        <div 
          className="p-4 rounded-2xl border-2 space-y-1 text-sm font-semibold"
          style={{ backgroundColor: `${theme.primary}15`, borderColor: theme.primary, color: theme.primary }}
        >
          <p className="font-bold text-base">🎨 Regional Theme Applied: {theme.name}</p>
          <p>Border Motif: {theme.motifs.join(' ')}</p>
          <p>Local Greeting: "{theme.greeting}"</p>
        </div>

        {/* 3. Preferred Language */}
        <div className="space-y-2">
          <label className="block text-lg font-bold text-[#1B1C19] flex items-center gap-2">
            <Globe className="w-5 h-5" style={{ color: theme.primary }} /> App Interface Language
          </label>
          <div className="grid grid-cols-3 gap-2">
            {languages.map((lang) => {
              const isSel = selectedLang === lang.id;
              return (
                <button
                  key={lang.id}
                  type="button"
                  onClick={() => {
                    setSelectedLang(lang.id);
                    speakText(`Language set to ${lang.label}`);
                  }}
                  className={`touch-target p-3 rounded-xl font-bold text-sm border-2 text-center transition ${
                    isSel
                      ? 'text-white shadow-md'
                      : 'bg-white text-[#1B1C19] border-[#857464]'
                  }`}
                  style={{
                    backgroundColor: isSel ? theme.primary : undefined,
                    borderColor: isSel ? theme.primary : undefined
                  }}
                >
                  {lang.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Caregiver Contact (Optional) */}
        <div className="space-y-3 pt-2 border-t-2 border-[#E4E2DD]">
          <label className="block text-base font-bold text-[#855000]">
            👨‍💼 Primary Caregiver Contact (Optional)
          </label>
          <input
            type="text"
            value={caregiverName}
            onChange={(e) => setCaregiverName(e.target.value)}
            placeholder="Caregiver / Doctor Name"
            className="w-full p-3 rounded-xl border border-[#857464] text-base font-medium"
          />
          <input
            type="tel"
            value={caregiverPhone}
            onChange={(e) => setCaregiverPhone(e.target.value)}
            placeholder="Caregiver Phone Number (+91...)"
            className="w-full p-3 rounded-xl border border-[#857464] text-base font-medium"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full touch-target text-white font-bold text-2xl py-4 rounded-2xl shadow-lg flex items-center justify-center gap-3 transition"
          style={{ backgroundColor: theme.primary }}
        >
          Save & Enter App <ArrowRight className="w-7 h-7" />
        </button>
      </form>
    </div>
  );
};
