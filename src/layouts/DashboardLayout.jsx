import Sidebar from "../modules/dashboard/components/Sidebar";
import Navbar from "../modules/dashboard/components/Navbar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen bg-transparent overflow-hidden">
      {/* Sidebar - Fixed width, full height */}
      <Sidebar />

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Navbar - Sticky at top */}
        <Navbar />

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
