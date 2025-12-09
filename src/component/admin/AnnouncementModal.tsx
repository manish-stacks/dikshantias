"use client";

import { useState, useEffect, FormEvent } from "react";
import toast from "react-hot-toast";
import { X, CheckCircle, ChevronDown } from "lucide-react";

interface Announcement {
  _id?: string;
  title: {
    en: string;
    hi: string;
  };
  bgcolor: string;
  active: boolean;
}

interface AnnouncementModalProps {
  announcement?: Announcement | null;
  onClose: () => void;
  onSubmit: () => void;
}

export default function AnnouncementModal({
  announcement,
  onClose,
  onSubmit,
}: AnnouncementModalProps) {
  const [titleEn, setTitleEn] = useState("");
  const [titleHi, setTitleHi] = useState("");
  const [bgcolor, setBgcolor] = useState("bg-red-500");
  const [active, setActive] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const colors = [
    { name: "Red 500", value: "bg-red-500" },
    { name: "Blue 500", value: "bg-blue-500" },
    { name: "Green 500", value: "bg-green-500" },
    { name: "Yellow 500", value: "bg-yellow-500" },
    { name: "Purple 500", value: "bg-purple-500" },
    { name: "Pink 500", value: "bg-pink-500" },
    { name: "Indigo 500", value: "bg-indigo-500" },
    { name: "Teal 500", value: "bg-teal-500" },
    { name: "Gray 500", value: "bg-gray-500" },
  ];

  // Prefill data when editing
  useEffect(() => {
    if (announcement) {
      setTitleEn(announcement.title.en);
      setTitleHi(announcement.title.hi);
      setBgcolor(announcement.bgcolor);
      setActive(announcement.active);
    } else {
      setTitleEn("");
      setTitleHi("");
      setBgcolor("bg-red-500");
      setActive(true);
    }
  }, [announcement]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const body = { title: { en: titleEn, hi: titleHi }, bgcolor, active };

      const url = announcement
        ? `/api/admin/announcements/${announcement._id}`
        : "/api/admin/announcements";

      const method = announcement ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        toast.success(`Announcement ${announcement ? "updated" : "created"} successfully!`);
        onSubmit();
        onClose();
      } else {
        const data = await res.json();
        toast.error(data.error || `Failed to ${announcement ? "update" : "create"} announcement`);
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl shadow-2xl overflow-hidden relative">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-300 bg-[#e94e4e]">
          <h2 className="text-xl font-semibold text-white">
            {announcement ? "Edit Announcement" : "Add Announcement"}
          </h2>
          <button onClick={handleClose} className="text-white hover:text-gray-200 transition">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 px-6 py-6">
          {/* English Title */}
          <label className="flex flex-col text-gray-700 text-medium">
            Title (English)
            <input
              type="text"
              value={titleEn}
              onChange={(e) => setTitleEn(e.target.value)}
              placeholder="Enter title in English"
              className="mt-2 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-[#e94e4e]"
              required
              disabled={isLoading}
            />
          </label>

          {/* Hindi Title */}
          <label className="flex flex-col text-gray-700 text-medium">
            Title (Hindi)
            <input
              type="text"
              value={titleHi}
              onChange={(e) => setTitleHi(e.target.value)}
              placeholder="Enter title in Hindi"
              className="mt-2 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-[#e94e4e]"
              required
              disabled={isLoading}
            />
          </label>

          {/* Color Dropdown */}
          <label className="flex flex-col text-gray-700 text-medium relative">
            Background Color
            <div
              className="mt-2 relative w-full cursor-pointer"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <div className="flex items-center justify-between border border-gray-300 rounded-lg px-4 py-2 bg-white">
                <div className="flex items-center gap-2">
                  <span className={`w-5 h-5 rounded-full ${bgcolor}`}></span>
                  <span className="text-gray-700">
                    {colors.find((c) => c.value === bgcolor)?.name}
                  </span>
                </div>
                <ChevronDown className="text-gray-400" size={20} />
              </div>

              {dropdownOpen && (
                <ul className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                  {colors.map((color) => (
                    <li
                      key={color.value}
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setBgcolor(color.value);
                        setDropdownOpen(false);
                      }}
                    >
                      <span className={`w-5 h-5 rounded-full ${color.value}`}></span>
                      <span className="text-gray-700">{color.name}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </label>

          {/* Actions */}
          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={handleClose}
              className={`px-5 py-2 bg-gray-100 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-200 transition ${isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              disabled={isLoading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className={`flex items-center gap-2 px-5 py-2 bg-[#e94e4e] text-white rounded-lg shadow-md hover:bg-red-600 transition ${isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              disabled={isLoading}
            >
              <CheckCircle size={18} className="text-white" />
              {announcement ? "Update" : "Save"}
            </button>
          </div>
        </form>

        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-white/70 flex flex-col items-center justify-center z-50">
            <div className="flex space-x-3 mb-4">
              <div className="w-5 h-5 bg-[#e94e4e] rounded-full animate-bounce"></div>
              <div className="w-5 h-5 bg-[#f97316] rounded-full animate-bounce delay-150"></div>
              <div className="w-5 h-5 bg-[#facc15] rounded-full animate-bounce delay-300"></div>
            </div>
            <p className="text-gray-700 font-semibold text-lg">
              {announcement ? "Updating announcement..." : "Creating announcement..."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
