import React, { useState } from "react";
import { useData } from "../../../context/DataContext";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Badge } from "../../../components/ui/Badge";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "../../../components/ui/Table";
import { DollarSign, Plus, Calculator, TrendingDown, Truck, Zap, Wrench, Package } from "lucide-react";

const ExpensesModule = () => {
    const { expenses, addExpense } = useData();
    const [showAddModal, setShowAddModal] = useState(false);
    const [newExpense, setNewExpense] = useState({
        category: "Generator Fuel",
        amount: "",
        description: "",
        vendor: "",
        paymentMethod: "Cash"
    });

    const totalStats = expenses.reduce((acc, curr) => acc + Number(curr.amount), 0);

    const handleAddExpense = (e) => {
        e.preventDefault();
        if (!newExpense.amount) return alert("Please enter amount");
        addExpense(newExpense);
        setShowAddModal(false);
        setNewExpense({ category: "Generator Fuel", amount: "", description: "", vendor: "", paymentMethod: "Cash" });
    };

    const getCategoryIcon = (cat) => {
        if (cat.includes("Fuel") || cat.includes("Vehicle")) return <Truck size={14} />;
        if (cat.includes("Maintenance") || cat.includes("Repair")) return <Wrench size={14} />;
        if (cat.includes("Electricity") || cat.includes("Utilities")) return <Zap size={14} />;
        if (cat.includes("Material")) return <Package size={14} />;
        if (cat.includes("Kitchen") || cat.includes("Tea") || cat.includes("Langar")) return <Package size={14} />; // Using Package icon for food for now, could import Coffee/Utensils if available
        return <DollarSign size={14} />;
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-fade-in p-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight flex items-center gap-2 sm:gap-3">
                        <TrendingDown className="text-slate-700" size={32} />
                        Operational Expenses
                    </h1>
                    <p className="text-sm text-slate-500 mt-1 font-medium max-w-lg">Track plant, fleet, and administrative maintenance costs.</p>
                </div>
                <Button onClick={() => setShowAddModal(true)} className="bg-[#F0B100] hover:bg-[#D49B00] text-slate-900 font-black uppercase tracking-wider text-xs px-6 h-10 shadow-lg shadow-yellow-200/50 transition-all transform hover:-translate-y-0.5">
                    <Plus size={16} className="mr-2" /> Record Expense
                </Button>
            </div>

            {/* Stats Card */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                <Card className="bg-white border-l-4 border-l-rose-500 shadow-sm ring-1 ring-slate-100">
                    <CardContent className="p-4 sm:p-5">
                        <div className="flex items-center justify-between mb-3">
                            <div className="p-2.5 bg-rose-50 rounded-xl text-rose-600">
                                <Calculator size={24} />
                            </div>
                            <Badge variant="destructive" className="bg-rose-100 text-rose-700 border-none font-bold">Monthly Total</Badge>
                        </div>
                        <p className="text-3xl font-black text-slate-800">Rs. {totalStats.toLocaleString()}</p>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Total Expenditure</p>
                    </CardContent>
                </Card>
            </div>

            {/* Expense Table */}
            <Card className="border-none shadow-xl bg-white overflow-hidden rounded-2xl ring-1 ring-slate-100">
                <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                    <CardTitle className="text-base font-black text-slate-700 uppercase tracking-widest flex items-center gap-2">
                        <DollarSign size={16} className="text-slate-400" /> Expense Journal
                    </CardTitle>
                </CardHeader>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="font-bold text-slate-400">Date</TableHead>
                                <TableHead className="font-bold text-slate-400">Category</TableHead>
                                <TableHead className="font-bold text-slate-400">Details</TableHead>
                                <TableHead className="font-bold text-slate-400">Payee / Vendor</TableHead>
                                <TableHead className="font-bold text-slate-400 text-right">Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {expenses.map((expense) => (
                                <TableRow key={expense.id} className="hover:bg-slate-50">
                                    <TableCell className="font-bold text-slate-600">{expense.date}</TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className="font-bold text-slate-600 bg-slate-100 border border-slate-200 flex w-fit gap-2">
                                            {getCategoryIcon(expense.category)}
                                            {expense.category}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-slate-500 text-sm">{expense.description || "-"}</TableCell>
                                    <TableCell className="text-slate-900 font-medium">
                                        {expense.vendor || "N/A"}
                                        <div className="text-[10px] text-slate-400 uppercase tracking-wider">{expense.paymentMethod}</div>
                                    </TableCell>
                                    <TableCell className="text-right font-black text-rose-600">- Rs. {Number(expense.amount).toLocaleString()}</TableCell>
                                </TableRow>
                            ))}
                            {expenses.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-12 text-slate-400">No expenses recorded yet.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </Card>

            {/* Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <Card className="w-full max-w-md bg-white shadow-2xl">
                        <CardHeader className="border-b border-slate-100 pb-4">
                            <CardTitle>Record Operational Expense</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <form onSubmit={handleAddExpense} className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Expense Category</label>
                                    <select
                                        className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm font-medium"
                                        value={newExpense.category}
                                        onChange={e => setNewExpense({ ...newExpense, category: e.target.value })}
                                    >
                                        <optgroup label="Plant Operations">
                                            <option>Generator Fuel (Diesel)</option>
                                            <option>Electricity Bill (WAPDA)</option>
                                            <option>RO Plant Maintenance</option>
                                            <option>Machinery Repairs</option>
                                            <option>Water Tanker Supply</option>
                                        </optgroup>
                                        <optgroup label="Sourcing & Logistics">
                                            <option>Raw Materials (Local)</option>
                                            <option>Vehicle Fuel</option>
                                            <option>Vehicle Maintenance</option>
                                            <option>Toll Taxes / Challans</option>
                                        </optgroup>
                                        <optgroup label="Factory Mess / Living">
                                            <option>Kitchen - Rashan (Groceries)</option>
                                            <option>Kitchen - Fresh Items (Veg/Milk)</option>
                                            <option>Kitchen - Roti / Naan</option>
                                            <option>Kitchen - Fuel (LPG/Wood)</option>
                                            <option>Cook / Helper Payment</option>
                                        </optgroup>
                                        <optgroup label="Admin & Staff">
                                            <option>Daily Wages (Dihaadi)</option>
                                            <option>Staff Tea / Langar</option>
                                            <option>Office Rent</option>
                                            <option>Internet / Phone</option>
                                            <option>Sadqah / Khairat</option>
                                            <option>Committee Payment</option>
                                            <option>Masjid Chanda</option>
                                            <option>Miscellaneous</option>
                                        </optgroup>
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-500 uppercase">Amount (Rs.)</label>
                                        <Input
                                            type="number"
                                            required
                                            value={newExpense.amount}
                                            onChange={e => setNewExpense({ ...newExpense, amount: e.target.value })}
                                            placeholder="0.00"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-500 uppercase">Payee / Vendor</label>
                                        <Input
                                            value={newExpense.vendor}
                                            onChange={e => setNewExpense({ ...newExpense, vendor: e.target.value })}
                                            placeholder="e.g. Shell"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Description / Notes</label>
                                    <Input
                                        value={newExpense.description}
                                        onChange={e => setNewExpense({ ...newExpense, description: e.target.value })}
                                        placeholder="Invoice # or details..."
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Payment Method</label>
                                    <select
                                        className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm font-medium"
                                        value={newExpense.paymentMethod}
                                        onChange={e => setNewExpense({ ...newExpense, paymentMethod: e.target.value })}
                                    >
                                        <option>Cash</option>
                                        <option>Online Transfer</option>
                                        <option>Cheque</option>
                                        <option>Credit Card</option>
                                    </select>
                                </div>

                                <div className="flex gap-3 mt-6 pt-4 border-t border-slate-100">
                                    <Button type="button" variant="ghost" onClick={() => setShowAddModal(false)} className="flex-1 font-bold text-slate-500">Cancel</Button>
                                    <Button type="submit" className="flex-1 bg-[#F0B100] hover:bg-[#D49B00] text-slate-900 font-black shadow-md shadow-yellow-200/50">Confirm Expense</Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default ExpensesModule;
