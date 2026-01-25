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
  Gauge,
  Factory,
  ShoppingCart,

  ShoppingBag,
  TrendingDown,
  Briefcase,
  ClipboardList,
  Truck
} from "lucide-react";

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { name: "Overview", icon: LayoutDashboard, path: "/" },
    { name: "My Inventory", icon: Layers, path: "/inventory" },
    { name: "Production", icon: Factory, path: "/production" },
    { name: "Gate Pass / Dispatch", icon: Truck, path: "/gate-pass" },
    { name: "Sales Point", icon: ShoppingCart, path: "/sales" },

    { name: "Customers", icon: Users, path: "/customers" },
    { name: "Expenses", icon: TrendingDown, path: "/expenses" },
    { name: "HR / Staff", icon: Briefcase, path: "/hr" },
    { name: "Purchase", icon: ShoppingBag, path: "/purchase" },
    { name: "Daily Report (DFR)", icon: ClipboardList, path: "/daily-report" },
    { name: "Analytics", icon: BarChart2, path: "/reports" },
    { name: "Utilities", icon: Gauge, path: "/utilities" },
    { name: "Settings", icon: Settings, path: "/settings" },
  ];

  return (
    <aside
      className={`relative h-screen bg-[#3A4D4E] shadow-xl transition-all duration-300 z-40 flex flex-col border-r border-[#2C3E3F]
        ${isCollapsed ? "w-16" : "w-56"}`}
    >
      {/* Collapse Toggle */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-8 z-50 bg-[#3A4D4E] text-white rounded-full p-1.5 shadow-lg border border-[#2C3E3F] hover:bg-[#2C3E3F] transition"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Brand Logo */}
      <div className={`h-16 flex items-center px-4 ${isCollapsed ? 'justify-center' : ''}`}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-white/20 to-white/5 text-white flex items-center justify-center font-bold text-base shadow-lg border border-white/10 backdrop-blur-sm">
            W
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="text-base font-black text-[#F0B100] leading-tight tracking-tight">WaterSys</span>
              <span className="text-[9px] uppercase font-bold text-[#8FA5A6] tracking-widest">Logistics</span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
        <p className={`px-3 text-[10px] font-bold text-[#8FA5A6] uppercase tracking-widest mb-2 ${isCollapsed ? 'hidden' : 'block'}`}>
          Main Menu
        </p>
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-all duration-200 group
              ${isActive
                ? "bg-white/10 text-[#F0B100] font-semibold shadow-sm border border-white/5"
                : "text-[#B0C4C5] hover:bg-white/5 hover:text-[#F0B100]"}
              ${isCollapsed ? "justify-center" : ""}`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon size={18} className={`flex-shrink-0 ${isActive ? "text-[#F0B100]" : "text-[#B0C4C5] group-hover:text-[#F0B100]"}`} />
                {!isCollapsed && <span className="text-sm">{item.name}</span>}
                {!isCollapsed && isActive && <div className="ml-auto w-1 h-1 rounded-full bg-[#F0B100]"></div>}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Actions */}
      <div className="p-2 border-t border-[#2C3E3F] bg-[#324546]">
        <div className="space-y-0.5">
          <button
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[#B0C4C5] hover:bg-white/10 hover:shadow-sm hover:text-white transition
              ${isCollapsed ? "justify-center" : ""}`}
          >
            <HelpCircle size={18} />
            {!isCollapsed && <span className="text-xs font-medium">Help Center</span>}
          </button>
        </div>
      </div>
    </aside>
  );
}
