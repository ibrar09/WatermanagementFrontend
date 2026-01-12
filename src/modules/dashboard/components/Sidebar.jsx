import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  BarChart2,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  LogOut,
  Bell,
  Layers,
  FileText,
} from "lucide-react";

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { name: "Overview", icon: LayoutDashboard, path: "/" },
    { name: "My Inventory", icon: Layers, path: "/inventory" },
    { name: "Inventory", icon: ChevronRight, path: "/purchase" },
    { name: "Sales (Out)", icon: ChevronLeft, path: "/sales" },
    { name: "Analytics", icon: BarChart2, path: "/reports" },
    { name: "Production", icon: Users, path: "/production" },
    { name: "Settings", icon: Settings, path: "/settings" },
  ];

  return (
    <aside
      className={`relative h-screen bg-white shadow-xl transition-all duration-300 z-40 flex flex-col border-r border-gray-100/50
        ${isCollapsed ? "w-20" : "w-72"}`}
    >
      {/* Collapse Toggle */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-8 z-50 bg-indigo-600 text-white rounded-full p-1.5 shadow-lg ring-4 ring-gray-50 hover:bg-indigo-700 transition"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Brand Logo */}
      <div className={`h-24 flex items-center px-6 ${isCollapsed ? 'justify-center' : ''}`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-xl shadow-lg shadow-blue-200">
            W
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="text-lg font-bold text-gray-800 leading-tight">WaterSys</span>
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Logistics</span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto">
        <p className={`px-4 text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ${isCollapsed ? 'hidden' : 'block'}`}>
          Main Menu
        </p>
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group
              ${isActive
                ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 font-bold shadow-sm"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"}
              ${isCollapsed ? "justify-center" : ""}`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon size={22} className={`${isActive ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"}`} />
                {!isCollapsed && <span>{item.name}</span>}
                {!isCollapsed && isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600"></div>}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-gray-100 bg-gray-50/50">
        <div className="space-y-1">
          <button
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-white hover:shadow-sm hover:text-indigo-600 transition
              ${isCollapsed ? "justify-center" : ""}`}
          >
            <HelpCircle size={20} />
            {!isCollapsed && <span className="text-sm font-medium">Help Center</span>}
          </button>
        </div>
      </div>
    </aside>
  );
}
