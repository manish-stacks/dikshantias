"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/component/admin/AdminLayout";
import { Trash2, Edit2, Plus, Search, Activity } from "lucide-react";
import toast from "react-hot-toast";
import ConfirmDialog from "@/component/admin/ConfirmDialog";

// Testimonial interface
interface Testimonial {
  _id: string;
  name: any;
  rank: any;
  year: string;
  quote: any;
  background: any;
  attempts: string;
  optional: any;
  image: { url: string; public_url?: string; public_id?: string };
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export default function TestimonialsPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<() => void>(() => {});
  const [confirmTitle, setConfirmTitle] = useState("");
  const [confirmMessage, setConfirmMessage] = useState("");
  const [confirmBtnText, setConfirmBtnText] = useState("Confirm");
  const itemsPerPage = 5;

  const [filterStatus, setFilterStatus] = useState<string>("");
  const [searchName, setSearchName] = useState<string>("");

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem("adminToken");
    if (!token) router.push("/admin/login");
    else {
      setAuthorized(true);
      fetchTestimonials();
    }
  }, []);

  const fetchTestimonials = async () => {
    try {
      const res = await fetch("/api/admin/testimonials");
      if (!res.ok) throw new Error("Failed to fetch testimonials");
      const data = await res.json();
      setTestimonials(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch testimonials");
    }
  };

  const handleDelete = (id: string) => {
    setConfirmTitle("Are you sure you want to delete this testimonial?");
    setConfirmMessage("You won't be able to revert this!");
    setConfirmBtnText("Delete");

    setConfirmAction(() => async () => {
      try {
        const res = await fetch(`/api/admin/testimonials/${id}`, {
          method: "DELETE",
        });
        const data = await res.json();
        if (!res.ok) {
          toast.error(data.error || "Failed to delete testimonial");
          return;
        }
        fetchTestimonials();
        toast.success("Testimonial deleted successfully!");
      } catch (err) {
        console.error(err);
        toast.error("Failed to delete testimonial");
      } finally {
        setConfirmOpen(false);
      }
    });

    setConfirmOpen(true);
  };

  const handleToggleActive = (id: string, currentStatus: boolean) => {
    setConfirmTitle(
      currentStatus
        ? "Deactivate this testimonial?"
        : "Activate this testimonial?"
    );
    setConfirmMessage(
      `Are you sure you want to ${currentStatus ? "deactivate" : "activate"} this testimonial?`
    );
    setConfirmBtnText(currentStatus ? "Yes, Deactivate" : "Yes, Activate");

    setConfirmAction(() => async () => {
      try {
        const res = await fetch(`/api/admin/testimonials/${id}`, {
          method: "PATCH",
          body: JSON.stringify({ active: !currentStatus }),
          headers: { "Content-Type": "application/json" },
        });

        if (res.ok) {
          const data = await res.json();
          setTestimonials((prev) =>
            prev.map((t) =>
              t._id === id ? { ...t, active: data.active ?? !currentStatus } : t
            )
          );
          toast.success(
            `Testimonial has been ${!currentStatus ? "activated" : "deactivated"}`
          );
        } else {
          toast.error("Something went wrong.");
        }
      } catch (err) {
        toast.error("Failed to update testimonial.");
      } finally {
        setConfirmOpen(false);
      }
    });

    setConfirmOpen(true);
  };

  // Utility: safely parse multilingual field
  const parseField = (field: any) => {
    if (!field) return { en: "", hi: "" };
    if (typeof field === "object") return field;
    try {
      return JSON.parse(field);
    } catch {
      return { en: field, hi: "" };
    }
  };

  // Filtered Testimonials
  const filteredTestimonials = testimonials.filter((t) => {
    const matchesStatus =
      filterStatus === "true"
        ? t.active
        : filterStatus === "false"
        ? !t.active
        : true;

    const nameObj = parseField(t.name);
    const matchesName =
      nameObj.en.toLowerCase().includes(searchName.toLowerCase()) ||
      nameObj.hi.toLowerCase().includes(searchName.toLowerCase());

    return matchesStatus && matchesName;
  });

  const totalPages = Math.ceil(filteredTestimonials.length / itemsPerPage);
  const paginatedData = filteredTestimonials.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (!authorized || !mounted)
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

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Testimonials</h1>

      <div className="bg-white p-6 rounded-2xl shadow-lg mb-8">
        {/* Filters and Add Button */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <h2 className="text-xl font-semibold text-gray-700">All Testimonials</h2>
          <button
            onClick={() => router.push(`/admin/testimonials/add`)}
            className="flex items-center gap-1 px-3 py-1.5 bg-[#e94e4e] text-white text-sm rounded-md hover:bg-red-600 shadow transition"
          >
            <Plus size={14} /> New Testimonial
          </button>
        </div>

        <div className="flex flex-wrap gap-3 items-center bg-white p-4 rounded-xl shadow-sm mb-3">
          <div className="relative">
            <Activity className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="pl-7 pr-3 py-2 rounded-lg border border-gray-300 focus:ring-1 focus:ring-[#e94e4e] focus:outline-none shadow-sm transition"
            >
              <option value="">All Status</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>

          <div className="relative flex-1 min-w-[130px]">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            <input
              type="text"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              placeholder="Search..."
              className="pl-7 pr-3 py-2 w-full rounded-lg border border-gray-300 focus:ring-1 focus:ring-[#e94e4e] focus:outline-none shadow-sm transition"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white rounded-2xl shadow-lg overflow-hidden">
            <thead className="bg-gray-100 text-gray-700 text-sm uppercase tracking-wide font-semibold">
              <tr>
                <th className="py-4 px-5 text-left border-b border-gray-200 rounded-tl-2xl">Image</th>
                <th className="py-4 px-5 text-left border-b border-gray-200">Name</th>
                <th className="py-4 px-5 text-left border-b border-gray-200">Rank</th>
                <th className="py-4 px-5 text-left border-b border-gray-200">Year</th>
                <th className="py-4 px-5 text-left border-b border-gray-200">Quote</th>
                <th className="py-4 px-5 text-center border-b border-gray-200">Status</th>
                <th className="py-4 px-5 text-center border-b border-gray-200 rounded-tr-2xl">Actions</th>
              </tr>
            </thead>

            <tbody className="text-gray-800 text-sm">
              {paginatedData.length > 0 ? (
                paginatedData.map((t) => {
                  const nameObj = parseField(t.name);
                  const rankObj = parseField(t.rank);
                  const quoteObj = parseField(t.quote);

                  return (
                    <tr
                      key={t._id}
                      className="hover:bg-gray-50 transition-colors border-b border-gray-200"
                    >
                      <td className="py-3 px-5">
                        {t.image?.url ? (
                          <img
                            src={t.image.url}
                            alt={nameObj.en}
                            className="h-16 w-32 object-cover rounded"
                          />
                        ) : (
                          <div className="h-16 w-32 bg-gray-100 flex items-center justify-center text-xs text-gray-400">
                            No Image
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-5">
                        <div className="flex flex-col gap-1">
                          <span className="font-medium">{nameObj.en}</span>
                          <span className="text-gray-500 text-sm">{nameObj.hi}</span>
                        </div>
                      </td>
                      <td className="py-3 px-5">
                        <div className="flex flex-col gap-1">
                          <span className="font-medium">{rankObj.en}</span>
                          <span className="text-gray-500 text-sm">{rankObj.hi}</span>
                        </div>
                      </td>
                      <td className="py-3 px-5">{t.year}</td>
                      <td className="py-3 px-5">
                        <div className="flex flex-col gap-1">
                          <span className="font-medium">{quoteObj.en}</span>
                          <span className="text-gray-500 text-sm">{quoteObj.hi}</span>
                        </div>
                      </td>
                      <td className="py-3 px-5 text-center">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" checked={t.active ?? false} readOnly className="sr-only" />
                          <div
                            onClick={() => handleToggleActive(t._id, t.active)}
                            className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 cursor-pointer ${
                              t.active ? "bg-green-500" : "bg-gray-300"
                            }`}
                          >
                            <span
                              className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${
                                t.active ? "translate-x-6" : "translate-x-0"
                              }`}
                            ></span>
                          </div>
                        </label>
                      </td>
                      <td className="py-3 px-5 text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => router.push(`/admin/testimonials/${t._id}`)}
                            className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-md hover:shadow-lg transition transform hover:scale-110"
                            title="Edit"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(t._id)}
                            className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-md hover:shadow-lg transition transform hover:scale-110"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-gray-500 italic">
                    No testimonials found
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

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmOpen}
        title={confirmTitle}
        message={confirmMessage}
        confirmText={confirmBtnText}
        onConfirm={confirmAction}
        onCancel={() => setConfirmOpen(false)}
      />
    </AdminLayout>
  );
}
  