"use client";

import { useState, useEffect, FormEvent } from "react";
import toast from "react-hot-toast";
import { X, CheckCircle } from "lucide-react";



interface BlogCategory {
  _id?: string;
  name: string;
  slug: string;
  active: boolean;
}

interface BlogCategoryModalProps {
  onClose: () => void;
  onSubmit: () => void; 
  category?: BlogCategory; 
}

export default function BlogCategoryModal({ onClose, onSubmit, category }: BlogCategoryModalProps) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [active, setActive] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Prefill form for editing
  useEffect(() => {
    if (category) {
      setName(category.name);
      setSlug(category.slug);
      setActive(category.active);
    } else {
      setName("");
      setSlug("");
      setActive(true);
    }
  }, [category]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const body = { name, slug, active };

        const url = category
                ? `/api/admin/blog-categories/${category._id}`
                : "/api/admin/blog-categories";              

      const method = category ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        toast.success(`Category ${category ? "updated" : "created"} successfully!`);
        onSubmit();
        onClose();
      } else {
        toast.error(`Failed to ${category ? "update" : "create"} category`);
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-3xl shadow-2xl overflow-hidden relative">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-300 bg-[#e94e4e]">
          <h2 className="text-xl font-semibold text-white">
            {category ? "Edit Blog Category" : "Blog Category"}
          </h2>
          <button onClick={handleClose} className="text-white hover:text-gray-200 transition">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 px-6 py-6">
          <label className="flex flex-col text-gray-700 text-medium">
             Name
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"));
              }}
              placeholder="Enter category name"
              className="mt-2 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-[#e94e4e] transition"
              required
              disabled={isLoading}
            />
          </label>

          <label className="flex flex-col text-gray-700 text-medium">
            Slug
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="auto-generated or custom slug"
              className="mt-2 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-[#e94e4e] transition"
              required
              disabled={isLoading}
            />
          </label>
         
          {/* Actions */}
        

            <div className="flex justify-end gap-3 mt-4">
  {/* Cancel Button */}
  <button
    type="button"
    onClick={handleClose}
    className={`flex items-center gap-2 px-5 py-2 bg-gray-100 text-gray-700 border border-gray-300 rounded-lg 
      hover:bg-gray-200 hover:text-gray-900 transition-colors duration-200 ease-in-out 
      ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
    disabled={isLoading}
  >
    Cancel
  </button>

  {/* Save/Update Button */}
  <button
    type="submit"
    className={`flex items-center gap-2 px-5 py-2 bg-[#e94e4e] text-white rounded-lg shadow-md 
      hover:bg-red-600 hover:shadow-lg transition-colors duration-200 ease-in-out 
      ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
    disabled={isLoading}
  >
    <CheckCircle size={18} className="text-white" />
    {category ? "Update" : "Save"}
  </button>
</div>


        </form>

        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-white/70 flex flex-col items-center justify-center z-50">
            <div className="relative flex space-x-3 mb-4">
              <div className="w-5 h-5 bg-[#e94e4e] rounded-full animate-bounce"></div>
              <div className="w-5 h-5 bg-[#f97316] rounded-full animate-bounce delay-150"></div>
              <div className="w-5 h-5 bg-[#facc15] rounded-full animate-bounce delay-300"></div>
            </div>
            <p className="text-gray-700 font-semibold text-lg">
              {category ? "Updating category..." : "Creating category..."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
