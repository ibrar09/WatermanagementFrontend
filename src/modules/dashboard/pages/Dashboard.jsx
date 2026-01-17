import { useNavigate } from "react-router-dom";
import { useData } from "../../../context/DataContext";
import {
  Droplet,
  Package,
  ShoppingCart,
  TrendingUp,
  Activity,
  AlertCircle,
  ArrowRight,
  Factory
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "../../../components/ui/Card";

import { Button } from "../../../components/ui/Button";
import { Badge } from "../../../components/ui/Badge";

import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function Dashboard() {
  const { inventory, getStats } = useData();
  const stats = getStats();
  const navigate = useNavigate();

  const salesData = [
    { name: "Mon", original: 4000, new: 2400 },
    { name: "Tue", original: 3000, new: 1398 },
    { name: "Wed", original: 2000, new: 9800 },
    { name: "Thu", original: 2780, new: 3908 },
    { name: "Fri", original: 1890, new: 4800 },
    { name: "Sat", original: 2390, new: 3800 },
    { name: "Sun", original: 3490, new: 4300 },
  ];

  /* 
     Enhanced StatCard with Right-Side Color Accent 
     Matches "Elite" Design System
  */
  const StatCard = ({ title, value, subtext, icon: Icon, trend, color }) => {
    // Map simplified color names to Tailwind classes
    const colorMap = {
      blue: { border: "border-r-blue-500", iconBg: "bg-blue-100", iconText: "text-blue-600", badge: "bg-blue-100 text-blue-700" },
      emerald: { border: "border-r-emerald-500", iconBg: "bg-emerald-100", iconText: "text-emerald-600", badge: "bg-emerald-100 text-emerald-700" },
      amber: { border: "border-r-amber-500", iconBg: "bg-amber-100", iconText: "text-amber-600", badge: "bg-amber-100 text-amber-700" },
      cyan: { border: "border-r-cyan-500", iconBg: "bg-cyan-100", iconText: "text-cyan-600", badge: "bg-cyan-100 text-cyan-700" },
      purple: { border: "border-r-purple-500", iconBg: "bg-purple-100", iconText: "text-purple-600", badge: "bg-purple-100 text-purple-700" },
      rose: { border: "border-r-rose-500", iconBg: "bg-rose-100", iconText: "text-rose-600", badge: "bg-rose-100 text-rose-700" },
    };

    const styles = colorMap[color] || colorMap.blue;

    return (
      <Card className={`bg-white/90 backdrop-blur rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border-y-0 border-l-0 ${styles.border} border-r-[6px] group`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                {title}
              </p>
              <h3 className="text-3xl font-black text-gray-900 mt-2 tracking-tight group-hover:scale-105 transition-transform origin-left">
                {value}
              </h3>
            </div>
            <div className={`p-4 rounded-xl ${styles.iconBg} ${styles.iconText} transition-colors`}>
              <Icon size={28} />
            </div>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <Badge
              variant="outline"
              className={`rounded-md border-none px-2 font-bold ${trend === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}
            >
              {trend === "up" ? "+" : "-"}
              {Math.floor(Math.random() * 12) + 2}%
            </Badge>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              {subtext}
            </span>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-10">
      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Real-time overview of your water plant operations
          </p>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={() => navigate("/reports")}>
            View Reports
          </Button>
          <Button onClick={() => navigate("/sales")}>
            <ShoppingCart className="mr-2 h-4 w-4" />
            New Sale
          </Button>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Inventory Value"
          value={`$${stats.stockValue.toLocaleString()}`}
          subtext="vs last month"
          icon={Package}
          trend="up"
          color="blue"
        />
        <StatCard
          title="Total Profit"
          value={`$${stats.profit.toLocaleString()}`}
          subtext="Net earnings"
          icon={TrendingUp}
          trend="up"
          color="emerald"
        />
        <StatCard
          title="Orders Today"
          value={stats.totalOrders}
          subtext="Transactions"
          icon={ShoppingCart}
          trend="up"
          color="amber"
        />
        <StatCard
          title="Plant Efficiency"
          value="94%"
          subtext="Uptime"
          icon={Factory}
          trend="down"
          color="purple"
        />
      </div>

      {/* LIVE PRODUCTION FLOW */}
      <Card className="bg-slate-900 border-none shadow-2xl relative overflow-hidden group">
        {/* Animated Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 opacity-80" />

        <CardHeader className="relative z-10 flex flex-row items-center justify-between border-b border-white/10 pb-4">
          <div>
            <CardTitle className="flex items-center gap-3 text-white">
              <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400 animate-pulse">
                <Activity size={24} />
              </div>
              Live Production Telemetry
            </CardTitle>
            <CardDescription className="text-slate-400 mt-1 pl-1">
              Real-time filtration pressure & output flow monitoring
            </CardDescription>
          </div>
          <div className="flex gap-4">
            <div className="text-right">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">System Status</p>
              <Badge className="bg-emerald-500/20 text-emerald-400 border-none animate-pulse">OPERATIONAL</Badge>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Current Output</p>
              <p className="text-xl font-mono font-black text-white">1,240 <span className="text-xs text-slate-500">BPH</span></p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="relative z-10 h-[280px] w-full pt-6">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={[
              { time: '10:00', pressure: 65, flow: 40 }, { time: '10:05', pressure: 70, flow: 45 },
              { time: '10:10', pressure: 68, flow: 55 }, { time: '10:15', pressure: 72, flow: 60 },
              { time: '10:20', pressure: 75, flow: 58 }, { time: '10:25', pressure: 80, flow: 65 },
              { time: '10:30', pressure: 78, flow: 70 }, { time: '10:35', pressure: 82, flow: 75 },
              { time: '10:40', pressure: 79, flow: 72 }, { time: '10:45', pressure: 85, flow: 80 },
              { time: '10:50', pressure: 88, flow: 85 }, { time: '10:55', pressure: 90, flow: 82 },
            ]}>
              <defs>
                <linearGradient id="colorFlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorPressure" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                itemStyle={{ color: '#e2e8f0', fontSize: '12px', fontWeight: 'bold' }}
                labelStyle={{ color: '#94a3b8', fontSize: '10px' }}
              />
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
              <Area type="monotone" dataKey="flow" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorFlow)" animationDuration={3000} />
              <Area type="monotone" dataKey="pressure" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorPressure)" animationDuration={3000} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* CHART + ALERTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* SALES CHART */}
        <Card className="lg:col-span-2 border-none shadow-lg rounded-2xl">
          <CardHeader>
            <CardTitle>Sales Analysis</CardTitle>
            <CardDescription>
              Weekly revenue comparison
            </CardDescription>
          </CardHeader>

          <CardContent className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} />
                <YAxis tickFormatter={(v) => `$${v}`} tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="original" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                <Bar dataKey="new" fill="#22c55e" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* LOW STOCK */}
        <Card className="border-none shadow-lg rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle /> Critical Stock
            </CardTitle>
            <CardDescription>
              Immediate attention required
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {inventory
              .filter(i => Number(i.quantity) < 200)
              .slice(0, 5)
              .map(item => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-red-50 hover:bg-red-100 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-white p-2 rounded-full shadow">
                      <Droplet size={16} className="text-red-500" />
                    </div>
                    <div>
                      <p className="text-sm font-bold">{item.name}</p>
                      <p className="text-xs text-red-600">
                        {item.quantity} units left
                      </p>
                    </div>
                  </div>
                  <Button size="icon" variant="ghost">
                    <ArrowRight size={14} />
                  </Button>
                </div>
              ))}

            {inventory.every(i => Number(i.quantity) >= 200) && (
              <div className="text-center py-6 text-muted-foreground">
                <Package className="mx-auto mb-2 opacity-50" size={32} />
                All stock levels healthy
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
