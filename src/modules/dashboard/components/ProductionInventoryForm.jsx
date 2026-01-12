import React, { useState, useMemo } from "react";
import { Plus, Trash2, Calculator } from "lucide-react";

/* ---------------- Waste Row ---------------- */
const WasteRow = ({ waste, onUpdate, onRemove }) => (
  <div className="grid grid-cols-12 gap-3 items-end bg-gray-50 p-3 rounded-xl border">
    <select
      value={waste.type}
      onChange={(e) => onUpdate(waste.id, "type", e.target.value)}
      className="input col-span-5"
    >
      <option>Caps</option>
      <option>Labels</option>
      <option>Plastic Scrap</option>
      <option>Defective Bottles</option>
      <option>Other</option>
    </select>

    <input
      type="number"
      placeholder="Qty"
      value={waste.quantity}
      onChange={(e) => onUpdate(waste.id, "quantity", e.target.value)}
      className="input col-span-5"
    />

    <button
      onClick={() => onRemove(waste.id)}
      className="col-span-2 flex justify-center text-red-500 hover:bg-red-100 rounded-lg p-2"
    >
      <Trash2 size={18} />
    </button>
  </div>
);

/* ---------------- Production Form ---------------- */
const ProductionInventoryForm = ({ onClose }) => {
  const [form, setForm] = useState({
    bottleType: "500ml",
    bottles: "",
    laborCount: "",
    laborCost: "",
    units: "",
    unitCost: "",
  });

  const [wastes, setWastes] = useState([
    { id: 1, type: "Caps", quantity: "" }
  ]);

  /* -------- Calculations -------- */
  const totals = useMemo(() => {
    const labor = (+form.laborCount || 0) * (+form.laborCost || 0);
    const electricity = (+form.units || 0) * (+form.unitCost || 0);
    const total = labor + electricity;
    const perBottle =
      form.bottles > 0 ? (total / form.bottles).toFixed(2) : "0.00";

    return { labor, electricity, total, perBottle };
  }, [form]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const addWaste = () =>
    setWastes([...wastes, { id: Date.now(), type: "Labels", quantity: "" }]);

  const updateWaste = (id, key, value) =>
    setWastes(wastes.map(w => w.id === id ? { ...w, [key]: value } : w));

  const removeWaste = (id) =>
    setWastes(wastes.filter(w => w.id !== id));

  return (
    <div className="space-y-8">
      {/* Bottle Info */}
      <div className="grid md:grid-cols-2 gap-4">
        <select
          name="bottleType"
          onChange={handleChange}
          className="input"
        >
          <option>500ml</option>
          <option>1 Liter</option>
          <option>1.5 Liter</option>
          <option>5 Gallon</option>
        </select>

        <input
          name="bottles"
          type="number"
          placeholder="Total Bottles Produced"
          onChange={handleChange}
          className="input"
        />
      </div>

      {/* Waste */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-gray-800">Waste Tracking</h3>
          <button
            onClick={addWaste}
            className="flex items-center gap-1 text-blue-600 text-sm"
          >
            <Plus size={16} /> Add Waste
          </button>
        </div>

        {wastes.map(waste => (
          <WasteRow
            key={waste.id}
            waste={waste}
            onUpdate={updateWaste}
            onRemove={removeWaste}
          />
        ))}
      </div>

      {/* Costs */}
      <div className="grid md:grid-cols-3 gap-4">
        <input
          name="laborCount"
          placeholder="Labor Count"
          onChange={handleChange}
          className="input"
        />
        <input
          name="laborCost"
          placeholder="Cost / Labor"
          onChange={handleChange}
          className="input"
        />
        <div className="bg-gray-100 rounded-lg p-3 font-bold">
          PKR {totals.labor}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <input
          name="units"
          placeholder="Electric Units"
          onChange={handleChange}
          className="input"
        />
        <input
          name="unitCost"
          placeholder="Cost / Unit"
          onChange={handleChange}
          className="input"
        />
        <div className="bg-gray-100 rounded-lg p-3 font-bold">
          PKR {totals.electricity}
        </div>
      </div>

      {/* Summary */}
      <div className="grid md:grid-cols-2 gap-4 border-t pt-4">
        <div className="bg-blue-50 p-4 rounded-xl">
          <p className="text-xs font-bold text-blue-600">Cost / Bottle</p>
          <p className="text-2xl font-black text-blue-900">
            PKR {totals.perBottle}
          </p>
        </div>
        <div className="bg-green-50 p-4 rounded-xl">
          <p className="text-xs font-bold text-green-600">Total Cost</p>
          <p className="text-2xl font-black text-green-900">
            PKR {totals.total}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <button
          onClick={onClose}
          className="px-6 py-2 rounded-lg hover:bg-gray-100"
        >
          Cancel
        </button>
        <button className="px-10 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700">
          Save Production
        </button>
      </div>
    </div>
  );
};

export default ProductionInventoryForm;
