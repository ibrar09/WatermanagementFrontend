import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import StockCard from "../components/StockCard";
import InventoryTable from "../components/InventoryTable";
import PurchaseForm from "../pages/PurchaseForm";

const Inventory = () => {
  const [showPurchaseForm, setShowPurchaseForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchParams] = useSearchParams();
  const { inventory } = useData();

  // Filter Inventory based on URL params (e.g. ?category=Raw%20Materials)
  const categoryFilter = searchParams.get("category");
  const keywords = searchParams.get("keywords")?.split(",") || [];

  const filteredInventory = React.useMemo(() => {
    let data = inventory;
    if (categoryFilter) {
      // Simple keyword matching for demonstrated purpose if category isn't exact
      data = data.filter(i =>
        i.category === categoryFilter ||
        (keywords.length > 0 && keywords.some(k => i.name.toLowerCase().includes(k.toLowerCase())))
      );
    }
    return data;
  }, [inventory, categoryFilter, keywords]);

  // Function to handle top button click (general purchase)
  const handleTopPurchaseClick = () => {
    setSelectedItem(null); // No specific item selected
    setShowPurchaseForm(true);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Stock summary */}
      <StockCard />

      {/* Middle section: Available Stock label + Top Purchase Button */}
      <div className="flex items-center justify-between p-4 shadow-sm bg-white rounded-lg">
        <div>
          <h3 className="text-lg font-bold text-gray-800">Available Stock</h3>
        </div>

        <button
          className="px-4 py-2 border border-blue-500 text-blue-500 font-medium rounded-lg hover:bg-blue-50 transition"
          onClick={handleTopPurchaseClick}
        >
          Purchase Now
        </button>
      </div>

      {/* Inventory Table or Purchase Form */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        {showPurchaseForm ? (
          <div className="space-y-4">
            {/* Header with Cancel button */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                {selectedItem
                  ? `Purchase Form: ${selectedItem.name}`
                  : "Purchase Form"}
              </h2>
              <button
                className="px-3 py-1 text-gray-500 hover:text-white hover:bg-gray-500 border border-gray-300 rounded-lg transition"
                onClick={() => setShowPurchaseForm(false)}
              >
                Cancel
              </button>
            </div>

            <PurchaseForm item={selectedItem} />
          </div>
        ) : (
          <InventoryTable data={filteredInventory} onPurchaseClick={handleRowPurchaseClick} />
        )}
      </div>
    </div>
  );
};

export default Inventory;
