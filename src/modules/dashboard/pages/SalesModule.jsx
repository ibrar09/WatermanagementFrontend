import React, { useState, useMemo } from "react";
import { useData } from "../../../context/DataContext";
import {
    ShoppingCart,
    Users,
    History,
    Search,
    Plus,
    CreditCard,
    Wallet,
    ArrowUpRight,
    ArrowDownRight,
    Clock,
    CheckCircle2,
    AlertCircle,
    MoreVertical,
    ChevronRight,
    Filter,
    DollarSign,
    UserPlus
} from "lucide-react";

// Helper components
const Card = ({ children, className = "" }) => (
    <div className={`bg-white dark:bg-white/10 rounded-2xl shadow-sm border border-gray-100 dark:border-white/10 ${className}`}>
        {children}
    </div>
);

const Badge = ({ children, variant = "neutral" }) => {
    const styles = {
        neutral: "bg-gray-100 text-gray-700",
        success: "bg-green-100 text-green-700",
        warning: "bg-yellow-100 text-yellow-700",
        danger: "bg-red-100 text-red-700",
        info: "bg-blue-100 text-blue-700"
    };
    return (
        <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${styles[variant]}`}>
            {children}
        </span>
    );
};

const SalesModule = () => {
    const { inventory, transactions, customers, sellStock, addCustomer, collectPayment } = useData();
    const [activeTab, setActiveTab] = useState("new-sale");
    const [searchQuery, setSearchQuery] = useState("");

    // New Sale State
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
            amountPaid: Number(saleForm.amountPaid || 0)
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
        <div className="max-w-7xl mx-auto space-y-6 animate-fade-in p-2 sm:p-4">
            {/* Header & Stats */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 dark:text-white flex items-center gap-3 tracking-tight">
                        <ShoppingCart className="text-blue-600" size={36} />
                        Sales Module
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1 font-medium italic">Manage sales, customers, and outstanding balances.</p>
                </div>

                <div className="flex gap-4 w-full lg:w-auto">
                    <Card className="flex-1 lg:w-48 p-4 bg-green-50 dark:bg-green-900/10 border-green-100 dark:border-green-500/20">
                        <p className="text-[10px] font-black text-green-600/60 uppercase tracking-widest">Total Sales</p>
                        <p className="text-2xl font-black text-green-600">${totalRevenue.toLocaleString()}</p>
                    </Card>
                    <Card className="flex-1 lg:w-48 p-4 bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-500/20">
                        <p className="text-[10px] font-black text-red-600/60 uppercase tracking-widest">Outstanding</p>
                        <p className="text-2xl font-black text-red-600">${totalOutstanding.toLocaleString()}</p>
                    </Card>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex bg-white dark:bg-white/5 p-1 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm w-fit">
                {[
                    { id: "new-sale", icon: Plus, label: "Process Sale" },
                    { id: "customers", icon: Users, label: "Customer Ledger" },
                    { id: "history", icon: History, label: "History" }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === tab.id
                                ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                                : "text-gray-500 hover:text-gray-800 dark:hover:text-gray-300"
                            }`}
                    >
                        <tab.icon size={18} />
                        <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                ))}
            </div>

            <div className="mt-4">
                {/* NEW SALE TAB */}
                {activeTab === "new-sale" && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
                        {/* Left: POS Form */}
                        <Card className="lg:col-span-2 p-8 shadow-xl">
                            <h3 className="text-2xl font-black text-gray-800 dark:text-white mb-8 flex items-center gap-2">
                                <CreditCard className="text-blue-600" /> New Transaction
                            </h3>

                            <form onSubmit={handleProcessSale} className="space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Customer / Client</label>
                                        <div className="relative">
                                            <select
                                                value={saleForm.clientName}
                                                onChange={(e) => setSaleForm({ ...saleForm, clientName: e.target.value })}
                                                className="w-full p-4 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold appearance-none transition-all"
                                            >
                                                <option value="Walk-in">Walk-in Customer</option>
                                                {customers.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                                            </select>
                                            <ChevronRight className="absolute right-4 top-5 text-gray-400 rotate-90" size={20} />
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Quick Add</label>
                                        <button
                                            type="button"
                                            onClick={() => setShowAddCustomer(true)}
                                            className="w-full p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 rounded-2xl border border-blue-100 dark:border-blue-500/20 font-bold flex items-center justify-center gap-2 hover:bg-blue-100 transition"
                                        >
                                            <UserPlus size={18} /> New Customer
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Select Product</label>
                                    <div className="relative">
                                        <input
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
                                            className="w-full p-4 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                                            placeholder="Search items for sale..."
                                        />
                                        <Search className="absolute right-4 top-4 text-gray-400" size={20} />
                                    </div>
                                    {selectedItem && (
                                        <p className="text-[10px] font-bold text-green-600 ml-1 mt-1">Available Stock: {selectedItem.quantity} units</p>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Quantity</label>
                                        <input
                                            type="number"
                                            value={saleForm.quantity}
                                            onChange={(e) => setSaleForm({ ...saleForm, quantity: e.target.value })}
                                            className="w-full p-4 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl outline-none font-black text-2xl text-blue-600"
                                            placeholder="0"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Unit Price ($)</label>
                                        <input
                                            type="number"
                                            value={saleForm.sellingPrice}
                                            onChange={(e) => setSaleForm({ ...saleForm, sellingPrice: e.target.value })}
                                            className="w-full p-4 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl outline-none font-bold"
                                            placeholder="0.00"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Amount Paid ($)</label>
                                        <input
                                            type="number"
                                            value={saleForm.amountPaid}
                                            onChange={(e) => setSaleForm({ ...saleForm, amountPaid: e.target.value })}
                                            className="w-full p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-500/20 rounded-2xl outline-none font-black text-green-600"
                                            placeholder="Collecting now..."
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-black text-xl shadow-xl shadow-blue-200 hover:scale-[1.01] transition-all flex items-center justify-center gap-3"
                                >
                                    <ShoppingCart size={24} /> Confirm Sale Transaction
                                </button>
                            </form>
                        </Card>

                        {/* Right: Receipt Preview */}
                        <div className="space-y-6">
                            <Card className="p-8 h-full flex flex-col bg-gray-900 text-white border-none shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-8 opacity-10">
                                    <Wallet size={120} />
                                </div>

                                <h3 className="text-lg font-black uppercase tracking-widest text-blue-400 mb-8 pb-4 border-b border-white/10">Summary</h3>

                                <div className="flex-1 space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-400 text-sm font-bold">Product</span>
                                        <span className="font-extrabold">{saleForm.itemName || "None"}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-400 text-sm font-bold">Customer</span>
                                        <span className="font-extrabold">{saleForm.clientName}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-400 text-sm font-bold">Qty</span>
                                        <span className="font-extrabold">{saleForm.quantity || 0}</span>
                                    </div>
                                    <div className="py-4 border-t border-dashed border-white/10">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-gray-400 text-sm font-bold">Subtotal</span>
                                            <span className="font-extrabold text-xl">${(Number(saleForm.quantity || 0) * Number(saleForm.sellingPrice || 0)).toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-400 text-sm font-bold">Paid</span>
                                            <span className="font-extrabold text-green-400">${Number(saleForm.amountPaid || 0).toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 pt-8 border-t border-white/10">
                                    <div className="bg-white/5 p-4 rounded-xl flex justify-between items-center">
                                        <p className="text-xs font-black uppercase tracking-widest text-red-400">Balance Due</p>
                                        <p className="text-3xl font-black text-white">
                                            ${Math.max(0, (Number(saleForm.quantity || 0) * Number(saleForm.sellingPrice || 0)) - Number(saleForm.amountPaid || 0)).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                )}

                {/* CUSTOMERS TAB */}
                {activeTab === "customers" && (
                    <div className="space-y-8 animate-fade-in">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {customers.map(c => (
                                <Card key={c.id} className="p-6 transition-all hover:shadow-lg hover:border-blue-500 group">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 font-black text-xl">
                                            {c.name.charAt(0)}
                                        </div>
                                        <Badge variant={c.balance > 0 ? "warning" : "success"}>
                                            {c.balance > 0 ? "DEBTOR" : "CLEAR"}
                                        </Badge>
                                    </div>
                                    <h3 className="font-black text-gray-800 dark:text-white text-lg">{c.name}</h3>
                                    <p className="text-xs text-gray-400 font-bold mb-4">{c.phone || "No contact"}</p>

                                    <div className="pt-4 border-t border-gray-50 dark:border-white/5">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Balance</p>
                                        <p className={`text-2xl font-black ${c.balance > 0 ? "text-red-500" : "text-green-600"}`}>
                                            ${Number(c.balance || 0).toLocaleString()}
                                        </p>
                                    </div>

                                    {c.balance > 0 && (
                                        <button
                                            onClick={() => {
                                                const amt = prompt(`Enter collection amount for ${c.name}:`);
                                                if (amt) collectPayment(c.name, Number(amt));
                                            }}
                                            className="mt-6 w-full py-3 bg-gray-900 text-white rounded-xl text-xs font-black shadow-lg hover:bg-blue-600 transition-all opacity-0 group-hover:opacity-100"
                                        >
                                            COLLECT PAYMENT
                                        </button>
                                    )}
                                </Card>
                            ))}
                            <Card className="p-6 border-2 border-dashed border-gray-200 dark:border-white/10 flex flex-col items-center justify-center text-center group cursor-pointer hover:border-blue-400" onClick={() => setShowAddCustomer(true)}>
                                <UserPlus className="text-gray-300 group-hover:text-blue-500 mb-2" size={32} />
                                <p className="font-black text-gray-400 text-xs">Register Customer</p>
                            </Card>
                        </div>
                    </div>
                )}

                {/* HISTORY TAB */}
                {activeTab === "history" && (
                    <Card className="overflow-hidden animate-fade-in shadow-xl">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 dark:bg-white/5">
                                    <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 dark:border-white/10">
                                        <th className="p-6">Time / Date</th>
                                        <th className="p-6">Client / Customer</th>
                                        <th className="p-6">Activity</th>
                                        <th className="p-6">Total Amount</th>
                                        <th className="p-6">Payment Info</th>
                                        <th className="p-6">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-white/10">
                                    {salesHistory.map((t) => (
                                        <tr key={t.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                            <td className="p-6 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    <Clock size={14} className="text-gray-400" />
                                                    <div>
                                                        <p className="font-bold text-gray-800 dark:text-white text-xs">{t.date}</p>
                                                        <p className="text-[10px] text-gray-400">{t.time}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-6">
                                                <p className="font-bold text-gray-800 dark:text-white">{t.client}</p>
                                            </td>
                                            <td className="p-6">
                                                {t.type === 'SELL' ? (
                                                    <div className="flex items-center gap-2">
                                                        <ArrowDownRight size={14} className="text-red-500" />
                                                        <span className="text-xs font-bold text-gray-500">Sale: {t.itemName} ({t.quantity})</span>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2">
                                                        <ArrowUpRight size={14} className="text-green-500" />
                                                        <span className="text-xs font-bold text-gray-500">Payment Collection</span>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="p-6">
                                                <p className="font-black text-gray-900 dark:text-white">${t.total.toLocaleString()}</p>
                                            </td>
                                            <td className="p-6">
                                                {t.type === 'SELL' && (
                                                    <div className="text-[10px]">
                                                        <p className="text-green-600 font-black">PAID: ${t.amountPaid.toLocaleString()}</p>
                                                        <p className="text-red-500 font-bold">DUE: ${t.balanceDue.toLocaleString()}</p>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="p-6">
                                                <Badge
                                                    variant={
                                                        t.status === 'PAID' ? 'success' :
                                                            t.status === 'PARTIAL' ? 'warning' :
                                                                t.status === 'CREDIT' ? 'danger' : 'info'
                                                    }
                                                >
                                                    {t.status}
                                                </Badge>
                                            </td>
                                        </tr>
                                    ))}
                                    {salesHistory.length === 0 && (
                                        <tr>
                                            <td colSpan="6" className="p-12 text-center text-gray-400 italic">No sales or payments found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                )}
            </div>

            {/* CUSTOMER MODAL (Simplified for brevity) */}
            {showAddCustomer && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <Card className="max-w-md w-full p-8 animate-scale-in">
                        <h3 className="text-2xl font-black mb-6">Register Customer</h3>
                        <form onSubmit={handleCreateCustomer} className="space-y-4">
                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase">Customer Name</label>
                                <input
                                    required
                                    value={customerForm.name}
                                    onChange={(e) => setCustomerForm({ ...customerForm, name: e.target.value })}
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase">Phone</label>
                                <input
                                    value={customerForm.phone}
                                    onChange={(e) => setCustomerForm({ ...customerForm, phone: e.target.value })}
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                                />
                            </div>
                            <div className="flex gap-4 mt-8">
                                <button type="button" onClick={() => setShowAddCustomer(false)} className="flex-1 py-3 text-sm font-bold text-gray-500">Cancel</button>
                                <button type="submit" className="flex-1 py-3 bg-blue-600 text-white rounded-xl text-sm font-black">Register</button>
                            </div>
                        </form>
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
