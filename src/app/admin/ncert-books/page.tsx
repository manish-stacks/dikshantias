"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/component/admin/AdminLayout";
import { Trash2, Edit2, Plus } from "lucide-react";
import toast from "react-hot-toast";
import ConfirmDialog from "@/component/admin/ConfirmDialog";

interface Subject {
  // OLD DATA SUPPORT
  subjectName: string;
  pdf: string;

  // NEW FIELDS
  subjectNameHindi?: string;

  englishPdf?: File | string | null;
  hindiPdf?: File | string | null;
}

interface NCERTBook {
  _id: string;

  className: string;

  classNameHindi?: string;

  subjects: Subject[];

  status: boolean;
}

export default function NCERTBooksPage() {
  /* STATES */

  const [className, setClassName] = useState("");

  const [classNameHindi, setClassNameHindi] = useState("");

  const [subjects, setSubjects] = useState([
    {
      subjectName: "",
      subjectNameHindi: "",

      pdf: "",

      englishPdf: null,
      hindiPdf: null,
    },
  ]);

  const [authorized, setAuthorized] = useState(false);

  const [books, setBooks] = useState<NCERTBook[]>([]);

  const [currentPage, setCurrentPage] = useState(1);

  const [showModal, setShowModal] = useState(false);

  const [editingBook, setEditingBook] = useState<NCERTBook | null>(null);

  // Confirm dialog
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [confirmAction, setConfirmAction] = useState<() => void>(() => {});

  const [confirmTitle, setConfirmTitle] = useState("");

  const [confirmMessage, setConfirmMessage] = useState("");

  const [confirmBtnText, setConfirmBtnText] = useState("Confirm");

  const itemsPerPage = 5;

  /* AUTH */

  useEffect(() => {
    const token = localStorage.getItem("adminToken");

    if (!token) {
      window.location.href = "/admin/login";
    } else {
      setAuthorized(true);

      fetchBooks();
    }
  }, []);

  /* FETCH BOOKS */

  const fetchBooks = async () => {
    try {
      const res = await fetch("/api/admin/ncert-books");

      const data = await res.json();

      setBooks(data);
    } catch (err) {
      console.error(err);

      toast.error("Failed to fetch NCERT books");
    }
  };

  /* DELETE */

  const handleDelete = (id: string) => {
    setConfirmTitle("Delete NCERT Book?");

    setConfirmMessage("This action cannot be undone.");

    setConfirmBtnText("Delete");

    setConfirmAction(() => async () => {
      try {
        const res = await fetch(`/api/admin/ncert-books/${id}`, {
          method: "DELETE",
        });

        if (!res.ok) {
          toast.error("Failed to delete");

          return;
        }

        fetchBooks();

        toast.success("NCERT Book deleted successfully");
      } catch (err) {
        console.error(err);

        toast.error("Something went wrong");
      } finally {
        setConfirmOpen(false);
      }
    });

    setConfirmOpen(true);
  };

  /* STATUS */

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/admin/ncert-books/${id}`, {
        method: "PATCH",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          status: !currentStatus,
        }),
      });

      if (res.ok) {
        setBooks((prev) =>
          prev.map((item) =>
            item._id === id
              ? {
                  ...item,
                  status: !currentStatus,
                }
              : item,
          ),
        );

        toast.success("Status updated");
      } else {
        toast.error("Failed to update status");
      }
    } catch (err) {
      console.error(err);

      toast.error("Something went wrong");
    }
  };

  /* SUBMIT */

  const handleSubmit = async () => {
    try {
      if (!className) {
        toast.error("Please select class");

        return;
      }

      if (subjects.some((sub) => !sub.subjectName.trim())) {
        toast.error("Please enter all subject names");

        return;
      }

      const formData = new FormData();

      formData.append("className", className);

      formData.append("classNameHindi", classNameHindi);

      formData.append("status", "true");

      /* SUBJECT DATA */

      formData.append(
        "subjects",
        JSON.stringify(
          subjects.map((sub) => ({
            subjectName: sub.subjectName,

            subjectNameHindi: sub.subjectNameHindi || "",

            pdf: typeof sub.pdf === "string" ? sub.pdf : "",

            englishPdf:
              typeof sub.englishPdf === "string" ? sub.englishPdf : "",

            hindiPdf: typeof sub.hindiPdf === "string" ? sub.hindiPdf : "",
          })),
        ),
      );

      /* FILES */

      subjects.forEach((subject, index) => {
        if (subject.englishPdf instanceof File) {
          formData.append(`englishPdf_${index}`, subject.englishPdf);
        }

        if (subject.hindiPdf instanceof File) {
          formData.append(`hindiPdf_${index}`, subject.hindiPdf);
        }
      });

      let res;

      /* UPDATE */

      if (editingBook) {
        res = await fetch(`/api/admin/ncert-books/${editingBook._id}`, {
          method: "PUT",

          body: formData,
        });
      } else {
        /* CREATE */
        res = await fetch("/api/admin/ncert-books", {
          method: "POST",

          body: formData,
        });
      }

      if (!res.ok) {
        toast.error(editingBook ? "Failed to update" : "Failed to create");

        return;
      }

      toast.success(editingBook ? "NCERT Book updated" : "NCERT Book created");

      /* RESET */

      setShowModal(false);

      setEditingBook(null);

      setClassName("");

      setClassNameHindi("");

      setSubjects([
        {
          subjectName: "",
          subjectNameHindi: "",

          pdf: "",

          englishPdf: null,
          hindiPdf: null,
        },
      ]);

      fetchBooks();
    } catch (error) {
      console.error(error);

      toast.error("Something went wrong");
    }
  };

  /* LOADING */

  if (!authorized) {
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

  /* PAGINATION */

  const totalPages = Math.ceil(books.length / itemsPerPage);

  const paginatedData = books.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <AdminLayout>
      {/* HEADER */}

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">NCERT Books</h1>

          <p className="text-gray-500 mt-1">
            Manage class-wise subjects & PDFs
          </p>
        </div>

        <button
          onClick={() => {
            setEditingBook(null);

            setClassName("");

            setClassNameHindi("");

            setSubjects([
              {
                subjectName: "",
                subjectNameHindi: "",

                pdf: "",

                englishPdf: null,
                hindiPdf: null,
              },
            ]);

            setShowModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-[#e94e4e] text-white rounded-xl"
        >
          <Plus size={16} />
          Add NCERT Book
        </button>
      </div>

      {/* TABLE */}

      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left py-3">Class</th>

                <th className="text-left py-3">Subjects</th>

                <th className="text-center py-3">Status</th>

                <th className="text-center py-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {paginatedData.map((item) => (
                <tr key={item._id}>
                  {/* CLASS */}

                  <td className="py-4">
                    <div className="font-bold">{item.className}</div>

                    {item.classNameHindi && (
                      <div className="text-xs text-gray-500">
                        {item.classNameHindi}
                      </div>
                    )}
                  </td>

                  {/* SUBJECTS */}

                  <td className="py-4">
                    <div className="space-y-3">
                      {item.subjects.map((subject, index) => (
                        <div
                          key={index}
                          className="border rounded-xl p-3 flex items-center justify-between"
                        >
                          <div>
                            <div className="font-semibold">
                              {subject.subjectName}
                            </div>

                            {subject.subjectNameHindi && (
                              <div className="text-xs text-gray-500">
                                {subject.subjectNameHindi}
                              </div>
                            )}
                          </div>

                          <div className="flex gap-2">
                            {subject.englishPdf && (
                              <a
                                href={
                                  typeof subject.englishPdf === "string"
                                    ? subject.englishPdf
                                    : "#"
                                }
                                target="_blank"
                                className="bg-blue-600 text-white px-3 py-1 rounded-lg text-xs"
                              >
                                English
                              </a>
                            )}

                            {subject.hindiPdf && (
                              <a
                                href={
                                  typeof subject.hindiPdf === "string"
                                    ? subject.hindiPdf
                                    : "#"
                                }
                                target="_blank"
                                className="bg-green-600 text-white px-3 py-1 rounded-lg text-xs"
                              >
                                Hindi
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </td>

                  {/* STATUS */}

                  <td className="py-4 px-5 text-center">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={item.status}
                        readOnly
                        className="sr-only"
                      />

                      <div
                        onClick={() =>
                          handleToggleStatus(item._id, item.status)
                        }
                        className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 cursor-pointer ${
                          item.status ? "bg-green-500" : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${
                            item.status ? "translate-x-6" : "translate-x-0"
                          }`}
                        ></span>
                      </div>
                    </label>
                  </td>
                  {/* ACTIONS */}

                  <td className="text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => {
                          setEditingBook(item);

                          setClassName(item.className);

                          setClassNameHindi(item.classNameHindi || "");

                          setSubjects(
                            item.subjects.map((subject) => ({
                              subjectName: subject.subjectName || "",

                              subjectNameHindi: subject.subjectNameHindi || "",

                              pdf: subject.pdf || "",

                              englishPdf: subject.englishPdf || "",

                              hindiPdf: subject.hindiPdf || "",
                            })),
                          );

                          setShowModal(true);
                        }}
                        className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center"
                      >
                        <Edit2 size={16} />
                      </button>

                      <button
                        onClick={() => handleDelete(item._id)}
                        className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl rounded-2xl overflow-hidden">
            {/* HEADER */}

            <div className="flex items-center justify-between p-5 border-b">
              <h2 className="text-xl font-bold">
                {editingBook ? "Edit NCERT Book" : "Add NCERT Book"}
              </h2>

              <button onClick={() => setShowModal(false)}>✕</button>
            </div>

            {/* BODY */}

            <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
              {/* CLASS */}

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Class Name
                  </label>

                  <select
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                    className="w-full h-11 border rounded-xl px-4"
                  >
                    <option value="">Select Class</option>

                    <option value="Class 6">Class 6</option>

                    <option value="Class 7">Class 7</option>

                    <option value="Class 8">Class 8</option>

                    <option value="Class 9">Class 9</option>

                    <option value="Class 10">Class 10</option>

                    <option value="Class 11">Class 11</option>

                    <option value="Class 12">Class 12</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Class Name (Hindi)
                  </label>

                  <input
                    type="text"
                    value={classNameHindi}
                    onChange={(e) => setClassNameHindi(e.target.value)}
                    placeholder="कक्षा"
                    className="w-full h-11 border rounded-xl px-4"
                  />
                </div>
              </div>

              {/* SUBJECTS */}

              <div className="space-y-4">
                {subjects.map((subject, index) => (
                  <div key={index} className="border rounded-2xl p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-semibold">Subject {index + 1}</h3>

                      {subjects.length > 1 && (
                        <button
                          onClick={() => {
                            const updated = subjects.filter(
                              (_, i) => i !== index,
                            );

                            setSubjects(updated);
                          }}
                          className="text-red-500 text-sm"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      {/* ENGLISH */}

                      <div>
                        <label className="block text-xs font-semibold mb-2">
                          Subject Name (English)
                        </label>

                        <input
                          type="text"
                          value={subject.subjectName}
                          onChange={(e) => {
                            const updated = [...subjects];

                            updated[index].subjectName = e.target.value;

                            setSubjects(updated);
                          }}
                          className="w-full h-11 border rounded-xl px-4"
                        />
                      </div>

                      {/* HINDI */}

                      <div>
                        <label className="block text-xs font-semibold mb-2">
                          Subject Name (Hindi)
                        </label>

                        <input
                          type="text"
                          value={subject.subjectNameHindi || ""}
                          onChange={(e) => {
                            const updated = [...subjects];

                            updated[index].subjectNameHindi = e.target.value;

                            setSubjects(updated);
                          }}
                          className="w-full h-11 border rounded-xl px-4"
                        />
                      </div>
                      {/* ENGLISH PDF */}

                      <div>
                        <label className="block text-xs font-semibold mb-2">
                          English PDF
                        </label>

                        <input
                          type="file"
                          accept=".pdf"
                          onChange={(e) => {
                            const updated = [...subjects];

                            updated[index].englishPdf =
                              e.target.files?.[0] || null;

                            setSubjects(updated);
                          }}
                          className="w-full border rounded-xl p-2"
                        />

                        {/* OLD FILE VIEW */}
                        {typeof subject.englishPdf === "string" &&
                          subject.englishPdf && (
                            <a
                              href={subject.englishPdf}
                              target="_blank"
                              className="inline-block mt-2 text-xs text-blue-600 hover:underline"
                            >
                              View English PDF
                            </a>
                          )}

                        {/* OLD PDF SUPPORT */}
                        {!subject.englishPdf && subject.pdf && (
                          <a
                            href={subject.pdf}
                            target="_blank"
                            className="inline-block mt-2 text-xs text-blue-600 hover:underline"
                          >
                            View Current PDF
                          </a>
                        )}
                      </div>

                      {/* HINDI PDF */}

                      <div>
                        <label className="block text-xs font-semibold mb-2">
                          Hindi PDF
                        </label>

                        <input
                          type="file"
                          accept=".pdf"
                          onChange={(e) => {
                            const updated = [...subjects];

                            updated[index].hindiPdf =
                              e.target.files?.[0] || null;

                            setSubjects(updated);
                          }}
                          className="w-full border rounded-xl p-2"
                        />

                        {/* OLD HINDI FILE */}
                        {typeof subject.hindiPdf === "string" &&
                          subject.hindiPdf && (
                            <a
                              href={subject.hindiPdf}
                              target="_blank"
                              className="inline-block mt-2 text-xs text-green-600 hover:underline"
                            >
                              View Hindi PDF
                            </a>
                          )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* ADD SUBJECT */}

              <button
                onClick={() =>
                  setSubjects([
                    ...subjects,
                    {
                      subjectName: "",
                      subjectNameHindi: "",

                      pdf: "",

                      englishPdf: null,
                      hindiPdf: null,
                    },
                  ])
                }
                className="flex items-center gap-2 text-red-600"
              >
                <Plus size={16} />
                Add More Subject
              </button>
            </div>

            {/* FOOTER */}

            <div className="flex justify-end gap-3 p-5 border-t">
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2 border rounded-xl"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                className="px-6 py-2 bg-red-600 text-white rounded-xl"
              >
                {editingBook ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM */}

      <ConfirmDialog
        isOpen={confirmOpen}
        title={confirmTitle}
        message={confirmMessage}
        confirmText={confirmBtnText}
        cancelText="Cancel"
        onConfirm={confirmAction}
        onCancel={() => setConfirmOpen(false)}
      />
    </AdminLayout>
  );
}
