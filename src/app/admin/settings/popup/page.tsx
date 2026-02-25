"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/component/admin/AdminLayout";
import { Trash2, Edit2, Plus } from "lucide-react";
import toast from "react-hot-toast";
import ConfirmDialog from "@/component/admin/ConfirmDialog";

interface Popup {
  _id: string;
  title: string;
  description?: string;
  image: {
    url: string;
    key?: string;
  };
  buttonText?: string;
  buttonLink?: string;
  active: boolean;
  displayOrder: number;
  createdAt?: string;
}

export default function PopupPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const [popups, setPopups] = useState<Popup[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<() => void>(() => {});
  const [confirmTitle, setConfirmTitle] = useState("");
  const [confirmMessage, setConfirmMessage] = useState("");
  const [confirmBtnText, setConfirmBtnText] = useState("Confirm");

  const itemsPerPage = 5;

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem("adminToken");

    if (!token) {
      window.location.href = "/admin/login";
    } else {
      setAuthorized(true);
      fetchPopups();
    }
  }, []);

  const fetchPopups = async () => {
    try {
      const res = await fetch("/api/admin/popup");
      if (!res.ok) throw new Error("Failed to fetch popups");
      const data = await res.json();
      setPopups(data);
    } catch (err) {
      toast.error("Failed to fetch popups");
    }
  };

  const handleDelete = (id: string) => {
    setConfirmTitle("Delete Popup?");
    setConfirmMessage("This action cannot be undone.");
    setConfirmBtnText("Delete");

    setConfirmAction(() => async () => {
      try {
        const res = await fetch(`/api/admin/popup/${id}`, {
          method: "DELETE",
        });

        if (!res.ok) {
          toast.error("Failed to delete popup");
          return;
        }

        fetchPopups();
        toast.success("Popup deleted successfully!");
      } catch (err) {
        toast.error("Failed to delete popup");
      } finally {
        setConfirmOpen(false);
      }
    });

    setConfirmOpen(true);
  };

  const handleToggleActive = (id: string, currentStatus: boolean) => {
    setConfirmTitle(currentStatus ? "Deactivate Popup?" : "Activate Popup?");
    setConfirmMessage(
      `Are you sure you want to ${
        currentStatus ? "deactivate" : "activate"
      } this popup?`,
    );
    setConfirmBtnText(currentStatus ? "Yes, Deactivate" : "Yes, Activate");

    setConfirmAction(() => async () => {
      try {
        const res = await fetch(`/api/admin/popup/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ active: !currentStatus }),
        });

        if (res.ok) {
          const data = await res.json();
          setPopups((prev) =>
            prev.map((p) =>
              p._id === id ? { ...p, active: data.popup.active } : p,
            ),
          );

          toast.success(
            `Popup ${!currentStatus ? "activated" : "deactivated"}`,
          );
        } else {
          toast.error("Something went wrong.");
        }
      } catch (err) {
        toast.error("Failed to update popup.");
      } finally {
        setConfirmOpen(false);
      }
    });

    setConfirmOpen(true);
  };

  const totalPages = Math.ceil(popups.length / itemsPerPage);

  const paginatedData = popups.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  if (!mounted) return null;

  if (!authorized)
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <p className="text-gray-700 font-semibold text-lg">Loading...</p>
      </div>
    );

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Manage Popup</h1>

      <div className="bg-white p-6 rounded-2xl shadow-lg mb-8">
        {/* Header + Add Button */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-700">All Popups</h2>

          <button
            onClick={() => router.push("/admin/settings/popup/add")}
            className="flex items-center gap-1 px-3 py-1.5 bg-[#e94e4e] text-white text-sm rounded-md hover:bg-red-600 shadow transition"
          >
            <Plus size={14} /> New Popup
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white rounded-2xl shadow-lg overflow-hidden">
            <thead className="bg-gray-100 text-gray-700 text-sm uppercase font-semibold">
              <tr>
                <th className="py-4 px-5 text-left">Image</th>
                <th className="py-4 px-5 text-left">Header Title</th>
                <th className="py-4 px-5 text-center">Order</th>
                <th className="py-4 px-5 text-center">Status</th>
                <th className="py-4 px-5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-800 text-sm">
              {paginatedData.length > 0 ? (
                paginatedData.map((popup) => (
                  <tr key={popup._id} className="hover:bg-gray-50 border-b">
                    <td className="py-3 px-5">
                      {popup.image?.url ? (
                        <img
                          src={popup.image.url}
                          alt={popup.title}
                          className="h-16 w-32 object-cover rounded"
                        />
                      ) : (
                        <div className="h-16 w-32 bg-gray-100 flex items-center justify-center text-xs text-gray-400">
                          No Image
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-5 font-medium">{popup.title}</td>

                    <td className="py-3 px-5 text-center">
                      {popup.displayOrder}
                    </td>

                    <td className="py-3 px-5 text-center">
                      <div
                        onClick={() =>
                          handleToggleActive(popup._id, popup.active)
                        }
                        className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer ${
                          popup.active ? "bg-green-500" : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`bg-white w-5 h-5 rounded-full shadow-md transform transition ${
                            popup.active ? "translate-x-6" : "translate-x-0"
                          }`}
                        ></span>
                      </div>
                    </td>

                    <td className="py-3 px-5 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() =>
                            router.push(`/admin/settings/popup/${popup._id}`)
                          }
                          className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center hover:scale-110 transition"
                        >
                          <Edit2 size={16} />
                        </button>

                        <button
                          onClick={() => handleDelete(popup._id)}
                          className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center hover:scale-110 transition"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-8 text-gray-500 italic"
                  >
                    No popups found
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
            className="px-3 py-1 rounded-md bg-gray-100"
          >
            Prev
          </button>

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded-md bg-gray-100"
          >
            Next
          </button>
        </div>
      </div>

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
