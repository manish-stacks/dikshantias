"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/component/admin/AdminLayout";
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import ConfirmDialog from "@/component/admin/ConfirmDialog";

interface CourseEnquiry {
  _id: string;
  name: string;
  phone: string;
  message: string;
  createdAt: string;
}

export default function CourseEnquiryPage() {
  const [authorized, setAuthorized] = useState(false);
  const [enquiries, setEnquiries] = useState<CourseEnquiry[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<() => void>(() => {});
  const [confirmTitle, setConfirmTitle] = useState("");
  const [confirmMessage, setConfirmMessage] = useState("");

  const itemsPerPage = 2;

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) window.location.href = "/admin/login";
    else {
      setAuthorized(true);
      fetchEnquiries();
    }
  }, []);

  const fetchEnquiries = async () => {
    try {
      const res = await fetch("/api/admin/course-enquiry");
      const data = await res.json();
      setEnquiries(data.data || []);
    } catch (err) {
      console.error("Failed to fetch enquiries:", err);
    }
  };

  const handleDelete = (id: string) => {
    setConfirmTitle("Delete Enquiry?");
    setConfirmMessage("This enquiry will be permanently removed.");
    setConfirmAction(() => async () => {
      try {
        const res = await fetch(`/api/admin/course-enquiry/${id}`, {
          method: "DELETE",
        });

        if (res.ok) {
          toast.success("Enquiry deleted!");
          fetchEnquiries();
        } else {
          toast.error("Delete failed");
        }
      } catch {
        toast.error("Something went wrong");
      } finally {
        setConfirmOpen(false);
      }
    });
    setConfirmOpen(true);
  };

  if (!authorized)
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <p>Loading...</p>
      </div>
    );

  const totalPages = Math.ceil(enquiries.length / itemsPerPage);
  const paginatedData = enquiries.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-6">Course Enquiries</h1>

      <div className="bg-white p-6 rounded-xl shadow">
        <table className="w-full">
          <thead className="bg-gray-100 text-sm">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Phone</th>
              <th className="p-3 text-left">Message</th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((item) => (
                <tr key={item._id} className="border-b">
                  <td className="p-3">{item.name}</td>
                  <td className="p-3">{item.phone}</td>
                  <td className="p-3">
                    {item.message || (
                      <span className="italic text-gray-400">No message</span>
                    )}
                  </td>
                  <td className="py-3 px-5 text-center">
                        <div className="flex justify-center">
                            <button
                            onClick={() => handleDelete(item._id)}
                            className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-md hover:shadow-lg transition transform hover:scale-110"
                            title="Delete"
                            >
                            <Trash2 size={16} />
                            </button>
                        </div>
                        </td>


                   
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center p-6 text-gray-400">
                  No enquiries found
                </td>
              </tr>
            )}
          </tbody>
        </table>
 {/* Pagination */}
        <div className="flex justify-end items-center mt-4 space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-200 text-gray-500 rounded-md disabled:cursor-not-allowed"
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded-md font-medium ${
                currentPage === i + 1
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
            className="px-3 py-1 bg-gray-200 text-gray-500 rounded-md disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>

      <ConfirmDialog
        isOpen={confirmOpen}
        title={confirmTitle}
        message={confirmMessage}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmAction}
        onCancel={() => setConfirmOpen(false)}
      />
    </AdminLayout>
  );
}
