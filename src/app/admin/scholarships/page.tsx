"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/component/admin/AdminLayout";
import { Trash2, Eye } from "lucide-react";
import toast from "react-hot-toast";
import ConfirmDialog from "@/component/admin/ConfirmDialog";


interface Scholarship {
  _id: string;
  name: string;
  phone: string;
  email: string;
  course: string;
  medium?: string;
  gender?: string;
  category?: string;
  scholarship?: string;
  photo?: { url: string; alt?: string };
  certificate?: { url: string; alt?: string };
  message?: string;
  createdAt: string;
}

export default function ScholarshipPage() {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewScholarshipOpen, setViewScholarshipOpen] = useState(false);
  const [currentScholarship, setCurrentScholarship] = useState<Scholarship | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Confirm dialog state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTitle, setConfirmTitle] = useState("");
  const [confirmMessage, setConfirmMessage] = useState("");
  const [confirmBtnText, setConfirmBtnText] = useState("Confirm");
  const [confirmAction, setConfirmAction] = useState<() => void>(() => { });


  // Fetch scholarships from API
  const fetchScholarships = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/scholarship");
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to fetch scholarships");
        return;
      }

      setScholarships(data.data || data);
    } catch (err) {
      console.error("Fetch error:", err);
      toast.error("Failed to fetch scholarships");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScholarships();
  }, []);

  // Confirm dialog delete
  const handleDeleteScholarship = (id: string) => {
    setConfirmTitle("Delete this scholarship?");
    setConfirmMessage("This action cannot be undone.");
    setConfirmBtnText("Delete");
    setConfirmAction(() => async () => {
      try {
        const res = await fetch(`/api/admin/scholarship/${id}`, { method: "DELETE" });
        const data = await res.json();

        if (!res.ok) {
          toast.error(data.message || "Failed to delete scholarship");
          return;
        }

        fetchScholarships(); // Refresh list
        toast.success("Scholarship deleted successfully!");
      } catch (err) {
        console.error(err);
        toast.error("Failed to delete scholarship");
      } finally {
        setConfirmOpen(false);
      }
    });
    setConfirmOpen(true);
  };

  // View scholarship details
  const handleViewScholarship = (s: Scholarship) => {
    setCurrentScholarship(s);
    setViewScholarshipOpen(true);
  };

  // Pagination helpers
  const totalPages = Math.ceil(scholarships.length / itemsPerPage);
  const paginatedData = scholarships.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );



const downloadExcel = async () => {
  if (scholarships.length === 0) {
    toast.error("No data available to download!");
    return;
  }

  const XLSX = await import("xlsx");

  const excelData = scholarships.map((s, index) => ({
    S_No: index + 1,
    Name: s.name,
    Phone: s.phone,
    Gender: s.gender || "-",
    Category: s.category || "-",
    Course: s.course,
    Medium: s.medium || "-",
    Scholarship: s.scholarship || "-",
    Photo_URL: s.photo?.url || "-",
    Certificate_URL: s.certificate?.url || "-",
    Submitted_On: new Date(s.createdAt).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
  }));

  const worksheet = XLSX.utils.json_to_sheet(excelData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Scholarships");

  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `Scholarship_Report_${Date.now()}.xlsx`;
  link.click();

  toast.success("Excel downloaded successfully!");
};




  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Scholarships Enquiry</h1>
      <div className="flex justify-end mb-4">
        <button
          onClick={downloadExcel}
          className="flex items-center gap-2 px-4 py-2 bg-[#E94E4E] hover:bg-[#d34444] text-white rounded-lg shadow transition font-medium"
        >
          {/* Excel Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16 6V4a2 2 0 00-2-2H6a2 2 0 00-2 2v16a2 2 0 002 2h8a2 2 0 002-2v-2M8 10l4 4m0-4l-4 4m6-6h6m-6 4h6m-6 4h6"
            />
          </svg>

          Download Excel
        </button>

      </div>

      <div className="bg-white p-6 rounded-2xl shadow-lg">
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, idx) => (
              <div key={idx} className="animate-pulse flex space-x-4">
                <div className="rounded-full bg-gray-200 h-10 w-10"></div>
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : scholarships.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <svg
              className="w-16 h-16 text-gray-300 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-4h6v4M12 3v4m-6 4h12" />
            </svg>
            <p className="text-gray-500 text-lg font-medium">No scholarship entries found.</p>
            <p className="text-gray-400 text-sm mt-1">Once users submit applications, they will appear here.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-white rounded-2xl shadow-lg overflow-hidden">
                <thead className="bg-gray-100 text-gray-700 text-sm uppercase tracking-wide font-semibold">
                  <tr>
                    <th className="py-4 px-5 text-left border-b border-gray-200">Name</th>
                    <th className="py-4 px-5 text-left border-b border-gray-200">Phone</th>
                    <th className="py-4 px-5 text-left border-b border-gray-200">Gender</th>
                    <th className="py-4 px-5 text-left border-b border-gray-200">Category</th>
                    <th className="py-4 px-5 text-left border-b border-gray-200">Course</th>
                    <th className="py-4 px-5 text-left border-b border-gray-200">Scholarship</th>
                    <th className="py-4 px-5 text-left border-b border-gray-200">Date/Time</th>
                    <th className="py-4 px-5 text-center border-b border-gray-200">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-gray-800 text-sm">
                  {paginatedData.map((s) => (
                    <tr key={s._id} className="hover:bg-gray-50 border-b border-gray-200">
                      <td className="py-3 px-5 font-medium">{s.name}</td>
                      <td className="py-3 px-5">{s.phone}</td>
                      <td className="py-3 px-5">{s.gender}</td>
                      <td className="py-3 px-5">{s.category || "-"}</td>
                      <td className="py-3 px-5">{s.course}</td>
                      <td className="py-3 px-5 text-blue-600 font-medium">{s.scholarship}</td>
                      <td className="py-3 px-5">
                        {new Date(s.createdAt).toLocaleString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="py-3 px-5 text-center">
                        <div className="flex justify-center gap-2">

                          <button
                            onClick={() => handleViewScholarship(s)}
                            className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition"
                            title="View Details"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteScholarship(s._id)}
                            className="flex items-center justify-center w-8 h-8 rounded-full bg-red-500 text-white hover:bg-red-600 transition"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>


            {/* Pagination Controls */}
            <div className="flex justify-end items-center mt-4 space-x-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-md font-medium ${currentPage === 1
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
              >
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 rounded-md font-medium ${currentPage === i + 1
                    ? "bg-[#e94e4e] text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded-md font-medium ${currentPage === totalPages
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmOpen}
        title={confirmTitle}
        message={confirmMessage}
        confirmText={confirmBtnText}
        cancelText="Cancel"
        onConfirm={confirmAction}
        onCancel={() => setConfirmOpen(false)}
      />

      {/* View Message Modal */}
      {viewScholarshipOpen && currentScholarship && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-4 relative">
            {/* Close Button */}
            <button
              onClick={() => setViewScholarshipOpen(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-xl font-bold"
            >
              ✕
            </button>

            {/* Heading */}
            <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-1">Scholarship Program</h2>

            {/* Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm mb-4">
              <div>
                <label className="block text-gray-600 font-semibold mb-1">Name:</label>
                <input
                  type="text"
                  value={currentScholarship.name}
                  readOnly
                  className="w-full border rounded px-2 py-1 bg-gray-100 text-gray-700 text-sm"
                />
              </div>

              <div>
                <label className="block text-gray-600 font-semibold mb-1">Phone:</label>
                <input
                  type="text"
                  value={currentScholarship.phone}
                  readOnly
                  className="w-full border rounded px-2 py-1 bg-gray-100 text-gray-700 text-sm"
                />
              </div>

              <div>
                <label className="block text-gray-600 font-semibold mb-1">Gender:</label>
                <input
                  type="text"
                  value={currentScholarship.gender || "-"}
                  readOnly
                  className="w-full border rounded px-2 py-1 bg-gray-100 text-gray-700 text-sm"
                />
              </div>

              <div>
                <label className="block text-gray-600 font-semibold mb-1">Category:</label>
                <input
                  type="text"
                  value={currentScholarship.category || "-"}
                  readOnly
                  className="w-full border rounded px-2 py-1 bg-gray-100 text-gray-700 text-sm"
                />
              </div>

              <div>
                <label className="block text-gray-600 font-semibold mb-1">Course:</label>
                <input
                  type="text"
                  value={currentScholarship.course}
                  readOnly
                  className="w-full border rounded px-2 py-1 bg-gray-100 text-gray-700 text-sm"
                />
              </div>

              <div>
                <label className="block text-gray-600 font-semibold mb-1">Medium:</label>
                <input
                  type="text"
                  value={currentScholarship.medium || "-"}
                  readOnly
                  className="w-full border rounded px-2 py-1 bg-gray-100 text-gray-700 text-sm"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-gray-600 font-semibold mb-1">Scholarship:</label>
                <input
                  type="text"
                  value={currentScholarship.scholarship || "-"}
                  readOnly
                  className="w-full border rounded px-2 py-1 bg-gray-100 text-gray-700 text-sm"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-gray-600 font-semibold mb-1">Submitted On:</label>
                <input
                  type="text"
                  value={new Date(currentScholarship.createdAt).toLocaleString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  readOnly
                  className="w-full border rounded px-2 py-1 bg-gray-100 text-gray-700 text-sm"
                />
              </div>
            </div>

            {/* Images */}
            <div className="mt-4">
              <h3 className="text-sm font-semibold text-gray-800 mb-2 border-b pb-1">Documents</h3>
              <div className="flex flex-row gap-4 justify-center items-center">
                {/* Candidate Photo */}
                <div className="flex flex-col items-center gap-1">
                  <img
                    src={currentScholarship.photo?.url || "/default-photo.png"}
                    alt={currentScholarship.photo?.alt || "Candidate Photo"}
                    className="w-28 h-28 rounded-lg object-cover border shadow-sm"
                  />
                  <span className="text-gray-500 text-xs">Candidate Photo</span>
                  {currentScholarship.photo?.url && (
                    <a
                      href={currentScholarship.photo.url}
                      download
                      className="mt-1 flex items-center gap-1 px-3 py-1 text-xs bg-red-50 text-red-700 font-medium rounded hover:bg-red-100 transition"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
                      </svg>
                      Download
                    </a>


                  )}
                </div>

                {/* Certificate */}
                <div className="flex flex-col items-center gap-1">
                  {currentScholarship.certificate?.url ? (
                    <>
                      <img
                        src={currentScholarship.certificate.url}
                        alt={currentScholarship.certificate.alt || "Certificate"}
                        className="w-28 h-28 rounded-lg object-cover border shadow-sm"
                      />
                      <span className="text-gray-500 text-xs">Certificate</span>
                      <a
                        href={currentScholarship.certificate.url}
                        download
                        className="mt-1 flex items-center gap-1 px-3 py-1 text-xs bg-red-50 text-red-700 font-medium rounded hover:bg-red-100 transition"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3 w-3"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
                        </svg>
                        Download
                      </a>

                    </>
                  ) : (
                    <div className="w-28 h-28 flex items-center justify-center rounded-lg border bg-gray-100 text-gray-400 text-xs">
                      No Certificate
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </AdminLayout>
  );
}
