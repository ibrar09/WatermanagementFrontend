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

    // MOCK DATA GENERATORS
    const generateMockInventory = () => [
        { id: 101, name: "500ml PET Bottles", category: "Finished Goods", quantity: 5400, unit: "Bottles", costPrice: 15, sellingPrice: 25, expiry: "2025-12-31" },
        { id: 102, name: "1.5L PET Bottles", category: "Finished Goods", quantity: 2100, unit: "Bottles", costPrice: 35, sellingPrice: 55, expiry: "2025-12-31" },
        { id: 103, name: "19L Gallon Refill", category: "Finished Goods", quantity: 120, unit: "Gallons", costPrice: 80, sellingPrice: 150, expiry: "2024-06-30" },
        { id: 104, name: "Premium Glass 750ml", category: "Finished Goods", quantity: 850, unit: "Bottles", costPrice: 120, sellingPrice: 200, expiry: "2026-01-01" },
        { id: 105, name: "Preforms (500ml)", category: "Raw Material", quantity: 15000, unit: "Pcs", costPrice: 8, sellingPrice: 0, expiry: "N/A" },
        { id: 106, name: "Preforms (1.5L)", category: "Raw Material", quantity: 8000, unit: "Pcs", costPrice: 18, sellingPrice: 0, expiry: "N/A" },
        { id: 107, name: "Blue Caps (Standard)", category: "Raw Material", quantity: 25000, unit: "Pcs", costPrice: 1.5, sellingPrice: 0, expiry: "N/A" },
        { id: 108, name: "Shrink Wrap Rolls", category: "Packaging", quantity: 45, unit: "Rolls", costPrice: 1200, sellingPrice: 0, expiry: "N/A" },
        { id: 109, name: "19L Polycarbonate Bottle", category: "Raw Material", quantity: 20, unit: "Pcs", costPrice: 600, sellingPrice: 0, expiry: "N/A" },
        { id: 110, name: "Label Rolls (Premium)", category: "Packaging", quantity: 12, unit: "Rolls", costPrice: 3500, sellingPrice: 0, expiry: "N/A" },
        { id: 111, name: "Diesel Fuel", category: "Utilities", quantity: 450, unit: "Liters", costPrice: 280, sellingPrice: 0, expiry: "N/A" },
        { id: 112, name: "Water Filters (RO)", category: "Spare Parts", quantity: 4, unit: "Units", costPrice: 15000, sellingPrice: 0, expiry: "N/A" }
    ];

    const generateMockCustomers = () => [
        { id: 201, name: "Metro Cash & Carry", contact: "0300-1234567", balance: 15000, type: "Corporate" },
        { id: 202, name: "Pearl Continental Hotel", contact: "0321-9876543", balance: 0, type: "Corporate" },
        { id: 203, name: "Gymkhana Club", contact: "0333-5555555", balance: 4500, type: "Corporate" },
        { id: 204, name: "Local Mart - Gulberg", contact: "0345-1112223", balance: -200, type: "Retailer" },
        { id: 205, name: "Shell Select Store", contact: "0301-4444444", balance: 1200, type: "Retailer" },
        { id: 206, name: "Askari General Store", contact: "0302-3333333", balance: 0, type: "Retailer" }
    ];

    const generateMockTransactions = () => {
        const items = ["500ml PET Bottles", "1.5L PET Bottles", "19L Gallon Refill"];
        const types = ["SELL", "SELL", "SELL", "BUY", "PAYMENT"];
        const clients = ["Walk-in", "Metro Cash & Carry", "Pearl Continental Hotel", "Local Mart", "Supplier A"];

        let txs = [];
        for (let i = 0; i < 50; i++) {
            const date = new Date();
            date.setDate(date.getDate() - Math.floor(Math.random() * 7)); // Last 7 days
            const type = types[Math.floor(Math.random() * types.length)];
            const isSell = type === "SELL";
            const qty = Math.floor(Math.random() * 100) + 10;
            const price = Math.floor(Math.random() * 50) + 20;
            const total = qty * price;

            txs.push({
                id: 300 + i,
                date: date.toISOString().split('T')[0],
                time: "10:00 AM",
                type: type,
                client: clients[Math.floor(Math.random() * clients.length)],
                itemName: isSell ? items[Math.floor(Math.random() * items.length)] : "Raw Materials",
                quantity: isSell ? qty : 0,
                total: type === "PAYMENT" ? Math.floor(Math.random() * 5000) : total,
                profit: isSell ? total * 0.4 : 0,
                status: "COMPLETED"
            });
        }
        return txs.sort((a, b) => new Date(b.date) - new Date(a.date));
    };

    const generateMockProduction = () => [
        { id: 401, date: "2024-03-10", producedItem: "500ml PET Bottles", producedQty: 5000, rawMaterials: "Preforms (5000), Caps (5000)", waste: "12 Caps", totalCost: 75000, status: "Completed" },
        { id: 402, date: "2024-03-11", producedItem: "19L Gallon Refill", producedQty: 200, rawMaterials: "Refilled (200), Srink Wrap (1)", waste: "None", totalCost: 16000, status: "Completed" },
        { id: 403, date: "2024-03-12", producedItem: "1.5L PET Bottles", producedQty: 2000, rawMaterials: "Preforms (2000), Caps (2000)", waste: "5 Preforms", totalCost: 70000, status: "QA Check" }
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

    // FORCE RESET DATA FOR CLEAN SLATE
    useEffect(() => {
        const APP_VERSION = "v4_mock_data_elite"; // Bumped version to force reset
        const currentVersion = localStorage.getItem("app_version");

        if (currentVersion !== APP_VERSION) {
            console.log("Injecting Realistic Mock Data...");
            const mockInventory = generateMockInventory();
            const mockCustomers = generateMockCustomers();
            const mockTransactions = generateMockTransactions();
            const mockProduction = generateMockProduction();

            // Reset and Inject
            setInventory(mockInventory);
            setCustomers(mockCustomers);
            setTransactions(mockTransactions);
            setProductionHistory(mockProduction);
            setRecipes(PRESET_RECIPES);

            localStorage.setItem("inventory", JSON.stringify(mockInventory));
            localStorage.setItem("customers", JSON.stringify(mockCustomers));
            localStorage.setItem("transactions", JSON.stringify(mockTransactions));
            localStorage.setItem("production", JSON.stringify(mockProduction));
            localStorage.setItem("recipes", JSON.stringify(PRESET_RECIPES));

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

    const addStock = (newItem) => {
        const transaction = {
            id: Date.now(),
            type: "BUY",
            client: newItem.client || "Supplier",
            itemName: newItem.name,
            quantity: Number(newItem.quantity),
            unit: newItem.unit || "Units",
            batchNumber: newItem.batchNumber || "N/A",
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
                        ? {
                            ...item,
                            quantity: Number(item.quantity) + Number(newItem.quantity),
                            costPrice: newItem.costPrice,
                            unit: newItem.unit || item.unit,
                            expiry: newItem.expiry || item.expiry
                        }
                        : item
                );
            }
            return [...prev, { ...newItem, id: Date.now() }];
        });
    };

    const deleteStock = (id) => {
        setInventory(prev => prev.filter(item => item.id !== id));
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

        setInventory(prev =>
            prev.map(item =>
                item.name === saleItem.name
                    ? { ...item, quantity: item.quantity - saleItem.quantity }
                    : item
            )
        );

        if (balanceDue > 0 && saleItem.client !== "Walk-in") {
            updateCustomerBalance(saleItem.client, balanceDue);
        }

        return true;
    };

    const collectPayment = (customerName, amount) => {
        const transaction = {
            id: Date.now(),
            type: "PAYMENT",
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
        let totalMaterialCost = 0;
        for (let mat of usedMaterials) {
            const stock = inventory.find(i => i.name === mat.name);
            if (!stock || stock.quantity < mat.quantity) {
                alert(`Insufficient Raw Material: ${mat.name}`);
                return false;
            }
            totalMaterialCost += (Number(stock.costPrice) * Number(mat.quantity));
        }

        const totalBatchCost = totalMaterialCost + Number(laborCost) + Number(overheadCost);
        const batchUnitCost = totalBatchCost / Number(outputItem.quantity);

        let materialSummary = [];
        setInventory(prev => prev.map(item => {
            const used = usedMaterials.find(m => m.name === item.name);
            if (used) {
                materialSummary.push(`${item.name} (${used.quantity})`);
                return { ...item, quantity: item.quantity - Number(used.quantity) };
            }
            return item;
        }));

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

    const getStats = () => {
        const totalSales = transactions.filter(t => t.type === "SELL").reduce((acc, curr) => acc + curr.total, 0);
        const totalSpent = transactions.filter(t => t.type === "BUY").reduce((acc, curr) => acc + curr.total, 0);
        const profit = transactions.filter(t => t.type === "SELL").reduce((acc, curr) => {
            if (curr.profit) return acc + curr.profit;
            return acc + (curr.total * 0.3);
        }, 0);

        const lowStockItems = inventory.filter(i => i.quantity < 20);
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
            deleteStock,
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
