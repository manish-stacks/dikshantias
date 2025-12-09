"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import AdminLayout from "@/component/admin/AdminLayout";
import ImageUpload from "@/component/admin/ImageUpload";
import { CheckCircle } from "lucide-react";
import toast from "react-hot-toast";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";

interface Category {
  _id: string;
  name: string;
  slug: string;
}

export default function EditBlogPage() {
  const router = useRouter();
const params = useParams<{ id: string }>();
const id = params ? (Array.isArray(params.id) ? params.id[0] : params.id) : null;


  const [loading, setLoading] = useState(true);

  // Blog fields

    // Titles
    const [titleEn, setTitleEn] = useState("");
    const [titleHi, setTitleHi] = useState("");




  const [slug, setSlug] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);
     // Short Content
    const [shortContentEn, setShortContentEn] = useState("");
    const [shortContentHi, setShortContentHi] = useState("");

        // Full Content
        const [contentEn, setContentEn] = useState("");
        const [contentHi, setContentHi] = useState("");

  const [categoryId, setCategoryId] = useState("");

    // Posted By
    const [postedByEn, setPostedByEn] = useState("");
    const [postedByHi, setPostedByHi] = useState("");


  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [active, setActive] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageAlt, setImageAlt] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  // SEO fields
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [metaKeywords, setMetaKeywords] = useState<string[]>([]);
  const [metaKeywordInput, setMetaKeywordInput] = useState("");
  const [canonicalUrl, setCanonicalUrl] = useState("");
  const [ogTitle, setOgTitle] = useState("");
  const [ogDescription, setOgDescription] = useState("");
  const [index, setIndex] = useState(true);
  const [follow, setFollow] = useState(true);

  const [categories, setCategories] = useState<Category[]>([]);

// Auto-generate slug from English title only if not manually edited
useEffect(() => {
  if (titleEn && !slugEdited) {
    setSlug(
      titleEn
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
    );
  }
}, [titleEn, slugEdited]);


  // Fetch categories
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/admin/blog-categories");
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch categories");
    }
  };

  // Fetch blog details
useEffect(() => {
  if (id) {
    fetchBlog();
  }
}, [id]);


const fetchBlog = async () => {
  if (!id) return;

  try {
    const res = await fetch(`/api/admin/blogs/${id}`);
    if (!res.ok) throw new Error("Failed to fetch blog");
    const data = await res.json();
    const blog = data.blog || data;

    console.log(blog); // check API response

    setTitleEn(blog.title?.en || "");
    setTitleHi(blog.title?.hi || "");
    setSlug(blog.slug || "");
    setShortContentEn(blog.shortContent?.en || "");
    setShortContentHi(blog.shortContent?.hi || "");
    setContentEn(blog.content?.en || "");
    setContentHi(blog.content?.hi || "");
    setCategoryId(blog.category?._id || "");
    setPostedByEn(blog.postedBy?.en || "");
    setPostedByHi(blog.postedBy?.hi || "");
    setTags(blog.tags || []);
    setActive(blog.active ?? true);
    setImageUrl(blog.image?.url || "");
    setImageAlt(blog.image?.alt || "");
    setMetaTitle(blog.metaTitle || "");
    setMetaDescription(blog.metaDescription || "");
    setMetaKeywords(blog.metaKeywords || []);
    setCanonicalUrl(blog.canonicalUrl || "");
    setOgTitle(blog.ogTitle || "");
    setOgDescription(blog.ogDescription || "");
    setIndex(blog.index ?? true);
    setFollow(blog.follow ?? true);

  } catch (err) {
    console.error(err);
    toast.error("Failed to load blog");
  } finally {
    setLoading(false);
  }
};




const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!id) {
    toast.error("Blog ID is missing");
    return;
  }

  try {
    const formData = new FormData();
    // Titles
    formData.append("titleEn", titleEn || "");
    formData.append("titleHi", titleHi || "");

    // Slug
    formData.append("slug", slug || "");

    // Content
    formData.append("shortContentEn", shortContentEn || "");
    formData.append("shortContentHi", shortContentHi || "");
    formData.append("contentEn", contentEn || "");
    formData.append("contentHi", contentHi || "");

    // Category & Posted By
    formData.append("category", categoryId || "");
    formData.append("postedByEn", postedByEn || "");
    formData.append("postedByHi", postedByHi || "");

    // Status
    formData.append("active", JSON.stringify(active));
    formData.append("tags", JSON.stringify(tags));

    // Image
    if (imageFile) {
      formData.append("image", imageFile);
      formData.append("imageAlt", imageAlt || "");
    }

    // SEO
    formData.append("metaTitle", metaTitle || "");
    formData.append("metaDescription", metaDescription || "");
    formData.append("metaKeywords", JSON.stringify(metaKeywords));
    formData.append("canonicalUrl", canonicalUrl || "");
    formData.append("ogTitle", ogTitle || "");
    formData.append("ogDescription", ogDescription || "");
    formData.append("index", JSON.stringify(index));
    formData.append("follow", JSON.stringify(follow));

    const res = await fetch(`/api/admin/blogs/${id}`, {
      method: "PUT",
      body: formData,
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to update blog");
    }

    toast.success("Blog updated successfully");
    router.push("/admin/blogs");
  } catch (err) {
    console.error(err);
    toast.error(err.message || "Failed to update blog");
  }
};

  // Tag helpers
  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };
  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  // Meta keywords helpers
  const addMetaKeyword = () => {
    if (metaKeywordInput.trim() && !metaKeywords.includes(metaKeywordInput.trim())) {
      setMetaKeywords([...metaKeywords, metaKeywordInput.trim()]);
      setMetaKeywordInput("");
    }
  };
  const removeMetaKeyword = (keyword: string) => {
    setMetaKeywords(metaKeywords.filter((k) => k !== keyword));
  };

  if (loading) return <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="flex flex-col items-center">
          <div className="relative flex space-x-3 mb-4">
            <div className="w-5 h-5 bg-[#e94e4e] rounded-full animate-bounce"></div>
            <div className="w-5 h-5 bg-[#f97316] rounded-full animate-bounce delay-150"></div>
            <div className="w-5 h-5 bg-[#facc15] rounded-full animate-bounce delay-300"></div>
          </div>
          <p className="text-gray-700 font-semibold text-lg">Loading...</p>
        </div>
      </div>;

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Edit Blog</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-xl max-w-6xl mx-auto space-y-8"
      >
              {/* Basic Info */}
                <div>
                    <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b border-gray-300-b pb-2">
                        Basic Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        

                         {/* Title English */}
                            <div>
                            <label className="block font-medium text-gray-700 mb-1">
                                Title (English)
                            </label>
                            <input
                                type="text"
                                value={titleEn}
                                onChange={(e) => setTitleEn(e.target.value)}
                                className="w-full border border-gray-300 px-4 py-2.5 rounded-lg"
                                required
                            />
                            </div>
                            {/* Title Hindi */}
                            <div>
                            <label className="block font-medium text-gray-700 mb-1">
                                Title (Hindi)
                            </label>
                            <input
                                type="text"
                                value={titleHi}
                                onChange={(e) => setTitleHi(e.target.value)}
                                className="w-full border border-gray-300 px-4 py-2.5 rounded-lg"
                            />
                            </div>

                        <div>
                            <label className="block  font-medium text-gray-700 mb-1">
                                Slug
                            </label>
                            <input
                                type="text"
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                                className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-1 focus:ring-[#e94e4e] transition outline-none"
                                required
                            />
                        </div>
                        <div className="w-full">
                        <label className="block font-medium text-gray-700 mb-1">
                            Category
                        </label>

                        <div className="relative">
                            <select
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                            className="w-full border border-gray-300 px-4 py-2.5 pr-10 rounded-lg appearance-none focus:ring-2 focus:ring-[#e94e4e]/40 focus:border-[#e94e4e] transition outline-none"
                            required
                            >
                            <option value="">Select Category</option>
                            {categories.map((cat) => (
                                <option key={cat._id} value={cat._id}>
                                {cat.name}
                                </option>
                            ))}
                            </select>

                            {/* Custom dropdown arrow */}
                            <svg
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                        </div>

                       {/* Posted By */}
                        <div>
                        <label className="block font-medium text-gray-700 mb-1">Posted By (English)</label>
                        <input
                            type="text"
                            value={postedByEn}
                            onChange={(e) => setPostedByEn(e.target.value)}
                            className="w-full border border-gray-300 px-4 py-2.5 rounded-lg"
                        />
                        </div>
                        <div>
                        <label className="block font-medium text-gray-700 mb-1">Posted By (Hindi)</label>
                        <input
                            type="text"
                            value={postedByHi}
                            onChange={(e) => setPostedByHi(e.target.value)}
                            className="w-full border border-gray-300 px-4 py-2.5 rounded-lg"
                        />
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                    <div>
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Content</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Short Content */}
                        <div>
                        <label className="block font-medium text-gray-700 mb-1">Short Content (English)</label>
                        <textarea
                            value={shortContentEn}
                            onChange={(e) => setShortContentEn(e.target.value)}
                            className="w-full border border-gray-300 px-4 py-2.5 rounded-lg"
                            rows={3}
                        />
                        </div>
                        <div>
                        <label className="block font-medium text-gray-700 mb-1">Short Content (Hindi)</label>
                        <textarea
                            value={shortContentHi}
                            onChange={(e) => setShortContentHi(e.target.value)}
                            className="w-full border border-gray-300 px-4 py-2.5 rounded-lg"
                            rows={3}
                        />
                        </div>
                    </div>

                    {/* Full Content */}
                    <div className="grid grid-cols-1 gap-6 mt-4">
                        <div>
                        <label className="block font-medium text-gray-700 mb-1">Full Content (English)</label>
                        <SimpleEditor value={contentEn} onChange={setContentEn} />
                        </div>
                        <div>
                        <label className="block font-medium text-gray-700 mb-1">Full Content (Hindi)</label>
                        <SimpleEditor value={contentHi} onChange={setContentHi} />
                        </div>
                    </div>
                    </div>


                {/* Tags */}
                <div>
                    <h2 className="block font-medium text-gray-700 mb-1  pb-2">
                        Tags
                    </h2>
                    <div className="flex gap-3 mb-3">
                        <input
                            type="text"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            className="border border-gray-300 px-4 py-2.5 rounded-lg flex-1 focus:ring-1 focus:ring-[#e94e4e] transition outline-none"
                            placeholder="Add tag"
                        />

                        <button
                            type="button"
                            onClick={addTag}
                            className="flex items-center gap-2 px-5 py-2 bg-[#e94e4e] text-white rounded-lg shadow-md hover:bg-red-600 transition"
                        >
                            <CheckCircle size={18} className="text-white" />
                            Add
                        </button>

                    </div>
                    <div className="flex flex-wrap gap-2">
                        {tags.map((tag) => (
                            <span
                                key={tag}
                                className="bg-lime-100 px-3 py-1.5 rounded flex items-center gap-2 text-smborder border-gray-300"
                            >
                                {tag}
                                <button
                                    type="button"
                                    onClick={() => removeTag(tag)}
                                    className="text-red-500 font-bold hover:text-red-700"
                                >
                                    ×
                                </button>
                            </span>
                        ))}
                    </div>
                </div>

                {/* Image Upload */}
                <div>
                    <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b border-gray-300-b pb-2">
                        Image
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                           <ImageUpload
                                onImageSelect={(file) => setImageFile(file)}
                                isLoading={false}
                                initialImage={imageUrl}
                                />
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


                {/* SEO / Meta Fields */}
                <div>
                    <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b border-gray-300 pb-2">
                        Visibility & Status
                    </h2>

                    <div className="flex items-center gap-10">
                        {/* Index Toggle */}
                        <div className="flex items-center gap-3">
                            <span className="text-gray-700 font-medium">Index</span>
                            <button
                                type="button"
                                onClick={() => setIndex(!index)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition
                                    ${index ? "bg-[#00C950]" : "bg-gray-300"}`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition
                                    ${index ? "translate-x-6" : "translate-x-1"}`}
                                />
                            </button>
                        </div>

                        {/* Follow Toggle */}
                        <div className="flex items-center gap-3">
                            <span className="text-gray-700 font-medium">Follow</span>
                            <button
                                type="button"
                                onClick={() => setFollow(!follow)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition
                            ${follow ? "bg-[#00C950]" : "bg-gray-300"}`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition
                                ${follow ? "translate-x-6" : "translate-x-1"}`}
                                />
                            </button>
                        </div>

                        {/* Active Toggle */}
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


        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={() => router.push("/admin/blogs")}
            className="flex items-center gap-2 px-5 py-2 bg-gray-100 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-200 transition"
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
