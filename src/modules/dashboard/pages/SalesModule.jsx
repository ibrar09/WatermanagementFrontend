import React, { useState, useMemo } from "react";
import { useData } from "../../../context/DataContext";
import {
    ShoppingCart, Users, History, Search, Plus, CreditCard, Wallet,
    ArrowUpRight, ArrowDownRight, Clock, CheckCircle2, AlertCircle,
    MoreVertical, ChevronRight, Filter, DollarSign, UserPlus, X, Activity
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Badge } from "../../../components/ui/Badge";
import {
    Table, TableHeader, TableBody, TableHead, TableRow, TableCell
} from "../../../components/ui/Table";

const SalesModule = () => {
    const { inventory, transactions, customers, sellStock, addCustomer, collectPayment } = useData();
    const [activeTab, setActiveTab] = useState("new-sale");

    // New Sale State
    const [saleType, setSaleType] = useState("NEW"); // NEW or EXCHANGE
    const [saleForm, setSaleForm] = useState({
        itemName: "",
        quantity: "",
        sellingPrice: "",
        clientName: "Walk-in",
        amountPaid: "",
    });

    // Customer Form State
    const [customerForm, setCustomerForm] = useState({
        name: "",
        phone: "",
        address: ""
    });

    const [showAddCustomer, setShowAddCustomer] = useState(false);

    // Derived Data
    const filteredInventory = inventory.filter(i => i.quantity > 0);
    const selectedItem = inventory.find(i => i.name === saleForm.itemName);

    const totalRevenue = useMemo(() =>
        transactions.filter(t => t.type === 'SELL').reduce((acc, curr) => acc + Number(curr.total), 0),
        [transactions]);

    const totalOutstanding = useMemo(() =>
        customers.reduce((acc, curr) => acc + Number(curr.balance || 0), 0),
        [customers]);

    const salesHistory = useMemo(() =>
        transactions.filter(t => t.type === 'SELL' || t.type === 'PAYMENT'),
        [transactions]);

    // Handlers
    const handleProcessSale = (e) => {
        e.preventDefault();
        if (!saleForm.itemName || !saleForm.quantity) return alert("Please fill items and quantity");

        const success = sellStock({
            name: saleForm.itemName,
            quantity: Number(saleForm.quantity),
            sellingPrice: Number(saleForm.sellingPrice || (selectedItem ? selectedItem.sellingPrice : 0)),
            client: saleForm.clientName,
            amountPaid: Number(saleForm.amountPaid || 0),
            saleType: saleType // Pass the selected type
        });

        if (success) {
            setSaleForm({ itemName: "", quantity: "", sellingPrice: "", clientName: "Walk-in", amountPaid: "" });
            alert("Sale Recorded Successfully!");
            setActiveTab("history");
        }
    };

    const handleCreateCustomer = (e) => {
        e.preventDefault();
        addCustomer(customerForm);
        setCustomerForm({ name: "", phone: "", address: "" });
        setShowAddCustomer(false);
        alert("Customer Added!");
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-fade-in p-2 sm:p-4">
            {/* Header & Stats */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <div className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-[10px] font-bold uppercase tracking-widest rounded-md">Transactions</div>
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 flex items-center gap-3 tracking-tight">
                        <ShoppingCart className="text-indigo-600" size={36} />
                        Sales Terminal
                    </h1>
                    <p className="text-slate-500 mt-1 font-medium">Manage point of sale, customer ledgers, and receivables.</p>
                </div>

                <div className="flex gap-4 w-full lg:w-auto">
                    <Card className="flex-1 lg:min-w-[240px] border-l-0 border-y-0 border-r-[6px] border-r-emerald-500 bg-white shadow-md hover:shadow-xl transition-all">
                        <CardContent className="p-5">
                            <div className="flex justify-between items-start mb-2">
                                <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                                    <DollarSign size={20} />
                                </div>
                                <Activity className="text-emerald-500" size={16} />
                            </div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Revenue</p>
                            <p className="text-3xl font-black text-slate-900">${totalRevenue.toLocaleString()}</p>
                        </CardContent>
                    </Card>
                    <Card className="flex-1 lg:min-w-[240px] border-l-0 border-y-0 border-r-[6px] border-r-rose-500 bg-white shadow-md hover:shadow-xl transition-all">
                        <CardContent className="p-5">
                            <div className="flex justify-between items-start mb-2">
                                <div className="p-2 bg-rose-100 rounded-lg text-rose-600">
                                    <AlertCircle size={20} />
                                </div>
                            </div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Outstanding Debt</p>
                            <p className="text-3xl font-black text-slate-900">${totalOutstanding.toLocaleString()}</p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex bg-muted p-1 rounded-xl w-fit">
                {[
                    { id: "new-sale", icon: Plus, label: "Process Sale" },
                    { id: "customers", icon: Users, label: "Customer Ledger" },
                    { id: "history", icon: History, label: "History" }
                ].map(tab => (
                    <Button
                        key={tab.id}
                        variant={activeTab === tab.id ? "default" : "ghost"}
                        onClick={() => setActiveTab(tab.id)}
                        className="gap-2 rounded-lg"
                    >
                        <tab.icon size={18} />
                        <span className="hidden sm:inline">{tab.label}</span>
                    </Button>
                ))}
            </div>

            <div className="mt-4">
                {/* NEW SALE TAB */}
                {activeTab === "new-sale" && (
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 animate-fade-in">
                        {/* Left: POS Form */}
                        <Card className="xl:col-span-2 shadow-xl border-none ring-1 ring-slate-100 bg-white">
                            <CardHeader className="border-b border-slate-100 pb-6">
                                <CardTitle className="flex items-center gap-3 text-slate-800">
                                    <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                                        <CreditCard size={24} />
                                    </div>
                                    New Transaction
                                </CardTitle>
                                <CardDescription>Process a new sale and update inventory instantly.</CardDescription>
                            </CardHeader>
                            <CardContent className="pt-8">
                                <form onSubmit={handleProcessSale} className="space-y-8">

                                    {/* SECTION 0: TYPE */}
                                    <div className="bg-slate-50 p-1 rounded-xl flex">
                                        <button
                                            type="button"
                                            onClick={() => setSaleType("NEW")}
                                            className={`flex-1 py-3 text-sm font-bold uppercase tracking-wider rounded-lg transition-all ${saleType === "NEW"
                                                    ? "bg-white text-blue-600 shadow-md transform scale-[1.02]"
                                                    : "text-slate-400 hover:text-slate-600"
                                                }`}
                                        >
                                            New Bottle
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setSaleType("EXCHANGE")}
                                            className={`flex-1 py-3 text-sm font-bold uppercase tracking-wider rounded-lg transition-all ${saleType === "EXCHANGE"
                                                    ? "bg-white text-emerald-600 shadow-md transform scale-[1.02]"
                                                    : "text-slate-400 hover:text-slate-600"
                                                }`}
                                        >
                                            Exchange / Reuse
                                        </button>
                                    </div>

                                    {/* SECTION 1: CUSTOMER */}
                                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-sm font-black text-slate-700 uppercase tracking-widest flex items-center gap-2">
                                                <Users size={16} /> Customer Details
                                            </h3>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setShowAddCustomer(true)}
                                                className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 h-8 text-xs font-bold"
                                            >
                                                + Register New
                                            </Button>
                                        </div>
                                        <div className="relative">
                                            <select
                                                value={saleForm.clientName}
                                                onChange={(e) => setSaleForm({ ...saleForm, clientName: e.target.value })}
                                                className="w-full h-12 pl-4 pr-10 bg-white border-none shadow-sm rounded-xl font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500 appearance-none transition-all"
                                            >
                                                <option value="Walk-in">Walk-in Customer</option>
                                                {customers.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                                            </select>
                                            <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 rotate-90 pointer-events-none" size={16} />
                                        </div>
                                    </div>

                                    {/* SECTION 2: PRODUCT */}
                                    <div className="space-y-4">
                                        <h3 className="text-sm font-black text-slate-700 uppercase tracking-widest flex items-center gap-2 px-1">
                                            <ShoppingCart size={16} /> Cart Items
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-1.5 md:col-span-2">
                                                <label className="text-xs font-bold text-slate-400 ml-1">Select Product</label>
                                                <div className="relative group">
                                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
                                                    <Input
                                                        list="inventory-list"
                                                        value={saleForm.itemName}
                                                        onChange={(e) => {
                                                            const item = inventory.find(i => i.name === e.target.value);
                                                            setSaleForm({
                                                                ...saleForm,
                                                                itemName: e.target.value,
                                                                sellingPrice: item ? item.sellingPrice : ""
                                                            });
                                                        }}
                                                        className="h-14 pl-12 text-lg font-bold bg-white border-slate-200 focus:border-indigo-500 rounded-xl"
                                                        placeholder="Search product..."
                                                    />
                                                    {selectedItem && (
                                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 bg-emerald-50 text-emerald-600 px-3 py-1 rounded-lg text-xs font-bold border border-emerald-100 flex items-center gap-1">
                                                            <CheckCircle2 size={12} /> {selectedItem.quantity} in stock
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="space-y-1.5">
                                                <label className="text-xs font-bold text-slate-400 ml-1">Quantity</label>
                                                <Input
                                                    type="number"
                                                    value={saleForm.quantity}
                                                    onChange={(e) => setSaleForm({ ...saleForm, quantity: e.target.value })}
                                                    className="h-14 text-center text-2xl font-black text-slate-800 bg-slate-50 border-transparent focus:bg-white focus:border-indigo-500 rounded-xl"
                                                    placeholder="0"
                                                />
                                            </div>

                                            <div className="space-y-1.5">
                                                <label className="text-xs font-bold text-slate-400 ml-1">Price / Unit ($)</label>
                                                <Input
                                                    type="number"
                                                    value={saleForm.sellingPrice}
                                                    onChange={(e) => setSaleForm({ ...saleForm, sellingPrice: e.target.value })}
                                                    className="h-14 text-center text-xl font-bold text-slate-600 bg-slate-50 border-transparent focus:bg-white focus:border-indigo-500 rounded-xl"
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
                                                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                                    <Wallet size={16} /> Payment Entry
                                                </h3>
                                                <div className="flex gap-2">
                                                    {[10, 20, 50, 100].map(amt => (
                                                        <button
                                                            key={amt}
                                                            type="button"
                                                            onClick={() => setSaleForm({ ...saleForm, amountPaid: amt })}
                                                            className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold transition-colors"
                                                        >
                                                            ${amt}
                                                        </button>
                                                    ))}
                                                    <button
                                                        type="button"
                                                        onClick={() => setSaleForm({ ...saleForm, amountPaid: (Number(saleForm.quantity || 0) * Number(saleForm.sellingPrice || 0)) })}
                                                        className="px-3 py-1 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 rounded-lg text-xs font-bold transition-colors border border-emerald-500/50"
                                                    >
                                                        Exact
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-bold text-slate-400">Total Received ($)</label>
                                                <Input
                                                    type="number"
                                                    value={saleForm.amountPaid}
                                                    onChange={(e) => setSaleForm({ ...saleForm, amountPaid: e.target.value })}
                                                    className="h-16 text-right text-3xl font-black text-emerald-400 bg-white/5 border-white/10 focus:border-emerald-500 rounded-xl placeholder:text-slate-700"
                                                    placeholder="0.00"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <Button
                                        type="submit"
                                        size="lg"
                                        className="w-full h-16 text-lg uppercase tracking-widest font-black shadow-xl shadow-indigo-200 bg-indigo-600 hover:bg-indigo-700 hover:scale-[1.01] transition-all rounded-xl"
                                    >
                                        <CheckCircle2 size={24} className="mr-3" /> Confirm & Print Receipt
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>

                        {/* Right: Receipt Preview */}
                        <div className="space-y-6">
                            <Card className="h-full flex flex-col bg-white border border-slate-200 shadow-2xl relative">
                                {/* Receipt Top jagged edge (simulated with CSS or keep simple) */}
                                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-slate-200 to-slate-100" />

                                <CardContent className="p-8 h-full flex flex-col relative">
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
                                                <span className="font-bold text-slate-800">${(Number(saleForm.quantity || 0) * Number(saleForm.sellingPrice || 0)).toFixed(2)}</span>
                                            </div>
                                        </div>

                                        <div className="space-y-2 pt-2">
                                            <div className="flex justify-between items-center">
                                                <span className="text-slate-500 font-bold">Subtotal</span>
                                                <span className="font-bold text-slate-900">${(Number(saleForm.quantity || 0) * Number(saleForm.sellingPrice || 0)).toLocaleString()}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-slate-500 font-bold">Tax (0%)</span>
                                                <span className="font-bold text-slate-900">$0.00</span>
                                            </div>
                                            <div className="flex justify-between items-center text-lg pt-2 border-t border-slate-200">
                                                <span className="font-black text-slate-900">TOTAL</span>
                                                <span className="font-black text-indigo-600">${(Number(saleForm.quantity || 0) * Number(saleForm.sellingPrice || 0)).toLocaleString()}</span>
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
                                                ${Math.max(0, (Number(saleForm.quantity || 0) * Number(saleForm.sellingPrice || 0)) - Number(saleForm.amountPaid || 0)).toLocaleString()}
                                            </p>
                                        </div>
                                        <p className="text-[10px] text-center text-slate-300 mt-6 uppercase tracking-widest font-bold">Thank you for your business</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                )}

                {/* CUSTOMERS TAB */}
                {activeTab === "customers" && (
                    <div className="space-y-8 animate-fade-in">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {customers.map(c => {
                                const isDebtor = c.balance > 0;
                                const borderColor = isDebtor ? "border-r-rose-500" : "border-r-emerald-500";
                                const bgBadge = isDebtor ? "bg-rose-100 text-rose-600" : "bg-emerald-100 text-emerald-600";

                                return (
                                    <Card key={c.id} className={`group border-y-0 border-l-0 border-r-[6px] ${borderColor} hover:shadow-xl transition-all`}>
                                        <CardContent className="p-6">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 font-black text-xl shadow-sm">
                                                    {c.name.charAt(0)}
                                                </div>
                                                <Badge variant="outline" className={`border-transparent ${bgBadge}`}>
                                                    {isDebtor ? "DEBTOR" : "CLEAR"}
                                                </Badge>
                                            </div>
                                            <h3 className="font-black text-slate-800 text-lg tracking-tight">{c.name}</h3>
                                            <p className="text-xs text-slate-400 font-bold mb-4 flex items-center gap-1">
                                                <Users size={12} /> {c.phone || "No contact info"}
                                            </p>

                                            <div className="pt-4 border-t border-slate-100">
                                                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Current Balance</p>
                                                <p className={`text-2xl font-black ${isDebtor ? "text-rose-500" : "text-emerald-500"}`}>
                                                    ${Number(c.balance || 0).toLocaleString()}
                                                </p>
                                            </div>

                                            {isDebtor && (
                                                <Button
                                                    onClick={() => {
                                                        const amt = prompt(`Enter collection amount for ${c.name}:`);
                                                        if (amt) collectPayment(c.name, Number(amt));
                                                    }}
                                                    size="sm"
                                                    className="mt-4 w-full bg-rose-50 text-rose-600 hover:bg-rose-100 hover:text-rose-700 font-bold border-rose-200"
                                                >
                                                    COLLECT PAYMENT
                                                </Button>
                                            )}
                                        </CardContent>
                                    </Card>
                                )
                            })}
                            <Card
                                className="border-2 border-dashed border-border flex flex-col items-center justify-center text-center group cursor-pointer hover:border-primary/50 hover:bg-muted/50 transition-all"
                                onClick={() => setShowAddCustomer(true)}
                            >
                                <CardContent className="flex flex-col items-center p-6">
                                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors mb-4">
                                        <UserPlus size={24} />
                                    </div>
                                    <h3 className="font-bold text-muted-foreground group-hover:text-foreground">Register Customer</h3>
                                    <p className="text-xs text-muted-foreground mt-2">Add new client to ledger</p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                )}

                {/* HISTORY TAB */}
                {activeTab === "history" && (
                    <Card className="overflow-hidden animate-fade-in shadow-xl border-none">
                        <div className="max-h-[600px] overflow-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Time / Date</TableHead>
                                        <TableHead>Client / Customer</TableHead>
                                        <TableHead>Activity</TableHead>
                                        <TableHead>Total Amount</TableHead>
                                        <TableHead>Payment Info</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {salesHistory.map((t) => (
                                        <TableRow key={t.id} className="group hover:bg-muted/50">
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Clock size={14} className="text-muted-foreground" />
                                                    <div>
                                                        <p className="font-bold text-foreground text-xs">{t.date}</p>
                                                        <p className="text-[10px] text-muted-foreground">{t.time}</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <p className="font-bold text-foreground">{t.client}</p>
                                            </TableCell>
                                            <TableCell>
                                                {t.type === 'SELL' ? (
                                                    <div className="flex items-center gap-2">
                                                        <ArrowDownRight size={14} className="text-emerald-500" />
                                                        <span className="text-xs font-bold text-muted-foreground">Sale: {t.itemName} ({t.quantity})</span>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2">
                                                        <ArrowUpRight size={14} className="text-primary" />
                                                        <span className="text-xs font-bold text-muted-foreground">Payment Collection</span>
                                                    </div>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <p className="font-black text-foreground">${t.total.toLocaleString()}</p>
                                            </TableCell>
                                            <TableCell>
                                                {t.type === 'SELL' && (
                                                    <div className="text-[10px]">
                                                        <p className="text-emerald-600 font-bold">PAID: ${t.amountPaid.toLocaleString()}</p>
                                                        {t.balanceDue > 0 && <p className="text-destructive font-black">DUE: ${t.balanceDue.toLocaleString()}</p>}
                                                    </div>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        t.status === 'PAID' ? 'success' :
                                                            t.status === 'PARTIAL' ? 'warning' :
                                                                t.status === 'CREDIT' ? 'destructive' : 'default'
                                                    }
                                                >
                                                    {t.status}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {salesHistory.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={6} className="p-12 text-center text-muted-foreground italic">No sales or payments record found.</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </Card>
                )}
            </div>

            {/* CUSTOMER MODAL */}
            {showAddCustomer && (
                <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
                    <Card className="max-w-md w-full shadow-2xl border-border">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Register Customer</CardTitle>
                            <Button variant="ghost" size="icon" onClick={() => setShowAddCustomer(false)}>
                                <X size={18} />
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleCreateCustomer} className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-muted-foreground uppercase">Customer Name</label>
                                    <Input
                                        required
                                        value={customerForm.name}
                                        onChange={(e) => setCustomerForm({ ...customerForm, name: e.target.value })}
                                        placeholder="Full Name"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-muted-foreground uppercase">Phone</label>
                                    <Input
                                        value={customerForm.phone}
                                        onChange={(e) => setCustomerForm({ ...customerForm, phone: e.target.value })}
                                        placeholder="+1 (555) 000-0000"
                                    />
                                </div>
                                <div className="flex gap-4 mt-8 pt-4">
                                    <Button type="button" variant="ghost" onClick={() => setShowAddCustomer(false)} className="flex-1">Cancel</Button>
                                    <Button type="submit" className="flex-1">Register Customer</Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Datalist */}
            <datalist id="inventory-list">
                {filteredInventory.map(i => <option key={i.id} value={i.name}>{i.category} - Stock: {i.quantity}</option>)}
            </datalist>
        </div>
    );
};

export default SalesModule;
