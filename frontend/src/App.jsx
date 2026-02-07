import { useState } from "react";
import Home from "./pages/Home";
import Employees from "./pages/Employees";
import Attendance from "./pages/Attendance";
import Dashboard from "./pages/Dashboard";
import DashboardModern from "./pages/DashboardModern";
import ErrorBoundary from "./components/ErrorBoundary";

function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const isHome = currentPage === "home";

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-white">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-full mx-auto px-6 sm:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setCurrentPage("home")}
              className="flex items-center space-x-2 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60 focus-visible:ring-offset-2 hover:bg-gray-50 transition-colors px-2 py-1 -ml-2"
              aria-label="Go to home"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">◆</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">HRMS Lite</h1>
            </button>

            {!isHome && (
              <nav className="hidden md:flex space-x-8">
                <button onClick={() => setCurrentPage("employees")} className={`font-medium text-sm ${currentPage === "employees" ? "text-blue-600" : "text-gray-600 hover:text-gray-900"}`}>
                  Employees
                </button>
                <button onClick={() => setCurrentPage("attendance")} className={`font-medium text-sm ${currentPage === "attendance" ? "text-blue-600" : "text-gray-600 hover:text-gray-900"}`}>
                  Attendance
                </button>
                <button onClick={() => setCurrentPage("dashboard")} className={`font-medium text-sm ${currentPage === "dashboard" ? "text-blue-600" : "text-gray-600 hover:text-gray-900"}`}>
                  Dashboard
                </button>
              </nav>
            )}

            {isHome && (
              <nav className="hidden md:flex items-center space-x-6">
                <button onClick={() => setCurrentPage("employees")} className="font-medium text-sm text-gray-600 hover:text-gray-900">
                  Employees
                </button>
                <button onClick={() => setCurrentPage("attendance")} className="font-medium text-sm text-gray-600 hover:text-gray-900">
                  Attendance
                </button>
                <button
                  type="button"
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  aria-label="Search"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-600">
                    <path d="M21 21L15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </nav>
            )}
          </div>
        </div>
      </header>

      <main className="transition-opacity duration-300">
        {currentPage === "home" && <Home setCurrentPage={setCurrentPage} />}
        {currentPage !== "home" && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {currentPage === "employees" && <Employees />}
            {currentPage === "attendance" && <Attendance />}
            {currentPage === "dashboard" && <DashboardModern />}
          </div>
        )}
      </main>

      {!isHome && (
        <footer className="bg-gradient-to-r from-slate-900 to-slate-800 text-white mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div>
                <h3 className="font-bold text-lg mb-2">HRMS Lite</h3>
                <p className="text-slate-300 text-sm">Production-ready HR management solution</p>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Features</h3>
                <ul className="text-slate-300 text-sm space-y-1">
                  <li>✓ Employee Management</li>
                  <li>✓ Attendance Tracking</li>
                  <li>✓ REST API</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Status</h3>
                <p className="text-slate-300 text-sm"><span className="inline-block w-2 h-2 bg-green-400 rounded-full mr-2"></span>Fully Operational</p>
              </div>
            </div>
            <div className="border-t border-slate-700 pt-8">
              <p className="text-center text-slate-400 text-sm">© 2026 HRMS Lite | Built with React, FastAPI & Tailwind CSS</p>
            </div>
          </div>
        </footer>
      )}
      </div>
    </ErrorBoundary>
  );
}

export default App;
