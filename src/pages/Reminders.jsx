import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Pill, Droplets, Footprints, Stethoscope, CheckCircle, Clock, Volume2, Plus, Edit2, Trash2, X, Save } from 'lucide-react';
import { speakText } from '../services/gameStorage';

export const Reminders = () => {
  const { reminders, toggleReminder, addReminder, updateReminder, deleteReminder, currentTheme } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('09:00 AM');
  const [category, setCategory] = useState('Medicine');

  const getIcon = (type) => {
    switch (type) {
      case 'Medicine': return Pill;
      case 'Hydration': return Droplets;
      case 'Activity': return Footprints;
      default: return Stethoscope;
    }
  };

  const handleToggle = (id, itemTitle, isTaken) => {
    toggleReminder(id);
    speakText(isTaken ? `Marked ${itemTitle} as pending` : `Great! ${itemTitle} completed!`);
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setTitle('');
    setTime('09:00 AM');
    setCategory('Medicine');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingId(item.id);
    setTitle(item.title);
    setTime(item.time);
    setCategory(item.category);
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingId) {
      updateReminder(editingId, { title, time, category });
      speakText(`Updated reminder: ${title}`);
    } else {
      addReminder({ title, time, category });
      speakText(`Added new reminder: ${title}`);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id, itemTitle) => {
    if (window.confirm(`Delete reminder "${itemTitle}"?`)) {
      deleteReminder(id);
      speakText(`Deleted ${itemTitle}`);
    }
  };

  return (
    <div className="pb-24 pt-4 px-4 max-w-md mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-[#1B1C19]">Daily Reminders</h2>
          <p className="text-base text-[#855000] font-semibold">Gentle Health & Care Schedule</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleOpenAdd}
            className="touch-target bg-[#386A0E] text-white border-2 border-[#0C2000] rounded-2xl p-3 font-bold flex items-center gap-1 shadow-md hover:bg-[#265100]"
            title="Add Reminder"
          >
            <Plus className="w-6 h-6" />
          </button>
          <button
            onClick={() => speakText("Here are your daily health and medicine reminders.")}
            className="touch-target bg-[#FFDCBB] border-2 border-[#BA7517] text-[#855000] rounded-2xl p-3 font-bold"
          >
            <Volume2 className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Reminder Cards List */}
      <div className="space-y-4">
        {reminders.map((item) => {
          const IconComponent = getIcon(item.category);
          return (
            <div
              key={item.id}
              className={`rounded-3xl p-5 border-3 transition flex items-center justify-between shadow-md relative ${
                item.taken
                  ? 'bg-[#E4E2DD] border-[#857464] opacity-80'
                  : 'bg-white border-[#BA7517]'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div
                  className={`p-3.5 rounded-2xl border-2 flex items-center justify-center ${
                    item.taken
                      ? 'bg-gray-200 border-gray-400 text-gray-600'
                      : 'bg-[#FFDCBB] border-[#BA7517] text-[#855000]'
                  }`}
                >
                  <IconComponent className="w-7 h-7" />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#855000]" />
                    <span className="text-base font-bold text-[#855000]">{item.time}</span>
                  </div>
                  <h3 className={`text-xl font-bold mt-1 ${item.taken ? 'line-through text-gray-600' : 'text-[#1B1C19]'}`}>
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="inline-block text-xs font-semibold px-2.5 py-0.5 rounded-md bg-[#F0EEE9] text-[#524436]">
                      {item.category}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                <button
                  onClick={() => handleToggle(item.id, item.title, item.taken)}
                  className={`touch-target px-3.5 py-2 rounded-2xl font-bold text-sm border-2 shadow-xs transition ${
                    item.taken
                      ? 'bg-[#386A0E] text-white border-[#0C2000]'
                      : 'bg-[#BA7517] text-white border-[#673D00] hover:bg-[#855000]'
                  }`}
                >
                  {item.taken ? (
                    <span className="flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" /> Done
                    </span>
                  ) : (
                    'Mark Done'
                  )}
                </button>

                {/* Edit & Delete Actions */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="p-1.5 bg-[#FFDCBB] text-[#855000] rounded-xl border border-[#BA7517] hover:bg-[#BA7517] hover:text-white"
                    title="Edit Reminder"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id, item.title)}
                    className="p-1.5 bg-[#FFDBD0] text-[#9C3E1F] rounded-xl border border-[#9C3E1F] hover:bg-[#9C3E1F] hover:text-white"
                    title="Delete Reminder"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Dialog for Add / Edit Reminder */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border-3 border-[#BA7517] rounded-3xl p-6 w-full max-w-sm space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-2xl font-bold text-[#1B1C19]">
                {editingId ? 'Edit Reminder' : 'Add New Reminder'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-500 hover:text-black">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-[#855000] mb-1">Reminder Task Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Take Afternoon BP Tablet"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-3 border-2 border-[#BA7517] rounded-xl text-base font-bold text-[#1B1C19]"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#855000] mb-1">Schedule Time</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 02:30 PM"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full p-3 border-2 border-[#BA7517] rounded-xl text-base font-bold text-[#1B1C19]"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#855000] mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-3 border-2 border-[#BA7517] rounded-xl text-base font-bold text-[#1B1C19] bg-white"
                >
                  <option value="Medicine">Medicine 💊</option>
                  <option value="Hydration">Hydration 💧</option>
                  <option value="Activity">Activity 👟</option>
                  <option value="Appointment">Appointment 🩺</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-[#BA7517] hover:bg-[#855000] text-white font-bold text-lg py-3 rounded-xl border-2 border-[#673D00] flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" /> Save Reminder
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 bg-gray-200 text-gray-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
