"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import AdminLayout from "@/component/admin/AdminLayout";
import ImageUpload from "@/component/admin/ImageUpload";
import { CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function AddEditTestimonialPage() {
    const router = useRouter();
    const pathname = usePathname();
    const id = pathname.split("/").pop();

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Language specific fields
    const [nameEn, setNameEn] = useState("");
    const [nameHi, setNameHi] = useState("");
    const [rankEn, setRankEn] = useState("");
    const [rankHi, setRankHi] = useState("");
    const [backgroundEn, setBackgroundEn] = useState("");
    const [backgroundHi, setBackgroundHi] = useState("");
    const [optionalEn, setOptionalEn] = useState("");
    const [optionalHi, setOptionalHi] = useState("");
    const [quoteEn, setQuoteEn] = useState("");
    const [quoteHi, setQuoteHi] = useState("");

    // Non-language fields
    const [year, setYear] = useState("");
    const [attempts, setAttempts] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [existingImage, setExistingImage] = useState<string>("");
    const [active, setActive] = useState(true);

    useEffect(() => {
        if (!id) {
            setLoading(false);
            return;
        }

     
        const safeParse = (field: any) => {
  if (!field) return { en: "", hi: "" };
  if (typeof field === "object") return field; // already object
  try {
    return JSON.parse(field);
  } catch {
    return { en: field, hi: "" };
  }
};

const fetchTestimonial = async () => {
  try {
    const res = await fetch(`/api/admin/testimonials/${id}`);
    if (!res.ok) throw new Error("Failed to fetch testimonial");
    const data = await res.json();

    const nameObj = safeParse(data.name);
    setNameEn(nameObj.en || "");
    setNameHi(nameObj.hi || "");

    const rankObj = safeParse(data.rank);
    setRankEn(rankObj.en || "");
    setRankHi(rankObj.hi || "");

    const backgroundObj = safeParse(data.background);
    setBackgroundEn(backgroundObj.en || "");
    setBackgroundHi(backgroundObj.hi || "");

    const optionalObj = safeParse(data.optional);
    setOptionalEn(optionalObj.en || "");
    setOptionalHi(optionalObj.hi || "");

    const quoteObj = safeParse(data.quote);
    setQuoteEn(quoteObj.en || "");
    setQuoteHi(quoteObj.hi || "");

    setYear(data.year || "");
    setAttempts(data.attempts || "");
    setActive(data.active ?? true);
    setExistingImage(data.image?.url || "");
  } catch (err) {
    console.error(err);
    toast.error("Failed to load testimonial");
  } finally {
    setLoading(false);
  }
};  
        fetchTestimonial();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const formData = new FormData();

            formData.append("name", JSON.stringify({ en: nameEn, hi: nameHi }));
            formData.append("rank", JSON.stringify({ en: rankEn, hi: rankHi }));
            formData.append("background", JSON.stringify({ en: backgroundEn, hi: backgroundHi }));
            formData.append("optional", JSON.stringify({ en: optionalEn, hi: optionalHi }));
            formData.append("quote", JSON.stringify({ en: quoteEn, hi: quoteHi }));

            formData.append("year", year);
            formData.append("attempts", attempts);
            formData.append("active", JSON.stringify(active));

            if (imageFile) formData.append("image", imageFile);

            const res = await fetch(`/api/admin/testimonials/${id}`, {
                method: "PUT",
                body: formData,
            });

            if (!res.ok) throw new Error("Failed to update testimonial");

            toast.success("Testimonial updated successfully");
            router.push("/admin/testimonials");
        } catch (err) {
            console.error(err);
            toast.error("Failed to update testimonial");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading || submitting) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-100">
                <div className="flex flex-col items-center">
                    <div className="relative flex space-x-3 mb-4">
                        <div className="w-5 h-5 bg-[#e94e4e] rounded-full animate-bounce"></div>
                        <div className="w-5 h-5 bg-[#f97316] rounded-full animate-bounce delay-150"></div>
                        <div className="w-5 h-5 bg-[#facc15] rounded-full animate-bounce delay-300"></div>
                    </div>
                    <p className="text-gray-700 font-semibold text-lg">
                        {submitting ? "Updating testimonial..." : "Loading..."}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <AdminLayout>
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Edit Testimonial</h1>

            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-2xl shadow-xl max-w-5xl mx-auto space-y-8"
            >
                {/* English Fields */}
                <div>
                    <h2 className="text-xl font-semibold mb-4">English</h2>
                    <div className="border-b border-gray-300 mb-4"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-gray-700 mb-1">Name (English)</label>
                            <input
                                type="text"
                                value={nameEn}
                                onChange={(e) => setNameEn(e.target.value)}
                                className="w-full border border-gray-300 px-4 py-2.5 rounded-lg"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 mb-1">Rank (English)</label>
                            <input
                                type="text"
                                value={rankEn}
                                onChange={(e) => setRankEn(e.target.value)}
                                className="w-full border border-gray-300 px-4 py-2.5 rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 mb-1">Background (English)</label>
                            <input
                                type="text"
                                value={backgroundEn}
                                onChange={(e) => setBackgroundEn(e.target.value)}
                                className="w-full border border-gray-300 px-4 py-2.5 rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 mb-1">Optional Subject (English)</label>
                            <input
                                type="text"
                                value={optionalEn}
                                onChange={(e) => setOptionalEn(e.target.value)}
                                className="w-full border border-gray-300 px-4 py-2.5 rounded-lg"
                            />
                        </div>
                    </div>
                    <div className="mt-4">
                        <label className="block text-gray-700 mb-1">Quote (English)</label>
                        <textarea
                            value={quoteEn}
                            onChange={(e) => setQuoteEn(e.target.value)}
                            rows={3}
                            className="w-full border border-gray-300 px-4 py-2.5 rounded-lg"
                        />
                    </div>
                </div>

                {/* Hindi Fields */}
                <div>
                    <h2 className="text-xl font-semibold mb-4">हिंदी</h2>
                    <div className="border-b border-gray-300 mb-4"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-gray-700 mb-1">नाम (हिंदी)</label>
                            <input
                                type="text"
                                value={nameHi}
                                onChange={(e) => setNameHi(e.target.value)}
                                className="w-full border border-gray-300 px-4 py-2.5 rounded-lg"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 mb-1">रैंक (हिंदी)</label>
                            <input
                                type="text"
                                value={rankHi}
                                onChange={(e) => setRankHi(e.target.value)}
                                className="w-full border border-gray-300 px-4 py-2.5 rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 mb-1">पृष्ठभूमि (हिंदी)</label>
                            <input
                                type="text"
                                value={backgroundHi}
                                onChange={(e) => setBackgroundHi(e.target.value)}
                                className="w-full border border-gray-300 px-4 py-2.5 rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 mb-1">वैकल्पिक विषय (हिंदी)</label>
                            <input
                                type="text"
                                value={optionalHi}
                                onChange={(e) => setOptionalHi(e.target.value)}
                                className="w-full border border-gray-300 px-4 py-2.5 rounded-lg"
                            />
                        </div>
                    </div>
                    <div className="mt-4">
                        <label className="block text-gray-700 mb-1">उद्धरण (हिंदी)</label>
                        <textarea
                            value={quoteHi}
                            onChange={(e) => setQuoteHi(e.target.value)}
                            rows={3}
                            className="w-full border border-gray-300 px-4 py-2.5 rounded-lg"
                        />
                    </div>
                </div>

                {/* Other Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-gray-700 mb-1">Year</label>
                        <input
                            type="text"
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                            className="w-full border border-gray-300 px-4 py-2.5 rounded-lg"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-1">Attempts</label>
                        <input
                            type="text"
                            value={attempts}
                            onChange={(e) => setAttempts(e.target.value)}
                            className="w-full border border-gray-300 px-4 py-2.5 rounded-lg"
                        />
                    </div>
                </div>

                {/* Image Upload */}
                <div>
                    <label className="block text-gray-700 mb-2">Image</label>
                    <ImageUpload
                        onImageSelect={(file) => setImageFile(file)}
                        isLoading={false}
                        initialImage={existingImage}
                    />
                    <p className="mt-2 text-sm text-gray-500">
                        Recommended size: <span className="font-medium">400×400px</span>
                    </p>
                </div>

                {/* Status */}
                <div className="flex items-center gap-10 mt-4">
                    <span className="text-gray-700 font-medium">Active</span>
                    <button
                        type="button"
                        onClick={() => setActive(!active)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${active ? "bg-green-500" : "bg-gray-300"
                            }`}
                    >
                        <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition ${active ? "translate-x-6" : "translate-x-1"
                                }`}
                        />
                    </button>
                </div>

                {/* Submit */}
                <div className="flex justify-end gap-3 mt-6">
                    <button
                        type="button"
                        className="flex items-center gap-2 px-5 py-2 bg-gray-100 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-200 transition"
                        onClick={() => router.push("/admin/testimonials")}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="flex items-center gap-2 px-5 py-2 bg-[#e94e4e] text-white rounded-lg shadow-md hover:bg-red-600 transition"
                    >
                        <CheckCircle size={18} className="text-white" />
                        Update
                    </button>
                </div>
            </form>
        </AdminLayout>
    );
}
