import { useState, useEffect, useCallback } from "react";
import EmployeeForm from "../components/EmployeeForm";
import EmployeeTable from "../components/EmployeeTable";
import { employeeAPI } from "../services/api";
import { Users, CheckCircle, AlertTriangle } from 'lucide-react';

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const fetchEmployees = useCallback(async () => {
    setIsLoading(true);
    try {
      console.log('Fetching employees...');
      const response = await employeeAPI.list();
      console.log('Employees API response:', response);
      
      if (response && response.data) {
        setEmployees(response.data);
        setErrorMessage("");
      } else {
        console.warn('Invalid response format:', response);
        setEmployees([]);
        setErrorMessage("Invalid response from server.");
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
      console.error("Error details:", error.response?.data);
      
      // More specific error messages
      if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
        setErrorMessage("Cannot connect to server. Please check if backend is running.");
      } else if (error.response?.status === 404) {
        setErrorMessage("Employee endpoint not found.");
      } else if (error.response?.status >= 500) {
        setErrorMessage("Server error. Please try again later.");
      } else {
        setErrorMessage("Failed to load employees. Please try again.");
      }
      
      setEmployees([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const handleAddEmployee = async (formData) => {
    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await employeeAPI.create(formData);
      setSuccessMessage("Employee added successfully!");
      await fetchEmployees();
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      const message =
        error.response?.data?.detail ||
        "Failed to add employee. Please try again.";
      setErrorMessage(message);
      console.error("Error adding employee:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteEmployee = async (employeeId) => {
    setErrorMessage("");
    try {
      await employeeAPI.delete(employeeId);
      setSuccessMessage("Employee deleted successfully!");
      await fetchEmployees();
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      const message =
        error.response?.data?.detail ||
        "Failed to delete employee. Please try again.";
      setErrorMessage(message);
      console.error("Error deleting employee:", error);
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="bg-gradient-to-br from-slate-50 to-blue-50 p-8 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4 mb-2">
          <div className="p-3 bg-blue-100 rounded-xl">
            <Users className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900">
            Employee Management
          </h1>
        </div>
        <p className="text-gray-600 mt-3 text-base font-normal">View, add, and manage employee information across your organization.</p>
      </div>

      {successMessage && (
        <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 text-green-800 rounded-lg shadow-sm flex items-center gap-3">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <p className="font-medium text-sm">{successMessage}</p>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 text-red-800 rounded-lg shadow-sm flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-medium text-sm">{errorMessage}</p>
            <button
              onClick={fetchEmployees}
              className="mt-2 px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      <EmployeeForm onSubmit={handleAddEmployee} isLoading={isSubmitting} />

      <EmployeeTable
        employees={employees}
        isLoading={isLoading}
        onDelete={handleDeleteEmployee}
      />
    </div>
  );
}
