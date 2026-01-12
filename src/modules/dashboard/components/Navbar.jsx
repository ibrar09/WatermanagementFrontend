import React from "react";
import { Bell, Search, User, Menu, Moon, Sun, Sparkles } from "lucide-react";
import { useTheme } from "../../../context/ThemeContext";

const Navbar = ({ toggleSidebar }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex items-center justify-between transition-all">
      {/* Left: Mobile Menu & Search */}
      <div className="flex items-center gap-4 flex-1">
        <button className="md:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg" onClick={toggleSidebar}>
          <Menu size={20} />
        </button>
        <div className="relative w-full max-w-md hidden md:block">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search inventory, orders..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium text-sm text-gray-700 placeholder-gray-400"
          />
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className={`p-2 rounded-xl transition-all ${theme === 'gradient' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-300' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
          title="Toggle Theme"
        >
          {theme === 'gradient' ? <Sparkles size={20} className="animate-pulse" /> : <Moon size={20} />}
        </button>

        {/* Notifications */}
        <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-xl transition-colors">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
        </button>

        {/* Profile */}
        <div className="flex items-center gap-3 pl-2 border-l border-gray-200 ml-1">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-gray-800 leading-none">Admin User</p>
            <p className="text-xs text-gray-500 mt-1">Manager</p>
          </div>
          <div className="w-10 h-10 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold shadow-md ring-2 ring-white cursor-pointer hover:scale-105 transition-transform">
            AU
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
