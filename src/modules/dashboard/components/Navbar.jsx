import React from "react";
import { Bell, Search, User, Menu, Moon, Sun, Sparkles } from "lucide-react";
import { useTheme } from "../../../context/ThemeContext";

const Navbar = ({ toggleSidebar }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="sticky top-0 z-30 glass-panel border-b border-white/20 px-4 py-3 flex items-center justify-between transition-all">
      {/* Left: Mobile Menu & Search */}
      <div className="flex items-center gap-3 flex-1">
        <button className="md:hidden p-1.5 text-gray-500 hover:bg-white/50 rounded-lg transition-smooth" onClick={toggleSidebar}>
          <Menu size={18} />
        </button>
        <div className="relative w-full max-w-md hidden md:block">
          <Search className="absolute left-3 top-2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search inventory, orders..."
            className="w-full pl-9 pr-3 py-1.5 bg-white/50 border border-gray-200/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-smooth font-medium text-sm text-gray-700 placeholder-gray-400 hover:bg-white/80"
          />
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className={`p-1.5 rounded-lg transition-smooth hover-lift ${theme === 'gradient' ? 'bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30' : 'bg-white/50 text-gray-500 hover:bg-white border border-transparent hover:border-gray-100 hover:shadow-sm'}`}
          title="Toggle Theme"
        >
          {theme === 'gradient' ? <Sparkles size={18} className="animate-pulse" /> : <Moon size={18} />}
        </button>

        {/* Notifications */}
        <button className="relative p-1.5 text-gray-500 hover:bg-white hover:shadow-sm hover:text-indigo-600 rounded-lg transition-smooth hover-lift">
          <Bell size={18} />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full ring-2 ring-white animate-pulse"></span>
        </button>

        {/* Profile */}
        <div className="flex items-center gap-2 pl-2 border-l border-gray-200/50 ml-1">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-slate-800 leading-none tracking-tight">Admin User</p>
            <p className="text-[10px] text-slate-500 mt-0.5 font-medium">Manager</p>
          </div>
          <div className="w-8 h-8 bg-gradient-to-tr from-[#F0B100] to-[#D49B00] rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md shadow-orange-500/20 ring-2 ring-white cursor-pointer hover:scale-105 transition-smooth hover:shadow-lg hover:shadow-orange-500/30">
            AU
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
