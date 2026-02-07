import { useState } from "react";
import { Plus, AlertTriangle, Upload } from 'lucide-react';

export default function EmployeeForm({ onSubmit, isLoading = false }) {
  const [formData, setFormData] = useState({
    employee_id: "",
    full_name: "",
    email: "",
    department: "",
  });
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Please upload an image file");
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Photo size must be less than 5MB");
        return;
      }
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
      setError("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (
      !formData.employee_id ||
      !formData.full_name ||
      !formData.email ||
      !formData.department
    ) {
      setError("All fields are required");
      return;
    }

    const submitData = new FormData();
    submitData.append("employee_id", formData.employee_id);
    submitData.append("full_name", formData.full_name);
    submitData.append("email", formData.email);
    submitData.append("department", formData.department);
    if (photo) {
      submitData.append("photo", photo);
    }

    onSubmit(submitData);
    setFormData({
      employee_id: "",
      full_name: "",
      email: "",
      department: "",
    });
    setPhoto(null);
    setPhotoPreview(null);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-blue-100 rounded-xl">
          <Plus className="w-6 h-6 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">
          Add New Employee
        </h2>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <span className="font-medium text-sm">{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="employee_id" className="block text-sm font-semibold text-gray-900 mb-2">
            Employee ID
          </label>
          <input
            type="text"
            id="employee_id"
            name="employee_id"
            value={formData.employee_id}
            onChange={handleChange}
            placeholder="EMP001"
            className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200 placeholder-slate-400 text-sm"
            disabled={isLoading}
          />
        </div>

        <div>
          <label htmlFor="full_name" className="block text-sm font-semibold text-gray-900 mb-2">
            Full Name
          </label>
          <input
            type="text"
            id="full_name"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            placeholder="John Doe"
            className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200 placeholder-slate-400 text-sm"
            disabled={isLoading}
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="john@example.com"
            className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200 placeholder-slate-400 text-sm"
            disabled={isLoading}
          />
        </div>

        <div>
          <label htmlFor="department" className="block text-sm font-semibold text-gray-900 mb-2">
            Department
          </label>
          <input
            type="text"
            id="department"
            name="department"
            value={formData.department}
            onChange={handleChange}
            placeholder="Engineering"
            className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200 placeholder-slate-400 text-sm"
            disabled={isLoading}
          />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="photo" className="block text-sm font-semibold text-gray-900 mb-3">
            Employee Photo (Optional)
          </label>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="file"
                  id="photo"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                  disabled={isLoading}
                />
                <label htmlFor="photo" className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all duration-200">
                  <div className="flex flex-col items-center">
                    <Upload className="w-5 h-5 text-slate-400 mb-1" />
                    <span className="text-sm text-slate-600 font-medium">Choose file or drag here</span>
                  </div>
                </label>
              </div>
              <p className="text-xs text-slate-500 mt-2">Max 5MB • JPG, PNG, GIF</p>
            </div>
            {photoPreview && (
              <div className="w-24 h-24 rounded-xl border border-blue-200 overflow-hidden flex-shrink-0">
                <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="mt-8 w-full bg-blue-600 text-white py-2.5 px-6 rounded-xl font-semibold text-sm hover:bg-blue-700 hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
      >
        {isLoading ? "Adding..." : "Add Employee"}
      </button>
    </form>
  );
}
