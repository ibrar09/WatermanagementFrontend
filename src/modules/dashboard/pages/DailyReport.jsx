import React, { useMemo } from "react";
import { useData } from "../../../context/DataContext";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/Card";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "../../../components/ui/Table";
import { Badge } from "../../../components/ui/Badge";
import { Printer, Calendar, TrendingUp, TrendingDown, Package, Truck, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "../../../components/ui/Button";

const DailyReport = () => {
    const { transactions, expenses, inventory } = useData();

    // Get Today's Date in YYYY-MM-DD
    const today = new Date().toISOString().split('T')[0];
    const displayDate = new Date().toLocaleDateString('en-PK', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    // Aggregate Data
    const dailyStats = useMemo(() => {
        const todayTx = transactions.filter(t => t.date === today);
        const todayExp = expenses.filter(e => e.date === today); // Assuming expense has date field YYYY-MM-DD

        const salesTotal = todayTx.filter(t => t.type === 'SELL').reduce((acc, curr) => acc + curr.total, 0);
        const expenseTotal = todayExp.reduce((acc, curr) => acc + Number(curr.amount), 0);

        // Mock Production Data (since not unified yet)
        const productionMorning = 2500; // Bottles
        const productionEvening = 1800; // Bottles
        const productionTotal = productionMorning + productionEvening;

        // Cash Calculation
        const cashInHand = salesTotal - expenseTotal;

        return { salesTotal, expenseTotal, cashInHand, productionTotal, productionMorning, productionEvening, todayTx, todayExp };
    }, [transactions, expenses, today]);

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-fade-in p-6 bg-slate-50 min-h-screen">
            {/* Header / Print Toolbar */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="bg-slate-100 text-slate-600 border-slate-200">DAILY FACTORY REPORT (DFR)</Badge>
                        <span className="text-xs font-bold text-slate-400">#REP-{today.replace(/-/g, '')}</span>
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Today's Business</h1>
                    <p className="text-slate-500 font-medium flex items-center gap-2 mt-1">
                        <Calendar size={16} /> {displayDate}
                    </p>
                </div>
                <Button onClick={() => window.print()} variant="outline" className="gap-2 border-slate-300 hover:bg-slate-50 text-slate-700">
                    <Printer size={18} /> Print Report
                </Button>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Cash Flow */}
                <Card className="md:col-span-3 border-none shadow-xl bg-slate-900 text-white overflow-hidden">
                    <CardContent className="p-0 flex flex-col md:flex-row">
                        <div className="flex-1 p-8 border-b md:border-b-0 md:border-r border-white/10">
                            <p className="text-slate-400 font-bold uppercase text-xs tracking-widest mb-2">Total Sales (Aaj ki Sale)</p>
                            <div className="flex items-center gap-3">
                                <TrendingUp className="text-emerald-400" size={32} />
                                <span className="text-4xl font-black text-emerald-400">Rs. {dailyStats.salesTotal.toLocaleString()}</span>
                            </div>
                        </div>
                        <div className="flex-1 p-8 border-b md:border-b-0 md:border-r border-white/10 bg-rose-900/10">
                            <p className="text-rose-200/70 font-bold uppercase text-xs tracking-widest mb-2">Expenses (Kharcha)</p>
                            <div className="flex items-center gap-3">
                                <TrendingDown className="text-rose-400" size={32} />
                                <span className="text-4xl font-black text-rose-400">Rs. {dailyStats.expenseTotal.toLocaleString()}</span>
                            </div>
                        </div>
                        <div className="flex-1 p-8 bg-blue-900/20">
                            <p className="text-blue-200/70 font-bold uppercase text-xs tracking-widest mb-2">Net Cash (Bachat)</p>
                            <span className="text-4xl font-black text-white">Rs. {dailyStats.cashInHand.toLocaleString()}</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Production Summary */}
                <Card className="border-none shadow-lg bg-white">
                    <CardHeader className="border-b border-slate-100 pb-4">
                        <CardTitle className="flex items-center gap-2 text-base text-slate-700">
                            <Package className="text-blue-600" size={20} /> Production (Bottle Count)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-4">
                        <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                            <span className="text-sm font-bold text-slate-500">Morning Shift</span>
                            <span className="font-mono font-black text-lg text-slate-800">{dailyStats.productionMorning.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                            <span className="text-sm font-bold text-slate-500">Evening Shift</span>
                            <span className="font-mono font-black text-lg text-slate-800">{dailyStats.productionEvening.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                            <span className="text-sm font-black text-slate-800 uppercase">Total Produced</span>
                            <span className="font-mono font-black text-2xl text-blue-600">{dailyStats.productionTotal.toLocaleString()}</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Inventory Snapshot */}
                <Card className="md:col-span-2 border-none shadow-lg bg-white">
                    <CardHeader className="border-b border-slate-100 pb-4">
                        <CardTitle className="flex items-center gap-2 text-base text-slate-700">
                            <AlertCircle className="text-amber-500" size={20} /> Closing Stock Snapshot
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Item Name</TableHead>
                                    <TableHead className="text-right">Current Qty</TableHead>
                                    <TableHead className="text-right">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {inventory.slice(0, 5).map(item => (
                                    <TableRow key={item.id} className="hover:bg-slate-50">
                                        <TableCell className="font-bold text-slate-700">{item.name}</TableCell>
                                        <TableCell className="text-right font-mono font-medium">{item.quantity} {item.unit}</TableCell>
                                        <TableCell className="text-right">
                                            {item.quantity < 20 ?
                                                <Badge variant="destructive" className="bg-rose-100 text-rose-600 hover:bg-rose-200">Low Stock</Badge> :
                                                <Badge variant="secondary" className="bg-emerald-100 text-emerald-600 hover:bg-emerald-200">OK</Badge>
                                            }
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

            {/* Detailed Transaction Log */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-none shadow-lg bg-white">
                    <CardHeader className="bg-emerald-50/50 border-b border-emerald-100">
                        <CardTitle className="text-emerald-700 text-base">Sales Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="max-h-80 overflow-y-auto">
                            <Table>
                                <TableBody>
                                    {dailyStats.todayTx.filter(t => t.type === 'SELL').map((t, i) => (
                                        <TableRow key={i}>
                                            <TableCell className="font-medium text-slate-600">{t.itemName}</TableCell>
                                            <TableCell className="text-right font-bold text-emerald-600">+ Rs. {t.total.toLocaleString()}</TableCell>
                                        </TableRow>
                                    ))}
                                    {dailyStats.todayTx.length === 0 && <div className="p-6 text-center text-slate-400 text-sm">No sales recorded today.</div>}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-lg bg-white">
                    <CardHeader className="bg-rose-50/50 border-b border-rose-100">
                        <CardTitle className="text-rose-700 text-base">Expense Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="max-h-80 overflow-y-auto">
                            <Table>
                                <TableBody>
                                    {dailyStats.todayExp.map((e, i) => (
                                        <TableRow key={i}>
                                            <TableCell>
                                                <p className="font-medium text-slate-700">{e.category}</p>
                                                <p className="text-xs text-slate-400">{e.description}</p>
                                            </TableCell>
                                            <TableCell className="text-right font-bold text-rose-600">- Rs. {Number(e.amount).toLocaleString()}</TableCell>
                                        </TableRow>
                                    ))}
                                    {dailyStats.todayExp.length === 0 && <div className="p-6 text-center text-slate-400 text-sm">No expenses recorded today.</div>}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="text-center pt-8 pb-4">
                <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">End of Report • Generative AI & Antigravity Systems</p>
            </div>
        </div>
    );
};

export default DailyReport;
