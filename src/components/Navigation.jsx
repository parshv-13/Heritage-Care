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
    <header className="sticky top-0 z-50 bg-[#FBF9F4] border-b-2 border-[#E4E2DD] px-4 py-3 gamosa-border-top shadow-sm">
      <div className="max-w-md mx-auto flex items-center justify-between gap-2">
        {/* Brand */}
        <div className="flex items-center space-x-2 min-w-0">
          <div className="w-10 h-10 rounded-full bg-[#BA7517] text-white flex items-center justify-center font-bold text-xl shadow shrink-0">
            🌺
          </div>
          <div className="min-w-0">
            <h1 className="text-lg font-bold text-[#1B1C19] leading-tight truncate">Heritage Care</h1>
            {currentUser && (
              <p className="text-xs text-[#855000] font-semibold truncate">
                {patientName || currentUser.displayName || currentUser.phoneNumber || 'User'}
              </p>
            )}
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Voice Assistant */}
          <button
            onClick={() => handleVoiceCommand()}
            aria-label="Activate Voice Assistant"
            className="touch-target bg-[#BA7517] hover:bg-[#855000] active:scale-95 text-white font-bold px-3 py-2 rounded-2xl flex items-center space-x-1 border-2 border-[#673D00] shadow-md transition"
          >
            <Mic className="w-5 h-5 animate-pulse" />
          </button>

          {/* Logout */}
          {currentUser && (
            <button
              onClick={handleLogout}
              aria-label="Sign Out"
              className="touch-target bg-[#FFDBD0] hover:bg-[#9C3E1F] hover:text-white text-[#9C3E1F] font-bold px-3 py-2 rounded-2xl flex items-center space-x-1 border-2 border-[#9C3E1F] shadow-md transition"
            >
              <LogOut className="w-5 h-5" />
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
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#FBF9F4] border-t-2 border-[#857464] py-2 px-4 shadow-lg">
      <div className="max-w-md mx-auto flex justify-around items-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center touch-target w-24 py-2 rounded-2xl transition-all ${
                  isActive
                    ? 'bg-[#BA7517] text-white font-bold border-2 border-[#673D00] shadow-md'
                    : 'text-[#524436] hover:bg-[#F0EEE9] font-medium'
                }`
              }
            >
              <Icon className="w-7 h-7 mb-1" />
              <span className="text-sm tracking-wide">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
