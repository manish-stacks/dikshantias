"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/component/admin/AdminLayout";
import { Trash2, Edit2, Plus } from "lucide-react";
import toast from "react-hot-toast";
import ConfirmDialog from "@/component/admin/ConfirmDialog";

interface PageContent {
  _id: string;
  exam: string;
  page: string;
  slug: string;
  status: boolean;
  en: {
    title: string;
    pdf?: string;
  };
  hi: {
    title: string;
    pdf?: string;
  };
}

export default function PageContentList() {
  const router = useRouter();
  const [data, setData] = useState<PageContent[]>([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<() => void>(() => {});

  const fetchData = async () => {
    try {
      const res = await fetch("/api/admin/page-content");
      const json = await res.json();
      setData(json);
    } catch {
      toast.error("Failed");
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  // delete
  const handleDelete = (id: string) => {
    setConfirmAction(() => async () => {
      await fetch(
        `/api/admin/page-content/${id}`,
        {
          method: "DELETE",
        },
      );

      toast.success("Content deleted successfully");

      fetchData();

      setConfirmOpen(false);
    });

    setConfirmOpen(true);
  };

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-6">Page Content</h1>

      <div className="bg-white p-6 rounded-2xl shadow-lg">
        {/* header */}

        <div className="flex justify-between mb-4">
          <h2 className="text-lg font-semibold">All Pages</h2>

          <button
            onClick={() => router.push("/admin/page-content/add")}
            className="flex items-center gap-1 px-3 py-2 bg-[#e94e4e] text-white rounded-md"
          >
            <Plus size={16} />
            Add Page
          </button>
        </div>

        {/* table */}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Exam</th>

                <th className="p-3 text-left">Page</th>

                <th className="p-3 text-left">Title EN</th>

                <th className="p-3 text-left">Title HI</th>

                <th className="p-3 text-left">PDF</th>

                <th className="p-3 text-left">Status</th>

                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {data.map((item) => (
                <tr key={item._id} className="border-b">
                  <td className="p-3 font-medium">{item.exam}</td>

                  <td className="p-3">{item.page}</td>

                  <td className="p-3">{item.en?.title}</td>

                  <td className="p-3">{item.hi?.title}</td>

                  <td className="p-3">
                    <div className="flex gap-2">
                      {item.en?.pdf && (
                        <a
                          href={item.en.pdf}
                          target="_blank"
                          className="text-blue-600"
                        >
                          EN
                        </a>
                      )}

                      {item.hi?.pdf && (
                        <a
                          href={item.hi.pdf}
                          target="_blank"
                          className="text-blue-600"
                        >
                          HI
                        </a>
                      )}
                    </div>
                  </td>

                  <td className="p-3">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={item.status}
                        onChange={async () => {
                          await fetch(
                            `/api/admin/page-content/${item._id}`,

                            {
                              method: "PUT",

                              headers: {
                                "Content-Type": "application/json",
                              },

                              body: JSON.stringify({
                                status: !item.status,
                              }),
                            },
                          );

                          setData((prev) =>
                            prev.map((d) =>
                              d._id === item._id
                                ? {
                                    ...d,
                                    status: !item.status,
                                  }
                                : d,
                            ),
                          );

                          toast.success(
                            !item.status
                              ? "Activated successfully"
                              : "Deactivated successfully",
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
                      <button
                        onClick={() =>
                          router.push(`/admin/page-content/${item._id}`)
                        }
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

      <ConfirmDialog
        isOpen={confirmOpen}
        title="Delete?"
        message="delete this page?"
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmAction}
        onCancel={() => setConfirmOpen(false)}
      />
    </AdminLayout>
  );
}
