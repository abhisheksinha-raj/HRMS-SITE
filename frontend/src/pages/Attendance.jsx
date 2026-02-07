import { useState, useEffect, useCallback } from "react";
import AttendanceForm from "../components/AttendanceForm";
import AttendanceTable from "../components/AttendanceTable";
import { attendanceAPI } from "../services/api";
import { Clipboard, CheckCircle, AlertTriangle } from 'lucide-react';

const RECORDS_PER_PAGE = 10;

export default function Attendance() {
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const fetchAttendance = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await attendanceAPI.list();
      setRecords(response.data);
      setErrorMessage("");
    } catch (error) {
      console.error("Error fetching attendance:", error);
      setErrorMessage("Failed to load attendance records. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  const handleMarkAttendance = async (formData) => {
    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await attendanceAPI.mark(formData);
      setSuccessMessage("Attendance marked successfully!");
      await fetchAttendance();
      setCurrentPage(1); // Reset to first page after adding new record
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      const message =
        error.response?.data?.detail ||
        "Failed to mark attendance. Please try again.";
      setErrorMessage(message);
      console.error("Error marking attendance:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-8 rounded-lg border-l-4 border-l-green-500">
        <div className="flex items-center gap-3 mb-2">
          <Clipboard className="w-10 h-10 text-green-600" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Attendance Management
          </h1>
        </div>
        <p className="text-gray-600 mt-2 text-lg">Track and manage employee attendance records efficiently.</p>
      </div>

      {successMessage && (
        <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-l-green-500 text-green-800 rounded-lg shadow-sm">
          <div className="flex items-center gap-2 font-semibold"><CheckCircle className="w-5 h-5" /> <span>{successMessage}</span></div>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-l-red-500 text-red-800 rounded-lg shadow-sm">
          <div className="flex items-center gap-2 font-semibold"><AlertTriangle className="w-5 h-5" /> <span>{errorMessage}</span></div>
        </div>
      )}

      <AttendanceForm onSubmit={handleMarkAttendance} isLoading={isSubmitting} />

      <AttendanceTable 
        records={records} 
        isLoading={isLoading}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        recordsPerPage={RECORDS_PER_PAGE}
      />
    </div>
  );
}
