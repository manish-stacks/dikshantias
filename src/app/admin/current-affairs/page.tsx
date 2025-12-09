"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/component/admin/AdminLayout";
import {
  Trash2,
  Edit2,
  Plus,
  Search,
  Folder,
  Layers,
  Activity,
} from "lucide-react";
import toast from "react-hot-toast";
import ConfirmDialog from "@/component/admin/ConfirmDialog";

interface CurrentAffair {
  _id: string;
  title: { en: string; hi: string };
  slug: string;
  shortContent?: { en: string; hi: string };
  category?: { _id: string; name: string };
  subCategory?: { _id: string; name: string };
  image?: { url: string; public_id?: string; public_url?: string };
  imageAlt?: string;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export default function CurrentAffairsPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [currentAffairs, setCurrentAffairs] = useState<CurrentAffair[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<() => void>(() => {});
  const [confirmTitle, setConfirmTitle] = useState("");
  const [confirmMessage, setConfirmMessage] = useState("");
  const [confirmBtnText, setConfirmBtnText] = useState("Confirm");
  const itemsPerPage = 5;

  const [filterCategory, setFilterCategory] = useState<string>("");
  const [filterSubCategory, setFilterSubCategory] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [searchTitle, setSearchTitle] = useState<string>("");

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) window.location.href = "/admin/login";
    else {
      setAuthorized(true);
      fetchCurrentAffairs();
    }
  }, []);

  const fetchCurrentAffairs = async () => {
    try {
      const res = await fetch("/api/admin/current-affairs");
      if (!res.ok) throw new Error("Failed to fetch Current Affairs");
      const data = await res.json();
      setCurrentAffairs(data || []); // Update state
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch Current Affairs");
    }
  };

  const handleDelete = (id: string) => {
    setConfirmTitle("Are you sure you want to delete this Current Affair?");
    setConfirmMessage("You won't be able to revert this!");
    setConfirmBtnText("Delete");

    setConfirmAction(() => async () => {
      try {
        const res = await fetch(`/api/admin/current-affairs/${id}`, {
          method: "DELETE",
        });
        if (!res.ok) throw new Error("Failed to delete");
        toast.success("Deleted successfully!");
        fetchCurrentAffairs();
      } catch (err) {
        console.error(err);
        toast.error("Failed to delete");
      } finally {
        setConfirmOpen(false);
      }
    });

    setConfirmOpen(true);
  };

  const handleToggleActive = (id: string, currentStatus: boolean) => {
    setConfirmTitle(
      currentStatus
        ? "Deactivate this Current Affair?"
        : "Activate this Current Affair?"
    );
    setConfirmMessage(
      `Are you sure you want to ${
        currentStatus ? "deactivate" : "activate"
      } this Current Affair?`
    );
    setConfirmBtnText(currentStatus ? "Yes, Deactivate" : "Yes, Activate");

    setConfirmAction(() => async () => {
      try {
        const res = await fetch(`/api/admin/current-affairs/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ active: !currentStatus }),
        });
        if (!res.ok) throw new Error("Failed to update");

        setCurrentAffairs((prev) =>
          prev.map((item) =>
            item._id === id ? { ...item, active: !currentStatus } : item
          )
        );
        toast.success(
          `Current Affair has been ${
            !currentStatus ? "activated" : "deactivated"
          }`
        );
      } catch (err) {
        console.error(err);
        toast.error("Failed to update status");
      } finally {
        setConfirmOpen(false);
      }
    });

    setConfirmOpen(true);
  };

  // Filter
  const filteredAffairs = currentAffairs.filter((item) => {
    const matchesStatus =
      filterStatus === "true"
        ? item.active
        : filterStatus === "false"
        ? !item.active
        : true;
    const matchesCategory = filterCategory
      ? item.category?._id === filterCategory
      : true;
    const matchesSubCategory = filterSubCategory
      ? item.subCategory?._id === filterSubCategory
      : true;
    const matchesTitle =
      item.title.en.toLowerCase().includes(searchTitle.toLowerCase()) ||
      item.title.hi.toLowerCase().includes(searchTitle.toLowerCase());
    return (
      matchesStatus && matchesCategory && matchesSubCategory && matchesTitle
    );
  });

  const totalPages = Math.ceil(filteredAffairs.length / itemsPerPage);
  const paginatedData = filteredAffairs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Current Affairs</h1>

      <div className="bg-white p-6 rounded-2xl shadow-lg mb-8">
        {/* Filters and Add Button */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <h2 className="text-xl font-semibold text-gray-700">
            All Current Affairs
          </h2>
          <button
            onClick={() => router.push("/admin/current-affairs/add")}
            className="flex items-center gap-1 px-3 py-1.5 bg-[#e94e4e] text-white text-sm rounded-md hover:bg-red-600 shadow transition"
          >
            <Plus size={14} /> New Current Affair
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 items-center bg-white p-4 rounded-xl shadow-sm mb-3">
          <div className="flex flex-wrap gap-3 items-center bg-white p-4 rounded-xl shadow-sm mb-3">
            {/* Category Filter */}
            <div className="relative min-w-[150px]">
              <Folder className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="appearance-none w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-1 focus:ring-[#e94e4e] hover:border-gray-400 transition"
              >
                <option value="">All Categories</option>
                {Array.from(
                  new Set(currentAffairs.map((c) => c.category?.name))
                )
                  .filter(Boolean)
                  .map((catName) => {
                    const cat = currentAffairs.find(
                      (c) => c.category?.name === catName
                    )?.category;
                    return cat ? (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ) : null;
                  })}
              </select>
            </div>

            {/* SubCategory Filter */}
            <div className="relative min-w-[150px]">
              <Layers className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              <select
                value={filterSubCategory}
                onChange={(e) => setFilterSubCategory(e.target.value)}
                className="appearance-none w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-1 focus:ring-[#e94e4e] hover:border-gray-400 transition"
              >
                <option value="">All Sub Categories</option>
                {Array.from(
                  new Set(currentAffairs.map((c) => c.subCategory?.name))
                )
                  .filter(Boolean)
                  .map((subName) => {
                    const sub = currentAffairs.find(
                      (c) => c.subCategory?.name === subName
                    )?.subCategory;
                    return sub ? (
                      <option key={sub._id} value={sub._id}>
                        {sub.name}
                      </option>
                    ) : null;
                  })}
              </select>
            </div>

            {/* Status Filter */}
            <div className="relative min-w-[120px]">
              <Activity className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="appearance-none w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-1 focus:ring-[#e94e4e] hover:border-gray-400 transition"
              >
                <option value="">All Status</option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
          </div>
          {/* Search */}
          <div className="relative flex-1 min-w-[130px]">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            <input
              type="text"
              value={searchTitle}
              onChange={(e) => setSearchTitle(e.target.value)}
              placeholder="Search .."
              className="pl-7 pr-3 py-2 w-full rounded-lg border border-gray-300 focus:ring-1 focus:ring-[#e94e4e] focus:outline-none shadow-sm transition"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white rounded-2xl shadow-lg overflow-hidden">
            <thead className="bg-gray-100 text-gray-700 text-sm uppercase tracking-wide font-semibold">
              <tr>
                <th className="py-4 px-5 text-left border-b border-gray-200">
                  Title
                </th>
                <th className="py-4 px-5 text-left border-b border-gray-200">
                  Category
                </th>
                <th className="py-4 px-5 text-left border-b border-gray-200">
                  Sub Category
                </th>
                <th className="py-4 px-5 text-center border-b border-gray-200">
                  Status
                </th>
                <th className="py-4 px-5 text-center border-b border-gray-200 rounded-tr-2xl">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="text-gray-800 text-sm">
              {paginatedData.length > 0 ? (
                paginatedData.map((item) => (
                  <tr
                    key={item._id}
                    className="hover:bg-gray-50 transition-colors border-b border-gray-200"
                  >
                    {/* Title */}
                    <td className="py-3 px-5 font-medium space-y-1">
                      <div className="text-gray-800 font-semibold">
                        {item.title.en}
                      </div>
                      <div className="text-gray-600 italic text-sm">
                        {item.title.hi}
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-5">{item.category?.name}</td>

                    {/* Sub Category */}
                    <td className="py-3 px-5">{item.subCategory?.name}</td>

                    {/* Active Toggle */}
                    <td className="py-3 px-5 text-center">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={item.active}
                          readOnly
                          className="sr-only"
                        />
                        <div
                          onClick={() =>
                            handleToggleActive(item._id, item.active)
                          }
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

                    {/* Actions */}
                    <td className="py-3 px-5 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() =>
                            router.push(`/admin/current-affairs/${item._id}`)
                          }
                          className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white shadow-md hover:shadow-lg"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="flex items-center justify-center w-8 h-8 rounded-full bg-red-500 text-white shadow-md hover:shadow-lg"
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
                  <td
                    colSpan={5}
                    className="text-center py-8 text-gray-500 italic"
                  >
                    No Current Affairs found
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
              currentPage === 1
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
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded-md font-medium ${
              currentPage === totalPages
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
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
