import React from "react";
import { Package } from "lucide-react";
import { motion } from "framer-motion";

const activityData = [
  { route: "Route A", driver: "Ali Khan", customers: 25, status: "Completed" },
  { route: "Route B", driver: "Usman Ahmed", customers: 18, status: "In Progress" },
  { route: "Route C", driver: "Bilal Hussain", customers: 12, status: "Pending" },
];

const statusStyles = {
  Completed: "bg-emerald-100 text-emerald-700",
  "In Progress": "bg-sky-100 text-sky-700",
  Pending: "bg-amber-100 text-amber-700",
};

// Color palette for alert cards
const cardColors = [
  { bg: "bg-orange-50", border: "border-orange-300", iconBg: "bg-orange-100", iconColor: "text-orange-600" },
  { bg: "bg-blue-50", border: "border-blue-300", iconBg: "bg-blue-100", iconColor: "text-blue-600" },
  { bg: "bg-red-50", border: "border-red-300", iconBg: "bg-red-100", iconColor: "text-red-600" },
];

const AlertsSection = ({ lowStock = [] }) => {
  return (
    <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      {/* LEFT: ALERT CARDS */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-700 tracking-wide uppercase">
          ⚠ Inventory Alerts
        </h3>

        {lowStock.length > 0 ? (
          lowStock.slice(0, 3).map((item, idx) => {
            const colors = cardColors[idx % cardColors.length];
            return (
              <motion.div
                key={item.id}
                className={`relative rounded-2xl p-5 shadow-md border ${colors.border} ${colors.bg} hover:shadow-xl transition`}
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: idx * 0.2 }}
              >
                {/* ICON */}
                <div className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center ${colors.iconBg} ${colors.iconColor} shadow`}>
                  <Package size={20} />
                </div>

                {/* QUANTITY */}
                <p className="text-2xl font-bold text-gray-900">
                  {item.quantity}{" "}
                  <span className="text-sm font-medium text-gray-500">units</span>
                </p>
                <p className="text-xs text-gray-400 mt-1">Available Stock</p>

                {/* ITEM NAME */}
                <div className="mt-4">
                  <p className="text-sm font-semibold text-gray-800">{item.name}</p>
                  <motion.span
                    className="inline-block mt-2 px-3 py-1 rounded-full text-[10px] font-bold tracking-wide"
                    style={{ backgroundColor: "#ffe0e0", color: "#d10000" }}
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    LOW STOCK
                  </motion.span>
                </div>
              </motion.div>
            );
          })
        ) : (
          <motion.div
            className="bg-white rounded-2xl p-8 shadow-md text-center border border-gray-100"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mx-auto w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-3 animate-pulse">
              <Package size={28} />
            </div>
            <h4 className="text-gray-800 font-semibold">Inventory Healthy</h4>
            <p className="text-xs text-gray-500 mt-1">No low stock warnings at the moment.</p>
          </motion.div>
        )}
      </div>

      {/* RIGHT: ACTIVITY TABLE */}
      <div className="xl:col-span-2 bg-white rounded-2xl shadow-md border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-700 tracking-wide uppercase">
            🚚 Delivery Activity
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-400 border-b">
                <th className="text-left py-3 font-medium">Route</th>
                <th className="text-left py-3 font-medium">Driver</th>
                <th className="text-left py-3 font-medium">Customers</th>
                <th className="text-left py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {activityData.map((item, index) => (
                <motion.tr
                  key={index}
                  className="border-b last:border-none hover:bg-gray-50 transition"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <td className="py-3 font-medium text-gray-800">{item.route}</td>
                  <td className="py-3 text-gray-600">{item.driver}</td>
                  <td className="py-3 text-gray-600">{item.customers}</td>
                  <td className="py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyles[item.status]} animate-pulse`}
                    >
                      {item.status}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default AlertsSection;
