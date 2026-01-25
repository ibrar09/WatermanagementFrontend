import React from "react";
import { Bell, Search, User, Menu, Moon, Sun, Sparkles } from "lucide-react";
import { useTheme } from "../../../context/ThemeContext";

const Navbar = ({ toggleSidebar }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 py-3 flex items-center justify-between transition-all">
      {/* Left: Mobile Menu & Search */}
      <div className="flex items-center gap-3 flex-1">
        <button className="md:hidden p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg" onClick={toggleSidebar}>
          <Menu size={18} />
        </button>
        <div className="relative w-full max-w-md hidden md:block">
          <Search className="absolute left-3 top-2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search inventory, orders..."
            className="w-full pl-9 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium text-sm text-gray-700 placeholder-gray-400"
          />
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className={`p-1.5 rounded-lg transition-all ${theme === 'gradient' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-300' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
          title="Toggle Theme"
        >
          {theme === 'gradient' ? <Sparkles size={18} className="animate-pulse" /> : <Moon size={18} />}
        </button>

        {/* Notifications */}
        <button className="relative p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
          <Bell size={18} />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full ring-2 ring-white"></span>
        </button>

        {/* Profile */}
        <div className="flex items-center gap-2 pl-2 border-l border-gray-200 ml-1">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-gray-800 leading-none">Admin User</p>
            <p className="text-[10px] text-gray-500 mt-0.5">Manager</p>
          </div>
          <div className="w-8 h-8 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md ring-2 ring-white cursor-pointer hover:scale-105 transition-transform">
            AU
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
