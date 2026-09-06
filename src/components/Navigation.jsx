import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Bell, Users, Mic, LogOut, BarChart2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { handleVoiceCommand } from '../services/gameStorage';

export const Navbar = () => {
  const { currentUser, patientName, logout } = useApp();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 bg-[#FFFFFF] border-b-2 border-[#1A1A1A] px-4 py-3">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Left-aligned */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-[#0B3C5D] text-white flex items-center justify-center font-bold text-xl shrink-0 border-2 border-[#0B3C5D]">
            HC
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#1A1A1A] leading-tight">Heritage Care</h1>
            <p className="text-sm text-[#333333] font-semibold">
              {patientName || (currentUser && (currentUser.displayName || currentUser.phoneNumber)) || 'Senior Care'}
            </p>
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => handleVoiceCommand()}
            aria-label="Activate Voice Assistant"
            className="h-16 px-4 bg-[#0B3C5D] hover:bg-[#08283E] text-white font-bold rounded-lg flex items-center gap-2 border-2 border-[#0B3C5D] cursor-pointer"
          >
            <Mic className="w-6 h-6" />
            <span className="hidden sm:inline text-base">Voice Help</span>
          </button>

          {currentUser && (
            <button
              onClick={handleLogout}
              aria-label="Sign Out"
              className="h-16 px-4 bg-[#FFFFFF] hover:bg-[#F9F9F9] text-[#1A1A1A] font-bold rounded-lg flex items-center gap-2 border-2 border-[#1A1A1A] cursor-pointer"
            >
              <LogOut className="w-6 h-6 text-[#A31E1E]" />
              <span className="hidden sm:inline text-base">Sign Out</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export const BottomNav = () => {
  const navItems = [
    { to: '/home', label: 'Home', icon: Home },
    { to: '/reminders', label: 'Reminders', icon: Bell },
    { to: '/progress', label: 'Progress', icon: BarChart2 },
    { to: '/family', label: 'Family', icon: Users },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#FFFFFF] border-t-2 border-[#1A1A1A] py-2 px-4">
      <div className="max-w-4xl mx-auto flex justify-between items-center gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex-1 h-16 flex flex-col items-center justify-center rounded-lg border-2 text-base font-bold ${
                  isActive
                    ? 'bg-[#0B3C5D] text-white border-[#0B3C5D]'
                    : 'bg-[#FFFFFF] text-[#1A1A1A] border-[#CCCCCC] hover:bg-[#F9F9F9]'
                }`
              }
            >
              <Icon className="w-6 h-6 mb-0.5" />
              <span className="text-xs">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
