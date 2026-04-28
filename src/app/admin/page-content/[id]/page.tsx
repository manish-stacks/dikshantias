"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminLayout from "@/component/admin/AdminLayout";
import toast from "react-hot-toast";
import JoditEditor from "jodit-react";
import { CheckCircle } from "lucide-react";

const pageOptions: any = {
  UPSC: [
    { label: "About UPSC (CSE)", value: "About" },
    { label: "UPSC Syllabus", value: "Syllabus" },
    { label: "UPSC PYQ (Pre + Mains)", value: "PYQ" },
  ],

  UPPSC: [
    { label: "About UPPSC", value: "About" },
    { label: "UPPSC Syllabus", value: "Syllabus" },
    { label: "UPPSC PYQ (Pre + Mains)", value: "PYQ" },
  ],

  BPSC: [
    { label: "About BPSC", value: "About" },
    { label: "BPSC Syllabus", value: "Syllabus" },
    { label: "BPSC PYQ (Pre + Mains)", value: "PYQ" },
  ],
  "Dikshant Special": [
    { label: "Kurukshetra", value: "kurukshetra" },
    { label: "Down to Earth", value: "down-to-earth" },
    { label: "Economic Survey", value: "economic-survey" },
    { label: "NCERT (6th–12th)", value: "ncert" },
    { label: "Government Schemes", value: "government-schemes" },
    { label: "Important Institutions", value: "important-institutions" },
    { label: "Free Study Material", value: "free-study-material" },
  ],
  Videos: [
    { label: "Full Story by Dr. S.S. Panday", value: "full-story" },
    { label: "Current Affairs", value: "current-affairs" },
    { label: "Current Insights", value: "current-insights" },
  ],
};

function convertToEmbed(url: string) {
  if (!url) return "";

  // already embed
  if (url.includes("youtube.com/embed")) return url;

  // watch?v=
  if (url.includes("watch?v=")) {
    const id = url.split("v=")[1]?.split("&")[0];
    return `https://www.youtube.com/embed/${id}`;
  }

  // youtu.be
  if (url.includes("youtu.be/")) {
    const id = url.split("youtu.be/")[1];
    return `https://www.youtube.com/embed/${id}`;
  }

  return url;
}

export default function EditPageContent() {
  const { id } = useParams();

  const router = useRouter();

  const editor = useRef(null);

  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await fetch("/api/admin/page-content");

    const data = await res.json();

    const page = data.find((d: any) => d._id === id);

    setForm(page);

    setLoading(false);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("exam", form.exam);

    formData.append("page", form.page);

    formData.append("status", String(form.status));

    formData.append(
      "en",

      JSON.stringify({
        title: form.en.title,
        shortContent: form.en.shortContent || "",
        content: form.en.content,
        videoUrl: form.en.videoUrl || "",
      }),
    );

    formData.append(
      "hi",

      JSON.stringify({
        title: form.hi.title,
        shortContent: form.hi.shortContent || "",
        content: form.hi.content,
        videoUrl: form.hi.videoUrl || "",
      }),
    );

    if (form.en.pdf instanceof File) {
      formData.append("en_pdf", form.en.pdf);
    }

    if (form.hi.pdf instanceof File) {
      formData.append("hi_pdf", form.hi.pdf);
    }

    const res = await fetch(
      "/api/admin/page-content",

      {
        method: "POST",

        body: formData,
      },
    );

    if (!res.ok) {
      toast.error("Update failed");

      return;
    }

    toast.success(`${form.exam} ${form.page} updated successfully`);

    router.push("/admin/page-content");
  };

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

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-6">Edit Page Content</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-xl max-w-7xl mx-auto space-y-8"
      >
        {/* BASIC */}

        <div>
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">
            Basic Info
          </h2>

          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="font-medium">Exam</label>

              <select
                value={form.exam}
                disabled
                className="w-full border p-2 rounded-lg bg-gray-100"
              >
                <option>{form.exam}</option>
              </select>
            </div>

            <div>
              <label className="font-medium">Page</label>

              <select
                value={form.page}
                disabled
                className="w-full border p-2 rounded-lg bg-gray-100"
              >
                {pageOptions[form.exam]?.map((p: any) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-medium">Title (English)</label>

              <input
                value={form.en.title}
                onChange={(e) =>
                  setForm({
                    ...form,

                    en: {
                      ...form.en,
                      title: e.target.value,
                    },
                  })
                }
                className="w-full border p-2 rounded-lg"
              />
            </div>

            <div>
              <label className="font-medium">Title (Hindi)</label>

              <input
                value={form.hi.title}
                onChange={(e) =>
                  setForm({
                    ...form,

                    hi: {
                      ...form.hi,

                      title: e.target.value,
                    },
                  })
                }
                className="w-full border p-2 rounded-lg"
              />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            {/* short content en */}

            <div className=" mt-3">
              <label className="font-medium">Short Content (English)</label>

              <textarea
                value={form.en.shortContent}
                onChange={(e) =>
                  setForm({
                    ...form,

                    en: {
                      ...form.en,
                      shortContent: e.target.value,
                    },
                  })
                }
                rows={3}
                className="w-full border p-2 rounded-lg"
              />
            </div>

            {/* short content hi */}

            <div className=" mt-3">
              <label className="font-medium">Short Content (Hindi)</label>

              <textarea
                value={form.hi.shortContent}
                onChange={(e) =>
                  setForm({
                    ...form,

                    hi: {
                      ...form.hi,
                      shortContent: e.target.value,
                    },
                  })
                }
                rows={3}
                className="w-full border p-2 rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* CONTENT */}

        <div>
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">Content</h2>

          <div className="space-y-6">
            <div>
              <label className="font-medium">Content (English)</label>

              <JoditEditor
                ref={editor}
                value={form.en.content}
                onChange={(val) =>
                  setForm({
                    ...form,

                    en: {
                      ...form.en,
                      content: val,
                    },
                  })
                }
              />
            </div>

            <div>
              <label className="font-medium">Content (Hindi)</label>

              <JoditEditor
                value={form.hi.content}
                onChange={(val) =>
                  setForm({
                    ...form,

                    hi: {
                      ...form.hi,
                      content: val,
                    },
                  })
                }
              />
            </div>
          </div>
        </div>

        {/* PDF */}

        <div>
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">PDF</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="font-medium">English PDF</label>

              {/* show saved pdf */}
              {form.en?.pdf?.url && !(form.en.pdf instanceof File) && (
                <div className="mb-2">
                  <a
                    href={form.en.pdf.url}
                    target="_blank"
                    className="text-blue-600 text-sm underline"
                  >
                    View PDF
                  </a>
                </div>
              )}

              {/* show selected new pdf */}
              {form.en?.pdf instanceof File && (
                <div className="mb-2 text-green-600 text-sm">
                  Selected: {form.en.pdf.name}
                  <a
                    href={URL.createObjectURL(form.en.pdf)}
                    target="_blank"
                    className="ml-2 underline"
                  >
                    Preview
                  </a>
                </div>
              )}

              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => {
                  const file = e.target.files?.[0];

                  if (file) {
                    setForm({
                      ...form,

                      en: {
                        ...form.en,
                        pdf: file,
                      },
                    });
                  }
                }}
                className="w-full border p-2 rounded-lg"
              />
            </div>

            <div>
              <label className="font-medium">Hindi PDF</label>

              {form.hi?.pdf?.url && !(form.hi.pdf instanceof File) && (
                <div className="mb-2">
                  <a
                    href={form.hi.pdf.url}
                    target="_blank"
                    className="text-blue-600 text-sm underline"
                  >
                    View PDF
                  </a>
                </div>
              )}

              {form.hi?.pdf instanceof File && (
                <div className="mb-2 text-green-600 text-sm">
                  Selected: {form.hi.pdf.name}
                  <a
                    href={URL.createObjectURL(form.hi.pdf)}
                    target="_blank"
                    className="ml-2 underline"
                  >
                    Preview
                  </a>
                </div>
              )}

              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => {
                  const file = e.target.files?.[0];

                  if (file) {
                    setForm({
                      ...form,

                      hi: {
                        ...form.hi,
                        pdf: file,
                      },
                    });
                  }
                }}
                className="w-full border p-2 rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* VIDEO URL */}
        <div>
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">
            YouTube Video
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* English Video */}
            <div>
              <label className="font-medium">English Video</label>

              <input
                type="text"
                placeholder="https://www.youtube.com/embed/..."
                value={form.en.videoUrl || ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    en: {
                      ...form.en,
                      videoUrl: convertToEmbed(e.target.value),
                    },
                  })
                }
                className="w-full border p-2 rounded-lg"
              />

              {/* preview */}
              {form.en.videoUrl && (
                <iframe
                  src={form.en.videoUrl}
                  className="mt-2 w-full h-40 rounded-lg"
                />
              )}
            </div>

            {/* Hindi Video */}
            <div>
              <label className="font-medium">Hindi Video</label>

              <input
                type="text"
                placeholder="https://www.youtube.com/embed/..."
                value={form.hi.videoUrl || ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    hi: {
                      ...form.hi,
                      videoUrl: convertToEmbed(e.target.value),
                    },
                  })
                }
                className="w-full border p-2 rounded-lg"
              />

              {/* preview */}
              {form.hi.videoUrl && (
                <iframe
                  src={form.hi.videoUrl}
                  className="mt-2 w-full h-40 rounded-lg"
                />
              )}
            </div>
          </div>
        </div>
        {/* STATUS */}

        <div>
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">Status</h2>

          <button
            type="button"
            onClick={() =>
              setForm({
                ...form,

                status: !form.status,
              })
            }
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition

${form.status ? "bg-green-500" : "bg-gray-300"}`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition

${form.status ? "translate-x-6" : "translate-x-1"}`}
            />
          </button>
        </div>

        <div className="flex justify-end">
          <button className="flex items-center gap-2 px-5 py-2 bg-[#e94e4e] text-white rounded-lg">
            <CheckCircle size={18} />
            Update
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}
