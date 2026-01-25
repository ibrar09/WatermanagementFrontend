import React, { useState, useMemo } from "react";
import { X, Plus, Trash2, Fuel, Zap, Factory, CheckCircle2, Package, AlertTriangle } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Card, CardContent } from "../../../components/ui/Card";
import { useData } from "../../../context/DataContext";

const CreateBatchModal = ({ onClose }) => {
    const { inventory, recordProduction } = useData();

    const [form, setForm] = useState({
        batchId: `B-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        productName: "500ml PET Bottles",
        targetQuantity: "",
        laborCount: "",
        laborCost: "",
        units: "",
        unitCost: "",
    });

    const [rawMaterials, setRawMaterials] = useState([{ id: 1, name: "", quantity: "" }]);
    const [wastes, setWastes] = useState([{ id: 1, type: "Caps", quantity: "" }]);

    // Filter for raw materials from inventory
    const inventoryRawMaterials = useMemo(() =>
        inventory.filter(i => i.category === "Raw Material" || i.category === "Packaging"),
        [inventory]);

    /* -------- Calculations -------- */
    const totals = useMemo(() => {
        const labor = (+form.laborCount || 0) * (+form.laborCost || 0);
        const electricity = (+form.units || 0) * (+form.unitCost || 0);

        // Calculate Raw Material Cost
        const materialCost = rawMaterials.reduce((acc, mat) => {
            const stockItem = inventory.find(i => i.name === mat.name);
            const unitCost = stockItem ? Number(stockItem.costPrice) : 0;
            return acc + (Number(mat.quantity) * unitCost);
        }, 0);

        const total = labor + electricity + materialCost;
        const perBottle = form.targetQuantity > 0 ? (total / form.targetQuantity).toFixed(2) : "0.00";
        return { labor, electricity, materialCost, total, perBottle };
    }, [form, rawMaterials, inventory]);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    // Raw Material Handlers
    const addMaterial = () => setRawMaterials([...rawMaterials, { id: Date.now(), name: "", quantity: "" }]);
    const updateMaterial = (id, key, value) => setRawMaterials(rawMaterials.map(m => m.id === id ? { ...m, [key]: value } : m));
    const removeMaterial = (id) => setRawMaterials(rawMaterials.filter(m => m.id !== id));

    const addWaste = () => setWastes([...wastes, { id: Date.now(), type: "Labels", quantity: "" }]);
    const updateWaste = (id, key, value) => setWastes(wastes.map(w => w.id === id ? { ...w, [key]: value } : w));
    const removeWaste = (id) => setWastes(wastes.filter(w => w.id !== id));

    const handleStartBatch = () => {
        if (!form.productName || !form.targetQuantity) return alert("Please fill detailed batch info");

        const success = recordProduction({
            outputItem: { name: form.productName, quantity: Number(form.targetQuantity) },
            usedMaterials: rawMaterials,
            wasteItems: wastes.map(w => ({ name: w.type, quantity: w.quantity })),
            laborCost: totals.labor,
            overheadCost: totals.electricity
        });

        if (success) {
            alert("Batch Production Started & Inventory Updated!");
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-in fade-in">
            <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border-none bg-[#F9F7F1] ring-1 ring-slate-200">
                <div className="sticky top-0 z-10 bg-[#3A4D4E] border-b border-[#2C3E3F] p-6 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-black text-white flex items-center gap-2">
                            <Factory className="text-[#F0B100]" /> Start Production Batch
                        </h2>
                        <p className="text-slate-300 text-sm font-medium">Configure parameters for new manufacturing run.</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full text-white hover:bg-white/10">
                        <X size={24} />
                    </Button>
                </div>

                <CardContent className="p-8 space-y-8">
                    {/* SECTION 1: BATCH INFO */}
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <CheckCircle2 size={14} /> Batch Configuration
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 ml-1">Batch ID</label>
                                <Input disabled value={form.batchId} className="bg-white font-mono font-bold text-slate-400" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 ml-1">Product Type</label>
                                <div className="relative">
                                    <Input
                                        list="products-list"
                                        name="productName"
                                        value={form.productName}
                                        onChange={handleChange}
                                        className="bg-white font-bold text-slate-700"
                                        placeholder="Select or Enter Product"
                                    />
                                    <datalist id="products-list">
                                        <option>500ml PET Bottles</option>
                                        <option>1.5L PET Bottles</option>
                                        <option>19L Gallon Refill</option>
                                        <option>Premium Glass 750ml</option>
                                    </datalist>
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 ml-1">Target Quantity</label>
                                <Input
                                    type="number"
                                    name="targetQuantity"
                                    placeholder="e.g. 5000"
                                    value={form.targetQuantity}
                                    onChange={handleChange}
                                    className="text-lg font-black text-blue-600"
                                />
                            </div>
                        </div>
                    </div>

                    {/* SECTION 2: RAW MATERIALS (NEW) */}
                    <div className="border border-slate-100 rounded-2xl p-6 shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <Package size={14} /> Raw Materials
                            </h3>
                            <Button size="sm" variant="ghost" onClick={addMaterial} className="text-indigo-600 hover:bg-indigo-50 h-8 text-xs font-bold">
                                + Add Material
                            </Button>
                        </div>
                        <div className="space-y-3">
                            {rawMaterials.map((mat) => {
                                const stockItem = inventory.find(i => i.name === mat.name);
                                const isLowStock = stockItem && stockItem.quantity < Number(mat.quantity);

                                return (
                                    <div key={mat.id} className="flex flex-col md:flex-row gap-3 items-start md:items-center bg-slate-50/50 p-2 rounded-xl">
                                        <div className="flex-1 w-full relative">
                                            <Input
                                                list="raw-materials-list"
                                                placeholder="Select Material..."
                                                value={mat.name}
                                                onChange={(e) => updateMaterial(mat.id, "name", e.target.value)}
                                                className="bg-white"
                                            />
                                            {stockItem && (
                                                <div className={`text-[10px] mt-1 font-bold flex items-center gap-1 ${isLowStock ? "text-rose-500" : "text-emerald-500"}`}>
                                                    {isLowStock ? <AlertTriangle size={10} /> : <CheckCircle2 size={10} />}
                                                    Available: {stockItem.quantity} {stockItem.unit}
                                                </div>
                                            )}
                                        </div>
                                        <div className="w-full md:w-32">
                                            <Input
                                                type="number"
                                                placeholder="Qty"
                                                value={mat.quantity}
                                                onChange={(e) => updateMaterial(mat.id, "quantity", e.target.value)}
                                                className="bg-white"
                                            />
                                        </div>
                                        <button onClick={() => removeMaterial(mat.id)} className="p-2 text-slate-400 hover:text-rose-500 transition-colors">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                        <datalist id="raw-materials-list">
                            {inventoryRawMaterials.map(i => <option key={i.id} value={i.name} />)}
                        </datalist>
                    </div>

                    {/* SECTION 3: COSTS & UTILITIES */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* LABOR */}
                        <div className="border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Factory size={14} /> Labor Inputs
                            </h3>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-slate-400">Workers</label>
                                        <Input
                                            type="number"
                                            name="laborCount"
                                            placeholder="0"
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-slate-400">Cost/Worker</label>
                                        <Input
                                            type="number"
                                            name="laborCost"
                                            placeholder="0.00"
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div className="bg-slate-50 p-3 rounded-xl flex justify-between items-center">
                                    <span className="text-xs font-bold text-slate-500">Total Labor Cost</span>
                                    <span className="font-black text-slate-800">${totals.labor.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        {/* ELECTRICITY */}
                        <div className="border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Zap size={14} /> Energy Consumption
                            </h3>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-slate-400">Units (kWh)</label>
                                        <Input
                                            type="number"
                                            name="units"
                                            placeholder="0"
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-slate-400">Cost/Unit</label>
                                        <Input
                                            type="number"
                                            name="unitCost"
                                            placeholder="0.00"
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div className="bg-yellow-50 p-3 rounded-xl flex justify-between items-center border border-yellow-100">
                                    <span className="text-xs font-bold text-yellow-700">Total Energy Cost</span>
                                    <span className="font-black text-yellow-800">${totals.electricity.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SECTION 4: WASTE LOGGING */}
                    <div className="border border-slate-100 rounded-2xl p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <Trash2 size={14} /> Expected Waste / Scrap
                            </h3>
                            <Button size="sm" variant="ghost" onClick={addWaste} className="text-rose-500 hover:bg-rose-50 hover:text-rose-600 h-8 text-xs font-bold">
                                + Add Waste Item
                            </Button>
                        </div>
                        <div className="space-y-3">
                            {wastes.map((waste) => (
                                <div key={waste.id} className="flex gap-3 items-center">
                                    <select
                                        value={waste.type}
                                        onChange={(e) => updateWaste(waste.id, "type", e.target.value)}
                                        className="h-10 flex-1 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-rose-500 outline-none"
                                    >
                                        <option>Plastic Caps</option>
                                        <option>Labels</option>
                                        <option>Damaged Pre-forms</option>
                                        <option>Packaging Film</option>
                                        <option>Other</option>
                                    </select>
                                    <Input
                                        type="number"
                                        placeholder="Qty"
                                        value={waste.quantity}
                                        onChange={(e) => updateWaste(waste.id, "quantity", e.target.value)}
                                        className="w-24 h-10"
                                    />
                                    <button onClick={() => removeWaste(waste.id)} className="p-2 text-slate-400 hover:text-rose-500 transition-colors">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* FOOTER */}
                    <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                        <div className="text-left">
                            <p className="text-xs font-bold text-slate-400 uppercase">Estimated Production Cost</p>
                            <p className="text-3xl font-black text-slate-900">${totals.total.toLocaleString()}</p>
                            <div className="flex gap-4 text-xs font-medium text-slate-500">
                                <span>~ ${totals.perBottle} / unit</span>
                                <span className="text-blue-500">Materials: ${totals.materialCost.toLocaleString()}</span>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <Button variant="ghost" size="lg" onClick={onClose} className="font-bold text-slate-500">Cancel</Button>
                            <Button
                                size="lg"
                                onClick={handleStartBatch}
                                className="bg-[#F0B100] hover:bg-[#D49B00] text-slate-900 shadow-xl shadow-yellow-200/50 font-black uppercase tracking-wider px-8"
                            >
                                Confirm & Start Batch
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default CreateBatchModal;
