import React from "react";
import { Package, Users, Truck, MoreHorizontal } from "lucide-react";
import { motion } from "framer-motion";

const StockCard = ({ inventory = [] }) => {
  const totalItems = inventory.length;
  const totalStock = inventory.reduce((acc, item) => acc + Number(item.quantity), 0);
  const lowStockCount = inventory.filter(i => i.quantity < 20 && i.quantity > 0).length;
  const outOfStockCount = inventory.filter(i => i.quantity <= 0).length;

  const stockData = [
    {
      label: "Total Items",
      value: totalItems,
      icon: Package,
      gradient: "from-blue-500 to-indigo-500",
    },
    {
      label: "Total Units",
      value: totalStock,
      icon: Users,
      gradient: "from-purple-500 to-fuchsia-500",
    },
    {
      label: "Low Stock",
      value: lowStockCount,
      icon: Truck,
      gradient: "from-amber-500 to-orange-500",
    },
    {
      label: "Out of Stock",
      value: outOfStockCount,
      icon: MoreHorizontal,
      gradient: "from-rose-500 to-red-500",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative overflow-hidden rounded-3xl bg-white shadow-md hover:shadow-xl transition-all p-6"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-extrabold text-gray-900 tracking-tight">
            Stock Overview
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Live inventory summary
          </p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-xs font-semibold text-emerald-700">
            Updated just now
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stockData.map((item, index) => {
          const Icon = item.icon;

          return (
            <motion.div
              key={index}
              whileHover={{ y: -4, scale: 1.04 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="relative rounded-2xl bg-gray-50 p-4 text-center overflow-hidden"
            >
              {/* Gradient Accent */}
              <div
                className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${item.gradient}`}
              />

              <div
                className={`mx-auto w-11 h-11 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-white shadow-md mb-2`}
              >
                <Icon size={18} />
              </div>

              <p className="text-2xl font-extrabold text-gray-900 tabular-nums">
                {item.value}
              </p>

              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mt-1">
                {item.label}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Decorative Blur */}
      <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-blue-100 rounded-full blur-3xl opacity-30" />
    </motion.div>
  );
};

export default StockCard;
