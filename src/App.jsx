import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./modules/dashboard/pages/Dashboard";
import Inventory from "./modules/dashboard/pages/Inventory";
import Production from "./modules/dashboard/pages/Production";
import PurchaseForm from "./modules/dashboard/pages/PurchaseForm";
import SalesModule from "./modules/dashboard/pages/SalesModule";
import Reports from "./modules/dashboard/pages/Reports";
import ProductDetails from "./modules/dashboard/pages/ProductDetails";
import UtilitiesAndConsumables from "./modules/dashboard/pages/UtilitiesAndConsumables";
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
