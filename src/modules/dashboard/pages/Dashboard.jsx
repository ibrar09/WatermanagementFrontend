import { useData } from "../../../context/DataContext";
import { useNavigate } from "react-router-dom";
import {
  Droplet,
  Wine,
  Coffee,
  Zap,
  Activity,
  ArrowRight,
  Package,
  AlertCircle,
  TrendingUp,
  DollarSign
} from "lucide-react";

const ProductCard = ({ title, material, capType, bestFor, keywords, inventory, icon: Icon, color }) => {
  const navigate = useNavigate();

  // Color Mapping for Tailwind JIT
  const colorStyles = {
    blue: {
      bg: "bg-blue-50 dark:bg-blue-900/20",
      text: "text-blue-600 dark:text-blue-300",
      border: "hover:border-blue-400",
      iconBg: "bg-blue-50 dark:bg-white/5",
      hoverBg: "hover:bg-blue-50",
      groupText: "text-blue-500"
    },
    cyan: {
      bg: "bg-cyan-50 dark:bg-cyan-900/20",
      text: "text-cyan-600 dark:text-cyan-300",
      border: "hover:border-cyan-400",
      iconBg: "bg-cyan-50 dark:bg-white/5",
      hoverBg: "hover:bg-cyan-50",
      groupText: "text-cyan-500"
    },
    purple: {
      bg: "bg-purple-50 dark:bg-purple-900/20",
      text: "text-purple-600 dark:text-purple-300",
      border: "hover:border-purple-400",
      iconBg: "bg-purple-50 dark:bg-white/5",
      hoverBg: "hover:bg-purple-50",
      groupText: "text-purple-500"
    },
    indigo: {
      bg: "bg-indigo-50 dark:bg-indigo-900/20",
      text: "text-indigo-600 dark:text-indigo-300",
      border: "hover:border-indigo-400",
      iconBg: "bg-indigo-50 dark:bg-white/5",
      hoverBg: "hover:bg-indigo-50",
      groupText: "text-indigo-500"
    }
  };

  const styles = colorStyles[color] || colorStyles.blue;

  // Aggregate Data based on keywords
  const matchedItems = inventory.filter(item =>
    keywords.some(k => item.name.toLowerCase().includes(k.toLowerCase()))
  );

  const totalStock = matchedItems.reduce((acc, curr) => acc + Number(curr.quantity), 0);
  const avgPrice = matchedItems.length > 0
    ? (matchedItems.reduce((acc, curr) => acc + Number(curr.sellingPrice), 0) / matchedItems.length).toFixed(2)
    : "0.00";

  // Determine Alert Status
  const isLowStock = totalStock < 50 && totalStock > 0;
  const isOutOfStock = totalStock === 0 && matchedItems.length > 0;
  const isEmpty = matchedItems.length === 0;

  return (
    <div
      onClick={() => navigate(`/product-details?category=${encodeURIComponent(title)}&keywords=${encodeURIComponent(keywords.join(','))}`)}
      className={`relative group overflow-hidden bg-white dark:bg-white/10 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-white/10 hover:shadow-xl transition-all cursor-pointer ${styles.border}`}
    >
      <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity ${styles.groupText}`}>
        <Icon size={120} />
      </div>

      <div className="relative z-10 flex flex-col h-full justify-between">
        <div>
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className={`p-3 rounded-2xl ${styles.iconBg} ${styles.text}`}>
              <Icon size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">{title}</h3>
          </div>

          {/* Specs */}
          <div className="space-y-2 mb-6">
            <div className="flex items-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              <span className="w-24">Material:</span>
              <span className="text-gray-800 dark:text-white">{material}</span>
            </div>
            <div className="flex items-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              <span className="w-24">Cap Type:</span>
              <span className="text-gray-800 dark:text-white">{capType}</span>
            </div>
            <div className="flex items-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              <span className="w-24">Best For:</span>
              <span className="text-gray-800 dark:text-white truncate">{bestFor}</span>
            </div>
          </div>
        </div>

        {/* Live Data */}
        <div className="pt-6 border-t border-gray-100 dark:border-white/10">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-sm text-gray-400 font-medium mb-1">In Stock</p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-gray-800 dark:text-white space-grotesk">{totalStock}</span>
                <span className="text-sm font-medium text-gray-400">units</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400 font-medium mb-1">Avg Price</p>
              <span className="text-xl font-bold text-gray-700 dark:text-gray-200">${avgPrice}</span>
            </div>
          </div>

          {/* Status Badge */}
          <div className="mt-4 flex items-center justify-between">
            {isEmpty ? (
              <span className="px-3 py-1 rounded-full bg-gray-100 dark:bg-white/10 text-gray-500 text-xs font-bold flex items-center gap-1">
                <AlertCircle size={12} /> No Data
              </span>
            ) : isOutOfStock ? (
              <span className="px-3 py-1 rounded-full bg-red-100 text-red-600 text-xs font-bold flex items-center gap-1">
                <AlertCircle size={12} /> Out of Stock
              </span>
            ) : isLowStock ? (
              <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-600 text-xs font-bold flex items-center gap-1">
                <Activity size={12} /> Low Stock
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full bg-green-100 text-green-600 text-xs font-bold flex items-center gap-1">
                <Package size={12} /> Healthy
              </span>
            )}

            <button className={`p-2 rounded-full ${styles.hoverBg} ${styles.text} transition-colors`}>
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Dashboard() {
  const { inventory, getStats } = useData();
  const stats = getStats();
  const navigate = useNavigate();

  const products = [
    {
      title: "Gallon (19L)",
      material: "Polycarbonate",
      capType: "Valve Cap",
      bestFor: "Home / Office Dispensers",
      keywords: ["19L", "Gallon", "Dispenser"],
      icon: Droplet,
      color: "blue"
    },
    {
      title: "Personal Bottles",
      material: "PET Plastic",
      capType: "Screw Cap",
      bestFor: "Travel, Gym, Daily Use",
      keywords: ["330ml", "500ml", "1.5L", "Bottle"],
      icon: Activity,
      color: "cyan"
    },
    {
      title: "Reflections",
      material: "Premium Glass",
      capType: "Metal Cap",
      bestFor: "Restaurants, Hotels",
      keywords: ["Glass", "Reflection", "Premium"],
      icon: Wine, // Glass icon alternative
      color: "purple"
    },
    {
      title: "Cups (240ml)",
      material: "PP Plastic",
      capType: "Peel-off Foil",
      bestFor: "Events, Offices",
      keywords: ["Cup", "200ml", "240ml"],
      icon: Coffee,
      color: "indigo"
    }
  ];

  return (
    <div className="space-y-10 animate-fade-in max-w-7xl mx-auto">
      {/* 2. Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-4xl font-black text-gray-800 dark:text-white tracking-tight">Product Portfolio</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">Real-time production and inventory insight across all product lines.</p>
        </div>
        <div className="flex items-center gap-4 bg-white dark:bg-white/10 px-6 py-3 rounded-2xl shadow-sm border border-gray-100 dark:border-white/10">
          <div className="text-right">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Inventory Value</p>
            <p className="text-2xl font-black text-green-500">${stats.stockValue.toLocaleString()}</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-green-50 dark:bg-green-500/20 flex items-center justify-center text-green-600 dark:text-green-400">
            <DollarSign size={24} />
          </div>
        </div>
      </div>

      {/* 3. Product Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {products.map((p, i) => (
          <ProductCard key={i} {...p} inventory={inventory} />
        ))}
      </div>

      {/* 4. Quick Actions / Raw Material Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Raw Materials Check */}
        <div className="lg:col-span-2 bg-white dark:bg-white/10 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-white/10">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
            <Package className="text-blue-500" />
            Raw Material Status
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {['Empty Bottles', 'Bottle Caps', 'Labels', 'Preforms'].map((item) => {
              const stock = inventory.find(i => i.name.includes(item))?.quantity || 0;
              const status = stock > 100 ? "Good" : stock > 20 ? "Low" : "Critial";
              const statusColor = stock > 100 ? "bg-green-100 text-green-700" : stock > 20 ? "bg-orange-100 text-orange-700" : "bg-red-100 text-red-700";

              return (
                <div
                  key={item}
                  onClick={() => navigate(`/product-details?category=Raw%20Materials&keywords=${item}`)}
                  className="cursor-pointer p-4 rounded-2xl bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-white/5 flex justify-between items-center group hover:bg-white dark:hover:bg-white/10 transition-colors shadow-sm hover:shadow"
                >
                  <div>
                    <p className="text-sm font-bold text-gray-500 dark:text-gray-400">{item}</p>
                    <p className="text-2xl font-black text-gray-800 dark:text-white mt-1">{stock}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-md text-[10px] uppercase font-bold ${statusColor}`}>
                    {status}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Quick Profit Stat */}
        <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl p-8 shadow-xl text-white relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-indigo-100 font-bold mb-1 flex items-center gap-2">
              <TrendingUp size={18} /> Net Profit (Real-Time)
            </p>
            <h3 className="text-5xl font-black tracking-tight mb-2">${stats.profit.toLocaleString()}</h3>
            <p className="text-indigo-200 text-sm">Based on {stats.totalOrders} transactions</p>

            <button
              onClick={() => navigate('/reports')}
              className="mt-8 w-full py-3 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-xl font-bold transition-all border border-white/30"
            >
              View Financial Report
            </button>
          </div>

          {/* Decor */}
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute top-10 -left-10 w-40 h-40 bg-purple-500/30 rounded-full blur-3xl"></div>
        </div>
      </div>

    </div>
  );
}
