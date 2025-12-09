"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/component/admin/AdminLayout";
import ImageUpload from "@/component/admin/ImageUpload";
import { CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function AddResultPage() {
  const router = useRouter();

  // English Fields
  const [nameEn, setNameEn] = useState("");
  const [rankEn, setRankEn] = useState("");
  const [serviceEn, setServiceEn] = useState("");
  const [descEn, setDescEn] = useState("");

  // Hindi Fields
  const [nameHi, setNameHi] = useState("");
  const [rankHi, setRankHi] = useState("");
  const [serviceHi, setServiceHi] = useState("");
  const [descHi, setDescHi] = useState("");

  const [year, setYear] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("nameEn", nameEn);
      formData.append("rankEn", rankEn);
      formData.append("serviceEn", serviceEn);
      formData.append("descEn", descEn);

      formData.append("nameHi", nameHi);
      formData.append("rankHi", rankHi);
      formData.append("serviceHi", serviceHi);
      formData.append("descHi", descHi);

      formData.append("year", year);

      if (imageFile) {
        formData.append("image", imageFile);
      }

      const res = await fetch("/api/admin/results", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to create Result");

      toast.success("Result added successfully");
      router.push("/admin/results");
    } catch (err) {
      console.error("Error submitting Result:", err);
      toast.error("Failed to add Result");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitting) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="flex flex-col items-center">
          <div className="relative flex space-x-3 mb-4">
            <div className="w-5 h-5 bg-[#e94e4e] rounded-full animate-bounce"></div>
            <div className="w-5 h-5 bg-[#f97316] rounded-full animate-bounce delay-150"></div>
            <div className="w-5 h-5 bg-[#facc15] rounded-full animate-bounce delay-300"></div>
          </div>
          <p className="text-gray-700 font-semibold text-lg">
            Result is being created...
          </p>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">New Result</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-xl max-w-4xl mx-auto space-y-8"
      >
        {/* English Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b border-gray-300 pb-2">
            English Section
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-medium text-gray-700 mb-1">Name (English)</label>
              <input
                type="text"
                value={nameEn}
                onChange={(e) => setNameEn(e.target.value)}
                className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-1 focus:ring-[#e94e4e] outline-none"
                required
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-1">Rank (English)</label>
              <input
                type="text"
                value={rankEn}
                onChange={(e) => setRankEn(e.target.value)}
                className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-1 focus:ring-[#e94e4e] outline-none"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block font-medium text-gray-700 mb-1">Service (English)</label>
              <input
                type="text"
                value={serviceEn}
                onChange={(e) => setServiceEn(e.target.value)}
                className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-1 focus:ring-[#e94e4e] outline-none"
              />
            </div>
            {/* <div className="md:col-span-2">
              <label className="block font-medium text-gray-700 mb-1">Description (English)</label>
              <textarea
                value={descEn}
                onChange={(e) => setDescEn(e.target.value)}
                className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-1 focus:ring-[#e94e4e] outline-none"
              />
            </div> */}
          </div>
        </div>

       {/* Hindi Section */}
<div>
  <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b border-gray-300 pb-2">
    हिंदी
  </h2>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div>
      <label className="block font-medium text-gray-700 mb-1">नाम</label>
      <input
        type="text"
        value={nameHi}
        onChange={(e) => setNameHi(e.target.value)}
        className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-1 focus:ring-[#e94e4e] outline-none"
        required
      />
    </div>
    <div>
      <label className="block font-medium text-gray-700 mb-1">रैंक</label>
      <input
        type="text"
        value={rankHi}
        onChange={(e) => setRankHi(e.target.value)}
        className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-1 focus:ring-[#e94e4e] outline-none"
      />
    </div>
    <div className="md:col-span-2">
      <label className="block font-medium text-gray-700 mb-1">सेवा</label>
      <input
        type="text"
        value={serviceHi}
        onChange={(e) => setServiceHi(e.target.value)}
        className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-1 focus:ring-[#e94e4e] outline-none"
      />
    </div>
    {/* <div className="md:col-span-2">
      <label className="block font-medium text-gray-700 mb-1">विवरण</label>
      <textarea
        value={descHi}
        onChange={(e) => setDescHi(e.target.value)}
        className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-1 focus:ring-[#e94e4e] outline-none"
      />
    </div> */}
  </div>
</div>


        {/* Year & Image */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block font-medium text-gray-700 mb-1">Year</label>
            <input
              type="text"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-1 focus:ring-[#e94e4e] outline-none"
            />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Profile Image</h2>
            <ImageUpload onImageSelect={(file) => setImageFile(file)} isLoading={false} />
            <span className="text-gray-400 text-xs mt-1 block">
              Recommended size: <strong>300px × 300px</strong>
            </span>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            className="px-5 py-2 bg-gray-100 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-200 transition"
            onClick={() => router.push("/admin/results")}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-2 px-5 py-2 bg-[#e94e4e] text-white rounded-lg shadow-md hover:bg-red-600 transition"
          >
            <CheckCircle size={18} />
            {submitting ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}
