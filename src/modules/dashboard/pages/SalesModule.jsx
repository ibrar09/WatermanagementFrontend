import React, { useState, useMemo } from "react";
import { useData } from "../../../context/DataContext";
import {
    ShoppingCart, Users, History, Search, Plus, CreditCard, Wallet,
    ArrowUpRight, ArrowDownRight, Clock, CheckCircle2, AlertCircle,
    MoreVertical, ChevronRight, Filter, DollarSign, UserPlus, X, Activity
} from "lucide-react";
import ProcessSaleModal from "../components/ProcessSaleModal";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Badge } from "../../../components/ui/Badge";
import {
    Table, TableHeader, TableBody, TableHead, TableRow, TableCell
} from "../../../components/ui/Table";
import PaymentCollectionModal from "../components/PaymentCollectionModal";

const SalesModule = () => {
    const { inventory, transactions, customers, sellStock, addCustomer, collectPayment } = useData();
    const [activeView, setActiveView] = useState("TRANSACTIONS"); // 'TRANSACTIONS' | 'LEDGER' | 'NEW_SALE'

    // Payment Modal for Collection Tab
    const [paymentModal, setPaymentModal] = useState({ open: false, customer: null });

    // Customer Form State
    const [customerForm, setCustomerForm] = useState({
        name: "",
        phone: "",
        address: "",
        type: "Retailer"
    });

    const [showAddCustomer, setShowAddCustomer] = useState(false);

    // Derived Data
    const filteredInventory = inventory.filter(i => i.quantity > 0);

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
    const handleProcessSale = (saleData, type) => {
        if (!saleData.itemName || !saleData.quantity) return alert("Please fill items and quantity");

        const success = sellStock({
            name: saleData.itemName,
            quantity: Number(saleData.quantity),
            sellingPrice: Number(saleData.sellingPrice),
            client: saleData.clientName,
            amountPaid: Number(saleData.amountPaid || 0),
            saleType: type,
            paymentDetails: {
                method: saleData.paymentMethod,
                reference: saleData.reference,
                notes: "",
                date: new Date().toISOString().split('T')[0]
            }
        });

        if (success) {
            alert("Sale Recorded Successfully!");
            setActiveView("TRANSACTIONS");
        }
    };

    const handleCreateCustomer = (e) => {
        e.preventDefault();
        addCustomer(customerForm);
        setCustomerForm({ name: "", phone: "", address: "", type: "Retailer" });
        setShowAddCustomer(false);
        alert("Customer Added!");
    };

    return (
        <>
            <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6 animate-fade-in p-3 sm:p-4">
                {/* Header & Stats */}
                {/* Header Row */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-2">
                    {/* Left: Title */}
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <div className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-[9px] font-bold uppercase tracking-widest rounded-md">Sales & POS</div>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-black text-slate-800 flex items-center gap-2 tracking-tight">
                            <ShoppingCart className="text-indigo-600" size={32} />
                            Sales Terminal
                        </h1>
                        <p className="text-sm text-slate-500 mt-1 font-medium tracking-wide max-w-lg">
                            Manage transactions, customer ledgers, and process new sales from a single unified view.
                        </p>
                    </div>

                    {/* Right: View Switcher Tabs */}
                    <div className="flex items-center bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm gap-1 self-start lg:self-auto">
                        <button
                            onClick={() => setActiveView("TRANSACTIONS")}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${activeView === "TRANSACTIONS"
                                ? "bg-indigo-50 text-indigo-600 shadow-sm ring-1 ring-indigo-200"
                                : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                                }`}
                        >
                            <History size={16} /> Transactions
                        </button>
                        <div className="w-px h-6 bg-slate-200 mx-1"></div>
                        <button
                            onClick={() => setActiveView("LEDGER")}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${activeView === "LEDGER"
                                ? "bg-indigo-50 text-indigo-600 shadow-sm ring-1 ring-indigo-200"
                                : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                                }`}
                        >
                            <Users size={16} /> Customer Ledger
                        </button>
                        <div className="w-px h-6 bg-slate-200 mx-1"></div>
                        <button
                            onClick={() => setActiveView("NEW_SALE")}
                            className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 ${activeView === "NEW_SALE"
                                ? "bg-[#F0B100] text-slate-900 shadow-md ring-1 ring-yellow-400 transform scale-105"
                                : "bg-slate-100 text-slate-400 hover:bg-yellow-100 hover:text-yellow-700"
                                }`}
                        >
                            <Plus size={16} /> Process Sale
                        </button>
                    </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <Card className="border-l-[4px] border-l-emerald-500 shadow-sm hover:shadow-md transition-all">
                        <CardContent className="p-4 flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Revenue</p>
                                <p className="text-2xl font-black text-slate-900">Rs. {totalRevenue.toLocaleString()}</p>
                            </div>
                            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-2xl">
                                <Activity size={20} />
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-l-[4px] border-l-rose-500 shadow-sm hover:shadow-md transition-all">
                        <CardContent className="p-4 flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Outstanding</p>
                                <p className="text-2xl font-black text-slate-900">Rs. {totalOutstanding.toLocaleString()}</p>
                            </div>
                            <div className="p-3 bg-rose-100 text-rose-600 rounded-2xl">
                                <AlertCircle size={20} />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content: Transaction Logs */}
                {activeView === "TRANSACTIONS" && (
                    <Card className="overflow-hidden animate-fade-in shadow-xl border-none bg-white">
                        <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                            <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                                <History className="text-slate-400" size={18} /> Transaction Logs
                            </CardTitle>
                        </CardHeader>
                        <div className="max-h-[400px] sm:max-h-[600px] overflow-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent">
                                        <TableHead className="font-bold text-slate-400">Time / Date</TableHead>
                                        <TableHead className="font-bold text-slate-400">Client</TableHead>
                                        <TableHead className="font-bold text-slate-400">Activity</TableHead>
                                        <TableHead className="font-bold text-slate-400">Total Amount</TableHead>
                                        <TableHead className="font-bold text-slate-400">Payment Info</TableHead>
                                        <TableHead className="font-bold text-slate-400">Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {salesHistory.map((t) => (
                                        <TableRow key={t.id} className="group hover:bg-slate-50">
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Clock size={14} className="text-slate-400" />
                                                    <div>
                                                        <p className="font-bold text-slate-700 text-xs">{t.date}</p>
                                                        <p className="text-[10px] text-slate-400">{t.time}</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <p className="font-bold text-slate-800">{t.client}</p>
                                            </TableCell>
                                            <TableCell>
                                                {t.type === 'SELL' ? (
                                                    <div className="flex items-center gap-2">
                                                        <ArrowDownRight size={14} className="text-emerald-500" />
                                                        <span className="text-xs font-bold text-slate-500">Sale: {t.itemName} ({t.quantity})</span>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2">
                                                        <ArrowUpRight size={14} className="text-blue-500" />
                                                        <span className="text-xs font-bold text-slate-500">Payment Collection</span>
                                                    </div>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <p className="font-black text-slate-900">${Number(t.total).toLocaleString()}</p>
                                            </TableCell>
                                            <TableCell>
                                                {t.type === 'SELL' && (
                                                    <div className="text-[10px]">
                                                        <p className="text-emerald-600 font-bold">PAID: ${Number(t.amountPaid).toLocaleString()}</p>
                                                        {t.balanceDue > 0 && <p className="text-rose-500 font-black">DUE: ${Number(t.balanceDue).toLocaleString()}</p>}
                                                    </div>
                                                )}
                                                {t.type === 'PAYMENT' && t.paymentMethod && (
                                                    <div className="text-[10px] text-slate-500">
                                                        <p className="font-bold text-slate-700">{t.paymentMethod}</p>
                                                        {t.reference && <p>Ref: {t.reference}</p>}
                                                    </div>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    className={
                                                        t.status === 'PAID' ? 'bg-emerald-100 text-emerald-700 border-none' :
                                                            t.status === 'PARTIAL' ? 'bg-amber-100 text-amber-700 border-none' :
                                                                t.status === 'CREDIT' ? 'bg-rose-100 text-rose-700 border-none' : 'bg-slate-100 text-slate-500'
                                                    }
                                                >
                                                    {t.status}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {salesHistory.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={6} className="p-12 text-center text-slate-400 italic">No sales or payments record found.</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </Card>
                )}

                {/* Main Content: Customer Ledger */}
                {activeView === "LEDGER" && (
                    <Card className="overflow-hidden animate-fade-in shadow-xl border-none bg-white">
                        <CardHeader className="bg-slate-50/50 border-b border-slate-100 flex flex-row items-center justify-between">
                            <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                                <Users className="text-slate-400" size={18} /> Customer Ledger
                            </CardTitle>
                            <Button size="sm" onClick={() => setShowAddCustomer(true)} className="h-8">
                                <UserPlus size={14} className="mr-2" /> Add Customer
                            </Button>
                        </CardHeader>
                        <div className="max-h-[600px] overflow-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent">
                                        <TableHead className="font-bold text-slate-400">Customer Name</TableHead>
                                        <TableHead className="font-bold text-slate-400">Contact</TableHead>
                                        <TableHead className="font-bold text-slate-400 text-right">Balance Due</TableHead>
                                        <TableHead className="font-bold text-slate-400">Status</TableHead>
                                        <TableHead className="font-bold text-slate-400 text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {customers.map((c) => {
                                        const isDebtor = c.balance > 0;
                                        return (
                                            <TableRow key={c.id} className="group hover:bg-slate-50">
                                                <TableCell className="font-bold text-slate-800">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 font-bold">
                                                            {c.name.charAt(0)}
                                                        </div>
                                                        {c.name}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-sm text-slate-500 font-medium">
                                                    {c.phone || "No Phone"} <br />
                                                    <span className="text-[10px] opacity-70">{c.address}</span>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <span className={`font-black ${isDebtor ? "text-rose-500" : "text-emerald-500"}`}>
                                                        ${Number(c.balance || 0).toLocaleString()}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge className={isDebtor ? 'bg-rose-100 text-rose-700 border-none' : 'bg-emerald-100 text-emerald-700 border-none'}>
                                                        {isDebtor ? "OUTSTANDING" : "CLEARED"}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {isDebtor && (
                                                        <Button
                                                            size="sm"
                                                            onClick={() => setPaymentModal({ open: true, customer: c })}
                                                            className="h-7 text-xs bg-indigo-50 text-indigo-600 hover:bg-indigo-100 hover:text-indigo-700 border-indigo-200"
                                                        >
                                                            Collect
                                                        </Button>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>

                    </Card>
                )}

                {/* PROCESS SALE VIEW */}
                {
                    activeView === "NEW_SALE" && (
                        <ProcessSaleModal
                            isOpen={true}
                            onClose={() => setActiveView("TRANSACTIONS")}
                            onSubmit={handleProcessSale}
                            inventory={inventory}
                            customers={customers}
                            onAddCustomer={() => {
                                // Keep current view but open customer modal
                                setShowAddCustomer(true);
                            }}
                        />
                    )
                }

            </div >

            {/* CUSTOMER MODAL */}
            {
                showAddCustomer && (
                    <div className="modal-responsive p-4 bg-background/80 backdrop-blur-sm animate-in fade-in">
                        <Card className="modal-content-responsive max-w-md shadow-2xl border-border">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle className="text-base sm:text-lg">Register Customer</CardTitle>
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
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-muted-foreground uppercase">Address</label>
                                        <Input
                                            value={customerForm.address}
                                            onChange={(e) => setCustomerForm({ ...customerForm, address: e.target.value })}
                                            placeholder="City, Area"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-muted-foreground uppercase">Type</label>
                                        <select
                                            className="w-full h-11 px-3 rounded-md border border-input bg-background text-sm font-medium"
                                            value={customerForm.type}
                                            onChange={e => setCustomerForm({ ...customerForm, type: e.target.value })}
                                        >
                                            <option>Retailer</option>
                                            <option>Corporate</option>
                                            <option>Individual</option>
                                        </select>
                                    </div>
                                    <div className="flex flex-col xs:flex-row gap-3 sm:gap-4 mt-8 pt-4 justify-end">
                                        <Button type="button" variant="ghost" onClick={() => setShowAddCustomer(false)}>Cancel</Button>
                                        <Button type="submit" className="px-8">Register Customer</Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                )
            }

            {/* Payment Modal */}
            {
                paymentModal.open && (
                    <PaymentCollectionModal
                        customer={paymentModal.customer}
                        onClose={() => setPaymentModal({ open: false, customer: null })}
                        onCollect={(data) => collectPayment(paymentModal.customer.name, data)}
                    />
                )
            }

            {/* Datalist */}
            <datalist id="inventory-list">
                {filteredInventory.map(i => <option key={i.id} value={i.name}>{i.category} - Stock: {i.quantity}</option>)}
            </datalist>
        </>
    );
};

export default SalesModule;
