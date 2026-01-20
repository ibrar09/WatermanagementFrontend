import React, { useState, useMemo, useEffect } from "react";
import { useData } from "../../../context/DataContext";
import { Badge } from "../../../components/ui/Badge";
import {
  Search, Plus, Filter, Package, ChevronDown, AlertCircle,
  TrendingUp, Box, Layers, X, PlusCircle, Edit3, Trash2,
  Check, ShoppingBag, MoreHorizontal, ArrowUpRight,
  Database, Activity, LayoutGrid, List, SlidersHorizontal
} from "lucide-react";

/**
 * MOCK DATA CONTEXT REPLACEMENT
 * In a real app, these would come from your useData() hook.
 */
const Inventory = () => {
  // Mocking the context for the sake of a runnable demo
  const { inventory, addStock } = useData();

  const [isFormMode, setIsFormMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [viewMode, setViewMode] = useState("grid"); // grid or list

  const categories = ["All", "Construction", "Electronics", "Safety", "Machinery", "Chemicals", "Finished Goods", "Raw Material", "Packaging"];

  // Form State
  const [formData, setFormData] = useState({
    name: "", category: "Raw Material", quantity: "", unit: "Units", costPrice: "", sellingPrice: ""
  });

  const stats = {
    stockValue: inventory.reduce((acc, item) => acc + (Number(item.quantity) * Number(item.costPrice)), 0),
    lowStockCount: inventory.filter(i => i.quantity < 20).length,
    totalSkus: inventory.length
  };

  const filteredData = useMemo(() => {
    return inventory.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === "All" || item.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [inventory, searchTerm, categoryFilter]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newItem = {
      ...formData,
      quantity: Number(formData.quantity),
      costPrice: Number(formData.costPrice),
      sellingPrice: Number(formData.sellingPrice || 0)
    };
    addStock(newItem); // Use Context Action
    setIsFormMode(false);
    setFormData({ name: "", category: "Raw Material", quantity: "", unit: "Units", costPrice: "", sellingPrice: "" });
  };

  // Render Form Modal
  const RenderForm = () => (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-md bg-white/40">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Add New Asset</h2>
            <p className="text-xs text-slate-500 font-medium">Enter product details for the secure registry</p>
          </div>
          <button onClick={() => setIsFormMode(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Asset Name</label>
            <input
              required
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white outline-none transition-all font-medium text-slate-700"
              placeholder="e.g. Titanium Fasteners"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Category</label>
              <select
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white outline-none transition-all font-medium text-slate-700 appearance-none"
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
              >
                {categories.filter(c => c !== "All").map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Unit of Measure</label>
              <select
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none font-medium text-slate-700"
                value={formData.unit}
                onChange={e => setFormData({ ...formData, unit: e.target.value })}
              >
                <option>Units</option>
                <option>Rolls</option>
                <option>kg</option>
                <option>Liters</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Stock</label>
              <input
                type="number" required
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none font-medium text-slate-700"
                value={formData.quantity}
                onChange={e => setFormData({ ...formData, quantity: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Cost ($)</label>
              <input
                type="number" required step="0.01"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none font-medium text-slate-700"
                value={formData.costPrice}
                onChange={e => setFormData({ ...formData, costPrice: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Retail ($)</label>
              <input
                type="number" step="0.01"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none font-medium text-slate-700"
                value={formData.sellingPrice}
                onChange={e => setFormData({ ...formData, sellingPrice: e.target.value })}
              />
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={() => setIsFormMode(false)}
              className="flex-1 py-3 text-sm font-bold text-slate-500 hover:bg-slate-50 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-indigo-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
            >
              <Check size={18} />
              Save to Registry
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans antialiased selection:bg-indigo-100 selection:text-indigo-700">
      {isFormMode && <RenderForm />}

      <div className="max-w-[1400px] mx-auto px-6 py-8 lg:px-10 lg:py-12 space-y-10">

        {/* Navigation & Actions */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-1">
              <div className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-[10px] font-bold uppercase tracking-widest rounded-md">Master System</div>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-3">
              Inventory Vault
              <Database size={24} className="text-slate-300" />
            </h1>
            <p className="text-sm font-medium text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Data: {stats.totalSkus} Assets Identified
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:border-slate-300 hover:bg-slate-50 transition-all shadow-sm">
              <ShoppingBag size={18} className="text-slate-400" />
              Manifests
            </button>
            <button
              onClick={() => setIsFormMode(true)}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all"
            >
              <PlusCircle size={18} />
              Register Asset
            </button>
          </div>
        </header>

        {/* Stats Section */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "Total Valuation", value: `$${stats.stockValue.toLocaleString()}`, sub: "Live Asset Worth", color: "indigo", icon: TrendingUp },
            { label: "Stock Alerts", value: stats.lowStockCount, sub: "Critical Threshold", color: "rose", icon: AlertCircle },
            { label: "Active SKUs", value: stats.totalSkus, sub: "In-Registry Assets", color: "slate", icon: Box },
            { label: "Efficiency", value: "98.4%", sub: "Turnover Rate", color: "emerald", icon: Activity },
          ].map((stat, i) => {
            const colorStyles = {
              indigo: "border-r-indigo-500 bg-indigo-50 text-indigo-600",
              rose: "border-r-rose-500 bg-rose-50 text-rose-600",
              slate: "border-r-slate-500 bg-slate-100 text-slate-600",
              emerald: "border-r-emerald-500 bg-emerald-50 text-emerald-600",
            }[stat.color];

            return (
              <div key={i} className={`group relative bg-white p-6 rounded-2xl border-y-0 border-l-0 border-r-[6px] ${colorStyles.split(' ')[0]} shadow-sm hover:shadow-xl transition-all`}>
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-xl ${colorStyles.split(' ').slice(1).join(' ')}`}>
                    <stat.icon size={24} />
                  </div>
                  <div className="flex items-center text-emerald-500 text-[11px] font-bold">
                    +12% <ArrowUpRight size={12} />
                  </div>
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                <h3 className="text-3xl font-black text-slate-800 tracking-tight">{stat.value}</h3>
                <p className="text-[11px] font-medium text-slate-400 mt-1">{stat.sub}</p>
              </div>
            );
          })}
        </section>

        {/* Filter Controls */}
        <section className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={18} />
            <input
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border-none rounded-xl outline-none text-sm font-medium text-slate-700 placeholder:text-slate-400"
              placeholder="Search via product name or serial..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="relative min-w-[160px]">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <select
                className="w-full pl-10 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 outline-none appearance-none hover:border-slate-300 transition-colors"
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
              >
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={14} />
            </div>

            <div className="h-8 w-[1px] bg-slate-200 mx-1"></div>

            <div className="flex bg-slate-100 p-1 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}
              >
                <LayoutGrid size={18} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}
              >
                <List size={18} />
              </button>
            </div>

            <button className="p-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors">
              <SlidersHorizontal size={18} />
            </button>
          </div>
        </section>

        {/* Data Grid */}
        <main className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-4' : 'grid-cols-1'}`}>
          {filteredData.map((item) => {
            // Determine color based on Category or Status
            const getCategoryColor = (cat) => {
              switch (cat) {
                case "Construction": return "blue";
                case "Electronics": return "purple";
                case "Safety": return "amber";
                case "Machinery": return "slate";
                case "Chemicals": return "rose";
                default: return "emerald";
              }
            };
            const color = item.quantity < 20 ? "rose" : getCategoryColor(item.category);

            // Color styles map
            const colorStyles = {
              blue: "border-r-blue-500 bg-blue-50 text-blue-600",
              purple: "border-r-purple-500 bg-purple-50 text-purple-600",
              amber: "border-r-amber-500 bg-amber-100 text-amber-600",
              slate: "border-r-slate-500 bg-slate-100 text-slate-600",
              rose: "border-r-rose-500 bg-rose-50 text-rose-600",
              emerald: "border-r-emerald-500 bg-emerald-50 text-emerald-600",
            }[color];

            return (
              <div
                key={item.id}
                className={`bg-white group relative border border-slate-200 transition-all duration-300 overflow-hidden ${viewMode === 'grid'
                  ? `rounded-2xl p-6 flex flex-col gap-4 hover:shadow-xl hover:shadow-${color}-100 border-r-[6px] border-y-0 border-l-0 ${colorStyles.split(' ')[0]}` // Only border-r class
                  : 'rounded-xl p-4 px-6 flex items-center justify-between gap-6 hover:bg-slate-50 border-l-[6px] border-y-0 border-r-0 ' + colorStyles.split(' ')[0].replace('border-r-', 'border-l-') // Left border for list view
                  }`}
              >
                {/* Header Info */}
                <div className={`flex items-start ${viewMode === 'list' ? 'flex-row items-center gap-6 flex-1' : 'flex-col gap-4'}`}>
                  <div className={`rounded-xl flex items-center justify-center font-bold shrink-0 transition-transform group-hover:scale-110 shadow-sm
                  ${item.quantity < 20 ? 'bg-rose-100 text-rose-600' : colorStyles.split(' ').slice(1).join(' ')}
                  ${viewMode === 'grid' ? 'w-14 h-14 text-xl' : 'w-10 h-10 text-sm'}`}
                  >
                    {item.name.charAt(0)}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-extrabold text-slate-800 tracking-tight leading-tight truncate max-w-[180px]">
                        {item.name}
                      </h4>
                      {item.quantity < 20 && (
                        <span className="flex h-2 w-2 relative">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                        </span>
                      )}
                    </div>
                    <Badge variant="outline" className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-slate-100 bg-slate-50/50">
                      {item.category}
                    </Badge>
                  </div>
                </div>

                {/* Metrics */}
                <div className={`${viewMode === 'grid' ? 'grid grid-cols-2 gap-4 py-4 border-t border-dashed border-slate-100 mt-2' : 'flex items-center gap-12 w-1/2'}`}>
                  <div>
                    <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest mb-1">Stock Level</p>
                    <div className="flex items-baseline gap-1">
                      <span className={`text-xl font-extrabold tabular-nums ${item.quantity < 20 ? 'text-rose-500' : 'text-slate-800'}`}>
                        {item.quantity}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 lowercase">{item.unit}</span>
                    </div>
                  </div>
                  <div className={`${viewMode === 'list' ? '' : 'text-right'}`}>
                    <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest mb-1">Value</p>
                    <p className="text-xl font-extrabold text-slate-800 tabular-nums">${item.costPrice.toFixed(2)}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className={`flex items-center gap-2 ${viewMode === 'grid' ? 'justify-between mt-auto pt-2' : 'w-32 justify-end'}`}>
                  <div className={`${viewMode === 'grid' ? 'block' : 'hidden'}`}>
                    <span className="text-[10px] font-mono font-bold text-slate-300">#AG-{item.id}</span>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Edit3 size={14} />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredData.length === 0 && (
            <div className="col-span-full py-32 bg-white rounded-3xl border border-dashed border-slate-200 flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                <Package size={32} className="text-slate-200" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">No matching assets found</h3>
              <p className="text-sm font-medium text-slate-400 mt-1">Adjust your search or filter to see results</p>
              <button
                onClick={() => { setSearchTerm(""); setCategoryFilter("All") }}
                className="mt-6 text-xs font-bold text-indigo-600 hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Decorative Blur Elements */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-indigo-200/20 blur-[120px] rounded-full -z-10"></div>
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-emerald-200/10 blur-[120px] rounded-full -z-10"></div>
    </div>
  );
};

export default Inventory;