import React from "react";
import { Package, Users, Truck, MoreHorizontal } from "lucide-react";

const StockCard = ({ inventory = [] }) => {
  // Calculate real metrics
  const totalItems = inventory.length;
  const totalStock = inventory.reduce((acc, item) => acc + Number(item.quantity), 0);
  const lowStockCount = inventory.filter(i => i.quantity < 20 && i.quantity > 0).length;
  const outOfStockCount = inventory.filter(i => i.quantity <= 0).length;

  const stockData = [
    { label: "Total Items", value: totalItems, icon: <Package size={18} className="text-blue-500" /> },
    { label: "Total Units", value: totalStock, icon: <Users size={18} className="text-purple-500" /> }, // Users icon unrelated but keeping specifically for consistency
    { label: "Low Stock", value: lowStockCount, icon: <Truck size={18} className="text-orange-500" /> }, // Truck unrelated
    { label: "Out of Stock", value: outOfStockCount, icon: <MoreHorizontal size={18} className="text-gray-500" /> },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 px-5 py-4 w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-base font-bold text-gray-900">
          Total Stock
        </h2>

        <div className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-blue-700 font-medium">
            Updated <span className="font-semibold">1 min ago</span>
          </span>
        </div>
      </div>

      {/* Values */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stockData.map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center text-center bg-gray-50 rounded-xl py-3"
          >
            <div className="flex items-center gap-2 mb-1">
              {item.icon}
              <span className="text-2xl font-bold text-gray-800">
                {item.value}
              </span>
            </div>
            <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StockCard;
