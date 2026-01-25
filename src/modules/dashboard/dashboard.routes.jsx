import { Routes, Route } from "react-router-dom";
import DashboardHome from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import Production from "./pages/Production";
import SalesModule from "./pages/SalesModule";
import Customers from "./pages/Customers";
import PurchaseModule from "./pages/PurchaseForm";
import Reports from "./pages/Reports";
import Utilities from "./pages/UtilitiesAndConsumables";
import ExpensesModule from "./pages/ExpensesModule";
import HRModule from "./pages/HRModule";

export default function DashboardRoutes() {
    return (
        <Routes>
            <Route path="/" element={<DashboardHome />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="production" element={<Production />} />
            <Route path="sales" element={<SalesModule />} />
            <Route path="customers" element={<Customers />} />
            <Route path="purchase" element={<PurchaseModule />} />
            <Route path="reports" element={<Reports />} />
            <Route path="expenses" element={<ExpensesModule />} />
            <Route path="hr" element={<HRModule />} />
            <Route path="utilities" element={<Utilities />} />
            <Route path="settings" element={<div className="p-8">Settings Page (Coming Soon)</div>} />
        </Routes>
    );
}
