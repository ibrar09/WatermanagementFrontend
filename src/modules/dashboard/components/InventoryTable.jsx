import React from "react";
import {
  AlertCircle,
  CheckCircle2,
  Package,
  ArrowUpRight,
  MoreHorizontal,
  RefreshCcw,
  ArrowDown
} from "lucide-react";

const Table = ({ data, onPurchaseClick }) => {
  const displayData = data || [];

  const getStatus = (qty) => {
    if (qty <= 0) return {
      label: "Stockout",
      badge: "bg-rose-50 text-rose-700 border-rose-200",
      dot: "bg-rose-500",
      icon: <AlertCircle size={12} />
    };
    if (qty < 20) return {
      label: "Low",
      badge: "bg-amber-50 text-amber-700 border-amber-200",
      dot: "bg-amber-500",
      icon: <AlertCircle size={12} />
    };
    return {
      label: "Healthy",
      badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
      dot: "bg-emerald-500",
      icon: <CheckCircle2 size={12} />
    };
  };

  return (
    <section className="w-full bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
      {/* HEADER */}
      <header className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-b from-slate-50 to-white">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shadow-sm text-slate-500">
            <Package size={22} />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
              Inventory Ledger
            </h2>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
              Live Asset Overview
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition">
            <RefreshCcw size={16} />
          </button>
          <button className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition">
            <MoreHorizontal size={16} />
          </button>
        </div>
      </header>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-white">
              <th className="px-8 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Ref <ArrowDown size={10} className="inline ml-1" />
              </th>
              <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Item
              </th>
              <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Category
              </th>
              <th className="px-6 py-4 text-right text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Quantity
              </th>
              <th className="px-6 py-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Status
              </th>
              <th className="px-6 py-4 text-right text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Price
              </th>
              <th className="px-8 py-4 text-right text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {displayData.map((item, index) => {
              const status = getStatus(item.quantity);

              return (
                <tr
                  key={item.id || index}
                  className="hover:bg-slate-50 transition"
                >
                  <td className="px-8 py-5 text-xs font-bold text-slate-400">
                    #{String(index + 1).padStart(3, "0")}
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-800">
                        {item.name}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        SKU-{item.id?.slice(-4).toUpperCase() || "N/A"}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-5">
                    <span className="px-3 py-1 rounded-lg bg-slate-100 text-[10px] font-semibold text-slate-500">
                      {item.category}
                    </span>
                  </td>

                  <td className="px-6 py-5 text-right">
                    <div className="flex flex-col items-end">
                      <span className={`text-lg font-extrabold tabular-nums ${item.quantity < 20 ? "text-rose-600" : "text-slate-800"
                        }`}>
                        {item.quantity.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-slate-400 uppercase">
                        {item.unit || "units"}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex justify-center">
                      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-bold uppercase ${status.badge}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                        {status.label}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-5 text-right">
                    <div className="flex flex-col items-end">
                      <span className="font-bold text-slate-800">
                        ${Number(item.sellingPrice || 0).toFixed(2)}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        Cost: ${Number(item.costPrice || 0).toFixed(2)}
                      </span>
                    </div>
                  </td>

                  <td className="px-8 py-5 text-right">
                    <button
                      onClick={() => onPurchaseClick(item)}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white text-[11px] font-bold text-slate-600 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition shadow-sm"
                    >
                      Restock
                      <ArrowUpRight size={14} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* EMPTY STATE */}
        {displayData.length === 0 && (
          <div className="py-24 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
              <Package size={26} className="text-slate-400" />
            </div>
            <p className="font-semibold text-slate-700">No Inventory Records</p>
            <p className="text-xs text-slate-400 mt-1 max-w-xs">
              Add inventory items to start tracking assets and stock health.
            </p>
          </div>
        )}
      </div>

      {/* FOOTER */}
      <footer className="px-8 py-4 border-t border-slate-100 bg-slate-50/40 flex justify-between items-center">
        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
          Showing {displayData.length} Items
        </span>
      </footer>
    </section>
  );
};

export default Table;
