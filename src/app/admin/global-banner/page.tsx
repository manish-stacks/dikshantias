"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/component/admin/AdminLayout";
import { Edit2, Plus } from "lucide-react";
import toast from "react-hot-toast";

interface BannerData {
  _id: string;

  link: string;

  desktopBanner: {
    url: string;
    key: string;
  };

  mobileBanner: {
    url: string;
    key: string;
  };

  status: boolean;
}

export default function GlobalBannerPage() {
  const [authorized, setAuthorized] = useState(false);

  const [banner, setBanner] = useState<BannerData | null>(null);

  const [showModal, setShowModal] = useState(false);

  const [loading, setLoading] = useState(false);

  // FORM STATES
  const [link, setLink] = useState("");

  const [desktopBanner, setDesktopBanner] = useState<File | null>(null);

  const [mobileBanner, setMobileBanner] = useState<File | null>(null);

  // AUTH + FETCH
  useEffect(() => {
    const token = localStorage.getItem("adminToken");

    if (!token) {
      window.location.href = "/admin/login";
    } else {
      setAuthorized(true);

      fetchBanner();
    }
  }, []);

  // FETCH BANNER
  const fetchBanner = async () => {
    try {
      const res = await fetch("/api/admin/global-banner");

      const data = await res.json();

      setBanner(data);

      // PREFILL FORM
      if (data) {
        setLink(data.link);
      }
    } catch (err) {
      console.error("Failed to fetch banner:", err);
    }
  };

  // SUBMIT
  const handleSubmit = async () => {
    try {
      setLoading(true);

      if (!link) {
        toast.error("Banner link is required");

        return;
      }

      const formData = new FormData();

      formData.append("link", link);

      formData.append("status", "true");

      if (desktopBanner) {
        formData.append("desktopBanner", desktopBanner);
      }

      if (mobileBanner) {
        formData.append("mobileBanner", mobileBanner);
      }

      const res = await fetch("/api/admin/global-banner", {
        method: "POST",

        body: formData,
      });

      if (!res.ok) {
        toast.error("Failed to save banner");

        return;
      }

      toast.success(
        banner ? "Banner updated successfully" : "Banner created successfully",
      );

      setShowModal(false);

      fetchBanner();
    } catch (err) {
      console.error(err);

      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Status
  const handleToggleStatus = async () => {
    try {
      if (!banner?._id) return;

      const res = await fetch("/api/admin/global-banner", {
        method: "PATCH",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          status: !banner.status,
        }),
      });

      if (!res.ok) {
        toast.error("Failed to update status");
        return;
      }
      setBanner((prev) =>
        prev
          ? {
              ...prev,
              status: !prev.status,
            }
          : null,
      );
      toast.success("Banner Status updated");
    } catch (error) {
      console.error(error);

      toast.error("Something went wrong");
    }
  };
  // LOADING
  if (!authorized) {
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
  }

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Global Banner</h1>

      <div className="bg-white p-6 rounded-2xl shadow-lg mb-8">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-700">All Banner</h2>

          <button
            onClick={() => {
              setShowModal(true);
            }}
            className="flex items-center gap-1 px-3 py-1.5 bg-[#e94e4e] text-white text-sm rounded-md hover:bg-red-600 shadow transition"
          >
            {banner ? <Edit2 size={14} /> : <Plus size={14} />}

            {banner ? "Update Banner" : "Create Banner"}
          </button>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* HEAD */}
            <thead className="bg-gray-100 text-gray-700 text-sm uppercase tracking-wide font-semibold">
              <tr>
                <th className="py-4 px-5 text-left border-b border-gray-200">
                  Desktop Banner
                </th>

                <th className="py-4 px-5 text-left border-b border-gray-200">
                  Mobile Banner
                </th>

                <th className="py-4 px-5 text-left border-b border-gray-200">
                  Banner Link
                </th>

                <th className="py-4 px-5 text-center border-b border-gray-200">
                  Status
                </th>

                <th className="py-4 px-5 text-center border-b border-gray-200">
                  Actions
                </th>
              </tr>
            </thead>

            {/* BODY */}
            <tbody className="text-gray-800 text-sm">
              {banner ? (
                <tr className="hover:bg-gray-50 transition-colors border-b border-gray-200">
                  {/* DESKTOP */}
                  <td className="py-5 px-5">
                    <div className="w-[320px] h-[120px] bg-gray-50 border border-gray-200 rounded-2xl overflow-hidden flex items-center justify-center p-3 shadow-sm">
                      <img
                        src={banner.desktopBanner?.url}
                        alt="Desktop Banner"
                        className="max-w-full max-h-full object-contain rounded-lg"
                      />
                    </div>
                  </td>

                  {/* MOBILE */}
                  <td className="py-5 px-5">
                    <div className="w-[140px] h-[120px] bg-gray-50 border border-gray-200 rounded-2xl overflow-hidden flex items-center justify-center p-3 shadow-sm">
                      <img
                        src={banner.mobileBanner?.url}
                        alt="Mobile Banner"
                        className="max-w-full max-h-full object-contain rounded-lg"
                      />
                    </div>
                  </td>

                  {/* LINK */}
                  <td className="py-3 px-5 max-w-md">
                    <a
                      href={banner.link}
                      target="_blank"
                      className="text-blue-600 hover:underline break-all"
                    >
                      {banner.link}
                    </a>
                  </td>

                  {/* STATUS */}
                  <td className="py-3 px-5 text-center">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={banner.status}
                        onChange={handleToggleStatus}
                        className="sr-only"
                      />
                      <div
                        className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${
                          banner.status ? "bg-green-500" : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${
                            banner.status ? "translate-x-6" : "translate-x-0"
                          }`}
                        ></span>
                      </div>
                    </label>
                  </td>

                  {/* ACTION */}
                  <td className="py-3 px-5 text-center">
                    <button
                      onClick={() => {
                        setShowModal(true);
                      }}
                      className="flex items-center justify-center mx-auto w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-md hover:shadow-lg transition transform hover:scale-110"
                    >
                      <Edit2 size={16} />
                    </button>
                  </td>
                </tr>
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-8 text-gray-500 italic border-b border-gray-200"
                  >
                    No banner found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden">
            {/* HEADER */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {banner ? "Update Banner" : "Create Banner"}
                </h2>

                <p className="text-xs text-gray-500 mt-1">
                  Manage website global banner
                </p>
              </div>

              <button
                onClick={() => setShowModal(false)}
                className="w-9 h-9 rounded-full bg-gray-100 hover:bg-red-50 hover:text-red-600 transition flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            {/* BODY */}
            <div className="p-5 space-y-5">
              {/* LINK */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Banner Link
                </label>

                <input
                  type="text"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder="Enter banner link"
                  className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              {/* IMAGE GRID */}
              <div className="grid md:grid-cols-2 gap-4">
                {/* DESKTOP */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Desktop Banner
                  </label>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setDesktopBanner(e.target.files?.[0] || null)
                    }
                    className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 bg-gray-50 file:mr-3 file:px-3 file:py-1.5 file:border-0 file:rounded-lg file:bg-red-50 file:text-red-600"
                  />

                  {banner?.desktopBanner?.url && (
                    <img
                      src={banner.desktopBanner.url}
                      alt="Desktop"
                      className="w-full h-32 rounded-xl object-cover border border-gray-200 mt-3"
                    />
                  )}
                </div>

                {/* MOBILE */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Mobile Banner
                  </label>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setMobileBanner(e.target.files?.[0] || null)
                    }
                    className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 bg-gray-50 file:mr-3 file:px-3 file:py-1.5 file:border-0 file:rounded-lg file:bg-red-50 file:text-red-600"
                  />

                  {banner?.mobileBanner?.url && (
                    <img
                      src={banner.mobileBanner.url}
                      alt="Mobile"
                      className="w-full h-32 rounded-xl object-cover border border-gray-200 mt-3"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* FOOTER */}
            <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-gray-100 bg-gray-50">
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-6 py-2 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white font-semibold shadow-md transition"
              >
                {loading
                  ? "Please wait..."
                  : banner
                    ? "Update Banner"
                    : "Create Banner"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
