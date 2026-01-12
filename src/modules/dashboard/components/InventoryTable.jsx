import React from "react";
import { useData } from "../../../context/DataContext";
import { AlertCircle, CheckCircle } from "lucide-react";

const InventoryTable = ({ data, onPurchaseClick }) => {
  const { inventory } = useData();
  const displayData = data || inventory;

  const getStatus = (qty) => {
    if (qty <= 0) return { label: "Out of Stock", color: "bg-red-100 text-red-700" };
    if (qty < 20) return { label: "Low Stock", color: "bg-orange-100 text-orange-700" };
    return { label: "In Stock", color: "bg-green-100 text-green-700" };
  };

  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Inventory Status</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-gray-700">
          <thead>
            <tr className="bg-gray-100 rounded-lg">
              <th className="px-4 py-3 text-left rounded-l-lg">ID</th>
              <th className="px-4 py-3 text-left">Item Name</th>
              <th className="px-4 py-3 text-left">Category</th>
              <th className="px-4 py-3 text-left">Available Qty</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Avg Cost</th>
              <th className="px-4 py-3 text-left">Selling Price</th>
              <th className="px-4 py-3 text-left rounded-r-lg">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {displayData.map((item, index) => {
              const status = getStatus(item.quantity);
              return (
                <tr key={item.id || index} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3 font-medium text-gray-500">#{index + 1}</td>
                  <td className="px-4 py-3 font-semibold text-gray-800">{item.name}</td>
                  <td className="px-4 py-3 text-gray-500">{item.category}</td>
                  <td className="px-4 py-3 text-gray-800 font-medium">{item.quantity}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1 ${status.color}`}>
                      {item.quantity <= 0 ? <AlertCircle size={10} /> : <CheckCircle size={10} />}
                      {status.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">${Number(item.costPrice).toFixed(2)}</td>
                  <td className="px-4 py-3 text-gray-800 font-medium">${Number(item.sellingPrice).toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <button
                      className="px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 text-xs font-bold transition"
                      onClick={() => onPurchaseClick(item)}
                    >
                      Restock
                    </button>
                  </td>
                </tr>
              )
            })}
            {displayData.length === 0 && (
              <tr>
                <td colSpan="8" className="p-8 text-center text-gray-400">No items in inventory. Start by Purchasing stock.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryTable;
