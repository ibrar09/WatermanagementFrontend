
import React, { useState } from "react";
import { useData } from "../../../context/DataContext";
import { PlusCircle, RefreshCw, Trash2, CheckCircle } from "lucide-react";

const PRESETS = [
  { name: "Mineral Water (19L)", category: "Water", price: 250 },
  { name: "Mineral Water (1.5L Case)", category: "Water", price: 400 },
  { name: "Mineral Water (500ml Case)", category: "Water", price: 350 },
  { name: "Water Cooler Unit", category: "Electronics", price: 15000 },
  { name: "Empty Bottle (19L)", category: "Raw Material", price: 50 },
];

const PurchaseForm = ({ item }) => {
  const { addStock, transactions } = useData();
  const [showForm, setShowForm] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    categoryName: "",
    selectCategory: "Water",
    clientName: "",
    quantity: "",
    perPrice: "",
    totalPrice: "",
    expiryDate: "",
    description: "",
    purchaseDate: new Date().toISOString().split('T')[0],
    purchaseTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  });

  const handlePresetChange = (e) => {
    const preset = PRESETS.find(p => p.name === e.target.value);
    if (preset) {
      setFormData(prev => ({
        ...prev,
        categoryName: preset.name,
        selectCategory: preset.category,
        perPrice: preset.price,
        totalPrice: prev.quantity ? (Number(prev.quantity) * preset.price).toFixed(2) : ""
      }));
    }
  };

  // Pre-fill form if item is passed (Restock mode)
  React.useEffect(() => {
    if (item) {
      setShowForm(true); // Open form automatically if restocking
      setFormData(prev => ({
        ...prev,
        categoryName: item.name,
        selectCategory: item.category || "Water",
        perPrice: item.costPrice || "",
      }));
    }
  }, [item]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "quantity" || name === "perPrice") {
      const qty = name === "quantity" ? parseFloat(value) : parseFloat(formData.quantity);
      const price = name === "perPrice" ? parseFloat(value) : parseFloat(formData.perPrice);

      setFormData((prev) => ({
        ...prev,
        [name]: value,
        totalPrice: (qty && price) ? (qty * price).toFixed(2) : prev.totalPrice
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleRefresh = () => setFormData({
    categoryName: "",
    selectCategory: "",
    clientName: "",
    quantity: "",
    perPrice: "",
    totalPrice: "",
    expiryDate: "",
    description: "",
    purchaseDate: new Date().toISOString().split('T')[0],
    purchaseTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.categoryName || !formData.quantity || !formData.perPrice) {
      alert("Please fill in required fields (Category, Quantity, Price)");
      return;
    }

    const newItem = {
      name: formData.categoryName,
      category: formData.selectCategory,
      quantity: Number(formData.quantity),
      costPrice: Number(formData.perPrice),
      sellingPrice: Number(formData.perPrice) * 1.5,
      expiry: formData.expiryDate,
      description: formData.description,
      client: formData.clientName,
    };

    addStock(newItem);
    alert("Purchase Recorded Successfully!");
    handleRefresh();
    setShowForm(false); // Return to list after success
  };

  // RENDER: FORM VIEW
  if (showForm) {
    return (
      <div className="max-w-5xl mx-auto animate-fade-in">
        {/* Header with Back Button */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">New Purchase</h1>
            <p className="text-gray-500">Record incoming stock and inventory.</p>
          </div>
          <button
            onClick={() => setShowForm(false)}
            className="px-6 py-2 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition shadow-sm"
          >
            Cancel / Back
          </button>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Section */}
            <div className="space-y-6">

              {/* Quick Preset Select */}
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700 ml-1">Quick Select (Optional)</label>
                <select onChange={handlePresetChange} className="w-full pl-4 py-3 bg-indigo-50 border border-indigo-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-indigo-700 font-medium">
                  <option value="">-- Select Standard Item --</option>
                  {PRESETS.map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
                </select>
              </div>

              {/* Category Name (Item Name) */}
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700 ml-1">Item Name / Category</label>
                <input
                  type="text"
                  name="categoryName"
                  value={formData.categoryName}
                  onChange={handleChange}
                  placeholder="e.g. Mineral Water Bottle"
                  className="w-full pl-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                />
              </div>

              {/* Select Category */}
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700 ml-1">Type</label>
                <div className="relative">
                  <select
                    name="selectCategory"
                    value={formData.selectCategory}
                    onChange={handleChange}
                    className="w-full pl-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all appearance-none"
                  >
                    <option value="Water">Water</option>
                    <option value="Electronics">Bottel</option>
                    <option value="Stationary">Labels</option>
                    <option value="Raw Material">Raw Material</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                  </div>
                </div>
              </div>

              {/* Client Name */}
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700 ml-1">Supplier / Client Name</label>
                <input
                  type="text"
                  name="clientName"
                  value={formData.clientName}
                  onChange={handleChange}
                  placeholder="e.g. Nestle Distributor"
                  className="w-full pl-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                />
              </div>

              {/* Quantity */}
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700 ml-1">Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  placeholder="0"
                  className="w-full pl-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                />
              </div>

              {/* Price (2 columns) */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700 ml-1">Cost Per Unit</label>
                  <input
                    type="number"
                    name="perPrice"
                    value={formData.perPrice}
                    onChange={handleChange}
                    placeholder="0.00"
                    className="w-full pl-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700 ml-1">Total Cost</label>
                  <input
                    type="number"
                    name="totalPrice"
                    value={formData.totalPrice}
                    readOnly
                    className="w-full pl-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Expiry Date */}
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700 ml-1">Expiry Date</label>
                <input
                  type="date"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  className="w-full pl-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                />
              </div>
            </div>

            {/* Right Section */}
            <div className="space-y-6 flex flex-col h-full">
              {/* Description */}
              <div className="space-y-1 flex-1">
                <label className="text-sm font-semibold text-gray-700 ml-1">Description / Notes</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter details about the batch condition, driver name, etc."
                  className="w-full h-full min-h-[160px] p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none"
                />
              </div>

              {/* Purchase Date & Time */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700 ml-1">Date</label>
                  <input
                    type="date"
                    name="purchaseDate"
                    value={formData.purchaseDate}
                    onChange={handleChange}
                    className="w-full pl-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700 ml-1">Time</label>
                  <input
                    type="time"
                    name="purchaseTime"
                    value={formData.purchaseTime}
                    onChange={handleChange}
                    className="w-full pl-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-4 mt-auto pt-4">
                <button
                  type="button"
                  onClick={handleRefresh}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition font-medium"
                >
                  <Trash2 size={20} />
                  Clear
                </button>

                <button
                  type="submit"
                  className="flex-[2] flex items-center justify-center gap-2 px-6 py-3.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition font-medium"
                >
                  <PlusCircle size={20} />
                  Record Purchase
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }

  // RENDER: LIST VIEW
  const purchaseHistory = transactions.filter(t => t.type === 'BUY');

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Purchases (In)</h1>
          <p className="text-gray-500 mt-1">Manage inbound stock and supplier records.</p>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition"
        >
          <PlusCircle size={20} />
          New Purchase
        </button>
      </div>

      {/* Purchase List Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

        {purchaseHistory.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50/50 text-xs font-bold text-gray-500 uppercase tracking-wider text-left border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Item Name</th>
                  <th className="px-6 py-4">Supplier</th>
                  <th className="px-6 py-4">Quantity</th>
                  <th className="px-6 py-4">Cost</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {purchaseHistory.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50/50 transition">
                    <td className="px-6 py-4 text-sm font-medium text-gray-400">#{t.id}</td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-800">{t.itemName}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{t.client || "Unknown"}</td>
                    <td className="px-6 py-4 text-sm font-medium text-blue-600">+{t.quantity}</td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-800">${t.total}</td>
                    <td className="px-6 py-4 text-xs text-gray-400">{t.date}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 uppercase">Received</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
              <RefreshCw size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-700">No Purchases Yet</h3>
            <p className="text-gray-500 mt-1">Start by adding new stock to the inventory.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PurchaseForm;
