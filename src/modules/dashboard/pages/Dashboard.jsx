import { useNavigate } from "react-router-dom";
import { useData } from "../../../context/DataContext";
import {
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  Factory,
  ArrowRight,
  ChevronUp,
  ChevronDown
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
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts";

export default function Dashboard() {
  const { getFinancialHealth } = useData();
  const financial = getFinancialHealth();
  const navigate = useNavigate();

  // Waterfall Chart Data
  const waterfallData = [
    { name: "Total Sales", amount: financial.revenue, fill: "#3b82f6" }, // Blue
    { name: "COGS (Material)", amount: financial.cogs, fill: "#f59e0b" }, // Amber
    { name: "OpEx (Bills)", amount: financial.opex, fill: "#f43f5e" }, // Rose
    { name: "Payroll", amount: financial.payroll, fill: "#8b5cf6" }, // Purple
    { name: "Net Profit", amount: financial.netProfit, fill: financial.netProfit >= 0 ? "#10b981" : "#ef4444" } // Green or Red
  ];

  // Expense Breakdown Pie Data
  const expenseData = [
    { name: "Raw Material", value: financial.cogs, color: "#f59e0b" },
    { name: "Operations", value: financial.opex, color: "#f43f5e" },
    { name: "Salaries", value: financial.payroll, color: "#8b5cf6" }
  ].filter(d => d.value > 0);

  return (
    <div className="container-responsive spacing-y-responsive animate-fade-in">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Executive Dashboard</h1>
          <p className="text-sm sm:text-base text-slate-500 font-medium">Financial Health & Company Trajectory</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => navigate("/sales")}>
            <ShoppingCart className="mr-2 h-4 w-4" /> New Sale
          </Button>
        </div>
      </div>

      {/* HERO: COMPANY TRAJECTORY BOARD */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">

        {/* MAIN STATUS CARD */}
        <Card className={`lg:col-span-2 border-none shadow-2xl relative overflow-hidden flex flex-col justify-center ${financial.netProfit >= 0 ? "bg-slate-900" : "bg-rose-900"}`}>
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <TrendingUp size={300} className={`absolute -right-10 sm:-right-20 -bottom-10 sm:-bottom-20 ${financial.netProfit >= 0 ? "text-emerald-500" : "hidden"}`} />
            <TrendingDown size={300} className={`absolute -right-10 sm:-right-20 -bottom-10 sm:-bottom-20 ${financial.netProfit < 0 ? "text-rose-500" : "hidden"}`} />
          </div>

          <CardContent className="p-6 sm:p-8 relative z-10 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Badge variant="outline" className={`border-white/20 text-white px-3 py-1 uppercase tracking-widest ${financial.netProfit >= 0 ? "bg-emerald-500/20" : "bg-rose-500/20"}`}>
                  Company Status
                </Badge>
                <span className="text-xs sm:text-sm font-bold opacity-70 italic">
                  {financial.netProfit >= 0 ? "Profitable & Growing" : "Operating at Loss"}
                </span>
              </div>

              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter flex items-center gap-4">
                <span className="opacity-50 text-2xl sm:text-3xl font-medium">Rs.</span>
                {financial.netProfit.toLocaleString()}
              </h2>

              <p className="mt-4 text-sm sm:text-base font-medium opacity-80 max-w-md">
                {financial.netProfit >= 0
                  ? "Great job! Your revenue exceeds all operational costs, salaries, and purchases."
                  : "Warning: Your expenses are currently higher than your sales revenue."
                }
              </p>
            </div>

            <div className={`hidden sm:flex items-center justify-center w-24 h-24 sm:w-32 sm:h-32 rounded-full ${financial.netProfit >= 0 ? "bg-emerald-500 text-slate-900" : "bg-rose-500 text-white"} shadow-2xl shadow-black/50`}>
              {financial.netProfit >= 0
                ? <ChevronUp size={64} strokeWidth={4} />
                : <ChevronDown size={64} strokeWidth={4} />
              }
            </div>
          </CardContent>
        </Card>

        {/* MARGIN INDICATOR */}
        <Card className="border-none shadow-xl bg-white flex flex-col justify-center items-center p-6 text-center">
          <div className="relative w-40 h-40 flex items-center justify-center">
            <PieChart width={160} height={160}>
              <Pie
                data={[{ value: 100 }]}
                cx={80}
                cy={80}
                innerRadius={60}
                outerRadius={70}
                fill="#e2e8f0"
                dataKey="value"
                startAngle={90}
                endAngle={-270}
              />
              <Pie
                data={[{ value: Math.abs(financial.profitMargin) }]}
                cx={80}
                cy={80}
                innerRadius={60}
                outerRadius={70}
                fill={financial.profitMargin >= 0 ? "#10b981" : "#f43f5e"}
                dataKey="value"
                startAngle={90}
                endAngle={90 - (Math.abs(financial.profitMargin) * 3.6)}
                cornerRadius={10}
              />
            </PieChart>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-black text-slate-900">{financial.profitMargin.toFixed(1)}%</span>
              <span className="text-[10px] uppercase font-bold text-slate-400">Net Margin</span>
            </div>
          </div>
          <div className="mt-4 space-y-1">
            <h3 className="text-lg font-bold text-slate-800">Efficiency Score</h3>
            <p className="text-xs text-slate-500 font-medium">Target: &gt;20%</p>
          </div>
        </Card>
      </div>

      {/* FINANCIAL BREAKDOWN */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">

        {/* WATERFALL CHART */}
        <Card className="border-none shadow-lg bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="text-blue-500" size={20} /> Profit Waterfall
            </CardTitle>
            <CardDescription>
              Visualizing how Revenue is reduced by Costs to calculate Net Profit.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={waterfallData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 11, fontWeight: 'bold', fill: '#64748b' }} />
                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="amount" barSize={32} radius={[0, 4, 4, 0]}>
                  {waterfallData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* EXPENSE DISTRIBUTION */}
        <Card className="border-none shadow-lg bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Factory className="text-rose-500" size={20} /> Cost Distribution
            </CardTitle>
            <CardDescription>
              Where is the money going? Breakdown of all outflows.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row items-center justify-center gap-8 h-80">
            <div style={{ width: '100%', height: '100%', minHeight: '200px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expenseData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {expenseData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-4 w-full md:w-1/2">
              {expenseData.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm font-bold text-slate-700">{item.name}</span>
                  </div>
                  <span className="font-mono font-bold text-slate-900">Rs. {Number(item.value).toLocaleString()}</span>
                </div>
              ))}
              {expenseData.length === 0 && <p className="text-center text-slate-400">No expenses recorded yet.</p>}
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
