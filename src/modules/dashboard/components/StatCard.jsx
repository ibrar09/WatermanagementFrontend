import { Droplets, Truck, DollarSign } from "lucide-react";
import { motion } from "framer-motion";

export default function StatCard({ stats }) {
  if (!stats) return null;

  const data = [
    {
      id: 1,
      title: "Total Revenue",
      value: `$${stats.totalSales.toFixed(2)}`,
      description: "From all sales",
      icon: DollarSign,
      gradient: "from-blue-500 to-indigo-500",
      glow: "shadow-blue-200",
    },
    {
      id: 2,
      title: "Total Expenses",
      value: `$${stats.totalSpent.toFixed(2)}`,
      description: "Cost of goods bought",
      icon: Truck,
      gradient: "from-red-500 to-rose-500",
      glow: "shadow-red-200",
    },
    {
      id: 3,
      title: "Net Profit",
      value: `$${stats.profit.toFixed(2)}`,
      description: "Revenue − Expenses",
      icon: Droplets,
      gradient: "from-emerald-500 to-green-500",
      glow: "shadow-emerald-200",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {data.map((item, index) => {
        const Icon = item.icon;

        return (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.15, duration: 0.5 }}
            whileHover={{ y: -6, scale: 1.02 }}
            className={`relative overflow-hidden rounded-3xl bg-white p-6 shadow-md hover:shadow-xl transition-all ${item.glow}`}
          >
            {/* Accent Glow */}
            <div
              className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${item.gradient}`}
            />

            {/* Content */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
                  {item.title}
                </p>

                <p className="text-3xl font-extrabold text-gray-900 mt-2">
                  {item.value}
                </p>

                <p className="text-xs text-gray-500 mt-1">
                  {item.description}
                </p>
              </div>

              {/* Icon */}
              <div
                className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-white shadow-lg`}
              >
                <Icon size={26} />
              </div>
            </div>

            {/* Subtle Background Decoration */}
            <div className="absolute -right-10 -bottom-10 w-32 h-32 rounded-full bg-gray-100 opacity-40" />
          </motion.div>
        );
      })}
    </div>
  );
}
