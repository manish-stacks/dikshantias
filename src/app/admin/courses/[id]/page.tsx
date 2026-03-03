"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminLayout from "@/component/admin/AdminLayout";
import ImageUpload from "@/component/admin/ImageUpload";
import { CheckCircle, Play, Palette } from "lucide-react";
import toast from "react-hot-toast";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";

const tailwindColors = [
  "bg-red-500",
  "bg-green-500",
  "bg-blue-500",
  "bg-indigo-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-yellow-500",
  "bg-gray-500",
  "bg-orange-500",
  "bg-teal-500",
  "bg-cyan-500",
  "bg-rose-500",
];

export default function CourseFormPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params?.id as string | undefined;

  const [showColorDropdown, setShowColorDropdown] = useState(false);

  // 📌 Basic Info
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [isSlugEdited, setIsSlugEdited] = useState(false);

  const [shortContent, setShortContent] = useState("");
  const [content, setContent] = useState("");
  const [active, setActive] = useState(true);

  // 📌 Basic Extra
  const [courseMode, setCourseMode] = useState("");
  const [lectures, setLectures] = useState<number | "">("");
  const [duration, setDuration] = useState("");
  const [languages, setLanguages] = useState("");
  const [displayOrder, setDisplayOrder] = useState<number | "">("");

  // 📌 Pricing
  const [originalPrice, setOriginalPrice] = useState<string | "">("");
  const [price, setPrice] = useState<string | "">("");
  const [totalFee, setTotalFee] = useState<string | "">("");
  const [oneTimeFee, setOneTimeFee] = useState<string | "">("");
  const [firstInstallment, setFirstInstallment] = useState<string | "">("");
  const [secondInstallment, setSecondInstallment] = useState<string | "">("");
  const [thirdInstallment, setThirdInstallment] = useState<string | "">("");
  const [fourthInstallment, setFourthInstallment] = useState<string | "">("");

  // Badge & Features
  const [badge, setBadge] = useState<string>("Limited Seats");
  const [badgeColor, setBadgeColor] = useState<string>("bg-indigo-500");
  const [featureInput, setFeatureInput] = useState<string>("");
  const [features, setFeatures] = useState<string[]>([]);

  // 📌 Media
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageAlt, setImageAlt] = useState("");
  const [imageUrl, setImageUrl] = useState(""); // ✅ keep existing image

  const [demoVideo, setDemoVideo] = useState("");
  const [videoInput, setVideoInput] = useState("");
  const [videos, setVideos] = useState<string[]>([]);

  // 📌 SEO
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [metaKeywords, setMetaKeywords] = useState<string[]>([]);
  const [metaKeywordInput, setMetaKeywordInput] = useState("");
  const [canonicalUrl, setCanonicalUrl] = useState("");
  const [ogTitle, setOgTitle] = useState("");
  const [ogDescription, setOgDescription] = useState("");
  const [index, setIndex] = useState(true);
  const [follow, setFollow] = useState(true);

  // States
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // 🔹 Fetch course if editing
  useEffect(() => {
    if (!courseId || courseId === "new") {
      setLoading(false);
      return;
    }

    const fetchCourse = async () => {
      try {
        const res = await fetch(`/api/admin/courses/${courseId}`);
        if (!res.ok) throw new Error("Failed to fetch course");
        const data = await res.json();

        //Pre-fill states
        setTitle(data.title);
        setSlug(data.slug);
        setShortContent(data.shortContent || "");
        setContent(data.content || "");
        setActive(data.active);

        // Badge & Features
        setBadge(data.badge || "Limited Seats");
        setBadgeColor(data.badgeColor || "bg-indigo-500");
        setFeatures(data.features || []);

        setCourseMode(data.courseMode || "");
        setLectures(data.lectures ?? "");
        setDuration(data.duration || "");
        setLanguages(data.languages || "");
        setDisplayOrder(data.displayOrder ?? "");

        setOriginalPrice(data.originalPrice ?? "");
        setPrice(data.price ?? "");
        setTotalFee(data.totalFee ?? "");
        setOneTimeFee(data.oneTimeFee ?? "");
        setFirstInstallment(data.firstInstallment ?? "");
        setSecondInstallment(data.secondInstallment ?? "");
        setThirdInstallment(data.thirdInstallment ?? "");
        setFourthInstallment(data.fourthInstallment ?? "");

        setImageUrl(data.image?.url || "");
        setImageAlt(data.image?.alt || "");

        setDemoVideo(data.demoVideo || "");
        setVideos(data.videos || []);

        setMetaTitle(data.metaTitle || "");
        setMetaDescription(data.metaDescription || "");
        setMetaKeywords(data.metaKeywords || []);
        setCanonicalUrl(data.canonicalUrl || "");
        setOgTitle(data.ogTitle || "");
        setOgDescription(data.ogDescription || "");
        setIndex(data.index);
        setFollow(data.follow);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load course");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  // 🔹 Auto slug from title
  useEffect(() => {
    if (!isSlugEdited) {
      if (title) {
        setSlug(
          title
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-"),
        );
      } else {
        setSlug(""); // clear slug if title is empty
      }
    }
  }, [title]);

  // Handle manual slug change
  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlug(e.target.value);
    setIsSlugEdited(true); // mark as manually edited
  };

  // 🔹 Helpers for videos
  const addVideo = () => {
    if (videoInput.trim()) {
      setVideos([...videos, videoInput.trim()]);
      setVideoInput("");
    }
  };

  const removeVideo = (index: number) => {
    setVideos(videos.filter((_, i) => i !== index));
  };

  // 🔹 Helpers for meta keywords
  const addMetaKeyword = () => {
    if (
      metaKeywordInput.trim() &&
      !metaKeywords.includes(metaKeywordInput.trim())
    ) {
      setMetaKeywords([...metaKeywords, metaKeywordInput.trim()]);
      setMetaKeywordInput("");
    }
  };

  const removeMetaKeyword = (keyword: string) => {
    setMetaKeywords(metaKeywords.filter((k) => k !== keyword));
  };

  // 🔹 Handle Update Only
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (!courseId) {
        toast.error("Course ID missing");
        setSubmitting(false);
        return;
      }

      const formData = new FormData();

      formData.append("title", title);
      formData.append("slug", slug);
      formData.append("shortContent", shortContent);
      formData.append("content", content);
      formData.append("active", JSON.stringify(active));
      formData.append("courseMode", courseMode);

      if (lectures !== "") formData.append("lectures", String(lectures));
      if (duration) formData.append("duration", duration);
      if (languages) formData.append("languages", languages);
      if (displayOrder !== "")
        formData.append("displayOrder", String(displayOrder));

      if (originalPrice !== "")
        formData.append("originalPrice", String(originalPrice));
      if (price !== "") formData.append("price", String(price));
      if (totalFee !== "") formData.append("totalFee", String(totalFee));
      if (oneTimeFee !== "") formData.append("oneTimeFee", String(oneTimeFee));
      if (firstInstallment !== "")
        formData.append("firstInstallment", String(firstInstallment));
      if (secondInstallment !== "")
        formData.append("secondInstallment", String(secondInstallment));
      if (thirdInstallment !== "")
        formData.append("thirdInstallment", String(thirdInstallment));
      if (fourthInstallment !== "")
        formData.append("fourthInstallment", String(fourthInstallment));

      if (badge) formData.append("badge", badge);
      if (badgeColor) formData.append("badgeColor", badgeColor);
      if (features.length > 0)
        formData.append("features", JSON.stringify(features));

      if (imageFile) {
        formData.append("image", imageFile);
        if (imageAlt) formData.append("imageAlt", imageAlt);
      }

      if (demoVideo) formData.append("demoVideo", demoVideo);
      if (videos.length > 0) {
        formData.append("videos", JSON.stringify(videos));
      }

      if (metaTitle) formData.append("metaTitle", metaTitle);
      if (metaDescription) formData.append("metaDescription", metaDescription);
      if (metaKeywords.length > 0) {
        formData.append("metaKeywords", JSON.stringify(metaKeywords));
      }
      if (canonicalUrl) formData.append("canonicalUrl", canonicalUrl);
      if (ogTitle) formData.append("ogTitle", ogTitle);
      if (ogDescription) formData.append("ogDescription", ogDescription);
      formData.append("index", JSON.stringify(index));
      formData.append("follow", JSON.stringify(follow));

      // ✅ Always update (PUT)
      const res = await fetch(`/api/admin/courses/${courseId}`, {
        method: "PUT",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to update course");

      toast.success("Course updated successfully");
      router.push("/admin/courses");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update course");
    } finally {
      setSubmitting(false);
    }
  };

  // Loading UI
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
            course is being update...
          </p>
        </div>
      </div>
    );
  }
  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Edit Course</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-xl"
      >
        {/* Basic Info */}
        <div>
          <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b border-gray-300-b pb-2">
            Course Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-gray-300  px-4 py-2.5 rounded-lg focus:ring-1 focus:ring-[#e94e4e] transition outline-none"
                required
              />
            </div>

            <div>
              <label className="block  font-medium text-gray-700 mb-1">
                Slug
              </label>
              <input
                type="text"
                value={slug}
                onChange={handleSlugChange}
                className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-1 focus:ring-[#e94e4e] transition outline-none"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-4">
            {/* Course Mode */}
            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Course Mode
              </label>
              <select
                value={courseMode}
                onChange={(e) => setCourseMode(e.target.value)}
                className="w-full border border-gray-300 px-4 py-2.5 rounded-lg appearance-none focus:ring-2 focus:ring-[#e94e4e]/40 focus:border-[#e94e4e] transition outline-none"
                required
              >
                <option value="">Select Mode</option>
                <option value="online">Online</option>
                <option value="offline">Offline</option>
                <option value="video">Video</option>
              </select>
            </div>

            {/* Lectures */}
            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Total No. of Hours
              </label>
              <input
                type="number"
                value={lectures}
                onChange={(e) =>
                  setLectures(e.target.value ? Number(e.target.value) : "")
                }
                placeholder="Number"
                className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-[#e94e4e]/40 focus:border-[#e94e4e] outline-none transition"
                required
              />
            </div>

            {/* Duration */}
            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Duration
              </label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g., 3 months"
                className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-[#e94e4e]/40 focus:border-[#e94e4e] outline-none transition"
                required
              />
            </div>

            {/* Languages */}
            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Languages
              </label>
              <input
                type="text"
                value={languages}
                onChange={(e) => setLanguages(e.target.value)}
                placeholder="e.g., English, Hindi"
                className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-[#e94e4e]/40 focus:border-[#e94e4e] outline-none transition"
                required
              />
            </div>

            {/* Display Order */}
            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Display Order
              </label>
              <input
                type="number"
                value={displayOrder}
                onChange={(e) =>
                  setDisplayOrder(e.target.value ? Number(e.target.value) : "")
                }
                placeholder="Order"
                className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-[#e94e4e]/40 focus:border-[#e94e4e] outline-none transition"
              />
            </div>
          </div>
          <div>
            <label className="block font-medium text-gray-700 mb-1 mt-4">
              Short Content
            </label>
            <textarea
              value={shortContent}
              onChange={(e) => setShortContent(e.target.value)}
              className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-1 focus:ring-[#e94e4e] transition outline-none"
              rows={3}
            />
          </div>
          <div>
            <label className="block font-medium text-gray-700 mb-1 mt-4">
              Full Content
            </label>
            <SimpleEditor value={content} onChange={setContent} />
          </div>
        </div>

        {/* Badge & Features */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b border-gray-300 pb-2">
            Badge & Features
          </h2>

          {/* Badge */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Badge Text
              </label>
              <input
                type="text"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                placeholder="Enter badge text"
                className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-1 focus:ring-[#e94e4e] transition outline-none"
              />
            </div>

            <div className="relative">
              <label className="block font-medium text-gray-700 mb-1">
                Badge Color (Tailwind class)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={badgeColor}
                  onChange={(e) => setBadgeColor(e.target.value)}
                  placeholder="e.g., bg-indigo-500"
                  className="flex-1 border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-1 focus:ring-[#e94e4e] transition outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowColorDropdown(!showColorDropdown)}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
                >
                  <Palette size={20} />
                </button>
              </div>

              {showColorDropdown && (
                <div className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {tailwindColors.map((color) => (
                    <div
                      key={color}
                      onClick={() => {
                        setBadgeColor(color);
                        setShowColorDropdown(false);
                      }}
                      className="cursor-pointer px-4 py-2 flex items-center gap-2 hover:bg-gray-100"
                    >
                      <span className={`w-6 h-6 rounded-full ${color}`}></span>
                      <span className="text-gray-700">{color}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Features */}
          <div>
            <label className="block font-medium text-gray-700 mb-2">
              Add Features
            </label>

            <div className="flex flex-wrap items-center gap-2 mb-3">
              <input
                type="text"
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                placeholder="Enter feature"
                className="flex-1 min-w-[180px] border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-1 focus:ring-[#e94e4e] transition outline-none"
              />
              <button
                type="button"
                onClick={() => {
                  if (featureInput.trim()) {
                    setFeatures([...features, featureInput.trim()]);
                    setFeatureInput("");
                  }
                }}
                className="flex items-center gap-2 px-4 py-3 bg-[#e94e4e] text-white rounded-lg shadow-md hover:bg-red-600 transition"
              >
                <CheckCircle size={18} className="text-white" /> Add
              </button>
            </div>

            {/* Features list */}
            <div className="flex flex-wrap gap-2">
              {features.map((f, idx) => (
                <span
                  key={idx}
                  className="bg-lime-100 px-3 py-1.5 rounded flex items-center gap-2 text-sm border border-gray-300"
                >
                  {f}
                  <button
                    type="button"
                    onClick={() =>
                      setFeatures(features.filter((_, i) => i !== idx))
                    }
                    className="text-red-500 font-bold hover:text-red-700 transition"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Image Upload */}
        <div>
          <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b border-gray-300-b pb-2">
            Course Image
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <ImageUpload
                onImageSelect={(file) => setImageFile(file)}
                isLoading={false}
                initialImage={imageUrl}
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

        {/* 📌 Pricing Details */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b border-gray-300 pb-2">
            Pricing Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Original Price */}
            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Original Price
              </label>
              <input
                type="number"
                placeholder="Enter original price"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 
                                         focus:ring-[#e94e4e]/40 focus:border-[#e94e4e] outline-none transition"
                required
              />
            </div>

            {/* Price */}
            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Price
              </label>
              <input
                type="number"
                placeholder="Enter price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 
                           focus:ring-[#e94e4e]/40 focus:border-[#e94e4e] outline-none transition"
                required
              />
            </div>

            {/* Total Fee */}
            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Total Fee
              </label>
              <input
                type="number"
                placeholder="Enter total fee"
                value={totalFee}
                onChange={(e) => setTotalFee(e.target.value)}
                className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 
                           focus:ring-[#e94e4e]/40 focus:border-[#e94e4e] outline-none transition"
              />
            </div>

            {/* One-Time Fee */}
            <div>
              <label className="block font-medium text-gray-700 mb-1">
                One-Time Fee
              </label>
              <input
                type="number"
                placeholder="Enter one-time fee"
                value={oneTimeFee}
                onChange={(e) => setOneTimeFee(e.target.value)}
                className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 
                                         focus:ring-[#e94e4e]/40 focus:border-[#e94e4e] outline-none transition"
              />
            </div>

            {/* First Installment */}
            <div>
              <label className="block font-medium text-gray-700 mb-1">
                First Installment
              </label>
              <input
                type="number"
                placeholder="Enter first installment"
                value={firstInstallment}
                onChange={(e) => setFirstInstallment(e.target.value)}
                className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 
                                          focus:ring-[#e94e4e]/40 focus:border-[#e94e4e] outline-none transition"
              />
            </div>

            {/* Second Installment */}
            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Second Installment
              </label>
              <input
                type="number"
                placeholder="Enter second installment"
                value={secondInstallment}
                onChange={(e) => setSecondInstallment(e.target.value)}
                className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 
                                         focus:ring-[#e94e4e]/40 focus:border-[#e94e4e] outline-none transition"
              />
            </div>

            {/* Third Installment */}
            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Third Installment
              </label>
              <input
                type="number"
                placeholder="Enter third installment"
                value={thirdInstallment}
                onChange={(e) => setThirdInstallment(e.target.value)}
                className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 
                                         focus:ring-[#e94e4e]/40 focus:border-[#e94e4e] outline-none transition"
              />
            </div>

            {/* Fourth Installment */}
            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Fourth Installment
              </label>
              <input
                type="number"
                placeholder="Enter fourth installment"
                value={fourthInstallment}
                onChange={(e) => setFourthInstallment(e.target.value)}
                className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 
                                         focus:ring-[#e94e4e]/40 focus:border-[#e94e4e] outline-none transition"
              />
            </div>
          </div>
        </div>

        {/* Course Videos */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b border-gray-300 pb-2">
            Course Videos
          </h2>

          {/* Inputs */}
          <div className="flex flex-wrap gap-3 items-end mb-4">
            <div className="flex-1 min-w-[200px]">
              <label className="block font-medium text-gray-700 mb-1">
                Demo Video URL
              </label>
              <input
                type="text"
                value={demoVideo}
                onChange={(e) => setDemoVideo(e.target.value)}
                placeholder="Demo video URL"
                className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-1 focus:ring-[#e94e4e] focus:border-[#e94e4e] transition outline-none"
              />
            </div>

            <div className="flex-1 min-w-[200px]">
              <label className="block font-medium text-gray-700 mb-1">
                Videos URL
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={videoInput}
                  onChange={(e) => setVideoInput(e.target.value)}
                  placeholder="Add video URL"
                  className="flex-1 border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-1 focus:ring-[#e94e4e] transition outline-none"
                />
                <button
                  type="button"
                  onClick={addVideo}
                  className="flex items-center gap-2 px-4 py-2 bg-[#e94e4e] text-white rounded-lg shadow-md hover:bg-red-600 transition"
                >
                  <CheckCircle size={18} className="text-white" />
                  Add
                </button>
              </div>
            </div>
          </div>
          {/* Video List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video, index) => {
              const videoIdMatch = video.match(
                /(?:youtube\.com\/.*v=|youtu\.be\/)([^&?/]+)/,
              );
              const videoId = videoIdMatch ? videoIdMatch[1] : null;
              const thumbnail = videoId
                ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
                : null;

              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition duration-300 relative flex flex-col group"
                >
                  {thumbnail ? (
                    <a
                      href={video}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full"
                    >
                      <div className="relative w-full pt-[56.25%] overflow-hidden">
                        <img
                          src={thumbnail}
                          alt="Video Thumbnail"
                          className="absolute top-0 left-0 w-full h-full object-cover transform group-hover:scale-105 transition duration-300"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-25 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center">
                          <Play size={32} className="text-white" />
                        </div>
                      </div>
                    </a>
                  ) : (
                    <div className="h-52 flex items-center justify-center text-gray-400 italic">
                      Invalid URL
                    </div>
                  )}
                  <div className="p-4 flex justify-between items-center border-t border-gray-200 bg-gray-50">
                    <a
                      href={video}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-gray-700 hover:text-white bg-red-100 hover:bg-[#e94e4e] px-3 py-1.5 rounded-lg transition duration-300 font-medium shadow-sm"
                    >
                      <Play size={18} />
                    </a>

                    <button
                      onClick={() => removeVideo(index)}
                      className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100 hover:bg-[#e94e4e] text-red-600 hover:text-white transition duration-300 shadow-sm font-bold text-lg"
                      title="Remove Video"
                    >
                      ×
                    </button>
                  </div>
                </div>
              );
            })}
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
        {/*  Visibility & Status */}
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
        {/* Submit */}
        <div className="flex justify-end gap-3 mt-6">
          {/* Cancel Button */}
          <button
            type="button"
            className="flex items-center gap-2 px-5 py-2 bg-gray-100 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-200 transition"
          >
            Cancel
          </button>

          {/* Save Button */}
          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2 bg-[#e94e4e] text-white rounded-lg shadow-md hover:bg-red-600 transition"
          >
            <CheckCircle size={18} className="text-white" />
            Save
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}
