import React, { useState, useEffect } from "react";
import {
    X, CreditCard, ChevronRight, Search, CheckCircle2,
    DollarSign, Wallet, Users
} from "lucide-react";
import { Card, CardContent } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";

const ProcessSaleModal = ({
    isOpen,
    onClose,
    onSubmit,
    inventory,
    customers,
    onAddCustomer
}) => {
    // Local State
    const [saleType, setSaleType] = useState("NEW");
    const [saleForm, setSaleForm] = useState({
        clientName: "Walk-in",
        itemName: "",
        quantity: "",
        sellingPrice: "",
        amountPaid: "",
        paymentMethod: "Cash",
        reference: ""
    });
    const [selectedItem, setSelectedItem] = useState(null);

    // Sync selected item details when itemName changes
    useEffect(() => {
        if (saleForm.itemName) {
            const item = inventory.find(i => i.name === saleForm.itemName);
            setSelectedItem(item || null);
            if (item && !saleForm.sellingPrice) {
                setSaleForm(prev => ({ ...prev, sellingPrice: item.sellingPrice }));
            }
        } else {
            setSelectedItem(null);
        }
    }, [saleForm.itemName, inventory, saleForm.sellingPrice]);

    const handleProcessSale = (e) => {
        e.preventDefault();
        onSubmit(saleForm, saleType);
        // Reset form or close modal handled by parent usually, but we can reset here if needed
        setSaleForm({
            clientName: "Walk-in",
            itemName: "",
            quantity: "",
            sellingPrice: "",
            amountPaid: "",
            paymentMethod: "Cash",
            reference: ""
        });
    };

    if (!isOpen) return null;

    // Calculations for Receipt Preview
    const subtotal = (Number(saleForm.quantity || 0) * Number(saleForm.sellingPrice || 0));
    const balanceDue = Math.max(0, subtotal - Number(saleForm.amountPaid || 0));
    const isPaid = Number(saleForm.amountPaid) >= subtotal;

    return (
        <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="w-full rounded-3xl shadow-2xl border border-slate-200 bg-white grid grid-cols-1 lg:grid-cols-3">

                {/* Left: POS Form */}
                <div className="lg:col-span-2 overflow-y-auto bg-slate-50 relative flex flex-col">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        className="absolute right-6 top-6 z-10 hover:bg-slate-200 rounded-full text-slate-500 transition-colors"
                    >
                        <X size={20} />
                    </Button>

                    <div className="p-8 border-b border-slate-200 bg-white sticky top-0 z-10">
                        <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                            <div className="p-2.5 bg-indigo-100 text-indigo-600 rounded-xl">
                                <CreditCard size={24} />
                            </div>
                            New Transaction
                        </h2>
                        <p className="text-slate-500 mt-1 font-medium ml-[52px]">Process a new sale and update inventory instantly.</p>
                    </div>

                    <div className="p-8 flex-1">
                        <form onSubmit={handleProcessSale} className="space-y-8">

                            {/* SECTION 0: TYPE */}
                            <div className="bg-slate-100 p-1.5 rounded-xl flex shadow-inner">
                                <button
                                    type="button"
                                    onClick={() => setSaleType("NEW")}
                                    className={`flex-1 py-3 text-sm font-bold uppercase tracking-wider rounded-lg transition-all ${saleType === "NEW"
                                        ? "bg-white text-blue-600 shadow-sm"
                                        : "text-slate-400 hover:text-slate-600"
                                        }`}
                                >
                                    New Bottle
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setSaleType("EXCHANGE")}
                                    className={`flex-1 py-3 text-sm font-bold uppercase tracking-wider rounded-lg transition-all ${saleType === "EXCHANGE"
                                        ? "bg-white text-emerald-600 shadow-sm"
                                        : "text-slate-400 hover:text-slate-600"
                                        }`}
                                >
                                    Exchange / Reuse
                                </button>
                            </div>

                            {/* SECTION 1: CUSTOMER */}
                            <div className="p-6 bg-white rounded-2xl border border-slate-200 space-y-4 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <Users size={14} /> Customer
                                    </h3>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={onAddCustomer}
                                        className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 h-8 text-xs font-bold transition-colors"
                                    >
                                        + Register New
                                    </Button>
                                </div>
                                <div className="relative">
                                    <select
                                        value={saleForm.clientName}
                                        onChange={(e) => setSaleForm({ ...saleForm, clientName: e.target.value })}
                                        className="w-full h-12 pl-4 pr-10 bg-slate-50 border border-slate-200 shadow-sm rounded-xl font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none transition-all text-sm outline-none"
                                    >
                                        <option value="Walk-in">Walk-in Customer</option>
                                        {customers.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                                    </select>
                                    <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 rotate-90 pointer-events-none" size={16} />
                                </div>
                            </div>

                            {/* SECTION 2: PRODUCT */}
                            <div className="space-y-4">
                                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
                                    <Search size={14} /> Cart Items
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1.5 md:col-span-2">
                                        <label className="text-[10px] font-bold text-slate-400 ml-1 uppercase">Product Name</label>
                                        <div className="relative group">
                                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                                            <Input
                                                list="inventory-list-modal"
                                                value={saleForm.itemName}
                                                onChange={(e) => setSaleForm({ ...saleForm, itemName: e.target.value })}
                                                className="h-12 pl-11 text-base font-bold bg-white border-slate-200 focus:border-indigo-500 rounded-xl transition-all shadow-sm focus:shadow-md"
                                                placeholder="Search product..."
                                            />
                                            {/* Local datalist since it's isolated */}
                                            <datalist id="inventory-list-modal">
                                                {inventory.map(i => <option key={i.id} value={i.name}>{i.category} - Stock: {i.quantity}</option>)}
                                            </datalist>

                                            {selectedItem && (
                                                <div className="absolute right-3 top-1/2 -translate-y-1/2 bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-lg text-[10px] font-bold border border-emerald-100 flex items-center gap-1">
                                                    <CheckCircle2 size={10} /> {selectedItem.quantity} in stock
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-slate-400 ml-1 uppercase">Quantity</label>
                                        <Input
                                            type="number"
                                            value={saleForm.quantity}
                                            onChange={(e) => setSaleForm({ ...saleForm, quantity: e.target.value })}
                                            className="h-12 text-center text-lg font-black text-slate-800 bg-white border-slate-200 focus:border-indigo-500 rounded-xl transition-all shadow-sm focus:shadow-md"
                                            placeholder="0"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-slate-400 ml-1 uppercase">Price / Unit ($)</label>
                                        <Input
                                            type="number"
                                            value={saleForm.sellingPrice}
                                            onChange={(e) => setSaleForm({ ...saleForm, sellingPrice: e.target.value })}
                                            className="h-12 text-center text-lg font-bold text-slate-600 bg-white border-slate-200 focus:border-indigo-500 rounded-xl transition-all shadow-sm focus:shadow-md"
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* SECTION 3: PAYMENT */}
                            <div className="p-6 bg-slate-900 text-white rounded-2xl shadow-xl shadow-slate-200 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                                    <DollarSign size={100} />
                                </div>

                                <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
                                    <div className="space-y-3">
                                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                            <Wallet size={14} /> Payment Entry
                                        </h3>
                                        <div className="flex gap-2 flex-wrap">
                                            {[10, 20, 50, 100].map(amt => (
                                                <button
                                                    key={amt}
                                                    type="button"
                                                    onClick={() => setSaleForm({ ...saleForm, amountPaid: amt })}
                                                    className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold transition-colors border border-white/5"
                                                >
                                                    ${amt}
                                                </button>
                                            ))}
                                            <button
                                                type="button"
                                                onClick={() => setSaleForm({ ...saleForm, amountPaid: subtotal })}
                                                className="px-3 py-1.5 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 rounded-lg text-xs font-bold transition-colors border border-emerald-500/50"
                                            >
                                                Exact
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase">Total Received ($)</label>
                                        <Input
                                            type="number"
                                            value={saleForm.amountPaid}
                                            onChange={(e) => setSaleForm({ ...saleForm, amountPaid: e.target.value })}
                                            className="h-14 text-right text-2xl font-black text-emerald-400 bg-white/5 border-white/10 focus:border-emerald-500 rounded-xl placeholder:text-slate-700 transition-all font-mono"
                                            placeholder="0.00"
                                        />
                                    </div>

                                    {/* Extra Payment Details - Show only if paying something */}
                                    {Number(saleForm.amountPaid) > 0 && (
                                        <div className="md:col-span-2 grid grid-cols-2 gap-3 mt-4 animate-fade-in text-slate-800">
                                            <div className="col-span-2 sm:col-span-1">
                                                <label className="text-[10px] font-bold text-slate-400 uppercase">Method</label>
                                                <select
                                                    value={saleForm.paymentMethod}
                                                    onChange={e => setSaleForm({ ...saleForm, paymentMethod: e.target.value })}
                                                    className="w-full h-10 px-3 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs font-bold focus:border-emerald-500 outline-none"
                                                >
                                                    <option>Cash</option>
                                                    <option>Bank Transfer</option>
                                                    <option>Cheque</option>
                                                    <option>Online</option>
                                                </select>
                                            </div>
                                            <div className="col-span-2 sm:col-span-1">
                                                <label className="text-[10px] font-bold text-slate-400 uppercase">Reference</label>
                                                <Input
                                                    value={saleForm.reference}
                                                    onChange={e => setSaleForm({ ...saleForm, reference: e.target.value })}
                                                    className="h-10 text-xs bg-slate-800 border-slate-700 text-white placeholder:text-slate-600"
                                                    placeholder="Ref (Opt)"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <Button
                                type="submit"
                                size="lg"
                                className="w-full h-14 text-base uppercase tracking-widest font-black text-slate-900 shadow-lg shadow-yellow-200 bg-[#F0B100] hover:bg-[#D49B00] hover:scale-[1.01] transition-all rounded-xl mt-6"
                            >
                                <CheckCircle2 size={20} className="mr-3" /> Confirm & Print Receipt
                            </Button>
                        </form>
                    </div>
                </div>

                {/* Right: Receipt Preview */}
                <div className="bg-white border-l border-slate-200 relative hidden lg:flex flex-col">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>
                    {/* Receipt Top jagged edge */}
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-b from-slate-100 to-transparent" />

                    <div className="p-8 h-full flex flex-col relative z-10">
                        <div className="text-center pb-6 border-b-2 border-dashed border-slate-200 mb-6">
                            <div className="w-12 h-12 bg-slate-900 text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-xl shadow-lg">W</div>
                            <h3 className="text-lg font-black uppercase tracking-widest text-slate-900">Official Receipt</h3>
                            <p className="text-xs text-slate-400 font-medium">WaterSys Logistics Inc.</p>
                            <p className="text-[10px] text-slate-300 mt-1">{new Date().toLocaleDateString()} • {new Date().toLocaleTimeString()}</p>
                        </div>

                        <div className="flex-1 space-y-4 font-mono text-sm">
                            <div className="flex justify-between items-start">
                                <span className="text-slate-500 font-bold">Billed To:</span>
                                <span className="font-bold text-slate-900 text-right max-w-[150px]">{saleForm.clientName}</span>
                            </div>

                            <div className="py-4 border-y border-dashed border-slate-100 space-y-3 my-4">
                                <div className="flex justify-between items-center text-slate-900">
                                    <span className="font-bold">{saleForm.itemName || "Item"}</span>
                                    <span>x{saleForm.quantity || 0}</span>
                                </div>
                                <div className="flex justify-between items-center text-slate-500 text-xs">
                                    <span>@ ${Number(saleForm.sellingPrice || 0).toFixed(2)} / unit</span>
                                    <span className="font-bold text-slate-800">${subtotal.toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="space-y-2 pt-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-500 font-bold">Subtotal</span>
                                    <span className="font-bold text-slate-900">${subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-500 font-bold">Tax (0%)</span>
                                    <span className="font-bold text-slate-900">$0.00</span>
                                </div>
                                <div className="flex justify-between items-center text-lg pt-2 border-t border-slate-200">
                                    <span className="font-black text-slate-900">TOTAL</span>
                                    <span className="font-black text-indigo-600">${subtotal.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t-2 border-dashed border-slate-200">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs font-bold text-slate-500 uppercase">Paid Amount</span>
                                <span className="font-bold text-emerald-600">${Number(saleForm.amountPaid || 0).toLocaleString()}</span>
                            </div>
                            <div className="bg-slate-50 p-4 rounded-xl flex justify-between items-center border border-slate-100">
                                <p className="text-xs font-black uppercase tracking-widest text-rose-500">Balance Due</p>
                                <p className="text-2xl font-black text-rose-600">
                                    ${balanceDue.toLocaleString()}
                                </p>
                            </div>
                            <p className="text-[10px] text-center text-slate-300 mt-6 uppercase tracking-widest font-bold">Thank you for your business</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProcessSaleModal;

