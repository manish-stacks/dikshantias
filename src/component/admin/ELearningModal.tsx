"use client";

import { useEffect, useState, FormEvent, ChangeEvent } from "react";
import toast from "react-hot-toast";
import { X, CheckCircle } from "lucide-react";

export interface ELearning {
  _id?: string;
  titleEN: string;
  titleHI: string;
  monthYear: string;
  fileLinkEN: string;
  fileLinkHI: string;
  active: boolean;
  displayOrder?: number;
}

interface ELearningModalProps {
  onClose: () => void;
  onSubmit: () => void;
  eLearning?: ELearning;
}

export default function ELearningModal({
  onClose,
  onSubmit,
  eLearning,
}: ELearningModalProps) {
  const [titleEN, setTitleEN] = useState("");
  const [titleHI, setTitleHI] = useState("");
  const [monthYear, setMonthYear] = useState("");
  const [fileEN, setFileEN] = useState<File | null>(null);
  const [fileHI, setFileHI] = useState<File | null>(null);
  const [active, setActive] = useState(true);
  const [displayOrder, setDisplayOrder] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(false);

  // Prefill data when editing
  useEffect(() => {
    if (eLearning) {
      setTitleEN(eLearning.titleEN);
      setTitleHI(eLearning.titleHI);
      setMonthYear(eLearning.monthYear);
      setActive(eLearning.active);
      setDisplayOrder(eLearning.displayOrder || 1);
    } else {
      setTitleEN("");
      setTitleHI("");
      setMonthYear("");
      setActive(true);
      setDisplayOrder(1);
    }
  }, [eLearning]);

  // Handle file input
  const handleFileChangeEN = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setFileEN(e.target.files[0]);
  };

  const handleFileChangeHI = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setFileHI(e.target.files[0]);
  };

// Handle submit
const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    const formData = new FormData();
    formData.append("titleEN", titleEN);
    formData.append("titleHI", titleHI);
    formData.append("monthYear", monthYear);
    formData.append("active", active ? "true" : "false");
    formData.append("displayOrder", displayOrder.toString());

    if (fileEN instanceof File) formData.append("fileEN", fileEN);
    if (fileHI instanceof File) formData.append("fileHI", fileHI);

    const url = eLearning
      ? `/api/admin/elearnings/${eLearning._id}`
      : "/api/admin/elearnings";
    const method = eLearning ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      body: formData, // multipart/form-data automatically handled by browser
    });

    if (res.ok) {
      toast.success(
        `E-Learning ${eLearning ? "updated" : "created"} successfully!`
      );
      onSubmit();
      onClose();
    } else {
      const errorData = await res.json();
      toast.error(
        errorData?.error || `Failed to ${eLearning ? "update" : "create"} E-Learning`
      );
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
      <div className="bg-white rounded-lg w-full max-w-3xl shadow-2xl overflow-hidden relative">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-300 bg-[#e94e4e]">
          <h2 className="text-xl font-semibold text-white">
            {eLearning ? "Edit E-Learning" : "Add E-Learning"}
          </h2>
          <button
            onClick={handleClose}
            className="text-white hover:text-gray-200 transition"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5 px-6 py-6"
          encType="multipart/form-data"
        >
          {/* EN Title */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              English Title
            </label>
            <input
              type="text"
              value={titleEN}
              onChange={(e) => setTitleEN(e.target.value)}
              placeholder="Enter English Title"
              className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-1 focus:ring-[#e94e4e]"
              required
              disabled={isLoading}
            />
          </div>

          {/* HI Title */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Hindi Title
            </label>
            <input
              type="text"
              value={titleHI}
              onChange={(e) => setTitleHI(e.target.value)}
              placeholder="Enter Hindi Title"
              className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-1 focus:ring-[#e94e4e]"
              required
              disabled={isLoading}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Month-Year */}
            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Month & Year
              </label>
              <input
                type="text"
                value={monthYear}
                onChange={(e) => setMonthYear(e.target.value)}
                placeholder="e.g., Oct 2025"
                className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-1 focus:ring-[#e94e4e]"
                required
                disabled={isLoading}
              />
            </div>

            {/* Display Order */}
            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Display Order
              </label>
              <input
                type="number"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(Number(e.target.value))}
                placeholder="Enter display order"
                className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-1 focus:ring-[#e94e4e]"
                min={1}
                disabled={isLoading}
              />
            </div>
          </div>

          {/* PDF Upload Section (Side by Side) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-1 font-medium text-gray-700">
                English PDF File
              </label>
              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileChangeEN}
                className="border border-gray-300 rounded-lg px-3 py-2 w-full"
                disabled={isLoading}
              />
             {/* Existing EN PDF */}
                {eLearning?.fileLinkEN?.url && (
                <a
                    href={eLearning.fileLinkEN.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 mt-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 hover:bg-blue-100 transition-all w-fit"
                >
                    <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4"
                    >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 4.5v15m7.5-7.5h-15"
                    />
                    </svg>
                    <span>View Existing EN PDF</span>
                </a>
                )}
            </div>

            {/* HI PDF File */}
            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Hindi PDF File
              </label>
              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileChangeHI}
                className="border border-gray-300 rounded-lg px-3 py-2 w-full"
                disabled={isLoading}
              />
                {/* Existing HI PDF */}
                {eLearning?.fileLinkHI?.url && (
                <a
                    href={eLearning.fileLinkHI.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 mt-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 hover:bg-blue-100 transition-all w-fit"
                >
                    <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4"
                    >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 4.5v15m7.5-7.5h-15"
                    />
                    </svg>
                    <span>View Existing HI PDF</span>
                </a>
                )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-5 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#e94e4e] text-white rounded-lg hover:bg-red-600 flex items-center gap-2"
              disabled={isLoading}
            >
              <CheckCircle size={18} /> {eLearning ? "Update" : "Save"}
            </button>
          </div>
        </form>

        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-white/70 flex flex-col items-center justify-center z-50">
            <p className="text-gray-700 font-semibold text-lg">
              {eLearning ? "Updating..." : "Creating..."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
