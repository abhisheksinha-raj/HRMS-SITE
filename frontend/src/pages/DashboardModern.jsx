import { useEffect, useState } from "react";
import { dashboardAPI } from "../services/api";

function IconUsers() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 11C18.2091 11 20 9.20914 20 7C20 4.79086 18.2091 3 16 3C13.7909 3 12 4.79086 12 7C12 9.20914 13.7909 11 16 11Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 11C10.2091 11 12 9.20914 12 7C12 4.79086 10.2091 3 8 3C5.79086 3 4 4.79086 4 7C4 9.20914 5.79086 11 8 11Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M21 21C21 17.6863 18.3137 15 15 15H9C5.68629 15 3 17.6863 3 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconCheck() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconCross() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconCalendar() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 2V6M16 2V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M3 9H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M6 5H18C19.1046 5 20 5.89543 20 7V19C20 20.1046 19.1046 21 18 21H6C4.89543 21 4 20.1046 4 19V7C4 5.89543 4.89543 5 6 5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function StatCard({ label, value, Icon, tone, loading }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="text-sm font-medium text-slate-600">{label}</div>
          <div className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            {loading ? "..." : value}
          </div>
        </div>
        <div className={`shrink-0 rounded-xl p-3 ${tone} text-white`}>
          <Icon />
        </div>
      </div>
    </div>
  );
}

export default function DashboardModern() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total_employees: 0,
    present_today: 0,
    absent_today: 0,
    attendance_marked_today: 0,
  });

  useEffect(() => {
    document.title = "Dashboard";
    const load = async () => {
      setLoading(true);
      try {
        const resp = await dashboardAPI.getStats();
        const d = resp.data || {};
        const present = Number(d.present_today) || 0;
        const absent = Number(d.absent_today) || 0;

        setStats({
          total_employees: Number(d.total_employees) || 0,
          present_today: present,
          absent_today: absent,
          attendance_marked_today: present + absent,
        });
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
        setStats({
          total_employees: 0,
          present_today: 0,
          absent_today: 0,
          attendance_marked_today: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900">Dashboard</h1>
          <p className="text-sm sm:text-base text-slate-600">Employee and attendance overview</p>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard label="Total Employees" value={stats.total_employees} Icon={IconUsers} tone="bg-indigo-600" loading={loading} />
          <StatCard label="Present Today" value={stats.present_today} Icon={IconCheck} tone="bg-emerald-600" loading={loading} />
          <StatCard label="Absent Today" value={stats.absent_today} Icon={IconCross} tone="bg-rose-600" loading={loading} />
          <StatCard label="Attendance Marked Today" value={stats.attendance_marked_today} Icon={IconCalendar} tone="bg-blue-600" loading={loading} />
        </div>
      </div>
    </div>
  );
}
