import { useCallback, useEffect, useMemo, useState } from "react";
import { dashboardAPI } from "../services/api";

export default function Home({ setCurrentPage }) {
  const [stats, setStats] = useState({
    total_employees: 0,
    present_today: 0,
    absent_today: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    setIsLoading(true);
    try {
      const resp = await dashboardAPI.getStats();
      const d = resp.data || {};
      setStats({
        total_employees: Number(d.total_employees) || 0,
        present_today: Number(d.present_today) || 0,
        absent_today: Number(d.absent_today) || 0,
      });
    } catch (err) {
      console.error("Error fetching dashboard stats:", err);
      setStats({
        total_employees: 0,
        present_today: 0,
        absent_today: 0,
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const featureItems = useMemo(
    () => [
      {
        title: "Employee Management",
        description: "Maintain a reliable employee directory with clear records and fast access.",
      },
      {
        title: "Attendance Tracking",
        description: "Mark daily attendance and keep an audit-friendly history for your team.",
      },
      {
        title: "Clean & Reliable",
        description: "Minimal UI built for internal HR workflows with consistent performance.",
      },
    ],
    []
  );

  const statItems = useMemo(
    () => [
      {
        label: "Total Employees",
        value: stats.total_employees,
        tone: "bg-indigo-600",
        Icon: () => (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 11C18.2091 11 20 9.20914 20 7C20 4.79086 18.2091 3 16 3C13.7909 3 12 4.79086 12 7C12 9.20914 13.7909 11 16 11Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M8 11C10.2091 11 12 9.20914 12 7C12 4.79086 10.2091 3 8 3C5.79086 3 4 4.79086 4 7C4 9.20914 5.79086 11 8 11Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M21 21C21 17.6863 18.3137 15 15 15H9C5.68629 15 3 17.6863 3 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ),
      },
      {
        label: "Present Today",
        value: stats.present_today,
        tone: "bg-emerald-600",
        Icon: () => (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ),
      },
      {
        label: "Absent Today",
        value: stats.absent_today,
        tone: "bg-rose-600",
        Icon: () => (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ),
      },
    ],
    [stats]
  );

  const featureIcons = useMemo(
    () => [
      (props) => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
          <path d="M20 21V19C20 16.7909 18.2091 15 16 15H8C5.79086 15 4 16.7909 4 19V21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      (props) => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
          <path d="M8 2V6M16 2V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M3 9H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M6 5H18C19.1046 5 20 5.89543 20 7V19C20 20.1046 19.1046 21 18 21H6C4.89543 21 4 20.1046 4 19V7C4 5.89543 4.89543 5 6 5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      (props) => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
          <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="1.5" />
          <path d="M12 7V12L15 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    ],
    []
  );

  const featureTones = useMemo(() => ["bg-indigo-600", "bg-cyan-600", "bg-violet-600"], []);

  return (
    <div className="font-sans">
      <section className="relative bg-gradient-to-br from-[#031529] via-[#072f63] to-[#0b3d7a] overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute -left-40 -top-28 w-[520px] h-[520px] rounded-full bg-white/5 blur-3xl mix-blend-screen opacity-30" />
          <div className="absolute right-[-140px] top-24 w-[420px] h-[420px] rounded-full bg-white/8 blur-2xl mix-blend-screen opacity-25" />
          <div className="absolute left-8 bottom-[-100px] w-[360px] h-[360px] rounded-full bg-white/8 blur-2xl mix-blend-screen opacity-18" />
          <div className="pointer-events-none">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-white/10"
                style={{
                  width: 6 + (i % 4) * 6,
                  height: 6 + (i % 4) * 6,
                  left: `${8 + (i * 9) % 84}%`,
                  top: `${10 + (i * 13) % 70}%`,
                  filter: "blur(10px)",
                }}
              />
            ))}
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-20 text-center text-white">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">Smart HR Management Made Simple</h1>
          <p className="mt-4 text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
            Manage employee records and track attendance with a clean, enterprise-ready interface built for modern teams.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <button
              type="button"
              onClick={() => setCurrentPage && setCurrentPage("employees")}
              className="px-7 py-3 bg-white text-slate-900 rounded-full font-semibold shadow-md hover:shadow-lg transition"
            >
              Manage Employees
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage && setCurrentPage("attendance")}
              className="px-7 py-3 border border-white/40 text-white rounded-full font-semibold hover:bg-white/10 transition"
            >
              Mark Attendance
            </button>
          </div>
        </div>

        <div className="-mb-px">
          <svg viewBox="0 0 1440 70" className="w-full" preserveAspectRatio="none">
            <path
              d="M0,32L48,42.7C96,53,192,75,288,74.7C384,75,480,53,576,48C672,43,768,53,864,64C960,75,1056,85,1152,85.3C1248,85,1344,75,1392,69.3L1440,64L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
              fill="#ffffff"
            />
          </svg>
        </div>
      </section>

      <main className="bg-white">
        <div className="max-w-6xl mx-auto px-6 pt-10">
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {statItems.map((s) => (
              <div key={s.label} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-slate-600">{s.label}</div>
                    <div className="mt-2 text-3xl font-extrabold text-slate-900">
                      {isLoading ? "..." : s.value}
                    </div>
                  </div>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${s.tone} text-white shadow-sm`}>
                    <s.Icon />
                  </div>
                </div>
              </div>
            ))}
          </section>

          <section className="mt-12">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-slate-900">Why Choose HRMS Lite?</h2>
              <p className="mt-2 text-slate-600">Enterprise-ready essentials focused on clarity and reliability.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featureItems.map((f, idx) => {
                const FeatureIcon = featureIcons[idx];
                return (
                  <div
                    key={f.title}
                    className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-transform transform hover:-translate-y-1 border border-slate-100"
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${featureTones[idx]} text-white mb-5`}>
                      <FeatureIcon />
                    </div>
                    <h3 className="text-lg font-semibold mb-2 text-slate-900">{f.title}</h3>
                    <p className="text-sm text-slate-600">{f.description}</p>
                  </div>
                );
              })}
            </div>
          </section>

          <footer className="mt-12 py-8 text-center text-sm text-slate-500">© 2026 HRMS Lite</footer>
        </div>
      </main>
    </div>
  );
}
