import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Pill, Droplets, Footprints, Stethoscope, CheckCircle2, Clock, Volume2, Plus, Edit2, Trash2, X, Save } from 'lucide-react';
import { speakText } from '../services/gameStorage';

export const Reminders = () => {
  const { reminders, toggleReminder, addReminder, updateReminder, deleteReminder } = useApp();

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
    speakText(isTaken ? `Marked ${itemTitle} as pending` : `Completed ${itemTitle}`);
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
      speakText(`Added reminder: ${title}`);
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
    <div className="bg-[#FFFFFF] pb-32 pt-6 px-4 max-w-4xl mx-auto space-y-6 text-left">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-[#1A1A1A] pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1A1A1A]">Daily Health & Routine Reminders</h1>
          <p className="text-base text-[#333333] font-semibold mt-1">Structured schedule for senior care</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenAdd}
            className="h-16 px-6 bg-[#0B3C5D] hover:bg-[#08283E] text-white rounded-lg font-bold flex items-center gap-2 border-2 border-[#0B3C5D] cursor-pointer"
          >
            <Plus className="w-6 h-6" />
            <span>Add Reminder</span>
          </button>
          <button
            onClick={() => speakText("Here are your daily health and routine reminders.")}
            className="h-16 px-6 bg-[#FFFFFF] hover:bg-[#F9F9F9] text-[#1A1A1A] rounded-lg font-bold flex items-center gap-2 border-2 border-[#1A1A1A] cursor-pointer"
          >
            <Volume2 className="w-6 h-6" />
            <span>Read Aloud</span>
          </button>
        </div>
      </div>

      {/* Reminders List */}
      <div className="space-y-4">
        {reminders.map((item) => {
          const IconComponent = getIcon(item.category);
          return (
            <div
              key={item.id}
              className={`rounded-lg p-6 border-2 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                item.taken
                  ? 'bg-[#F9F9F9] border-[#1D6F42]'
                  : 'bg-[#FFFFFF] border-[#1A1A1A]'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-lg border-2 border-[#1A1A1A] bg-[#F9F9F9] flex items-center justify-center shrink-0">
                  <IconComponent className="w-7 h-7 text-[#0B3C5D]" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#0B3C5D]" />
                    <span className="text-sm font-bold text-[#0B3C5D]">{item.time}</span>
                  </div>
                  <h2 className={`text-xl font-bold ${item.taken ? 'line-through text-[#777777]' : 'text-[#1A1A1A]'}`}>
                    {item.title}
                  </h2>
                  <span className="inline-block text-xs font-semibold px-2 py-0.5 rounded border border-[#CCCCCC] bg-[#FFFFFF] text-[#333333]">
                    Category: {item.category}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
                <button
                  onClick={() => handleToggle(item.id, item.title, item.taken)}
                  className={`h-16 px-6 rounded-lg font-bold text-base border-2 cursor-pointer flex items-center gap-2 ${
                    item.taken
                      ? 'bg-[#1D6F42] text-white border-[#1D6F42]'
                      : 'bg-[#0B3C5D] hover:bg-[#08283E] text-white border-[#0B3C5D]'
                  }`}
                >
                  {item.taken ? (
                    <>
                      <CheckCircle2 className="w-6 h-6" />
                      <span>Completed</span>
                    </>
                  ) : (
                    <span>Mark Done</span>
                  )}
                </button>

                <button
                  onClick={() => handleOpenEdit(item)}
                  className="h-16 px-4 bg-[#FFFFFF] hover:bg-[#F9F9F9] text-[#1A1A1A] rounded-lg border-2 border-[#1A1A1A] font-bold cursor-pointer"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(item.id, item.title)}
                  className="h-16 px-4 bg-[#FFFFFF] hover:bg-[#F9F9F9] text-[#802A0B] rounded-lg border-2 border-[#802A0B] font-bold cursor-pointer"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#000000]/70 z-50 flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] border-2 border-[#1A1A1A] rounded-lg p-6 w-full max-w-lg space-y-4">
            <div className="flex items-center justify-between border-b-2 border-[#1A1A1A] pb-3">
              <h2 className="text-2xl font-bold text-[#1A1A1A]">
                {editingId ? 'Edit Reminder' : 'Add New Reminder'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-[#1A1A1A] cursor-pointer">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-sm font-bold text-[#1A1A1A]">Reminder Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Afternoon Blood Pressure Tablet"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-4 border-2 border-[#1A1A1A] rounded-lg text-base font-bold text-[#1A1A1A] bg-[#FFFFFF]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-bold text-[#1A1A1A]">Scheduled Time</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 02:30 PM"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full p-4 border-2 border-[#1A1A1A] rounded-lg text-base font-bold text-[#1A1A1A] bg-[#FFFFFF]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-bold text-[#1A1A1A]">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-4 border-2 border-[#1A1A1A] rounded-lg text-base font-bold text-[#1A1A1A] bg-[#FFFFFF] cursor-pointer"
                >
                  <option value="Medicine">Medicine</option>
                  <option value="Hydration">Hydration</option>
                  <option value="Activity">Physical Activity</option>
                  <option value="Appointment">Medical Appointment</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 h-16 bg-[#0B3C5D] hover:bg-[#08283E] text-white font-bold text-lg rounded-lg border-2 border-[#0B3C5D] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Save className="w-5 h-5" />
                  <span>Save Reminder</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="h-16 px-6 bg-[#FFFFFF] hover:bg-[#F9F9F9] text-[#1A1A1A] font-bold rounded-lg border-2 border-[#1A1A1A] cursor-pointer"
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
