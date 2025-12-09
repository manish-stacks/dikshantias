"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import AdminLayout from "@/component/admin/AdminLayout";
import ImageUpload from "@/component/admin/ImageUpload";
import { CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function ResultFormPage() {
  const router = useRouter();
  const params = useParams();
  const resultId = params?.id as string | undefined;

  // 📌 Form State - English
  const [nameEn, setNameEn] = useState("");
  const [rankEn, setRankEn] = useState("");
  const [serviceEn, setServiceEn] = useState("");
  const [descEn, setDescEn] = useState("");

  // 📌 Form State - Hindi
  const [nameHi, setNameHi] = useState("");
  const [rankHi, setRankHi] = useState("");
  const [serviceHi, setServiceHi] = useState("");
  const [descHi, setDescHi] = useState("");

  // Other fields
  const [year, setYear] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Loading states
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // ✅ Fetch existing data if editing
  useEffect(() => {
    if (!resultId) return;

    const fetchResult = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/results/${resultId}`);
        if (!res.ok) throw new Error("Failed to fetch result");
        const data = await res.json();

        // Fill English
        setNameEn(data.name?.en || "");
        setRankEn(data.rank?.en || "");
        setServiceEn(data.service?.en || "");
        setDescEn(data.desc?.en || "");

        // Fill Hindi
        setNameHi(data.name?.hi || "");
        setRankHi(data.rank?.hi || "");
        setServiceHi(data.service?.hi || "");
        setDescHi(data.desc?.hi || "");

        setYear(data.year || "");
        setPreviewUrl(data.image?.url || null);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load result");
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [resultId]);

  // ✅ Submit (Create or Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("id", resultId || "");

     // English
      formData.append("name_en", nameEn);
      formData.append("rank_en", rankEn);
      formData.append("service_en", serviceEn);
      formData.append("desc_en", descEn);

      // Hindi
      formData.append("name_hi", nameHi);
      formData.append("rank_hi", rankHi);
      formData.append("service_hi", serviceHi);
      formData.append("desc_hi", descHi);

      formData.append("year", year);
      if (imageFile) formData.append("image", imageFile);

      const res = await fetch(
        resultId ? `/api/admin/results/${resultId}` : "/api/admin/results",
        {
          method: resultId ? "PUT" : "POST",
          body: formData,
        }
      );

      if (!res.ok) throw new Error("Failed to save Result");

      toast.success(resultId ? "Result updated!" : "Result added!");
      router.push("/admin/results");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save Result");
    } finally {
      setSubmitting(false);
    }
  };

  // ✅ Loader while fetching
  if (loading) {
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
            Result is being updated...
          </p>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        {resultId ? "Edit Result" : "New Result"}
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-xl max-w-4xl mx-auto space-y-10"
      >
        {/* English Section */}
        <div>
          <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b border-gray-300 pb-2">
            English
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                value={nameEn}
                onChange={(e) => setNameEn(e.target.value)}
                className="w-full border px-4 py-2.5 rounded-lg focus:ring-1 focus:ring-[#e94e4e]"
                required
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Rank
              </label>
              <input
                type="text"
                value={rankEn}
                onChange={(e) => setRankEn(e.target.value)}
                className="w-full border px-4 py-2.5 rounded-lg focus:ring-1 focus:ring-[#e94e4e]"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block font-medium text-gray-700 mb-1">
                Service
              </label>
              <input
                type="text"
                value={serviceEn}
                onChange={(e) => setServiceEn(e.target.value)}
                className="w-full border px-4 py-2.5 rounded-lg focus:ring-1 focus:ring-[#e94e4e]"
              />
            </div>
            {/* <div className="md:col-span-2">
              <label className="block font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={descEn}
                onChange={(e) => setDescEn(e.target.value)}
                className="w-full border px-4 py-2.5 rounded-lg focus:ring-1 focus:ring-[#e94e4e]"
              />
            </div> */}
          </div>
        </div>

        {/* Hindi Section */}
        <div>
          <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b border-gray-300 pb-2">
            हिंदी
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-medium text-gray-700 mb-1">
                नाम
              </label>
              <input
                type="text"
                value={nameHi}
                onChange={(e) => setNameHi(e.target.value)}
                className="w-full border px-4 py-2.5 rounded-lg focus:ring-1 focus:ring-[#e94e4e]"
                required
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-1">
                रैंक
              </label>
              <input
                type="text"
                value={rankHi}
                onChange={(e) => setRankHi(e.target.value)}
                className="w-full border px-4 py-2.5 rounded-lg focus:ring-1 focus:ring-[#e94e4e]"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block font-medium text-gray-700 mb-1">
                सेवा
              </label>
              <input
                type="text"
                value={serviceHi}
                onChange={(e) => setServiceHi(e.target.value)}
                className="w-full border px-4 py-2.5 rounded-lg focus:ring-1 focus:ring-[#e94e4e]"
              />
            </div>
            {/* <div className="md:col-span-2">
              <label className="block font-medium text-gray-700 mb-1">
                विवरण
              </label>
              <textarea
                value={descHi}
                onChange={(e) => setDescHi(e.target.value)}
                className="w-full border px-4 py-2.5 rounded-lg focus:ring-1 focus:ring-[#e94e4e]"
              />
            </div> */}
          </div>
        </div>

        {/* Year */}
        <div> 
           <label className="block font-medium text-gray-700 mb-1">
                Year
              </label>
          <input
            type="text"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="w-full border px-4 py-2.5 rounded-lg focus:ring-1 focus:ring-[#e94e4e]"
          />
        </div>

        {/* Image Upload */}
        <div>
          <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b border-gray-300 pb-2">
            Profile Image
          </h2>
          <ImageUpload
            onImageSelect={(file) => setImageFile(file)}
            isLoading={loading}
            initialImage={previewUrl}
          />
          <span className="text-gray-400 text-xs mt-1 block">
            Recommended size: <strong>300px × 300px</strong>
          </span>
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
