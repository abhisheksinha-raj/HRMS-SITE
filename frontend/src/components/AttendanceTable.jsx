import { Inbox, Clipboard, User, Calendar, BarChart2, CheckCircle, XCircle, ChevronLeft, ChevronRight } from 'lucide-react';

export default function AttendanceTable({
  records,
  isLoading = false,
  currentPage = 1,
  onPageChange = () => {},
  recordsPerPage = 10,
}) {
  // Calculate pagination
  const totalPages = Math.ceil(records.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const endIndex = startIndex + recordsPerPage;
  const paginatedRecords = records.slice(startIndex, endIndex);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (pageNumber) => {
    onPageChange(pageNumber);
  };

  // Build a compact pages list with ellipses to render safely
  const pagesToRender = [];
  for (let p = 1; p <= totalPages; p++) {
    if (
      p <= 2 ||
      p > totalPages - 2 ||
      (p >= currentPage - 1 && p <= currentPage + 1)
    ) {
      pagesToRender.push(p);
    } else {
      if (pagesToRender[pagesToRender.length - 1] !== "...") {
        pagesToRender.push("...");
      }
    }
  }
  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-lg shadow-md text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-green-200 border-t-green-500 border-r-emerald-500"></div>
        <p className="mt-4 text-gray-600 font-medium">Loading attendance records...</p>
      </div>
    );
  }

  if (!records || records.length === 0) {
    return (
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-lg shadow-md text-center">
        <div className="text-4xl mb-3 inline-flex items-center justify-center">
          <Inbox className="w-12 h-12 text-green-600" />
        </div>
        <p className="text-gray-700 text-lg font-medium">No attendance records found yet.</p>
        <p className="text-gray-500 text-sm mt-2">Start marking attendance to see records here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border-l-4 border-l-green-500">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-3 rounded-lg">
              <Clipboard className="text-white w-5 h-5" />
            </div>
            <div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Attendance Records
              </h3>
              <p className="text-sm text-gray-600">{records.length} record{records.length !== 1 ? 's' : ''}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-green-100 to-emerald-100 border-b-2 border-green-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-green-900 uppercase tracking-wider">
                  <div className="flex items-center gap-2"><User className="w-4 h-4"/> Employee ID</div>
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-green-900 uppercase tracking-wider">
                  <div className="flex items-center gap-2"><Calendar className="w-4 h-4"/> Date</div>
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-green-900 uppercase tracking-wider">
                  <div className="flex items-center gap-2"><BarChart2 className="w-4 h-4"/> Status</div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedRecords.map((record) => (
                <tr 
                  key={record.id} 
                  className="hover:bg-green-50 transition-colors border-l-4 border-l-transparent hover:border-l-green-500"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    {record.employee_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {new Date(record.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`px-4 py-2 rounded-full font-semibold transition-all duration-200 ${
                        record.status === "Present"
                          ? "bg-green-100 text-green-700 border border-green-300 flex items-center gap-2"
                          : "bg-red-100 text-red-700 border border-red-300 flex items-center gap-2"
                      }`}
                    >
                      {record.status === "Present" ? <><CheckCircle className="w-4 h-4" /> Present</> : <><XCircle className="w-4 h-4" /> Absent</>}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="text-sm text-gray-600 font-medium">
            Showing <span className="font-semibold text-gray-900">{startIndex + 1}</span> to <span className="font-semibold text-gray-900">{Math.min(endIndex, records.length)}</span> of <span className="font-semibold text-gray-900">{records.length}</span> records
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className="p-2 hover:bg-gray-100 disabled:hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors duration-200"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </button>

            <div className="flex gap-1">
              {pagesToRender.map((p, idx) =>
                p === "..." ? (
                  <span key={`ellipsis-${idx}`} className="px-2 text-gray-400">...</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => handlePageClick(p)}
                    className={`px-3 py-1.5 rounded-lg font-medium transition-all duration-200 ${
                      currentPage === p
                        ? 'bg-green-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {p}
                  </button>
                )
              )}
            </div>

            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="p-2 hover:bg-gray-100 disabled:hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors duration-200"
              aria-label="Next page"
            >
              <ChevronRight className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
