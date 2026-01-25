import React, { useState, useMemo } from "react";
import { useData } from "../../../context/DataContext";
import { useTheme } from "../../../context/ThemeContext";
import {
  Search, Plus, Filter, Package, ChevronDown, AlertCircle,
  TrendingUp, Box, Layers, X, PlusCircle, Edit3, Trash2,
  Check, ShoppingBag, MoreHorizontal, ArrowUpRight,
  Database, Activity, LayoutGrid, List, SlidersHorizontal,
  Settings, Plane, HeartPulse, Clock, CheckCircle, XCircle, Menu,
  Truck, Tag, DollarSign
} from "lucide-react";

const Inventory = () => {
  const { inventory, addStock } = useData();
  const { theme } = useTheme();
  const darkMode = theme === 'gradient'; // Map global theme to local var for snippet compatibility

  const [activeTab, setActiveTab] = useState('all-items');
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  // Derived Data
  const lowStockItems = inventory.filter(i => i.quantity < 20);
  const pendingCount = lowStockItems.length;

  const filteredInventory = useMemo(() => {
    let data = activeTab === 'low-stock' ? lowStockItems : inventory;
    return data.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [inventory, searchTerm, activeTab, lowStockItems]);

  // Categories for Add Form (simplified for now)
  const categories = ["All", "Construction", "Electronics", "Safety", "Machinery", "Chemicals", "Finished Goods", "Raw Material", "Packaging"];
  const [formData, setFormData] = useState({
    name: "", category: "Raw Material", quantity: "", unit: "Units", costPrice: "", sellingPrice: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    addStock({
      ...formData,
      quantity: Number(formData.quantity),
      costPrice: Number(formData.costPrice),
      sellingPrice: Number(formData.sellingPrice || 0)
    });
    setShowAddModal(false);
    setFormData({ name: "", category: "Raw Material", quantity: "", unit: "Units", costPrice: "", sellingPrice: "" });
  };

  return (
    <div className={`h-full flex flex-col p-4 sm:p-6 animate-[fadeIn_0.3s_ease-out] ${darkMode ? 'text-white' : 'text-slate-900'}`}>

      {/* ADD MODAL */}
      {showAddModal && (
        <div className="modal-responsive p-4 sm:p-6 backdrop-blur-md bg-black/40">
          <div className={`modal-content-responsive max-w-xl overflow-hidden animate-in fade-in zoom-in duration-300
                        ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
            <div className={`px-6 sm:px-8 py-4 sm:py-6 border-b flex justify-between items-center ${darkMode ? 'border-slate-800' : 'border-slate-100'}`}>
              <div>
                <h2 className={`text-lg sm:text-xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Add New Asset</h2>
                <p className={`text-xs font-medium ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Enter product details for the secure registry</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className={`p-2 rounded-full transition-colors ${darkMode ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-400'}`}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Asset Name</label>
                <input
                  required
                  className={`w-full px-4 py-3 rounded-xl border outline-none transition-all font-medium 
                                        ${darkMode ? 'bg-slate-800 border-slate-700 focus:border-[#F0B100] text-white' : 'bg-slate-50 border-slate-200 focus:border-[#F0B100] text-slate-700'}`}
                  placeholder="e.g. Titanium Fasteners"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              {/* Grid for other fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Category</label>
                  <select
                    className={`w-full px-4 py-3 rounded-xl border outline-none font-medium appearance-none
                                            ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-700'}`}
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                  >
                    {categories.filter(c => c !== "All").map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Unit</label>
                  <select
                    className={`w-full px-4 py-3 rounded-xl border outline-none font-medium appearance-none
                                            ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-700'}`}
                    value={formData.unit}
                    onChange={e => setFormData({ ...formData, unit: e.target.value })}
                  >
                    <option>Units</option><option>kg</option><option>Liters</option><option>Rolls</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Quantity</label>
                  <input type="number" required className={`w-full px-4 py-3 rounded-xl border outline-none font-medium ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-700'}`} value={formData.quantity} onChange={e => setFormData({ ...formData, quantity: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Cost Price</label>
                  <input type="number" required className={`w-full px-4 py-3 rounded-xl border outline-none font-medium ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-700'}`} value={formData.costPrice} onChange={e => setFormData({ ...formData, costPrice: e.target.value })} />
                </div>
              </div>

              <div className="pt-4 flex flex-col xs:flex-row gap-3">
                <button type="button" onClick={() => setShowAddModal(false)} className={`flex-1 py-3 text-sm font-bold rounded-xl transition-colors ${darkMode ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-500 hover:bg-slate-50'}`}>Cancel</button>
                <button type="submit" className="flex-1 py-3 bg-[#F0B100] text-slate-900 text-sm font-bold rounded-xl shadow-lg shadow-yellow-200/50 hover:bg-[#D49B00] transition-all flex items-center justify-center gap-2">
                  <Check size={18} /> Save Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className={`text-2xl sm:text-3xl font-black tracking-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}>Inventory Vault</h1>
          <p className={`mt-1 text-xs sm:text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Master System • <span className="text-[#D49B00] font-bold">{pendingCount} Items Low Stock</span>
          </p>
        </div>

        <div className={`flex p-1 rounded-xl border overflow-x-auto ${darkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200'}`}>
          {[
            { id: 'all-items', label: 'All Assets' },
            { id: 'low-stock', label: 'Low Stock' },
            { id: 'categories', label: 'Categories' },
            { id: 'settings', label: 'Configuration' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all capitalize whitespace-nowrap
                            ${activeTab === tab.id
                  ? 'bg-[#F0B100] text-slate-900 shadow-md'
                  : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-700 dark:text-slate-400'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content Body */}
      <div className="flex-1 overflow-y-auto">

        {/* VIEW: ALL ITEMS & LOW STOCK */}
        {(activeTab === 'all-items' || activeTab === 'low-stock') && (
          <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex justify-between items-center mb-4">
              <div className={`flex items-center px-4 py-2.5 rounded-xl border w-full max-w-md transition-all focus-within:ring-2 focus-within:ring-[#F0B100]/20 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                <Search size={18} className="text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Search by asset name, tag, or category..."
                  className="bg-transparent outline-none w-full text-sm font-medium placeholder:text-gray-400"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <button className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-bold hover:bg-gray-50 dark:hover:bg-slate-800 ${darkMode ? 'border-slate-700 text-gray-300' : 'border-slate-200 text-gray-600'}`}>
                  <Filter size={16} /> Filter
                </button>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#F0B100] hover:bg-[#D49B00] text-slate-900 rounded-xl text-sm font-bold shadow-lg shadow-yellow-200/50 transition-all hover:-translate-y-0.5"
                >
                  <PlusCircle size={18} /> Add Asset
                </button>
              </div>
            </div>

            {/* Inventory Table */}
            <div className={`rounded-2xl shadow-sm border overflow-hidden
                            ${darkMode ? 'bg-slate-800/40 border-slate-700' : 'bg-[#F9F7F1] border-slate-200'}`}>
              <div className="overflow-x-auto p-4">
                <table className="w-full text-sm text-left border-separate border-spacing-y-2 whitespace-nowrap">
                  <thead className={`text-xs uppercase font-bold tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-400'}`}>
                    <tr>
                      <th className="px-4 py-2 ml-2">Asset Profile</th>
                      <th className="px-4 py-2">Category</th>
                      <th className="px-4 py-2">Stock Level</th>
                      <th className="px-4 py-2">Valuation</th>
                      <th className="px-4 py-2">Status</th>
                      <th className="px-4 py-2 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInventory.map((item) => (
                      <tr key={item.id} className={`rounded-xl overflow-hidden transition-all duration-200 group hover:shadow-lg hover:scale-[1.005] cursor-pointer
                                                ${darkMode ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-white text-gray-900 hover:bg-white'}`}>

                        {/* Asset Name */}
                        <td className="px-4 py-4 rounded-l-xl border-l-4 border-transparent hover:border-indigo-500 transition-colors">
                          <div className="flex items-center">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold mr-4 shadow-sm flex-shrink-0
                                                            ${darkMode ? 'bg-slate-700 text-[#F0B100]' : 'bg-[#F0B100]/10 text-[#D49B00]'}`}>
                              {item.name.charAt(0)}
                            </div>
                            <div>
                              <div className="font-bold text-base">{item.name}</div>
                              <div className="text-xs text-gray-500 font-mono">#SKU-{item.id}</div>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="px-4 py-4 font-medium">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border
                                                        ${darkMode ? 'bg-slate-800 border-slate-600 text-slate-300' : 'bg-slate-50 border-slate-100 text-slate-600'}`}>
                            <Tag size={12} />
                            {item.category}
                          </span>
                        </td>

                        {/* Stock Level */}
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <Package size={16} className={item.quantity < 20 ? "text-rose-500" : "text-gray-400"} />
                            <span className={`font-mono font-bold text-base ${item.quantity < 20 ? "text-rose-600" : ""}`}>
                              {item.quantity}
                            </span>
                            <span className="text-xs text-gray-400 lowercase">{item.unit}</span>
                          </div>
                        </td>

                        {/* Valuation */}
                        <td className="px-4 py-4">
                          <div className="flex flex-col">
                            <span className="font-bold text-sm">Rs. {Number(item.costPrice).toLocaleString()}</span>
                            <span className="text-[10px] text-gray-400">Unit Cost</span>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-4 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold
                                                        ${item.quantity > 50 ? 'bg-emerald-100 text-emerald-700' :
                              item.quantity > 0 ? 'bg-amber-100 text-amber-700' :
                                'bg-rose-100 text-rose-700'}`}>
                            {item.quantity > 50 ? 'In Stock' : item.quantity > 0 ? 'Low Stock' : 'Out of Stock'}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-4 rounded-r-xl text-right">
                          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-2 rounded-lg bg-[#F0B100]/10 text-[#D49B00] hover:bg-[#F0B100]/20 transition-colors">
                              <Edit3 size={16} />
                            </button>
                            <button className="p-2 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* CATEGORIES TAB */}
        {activeTab === 'categories' && (
          <div className="grid-responsive-1-2-3">
            {categories.filter(c => c !== 'All').map((cat, i) => (
              <div key={i} className={`p-6 rounded-2xl border relative overflow-hidden group cursor-pointer
                                ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200 shadow-sm hover:shadow-lg transition-all'}`}>
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#F0B100]/10 to-transparent rounded-bl-full -mr-4 -mt-4 group-hover:scale-110 transition-transform"></div>
                <h3 className={`font-bold text-xl mb-1 ${darkMode ? 'text-white' : 'text-slate-800'}`}>{cat}</h3>
                <p className="text-[#D49B00] font-medium text-sm">{inventory.filter(i => i.category === cat).length} Assets</p>
                <span className={`inline-flex items-center gap-1 mt-4 px-3 py-1 rounded-full text-xs font-bold ${darkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-500'}`}>
                  View Collection <ArrowUpRight size={12} />
                </span>
              </div>
            ))}
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
          <div className="flex flex-col items-center justify-center h-96 text-gray-500">
            <div className={`p-6 rounded-full mb-6 ${darkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
              <Settings size={64} className="text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-700">Inventory Configuration</h3>
            <p className="max-w-md text-center mt-2 text-slate-400">Configure stock thresholds, automated re-ordering rules, and unit measurements here.</p>
            <button className="mt-8 px-8 py-3 bg-[#F0B100] text-slate-900 rounded-xl font-bold hover:bg-[#D49B00] transition-colors">
              Open Admin Panel
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default Inventory;