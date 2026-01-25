import React, { useState } from "react";
import { useData } from "../../../context/DataContext";
import {
    Users, Search, UserPlus, X, Filter, MoreHorizontal, Phone, MapPin, Wallet, ArrowRight, History
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Badge } from "../../../components/ui/Badge";
import PaymentCollectionModal from "../components/PaymentCollectionModal";

const Customers = () => {
    const { customers, transactions, addCustomer, collectPayment } = useData();

    const [searchTerm, setSearchTerm] = useState("");
    const [showAddModal, setShowAddModal] = useState(false);
    const [newCustomer, setNewCustomer] = useState({ name: "", phone: "", address: "", type: "Retailer" });
    const [paymentModal, setPaymentModal] = useState({ open: false, customer: null });

    const filteredCustomers = customers.map(c => {
        // Calculate Metrics
        const customerTxs = transactions.filter(t => t.client === c.name);
        const totalSpent = customerTxs
            .filter(t => t.type === 'SELL')
            .reduce((acc, t) => acc + Number(t.total), 0);

        const visits = customerTxs.filter(t => t.type === 'SELL').length;

        // Find last activity (either buy or payment)
        const lastActiveTx = customerTxs.sort((a, b) => new Date(b.date) - new Date(a.date))[0];
        const lastActive = lastActiveTx ? lastActiveTx.date : "Never";

        return { ...c, totalSpent, visits, lastActive };
    }).filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.contact && c.contact.includes(searchTerm))
    );

    const handleAddCustomer = (e) => {
        e.preventDefault();
        addCustomer(newCustomer);
        setShowAddModal(false);
        setNewCustomer({ name: "", phone: "", address: "", type: "Retailer" });
    };

    return (
        <div className="container-responsive spacing-y-responsive animate-fade-in">
            {/* Header */}
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight flex items-center gap-2 sm:gap-3">
                        <Users className="text-slate-700" size={32} />
                        Customer Directory
                    </h1>
                    <p className="text-sm text-slate-500 mt-1 font-medium max-w-lg">Manage client accounts, credit limits, and purchase history.</p>
                </div>
                <Button
                    onClick={() => setShowAddModal(true)}
                    className="bg-[#F0B100] hover:bg-[#D49B00] text-slate-900 shadow-lg shadow-yellow-200/50 font-black uppercase tracking-wider text-xs px-6 h-10 w-full sm:w-auto transition-all transform hover:-translate-y-0.5"
                >
                    <UserPlus size={16} className="mr-2" /> Add Customer
                </Button>
            </div>

            {/* Search & Stats */}
            <div className="flex flex-col gap-4 sm:gap-6">
                <Card className="flex-1 border-none shadow-sm bg-white ring-1 ring-slate-100">
                    <div className="p-1 flex items-center gap-2">
                        <Search className="ml-3 text-slate-400" size={18} />
                        <Input
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search by name, phone, or ID..."
                            className="border-none shadow-none text-sm font-medium h-10 bg-transparent placeholder:text-slate-300"
                        />
                    </div>
                </Card>
                <Card className="bg-slate-900 text-white border-none shadow-lg w-full sm:min-w-[300px]">
                    <CardContent className="p-4 sm:p-6 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase">Total Receivables</p>
                            <p className="text-2xl font-black mt-1">
                                ${customers.reduce((acc, c) => acc + (Number(c.balance) > 0 ? Number(c.balance) : 0), 0).toLocaleString()}
                            </p>
                        </div>
                        <div className="p-3 bg-white/10 rounded-xl">
                            <Wallet size={24} className="text-emerald-400" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Premium List View */}
            <Card className="border-none shadow-xl bg-white overflow-hidden rounded-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50/50">
                                <th className="py-5 px-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">Customer Profile</th>
                                <th className="py-5 px-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">Contact Info</th>
                                <th className="py-5 px-6 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center">Visits</th>
                                <th className="py-5 px-6 text-[11px] font-black text-slate-400 uppercase tracking-widest text-right">Total Spent</th>
                                <th className="py-5 px-6 text-[11px] font-black text-slate-400 uppercase tracking-widest text-right">Last Active</th>
                                <th className="py-5 px-6 text-[11px] font-black text-slate-400 uppercase tracking-widest text-right">Balance</th>
                                <th className="py-5 px-6 text-[11px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredCustomers.map((customer) => {
                                const isDebtor = customer.balance > 0;
                                const statusColor = isDebtor ? "text-rose-600 bg-rose-50" : "text-emerald-600 bg-emerald-50";

                                return (
                                    <tr key={customer.id} className="group hover:bg-slate-50/80 transition-colors">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black shadow-sm
                                                    ${isDebtor ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-600'}`
                                                }>
                                                    {customer.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-slate-900 text-sm">{customer.name}</h3>
                                                    <Badge variant="secondary" className="mt-0.5 text-[9px] font-bold uppercase tracking-wider bg-slate-50 text-slate-400 border border-slate-100">
                                                        {customer.type || "Retailer"}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="py-4 px-6">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-slate-500 font-medium text-xs">
                                                    <Phone size={12} className="text-slate-300" />
                                                    {customer.contact || "No Phone"}
                                                </div>
                                                <div className="flex items-center gap-2 text-slate-400 text-[10px]">
                                                    <MapPin size={12} className="text-slate-300" />
                                                    {customer.address || "No Address"}
                                                </div>
                                            </div>
                                        </td>

                                        <td className="py-4 px-6 text-center">
                                            <span className="font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded-lg text-xs">{customer.visits}</span>
                                        </td>

                                        <td className="py-4 px-6 text-right">
                                            <span className="font-bold text-slate-900 text-sm">${customer.totalSpent.toLocaleString()}</span>
                                        </td>

                                        <td className="py-4 px-6 text-right">
                                            <span className="text-xs font-bold text-slate-500">{customer.lastActive}</span>
                                        </td>

                                        <td className="py-4 px-6 text-right">
                                            <div className="flex flex-col items-end">
                                                <span className={`text-lg font-black ${isDebtor ? 'text-rose-600' : 'text-emerald-600'}`}>
                                                    ${Number(customer.balance || 0).toLocaleString()}
                                                </span>
                                                {isDebtor && <span className="text-[10px] font-bold text-rose-400">Payment Overdue</span>}
                                            </div>
                                        </td>

                                        <td className="py-4 px-6 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-slate-100 text-slate-400 hover:text-slate-700">
                                                    <History size={16} />
                                                </Button>
                                                {isDebtor ? (
                                                    <Button
                                                        size="sm"
                                                        onClick={() => setPaymentModal({ open: true, customer: customer })}
                                                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] h-8 px-3 shadow-md shadow-emerald-100 uppercase tracking-wide"
                                                    >
                                                        Collect <ArrowRight size={12} className="ml-1" />
                                                    </Button>
                                                ) : (
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-300 hover:text-slate-500">
                                                        <MoreHorizontal size={16} />
                                                    </Button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                            {filteredCustomers.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="py-20 text-center">
                                        <div className="inline-flex p-4 rounded-full bg-slate-50 mb-4">
                                            <Users size={32} className="text-slate-300" />
                                        </div>
                                        <p className="text-slate-500 font-medium">No customers found</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Add Modal */}
            {showAddModal && (
                <div className="modal-responsive p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
                    <Card className="modal-content-responsive max-w-md bg-white border-none shadow-2xl">
                        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 pb-4">
                            <CardTitle className="text-base sm:text-lg">New Customer</CardTitle>
                            <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                                <X size={20} />
                            </button>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <form onSubmit={handleAddCustomer} className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Full Name</label>
                                    <Input required value={newCustomer.name} onChange={e => setNewCustomer({ ...newCustomer, name: e.target.value })} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Phone Number</label>
                                    <Input value={newCustomer.phone} onChange={e => setNewCustomer({ ...newCustomer, phone: e.target.value })} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Address</label>
                                    <Input value={newCustomer.address} onChange={e => setNewCustomer({ ...newCustomer, address: e.target.value })} placeholder="City, Area" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Type</label>
                                    <select
                                        className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm font-medium"
                                        value={newCustomer.type}
                                        onChange={e => setNewCustomer({ ...newCustomer, type: e.target.value })}
                                    >
                                        <option>Retailer</option>
                                        <option>Corporate</option>
                                        <option>Individual</option>
                                    </select>
                                </div>
                                <Button type="submit" className="w-full mt-4 bg-[#F0B100] hover:bg-[#D49B00] text-slate-900 font-bold shadow-lg shadow-yellow-200/50">
                                    Create Account
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Payment Modal */}
            {paymentModal.open && (
                <PaymentCollectionModal
                    customer={paymentModal.customer}
                    onClose={() => setPaymentModal({ open: false, customer: null })}
                    onCollect={(data) => collectPayment(paymentModal.customer.name, data)}
                />
            )}
        </div>
    );
};

export default Customers;
