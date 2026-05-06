"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/component/admin/AdminLayout";
import { Trash2, Edit2, Plus } from "lucide-react";
import toast from "react-hot-toast";
import ConfirmDialog from "@/component/admin/ConfirmDialog";

interface Subject {
  subjectName: string;
  pdf: string;
}

interface NCERTBook {
  _id: string;
  className: string;
  subjects: Subject[];
  status: boolean;
}

export default function NCERTBooksPage() {
  {
    /* STATES */
  }
  const [className, setClassName] = useState("");

  const [subjects, setSubjects] = useState([
    {
      subjectName: "",
      pdf: null,
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

  // AUTH
  useEffect(() => {
    const token = localStorage.getItem("adminToken");

    if (!token) {
      window.location.href = "/admin/login";
    } else {
      setAuthorized(true);
      fetchBooks();
    }
  }, []);

  // FETCH BOOKS
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

  // DELETE
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

  // STATUS TOGGLE
const handleToggleStatus = async (
  id: string,
  currentStatus: boolean,
) => {
  try {
    const res = await fetch(
      `/api/admin/ncert-books/${id}`,
      {
        method: "PATCH",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          status: !currentStatus,
        }),
      },
    );

    if (res.ok) {
      setBooks((prev) =>
        prev.map((item) =>
          item._id === id
            ? {
                ...item,
                status:
                  !currentStatus,
              }
            : item,
        ),
      );

      toast.success(
        "Status updated",
      );
    } else {
      toast.error(
        "Failed to update status",
      );
    }
  } catch (err) {
    console.error(err);

    toast.error(
      "Something went wrong",
    );
  }
};

  const handleSubmit = async () => {
  try {
    // VALIDATION
    if (!className) {
      toast.error("Please select class");
      return;
    }

    if (
      subjects.some(
        (sub) =>
          !sub.subjectName.trim(),
      )
    ) {
      toast.error(
        "Please enter all subject names",
      );

      return;
    }

    // FORM DATA
    const formData = new FormData();

    formData.append(
      "className",
      className,
    );

    formData.append(
      "status",
      "true",
    );

    // SUBJECT DATA
    formData.append(
      "subjects",
      JSON.stringify(
        subjects.map((sub) => ({
          subjectName:
            sub.subjectName,

          pdf:
            typeof sub.pdf ===
            "string"
              ? sub.pdf
              : "",
        })),
      ),
    );

    // PDF FILES
    subjects.forEach(
      (subject, index) => {
        if (
          subject.pdf instanceof File
        ) {
          formData.append(
            `pdf_${index}`,
            subject.pdf,
          );
        }
      },
    );

    let res;

    // UPDATE
    if (editingBook) {
      res = await fetch(
        `/api/admin/ncert-books/${editingBook._id}`,
        {
          method: "PUT",

          body: formData,
        },
      );
    }

    // CREATE
    else {
      res = await fetch(
        "/api/admin/ncert-books",
        {
          method: "POST",

          body: formData,
        },
      );
    }

    if (!res.ok) {
      toast.error(
        editingBook
          ? "Failed to update"
          : "Failed to create",
      );

      return;
    }

    toast.success(
      editingBook
        ? "NCERT Book updated"
        : "NCERT Book created",
    );

    // RESET
    setShowModal(false);

    setEditingBook(null);

    setClassName("");

    setSubjects([
      {
        subjectName: "",
        pdf: null,
      },
    ]);

    // REFRESH
    fetchBooks();
  } catch (error) {
    console.error(error);

    toast.error("Something went wrong");
  }
};

  // LOADING
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

  // PAGINATION
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

            setSubjects([
              {
                subjectName: "",
                pdf: null,
              },
            ]);

            setShowModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-[#e94e4e] text-white rounded-xl hover:bg-red-600 shadow transition"
        >
          <Plus size={16} />
          Add NCERT Book
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white p-6 rounded-2xl shadow-lg mb-8">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            {/* HEAD */}
            <thead className="bg-gray-100 text-gray-700 text-sm uppercase font-semibold">
              <tr>
                <th className="py-4 px-5 text-left border-b">Class</th>

                <th className="py-4 px-5 text-left border-b">
                  Subjects & PDFs
                </th>

                <th className="py-4 px-5 text-center border-b">Status</th>

                <th className="py-4 px-5 text-center border-b">Actions</th>
              </tr>
            </thead>

            {/* BODY */}
            <tbody className="text-gray-800 text-sm">
              {paginatedData.length > 0 ? (
                paginatedData.map((item) => (
                  <tr
                    key={item._id}
                    className="hover:bg-gray-50 transition border-b"
                  >
                    {/* CLASS */}
                    <td className="py-4 px-5">
                      <div className="font-bold text-lg text-gray-800">
                        {item.className}
                      </div>
                    </td>

                    {/* SUBJECTS */}
                    <td className="py-4 px-5">
                      <div className="flex flex-col gap-3">
                        {item.subjects.map((subject, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between bg-gray-50 border rounded-xl px-4 py-3"
                          >
                            <span className="font-medium text-gray-700">
                              {subject.subjectName}
                            </span>

                            <a
                              href={subject.pdf}
                              target="_blank"
                              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition"
                            >
                               PDF
                            </a>
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
                    <td className="py-4 px-5 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => {
                            // SET EDITING DATA
                            setEditingBook(item);

                            // SET CLASS NAME
                            setClassName(item.className);

                            // SET SUBJECTS
                            setSubjects(
                              item.subjects.map((subject) => ({
                                subjectName: subject.subjectName,
                                pdf: subject.pdf,
                              })),
                            );

                            // OPEN MODAL
                            setShowModal(true);
                          }}
                          className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white hover:bg-blue-600 shadow transition"
                        >
                          <Edit2 size={16} />
                        </button>

                        <button
                          onClick={() => handleDelete(item._id)}
                          className="flex items-center justify-center w-8 h-8 rounded-full bg-red-500 text-white hover:bg-red-600 shadow transition"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center py-10 text-gray-500">
                    No NCERT Books found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="flex justify-end items-center mt-5 gap-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded-md ${
              currentPage === 1
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded-md ${
                currentPage === i + 1
                  ? "bg-[#e94e4e] text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded-md ${
              currentPage === totalPages
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            Next
          </button>
        </div>
      </div>

      {/* MODAL PLACEHOLDER */}

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden">
            {/* HEADER */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {editingBook ? "Edit NCERT Book" : "Add NCERT Book"}
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Manage class-wise subjects & PDFs
                </p>
              </div>

              <button
                onClick={() => setShowModal(false)}
                className="w-9 h-9 rounded-full bg-gray-100 hover:bg-red-50 hover:text-red-600 transition flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            {/* BODY */}
            <div className="p-6 max-h-[75vh] overflow-y-auto">
              {/* CLASS */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Select Class
                </label>

                <select
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="">Choose Class</option>

                  <option value="Class 6">Class 6</option>
                  <option value="Class 7">Class 7</option>
                  <option value="Class 8">Class 8</option>
                  <option value="Class 9">Class 9</option>
                  <option value="Class 10">Class 10</option>
                  <option value="Class 11">Class 11</option>
                  <option value="Class 12">Class 12</option>
                </select>
              </div>

              {/* SUBJECTS */}
              <div className="space-y-4">
                {subjects.map((subject, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-2xl p-4 bg-gray-50"
                  >
                    {/* TOP */}
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-800 text-sm">
                        Subject {index + 1}
                      </h3>

                      {subjects.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const updatedSubjects = subjects.filter(
                              (_, i) => i !== index,
                            );

                            setSubjects(updatedSubjects);
                          }}
                          className="text-xs font-medium text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    {/* FIELDS */}
                    <div className="grid md:grid-cols-2 gap-4">
                      {/* SUBJECT */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-2">
                          Subject Name
                        </label>

                        <input
                          type="text"
                          value={subject.subjectName}
                          onChange={(e) => {
                            const updatedSubjects = [...subjects];

                            updatedSubjects[index].subjectName = e.target.value;

                            setSubjects(updatedSubjects);
                          }}
                          placeholder="Enter Subject Name"
                          className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                      </div>

                      {/* PDF */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-2">
                          Upload PDF
                        </label>

                        <input
                          type="file"
                          accept=".pdf"
                          onChange={(e) => {
                            const updatedSubjects = [...subjects];

                            updatedSubjects[index].pdf =
                              e.target.files?.[0] || null;

                            setSubjects(updatedSubjects);
                          }}
                          className="w-full text-sm px-3 py-2.5 rounded-xl border border-gray-200 bg-white file:mr-3 file:px-3 file:py-1.5 file:border-0 file:rounded-lg file:bg-red-50 file:text-red-600"
                        />

                        {typeof subject.pdf === "string" && subject.pdf && (
                          <a
                            href={subject.pdf}
                            target="_blank"
                            className="inline-block mt-2 text-xs text-red-600 hover:underline"
                          >
                            View Current PDF
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* ADD SUBJECT */}
              <button
                type="button"
                onClick={() =>
                  setSubjects([
                    ...subjects,
                    {
                      subjectName: "",
                      pdf: null,
                    },
                  ])
                }
                className="mt-5 flex items-center gap-2 text-sm font-semibold text-red-600 hover:text-red-700"
              >
                <Plus size={16} />
                Add More Subject
              </button>
            </div>

            {/* FOOTER */}
            <div className="flex items-center justify-end gap-3 px-6 py-5 border-t border-gray-100 bg-gray-50">
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold shadow-md transition"
              >
                {editingBook ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM DIALOG */}
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
