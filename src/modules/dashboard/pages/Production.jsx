import React, { useState, useEffect, useMemo } from "react";
import { useData } from "../../../context/DataContext";
import {
  PlusCircle,
  Factory,
  Trash2,
  ArrowRight,
  Package,
  AlertTriangle,
  Zap,
  Users,
  Calculator,
  Wand2,
  Search,
  ClipboardList,
  History,
  LayoutDashboard,
  Save,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  Scale
} from "lucide-react";

// Helper components
const Card = ({ children, className = "" }) => (
  <div className={`bg-white dark:bg-white/10 rounded-2xl shadow-sm border border-gray-100 dark:border-white/10 ${className}`}>
    {children}
  </div>
);

const Production = () => {
  const { inventory, productionHistory, recipes, recordProduction, addRecipe } = useData();
  const [activeTab, setActiveTab] = useState("overview");
  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [formData, setFormData] = useState({
    targetItem: "",
    targetQty: "",
    laborCost: "",
    overheadCost: "",
  });

  const [rawMaterials, setRawMaterials] = useState([{ name: "", quantity: "" }]);
  const [wasteItems, setWasteItems] = useState([{ name: "", quantity: "" }]);
  const [recipeName, setRecipeName] = useState("");

  // Stats for Overview Tab
  const stats = useMemo(() => {
    const totalRuns = productionHistory.length;
    const totalProduced = productionHistory.reduce((acc, curr) => acc + Number(curr.producedQty), 0);
    const avgCost = totalRuns > 0 ? (productionHistory.reduce((acc, curr) => acc + Number(curr.unitCost), 0) / totalRuns).toFixed(2) : "0.00";

    // Find item with most waste
    const wasteByItem = {};
    productionHistory.forEach(run => {
      if (run.wasteDetails) {
        run.wasteDetails.forEach(w => {
          wasteByItem[w.name] = (wasteByItem[w.name] || 0) + Number(w.quantity);
        });
      }
    });
    const mostWasted = Object.entries(wasteByItem).sort((a, b) => b[1] - a[1])[0] || ["None", 0];

    return { totalRuns, totalProduced, avgCost, mostWasted };
  }, [productionHistory]);

  const [estimatedUnitCost, setEstimatedUnitCost] = useState(0);

  useEffect(() => {
    if (!formData.targetQty || Number(formData.targetQty) <= 0) {
      setEstimatedUnitCost(0);
      return;
    }

    let materialCost = 0;
    rawMaterials.forEach(mat => {
      const item = inventory.find(i => i.name === mat.name);
      if (item && mat.quantity) {
        materialCost += (Number(item.costPrice) * Number(mat.quantity));
      }
    });

    const labor = Number(formData.laborCost) || 0;
    const overhead = Number(formData.overheadCost) || 0;
    const total = materialCost + labor + overhead;

    setEstimatedUnitCost(total / Number(formData.targetQty));
  }, [formData, rawMaterials, inventory]);

  // Form Actions
  const handleRecipeChange = (recipeId) => {
    const recipe = recipes.find(r => r.id === Number(recipeId));
    if (!recipe) return;

    setFormData({
      targetItem: recipe.outputItem,
      targetQty: 100, // default batch
      laborCost: "",
      overheadCost: ""
    });

    setRawMaterials(recipe.materials.map(m => ({ name: m.name, quantity: m.quantity * 100 })));
    setWasteItems([{ name: "", quantity: "" }]);
    setCurrentStep(2);
  };

  const handleAddMaterial = () => setRawMaterials([...rawMaterials, { name: "", quantity: "" }]);
  const handleRemoveMaterial = (index) => setRawMaterials(rawMaterials.filter((_, i) => i !== index));
  const handleMaterialChange = (index, field, value) => {
    const list = [...rawMaterials];
    list[index][field] = value;
    setRawMaterials(list);
  };

  const handleAddWaste = () => setWasteItems([...wasteItems, { name: "", quantity: "" }]);
  const handleRemoveWaste = (index) => setWasteItems(wasteItems.filter((_, i) => i !== index));
  const handleWasteChange = (index, field, value) => {
    const list = [...wasteItems];
    list[index][field] = value;
    setWasteItems(list);
  };

  const resetForm = () => {
    setFormData({ targetItem: "", targetQty: "", laborCost: "", overheadCost: "" });
    setRawMaterials([{ name: "", quantity: "" }]);
    setWasteItems([{ name: "", quantity: "" }]);
    setCurrentStep(1);
    setRecipeName("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validMaterials = rawMaterials.filter(m => m.name && m.quantity > 0);
    const validWaste = wasteItems.filter(w => w.name && w.quantity > 0);

    const success = recordProduction({
      outputItem: { name: formData.targetItem, quantity: Number(formData.targetQty) },
      usedMaterials: validMaterials.map(m => ({ name: m.name, quantity: Number(m.quantity) })),
      wasteItems: validWaste.map(w => ({ name: w.name, quantity: Number(w.quantity) })),
      laborCost: Number(formData.laborCost) || 0,
      overheadCost: Number(formData.overheadCost) || 0
    });

    if (success) {
      resetForm();
      setActiveTab("history");
    }
  };

  const handleSaveRecipe = () => {
    if (!formData.targetItem || !recipeName) {
      alert("Please provide a recipe name and target product.");
      return;
    }
    const validMaterials = rawMaterials.filter(m => m.name && m.quantity > 0);

    // Normalize to base unit (1 unit output)
    const baseOutput = Number(formData.targetQty) || 1;
    const materials = validMaterials.map(m => ({
      name: m.name,
      quantity: Number(m.quantity) / baseOutput
    }));

    addRecipe({
      name: recipeName,
      outputItem: formData.targetItem,
      materials
    });
    alert("Recipe saved successfully!");
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in p-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black text-gray-900 dark:text-white flex items-center gap-3">
            <Factory className="text-blue-600" size={36} />
            Production Center
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 font-medium">Smart manufacturing & waste management system.</p>
        </div>

        <div className="flex bg-gray-100 dark:bg-white/5 p-1 rounded-xl border border-gray-200 dark:border-white/10">
          {[
            { id: "overview", icon: LayoutDashboard, label: "Overview" },
            { id: "new", icon: PlusCircle, label: "New Run" },
            { id: "recipes", icon: ClipboardList, label: "Recipes" },
            { id: "history", icon: History, label: "History" }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); if (tab.id === 'new') resetForm(); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === tab.id
                  ? "bg-white dark:bg-white/20 text-blue-600 dark:text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
                }`}
            >
              <tab.icon size={18} />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8">
        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div className="space-y-8 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="p-6 border-l-4 border-l-blue-500">
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Total Runs</p>
                <div className="flex items-end justify-between mt-2">
                  <h3 className="text-3xl font-black text-gray-800 dark:text-white">{stats.totalRuns}</h3>
                  <ClipboardList className="text-blue-500 opacity-20" size={32} />
                </div>
              </Card>
              <Card className="p-6 border-l-4 border-l-green-500">
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Units Produced</p>
                <div className="flex items-end justify-between mt-2">
                  <h3 className="text-3xl font-black text-gray-800 dark:text-white">{stats.totalProduced.toLocaleString()}</h3>
                  <Package className="text-green-500 opacity-20" size={32} />
                </div>
              </Card>
              <Card className="p-6 border-l-4 border-l-purple-500">
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Avg Unit Cost</p>
                <div className="flex items-end justify-between mt-2">
                  <h3 className="text-3xl font-black text-gray-800 dark:text-white">${stats.avgCost}</h3>
                  <TrendingUp className="text-purple-500 opacity-20" size={32} />
                </div>
              </Card>
              <Card className="p-6 border-l-4 border-l-red-500">
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Most Waste Item</p>
                <div className="flex items-end justify-between mt-2">
                  <h3 className="text-xl font-black text-gray-800 dark:text-white truncate max-w-[150px]">{stats.mostWasted[0]}</h3>
                  <p className="text-xs font-bold text-red-500">-{stats.mostWasted[1]}</p>
                </div>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <Card className="lg:col-span-2 p-8">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
                  <TrendingUp className="text-blue-600" /> Recent Activity Insights
                </h3>
                <div className="space-y-4">
                  {productionHistory.slice(0, 5).map((run, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
                          <Factory size={20} />
                        </div>
                        <div>
                          <p className="font-bold text-gray-800 dark:text-white">{run.producedItem}</p>
                          <p className="text-xs text-gray-500">{run.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-green-600">+{run.producedQty}</p>
                        <p className="text-[10px] text-gray-400 font-bold">${run.totalCost.toLocaleString()} Total</p>
                      </div>
                    </div>
                  ))}
                  {productionHistory.length === 0 && (
                    <div className="py-12 text-center text-gray-400 italic">No production runs recorded yet.</div>
                  )}
                </div>
              </Card>

              <div className="space-y-6">
                <Card className="p-8 bg-gradient-to-br from-blue-600 to-indigo-700 text-white border-none shadow-xl">
                  <h3 className="text-lg font-bold mb-4">Launch New Run</h3>
                  <p className="text-blue-100 text-sm mb-8">Ready to start production? Use a saved recipe or start fresh.</p>
                  <button
                    onClick={() => setActiveTab("new")}
                    className="w-full py-4 bg-white text-blue-600 rounded-xl font-black shadow-lg hover:scale-[1.02] transition-all"
                  >
                    Start Production Run
                  </button>
                </Card>

                <Card className="p-8">
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Current Recipes</h3>
                  <div className="space-y-3">
                    {recipes.map((r, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-100 dark:border-white/5">
                        <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{r.name}</span>
                        <ChevronRight className="text-gray-400" size={16} />
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* NEW PRODUCTION RUN TAB */}
        {activeTab === "new" && (
          <div className="max-w-4xl mx-auto animate-fade-in">
            {/* Stepper Header */}
            <div className="flex items-center justify-between mb-10 px-4">
              {[
                { n: 1, label: "Product Setup" },
                { n: 2, label: "Raw Materials" },
                { n: 3, label: "Costs & Waste" }
              ].map(step => (
                <div key={step.n} className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black transition-all ${currentStep >= step.n
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                      : "bg-gray-200 text-gray-500"
                    }`}>
                    {currentStep > step.n ? <CheckCircle2 size={20} /> : step.n}
                  </div>
                  <span className={`text-sm font-bold hidden sm:block ${currentStep >= step.n ? "text-blue-600" : "text-gray-400"}`}>
                    {step.label}
                  </span>
                  {step.n < 3 && <div className={`w-12 h-[2px] ${currentStep > step.n ? "bg-blue-600" : "bg-gray-200"}`} />}
                </div>
              ))}
            </div>

            <Card className="p-8 shadow-xl">
              <form onSubmit={handleSubmit} className="space-y-8">

                {/* STEP 1: SETUP */}
                {currentStep === 1 && (
                  <div className="space-y-8 animate-fade-in">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-2xl border border-blue-100 dark:border-blue-500/20">
                      <h3 className="text-blue-900 dark:text-blue-100 font-bold mb-4 flex items-center gap-2">
                        <Wand2 size={20} /> Quick Start with Recipe
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {recipes.map(r => (
                          <button
                            key={r.id}
                            type="button"
                            onClick={() => handleRecipeChange(r.id)}
                            className="bg-white dark:bg-white/10 p-4 rounded-xl border border-blue-200 dark:border-blue-500/30 text-left hover:border-blue-500 hover:shadow-md transition-all group"
                          >
                            <p className="font-extrabold text-blue-700 dark:text-blue-300 group-hover:text-blue-800">{r.name}</p>
                            <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase mt-1">Output: {r.outputItem}</p>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Target Product</label>
                        <div className="relative">
                          <input
                            list="inventory-list"
                            value={formData.targetItem}
                            onChange={(e) => setFormData({ ...formData, targetItem: e.target.value })}
                            className="w-full p-4 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-gray-800 dark:text-white"
                            placeholder="Search finished goods..."
                          />
                          <Search className="absolute right-4 top-4 text-gray-400" size={20} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Batch Quantity</label>
                        <input
                          type="number"
                          value={formData.targetQty}
                          onChange={(e) => setFormData({ ...formData, targetQty: e.target.value })}
                          className="w-full p-4 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-black text-2xl text-blue-600"
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 2: RAW MATERIALS */}
                {currentStep === 2 && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="flex justify-between items-center bg-gray-50 dark:bg-white/5 p-4 rounded-2xl border border-gray-100 dark:border-white/5">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600">
                          <Package size={20} />
                        </div>
                        <h3 className="font-bold text-gray-800 dark:text-white">Materials Required</h3>
                      </div>
                      <button type="button" onClick={handleAddMaterial} className="text-xs font-black bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition">
                        ADD ITEM +
                      </button>
                    </div>

                    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
                      {rawMaterials.map((row, index) => (
                        <div key={index} className="flex gap-4 items-end animate-fade-in group">
                          <div className="flex-[2] space-y-1">
                            <input
                              list="inventory-list"
                              value={row.name}
                              onChange={(e) => handleMaterialChange(index, 'name', e.target.value)}
                              className="w-full p-4 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:border-blue-500 outline-none font-bold"
                              placeholder="Ingredient Name"
                            />
                          </div>
                          <div className="flex-1 space-y-1">
                            <input
                              type="number"
                              value={row.quantity}
                              onChange={(e) => handleMaterialChange(index, 'quantity', e.target.value)}
                              className="w-full p-4 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:border-blue-500 outline-none font-bold text-blue-600"
                              placeholder="Qty"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveMaterial(index)}
                            className="p-4 text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={24} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 3: COSTS & WASTE */}
                {currentStep === 3 && (
                  <div className="space-y-8 animate-fade-in">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <h3 className="font-bold text-gray-800 dark:text-white flex items-center gap-2">
                          <Users className="text-orange-500" size={20} /> Labor & Utilities
                        </h3>
                        <div className="grid grid-cols-1 gap-4">
                          <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Labor Cost ($)</label>
                            <input
                              type="number"
                              value={formData.laborCost}
                              onChange={(e) => setFormData({ ...formData, laborCost: e.target.value })}
                              className="w-full p-4 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl outline-none font-bold"
                              placeholder="0.00"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Overheads / Electricity ($)</label>
                            <input
                              type="number"
                              value={formData.overheadCost}
                              onChange={(e) => setFormData({ ...formData, overheadCost: e.target.value })}
                              className="w-full p-4 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl outline-none font-bold"
                              placeholder="0.00"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div className="flex justify-between items-center">
                          <h3 className="font-bold text-gray-800 dark:text-white flex items-center gap-2">
                            <AlertTriangle className="text-red-500" size={20} /> Waste Tracking
                          </h3>
                          <button type="button" onClick={handleAddWaste} className="text-[10px] font-black text-red-500 hover:text-red-700 uppercase">
                            + Add Waste
                          </button>
                        </div>
                        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                          {wasteItems.map((row, index) => (
                            <div key={index} className="flex gap-2 items-center animate-fade-in">
                              <input
                                list="inventory-list"
                                value={row.name}
                                onChange={(e) => handleWasteChange(index, 'name', e.target.value)}
                                className="flex-[2] p-3 bg-red-50/50 dark:bg-red-900/10 border border-red-100 dark:border-red-500/20 rounded-xl text-xs font-bold"
                                placeholder="Waste Item"
                              />
                              <input
                                type="number"
                                value={row.quantity}
                                onChange={(e) => handleWasteChange(index, 'quantity', e.target.value)}
                                className="flex-1 p-3 bg-red-50/50 dark:bg-red-900/10 border border-red-100 dark:border-red-500/20 rounded-xl text-xs font-bold text-red-600"
                                placeholder="Qty"
                              />
                              <button type="button" onClick={() => handleRemoveWaste(index)} className="p-2 text-red-300 hover:text-red-600 transition">
                                <Trash2 size={16} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-dashed border-gray-200 dark:border-white/10">
                      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-blue-50 dark:bg-blue-900/20 p-6 rounded-2xl border border-blue-100 dark:border-blue-500/20">
                        <div className="text-center sm:text-left">
                          <p className="text-xs font-black text-blue-900/40 dark:text-blue-100/40 uppercase tracking-widest">Est. Production Cost</p>
                          <p className="text-4xl font-black text-blue-600">${estimatedUnitCost.toFixed(2)} <span className="text-sm font-bold text-blue-400">/ unit</span></p>
                        </div>
                        <div className="flex flex-col gap-2 w-full sm:w-auto">
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={recipeName}
                              onChange={(e) => setRecipeName(e.target.value)}
                              placeholder="Recipe Title (optional)"
                              className="p-2.5 bg-white dark:bg-white/10 border border-blue-200 dark:border-blue-500/30 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                            />
                            <button
                              type="button"
                              onClick={handleSaveRecipe}
                              className="p-2.5 bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-300 rounded-xl hover:bg-blue-200 transition-all flex items-center justify-center"
                              title="Save as Recipe"
                            >
                              <Save size={20} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between items-center pt-8 border-t border-gray-100 dark:border-white/10">
                  <button
                    type="button"
                    onClick={() => currentStep > 1 ? setCurrentStep(currentStep - 1) : setActiveTab("overview")}
                    className="flex items-center gap-2 px-6 py-3 font-black text-gray-500 hover:text-gray-800 transition"
                  >
                    <ChevronLeft size={20} />
                    {currentStep === 1 ? "Exit" : "Back Step"}
                  </button>

                  {currentStep < 3 ? (
                    <button
                      type="button"
                      onClick={() => setCurrentStep(currentStep + 1)}
                      disabled={currentStep === 1 && (!formData.targetItem || !formData.targetQty)}
                      className="flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-2xl font-black shadow-lg shadow-blue-200 disabled:opacity-50 disabled:shadow-none hover:scale-[1.02] transition-all"
                    >
                      Continue <ChevronRight size={20} />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="flex items-center gap-2 px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-black shadow-xl shadow-blue-200 hover:scale-[1.05] transition-all"
                    >
                      Confirm & Start Production
                    </button>
                  )}
                </div>
              </form>
            </Card>
          </div>
        )}

        {/* RECIPES TAB */}
        {activeTab === "recipes" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {recipes.map(recipe => (
              <Card key={recipe.id} className="p-6 group relative overflow-hidden transition-all hover:shadow-xl hover:border-blue-500/50">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <ClipboardList size={80} />
                </div>
                <div className="relative z-10 h-full flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-black text-gray-800 dark:text-white mb-2">{recipe.name}</h3>
                    <div className="flex items-center gap-2 mb-6">
                      <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 text-[10px] font-black rounded-full uppercase tracking-widest">
                        {recipe.outputItem}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Base Ingredients</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {recipe.materials.map((m, i) => (
                          <span key={i} className="px-2 py-1 bg-gray-50 dark:bg-white/5 rounded-md text-[10px] text-gray-500 font-bold border border-gray-100 dark:border-white/5">
                            {m.name} ({m.quantity})
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleRecipeChange(recipe.id)}
                    className="mt-8 flex items-center justify-center gap-2 w-full py-3 bg-gray-900 text-white rounded-xl font-bold text-sm tracking-wide hover:bg-blue-600 transition-all"
                  >
                    Use This Recipe <Wand2 size={16} />
                  </button>
                </div>
              </Card>
            ))}
            <Card className="p-6 border-2 border-dashed border-gray-200 dark:border-white/10 flex flex-col items-center justify-center text-center group cursor-pointer hover:border-blue-400 transition-colors" onClick={() => setActiveTab("new")}>
              <div className="w-12 h-12 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400 group-hover:text-blue-500 transition-colors mb-4">
                <PlusCircle size={32} />
              </div>
              <h3 className="font-bold text-gray-500 group-hover:text-blue-600">Create From Run</h3>
              <p className="text-xs text-gray-400 mt-2">Start a new run to save as recipe</p>
            </Card>
          </div>
        )}

        {/* HISTORY TAB */}
        {activeTab === "history" && (
          <Card className="overflow-hidden animate-fade-in">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 dark:bg-white/5">
                  <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 dark:border-white/10">
                    <th className="p-6">Execution Date</th>
                    <th className="p-6">Manufactured Item</th>
                    <th className="p-6">Output</th>
                    <th className="p-6">Cost Breakdown</th>
                    <th className="p-6">Waste Metrics</th>
                    <th className="p-6">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-white/10">
                  {productionHistory.map((run) => (
                    <tr key={run.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                      <td className="p-6">
                        <p className="font-bold text-gray-800 dark:text-white text-sm">{run.date}</p>
                        <p className="text-[10px] text-gray-400">ID: #{run.id.toString().slice(-4)}</p>
                      </td>
                      <td className="p-6">
                        <p className="font-black text-blue-600 dark:text-blue-400">{run.producedItem}</p>
                      </td>
                      <td className="p-6">
                        <span className="text-sm font-black text-gray-800 dark:text-white">+{run.producedQty}</span>
                        <p className="text-[10px] text-gray-400 font-bold uppercase">Units</p>
                      </td>
                      <td className="p-6">
                        <p className="text-sm font-bold text-gray-800 dark:text-white">${run.unitCost}/unit</p>
                        <p className="text-[10px] text-gray-400">Total: ${run.totalCost.toLocaleString()}</p>
                      </td>
                      <td className="p-6">
                        <div className="flex items-center gap-1">
                          <Scale size={14} className={run.waste !== "None" ? "text-red-500" : "text-gray-300"} />
                          <span className={`text-xs font-bold ${run.waste !== "None" ? "text-red-500" : "text-gray-400"}`}>
                            {run.waste}
                          </span>
                        </div>
                      </td>
                      <td className="p-6">
                        <span className="px-3 py-1 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 text-[10px] font-black rounded-full uppercase">
                          SUCCESS
                        </span>
                      </td>
                    </tr>
                  ))}
                  {productionHistory.length === 0 && (
                    <tr>
                      <td colSpan="6" className="p-12 text-center text-gray-400 italic">No production logs available.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>

      {/* Datalist for autocomplete suggestions */}
      <datalist id="inventory-list">
        {inventory.map(i => <option key={i.id} value={i.name}>{i.category} - Stock: {i.quantity}</option>)}
      </datalist>
    </div>
  );
};

export default Production;
