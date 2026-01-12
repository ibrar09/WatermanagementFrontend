import React, { createContext, useContext, useState, useEffect } from "react";

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};

export const DataProvider = ({ children }) => {
  // Initial Configuration (Recipes)
  const PRESET_RECIPES = [
    {
      id: 1,
      name: "Produce 19L Bottle",
      outputItem: "Mineral Water (19L)",
      baseQty: 1,
      materials: [
        { name: "Empty Bottles", quantity: 1 },
        { name: "Bottle Caps", quantity: 1 },
        { name: "Labels", quantity: 1 }
      ]
    }
  ];

  // State with LocalStorage Persistence
  const [inventory, setInventory] = useState(() => {
    const saved = localStorage.getItem("inventory");
    return saved ? JSON.parse(saved) : [];
  });

  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem("transactions");
    return saved ? JSON.parse(saved) : [];
  });

  const [productionHistory, setProductionHistory] = useState(() => {
    const saved = localStorage.getItem("production");
    return saved ? JSON.parse(saved) : [];
  });

  const [customers, setCustomers] = useState(() => {
    const saved = localStorage.getItem("customers");
    return saved ? JSON.parse(saved) : [];
  });

  const [recipes, setRecipes] = useState(() => {
    const saved = localStorage.getItem("recipes");
    return saved ? JSON.parse(saved) : PRESET_RECIPES;
  });

  // FORCE RESET DATA FOR CLEAN SLATE (User Request)
  useEffect(() => {
    const APP_VERSION = "v3_production_boost";
    const currentVersion = localStorage.getItem("app_version");

    if (currentVersion !== APP_VERSION) {
      console.log("Resetting Data for Clean Slate...");
      localStorage.removeItem("inventory");
      localStorage.removeItem("transactions");
      localStorage.removeItem("production");
      localStorage.removeItem("recipes");
      localStorage.removeItem("customers");

      // Reset State
      setInventory([]);
      setTransactions([]);
      setProductionHistory([]);
      setRecipes(PRESET_RECIPES);
      setCustomers([]);

      localStorage.setItem("app_version", APP_VERSION);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("inventory", JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem("production", JSON.stringify(productionHistory));
  }, [productionHistory]);

  useEffect(() => {
    localStorage.setItem("recipes", JSON.stringify(recipes));
  }, [recipes]);

  useEffect(() => {
    localStorage.setItem("customers", JSON.stringify(customers));
  }, [customers]);

  // Actions
  const addRecipe = (newRecipe) => {
    setRecipes(prev => [...prev, { ...newRecipe, id: Date.now() }]);
  };

  const addCustomer = (customer) => {
    setCustomers(prev => {
      const exists = prev.find(c => c.name.toLowerCase() === customer.name.toLowerCase());
      if (exists) return prev;
      return [...prev, { ...customer, id: Date.now(), balance: 0 }];
    });
  };

  const updateCustomerBalance = (customerName, amount) => {
    setCustomers(prev => prev.map(c =>
      c.name === customerName ? { ...c, balance: Number(c.balance || 0) + Number(amount) } : c
    ));
  };

  // Actions
  const addStock = (newItem) => {
    const transaction = {
      id: Date.now(),
      type: "BUY",
      client: newItem.client || "Supplier",
      itemName: newItem.name,
      quantity: Number(newItem.quantity),
      total: Number(newItem.quantity) * Number(newItem.costPrice),
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setTransactions(prev => [transaction, ...prev]);

    setInventory(prev => {
      const existingParams = prev.find(item => item.name === newItem.name);
      if (existingParams) {
        return prev.map(item =>
          item.id === existingParams.id
            ? { ...item, quantity: Number(item.quantity) + Number(newItem.quantity), costPrice: newItem.costPrice }
            : item
        );
      }
      return [...prev, { ...newItem, id: Date.now() }];
    });
  };

  const sellStock = (saleItem) => {
    const availableItem = inventory.find(i => i.name === saleItem.name);
    if (!availableItem || availableItem.quantity < saleItem.quantity) {
      alert("Insufficient Stock!");
      return false;
    }

    const total = Number(saleItem.quantity) * Number(saleItem.sellingPrice);
    const amountPaid = Number(saleItem.amountPaid || 0);
    const balanceDue = total - amountPaid;

    let status = "PAID";
    if (amountPaid === 0) status = "CREDIT";
    else if (amountPaid < total) status = "PARTIAL";

    const transaction = {
      id: Date.now(),
      type: "SELL",
      client: saleItem.client || "Walk-in",
      itemName: saleItem.name,
      quantity: Number(saleItem.quantity),
      total: total,
      amountPaid: amountPaid,
      balanceDue: balanceDue,
      status: status,
      profit: (Number(saleItem.sellingPrice) - Number(availableItem.costPrice)) * Number(saleItem.quantity),
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setTransactions(prev => [transaction, ...prev]);

    // Update Inventory
    setInventory(prev =>
      prev.map(item =>
        item.name === saleItem.name
          ? { ...item, quantity: item.quantity - saleItem.quantity }
          : item
      )
    );

    // Update Customer Balance
    if (balanceDue > 0 && saleItem.client !== "Walk-in") {
      updateCustomerBalance(saleItem.client, balanceDue);
    }

    return true;
  };

  const collectPayment = (customerName, amount) => {
    const transaction = {
      id: Date.now(),
      type: "PAYMENT", // Special type for debt collection
      client: customerName,
      itemName: "Debt Payment",
      quantity: 0,
      total: Number(amount),
      status: "COLLECTED",
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setTransactions(prev => [transaction, ...prev]);
    updateCustomerBalance(customerName, -amount);
  };

  const recordProduction = ({ outputItem, usedMaterials, wasteItems, laborCost, overheadCost }) => {
    // 1. Calculate Total Material Cost
    let totalMaterialCost = 0;
    for (let mat of usedMaterials) {
      const stock = inventory.find(i => i.name === mat.name);
      if (!stock || stock.quantity < mat.quantity) {
        alert(`Insufficient Raw Material: ${mat.name}`);
        return false;
      }
      totalMaterialCost += (Number(stock.costPrice) * Number(mat.quantity));
    }

    // 2. Calculate Unit Cost for this Batch
    const totalBatchCost = totalMaterialCost + Number(laborCost) + Number(overheadCost);
    const batchUnitCost = totalBatchCost / Number(outputItem.quantity);

    // 3. Consume Raw Materials (Deduct Stock)
    let materialSummary = [];
    setInventory(prev => prev.map(item => {
      const used = usedMaterials.find(m => m.name === item.name);
      if (used) {
        materialSummary.push(`${item.name} (${used.quantity})`);
        return { ...item, quantity: item.quantity - Number(used.quantity) };
      }
      return item;
    }));

    // 4. Handle Waste Items (Deduct Stock if applicable)
    let wasteSummary = [];
    if (wasteItems && wasteItems.length > 0) {
      setInventory(prev => prev.map(item => {
        const waste = wasteItems.find(w => w.name === item.name);
        if (waste) {
          wasteSummary.push(`${item.name} (${waste.quantity})`);
          return { ...item, quantity: Math.max(0, item.quantity - Number(waste.quantity)) };
        }
        return item;
      }));
    }

    // 5. Add Finished Good (Add Stock & Update Weighted Cost)
    setInventory(prev => {
      const existing = prev.find(i => i.name === outputItem.name);
      if (existing) {
        const oldTotalValue = Number(existing.quantity) * Number(existing.costPrice);
        const newTotalValue = oldTotalValue + totalBatchCost;
        const newTotalQty = Number(existing.quantity) + Number(outputItem.quantity);
        const newAvgCost = Math.round(newTotalValue / newTotalQty);

        return prev.map(i => i.name === outputItem.name ? {
          ...i,
          quantity: newTotalQty,
          costPrice: newAvgCost
        } : i);
      }

      return [...prev, {
        id: Date.now(),
        name: outputItem.name,
        category: "Produced",
        quantity: Number(outputItem.quantity),
        sellingPrice: 0,
        costPrice: Math.round(batchUnitCost),
        description: "Manufactured Item"
      }];
    });

    // 6. Log Production
    const productionRecord = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      producedItem: outputItem.name,
      producedQty: outputItem.quantity,
      rawMaterials: materialSummary.join(", "),
      laborCost: laborCost,
      electricityCost: overheadCost,
      totalCost: totalBatchCost,
      unitCost: batchUnitCost.toFixed(2),
      waste: wasteSummary.length > 0 ? wasteSummary.join(", ") : "None",
      wasteDetails: wasteItems || [],
      status: "Completed"
    };
    setProductionHistory(prev => [productionRecord, ...prev]);

    return true;
  };

  // Derived Stats
  const getStats = () => {
    // Calculated from Profit field if available, otherwise simplified
    const totalSales = transactions.filter(t => t.type === "SELL").reduce((acc, curr) => acc + curr.total, 0);
    const totalSpent = transactions.filter(t => t.type === "BUY").reduce((acc, curr) => acc + curr.total, 0);

    // Accurate Profit logic: Sum of (Sale - Cost) for each transaction
    // Or if transaction has 'profit' field use it, else fallback
    const profit = transactions.filter(t => t.type === "SELL").reduce((acc, curr) => {
      if (curr.profit) return acc + curr.profit;
      // Fallback for old data
      return acc + (curr.total * 0.3); // Dummy 30% margin if unknown
    }, 0);

    const lowStockItems = inventory.filter(i => i.quantity < 20);

    // Calculate Total Inventory Value (Cost Basis)
    const stockValue = inventory.reduce((acc, curr) => acc + (Number(curr.costPrice) * Number(curr.quantity)), 0);

    return { totalSales, totalSpent, profit, lowStockItems, stockValue, totalOrders: transactions.length };
  };

  return (
    <DataContext.Provider value={{
      inventory,
      transactions,
      productionHistory,
      recipes,
      customers,
      addStock,
      sellStock,
      recordProduction,
      addRecipe,
      addCustomer,
      collectPayment,
      getStats
    }}>
      {children}
    </DataContext.Provider>
  );
};
