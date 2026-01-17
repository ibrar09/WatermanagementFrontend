import React, { useState } from "react";
import { useData } from "../../../context/DataContext";
import {
    ShoppingCart,
    CheckCircle2,
    AlertCircle,
    ChevronRight,
    Plus,
    Trash2,
    FileText,
    Truck,
    Package,
    DollarSign
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Badge } from "../../../components/ui/Badge";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "../../../components/ui/Table";

const PurchaseForm = () => {
    const { inventory, addStock, purchases = [] } = useData();

    const [step, setStep] = useState(1);
    const [vendorDetails, setVendorDetails] = useState({
        name: "AquaSupplies Ltd",
        contact: "+92 300 1234567",
        paymentTerms: "Net 30"
    });

    const [items, setItems] = useState([
        { id: 1, name: "Raw Water (Bore)", quantity: 1000, unit: "Liters", cost: 0.5 }
    ]);

    const calculateTotal = () => items.reduce((acc, item) => acc + (item.quantity * item.cost), 0);

    const handleAddItem = () => {
        setItems([...items, { id: Date.now(), name: "", quantity: 0, unit: "Units", cost: 0 }]);
    };

    const removeItem = (id) => {
        setItems(items.filter(i => i.id !== id));
    };

    const updateItem = (id, field, value) => {
        setItems(items.map(i => i.id === id ? { ...i, [field]: value } : i));
    };

    const handleSubmit = () => {
        // In a real app, this would save to a database
        // For now, we simulate adding to inventory
        items.forEach(item => {
            addStock(item.id, item.quantity); // Using addStock from context
        });
        alert("Purchase Order Generated & Inventory Updated!");
        setStep(1);
        setItems([{ id: Date.now(), name: "", quantity: 0, unit: "Units", cost: 0 }]);
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-fade-in p-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Procurement</h1>
                    <p className="text-slate-500 mt-1">Manage vendor orders and raw material intake.</p>
                </div>
                <Button variant="outline" className="gap-2">
                    <FileText size={16} /> Purchase History
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Form Stepper */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm">
                        <CardHeader>
                            <div className="flex items-center justify-between mb-4">
                                <CardTitle>New Purchase Order</CardTitle>
                                <span className="text-xs font-bold px-3 py-1 bg-blue-100 text-blue-700 rounded-full">STEP {step} OF 3</span>
                            </div>
                            {/* Stepper Visual */}
                            <div className="flex items-center gap-2 w-full">
                                <div className={`h-2 flex-1 rounded-full transition-colors ${step >= 1 ? 'bg-blue-600' : 'bg-slate-200'}`} />
                                <div className={`h-2 flex-1 rounded-full transition-colors ${step >= 2 ? 'bg-blue-600' : 'bg-slate-200'}`} />
                                <div className={`h-2 flex-1 rounded-full transition-colors ${step >= 3 ? 'bg-blue-600' : 'bg-slate-200'}`} />
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {step === 1 && (
                                <div className="space-y-4 animate-slide-up">
                                    <h3 className="font-bold text-lg text-slate-800">Vendor Details</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-500 uppercase">Vendor Name</label>
                                            <Input
                                                value={vendorDetails.name}
                                                onChange={e => setVendorDetails({ ...vendorDetails, name: e.target.value })}
                                                className="font-semibold"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-500 uppercase">Contact</label>
                                            <Input
                                                value={vendorDetails.contact}
                                                onChange={e => setVendorDetails({ ...vendorDetails, contact: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {step === 2 && (
                                <div className="space-y-6 animate-slide-up">
                                    <h3 className="font-bold text-lg text-slate-800">Item Selection</h3>
                                    {items.map((item, index) => (
                                        <div key={item.id} className="flex flex-col md:flex-row gap-4 items-end p-4 bg-slate-50 rounded-xl border border-slate-100 relative group">
                                            <div className="flex-1 space-y-2 w-full">
                                                <label className="text-[10px] font-bold text-slate-400 uppercase">Item Name</label>
                                                <Input
                                                    value={item.name}
                                                    onChange={e => updateItem(item.id, 'name', e.target.value)}
                                                    placeholder="e.g. Raw Water"
                                                    list="inventory-list"
                                                />
                                            </div>
                                            <div className="w-24 space-y-2">
                                                <label className="text-[10px] font-bold text-slate-400 uppercase">Qty</label>
                                                <Input
                                                    type="number"
                                                    value={item.quantity}
                                                    onChange={e => updateItem(item.id, 'quantity', Number(e.target.value))}
                                                />
                                            </div>
                                            <div className="w-24 space-y-2">
                                                <label className="text-[10px] font-bold text-slate-400 uppercase">Cost</label>
                                                <Input
                                                    type="number"
                                                    value={item.cost}
                                                    onChange={e => updateItem(item.id, 'cost', Number(e.target.value))}
                                                />
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-red-400 hover:text-red-600 hover:bg-red-50"
                                                onClick={() => removeItem(item.id)}
                                                disabled={items.length === 1}
                                            >
                                                <Trash2 size={18} />
                                            </Button>
                                        </div>
                                    ))}
                                    <Button onClick={handleAddItem} variant="outline" className="w-full border-dashed">
                                        <Plus size={16} className="mr-2" /> Add Another Item
                                    </Button>
                                </div>
                            )}

                            {step === 3 && (
                                <div className="space-y-6 animate-slide-up">
                                    <h3 className="font-bold text-lg text-slate-800">Review Purchase Order</h3>
                                    <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                                        <div className="flex justify-between mb-4 pb-4 border-b border-slate-200">
                                            <span className="text-slate-500">Vendor</span>
                                            <span className="font-bold text-slate-900">{vendorDetails.name}</span>
                                        </div>
                                        <div className="space-y-2">
                                            {items.map(item => (
                                                <div key={item.id} className="flex justify-between text-sm">
                                                    <span>{item.name || "Untitled Item"} (x{item.quantity})</span>
                                                    <span className="font-mono font-bold">${(item.quantity * item.cost).toFixed(2)}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="flex justify-between mt-6 pt-4 border-t border-slate-300">
                                            <span className="text-lg font-black text-slate-900">Total</span>
                                            <span className="text-lg font-black text-emerald-600">${calculateTotal().toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex justify-between pt-6">
                                <Button
                                    variant="ghost"
                                    onClick={() => setStep(Math.max(1, step - 1))}
                                    disabled={step === 1}
                                >
                                    Back
                                </Button>
                                {step < 3 ? (
                                    <Button onClick={() => setStep(step + 1)} className="px-8">
                                        Next Step <ChevronRight size={16} className="ml-2" />
                                    </Button>
                                ) : (
                                    <Button onClick={handleSubmit} className="px-8 bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200 shadow-lg">
                                        <CheckCircle2 size={16} className="mr-2" /> Confirm Order
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right: Summary / History Preview */}
                <div className="space-y-6">
                    <Card className="bg-slate-900 text-white border-none shadow-2xl">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                                <Truck className="text-blue-400" /> Active Orders
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="p-4 bg-white/5 rounded-xl border border-white/10 flex items-center justify-between">
                                    <div>
                                        <p className="font-bold">#PO-2491</p>
                                        <p className="text-xs text-slate-400">Chemicals (Cl, O3)</p>
                                    </div>
                                    <Badge className="bg-blue-500/20 text-blue-300 border-none">On Route</Badge>
                                </div>
                                <div className="p-4 bg-white/5 rounded-xl border border-white/10 flex items-center justify-between">
                                    <div>
                                        <p className="font-bold">#PO-2490</p>
                                        <p className="text-xs text-slate-400">500ml Preforms</p>
                                    </div>
                                    <Badge className="bg-emerald-500/20 text-emerald-300 border-none">Received</Badge>
                                </div>
                            </div>
                            <Button className="w-full mt-6 bg-white/10 hover:bg-white/20 text-white border-none">
                                View All Purchases
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Inventory Datalist for Auto-complete */}
            <datalist id="inventory-list">
                {inventory.map(i => <option key={i.id} value={i.name} />)}
            </datalist>

        </div>
    );
};

export default PurchaseForm;
