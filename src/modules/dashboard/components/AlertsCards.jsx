import React from "react";
import { AlertTriangle, Package, Droplets } from "lucide-react";

const alertCards = [
  {
    id: 1,
    title: "Stock",
    subtitle: "Below Minimum",
    price: "PKR 100",
    priceLabel: "Per Cap Price",
    quantity: "1,500",
    quantityLabel: "Past Purchase",
    icon: <Package className="w-6 h-6 text-orange-600" />,
    bg: "bg-orange-100",
  },
  {
    id: 2,
    title: "Water Level",
    subtitle: "Critical",
    price: "PKR 85",
    priceLabel: "Per Unit",
    quantity: "900",
    quantityLabel: "Last Delivery",
    icon: <Droplets className="w-6 h-6 text-blue-600" />,
    bg: "bg-blue-100",
  },
  {
    id: 3,
    title: "Maintenance",
    subtitle: "Required",
    price: "PKR 1,200",
    priceLabel: "Service Cost",
    quantity: "3",
    quantityLabel: "Pending Tasks",
    icon: <AlertTriangle className="w-6 h-6 text-red-600" />,
    bg: "bg-red-100",
  },
];

const activityData = [
  { route: "Route A", driver: "Ali Khan", customers: 25, status: "Completed" },
  { route: "Route B", driver: "Usman Ahmed", customers: 18, status: "In Progress" },
  { route: "Route C", driver: "Bilal Hussain", customers: 12, status: "Pending" },
];

const AlertsSection = ({ lowStock = [] }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* LEFT: ALERT CARDS */}
      <div className="space-y-4 lg:col-span-1">
        {lowStock.length > 0 ? (
          lowStock.slice(0, 3).map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl px-5 py-4 shadow-sm hover:shadow-md transition flex items-center justify-between border-l-4 border-orange-400"
            >
              {/* LEFT */}
              <div>
                <p className="text-lg font-bold text-gray-800">
                  {item.quantity} Units
                </p>
                <p className="text-xs text-gray-400">
                  Available
                </p>
              </div>

              {/* RIGHT */}
              <div className="flex flex-col items-end gap-1">
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-orange-100 text-orange-600">
                  <Package size={16} />
                </div>
                <p className="text-sm font-semibold text-gray-700 text-right">
                  {item.name}
                </p>
                <p className="text-[10px] text-red-500 uppercase font-bold">
                  Low Stock
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-2">
              <Package size={24} />
            </div>
            <h3 className="text-gray-800 font-medium">Stock Healthy</h3>
            <p className="text-xs text-gray-500">No low stock alerts.</p>
          </div>
        )}
      </div>

      {/* RIGHT: ACTIVITY TABLE (more compact) */}
      <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm px-5 py-4">
        <h3 className="text-base font-bold text-gray-800 mb-3">
          Activity
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-gray-400 border-b">
                <th className="text-left py-2">Route</th>
                <th className="text-left py-2">Driver</th>
                <th className="text-left py-2">Customers</th>
                <th className="text-left py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {activityData.map((item, index) => (
                <tr
                  key={index}
                  className="border-b last:border-none hover:bg-gray-50 transition"
                >
                  <td className="py-2">{item.route}</td>
                  <td className="py-2">{item.driver}</td>
                  <td className="py-2">{item.customers}</td>
                  <td className="py-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold
                        ${item.status === "Completed"
                          ? "bg-green-100 text-green-700"
                          : item.status === "In Progress"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-orange-100 text-orange-700"
                        }`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AlertsSection;
