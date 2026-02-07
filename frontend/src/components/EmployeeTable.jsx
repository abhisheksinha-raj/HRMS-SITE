import { Users, Camera, Hash, User, Mail, Building, Settings, Trash2, Inbox } from 'lucide-react';

export default function EmployeeTable({
  employees,
  isLoading = false,
  onDelete,
}) {
  if (isLoading) {
    return (
      <div className="bg-white p-12 rounded-2xl shadow-lg border border-slate-200 text-center">
        <div className="flex justify-center mb-4">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-3 border-slate-200 border-t-blue-600"></div>
        </div>
        <p className="mt-4 text-gray-600 font-medium text-sm">Loading employees...</p>
      </div>
    );
  }

  if (!employees || employees.length === 0) {
    return (
      <div className="bg-white p-12 rounded-2xl shadow-lg border border-slate-200 text-center">
        <div className="flex justify-center mb-4">
          <Inbox className="w-12 h-12 text-slate-400" />
        </div>
        <p className="text-gray-700 text-base font-semibold\">No employees found</p>
        <p className="text-gray-500 mt-1 text-sm\">Add your first employee using the form above to get started</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="bg-gradient-to-r from-slate-50 to-blue-50 px-8 py-6 border-b border-slate-200">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <span>Employees</span>
          <span className="ml-auto text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">Total: {employees.length}</span>
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">Photo</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">ID</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">Name</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">Email</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">Department</th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wide">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {employees.map((employee, index) => (
              <tr
                key={employee.id}
                className="hover:bg-blue-50 transition-colors duration-150"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  {employee.photo_path ? (
                    <img
                      src={`http://localhost:8000/${employee.photo_path}`}
                      alt={employee.full_name}
                      className="w-10 h-10 rounded-full object-cover border border-slate-300"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold text-sm">
                      {employee.full_name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-blue-600">
                  {employee.employee_id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {employee.full_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {employee.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-lg font-medium text-xs">
                    {employee.department}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <button
                    onClick={() => {
                      if (
                        window.confirm(
                          `Are you sure you want to delete ${employee.full_name}?`
                        )
                      ) {
                        onDelete(employee.employee_id);
                      }
                    }}
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-700 rounded-lg font-medium text-xs hover:bg-red-100 transition-all duration-200"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
