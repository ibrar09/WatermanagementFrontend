import React, { useMemo } from "react";
import { useData } from "../../../context/DataContext";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from "recharts";
import { TrendingUp, TrendingDown, DollarSign, Calendar } from "lucide-react";

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
        <div className="space-y-8 max-w-7xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold text-gray-800">Financial Reports</h1>
                <p className="text-gray-500">Overview of company performance and transaction history.</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                        <p className="text-2xl font-bold text-green-600">+${stats.totalSales.toFixed(2)}</p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-full text-green-600">
                        <TrendingUp size={24} />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Total Expenses</p>
                        <p className="text-2xl font-bold text-red-600">-${stats.totalSpent.toFixed(2)}</p>
                    </div>
                    <div className="p-3 bg-red-50 rounded-full text-red-600">
                        <TrendingDown size={24} />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Net Profit</p>
                        <p className={`text-2xl font-bold ${stats.profit >= 0 ? 'text-blue-600' : 'text-red-500'}`}>
                            ${stats.profit.toFixed(2)}
                        </p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-full text-blue-600">
                        <DollarSign size={24} />
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-6">Income vs Expenses</h3>
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#9CA3AF" />
                                <YAxis tick={{ fontSize: 12 }} stroke="#9CA3AF" />
                                <Tooltip contentStyle={{ borderRadius: '12px', borderColor: '#F3F4F6' }} />
                                <Legend />
                                <Bar dataKey="sales" name="Sales" fill="#10B981" radius={[4, 4, 0, 0]} barSize={30} />
                                <Bar dataKey="expenses" name="Expenses" fill="#EF4444" radius={[4, 4, 0, 0]} barSize={30} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-6">Profit Trend</h3>
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="date" stroke="#9CA3AF" />
                                <YAxis stroke="#9CA3AF" />
                                <Tooltip />
                                <Area type="monotone" dataKey="sales" stroke="#3B82F6" fillOpacity={1} fill="url(#colorProfit)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Transaction Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-gray-800">Recent Transactions</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 font-semibold tracking-wider">
                                <th className="p-4">Type</th>
                                <th className="p-4">Item</th>
                                <th className="p-4">Date/Time</th>
                                <th className="p-4">Quantity</th>
                                <th className="p-4">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {transactions.slice(0, 10).map((t) => (
                                <tr key={t.id} className="hover:bg-gray-50 transition">
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-md text-xs font-bold ${t.type === "SELL" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                            {t.type}
                                        </span>
                                    </td>
                                    <td className="p-4 font-medium text-gray-800">{t.itemName}</td>
                                    <td className="p-4 text-gray-500 text-sm">{t.date} <span className="text-gray-400 text-xs ml-1">{t.time}</span></td>
                                    <td className="p-4 text-gray-600">{t.quantity}</td>
                                    <td className="p-4 font-semibold text-gray-800">${t.total.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {transactions.length === 0 && (
                        <div className="p-8 text-center text-gray-400">No transactions found.</div>
                    )}
                </div>
            </div>
        </div>
    );
}
