import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { REGIONAL_THEMES } from '../config/regionalThemes';
import { ArrowRight, Volume2 } from 'lucide-react';
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
    { id: 'Hindi', label: 'Hindi (हिंदी)' },
    { id: 'Local', label: `Local (${REGIONAL_THEMES[selectedState]?.localLang || 'Regional'})` }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    speakText(`Setup complete for ${name} from ${selectedState}.`);
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
    <div className="min-h-screen bg-[#FFFFFF] py-8 px-4 flex flex-col justify-center items-center max-w-xl mx-auto space-y-6 text-left">
      {/* Top Banner */}
      <div className="w-full space-y-2 border-b-2 border-[#1A1A1A] pb-4">
        <h1 className="text-3xl font-bold text-[#1A1A1A]">Welcome to Heritage Care</h1>
        <p className="text-base font-semibold text-[#333333]">
          Customize regional anchors and language for your home state
        </p>
      </div>

      {/* Onboarding Form Card */}
      <form
        onSubmit={handleSubmit}
        className="w-full bg-[#FFFFFF] border-2 border-[#1A1A1A] rounded-lg p-6 space-y-6"
      >
        <div className="flex items-center justify-between border-b-2 border-[#1A1A1A] pb-3">
          <h2 className="text-2xl font-bold text-[#1A1A1A]">Patient Profile Configuration</h2>
          <button
            type="button"
            onClick={() => speakText("Please select your name, home state in North East India, and your preferred language.")}
            className="h-16 px-4 bg-[#FFFFFF] hover:bg-[#F9F9F9] border-2 border-[#1A1A1A] text-[#1A1A1A] rounded-lg font-bold flex items-center gap-2 cursor-pointer"
          >
            <Volume2 className="w-6 h-6" />
            <span className="text-sm">Read Instructions</span>
          </button>
        </div>

        {/* 1. Patient Name */}
        <div className="space-y-2">
          <label className="block text-base font-bold text-[#1A1A1A]">
            Patient / Senior Name:
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Grandma Kangkan / Grandpa Baruah"
            className="w-full p-4 rounded-lg border-2 border-[#1A1A1A] text-base font-bold text-[#1A1A1A] bg-[#FFFFFF]"
          />
        </div>

        {/* 2. Select North East State */}
        <div className="space-y-2">
          <label className="block text-base font-bold text-[#1A1A1A]">
            Select Home State (North East India):
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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
                  className={`h-16 px-4 rounded-lg font-bold text-sm border-2 text-left flex items-center justify-between cursor-pointer ${
                    isSel
                      ? 'bg-[#0B3C5D] text-white border-[#0B3C5D]'
                      : 'bg-[#FFFFFF] text-[#1A1A1A] border-[#CCCCCC] hover:bg-[#F9F9F9]'
                  }`}
                >
                  <span className="text-base">{st}</span>
                  <span className="text-xs opacity-80">{stTheme.localLang.split('/')[0]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Regional Preview */}
        <div className="p-4 rounded-lg border-2 border-[#1A1A1A] bg-[#F9F9F9] space-y-1 text-sm">
          <p className="font-bold text-[#1A1A1A]">Active Region: {theme.name}</p>
          <p className="text-[#333333]">Cultural Greeting: "{theme.greeting}"</p>
        </div>

        {/* 3. Preferred Language */}
        <div className="space-y-2">
          <label className="block text-base font-bold text-[#1A1A1A]">
            App Interface Language:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
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
                  className={`h-16 px-4 rounded-lg font-bold text-sm border-2 text-center cursor-pointer ${
                    isSel
                      ? 'bg-[#0B3C5D] text-white border-[#0B3C5D]'
                      : 'bg-[#FFFFFF] text-[#1A1A1A] border-[#CCCCCC] hover:bg-[#F9F9F9]'
                  }`}
                >
                  {lang.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Caregiver Contact */}
        <div className="space-y-3 pt-4 border-t-2 border-[#1A1A1A]">
          <label className="block text-base font-bold text-[#1A1A1A]">
            Primary Caregiver Contact Details (Optional):
          </label>
          <input
            type="text"
            value={caregiverName}
            onChange={(e) => setCaregiverName(e.target.value)}
            placeholder="Caregiver / Doctor Full Name"
            className="w-full p-4 rounded-lg border-2 border-[#1A1A1A] text-base font-bold text-[#1A1A1A] bg-[#FFFFFF]"
          />
          <input
            type="tel"
            value={caregiverPhone}
            onChange={(e) => setCaregiverPhone(e.target.value)}
            placeholder="Caregiver Phone Number (+91...)"
            className="w-full p-4 rounded-lg border-2 border-[#1A1A1A] text-base font-bold text-[#1A1A1A] bg-[#FFFFFF]"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full h-16 bg-[#0B3C5D] hover:bg-[#08283E] text-white font-bold text-lg rounded-lg border-2 border-[#0B3C5D] flex items-center justify-center gap-3 cursor-pointer"
        >
          <span>Save Profile & Enter Platform</span>
          <ArrowRight className="w-6 h-6" />
        </button>
      </form>
    </div>
  );
};
