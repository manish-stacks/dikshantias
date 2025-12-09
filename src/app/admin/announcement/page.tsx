"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/component/admin/AdminLayout";
import { Trash2, Edit2, Plus } from "lucide-react";
import toast from "react-hot-toast";
import AnnouncementModal from "@/component/admin/AnnouncementModal"; // Modal for add/edit
import ConfirmDialog from "@/component/admin/ConfirmDialog";

interface Announcement {
  _id: string;
  title: {
    en: string;
    hi: string;
  };
  bgcolor: string;
  active: boolean;
}


export default function AnnouncementPage() {
  const [authorized, setAuthorized] = useState(false);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);

  // Confirm dialog state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<() => void>(() => {});
  const [confirmTitle, setConfirmTitle] = useState("");
  const [confirmMessage, setConfirmMessage] = useState("");
  const [confirmBtnText, setConfirmBtnText] = useState("Confirm");

  const itemsPerPage = 5;

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) window.location.href = "/admin/login";
    else {
      setAuthorized(true);
      fetchAnnouncements();
    }
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const res = await fetch("/api/admin/announcements");
      const data = await res.json();
      if (data.success) setAnnouncements(data.data);
    } catch (err) {
      console.error("Failed to fetch announcements:", err);
    }
  };

  const handleDelete = (id: string) => {
    setConfirmTitle("Are you sure?");
    setConfirmMessage("You won’t be able to revert this action!");
    setConfirmBtnText("Yes, Delete");
    setConfirmAction(() => async () => {
      try {
        const res = await fetch(`/api/admin/announcements/${id}`, {
          method: "DELETE",
        });
        const data = await res.json();

        if (!res.ok) {
          toast.error(data.error || "Failed to delete announcement");
          return;
        }

        fetchAnnouncements();
        toast.success("Announcement deleted successfully!");
      } catch (err) {
        console.error(err);
        toast.error("Failed to delete announcement");
      } finally {
        setConfirmOpen(false);
      }
    });
    setConfirmOpen(true);
  };

  const handleToggleActive = (id: string, currentStatus: boolean) => {
    setConfirmTitle(currentStatus ? "Deactivate this announcement?" : "Activate this announcement?");
    setConfirmMessage("Do you want to change the status of this announcement?");
    setConfirmBtnText(currentStatus ? "Yes, Deactivate" : "Yes, Activate");

    setConfirmAction(() => async () => {
      try {
        const res = await fetch(`/api/admin/announcements/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ active: !currentStatus }),
        });

        if (res.ok) {
          setAnnouncements((prev) =>
            prev.map((item) =>
              item._id === id ? { ...item, active: !currentStatus } : item
            )
          );
          toast.success("Status updated!");
        } else {
          toast.error("Failed to update status");
        }
      } catch (err) {
        console.error(err);
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
        <div className="flex flex-col items-center">
          <div className="relative flex space-x-3 mb-4">
            <div className="w-5 h-5 bg-[#e94e4e] rounded-full animate-bounce"></div>
            <div className="w-5 h-5 bg-[#f97316] rounded-full animate-bounce delay-150"></div>
            <div className="w-5 h-5 bg-[#facc15] rounded-full animate-bounce delay-300"></div>
          </div>
          <p className="text-gray-700 font-semibold text-lg">Loading...</p>
        </div>
      </div>
    );

  const totalPages = Math.ceil(announcements.length / itemsPerPage);
  const paginatedData = announcements.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Announcements</h1>

      <div className="bg-white p-6 rounded-2xl shadow-lg mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-700">All Announcements</h2>
          <button
            onClick={() => {
              setEditingAnnouncement(null);
              setShowModal(true);
            }}
            className="flex items-center gap-1 px-3 py-1.5 bg-[#e94e4e] text-white text-sm rounded-md hover:bg-red-600 shadow transition"
          >
            <Plus size={14} /> New Announcement
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white rounded-2xl shadow-lg overflow-hidden">
            <thead className="bg-gray-100 text-gray-700 text-sm uppercase tracking-wide font-semibold">
              <tr>
                <th className="py-4 px-5 text-left border-b border-gray-200">Title (English)</th>
                <th className="py-4 px-5 text-left border-b border-gray-200">Title (Hindi)</th>
                <th className="py-4 px-5 text-center border-b border-gray-200">Status</th>
                <th className="py-4 px-5 text-center border-b border-gray-200">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-800 text-sm">
              {paginatedData.length > 0 ? (
                paginatedData.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50 transition-colors border-b border-gray-200">
                    <td className="py-3 px-5 font-medium">{item.title.en}</td>
                    <td className="py-3 px-5 font-medium">{item.title.hi}</td>
                    <td className="py-3 px-5 text-center">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={item.active} readOnly className="sr-only" />
                        <div
                          onClick={() => handleToggleActive(item._id, item.active)}
                          className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 cursor-pointer ${
                            item.active ? "bg-green-500" : "bg-gray-300"
                          }`}
                        >
                          <span
                            className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${
                              item.active ? "translate-x-6" : "translate-x-0"
                            }`}
                          ></span>
                        </div>
                      </label>
                    </td>
                    <td className="py-3 px-5 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => {
                            setEditingAnnouncement(item);
                            setShowModal(true);
                          }}
                          className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-md hover:shadow-lg transition transform hover:scale-110"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
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
                  <td colSpan={3} className="text-center py-8 text-gray-500 italic border-b border-gray-200">
                    No announcements found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-end items-center mt-4 space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded-md font-medium ${
              currentPage === 1 ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded-md font-medium ${
                currentPage === i + 1 ? "bg-[#e94e4e] text-white shadow-md" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded-md font-medium ${
              currentPage === totalPages ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Next
          </button>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <AnnouncementModal
          announcement={editingAnnouncement || undefined}
          onClose={() => setShowModal(false)}
          onSubmit={fetchAnnouncements}
        />
      )}

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
    </AdminLayout>
  );
}
