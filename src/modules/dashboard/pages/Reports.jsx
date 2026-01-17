import React, { useMemo } from "react";
import { useData } from "../../../context/DataContext";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from "recharts";
import { TrendingUp, TrendingDown, DollarSign, Calendar, BarChart2, PieChart, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../components/ui/Card";
import { Badge } from "../../../components/ui/Badge";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "../../../components/ui/Table";

export default function Reports() {
    const { transactions, getStats } = useData();
    const stats = getStats();

    // Prepare data for charts (Group by Date)
    const chartData = useMemo(() => {
        const grouped = {};
        transactions.forEach(t => {
            if (!grouped[t.date]) {
                grouped[t.date] = { date: t.date, sales: 0, expenses: 0 };
            }
            if (t.type === "SELL") grouped[t.date].sales += t.total;
            if (t.type === "BUY") grouped[t.date].expenses += t.total;
        });
        return Object.values(grouped).sort((a, b) => new Date(a.date) - new Date(b.date));
    }, [transactions]);

    return (
        <div className="space-y-8 max-w-7xl mx-auto animate-fade-in p-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <div className="px-2 py-0.5 bg-violet-100 text-violet-700 text-[10px] font-bold uppercase tracking-widest rounded-md">Audit & Finance</div>
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 flex items-center gap-3 tracking-tight">
                        <BarChart2 className="text-violet-600" size={36} />
                        Financial Analytics
                    </h1>
                    <p className="text-slate-500 mt-1 font-medium">Real-time performance metrics and auditing.</p>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-l-0 border-y-0 border-r-[6px] border-r-emerald-500 bg-white shadow-xl hover:shadow-2xl transition-all">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-emerald-100 rounded-xl text-emerald-600">
                                <DollarSign size={24} />
                            </div>
                            <div className="px-3 py-1 bg-emerald-50 rounded-lg text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                                Revenue
                            </div>
                        </div>
                        <p className="text-3xl font-black text-slate-900 flex items-center gap-2">
                            ${stats.totalSales.toLocaleString()}
                        </p>
                        <p className="text-xs font-bold text-slate-400 mt-1 flex items-center gap-1">
                            <TrendingUp size={14} className="text-emerald-500" />
                            <span className="text-emerald-600">+12.5%</span> from last month
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-l-0 border-y-0 border-r-[6px] border-r-rose-500 bg-white shadow-xl hover:shadow-2xl transition-all">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-rose-100 rounded-xl text-rose-600">
                                <Activity size={24} />
                            </div>
                            <div className="px-3 py-1 bg-rose-50 rounded-lg text-[10px] font-black text-rose-600 uppercase tracking-widest">
                                Expenses
                            </div>
                        </div>
                        <p className="text-3xl font-black text-slate-900 flex items-center gap-2">
                            ${stats.totalSpent.toLocaleString()}
                        </p>
                        <p className="text-xs font-bold text-slate-400 mt-1 flex items-center gap-1">
                            <TrendingDown size={14} className="text-rose-500" />
                            <span className="text-rose-600">+5.2%</span> operational costs
                        </p>
                    </CardContent>
                </Card>

                <Card className={`border-l-0 border-y-0 border-r-[6px] ${stats.profit >= 0 ? 'border-r-blue-600' : 'border-r-red-600'} bg-slate-900 text-white shadow-xl hover:shadow-2xl transition-all relative overflow-hidden`}>
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                        <PieChart size={100} />
                    </div>
                    <CardContent className="p-6 relative z-10">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-white/10 rounded-xl text-white">
                                <PieChart size={24} />
                            </div>
                            <div className="px-3 py-1 bg-white/10 rounded-lg text-[10px] font-black text-white/70 uppercase tracking-widest">
                                Net Profit
                            </div>
                        </div>
                        <p className={`text-4xl font-black flex items-center gap-2 ${stats.profit >= 0 ? 'text-blue-400' : 'text-rose-400'}`}>
                            ${stats.profit.toLocaleString()}
                        </p>
                        <p className="text-xs font-medium text-slate-400 mt-1">
                            Net earnings after all expenses
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="shadow-lg border-none bg-white">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base font-black text-slate-700">
                            <BarChart2 size={18} className="text-violet-500" /> Income vs Expenses
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-80 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#94a3b8", fontWeight: "bold" }} tickLine={false} axisLine={false} />
                                    <YAxis tick={{ fontSize: 10, fill: "#94a3b8", fontWeight: "bold" }} tickLine={false} axisLine={false} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: "#fff", borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                                        labelStyle={{ color: "#1e293b", fontWeight: 'bold' }}
                                    />
                                    <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '10px', fontWeight: 'bold' }} />
                                    <Bar dataKey="sales" name="Sales" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={20} />
                                    <Bar dataKey="expenses" name="Expenses" fill="#f43f5e" radius={[4, 4, 0, 0]} barSize={20} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-lg border-none bg-white">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base font-black text-slate-700">
                            <TrendingUp size={18} className="text-blue-500" /> Profit Trend
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-80 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#94a3b8", fontWeight: "bold" }} tickLine={false} axisLine={false} />
                                    <YAxis tick={{ fontSize: 10, fill: "#94a3b8", fontWeight: "bold" }} tickLine={false} axisLine={false} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: "#fff", borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                                        labelStyle={{ color: "#1e293b", fontWeight: 'bold' }}
                                    />
                                    <Area type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorProfit)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Transaction Table */}
            <Card className="shadow-xl border-none bg-white overflow-hidden">
                <CardHeader className="bg-slate-50 border-b border-slate-100">
                    <CardTitle className="flex items-center gap-2">
                        <div className="p-2 bg-slate-200 rounded-lg text-slate-600">
                            <Calendar size={18} />
                        </div>
                        Global Ledger
                    </CardTitle>
                    <CardDescription>Comprehensive list of all financial transactions.</CardDescription>
                </CardHeader>
                <div className="max-h-[500px] overflow-y-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-white border-b border-slate-100 hover:bg-white">
                                <TableHead className="font-black text-xs text-slate-400 uppercase tracking-wider">Type</TableHead>
                                <TableHead className="font-black text-xs text-slate-400 uppercase tracking-wider">Item / Entity</TableHead>
                                <TableHead className="font-black text-xs text-slate-400 uppercase tracking-wider">Timestamp</TableHead>
                                <TableHead className="text-right font-black text-xs text-slate-400 uppercase tracking-wider">Quantity</TableHead>
                                <TableHead className="text-right font-black text-xs text-slate-400 uppercase tracking-wider">Total Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {transactions.slice(0, 50).map((t) => (
                                <TableRow key={t.id} className="group hover:bg-slate-50 transition-colors border-b border-slate-50">
                                    <TableCell>
                                        <Badge variant={t.type === "SELL" ? "success" : "destructive"} className={`uppercase tracking-widest text-[10px] border-none font-bold ${t.type === "SELL" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
                                            {t.type}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <p className="font-bold text-slate-700">{t.itemName}</p>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2 text-slate-400">
                                            <Calendar size={14} />
                                            <span className="text-xs font-bold">{t.date}</span>
                                            <span className="text-[10px] opacity-70 font-mono bg-slate-100 px-1 rounded">{t.time}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right font-black text-slate-600">
                                        {t.quantity}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <span className={`font-black tracking-tight text-lg ${t.type === "SELL" ? "text-emerald-500" : "text-rose-500"}`}>
                                            {t.type === "SELL" ? "+" : "-"}${t.total.toLocaleString()}
                                        </span>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {transactions.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-32 text-center text-slate-400 italic font-medium">
                                        No financial records found. Start trading to see data.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </Card>
        </div>
    );
}
