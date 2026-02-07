import { useState, useEffect } from "react";
import { employeeAPI } from "../services/api";
import { Check, AlertTriangle, User, Calendar, BarChart2, CheckCircle, XCircle, ArrowRight } from 'lucide-react';

export default function AttendanceForm({ onSubmit, isLoading = false }) {
  const [employees, setEmployees] = useState([]);
  const [employeesLoading, setEmployeesLoading] = useState(true);
  const [formData, setFormData] = useState({
    employee_id: "",
    date: new Date().toISOString().split("T")[0],
    status: "Present",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await employeeAPI.list();
      setEmployees(response.data);
    } catch (err) {
      console.error("Failed to fetch employees:", err);
      setError("Failed to load employees");
    } finally {
      setEmployeesLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.employee_id || !formData.date) {
      setError("All fields are required");
      return;
    }

    onSubmit(formData);
    setFormData({
      employee_id: "",
      date: new Date().toISOString().split("T")[0],
      status: "Present",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-xl border border-green-50 hover:shadow-2xl transition-shadow duration-300">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-3 rounded-lg">
          <Check className="text-white w-5 h-5" />
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
          Mark Attendance
        </h2>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg flex items-start space-x-3">
          <AlertTriangle className="w-6 h-6 text-red-600" />
          <span className="font-medium">{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label
            htmlFor="employee_id"
            className="block text-sm font-bold text-gray-800 mb-2"
          >
            <div className="flex items-center gap-2"><User className="w-4 h-4"/> Select Employee</div>
          </label>
          {employeesLoading ? (
            <select
              disabled
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-50"
            >
              <option>Loading...</option>
            </select>
          ) : employees.length === 0 ? (
            <select
              disabled
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-50"
            >
              <option>No employees available</option>
            </select>
          ) : (
            <select
              id="employee_id"
              name="employee_id"
              value={formData.employee_id}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
              disabled={isLoading}
            >
              <option value="">-- Select Employee --</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.employee_id}>
                  {emp.employee_id} - {emp.full_name}
                </option>
              ))}
            </select>
          )}
        </div>

        <div>
          <label htmlFor="date" className="block text-sm font-bold text-gray-800 mb-2">
            <div className="flex items-center gap-2"><Calendar className="w-4 h-4"/> Date</div>
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
            disabled={isLoading}
          />
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-bold text-gray-800 mb-2">
            <div className="flex items-center gap-2"><BarChart2 className="w-4 h-4"/> Status</div>
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
            disabled={isLoading}
          >
            <option value="Present"><CheckCircle className="inline-block w-4 h-4 mr-2"/> Present</option>
            <option value="Absent"><XCircle className="inline-block w-4 h-4 mr-2"/> Absent</option>
          </select>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading || employeesLoading}
        className="mt-8 w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-6 rounded-lg font-bold text-lg hover:shadow-lg hover:shadow-green-500/50 transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
      >
        <span>{isLoading ? "Marking..." : "Mark Attendance"}</span>
        {!isLoading && <ArrowRight className="w-5 h-5" />}
      </button>
    </form>
  );
}
