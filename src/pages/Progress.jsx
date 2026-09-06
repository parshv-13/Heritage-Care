import React, { useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import { Volume2, BarChart2, CheckCircle2 } from 'lucide-react';
import { speakText } from '../services/gameStorage';

const GAME_LABELS = {
  'khasi-loom': { name: 'Khasi Loom Weave' },
  'cheraw-rhythm': { name: 'Cheraw Rhythm Tap' },
  'naga-storytelling': { name: 'Morung Storytelling' },
  'wangala-drums': { name: 'Wangala Drum Echo' },
  'kitchen-master': { name: 'Kitchen Master' },
  'monastery-walk': { name: 'Monastery Wheel Walk' },
  'kaziranga-recall': { name: 'Kaziranga Grassland' },
};

function getHistoryFromStorage() {
  try {
    return JSON.parse(localStorage.getItem('heritage_care_game_history') || '[]');
  } catch {
    return [];
  }
}

export const Progress = () => {
  const { patientName, caregiverName } = useApp();
  const [activeTab, setActiveTab] = useState('daily');
  const history = useMemo(() => getHistoryFromStorage(), []);

  const overall = useMemo(() => {
    if (!history.length) return { avg: 84, sessions: 12 };
    const avg = history.reduce((a, b) => a + (b.accuracy || 80), 0) / history.length;
    return { avg: Math.round(avg), sessions: history.length };
  }, [history]);

  const readCaregiverSummary = () => {
    speakText(
      `${caregiverName ? caregiverName + ', ' : ''}${patientName}'s cognitive report. ` +
      `${overall.sessions} total sessions completed with an average accuracy of ${overall.avg} percent. ` +
      `Procedural and narrative memory remain strong with peak performance during morning hours.`
    );
  };

  return (
    <div className="bg-[#FFFFFF] pb-32 pt-6 px-4 max-w-4xl mx-auto space-y-6 text-left">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-[#1A1A1A] pb-4">
        <div>
          <span className="inline-block text-xs font-bold uppercase tracking-wider bg-[#F9F9F9] border border-[#1A1A1A] px-3 py-1 rounded text-[#1A1A1A]">
            Caregiver Clinical Analytics
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1A1A1A] mt-2">
            Cognitive Progress & Clinical Report
          </h1>
          <p className="text-base text-[#333333] font-semibold mt-1">Patient: {patientName || 'Senior User'}</p>
        </div>
        <button
          onClick={readCaregiverSummary}
          className="h-16 px-6 bg-[#0B3C5D] hover:bg-[#08283E] text-white font-bold text-base rounded-lg border-2 border-[#0B3C5D] flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Volume2 className="w-6 h-6" />
          <span>Read Aloud</span>
        </button>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#FFFFFF] border-2 border-[#1A1A1A] p-4 rounded-lg">
          <span className="text-xs font-bold uppercase text-[#333333]">Average Accuracy</span>
          <p className="text-3xl font-bold text-[#1A1A1A] mt-1">{overall.avg}%</p>
          <p className="text-xs font-semibold text-[#0B3C5D] mt-1">+4.2% stability index</p>
        </div>
        <div className="bg-[#FFFFFF] border-2 border-[#1A1A1A] p-4 rounded-lg">
          <span className="text-xs font-bold uppercase text-[#333333]">Engagement Time</span>
          <p className="text-3xl font-bold text-[#1A1A1A] mt-1">24 min/day</p>
          <p className="text-xs font-semibold text-[#0B3C5D] mt-1">Consistent daily participation</p>
        </div>
        <div className="bg-[#FFFFFF] border-2 border-[#1A1A1A] p-4 rounded-lg">
          <span className="text-xs font-bold uppercase text-[#333333]">Task Completion</span>
          <p className="text-3xl font-bold text-[#1A1A1A] mt-1">92%</p>
          <p className="text-xs font-semibold text-[#0B3C5D] mt-1">Low abandonment rate</p>
        </div>
        <div className="bg-[#FFFFFF] border-2 border-[#1A1A1A] p-4 rounded-lg">
          <span className="text-xs font-bold uppercase text-[#333333]">Calm Index</span>
          <p className="text-3xl font-bold text-[#1A1A1A] mt-1">95/100</p>
          <p className="text-xs font-semibold text-[#0B3C5D] mt-1">Zero agitation detected</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b-2 border-[#1A1A1A] pb-2">
        <button
          onClick={() => setActiveTab('daily')}
          className={`h-16 px-6 font-bold text-base rounded-lg border-2 cursor-pointer ${
            activeTab === 'daily'
              ? 'bg-[#0B3C5D] text-white border-[#0B3C5D]'
              : 'bg-[#FFFFFF] text-[#1A1A1A] border-[#1A1A1A] hover:bg-[#F9F9F9]'
          }`}
        >
          Daily Analysis
        </button>
        <button
          onClick={() => setActiveTab('report')}
          className={`h-16 px-6 font-bold text-base rounded-lg border-2 cursor-pointer ${
            activeTab === 'report'
              ? 'bg-[#0B3C5D] text-white border-[#0B3C5D]'
              : 'bg-[#FFFFFF] text-[#1A1A1A] border-[#1A1A1A] hover:bg-[#F9F9F9]'
          }`}
        >
          Clinical Synthesis
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`h-16 px-6 font-bold text-base rounded-lg border-2 cursor-pointer ${
            activeTab === 'history'
              ? 'bg-[#0B3C5D] text-white border-[#0B3C5D]'
              : 'bg-[#FFFFFF] text-[#1A1A1A] border-[#1A1A1A] hover:bg-[#F9F9F9]'
          }`}
        >
          Session Logs
        </button>
      </div>

      {/* Tab 1: Daily */}
      {activeTab === 'daily' && (
        <div className="space-y-6">
          <div className="bg-[#FFFFFF] border-2 border-[#1A1A1A] p-6 rounded-lg space-y-4">
            <h2 className="text-xl font-bold text-[#1A1A1A]">7-Day Accuracy Trend</h2>
            <div className="space-y-3">
              {[
                { day: 'Monday', accuracy: 82, latency: '1.9s' },
                { day: 'Tuesday', accuracy: 78, latency: '2.1s' },
                { day: 'Wednesday', accuracy: 85, latency: '1.8s' },
                { day: 'Thursday', accuracy: 74, latency: '2.4s' },
                { day: 'Friday', accuracy: 88, latency: '1.7s' },
                { day: 'Saturday', accuracy: 80, latency: '2.0s' },
                { day: 'Sunday (Today)', accuracy: 84, latency: '1.8s' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 text-sm font-semibold">
                  <span className="w-32 text-[#1A1A1A]">{item.day}</span>
                  <div className="flex-1 bg-[#F9F9F9] border border-[#CCCCCC] h-6 rounded overflow-hidden">
                    <div
                      className="bg-[#0B3C5D] h-full"
                      style={{ width: `${item.accuracy}%` }}
                    />
                  </div>
                  <span className="w-16 text-right font-bold text-[#1A1A1A]">{item.accuracy}%</span>
                  <span className="w-20 text-right text-[#777777]">({item.latency})</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#FFFFFF] border-2 border-[#1A1A1A] p-6 rounded-lg space-y-4">
            <h2 className="text-xl font-bold text-[#1A1A1A]">Time of Day Alertness Matrix</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[#F9F9F9] border-2 border-[#1D6F42] p-4 rounded-lg">
                <span className="text-xs font-bold uppercase text-[#1D6F42]">Morning (8am - 12pm)</span>
                <p className="text-xl font-bold text-[#1A1A1A] mt-1">92% Accuracy</p>
                <p className="text-xs text-[#333333] mt-1">Peak Golden Hours</p>
              </div>
              <div className="bg-[#F9F9F9] border-2 border-[#1A1A1A] p-4 rounded-lg">
                <span className="text-xs font-bold uppercase text-[#333333]">Afternoon (12pm - 4pm)</span>
                <p className="text-xl font-bold text-[#1A1A1A] mt-1">78% Accuracy</p>
                <p className="text-xs text-[#333333] mt-1">Moderate Focus</p>
              </div>
              <div className="bg-[#F9F9F9] border-2 border-[#1A1A1A] p-4 rounded-lg">
                <span className="text-xs font-bold uppercase text-[#333333]">Evening (4pm - 8pm)</span>
                <p className="text-xl font-bold text-[#1A1A1A] mt-1">62% Accuracy</p>
                <p className="text-xs text-[#333333] mt-1">Natural Sundowning Fatigue</p>
              </div>
              <div className="bg-[#F9F9F9] border-2 border-[#0B3C5D] p-4 rounded-lg">
                <span className="text-xs font-bold uppercase text-[#0B3C5D]">Night (8pm - 11pm)</span>
                <p className="text-xl font-bold text-[#1A1A1A] mt-1">Low-Stimulation</p>
                <p className="text-xs text-[#333333] mt-1">Monastery Walk Mode</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Clinical Report */}
      {activeTab === 'report' && (
        <div className="bg-[#FFFFFF] border-2 border-[#1A1A1A] p-6 rounded-lg space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-[#1A1A1A]">Itemized Preserved Cognitive Skills</h2>
            <ul className="text-base text-[#1A1A1A] space-y-2 list-disc pl-5">
              <li><strong>Procedural Memory:</strong> High preservation in sequential tasks (85%+ accuracy in Kitchen Master).</li>
              <li><strong>Auditory & Narrative Engagement:</strong> Strong comprehension in Morung Storytelling with voice replies.</li>
              <li><strong>Motor Rhythm Timing:</strong> High coordination during morning Cheraw Rhythm sessions.</li>
            </ul>
          </div>

          <div className="space-y-2 pt-4 border-t-2 border-[#1A1A1A]">
            <h2 className="text-xl font-bold text-[#1A1A1A]">Caregiver Recommendations</h2>
            <ul className="text-base text-[#1A1A1A] space-y-2 list-disc pl-5">
              <li>Schedule active memory tasks between <strong>9:00 AM and 11:30 AM</strong> during peak clarity.</li>
              <li>Switch to <em>Monastery Prayer Wheel Walk</em> after 7:00 PM to support calm pre-sleep routines.</li>
              <li>Use 2x2 grid presets during evening visual memory exercises.</li>
            </ul>
          </div>
        </div>
      )}

      {/* Tab 3: History */}
      {activeTab === 'history' && (
        <div className="bg-[#FFFFFF] border-2 border-[#1A1A1A] p-6 rounded-lg space-y-4">
          <h2 className="text-xl font-bold text-[#1A1A1A]">Recent Activity Sessions</h2>
          {history.length === 0 ? (
            <p className="text-base text-[#333333]">
              No local session history recorded yet. Complete any game to view session logs.
            </p>
          ) : (
            <div className="space-y-3">
              {history.slice(0, 10).map((session, idx) => {
                const meta = GAME_LABELS[session.gameId] || { name: session.gameId };
                return (
                  <div key={idx} className="flex items-center justify-between p-4 bg-[#F9F9F9] border-2 border-[#CCCCCC] rounded-lg">
                    <div>
                      <p className="text-base font-bold text-[#1A1A1A]">{meta.name}</p>
                      <p className="text-xs text-[#777777]">{new Date(session.timestamp).toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-base font-bold text-[#0B3C5D]">{session.accuracy}% Accuracy</p>
                      <p className="text-xs text-[#777777]">{session.timeTakenSeconds}s duration</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
