"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/component/admin/AdminLayout";
import { Trash2, Edit2, Plus,Search, List, Activity  } from "lucide-react";
import toast from "react-hot-toast";
import ConfirmDialog from "@/component/admin/ConfirmDialog";

interface Blog {
  _id: string;
  title: string;
  category: {
    _id: string;
    name: string;
    slug: string;
  };
  postedBy: string;
  active: boolean;
  image?: { url: string; alt?: string };
  createdAt?: string;
}

export default function BlogPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<() => void>(() => {});
  const [confirmTitle, setConfirmTitle] = useState("");
  const [confirmMessage, setConfirmMessage] = useState("");
  const [confirmBtnText, setConfirmBtnText] = useState("Confirm");
  const itemsPerPage = 5;
  
  const [filterCategory, setFilterCategory] = useState<string>(""); 
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [searchTitle, setSearchTitle] = useState<string>("");



  // Check authorization & fetch blogs
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) window.location.href = "/admin/login";
    else {
      setAuthorized(true);
      fetchBlogs();
    }
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await fetch("/api/admin/blogs");
      if (!res.ok) throw new Error("Failed to fetch blogs");
      const data = await res.json();
      setBlogs(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch blogs");
    }
  };

  // DELETE blog
  const handleDelete = (id: string) => {
    setConfirmTitle("Are you sure you want to delete this blog?");
    setConfirmMessage("You won't be able to revert this!");
    setConfirmBtnText("Delete");
    setConfirmAction(() => async () => {
      try {
        const res = await fetch(`/api/admin/blogs/${id}`, { method: "DELETE" });
        const data = await res.json();
        if (!res.ok) {
          toast.error(data.error || "Failed to delete blog");
          return;
        }
        fetchBlogs();
        toast.success("Blog deleted successfully!");
      } catch (err) {
        console.error(err);
        toast.error("Failed to delete blog");
      } finally {
        setConfirmOpen(false);
      }
    });
    setConfirmOpen(true);
  };

// Toggle blog active status
const handleToggleActive = (id: string, currentStatus: boolean) => {
  setConfirmTitle(currentStatus ? "Deactivate this blog?" : "Activate this blog?");
  setConfirmMessage(
    `Are you sure you want to ${currentStatus ? "deactivate" : "activate"} this blog?`
  );
  setConfirmBtnText(currentStatus ? "Yes, Deactivate" : "Yes, Activate");

  setConfirmAction(() => async () => {
    try {
      const res = await fetch(`/api/admin/blogs/${id}`, {
        method: "PATCH", // 
        body: JSON.stringify({ active: !currentStatus }),
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        const data = await res.json();
        setBlogs((prev) =>
          prev.map((blog) =>
            blog._id === id ? { ...blog, active: data.blog.active } : blog
          )
        );
        toast.success(`Blog has been ${!currentStatus ? "activated" : "deactivated"}`);
      } else {
        toast.error("Something went wrong.");
      }
    } catch (err) {
      toast.error("Failed to update blog.");
    } finally {
      setConfirmOpen(false);
    }
  });

  setConfirmOpen(true);
};


// Toggle blog active status
const filteredBlogs = blogs.filter((blog) => {
  const matchesCategory = filterCategory ? blog.category?.name === filterCategory : true;

  const matchesStatus =
    filterStatus === "true" ? blog.active :
    filterStatus === "false" ? !blog.active : true;

  const searchLower = searchTitle.toLowerCase();

  const matchesTitleOrAuthor =
    (blog.title.en.toLowerCase().includes(searchLower) ||
     blog.title.hi.toLowerCase().includes(searchLower)) ||
    (blog.postedBy.en.toLowerCase().includes(searchLower) ||
     blog.postedBy.hi.toLowerCase().includes(searchLower));

  return matchesCategory && matchesStatus && matchesTitleOrAuthor;
});


// Pagination
const totalPages = Math.ceil(filteredBlogs.length / itemsPerPage);
const paginatedData = filteredBlogs.slice(
  (currentPage - 1) * itemsPerPage,
  currentPage * itemsPerPage
);



  if (!authorized)
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

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Manage Blogs</h1>

      {/* Blogs Table */}
      <div className="bg-white p-6 rounded-2xl shadow-lg mb-8">
   



       <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
  {/* Left: Title */}
  <h2 className="text-xl font-semibold text-gray-700">All Blogs</h2>

    {/* Middle: Filters */}
    
<div className="flex flex-wrap gap-3 items-center bg-white p-4 rounded-xl shadow-sm">
  {/* Category Filter */}
  <div className="relative w-48">
  {/* Icon inside the select */}
  <List className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />

  {/* Category select */}
  <select
    value={filterCategory}
    onChange={(e) => setFilterCategory(e.target.value)}
    className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 focus:ring-1 focus:ring-[#e94e4e] focus:outline-none shadow-sm transition text-gray-700"
  >
    <option value="">All Categories</option>
    {Array.from(new Set(blogs.map((b) => b.category?.name))).map((cat) => (
      <option key={cat} value={cat}>
        {cat}
      </option>
    ))}
  </select>
</div>


  {/* Status Filter */}
  <div className="relative">
    <Activity className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
    <select
      value={filterStatus}
      onChange={(e) => setFilterStatus(e.target.value)}
      className="pl-7 pr-3 py-2 rounded-lg border border-gray-300 focus:ring-1 focus:ring-[#e94e4e] focus:outline-none shadow-sm transition"
    >
      <option value="">All Status</option>
      <option value="true">Active</option>
      <option value="false">Inactive</option>
    </select>
  </div>

  {/* Title Search */}
  <div className="relative flex-1 min-w-[200px]">
    <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
    <input
      type="text"
      value={searchTitle}
      onChange={(e) => setSearchTitle(e.target.value)}
      placeholder="Search..."
      className="pl-7 pr-3 py-2 w-full rounded-lg border border-gray-300 focus:ring-1 focus:ring-[#e94e4e] focus:outline-none shadow-sm transition"
    />
  </div>
</div>

  {/* Right: Add Button */}
  <button
    onClick={() => router.push("/admin/blogs/add")}
    className="flex items-center gap-1 px-3 py-1.5 bg-[#e94e4e] text-white text-sm rounded-md hover:bg-red-600 shadow transition"
  >
    <Plus size={14} /> New Blog
  </button>
</div>


        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white rounded-2xl shadow-lg overflow-hidden">
            <thead className="bg-gray-100 text-gray-700 text-sm uppercase tracking-wide font-semibold">
              <tr>
                <th className="py-4 px-5 text-left border-b border-gray-200 rounded-tl-2xl">Image</th>
                <th className="py-4 px-5 text-left border-b border-gray-200">Title</th>
                <th className="py-4 px-5 text-center border-b border-gray-200">Category</th>
                <th className="py-4 px-5 text-center border-b border-gray-200">Status</th>
                <th className="py-4 px-5 text-center border-b border-gray-200">Posted By</th>
                <th className="py-4 px-5 text-center border-b border-gray-200 rounded-tr-2xl">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-800 text-sm">
  {paginatedData.length > 0 ? (
    paginatedData.map((blog) => (
      <tr key={blog._id} className="hover:bg-gray-50 transition-colors border-b border-gray-200">
        <td className="py-3 px-5">
          {blog.image?.url ? (
            <img
              src={blog.image.url}
              alt={blog.image.alt || blog.title.en} // fallback to English
              className="h-16 w-32 object-cover rounded"
            />
          ) : (
            <div className="h-16 w-32 bg-gray-100 flex items-center justify-center text-xs text-gray-400">
              No Image
            </div>
          )}
        </td>

        {/* Title (EN + HI) */}
        <td className="py-3 px-5 font-medium">
          <div className="flex flex-col gap-1">
            <span className="text-gray-800 font-semibold">{blog.title.en}</span>
            <span className="text-gray-500 text-sm italic">{blog.title.hi || "—"}</span>
          </div>
        </td>

        <td className="py-3 px-5 text-center">{blog.category?.name}</td>

        <td className="py-3 px-5 text-center">
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" checked={blog.active} readOnly className="sr-only" />
            <div
              onClick={() => handleToggleActive(blog._id, blog.active)}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 cursor-pointer ${
                blog.active ? "bg-green-500" : "bg-gray-300"
              }`}
            >
              <span
                className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${
                  blog.active ? "translate-x-6" : "translate-x-0"
                }`}
              ></span>
            </div>
          </label>
        </td>

        {/* Posted By (EN + HI) */}
        <td className="py-3 px-5 text-center">
          <div className="flex flex-col gap-1">
            <span>{blog.postedBy.en}</span>
            <span className="text-gray-500 text-sm italic">{blog.postedBy.hi || "—"}</span>
          </div>
        </td>

        <td className="py-3 px-5 text-center">
          <div className="flex justify-center gap-2">
            <button
              onClick={() => router.push(`/admin/blogs/${blog._id}`)}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md hover:shadow-lg transition transform hover:scale-110"
              title="Edit"
            >
              <Edit2 size={16} />
            </button>
            <button
              onClick={() => handleDelete(blog._id)}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md hover:shadow-lg transition transform hover:scale-110"
              title="Delete"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan={6} className="text-center py-8 text-gray-500 italic border-b border-gray-200">
        No blogs found
      </td>
    </tr>
  )}
</tbody>

          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-end items-center mt-4 space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded-md font-medium ${
              currentPage === 1 ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded-md font-medium ${
                currentPage === i + 1 ? "bg-[#e94e4e] text-white shadow-md" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded-md font-medium ${
              currentPage === totalPages ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Next
          </button>
        </div>
      </div>

      {/* Confirm Dialog */}
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
