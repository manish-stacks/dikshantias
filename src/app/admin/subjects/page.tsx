"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/component/admin/AdminLayout";
import { Trash2, Edit2, Plus } from "lucide-react";
import toast from "react-hot-toast";
import ConfirmDialog from "@/component/admin/ConfirmDialog";

interface Subject {
  _id: string;
  exam: string;
  page: string;
  type: string;
  name: string;
  slug: string;
  status: boolean;
}

export default function SubjectList() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<() => void>(() => {});

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState<Subject | null>(null);

  const [form, setForm] = useState({
    exam: "",
    page: "",
    type: "",
    name: "",
    slug: "",
    status: true,
  });

  // ================= FETCH =================
  const fetchSubjects = async () => {
    const res = await fetch(`/api/admin/subjects?page=${page}&limit=10`);
    const json = await res.json();

    setSubjects(json.data);
    setTotalPages(json.totalPages);
  };

  useEffect(() => {
    fetchSubjects();
  }, [page]);

  // ================= DELETE =================
  const handleDelete = (id: string) => {
    setConfirmAction(() => async () => {
      await fetch(`/api/admin/subjects/${id}`, { method: "DELETE" });
      toast.success("Deleted successfully");
      fetchSubjects();
      setConfirmOpen(false);
    });
    setConfirmOpen(true);
  };

  // ================= SUBMIT =================
const handleSubmit = async () => {
  try {
    let finalPage = form.page;
    let finalType = form.type;

    if (form.page === "PYQ_PRE") {
      finalPage = "PYQ";
      finalType = "PRE";
    } else if (form.page === "PYQ_MAINS") {
      finalPage = "PYQ";
      finalType = "MAINS";
    }

    const payload = {
      ...form,
      page: finalPage,
      type: finalType,
    };

    const url = editData
      ? `/api/admin/subjects/${editData._id}`
      : `/api/admin/subjects`;

    const method = editData ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    // 🔥 IMPORTANT CHECK
    if (!res.ok) {
      toast.error(data.error || "Something went wrong");
      return;
    }

    toast.success(editData ? "Updated successfully" : "Added successfully");

    setModalOpen(false);
    setPage(1);

    fetchSubjects();
  } catch (err) {
    console.error(err);
    toast.error("Server error");
  }
};

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-6">Subjects</h1>

      {/* ================= TABLE ================= */}
      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <div className="flex justify-between mb-4">
          <h2 className="text-lg font-semibold">All Subjects</h2>

          <button
            onClick={() => {
              setEditData(null);
              setForm({
                exam: "",
                page: "",
                type: "",
                name: "",
                slug: "",
                status: true,
              });
              setModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg"
          >
            <Plus size={16} /> Add Subject
          </button>
        </div>

        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Exam</th>
              <th className="p-3 text-left">Page</th>
              <th className="p-3 text-left">Type</th>
              <th className="p-3 text-left">Subject</th>
              <th className="p-3 text-left">Slug</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {subjects.map((item) => (
              <tr key={item._id} className="border-b">
                <td className="p-3">{item.exam}</td>
                <td className="p-3">{item.page}</td>
                <td className="p-3">{item.type}</td>
                <td className="p-3">{item.name}</td>
                <td className="p-3">{item.slug}</td>
                <td className="p-3">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={item.status}
                      onChange={async () => {
                        await fetch(`/api/admin/subjects/${item._id}`, {
                          method: "PUT",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify({
                            status: !item.status,
                          }),
                        });

                        setSubjects((prev) =>
                          prev.map((d) =>
                            d._id === item._id
                              ? { ...d, status: !item.status }
                              : d,
                          ),
                        );

                       toast.success(
                         !item.status
                           ? `Subject "${item.name}" is now active`
                           : `Subject "${item.name}" is now inactive`,
                       );
                      }}
                      className="sr-only peer"
                    />

                    <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-green-500 transition relative">
                      <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition peer-checked:translate-x-5" />
                    </div>
                  </label>
                </td>

                <td className="p-3 text-center">
                  <div className="flex gap-2 justify-center">
                    {/* EDIT */}
                    <button
                      onClick={() => {
                        setEditData(item);

                        setForm({
                          exam: item.exam,
                          page:
                            item.page === "PYQ"
                              ? `PYQ_${item.type}`
                              : item.page,
                          type: item.type,
                          name: item.name,
                          slug: item.slug,
                          status: item.status,
                        });

                        setModalOpen(true);
                      }}
                      className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center"
                    >
                      <Edit2 size={16} />
                    </button>

                    {/* DELETE */}
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
        <div className="flex justify-end items-center gap-2 mt-4  ">
          {/* PREV */}
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Prev
          </button>

          {/* PAGE NUMBERS */}
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1 rounded ${
                page === i + 1 ? "bg-red-500 text-white" : "bg-gray-200"
              }`}
            >
              {i + 1}
            </button>
          ))}

          {/* NEXT */}
          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* ================= MODAL ================= */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-lg rounded-xl shadow-lg overflow-hidden">
            {/* HEADER */}
            <div className="bg-red-500 text-white px-6 py-4 flex justify-between">
              <h2>{editData ? "Edit Subject" : "Add Subject"}</h2>
              <button onClick={() => setModalOpen(false)}>✕</button>
            </div>

            {/* BODY */}
            {/* BODY */}
            <div className="p-6 space-y-5">
              {/* EXAM */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Exam
                </label>
                <select
                  value={form.exam}
                  onChange={(e) => setForm({ ...form, exam: e.target.value })}
                  className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-red-400 outline-none"
                >
                  <option value="">Select Exam</option>
                  <option value="UPSC">UPSC</option>
                  <option value="UPPSC">UPPSC</option>
                  <option value="BPSC">BPSC</option>
                </select>
              </div>

              {/* PAGE */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Page
                </label>
                <select
                  value={form.page}
                  onChange={(e) => setForm({ ...form, page: e.target.value })}
                  className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-red-400 outline-none"
                >
                  <option value="">Select Page</option>
                  <option value="PYQ_PRE">PYQ Pre</option>
                  <option value="PYQ_MAINS">PYQ Mains</option>
                </select>
              </div>

              {/* SUBJECT */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject Name
                </label>
                <input
                  type="text"
                  placeholder="Enter subject name"
                  value={form.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    const slug = name.toLowerCase().replace(/\s+/g, "-");
                    setForm({ ...form, name, slug });
                  }}
                  className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-red-400 outline-none"
                />
              </div>

              {/* SLUG */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Slug
                </label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  className="w-full border px-3 py-2 rounded-lg bg-gray-100"
                />
              </div>
            </div>

            {/* FOOTER */}
            <div className="flex justify-end gap-2 p-4">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                {editData ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM */}
      <ConfirmDialog
        isOpen={confirmOpen}
        title="Delete?"
        message="Delete this subject?"
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmAction}
        onCancel={() => setConfirmOpen(false)}
      />
    </AdminLayout>
  );
}
