import React from "react";
import {
    Zap, Droplet, Flame, Gauge, TrendingUp, AlertTriangle,
    Calendar, Download, CheckCircle2
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Badge } from "../../../components/ui/Badge";

const UtilitiesAndConsumables = () => {
    // Mock Data for Charts
    const data = [
        { name: 'Mon', electricity: 400, fuel: 240 },
        { name: 'Tue', electricity: 300, fuel: 139 },
        { name: 'Wed', electricity: 200, fuel: 980 },
        { name: 'Thu', electricity: 278, fuel: 390 },
        { name: 'Fri', electricity: 189, fuel: 480 },
        { name: 'Sat', electricity: 239, fuel: 380 },
        { name: 'Sun', electricity: 349, fuel: 430 },
    ];

    const UtilityCard = ({ icon: Icon, title, value, unit, trend, color }) => (
        <Card className="border-none shadow-md hover:shadow-xl transition-all">
            <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-xl ${color === 'blue' ? 'bg-blue-100 text-blue-600' : color === 'orange' ? 'bg-orange-100 text-orange-600' : 'bg-emerald-100 text-emerald-600'}`}>
                        <Icon size={24} />
                    </div>
                    <Badge variant={trend > 0 ? "destructive" : "success"}>
                        {trend > 0 ? "+" : ""}{trend}%
                    </Badge>
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{title}</p>
                <div className="flex items-baseline gap-1 mt-1">
                    <h3 className="text-3xl font-black text-slate-900">{value}</h3>
                    <span className="text-xs font-bold text-slate-500">{unit}</span>
                </div>
            </CardContent>
        </Card>
    );

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-fade-in p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <Gauge className="text-amber-500" size={32} /> Utilities & Consumables
                    </h1>
                    <p className="text-slate-500 mt-1">Track energy consumption, fuel usage, and ongoing operational costs.</p>
                </div>
                <Button variant="outline">
                    <Download size={16} className="mr-2" /> Annual Report
                </Button>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <UtilityCard icon={Zap} title="Avg. Electricity" value="452" unit="kWh/day" trend={-12} color="blue" />
                <UtilityCard icon={Flame} title="Diesel Usage" value="45" unit="Liters/day" trend={8} color="orange" />
                <UtilityCard icon={Droplet} title="Water Efficiency" value="98.2" unit="%" trend={-2} color="emerald" />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Chart Section */}
                <Card className="lg:col-span-2 shadow-lg border-none">
                    <CardHeader>
                        <CardTitle>Consumption Trends</CardTitle>
                        <CardDescription>Weekly breakdown of power vs fuel.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[350px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data}>
                                    <defs>
                                        <linearGradient id="colorElec" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorFuel" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} />
                                    <Area type="monotone" dataKey="electricity" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorElec)" />
                                    <Area type="monotone" dataKey="fuel" stroke="#f97316" strokeWidth={3} fillOpacity={1} fill="url(#colorFuel)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Maintenance / Alerts Panel */}
                <div className="space-y-6">
                    <Card className="bg-slate-900 text-white border-none shadow-xl">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                                <AlertTriangle className="text-yellow-400" /> Maintenance Support
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="p-4 bg-white/5 rounded-xl border border-white/10 flex gap-4 items-start">
                                <div className="mt-1 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                                <div>
                                    <p className="font-bold text-white">Generator Service</p>
                                    <p className="text-xs text-slate-400 mt-1">Due in 2 days. Oil change required.</p>
                                </div>
                            </div>
                            <div className="p-4 bg-white/5 rounded-xl border border-white/10 flex gap-4 items-start">
                                <div className="mt-1 w-2 h-2 rounded-full bg-emerald-500" />
                                <div>
                                    <p className="font-bold text-white">RO Membrane Cleaning</p>
                                    <p className="text-xs text-slate-400 mt-1">Completed successfully yesterday.</p>
                                </div>
                            </div>
                            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-2">
                                Schedule Maintenance
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-lg">
                        <CardContent className="p-6">
                            <h3 className="font-bold text-slate-800 mb-4">Consumables Stock</h3>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-xs font-bold mb-1">
                                        <span>Lubricant Oil</span>
                                        <span className="text-emerald-600">80%</span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-emerald-500 w-[80%]" />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-xs font-bold mb-1">
                                        <span>Filter Cartridges</span>
                                        <span className="text-amber-500">20%</span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-amber-500 w-[20%]" />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-xs font-bold mb-1">
                                        <span>Cleaning Chemicals</span>
                                        <span className="text-blue-500">65%</span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-500 w-[65%]" />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default UtilitiesAndConsumables;
