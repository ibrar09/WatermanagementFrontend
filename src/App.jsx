import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./modules/dashboard/pages/Dashboard";
import Inventory from "./modules/dashboard/pages/Inventory";
import Production from "./modules/dashboard/pages/Production";
import PurchaseForm from "./modules/dashboard/pages/PurchaseForm";
import SalesModule from "./modules/dashboard/pages/SalesModule";
import Customers from "./modules/dashboard/pages/Customers";
import Reports from "./modules/dashboard/pages/Reports";
import ProductDetails from "./modules/dashboard/pages/ProductDetails";
import UtilitiesAndConsumables from "./modules/dashboard/pages/UtilitiesAndConsumables";
import ExpensesModule from "./modules/dashboard/pages/ExpensesModule";
import HRModule from "./modules/dashboard/pages/HRModule";
import DailyReport from "./modules/dashboard/pages/DailyReport";
import GatePassModule from "./modules/dashboard/pages/GatePassModule";
import Settings from "./modules/dashboard/pages/Settings";
import { DataProvider } from "./context/DataContext";
import { ThemeProvider } from "./context/ThemeContext";

export default function App() {
  return (
    <DataProvider>
      <ThemeProvider>
        <Router>
          <Routes>
            <Route
              path="/"
              element={
                <DashboardLayout>
                  <Dashboard />
                </DashboardLayout>
              }
            />
            <Route
              path="/inventory"
              element={
                <DashboardLayout>
                  <Inventory />
                </DashboardLayout>
              }
            />
            <Route
              path="/production"
              element={
                <DashboardLayout>
                  <Production />
                </DashboardLayout>
              }
            />
            <Route
              path="/purchase"
              element={
                <DashboardLayout>
                  <PurchaseForm />
                </DashboardLayout>
              }
            />
            <Route
              path="/sales"
              element={
                <DashboardLayout>
                  <SalesModule />
                </DashboardLayout>
              }
            />
            <Route
              path="/customers"
              element={
                <DashboardLayout>
                  <Customers />
                </DashboardLayout>
              }
            />
            <Route
              path="/reports"
              element={
                <DashboardLayout>
                  <Reports />
                </DashboardLayout>
              }
            />
            <Route
              path="/product-details"
              element={
                <DashboardLayout>
                  <ProductDetails />
                </DashboardLayout>
              }
            />
            <Route
              path="/utilities"
              element={
                <DashboardLayout>
                  <UtilitiesAndConsumables />
                </DashboardLayout>
              }
            />
            <Route
              path="/expenses"
              element={
                <DashboardLayout>
                  <ExpensesModule />
                </DashboardLayout>
              }
            />
            <Route
              path="/utils"
              element={
                <DashboardLayout>
                  <UtilitiesAndConsumables />
                </DashboardLayout>
              }
            />
            <Route
              path="/gate-pass"
              element={
                <DashboardLayout>
                  <GatePassModule />
                </DashboardLayout>
              }
            />
            <Route
              path="/daily-report"
              element={
                <DashboardLayout>
                  <DailyReport />
                </DashboardLayout>
              }
            />
            <Route
              path="/hr"
              element={
                <DashboardLayout>
                  <HRModule />
                </DashboardLayout>
              }
            />
            <Route
              path="/settings"
              element={
                <DashboardLayout>
                  <Settings />
                </DashboardLayout>
              }
            />
          </Routes>
        </Router>
      </ThemeProvider>
    </DataProvider>
  );
}
