"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/component/admin/AdminLayout";
import ImageUpload from "@/component/admin/ImageUpload";
import { CheckCircle, PlusCircle } from "lucide-react";
import toast from "react-hot-toast";
// import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import JoditEditor from "jodit-react";
import { useRef } from "react";

interface Category {
  _id: string;
  name: string;
  slug: string;
}

interface SubCategory {
  _id: string;
  name: string;
  slug: string;
  category: Category;
}

export default function AddCurrentAffairsPage() {
    const editor = useRef(null);
  const router = useRouter();

  // 📌 Basic Info (Bilingual)
  const [title, setTitle] = useState({ en: "", hi: "" });
  const [slug, setSlug] = useState("");
  const [shortContent, setShortContent] = useState({ en: "", hi: "" });
  const [content, setContent] = useState({ en: "", hi: "" });
  const [active, setActive] = useState(true);
  const [affairDate, setAffairDate] = useState("");

  // 📌 Category & Sub Category
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");

  // 📌 SEO Fields
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [metaKeywords, setMetaKeywords] = useState<string[]>([]);
  const [metaKeywordInput, setMetaKeywordInput] = useState("");
  const [canonicalUrl, setCanonicalUrl] = useState("");
  const [ogTitle, setOgTitle] = useState("");
  const [ogDescription, setOgDescription] = useState("");

  const [faq, setFaq] = useState([
    {
      question: { en: "", hi: "" },
      answer: { en: "", hi: "" },
    },
  ]);

  // 📌 Media
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageAlt, setImageAlt] = useState("");

  // Loading / Submitting
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);


const addFaq = () => {
  setFaq([
    ...faq,
    {
      question: { en: "", hi: "" },
      answer: { en: "", hi: "" },
    },
  ]);
};

const removeFaq = (index: number) => {
  const updated = [...faq];

  updated.splice(index, 1);

  setFaq(updated);
};

const updateFaq = (
  index: number,
  field: "question" | "answer",
  lang: "en" | "hi",
  value: string,
) => {
  const updated = [...faq];

  updated[index][field][lang] = value;

  setFaq(updated);
};


  // Add keyword
  const addMetaKeyword = () => {
    const keyword = metaKeywordInput.trim();

    if (!keyword) return;

    if (!metaKeywords.includes(keyword)) {
      setMetaKeywords([...metaKeywords, keyword]);
    }

    setMetaKeywordInput("");
  };

  // Remove keyword
  const removeMetaKeyword = (keyword: string) => {
    setMetaKeywords(metaKeywords.filter((k) => k !== keyword));
  };

  // Auto-generate slug from English title
  useEffect(() => {
    if (title.en) {
      setSlug(
        title.en
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-"),
      );
    } else {
      setSlug("");
    }
  }, [title.en]);

  // Fetch categories & subcategories
  useEffect(() => {
    async function fetchData() {
      try {
        const catRes = await fetch("/api/admin/blog-categories");
        const cats = await catRes.json();
        setCategories(cats);

        const subRes = await fetch("/api/admin/sub-categories");
        const subs = await subRes.json();
        setSubCategories(subs);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Filter subcategories based on selected category
  const filteredSubCategories = subCategories.filter(
    (sub) => sub.category._id === category,
  );

  // Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const formData = new FormData();

      // Bilingual fields (as JSON strings)
      formData.append("title", JSON.stringify(title));
      formData.append("shortContent", JSON.stringify(shortContent));
      formData.append("content", JSON.stringify(content));

      // Other fields
      formData.append("slug", slug);
      formData.append("category", category);
      if (subCategory) formData.append("subCategory", subCategory);

      formData.append("active", active ? "true" : "false");

      // Ensure affairDate is a Date object before calling toISOString
      if (affairDate) {
        const dateObj =
          affairDate instanceof Date ? affairDate : new Date(affairDate);
        formData.append("affairDate", dateObj.toISOString());
      }

      // Optional image
      if (imageFile) {
        formData.append("image", imageFile);
        if (imageAlt) formData.append("imageAlt", imageAlt);
      }
      // SEO Fields
      if (metaTitle) formData.append("metaTitle", metaTitle);
      if (metaDescription) formData.append("metaDescription", metaDescription);
      if (canonicalUrl) formData.append("canonicalUrl", canonicalUrl);
      if (ogTitle) formData.append("ogTitle", ogTitle);
      if (ogDescription) formData.append("ogDescription", ogDescription);

      /* ADD THIS */
      if (faq.length > 0) {
        formData.append("faq", JSON.stringify(faq));
      }

      if (metaKeywords.length > 0) {
        formData.append("metaKeywords", JSON.stringify(metaKeywords));
      }

      const res = await fetch("/api/admin/current-affairs", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to create Current Affair");

      toast.success("Current Affair added successfully");
      router.push("/admin/current-affairs");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add Current Affair");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (submitting) return <p>Submitting...</p>;

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Add Current Affair
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-xl max-w-6xl mx-auto space-y-8"
      >
        {/* Basic Info */}
        <div>
          <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b border-gray-300 pb-2">
            Basic Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title EN */}
            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Title (English)
              </label>
              <input
                type="text"
                value={title.en}
                onChange={(e) => setTitle({ ...title, en: e.target.value })}
                className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-1 focus:ring-[#e94e4e] transition outline-none"
                required
              />
            </div>

            {/* Title HI */}
            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Title (Hindi)
              </label>
              <input
                type="text"
                value={title.hi}
                onChange={(e) => setTitle({ ...title, hi: e.target.value })}
                className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-1 focus:ring-[#e94e4e] transition outline-none"
                required
              />
            </div>
          </div>

          {/* Slug */}
          <div className="mt-4">
            <label className="block font-medium text-gray-700 mb-1">Slug</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-1 focus:ring-[#e94e4e] transition outline-none"
              required
            />
          </div>
          {/* Category, Subcategory, Date */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-3">
            {/* Category */}
            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setSubCategory(""); // reset subcategory
                }}
                className="w-full border border-gray-300 px-4 py-2.5 rounded-lg appearance-none focus:ring-2 focus:ring-[#e94e4e]/40 focus:border-[#e94e4e] transition outline-none"
                required
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sub Category */}
            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Sub Category
              </label>
              <select
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value)}
                className="w-full border border-gray-300 px-4 py-2.5 rounded-lg appearance-none focus:ring-2 focus:ring-[#e94e4e]/40 focus:border-[#e94e4e] transition outline-none"
                required
                disabled={!category}
              >
                <option value="">Select Sub Category</option>
                {filteredSubCategories.map((sub) => (
                  <option key={sub._id} value={sub._id}>
                    {sub.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Picker */}
            <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={affairDate}
                  onChange={(e) => setAffairDate(e.target.value)}
                  className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-1 focus:ring-[#e94e4e] transition outline-none"
                  required
                />
              </div>
            </div>
          </div>

          {/* Short Content EN / HI */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Short Content (English)
              </label>
              <textarea
                value={shortContent.en}
                onChange={(e) =>
                  setShortContent({ ...shortContent, en: e.target.value })
                }
                className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-1 focus:ring-[#e94e4e] transition outline-none"
                rows={3}
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Short Content (Hindi)
              </label>
              <textarea
                value={shortContent.hi}
                onChange={(e) =>
                  setShortContent({ ...shortContent, hi: e.target.value })
                }
                className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-1 focus:ring-[#e94e4e] transition outline-none"
                rows={3}
              />
            </div>
          </div>

          {/* Full Content EN / HI */}
          <div className="mt-4 grid grid-cols-1  gap-6">
            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Full Content (English)
              </label>
              <JoditEditor
                ref={editor}
                value={content.en}
                onChange={(newContent) =>
                  setContent({ ...content, en: newContent })
                }
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Full Content (Hindi)
              </label>
              <JoditEditor
                value={content.hi}
                onChange={(newContent) =>
                  setContent({ ...content, hi: newContent })
                }
              />
            </div>
          </div>
        </div>

        {/* SEO / Meta Fields */}
        <div>
          <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b border-gray-300-b pb-2">
            SEO / Meta Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-medium text-gray-700 mb-2">
                Meta Title
              </label>
              <input
                type="text"
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-1 focus:ring-[#e94e4e] transition outline-none"
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Canonical URL
              </label>
              <input
                type="text"
                value={canonicalUrl}
                onChange={(e) => setCanonicalUrl(e.target.value)}
                className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-1 focus:ring-[#e94e4e] transition outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1 mt-2">
              Meta Description
            </label>
            <textarea
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-1 focus:ring-[#e94e4e] transition outline-none "
              rows={2}
            />
          </div>

          {/* Meta Keywords */}
          <div className="mt-2">
            <label className="block font-medium text-gray-700 mb-1">
              Meta Keywords
            </label>
            <div className="flex gap-3 mb-3">
              <input
                type="text"
                value={metaKeywordInput}
                onChange={(e) => setMetaKeywordInput(e.target.value)}
                className="border border-gray-300 px-4 py-2.5 rounded-lg flex-1 focus:ring-1 focus:ring-[#e94e4e] transition outline-none"
                placeholder="Add keyword"
              />

              <button
                type="button"
                onClick={addMetaKeyword}
                className="flex items-center gap-2 px-5 py-2 bg-[#e94e4e] text-white rounded-lg shadow-md hover:bg-red-600 transition"
              >
                <CheckCircle size={18} className="text-white" />
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {metaKeywords.map((k) => (
                <span
                  key={k}
                  className="bg-lime-100 px-3 py-1.5 rounded flex items-center gap-2 text-smborder border-gray-300"
                >
                  {k}
                  <button
                    type="button"
                    onClick={() => removeMetaKeyword(k)}
                    className="text-red-500 font-bold hover:text-red-700"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* OG Fields */}
          <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mt-2">
            <div>
              <label className="block font-medium text-gray-700 mb-1">
                OG Title
              </label>
              <input
                type="text"
                value={ogTitle}
                onChange={(e) => setOgTitle(e.target.value)}
                className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-1 focus:ring-[#e94e4e] transition outline-none"
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-1">
                OG Description
              </label>
              <textarea
                value={ogDescription}
                onChange={(e) => setOgDescription(e.target.value)}
                className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-1 focus:ring-[#e94e4e] transition outline-none"
                rows={2}
              />
            </div>
          </div>
        </div>

        {/* Image Upload */}
        <div>
          <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b border-gray-300 pb-2">
            Image
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <ImageUpload
                onImageSelect={(file) => setImageFile(file)}
                isLoading={false}
              />
              <span className="text-gray-400 text-xs mt-1 block">
                Recommended size: <strong>500px × 300px</strong>
              </span>
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Image Alt Text
              </label>
              <input
                type="text"
                value={imageAlt}
                onChange={(e) => setImageAlt(e.target.value)}
                className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-1 focus:ring-[#e94e4e] transition outline-none"
              />
            </div>
          </div>
        </div>

        {/* FAQ Section */}

        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
            Frequently Asked Questions (FAQ)
          </h2>

          <div className="space-y-6">
            {faq.map((item, index) => (
              <div
                key={index}
                className="
                  bg-white
                  border
                  border-gray-200
                  rounded-2xl
                  shadow-sm
                  overflow-hidden
                  "
              >
                {/* header */}

                <div
                  className="
                    flex
                    justify-between
                    items-center
                    px-5
                    py-3
                    bg-gradient-to-r
                    from-indigo-50
                    to-blue-50
                    border-b
                    "
                >
                  <h3 className="text-sm font-semibold text-dark-700">
                    FAQ {index + 1}
                  </h3>

                  {faq.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeFaq(index)}
                      className="
                        text-xs
                        text-red-500
                        hover:text-red-600
                        font-medium
                        "
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="p-5 space-y-5">
                  {/* Question */}

                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">
                      Question
                    </h4>

                    <div className="grid md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Question (English)"
                        value={item.question.en}
                        onChange={(e) =>
                          updateFaq(index, "question", "en", e.target.value)
                        }
                        className="
                          w-full
                          border
                          border-gray-300
                          px-3 py-2
                          rounded-lg
                          focus:ring-1
                          focus:ring-indigo-500
                          "
                      />

                      <input
                        type="text"
                        placeholder="प्रश्न (Hindi)"
                        value={item.question.hi}
                        onChange={(e) =>
                          updateFaq(index, "question", "hi", e.target.value)
                        }
                        className="
                            w-full
                            border
                            border-gray-300
                            px-3 py-2
                            rounded-lg
                            focus:ring-1
                            focus:ring-indigo-500
                            "
                      />
                    </div>
                  </div>

                  {/* Answer */}

                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">
                      Answer
                    </h4>

                    <div className="grid md:grid-cols-2 gap-4">
                      <textarea
                        rows={3}
                        placeholder="Answer (English)"
                        value={item.answer.en}
                        onChange={(e) =>
                          updateFaq(index, "answer", "en", e.target.value)
                        }
                        className="
                        w-full
                        border
                        border-gray-300
                        px-3 py-2
                        rounded-lg
                        focus:ring-1
                        focus:ring-indigo-500
                        "
                      />

                      <textarea
                        rows={3}
                        placeholder="उत्तर (Hindi)"
                        value={item.answer.hi}
                        onChange={(e) =>
                          updateFaq(index, "answer", "hi", e.target.value)
                        }
                        className="
                        w-full
                        border
                        border-gray-300
                        px-3 py-2
                        rounded-lg
                        focus:ring-1
                        focus:ring-indigo-500
                        "
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* add button */}

            <div className="pt-2">
              <button
                type="button"
                onClick={addFaq}
                className="
                    flex
                    items-center
                    gap-2
                    px-5
                    py-2
                    text-sm
                    font-medium
                    bg-[#e94e4e]
                    text-white
                    rounded-lg
                    shadow-md
                    hover:bg-red-600
                    transition
                    "
              >
                <PlusCircle size={18} /> Add FAQ
              </button>
            </div>
          </div>
        </div>

        {/* Status */}

        <div>
          <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b border-gray-300 pb-2">
            Status
          </h2>
          <div className="flex items-center gap-10">
            <div className="flex items-center gap-3">
              <span className="text-gray-700 font-medium">Active</span>
              <button
                type="button"
                onClick={() => setActive(!active)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition
              ${active ? "bg-green-500" : "bg-gray-300"}`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition
                  ${active ? "translate-x-6" : "translate-x-1"}`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={() => router.push("/admin/current-affairs")}
            className="flex items-center gap-2 px-5 py-2 bg-gray-100 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-200 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2 bg-[#e94e4e] text-white rounded-lg shadow-md hover:bg-red-600 transition"
          >
            <CheckCircle size={18} className="text-white" /> Save
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}
