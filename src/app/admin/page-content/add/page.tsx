"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
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

export default function AddPageContent() {
  const router = useRouter();

  const editor = useRef(null);

  const [form, setForm] = useState({
    exam: "UPSC",

    page: "About",

    status: true,

    en: {
      title: "",
      shortContent: "",
      content: "",
      pdf: "",
    },

    hi: {
      title: "",
      shortContent: "",
      content: "",
      pdf: "",
    },
  });

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
        shortContent:form.en.shortContent,
        content: form.en.content,
      }),
    );

    formData.append(
      "hi",
      JSON.stringify({
        title: form.hi.title,
        shortContent: form.hi.shortContent,
        content: form.hi.content,
      }),
    );

    if (form.en.pdf instanceof File) {
      formData.append("en_pdf", form.en.pdf);
    }

    if (form.hi.pdf instanceof File) {
      formData.append("hi_pdf", form.hi.pdf);
    }

    const res = await fetch("/api/admin/page-content", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      toast.error("Something went wrong");

      return;
    }

    toast.success(`${form.exam} ${form.page} saved successfully`);

    router.push("/admin/page-content");
  };
  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-6">Add Page Content</h1>

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
            {/* exam */}

            <div>
              <label className="font-medium">Exam</label>

              <select
                value={form.exam}
                onChange={(e) => {
                  const selectedExam = e.target.value;

                  setForm({
                    ...form,
                    exam: selectedExam,
                    page: pageOptions[selectedExam][0].value,
                  });
                }}
                className="w-full border p-2 rounded-lg"
              >
                <option>UPSC</option>
                <option>UPPSC</option>
                <option>BPSC</option>
                <option>Videos</option>
                <option>Dikshant Special</option>
              </select>
            </div>

            {/* page */}

            <div>
              <label className="font-medium">Page</label>

              <select
                value={form.page}
                onChange={(e) =>
                  setForm({
                    ...form,

                    page: e.target.value,
                  })
                }
                className="w-full border p-2 rounded-lg"
              >
                {pageOptions[form.exam].map((p: any) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>

            {/* title en */}

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

            {/* title hi */}

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
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">
            PDF Upload
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* English PDF */}

            <div>
              <label className="block font-medium mb-1">English PDF</label>

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

              {form.en.pdf && typeof form.en.pdf !== "string" && (
                <p className="text-sm text-gray-500 mt-1">
                  Selected:
                  {form.en.pdf.name}
                </p>
              )}
            </div>

            {/* Hindi PDF */}

            <div>
              <label className="block font-medium mb-1">Hindi PDF</label>

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

              {form.hi.pdf && typeof form.hi.pdf !== "string" && (
                <p className="text-sm text-gray-500 mt-1">
                  Selected:
                  {form.hi.pdf.name}
                </p>
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

        {/* submit */}

        <div className="flex justify-end">
          <button className="flex items-center gap-2 px-5 py-2 bg-[#e94e4e] text-white rounded-lg">
            <CheckCircle size={18} />
            Save
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}
