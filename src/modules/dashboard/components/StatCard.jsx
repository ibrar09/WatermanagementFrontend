import { Droplets, Truck, DollarSign } from "lucide-react";

export default function StatCard({ stats }) {
  if (!stats) return null; // Guard

  const data = [
    {
      id: 1,
      title: "Total Revenue",
      value: `$${stats.totalSales.toFixed(2)}`,
      description: "From all sales",
      icon: <DollarSign className="w-6 h-6 text-blue-600" />,
      bg: "bg-blue-100",
    },
    {
      id: 2,
      title: "Total Expenses",
      value: `$${stats.totalSpent.toFixed(2)}`,
      description: "Cost of goods bought",
      icon: <Truck className="w-6 h-6 text-red-600" />, // Changed color to red for expenses
      bg: "bg-red-100",
    },
    {
      id: 3,
      title: "Net Profit",
      value: `$${stats.profit.toFixed(2)}`,
      description: "Revenue - Expenses",
      icon: <Droplets className="w-6 h-6 text-green-600" />, // Changed to Green for profit
      bg: "bg-green-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {data.map((item) => (
        <div
          key={item.id}
          className="bg-white rounded-2xl px-5 py-4 shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-between"
        >
          {/* Left Section */}
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              {item.title}
            </p>
            <p className="text-xl font-bold text-gray-800 mt-1">
              {item.value}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              {item.description}
            </p>
          </div>

          {/* Right Icon */}
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center ${item.bg}`}
          >
            {item.icon}
          </div>
        </div>
      ))}
    </div>
  );
}
