import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Phone, MapPin, Volume2, Plus, Edit2, Trash2, X, Save } from 'lucide-react';
import { speakText } from '../services/gameStorage';

export const Family = () => {
  const { familyContacts, patientName, addFamilyContact, updateFamilyContact, deleteFamilyContact } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState('');
  const [relation, setRelation] = useState('Primary Caregiver');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('Guwahati');

  const handleOpenAdd = () => {
    setEditingId(null);
    setName('');
    setRelation('Primary Caregiver');
    setPhone('');
    setLocation('Guwahati');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (contact) => {
    setEditingId(contact.id);
    setName(contact.name);
    setRelation(contact.relation);
    setPhone(contact.phone);
    setLocation(contact.location);
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    if (editingId) {
      updateFamilyContact(editingId, { name, relation, phone, location });
      speakText(`Updated contact ${name}`);
    } else {
      addFamilyContact({ name, relation, phone, location });
      speakText(`Added contact ${name}`);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id, contactName) => {
    if (window.confirm(`Remove contact ${contactName}?`)) {
      deleteFamilyContact(id);
      speakText(`Removed ${contactName}`);
    }
  };

  return (
    <div className="bg-[#FFFFFF] pb-32 pt-6 px-4 max-w-4xl mx-auto space-y-6 text-left">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-[#1A1A1A] pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1A1A1A]">Caregiver & Family Network</h1>
          <p className="text-base text-[#333333] font-semibold mt-1">Direct one-touch phone connections for {patientName}</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenAdd}
            className="h-16 px-6 bg-[#0B3C5D] hover:bg-[#08283E] text-white rounded-lg font-bold flex items-center gap-2 border-2 border-[#0B3C5D] cursor-pointer"
          >
            <Plus className="w-6 h-6" />
            <span>Add Contact</span>
          </button>
          <button
            onClick={() => speakText("Caregiver and family phone contact list.")}
            className="h-16 px-6 bg-[#FFFFFF] hover:bg-[#F9F9F9] text-[#1A1A1A] rounded-lg font-bold flex items-center gap-2 border-2 border-[#1A1A1A] cursor-pointer"
          >
            <Volume2 className="w-6 h-6" />
            <span>Read Aloud</span>
          </button>
        </div>
      </div>

      {/* Contacts List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {familyContacts.map((contact) => (
          <div
            key={contact.id}
            className="bg-[#FFFFFF] border-2 border-[#1A1A1A] rounded-lg p-6 space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider bg-[#F9F9F9] border border-[#1A1A1A] px-3 py-1 rounded text-[#1A1A1A]">
                  {contact.relation}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(contact)}
                    className="p-2 bg-[#FFFFFF] hover:bg-[#F9F9F9] border-2 border-[#1A1A1A] rounded-lg text-[#1A1A1A] font-bold cursor-pointer"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(contact.id, contact.name)}
                    className="p-2 bg-[#FFFFFF] hover:bg-[#F9F9F9] border-2 border-[#802A0B] rounded-lg text-[#802A0B] font-bold cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h2 className="text-xl font-bold text-[#1A1A1A]">{contact.name}</h2>
              <div className="flex items-center gap-2 text-sm text-[#333333]">
                <MapPin className="w-4 h-4 text-[#0B3C5D]" />
                <span>{contact.location}</span>
              </div>
            </div>

            <a
              href={`tel:${contact.phone}`}
              onClick={() => speakText(`Calling ${contact.name}`)}
              className="w-full h-16 bg-[#0B3C5D] hover:bg-[#08283E] text-white font-bold text-lg rounded-lg border-2 border-[#0B3C5D] flex items-center justify-center gap-3 cursor-pointer"
            >
              <Phone className="w-6 h-6" />
              <span>Call {contact.phone}</span>
            </a>
          </div>
        ))}
      </div>

      {/* Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#000000]/70 z-50 flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] border-2 border-[#1A1A1A] rounded-lg p-6 w-full max-w-lg space-y-4">
            <div className="flex items-center justify-between border-b-2 border-[#1A1A1A] pb-3">
              <h2 className="text-2xl font-bold text-[#1A1A1A]">
                {editingId ? 'Edit Contact' : 'Add New Contact'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-[#1A1A1A] cursor-pointer">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-sm font-bold text-[#1A1A1A]">Contact Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Aniket Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-4 border-2 border-[#1A1A1A] rounded-lg text-base font-bold text-[#1A1A1A] bg-[#FFFFFF]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-bold text-[#1A1A1A]">Relationship</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Son / Primary Physician"
                  value={relation}
                  onChange={(e) => setRelation(e.target.value)}
                  className="w-full p-4 border-2 border-[#1A1A1A] rounded-lg text-base font-bold text-[#1A1A1A] bg-[#FFFFFF]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-bold text-[#1A1A1A]">Phone Number</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. +91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-4 border-2 border-[#1A1A1A] rounded-lg text-base font-bold text-[#1A1A1A] bg-[#FFFFFF]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-bold text-[#1A1A1A]">Location / City</label>
                <input
                  type="text"
                  placeholder="e.g. Guwahati, Assam"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full p-4 border-2 border-[#1A1A1A] rounded-lg text-base font-bold text-[#1A1A1A] bg-[#FFFFFF]"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 h-16 bg-[#0B3C5D] hover:bg-[#08283E] text-white font-bold text-lg rounded-lg border-2 border-[#0B3C5D] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Save className="w-5 h-5" />
                  <span>Save Contact</span>
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
