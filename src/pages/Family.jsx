import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Phone, MapPin, Heart, Shield, Volume2, Plus, Edit2, Trash2, X, Save } from 'lucide-react';
import { speakText } from '../services/gameStorage';

export const Family = () => {
  const { familyContacts, patientName, addFamilyContact, updateFamilyContact, deleteFamilyContact } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState('');
  const [relation, setRelation] = useState('Primary Caregiver');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('Guwahati');
  const [avatar, setAvatar] = useState('👨‍💼');

  const handleOpenAdd = () => {
    setEditingId(null);
    setName('');
    setRelation('Primary Caregiver');
    setPhone('');
    setLocation('Guwahati');
    setAvatar('👨‍💼');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (contact) => {
    setEditingId(contact.id);
    setName(contact.name);
    setRelation(contact.relation);
    setPhone(contact.phone);
    setLocation(contact.location);
    setAvatar(contact.avatar || '👨‍💼');
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    if (editingId) {
      updateFamilyContact(editingId, { name, relation, phone, location, avatar });
      speakText(`Updated caregiver ${name}`);
    } else {
      addFamilyContact({ name, relation, phone, location, avatar });
      speakText(`Added caregiver ${name}`);
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
    <div className="pb-24 pt-4 px-4 max-w-md mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-[#1B1C19]">Family & Care</h2>
          <p className="text-base text-[#855000] font-semibold">Caregiver Network for {patientName}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleOpenAdd}
            className="touch-target bg-[#386A0E] text-white border-2 border-[#0C2000] rounded-2xl p-3 font-bold flex items-center gap-1 shadow-md hover:bg-[#265100]"
            title="Add Caregiver"
          >
            <Plus className="w-6 h-6" />
          </button>
          <button
            onClick={() => speakText("Caregiver and family phone contact list.")}
            className="touch-target bg-[#FFDCBB] border-2 border-[#BA7517] text-[#855000] rounded-2xl p-3 font-bold"
          >
            <Volume2 className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="bg-[#FFF8F0] border-2 border-[#BA7517] rounded-3xl p-4 flex items-center gap-3">
        <Shield className="w-8 h-8 text-[#BA7517]" />
        <p className="text-sm text-[#524436] font-semibold">
          Tap any caregiver card to edit details or make direct one-touch calls.
        </p>
      </div>

      {/* Family / Caregiver Contacts List */}
      <div className="space-y-4">
        {familyContacts.map((contact) => (
          <div
            key={contact.id}
            className="bg-white border-3 border-[#BA7517] rounded-3xl p-5 shadow-md space-y-3 relative"
          >
            <div className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center space-x-3">
                <span className="text-4xl">{contact.avatar}</span>
                <div>
                  <h3 className="text-xl font-bold text-[#1B1C19]">{contact.name}</h3>
                  <span className="inline-block bg-[#FFDCBB] text-[#855000] font-bold text-xs px-2.5 py-0.5 rounded-full border border-[#BA7517]">
                    {contact.relation}
                  </span>
                </div>
              </div>

              {/* Edit & Delete Contact */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenEdit(contact)}
                  className="p-2 bg-[#FFDCBB] text-[#855000] rounded-xl border border-[#BA7517] hover:bg-[#BA7517] hover:text-white"
                  title="Edit Contact"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(contact.id, contact.name)}
                  className="p-2 bg-[#FFDBD0] text-[#9C3E1F] rounded-xl border border-[#9C3E1F] hover:bg-[#9C3E1F] hover:text-white"
                  title="Delete Contact"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-1 text-[#524436] text-sm font-medium">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#855000]" />
                <span>{contact.location}</span>
              </div>
            </div>

            <a
              href={`tel:${contact.phone}`}
              onClick={() => speakText(`Calling ${contact.name}`)}
              className="touch-target w-full bg-[#386A0E] hover:bg-[#265100] text-white font-bold text-lg py-3 rounded-2xl border-2 border-[#0C2000] flex items-center justify-center gap-2 shadow-md"
            >
              <Phone className="w-5 h-5" /> Call {contact.phone}
            </a>
          </div>
        ))}
      </div>

      {/* Modal Dialog for Add / Edit Family Contact */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border-3 border-[#BA7517] rounded-3xl p-6 w-full max-w-sm space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-2xl font-bold text-[#1B1C19]">
                {editingId ? 'Edit Caregiver' : 'Add Caregiver'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-500 hover:text-black">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block text-sm font-bold text-[#855000] mb-1">Caregiver / Family Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Aniket Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 border-2 border-[#BA7517] rounded-xl text-base font-bold text-[#1B1C19]"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#855000] mb-1">Relationship</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Son / Primary Physician"
                  value={relation}
                  onChange={(e) => setRelation(e.target.value)}
                  className="w-full p-3 border-2 border-[#BA7517] rounded-xl text-base font-bold text-[#1B1C19]"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#855000] mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. +91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-3 border-2 border-[#BA7517] rounded-xl text-base font-bold text-[#1B1C19]"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#855000] mb-1">Location / Address</label>
                <input
                  type="text"
                  placeholder="e.g. Guwahati, Assam"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full p-3 border-2 border-[#BA7517] rounded-xl text-base font-bold text-[#1B1C19]"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#855000] mb-1">Avatar Symbol</label>
                <select
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  className="w-full p-3 border-2 border-[#BA7517] rounded-xl text-base font-bold text-[#1B1C19] bg-white"
                >
                  <option value="👨‍💼">👨‍💼 Son / Caregiver</option>
                  <option value="👩‍⚕️">👩‍⚕️ Doctor / Physician</option>
                  <option value="👩‍🎓">👩‍🎓 Daughter / Granddaughter</option>
                  <option value="👵">👵 Elder Relative</option>
                  <option value="👨‍👩‍👧">👨‍👩‍👧 Family Member</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-[#BA7517] hover:bg-[#855000] text-white font-bold text-lg py-3 rounded-xl border-2 border-[#673D00] flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" /> Save Contact
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
