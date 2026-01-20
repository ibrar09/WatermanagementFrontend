import React, { useState } from "react";
import { useData } from "../../../context/DataContext";
import {
    Users, Search, UserPlus, X, Filter, MoreHorizontal, Phone, MapPin, Wallet, ArrowRight, History
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Badge } from "../../../components/ui/Badge";

const Customers = () => {
    const { customers, addCustomer, collectPayment } = useData();
    const [searchTerm, setSearchTerm] = useState("");
    const [showAddModal, setShowAddModal] = useState(false);
    const [newCustomer, setNewCustomer] = useState({ name: "", phone: "", address: "", type: "Retailer" });

    const filteredCustomers = customers.filter(c =>
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
        <div className="max-w-7xl mx-auto space-y-8 animate-fade-in p-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <Users className="text-indigo-600" size={32} />
                        Customer Directory
                    </h1>
                    <p className="text-slate-500 mt-1 font-medium">Manage client accounts, credit limits, and payment history.</p>
                </div>
                <Button
                    onClick={() => setShowAddModal(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 font-bold px-6"
                >
                    <UserPlus size={18} className="mr-2" /> Add New Customer
                </Button>
            </div>

            {/* Search & Stats */}
            <div className="flex flex-col lg:flex-row gap-6">
                <Card className="flex-1 border-none shadow-sm bg-white">
                    <div className="p-2 flex items-center gap-2">
                        <Search className="ml-4 text-slate-400" size={20} />
                        <Input
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search by name, phone, or ID..."
                            className="border-none shadow-none text-lg h-12 bg-transparent"
                        />
                    </div>
                </Card>
                <Card className="bg-slate-900 text-white border-none shadow-lg min-w-[300px]">
                    <CardContent className="p-6 flex items-center justify-between">
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
                                <th className="py-5 px-6 text-[11px] font-black text-slate-400 uppercase tracking-widest text-right">Outstanding Balance</th>
                                <th className="py-5 px-6 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
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
                                                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-black border-2 border-white shadow-sm
                                                    ${isDebtor ? 'bg-rose-100 text-rose-600' : 'bg-indigo-100 text-indigo-600'}`
                                                }>
                                                    {customer.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-slate-900 text-base">{customer.name}</h3>
                                                    <Badge variant="secondary" className="mt-1 text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-500">
                                                        {customer.type || "Retailer"}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="py-4 px-6">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-slate-500 font-medium text-sm">
                                                    <Phone size={14} className="text-slate-300" />
                                                    {customer.contact || "No Phone"}
                                                </div>
                                                <div className="flex items-center gap-2 text-slate-400 text-xs">
                                                    <MapPin size={14} className="text-slate-300" />
                                                    {customer.address || "No Address"}
                                                </div>
                                            </div>
                                        </td>

                                        <td className="py-4 px-6 text-right">
                                            <div className="flex flex-col items-end">
                                                <span className={`text-lg font-black ${isDebtor ? 'text-rose-600' : 'text-slate-900'}`}>
                                                    ${Number(customer.balance || 0).toLocaleString()}
                                                </span>
                                                {isDebtor && <span className="text-[10px] font-bold text-rose-400">Payment Overdue</span>}
                                            </div>
                                        </td>

                                        <td className="py-4 px-6 text-center">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold capitalize ${statusColor}`}>
                                                {isDebtor ? "Pending Payment" : "Good Standing"}
                                            </span>
                                        </td>

                                        <td className="py-4 px-6 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button variant="ghost" size="icon" className="hover:bg-slate-200 text-slate-400 hover:text-indigo-600">
                                                    <History size={18} />
                                                </Button>
                                                {isDebtor ? (
                                                    <Button
                                                        size="sm"
                                                        onClick={() => {
                                                            const amt = prompt(`Enter payment amount from ${customer.name}:`);
                                                            if (amt) collectPayment(customer.name, Number(amt));
                                                        }}
                                                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-lg shadow-emerald-200"
                                                    >
                                                        Collect <ArrowRight size={14} className="ml-1" />
                                                    </Button>
                                                ) : (
                                                    <Button variant="ghost" size="icon" className="text-slate-300">
                                                        <MoreHorizontal size={18} />
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
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <Card className="w-full max-w-md bg-white border-none shadow-2xl">
                        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 pb-4">
                            <CardTitle>New Customer</CardTitle>
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
                                <Button type="submit" className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold">
                                    Create Account
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default Customers;
