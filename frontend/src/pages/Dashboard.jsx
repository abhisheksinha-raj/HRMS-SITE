import { useState, useEffect } from "react";
import { dashboardAPI } from "../services/api";
import { Users, CheckCircle, XCircle, BarChart2, TrendingUp, Zap, RefreshCw, Lightbulb, AlertTriangle } from 'lucide-react';

const StatCard = ({ title, count, icon, bgColor, borderColor, textColor }) => (
  <div className={`relative group col-span-1`}>
    <div
      className={`absolute -inset-0.5 bg-gradient-to-r ${bgColor} rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition duration-500`}
    ></div>

    <div
      className={`relative bg-gradient-to-br from-white/98 to-white/95 backdrop-blur-2xl rounded-3xl p-8 border ${borderColor} shadow-2xl group-hover:shadow-3xl transition-all duration-500 hover:scale-105`}
    >
      <div className="flex items-start justify-between gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-bold text-gray-600 uppercase tracking-wider letter-spacing">
              {title}
            </span>
          </div>
          <h2 className={`text-5xl md:text-6xl font-black ${textColor} tracking-tight leading-tight`}>
            {count}
          </h2>
          <p className="text-xs text-gray-500 mt-4 font-medium">Updated today</p>
        </div>
        <div className={`flex-shrink-0 p-4 rounded-2xl bg-gradient-to-br ${bgColor} opacity-15 group-hover:opacity-25 transition duration-500`}>
          <div className="text-gray-700 opacity-60">
            {icon}
          </div>
        </div>
      </div>

      <div className="mt-6 relative h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${bgColor} rounded-full transition-all duration-1000`}
          style={{
            width: "100%",
          }}
        ></div>
      </div>
    </div>
  </div>
);

export default function Dashboard() {
  const [stats, setStats] = useState({
    total_employees: 0,
    present_today: 0,
    absent_today: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await dashboardAPI.getStats();
      setStats(response.data);
    } catch (err) {
      console.error("Error fetching dashboard stats:", err);
      setError("Failed to load dashboard statistics");
    } finally {
      setIsLoading(false);
    }
  };

  const notMarked = stats.total_employees - stats.present_today - stats.absent_today;
  const attendanceRate =
    stats.total_employees === 0
      ? 0
      : Math.round(
          ((stats.present_today / (stats.present_today + stats.absent_today)) * 100) || 0
        );

  return (
    <div className="space-y-8 pb-12">
      <div className="relative overflow-hidden rounded-3xl">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 opacity-90"></div>
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 -left-40 w-80 h-80 bg-white rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-8 right-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-7000"></div>
        </div>

        <div className="relative z-10 px-8 py-16 sm:px-12 sm:py-20">
          <div className="flex items-center gap-4 mb-6">
            <div className="text-6xl drop-shadow-lg"><BarChart2 className="w-10 h-10 text-white" /></div>
            <div>
              <h1 className="text-5xl font-black text-white drop-shadow-lg">Dashboard</h1>
              <p className="text-blue-100 text-lg font-light mt-2">Real-time HR Analytics & Insights</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-8">
            <div className="bg-white/20 backdrop-blur-md rounded-xl px-4 py-3 border border-white/30">
              <p className="text-blue-100 text-xs font-semibold uppercase">Today's Date</p>
              <p className="text-white text-lg font-bold mt-1">{new Date().toLocaleDateString()}</p>
            </div>
            <div className="bg-white/20 backdrop-blur-md rounded-xl px-4 py-3 border border-white/30">
              <p className="text-blue-100 text-xs font-semibold uppercase">Total Staff</p>
              <p className="text-white text-lg font-bold mt-1">{isLoading ? "..." : stats.total_employees}</p>
            </div>
            <div className="bg-white/20 backdrop-blur-md rounded-xl px-4 py-3 border border-white/30">
              <p className="text-blue-100 text-xs font-semibold uppercase">Attendance %</p>
              <p className="text-white text-lg font-bold mt-1">{isLoading ? "..." : attendanceRate}%</p>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="relative overflow-hidden rounded-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 opacity-10"></div>
          <div className="relative backdrop-blur-md bg-red-50/80 border border-red-200 rounded-2xl p-6 shadow-lg">
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-7 h-7 text-red-600" />
              <div>
                <p className="font-bold text-red-800 text-lg">Error</p>
                <p className="text-red-700 text-sm mt-1">{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <StatCard
          title="Total Employees"
          count={isLoading ? "..." : stats.total_employees}
          icon={<Users className="w-12 h-12 text-white/30" />}
          bgColor="from-blue-500 to-cyan-500"
          borderColor="border-blue-200/50"
          textColor="text-blue-600"
        />
        <StatCard
          title="Present Today"
          count={isLoading ? "..." : stats.present_today}
          icon={<CheckCircle className="w-12 h-12 text-white/30" />}
          bgColor="from-green-500 to-emerald-500"
          borderColor="border-green-200/50"
          textColor="text-green-600"
        />
        <StatCard
          title="Absent Today"
          count={isLoading ? "..." : stats.absent_today}
          icon={<XCircle className="w-12 h-12 text-white/30" />}
          bgColor="from-red-500 to-pink-500"
          borderColor="border-red-200/50"
          textColor="text-red-600"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gradient-to-br from-white/95 to-white/80 backdrop-blur-2xl rounded-3xl p-8 border border-gray-200/50 shadow-2xl hover:shadow-3xl transition-all duration-500">
          <div className="flex items-center gap-3 mb-8">
            <TrendingUp className="w-8 h-8 text-gray-800" />
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-end mb-3">
                <span className="font-semibold text-gray-700">Attendance Rate</span>
                <span className="text-4xl font-black text-blue-600">{isLoading ? "..." : `${attendanceRate}%`}</span>
              </div>
              <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-1000" style={{ width: `${attendanceRate}%` }}></div>
              </div>
              <p className="text-xs text-gray-500 mt-2">{isLoading ? "..." : `${stats.present_today} present out of ${stats.present_today + stats.absent_today} marked`}</p>
            </div>

            <div>
              <div className="flex justify-between items-end mb-3">
                <span className="font-semibold text-gray-700">Not Yet Marked</span>
                <span className="text-4xl font-black text-amber-600">{isLoading ? "..." : notMarked}</span>
              </div>
              <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-1000" style={{ width: `${stats.total_employees ? Math.round((notMarked / stats.total_employees) * 100) : 0}%` }}></div>
              </div>
              <p className="text-xs text-gray-500 mt-2">{isLoading ? "..." : `${notMarked} out of ${stats.total_employees} employees`}</p>
            </div>

            <div>
              <div className="flex justify-between items-end mb-3">
                <span className="font-semibold text-gray-700">Present</span>
                <span className="text-4xl font-black text-green-600">{isLoading ? "..." : stats.present_today}</span>
              </div>
              <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-1000" style={{ width: `${stats.total_employees ? Math.round((stats.present_today / stats.total_employees) * 100) : 0}%` }}></div>
              </div>
              <p className="text-xs text-gray-500 mt-2">Employees marked present</p>
            </div>

            <div>
              <div className="flex justify-between items-end mb-3">
                <span className="font-semibold text-gray-700">Absent</span>
                <span className="text-4xl font-black text-red-600">{isLoading ? "..." : stats.absent_today}</span>
              </div>
              <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-red-500 to-pink-500 rounded-full transition-all duration-1000" style={{ width: `${stats.total_employees ? Math.round((stats.absent_today / stats.total_employees) * 100) : 0}%` }}></div>
              </div>
              <p className="text-xs text-gray-500 mt-2">Employees marked absent</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-white/95 to-white/80 backdrop-blur-2xl rounded-3xl p-8 border border-gray-200/50 shadow-2xl hover:shadow-3xl transition-all duration-500">
            <div className="flex items-center gap-3 mb-6">
              <Zap className="w-7 h-7 text-gray-900" />
              <h3 className="text-2xl font-black text-gray-900">Quick Actions</h3>
            </div>

            <div className="space-y-4">
              <a href="#attendance" onClick={() => (window.location.hash = "attendance")} className="block p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 hover:border-blue-400 hover:shadow-lg transition-all duration-300 group cursor-pointer">
                <p className="font-bold text-blue-900 group-hover:text-blue-700">Mark Attendance</p>
                <p className="text-sm text-blue-700 mt-1">Go to Attendance page to mark employees</p>
              </a>

              <a href="#employees" onClick={() => (window.location.hash = "employees")} className="block p-4 rounded-2xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 hover:border-purple-400 hover:shadow-lg transition-all duration-300 group cursor-pointer">
                <p className="font-bold text-purple-900 group-hover:text-purple-700">Manage Employees</p>
                <p className="text-sm text-purple-700 mt-1">Add or update employee information</p>
              </a>

              <button onClick={fetchStats} className="w-full p-4 rounded-2xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 hover:border-green-400 hover:shadow-lg transition-all duration-300 group font-bold text-green-900 hover:text-green-700 flex items-center justify-center gap-2">
                <RefreshCw className="w-5 h-5" />
                Refresh Statistics
              </button>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50/95 to-indigo-50/80 backdrop-blur-2xl rounded-3xl p-8 border border-blue-200/50 shadow-xl">
            <div className="flex gap-4">
              <Lightbulb className="w-8 h-8 flex-shrink-0 text-blue-900" />
              <div>
                <p className="font-bold text-blue-900 text-lg mb-2">Pro Tip</p>
                <p className="text-sm text-blue-800 leading-relaxed">Statistics update automatically. Check this dashboard regularly to monitor your organization's attendance patterns and make informed decisions.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-8 text-center text-gray-300 border border-gray-700/50 shadow-2xl">
        <p className="text-sm font-medium">Last Updated: <span className="text-white font-bold">{new Date().toLocaleTimeString()}</span></p>
        <p className="text-xs text-gray-500 mt-3">All times are based on server timezone. Statistics are calculated in real-time.</p>
      </div>
    </div>
  );
}
