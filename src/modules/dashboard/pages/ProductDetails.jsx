import React, { useState, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useData } from "../../../context/DataContext";
import { ArrowLeft, Package, Activity, Loader2, Filter, ShoppingCart, Factory, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const ProductDetails = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { inventory, transactions, productionHistory } = useData();

    // URL Params
    const category = searchParams.get("category") || "All Products";
    const keywords = searchParams.get("keywords")?.split(",") || [];

    // Filter Data Logic
    const filteredInventory = useMemo(() => {
        if (keywords.length === 0) return inventory;
        return inventory.filter(item =>
            keywords.some(k => item.name.toLowerCase().includes(k.toLowerCase()) || item.category === k)
        );
    }, [inventory, keywords]);

    const filteredSales = useMemo(() => {
        if (keywords.length === 0) return transactions.filter(t => t.type === 'SELL');
        return transactions.filter(t =>
            t.type === 'SELL' && keywords.some(k => t.itemName.toLowerCase().includes(k.toLowerCase()))
        );
    }, [transactions, keywords]);

    const filteredProduction = useMemo(() => {
        if (keywords.length === 0) return productionHistory;
        return productionHistory.filter(p =>
            keywords.some(k => p.producedItem.toLowerCase().includes(k.toLowerCase()))
        );
    }, [productionHistory, keywords]);

    // Aggregated Stats
    const totalStock = filteredInventory.reduce((acc, curr) => acc + Number(curr.quantity), 0);
    const totalSold = filteredSales.reduce((acc, curr) => acc + Number(curr.quantity), 0);
    const totalProduced = filteredProduction.reduce((acc, curr) => acc + Number(curr.producedQty), 0);

    const avgPrice = filteredInventory.length > 0
        ? (filteredInventory.reduce((acc, curr) => acc + Number(curr.sellingPrice), 0) / filteredInventory.length).toFixed(2)
        : "0.00";

    const totalRevenue = filteredSales.reduce((acc, curr) => acc + Number(curr.total), 0);

    // Chart Data Preparation (Sales over time for this product group)
    const chartData = useMemo(() => {
        const grouped = {};
        filteredSales.forEach(t => {
            if (!grouped[t.date]) {
                grouped[t.date] = { date: t.date, sales: 0 };
            }
            grouped[t.date].sales += t.total;
        });
        return Object.values(grouped).sort((a, b) => new Date(a.date) - new Date(b.date));
    }, [filteredSales]);

    // Tabs State
    const [activeTab, setActiveTab] = useState("inventory");

    return (
        <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
            {/* Header */}
            <div>
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition mb-4"
                >
                    <ArrowLeft size={20} /> Back to Dashboard
                </button>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-gray-800 dark:text-white mb-2">{category}</h1>
                        <p className="text-gray-500">Detailed performance insights and history.</p>
                    </div>
                    <div className="flex gap-2">
                        <span className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-bold text-sm">
                            {filteredInventory.length} variants found
                        </span>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <p className="text-gray-500 text-sm font-bold uppercase">In Stock</p>
                    <div className="flex items-end justify-between mt-2">
                        <span className="text-3xl font-black text-gray-800">{totalStock}</span>
                        <Package className="text-blue-500 mb-1" size={24} />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <p className="text-gray-500 text-sm font-bold uppercase">Total Sold</p>
                    <div className="flex items-end justify-between mt-2">
                        <span className="text-3xl font-black text-gray-800">{totalSold}</span>
                        <ShoppingCart className="text-green-500 mb-1" size={24} />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <p className="text-gray-500 text-sm font-bold uppercase">Produced</p>
                    <div className="flex items-end justify-between mt-2">
                        <span className="text-3xl font-black text-gray-800">{totalProduced}</span>
                        <Factory className="text-orange-500 mb-1" size={24} />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <p className="text-gray-500 text-sm font-bold uppercase">Revenue Generated</p>
                    <div className="flex items-end justify-between mt-2">
                        <span className="text-3xl font-black text-gray-800">${totalRevenue.toLocaleString()}</span>
                        <TrendingUp className="text-purple-500 mb-1" size={24} />
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: List/Tabs */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Tab Navigation */}
                    <div className="flex gap-4 border-b border-gray-200 pb-1">
                        <button
                            onClick={() => setActiveTab("inventory")}
                            className={`pb-3 px-2 text-sm font-bold transition-all border-b-2 ${activeTab === 'inventory' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
                        >
                            Inventory List
                        </button>
                        <button
                            onClick={() => setActiveTab("sales")}
                            className={`pb-3 px-2 text-sm font-bold transition-all border-b-2 ${activeTab === 'sales' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
                        >
                            Sales History
                        </button>
                        <button
                            onClick={() => setActiveTab("production")}
                            className={`pb-3 px-2 text-sm font-bold transition-all border-b-2 ${activeTab === 'production' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
                        >
                            Production Logs
                        </button>
                    </div>

                    {/* Tab Content */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-h-[400px]">

                        {/* INVENTORY TAB */}
                        {activeTab === 'inventory' && (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-semibold">
                                        <tr>
                                            <th className="p-4">Item Name</th>
                                            <th className="p-4">Category</th>
                                            <th className="p-4">Stock</th>
                                            <th className="p-4">Price</th>
                                            <th className="p-4">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {filteredInventory.map((item, idx) => (
                                            <tr key={idx} className="hover:bg-gray-50 transition">
                                                <td className="p-4 font-bold text-gray-800">{item.name}</td>
                                                <td className="p-4 text-sm text-gray-500">{item.category}</td>
                                                <td className="p-4 font-bold">{item.quantity}</td>
                                                <td className="p-4 text-sm text-gray-600">${item.sellingPrice}</td>
                                                <td className="p-4">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${item.quantity > 50 ? 'bg-green-100 text-green-700' : item.quantity > 0 ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'}`}>
                                                        {item.quantity > 0 ? "Active" : "Out of Stock"}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                        {filteredInventory.length === 0 && (
                                            <tr><td colSpan="5" className="p-8 text-center text-gray-400">No items found in this category.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* SALES TAB */}
                        {activeTab === 'sales' && (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-semibold">
                                        <tr>
                                            <th className="p-4">Date</th>
                                            <th className="p-4">Client</th>
                                            <th className="p-4">Item</th>
                                            <th className="p-4">Qty</th>
                                            <th className="p-4">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {filteredSales.slice(0, 50).map((t, idx) => (
                                            <tr key={idx} className="hover:bg-gray-50 transition">
                                                <td className="p-4 text-sm text-gray-500">{t.date}</td>
                                                <td className="p-4 font-medium text-gray-800">{t.client}</td>
                                                <td className="p-4 text-sm text-gray-600">{t.itemName}</td>
                                                <td className="p-4 font-bold text-blue-600">{t.quantity}</td>
                                                <td className="p-4 font-bold">${t.total}</td>
                                            </tr>
                                        ))}
                                        {filteredSales.length === 0 && (
                                            <tr><td colSpan="5" className="p-8 text-center text-gray-400">No sales records found.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* PRODUCTION TAB */}
                        {activeTab === 'production' && (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-semibold">
                                        <tr>
                                            <th className="p-4">Date</th>
                                            <th className="p-4">Produced Item</th>
                                            <th className="p-4">Qty Produced</th>
                                            <th className="p-4">Unit Cost</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {filteredProduction.map((p, idx) => (
                                            <tr key={idx} className="hover:bg-gray-50 transition">
                                                <td className="p-4 text-sm text-gray-500">{p.date}</td>
                                                <td className="p-4 font-medium text-gray-800">{p.producedItem}</td>
                                                <td className="p-4 font-bold text-green-600">+{p.producedQty}</td>
                                                <td className="p-4 text-sm text-gray-600">${p.unitCost}</td>
                                            </tr>
                                        ))}
                                        {filteredProduction.length === 0 && (
                                            <tr><td colSpan="4" className="p-8 text-center text-gray-400">No production records found.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}

                    </div>
                </div>

                {/* Right Column: Charts & Insights */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-80">
                        <h3 className="text-sm font-bold text-gray-500 uppercase mb-4">Sales Trend</h3>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                                <Tooltip />
                                <Bar dataKey="sales" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6 rounded-2xl shadow-xl">
                        <h3 className="font-bold text-lg mb-2">Quick Actions</h3>
                        <p className="text-gray-400 text-sm mb-6">Manage this product line.</p>

                        <div className="space-y-3">
                            <button
                                onClick={() => navigate('/production')}
                                className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl font-semibold flex items-center justify-center gap-2 transition"
                            >
                                <Factory size={18} /> Record Production
                            </button>
                            <button
                                onClick={() => navigate('/sales')}
                                className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl font-semibold flex items-center justify-center gap-2 transition"
                            >
                                <ShoppingCart size={18} /> New Sale
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ProductDetails;
