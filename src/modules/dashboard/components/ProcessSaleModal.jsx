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
                {/* Left: POS Form */}
                <div className="lg:col-span-2 overflow-y-auto bg-white relative flex flex-col">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        className="absolute right-6 top-6 z-10 hover:bg-slate-200 rounded-full text-slate-500 transition-colors"
                    >
                        <X size={20} />
                    </Button>

                    <div className="p-5 border-b border-slate-200 bg-white sticky top-0 z-10 flex flex-col justify-center min-h-[80px]">
                        <h2 className="text-xl font-black text-slate-900 flex items-center gap-3">
                            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                                <CreditCard size={20} />
                            </div>
                            New Transaction
                        </h2>
                        <p className="text-slate-500 text-xs font-medium ml-[44px]">Process a new sale and update inventory instantly.</p>
                    </div>

                    <div className="p-5 flex-1">
                        <form onSubmit={handleProcessSale} className="space-y-8">

                            {/* SECTION 0: TYPE */}
                            {/* SECTION 0: TYPE */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold">1</div>
                                    <h3 className="text-sm font-bold text-slate-900">Transaction Type</h3>
                                </div>
                                <div className="bg-slate-50 p-1.5 rounded-xl flex border border-slate-100">
                                    <button
                                        type="button"
                                        onClick={() => setSaleType("NEW")}
                                        className={`flex-1 py-3 text-sm font-bold uppercase tracking-wider rounded-lg transition-all ${saleType === "NEW"
                                            ? "bg-white text-blue-600 shadow-sm border border-slate-100"
                                            : "text-slate-400 hover:text-slate-600"
                                            }`}
                                    >
                                        New Bottle
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setSaleType("EXCHANGE")}
                                        className={`flex-1 py-3 text-sm font-bold uppercase tracking-wider rounded-lg transition-all ${saleType === "EXCHANGE"
                                            ? "bg-white text-emerald-600 shadow-sm border border-slate-100"
                                            : "text-slate-400 hover:text-slate-600"
                                            }`}
                                    >
                                        Exchange / Reuse
                                    </button>
                                </div>
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
                            <div className="space-y-2">
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
                                    <Search size={12} /> Cart Items
                                </h3>
                                <div className="grid grid-cols-12 gap-3">
                                    <div className="col-span-12 md:col-span-6 space-y-1">
                                        <label className="text-[10px] font-bold text-slate-400 ml-1 uppercase">Product</label>
                                        <div className="relative group">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={14} />
                                            <Input
                                                list="inventory-list-modal"
                                                value={saleForm.itemName}
                                                onChange={(e) => setSaleForm({ ...saleForm, itemName: e.target.value })}
                                                className="h-10 pl-9 text-sm font-bold bg-white border-slate-200 focus:border-indigo-500 rounded-lg transition-all shadow-sm focus:shadow-md"
                                                placeholder="Search..."
                                            />
                                            {/* Local datalist since it's isolated */}
                                            <datalist id="inventory-list-modal">
                                                {inventory.map(i => <option key={i.id} value={i.name}>{i.category} - Stock: {i.quantity}</option>)}
                                            </datalist>

                                            {selectedItem && (
                                                <div className="absolute right-2 top-1/2 -translate-y-1/2 bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded text-[9px] font-bold border border-emerald-100 flex items-center gap-1">
                                                    <CheckCircle2 size={8} /> {selectedItem.quantity}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="col-span-6 md:col-span-3 space-y-1">
                                        <label className="text-[10px] font-bold text-slate-400 ml-1 uppercase">Qty</label>
                                        <Input
                                            type="number"
                                            value={saleForm.quantity}
                                            onChange={(e) => setSaleForm({ ...saleForm, quantity: e.target.value })}
                                            className="h-10 text-center text-sm font-black text-slate-800 bg-white border-slate-200 focus:border-indigo-500 rounded-lg transition-all shadow-sm focus:shadow-md"
                                            placeholder="0"
                                        />
                                    </div>

                                    <div className="col-span-6 md:col-span-3 space-y-1">
                                        <label className="text-[10px] font-bold text-slate-400 ml-1 uppercase">Price</label>
                                        <Input
                                            type="number"
                                            value={saleForm.sellingPrice}
                                            onChange={(e) => setSaleForm({ ...saleForm, sellingPrice: e.target.value })}
                                            className="h-10 text-center text-sm font-bold text-slate-600 bg-white border-slate-200 focus:border-indigo-500 rounded-lg transition-all shadow-sm focus:shadow-md"
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* SECTION 3: PAYMENT */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold">3</div>
                                    <h3 className="text-sm font-bold text-slate-900">Payment</h3>
                                </div>
                                <div className="p-5 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl border border-slate-200">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            <label className="text-xs font-bold text-slate-500 uppercase">Quick Amounts</label>
                                            <div className="flex gap-2 flex-wrap">
                                                {[10, 20, 50, 100].map(amt => (
                                                    <button
                                                        key={amt}
                                                        type="button"
                                                        onClick={() => setSaleForm({ ...saleForm, amountPaid: amt })}
                                                        className="px-3 py-2 bg-white hover:bg-indigo-50 hover:text-indigo-600 rounded-lg text-xs font-bold transition-all border border-slate-200 shadow-sm"
                                                    >
                                                        ${amt}
                                                    </button>
                                                ))}
                                                <button
                                                    type="button"
                                                    onClick={() => setSaleForm({ ...saleForm, amountPaid: subtotal })}
                                                    className="px-3 py-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg text-xs font-bold transition-all border border-emerald-100 shadow-sm flex-1"
                                                >
                                                    Exact
                                                </button>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-500 uppercase">Amount Received</label>
                                            <div className="relative">
                                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                                <Input
                                                    type="number"
                                                    value={saleForm.amountPaid}
                                                    onChange={(e) => setSaleForm({ ...saleForm, amountPaid: e.target.value })}
                                                    className="h-12 pl-9 text-right text-xl font-black text-slate-900 bg-white border-slate-200 focus:border-emerald-500 rounded-xl transition-all shadow-sm"
                                                    placeholder="0.00"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Extra Payment Details - Show only if paying something */}
                                    {Number(saleForm.amountPaid) > 0 && (
                                        <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-200/60 animate-in slide-in-from-top-2">
                                            <div className="col-span-1">
                                                <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Method</label>
                                                <select
                                                    value={saleForm.paymentMethod}
                                                    onChange={e => setSaleForm({ ...saleForm, paymentMethod: e.target.value })}
                                                    className="w-full h-9 px-2 rounded-lg bg-white border border-slate-200 text-slate-700 text-xs font-bold focus:border-indigo-500 outline-none shadow-sm"
                                                >
                                                    <option>Cash</option>
                                                    <option>Bank Transfer</option>
                                                    <option>Cheque</option>
                                                    <option>Online</option>
                                                </select>
                                            </div>
                                            <div className="col-span-1">
                                                <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Reference</label>
                                                <Input
                                                    value={saleForm.reference}
                                                    onChange={e => setSaleForm({ ...saleForm, reference: e.target.value })}
                                                    className="h-9 text-xs bg-white border-slate-200"
                                                    placeholder="Optional Ref ID"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-end mt-4">
                                <Button
                                    type="submit"
                                    size="lg"
                                    className="h-11 px-8 text-sm uppercase tracking-widest font-black text-slate-900 shadow-lg shadow-yellow-200 bg-[#F0B100] hover:bg-[#D49B00] hover:scale-[1.01] transition-all rounded-lg"
                                >
                                    <CheckCircle2 size={18} className="mr-2" /> Confirm & Print Receipt
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Right: Receipt Preview */}
                {/* Right: Receipt Preview */}
                <div className="bg-white border-l border-slate-200 relative hidden lg:flex flex-col sticky top-0 h-[calc(100vh-100px)]">
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

