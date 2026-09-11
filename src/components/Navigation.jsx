import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Bell, Users, Mic, LogOut, BarChart2, Sun, Moon } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { handleVoiceCommand } from '../services/gameStorage';

export const Navbar = () => {
  const { currentUser, patientName, logout, themeMode, toggleThemeMode } = useApp();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 bg-[#FFFFFF] dark:bg-[#18181B] border-b-2 border-[#1A1A1A] dark:border-[#3F3F46] px-4 py-3 transition-colors">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Left-aligned */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-[#0B3C5D] dark:bg-[#38BDF8] text-white dark:text-[#09090B] flex items-center justify-center font-bold text-xl shrink-0 border-2 border-[#0B3C5D] dark:border-[#38BDF8]">
            HC
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#1A1A1A] dark:text-[#F4F4F5] leading-tight">Qurevia</h1>
            <p className="text-sm text-[#333333] dark:text-[#A1A1AA] font-semibold">
              {patientName || (currentUser && (currentUser.displayName || currentUser.phoneNumber)) || 'Senior Care'}
            </p>
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Dark / Light Mode Toggle */}
          <button
            onClick={toggleThemeMode}
            aria-label={themeMode === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            title={themeMode === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="h-16 px-4 bg-[#FFFFFF] dark:bg-[#27272A] hover:bg-[#F9F9F9] dark:hover:bg-[#3F3F46] text-[#1A1A1A] dark:text-[#F4F4F5] font-bold rounded-lg flex items-center gap-2 border-2 border-[#1A1A1A] dark:border-[#52525B] cursor-pointer"
          >
            {themeMode === 'dark' ? (
              <>
                <Sun className="w-6 h-6 text-[#FBBF24]" />
                <span className="hidden md:inline text-base">Light</span>
              </>
            ) : (
              <>
                <Moon className="w-6 h-6 text-[#0B3C5D]" />
                <span className="hidden md:inline text-base">Dark</span>
              </>
            )}
          </button>

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
              className="h-16 px-4 bg-[#FFFFFF] dark:bg-[#27272A] hover:bg-[#F9F9F9] dark:hover:bg-[#3F3F46] text-[#1A1A1A] dark:text-[#F4F4F5] font-bold rounded-lg flex items-center gap-2 border-2 border-[#1A1A1A] dark:border-[#52525B] cursor-pointer"
            >
              <LogOut className="w-6 h-6 text-[#A31E1E] dark:text-[#F87171]" />
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
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#FFFFFF] dark:bg-[#18181B] border-t-2 border-[#1A1A1A] dark:border-[#3F3F46] py-2 px-4 transition-colors">
      <div className="max-w-4xl mx-auto flex justify-between items-center gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex-1 h-16 flex flex-col items-center justify-center rounded-lg border-2 text-base font-bold transition-colors ${
                  isActive
                    ? 'bg-[#0B3C5D] text-white border-[#0B3C5D] dark:bg-[#0284C7] dark:border-[#0284C7]'
                    : 'bg-[#FFFFFF] dark:bg-[#27272A] text-[#1A1A1A] dark:text-[#E4E4E7] border-[#CCCCCC] dark:border-[#52525B] hover:bg-[#F9F9F9] dark:hover:bg-[#3F3F46]'
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
