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
    const [showNewSaleModal, setShowNewSaleModal] = useState(false);
    const [showLedgerModal, setShowLedgerModal] = useState(false);

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
            setShowNewSaleModal(false);
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
                <div className="flex flex-col gap-3 sm:gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <div className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-[9px] font-bold uppercase tracking-widest rounded-md">Transactions</div>
                        </div>
                        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                            <ShoppingCart className="text-indigo-600" size={24} />
                            Sales Terminal
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">Manage point of sale, customer ledgers, and receivables.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                        <div className="flex flex-col xs:flex-row gap-2 flex-1">
                            <Button
                                onClick={() => setShowNewSaleModal(true)}
                                className="bg-[#F0B100] hover:bg-[#D49B00] text-slate-900 shadow-xl shadow-yellow-200/50 font-black uppercase tracking-wider flex-1 xs:flex-none"
                            >
                                <Plus size={16} className="mr-2" /> Process Sale
                            </Button>
                            <Button
                                onClick={() => setShowLedgerModal(true)}
                                className="bg-white border-2 border-slate-200 text-slate-600 hover:bg-slate-50 font-bold flex-1 xs:flex-none"
                            >
                                <Users size={16} className="mr-2" /> Ledger
                            </Button>
                        </div>

                        <Card className="border-l-0 border-y-0 border-r-[6px] border-r-emerald-500 bg-white shadow-md hover:shadow-xl transition-all">
                            <CardContent className="p-3">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="p-1.5 bg-emerald-100 rounded-lg text-emerald-600">
                                        <DollarSign size={18} />
                                    </div>
                                </div>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Revenue</p>
                                <p className="text-lg sm:text-xl font-black text-slate-900">Rs. {totalRevenue.toLocaleString()}</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>


            </div>

            {/* Main Content: Conditional - Form or Transaction Logs */}
            {showNewSaleModal ? (
                <ProcessSaleModal
                    isOpen={true}
                    onClose={() => setShowNewSaleModal(false)}
                    onSubmit={handleProcessSale}
                    inventory={inventory}
                    customers={customers}
                    onAddCustomer={() => {
                        setShowNewSaleModal(false);
                        setShowAddCustomer(true);
                    }}
                />
            ) : (
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

            {/* CUSTOMER LEDGER MODAL */}
            {
                showLedgerModal && (
                    <div className="modal-responsive p-4 sm:p-6 backdrop-blur-md bg-black/40">
                        <div className="modal-content-responsive max-w-6xl bg-[#F9F7F1] shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-300">
                            <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-md border-b border-slate-200 p-4 sm:p-6 flex justify-between items-center">
                                <div>
                                    <h2 className="text-lg sm:text-xl lg:text-2xl font-black text-slate-900 flex items-center gap-2">
                                        <Users className="text-[#F0B100]" size={20} /> Customer Ledger
                                    </h2>
                                    <p className="text-slate-500 text-xs sm:text-sm font-medium">Manage retailers, collect payments, and track debts.</p>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => setShowLedgerModal(false)} className="rounded-full hover:bg-slate-100">
                                    <X size={20} />
                                </Button>
                            </div>
                            <div className="p-4 sm:p-6">
                                <div className="grid-responsive-1-2-4">
                                    {customers.map(c => {
                                        const isDebtor = c.balance > 0;
                                        const borderColor = isDebtor ? "border-r-rose-500" : "border-r-emerald-500";
                                        const bgBadge = isDebtor ? "bg-rose-100 text-rose-600" : "bg-emerald-100 text-emerald-600";

                                        return (
                                            <Card key={c.id} className={`group border-y-0 border-l-0 border-r-[6px] ${borderColor} hover:shadow-xl transition-all shadow-sm bg-white`}>
                                                <CardContent className="p-6">
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 font-black text-xl shadow-sm">
                                                            {c.name.charAt(0)}
                                                        </div>
                                                        <Badge variant="outline" className={`border-transparent ${bgBadge}`}>
                                                            {isDebtor ? "DEBTOR" : "CLEAR"}
                                                        </Badge>
                                                    </div>
                                                    <h3 className="font-black text-slate-800 text-lg tracking-tight truncate" title={c.name}>{c.name}</h3>
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
                                                            onClick={() => setPaymentModal({ open: true, customer: c })}
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
                                        className="border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center group cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/50 transition-all min-h-[250px]"
                                        onClick={() => setShowAddCustomer(true)}
                                    >
                                        <CardContent className="flex flex-col items-center p-6">
                                            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:text-indigo-600 transition-colors mb-4">
                                                <UserPlus size={24} />
                                            </div>
                                            <h3 className="font-bold text-slate-600 group-hover:text-indigo-700">Register Customer</h3>
                                            <p className="text-xs text-slate-400 mt-2">Add new client to ledger</p>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }

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
                                    <div className="flex flex-col xs:flex-row gap-3 sm:gap-4 mt-8 pt-4">
                                        <Button type="button" variant="ghost" onClick={() => setShowAddCustomer(false)} className="flex-1">Cancel</Button>
                                        <Button type="submit" className="flex-1">Register Customer</Button>
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
