"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/component/admin/AdminLayout";
import { Trash2, Edit2, Plus } from "lucide-react";
import toast from "react-hot-toast";
import ConfirmDialog from "@/component/admin/ConfirmDialog";


interface Result {
  _id: string;
  name: { en: string; hi: string };
  rank: { en: string; hi: string };
  service: { en: string; hi: string };
  year: string;
  active: boolean;
  image?: { url: string };
  desc?: { en: string; hi: string };
}


export default function ResultPage() {
  const router = useRouter();

  const [authorized, setAuthorized] = useState(false);
  const [results, setResults] = useState<Result[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<() => void>(() => {});
  const [confirmTitle, setConfirmTitle] = useState("");
  const [confirmMessage, setConfirmMessage] = useState("");
  const [confirmBtnText, setConfirmBtnText] = useState("Confirm");

  const itemsPerPage = 5;

  // Check authorization & fetch results
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) window.location.href = "/admin/login";
    else {
      setAuthorized(true);
      fetchResults();
    }
  }, []);

  const fetchResults = async () => {
    try {
      const res = await fetch("/api/admin/results");
      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.error("Failed to fetch results:", err);
    }
  };

  // DELETE result
  const handleDelete = (id: string) => {
    setConfirmTitle("Delete this result?");
    setConfirmMessage("This action cannot be undone.");
    setConfirmBtnText("Delete");
    setConfirmAction(() => async () => {
      try {
        const res = await fetch(`/api/admin/results/${id}`, { method: "DELETE" });
        const data = await res.json();
        if (!res.ok) {
          toast.error(data.error || "Failed to delete result");
          return;
        }
        fetchResults();
        toast.success("Result deleted successfully!");
      } catch (err) {
        console.error(err);
        toast.error("Failed to delete result");
      } finally {
        setConfirmOpen(false);
      }
    });
    setConfirmOpen(true);
  };

  // Toggle active status
  const handleToggleActive = (id: string, currentStatus: boolean) => {
    setConfirmTitle(currentStatus ? "Deactivate this result?" : "Activate this result?");
    setConfirmMessage(
      `Are you sure you want to ${currentStatus ? "deactivate" : "activate"} this result?`
    );
    setConfirmBtnText(currentStatus ? "Yes, Deactivate" : "Yes, Activate");
    setConfirmAction(() => async () => {
      try {
        const res = await fetch(`/api/admin/results/${id}`, {
            method: "PATCH", 
            body: JSON.stringify({ active: !currentStatus }),
            headers: { "Content-Type": "application/json" },
        });

        if (res.ok) {
          setResults((prev) =>
            prev.map((result) =>
              result._id === id ? { ...result, active: !currentStatus } : result
            )
          );
          toast.success(`Result has been ${!currentStatus ? "activated" : "deactivated"}`);
        } else {
          toast.error("Something went wrong.");
        }
      } catch (err) {
        toast.error("Failed to update result.");
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

  const totalPages = Math.ceil(results.length / itemsPerPage);
  const paginatedData = results.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Manage Results</h1>

      {/* Results Table */}
      <div className="bg-white p-6 rounded-2xl shadow-lg mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-700">All Results</h2>
          <button
            onClick={() => router.push("/admin/results/add")}
            className="flex items-center gap-1 px-3 py-1.5 bg-[#e94e4e] text-white text-sm rounded-md hover:bg-red-600 shadow transition"
          >
            <Plus size={14} /> New Result
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white rounded-2xl shadow-lg overflow-hidden">
            <thead className="bg-gray-100 text-gray-700 text-sm uppercase tracking-wide font-semibold">
              <tr>
                <th className="py-4 px-5 text-left border-b border-gray-200">Image</th>
                <th className="py-4 px-5 text-left border-b border-gray-200">Name</th>
                <th className="py-4 px-5 text-center border-b border-gray-200">Rank</th>
                <th className="py-4 px-5 text-center border-b border-gray-200">Service</th>
                <th className="py-4 px-5 text-center border-b border-gray-200">Year</th>
                <th className="py-4 px-5 text-center border-b border-gray-200">Status</th>
                <th className="py-4 px-5 text-center border-b border-gray-200">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-800 text-sm">
              {paginatedData.length > 0 ? (
                paginatedData.map((result) => (
                  <tr
                    key={result._id}
                    className="hover:bg-gray-50 transition-colors border-b border-gray-200"
                  >
                    <td className="py-3 px-5">
                      {result.image?.url ? (
                        <div className="h-16 w-16 flex items-center justify-center bg-gray-50 border border-gray-200 rounded-full overflow-hidden">
                          <img
                            src={result.image.url}
                            alt={result.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="h-16 w-16 flex items-center justify-center rounded-full border border-gray-200 bg-gray-50 text-xs text-gray-400">
                          No Image
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-5 font-medium gap-2">
                      <div className="flex flex-col">
                        <span className="font-semibold">{result.name.en}</span>
                        <span className="text-gray-500 text-sm">{result.name.hi}</span>
                      </div>
                    </td>
                    <td className="py-3 px-5 text-center">
                        <div className="flex flex-col items-center gap-2">
                          {/* English Rank */}
                          <span className="inline-block px-3 py-1 text-sm font-semibold text-white bg-blue-600 rounded-md shadow-sm">
                            # {result.rank.en}
                          </span>

                          {/* Hindi Rank */}
                          <span className="inline-block px-3 py-1 text-sm font-semibold text-white bg-green-600 rounded-md shadow-sm">
                            # {result.rank.hi}
                          </span>
                        </div>
                      </td>

                    <td className="py-3 px-5 text-center gap-2">
                      <div className="flex flex-col">
                        <span>{result.service.en}</span>
                        <span className="text-gray-500 text-sm">{result.service.hi}</span>
                      </div>
                    </td>
                    <td className="py-3 px-5 text-center">{result.year}</td>
                    <td className="py-3 px-5 text-center">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={result.active}
                          readOnly
                          className="sr-only"
                        />
                        <div
                          onClick={() => handleToggleActive(result._id, result.active)}
                          className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 cursor-pointer ${
                            result.active ? "bg-green-500" : "bg-gray-300"
                          }`}
                        >
                          <span
                            className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${
                              result.active ? "translate-x-6" : "translate-x-0"
                            }`}
                          ></span>
                        </div>
                      </label>
                    </td>
                    <td className="py-3 px-5 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => router.push(`/admin/results/${result._id}`)}
                          className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white hover:bg-blue-600 shadow-md hover:shadow-lg transition"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>

                        <button
                          onClick={() => handleDelete(result._id)}
                          className="flex items-center justify-center w-8 h-8 rounded-full bg-red-500 text-white hover:bg-red-600 shadow-md hover:shadow-lg transition"
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
                    colSpan={7}
                    className="text-center py-8 text-gray-500 italic border-b border-gray-200"
                  >
                    No results found
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
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
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
