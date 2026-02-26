"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/component/admin/AdminLayout";
import { Trash2, Edit2, Plus, X, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";
import ConfirmDialog from "@/component/admin/ConfirmDialog";

interface Popup {
  _id: string;
  title: string;
  subtitle?: string;
  description?: string;
  image: {
    url: string;
    key?: string;
  };
  primaryButton?: {
    text?: string;
    link?: string;
  };
  secondaryButton?: {
    text?: string;
    link?: string;
  };
  active: boolean;
}

export default function PopupPage() {
  const [mounted, setMounted] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const [popups, setPopups] = useState<Popup[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  // Confirm Dialog
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<() => void>(() => {});
  const [confirmTitle, setConfirmTitle] = useState("");
  const [confirmMessage, setConfirmMessage] = useState("");
  const [confirmBtnText, setConfirmBtnText] = useState("Confirm");

  // Modal States
  const [modalOpen, setModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingPopup, setEditingPopup] = useState<Popup | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    description: "",
    primaryText: "",
    primaryLink: "",
    secondaryText: "",
    secondaryLink: "",
    active: true,
  });

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
      if (!res.ok) throw new Error();
      const data = await res.json();
      setPopups(data);
    } catch {
      toast.error("Failed to fetch popups");
    }
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const form = new FormData();
      form.append("title", formData.title);
      form.append("subtitle", formData.subtitle);
      form.append("description", formData.description);
      form.append("primaryText", formData.primaryText);
      form.append("primaryLink", formData.primaryLink);
      form.append("secondaryText", formData.secondaryText);
      form.append("secondaryLink", formData.secondaryLink);
      form.append("active", String(formData.active));

      if (selectedFile) {
        form.append("image", selectedFile);
      }

      const res = await fetch(
        isEdit ? `/api/admin/popup/${editingPopup?._id}` : "/api/admin/popup",
        {
          method: isEdit ? "PATCH" : "POST",
          body: form,
        },
      );

      if (!res.ok) throw new Error();

      toast.success(isEdit ? "Popup Updated" : "Popup Created");

      fetchPopups();
      setModalOpen(false);
      setSelectedFile(null);
      setPreview("");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
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

        if (!res.ok) throw new Error();

        toast.success("Popup deleted successfully!");
        fetchPopups();
      } catch {
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

        if (!res.ok) throw new Error();

        toast.success(`Popup ${!currentStatus ? "activated" : "deactivated"}`);
        fetchPopups();
      } catch {
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
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-700">All Popups</h2>

          <button
            onClick={() => {
              setIsEdit(false); // Important: false for Add
              setEditingPopup(null); // No popup selected

              setFormData({
                title: "",
                subtitle: "",
                description: "",
                primaryText: "",
                primaryLink: "",
                secondaryText: "",
                secondaryLink: "",
                active: true,
              });
              setSelectedFile(null);
              setPreview("");

              setModalOpen(true);
            }}
            className="flex items-center gap-1 px-3 py-1.5 bg-[#e94e4e] text-white text-sm rounded-md hover:bg-red-600 shadow transition"
          >
            <Plus size={14} /> New Popup
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white rounded-2xl shadow-lg overflow-hidden">
            <thead className="bg-gray-100 text-gray-700 text-sm uppercase font-semibold">
              <tr>
                <th className="py-4 px-5 text-left">Image</th>
                <th className="py-4 px-5 text-left">Title</th>
                <th className="py-4 px-5 text-center">Sub Title</th>
                <th className="py-4 px-5 text-center">Status</th>
                <th className="py-4 px-5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length > 0 ? (
                paginatedData.map((popup) => (
                  <tr key={popup._id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-5">
                      <div className="h-20 w-36 relative rounded-lg overflow-hidden border bg-gray-100 flex items-center justify-center">
                        {popup.image?.url ? (
                          <img
                            src={popup.image.url}
                            alt={popup.title}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                          />
                        ) : (
                          <span className="text-gray-400 text-xs font-medium">
                            No Image
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-5 font-medium">{popup.title}</td>

                    <td className="py-3 px-5 text-center">{popup.subtitle}</td>

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
                          onClick={() => {
                            setIsEdit(true);
                            setEditingPopup(popup);
                            setFormData({
                              title: popup.title || "",
                              subtitle: popup.subtitle || "",
                              description: popup.description || "",
                              primaryText: popup.primaryButton?.text || "",
                              primaryLink: popup.primaryButton?.link || "",
                              secondaryText: popup.secondaryButton?.text || "",
                              secondaryLink: popup.secondaryButton?.link || "",
                              active: popup.active,
                            });

                            setSelectedFile(null);
                            setPreview(popup.image?.url || "");

                            setModalOpen(true);
                          }}
                          className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center"
                        >
                          <Edit2 size={16} />
                        </button>

                        <button
                          onClick={() => handleDelete(popup._id)}
                          className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-500">
                    No popups found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 overflow-y-auto">
          <div className="min-h-screen flex items-center justify-center p-6">
            <div className="bg-white rounded-xl w-full max-w-4xl shadow-2xl relative max-h-[90vh] flex flex-col">
              {/* Header */}
              <div className="flex justify-between items-center px-6 py-4 border-b border-gray-300 bg-[#e94e4e] rounded-t-xl">
                <h2 className="text-xl font-semibold text-white">
                  {isEdit ? "Edit Popup" : "Add Popup"}
                </h2>

                <button
                  onClick={() => setModalOpen(false)}
                  className="text-white hover:text-gray-200 transition"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="overflow-y-auto p-6">
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  {/* Title */}
                  <label className="flex flex-col text-gray-700">
                    Title
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className="mt-2 border border-gray-300 rounded-lg px-4 py-2 focus:ring-1 focus:ring-[#e94e4e]"
                      required
                      disabled={isLoading}
                    />
                  </label>

                  {/* Subtitle */}
                  <label className="flex flex-col text-gray-700">
                    Subtitle
                    <input
                      type="text"
                      name="subtitle"
                      value={formData.subtitle}
                      onChange={handleChange}
                      className="mt-2 border border-gray-300 rounded-lg px-4 py-2 focus:ring-1 focus:ring-[#e94e4e]"
                      disabled={isLoading}
                    />
                  </label>

                  {/* Description */}
                  <label className="flex flex-col text-gray-700">
                    Description
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={3}
                      className="mt-2 border border-gray-300 rounded-lg px-4 py-2 focus:ring-1 focus:ring-[#e94e4e]"
                      disabled={isLoading}
                    />
                  </label>

                  {/* Primary Button */}
                  <label className="flex flex-col text-gray-700">
                    Primary Button Text
                    <input
                      type="text"
                      name="primaryText"
                      value={formData.primaryText}
                      onChange={handleChange}
                      className="mt-2 border border-gray-300 rounded-lg px-4 py-2"
                    />
                  </label>

                  <label className="flex flex-col text-gray-700">
                    Primary Button Link
                    <input
                      type="text"
                      name="primaryLink"
                      value={formData.primaryLink}
                      onChange={handleChange}
                      className="mt-2 border border-gray-300 rounded-lg px-4 py-2"
                    />
                  </label>

                  {/* Secondary Button */}
                  <label className="flex flex-col text-gray-700">
                    Secondary Button Text
                    <input
                      type="text"
                      name="secondaryText"
                      value={formData.secondaryText}
                      onChange={handleChange}
                      className="mt-2 border border-gray-300 rounded-lg px-4 py-2"
                    />
                  </label>

                  <label className="flex flex-col text-gray-700">
                    Secondary Button Link
                    <input
                      type="text"
                      name="secondaryLink"
                      value={formData.secondaryLink}
                      onChange={handleChange}
                      className="mt-2 border border-gray-300 rounded-lg px-4 py-2"
                    />
                  </label>

                  {/* Image Upload */}
                  <label className="flex flex-col text-gray-700">
                    Upload Image
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="mt-2 border border-gray-300 rounded-lg px-4 py-2 bg-white"
                      disabled={isLoading}
                    />
                  </label>

                  {/* Preview */}
                  {preview && (
                    <div>
                      <p className="text-sm text-gray-600 mb-2">
                        Image Preview:
                      </p>
                      <img
                        src={preview}
                        alt="Preview"
                        className="h-40 object-cover rounded-lg border"
                      />
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex justify-end gap-3 mt-4">
                    <button
                      type="button"
                      onClick={() => setModalOpen(false)}
                      className="px-5 py-2 bg-gray-100 border border-gray-300 rounded-lg"
                      disabled={isLoading}
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      className="flex items-center gap-2 px-5 py-2 bg-[#e94e4e] text-white rounded-lg shadow-md hover:bg-red-600 transition"
                      disabled={isLoading}
                    >
                      <CheckCircle size={18} />
                      {isEdit ? "Update" : "Submit"}
                    </button>
                  </div>
                </form>
              </div>

              {/* Loading Overlay */}
              {isLoading && (
                <div className="absolute inset-0 bg-white/70 flex flex-col items-center justify-center z-50">
                  <div className="flex space-x-3 mb-4">
                    <div className="w-5 h-5 bg-[#e94e4e] rounded-full animate-bounce"></div>
                    <div className="w-5 h-5 bg-[#f97316] rounded-full animate-bounce delay-150"></div>
                    <div className="w-5 h-5 bg-[#facc15] rounded-full animate-bounce delay-300"></div>
                  </div>
                  <p className="text-gray-700 font-semibold text-lg">
                    {isEdit ? "Updating..." : "Creating..."}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

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
