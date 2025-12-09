"use client";

import { useState, useEffect, FormEvent } from "react";
import toast from "react-hot-toast";
import { X, CheckCircle, ChevronDown } from "lucide-react";

interface BlogCategory {
    _id: string;
    name: string;
    slug: string;
}

interface SubCategory {
    _id?: string;
    name: string;
    slug: string;
    active: boolean;
    category: BlogCategory;
}

interface SubCategoryModalProps {
    subcategory?: SubCategory | null;
    onClose: () => void;
    onSubmit: () => void;
}

export default function SubCategoryModal({
    subcategory,
    onClose,
    onSubmit,
}: SubCategoryModalProps) {
    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");
    const [active, setActive] = useState(true);
    const [category, setCategory] = useState("");
    const [categories, setCategories] = useState<BlogCategory[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Fetch categories for dropdown
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch("/api/admin/blog-categories");
                const data = await res.json();
                setCategories(data);
            } catch (err) {
                console.error("Failed to fetch categories:", err);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        if (subcategory) {
            setName(subcategory.name);
            setSlug(subcategory.slug);
            setActive(subcategory.active);
     
            if (typeof subcategory.category === "object" && "_id" in subcategory.category) {
                setCategory(subcategory.category._id);
            } else {
                setCategory(subcategory.category as string);
            }
        } else {
            setName("");
            setSlug("");
            setActive(true);
            setCategory("");
        }
    }, [subcategory]);


    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const body = { name, slug, active, category };

            const url = subcategory
                ? `/api/admin/sub-categories/${subcategory._id}`
                : "/api/admin/sub-categories";

            const method = subcategory ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            if (res.ok) {
                toast.success(`Subcategory ${subcategory ? "updated" : "created"} successfully!`);
                onSubmit();
                onClose();
            } else {
                toast.error(`Failed to ${subcategory ? "update" : "create"} subcategory`);
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
                        {subcategory ? "Edit Subcategory" : "Add Subcategory"}
                    </h2>
                    <button onClick={handleClose} className="text-white hover:text-gray-200 transition">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-5 px-6 py-6">

                    {/* Category dropdown */}
                    <label className="block text-gray-700 font-medium mb-2">
                        Category
                        <div className="relative mt-2">
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="appearance-none w-full border border-gray-300 rounded-xl px-4 py-2 pr-10 bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#e94e4e] focus:border-[#e94e4e] transition duration-200"
                                required
                                disabled={isLoading}
                            >
                                <option value="">-- Select a category --</option>
                                {categories.map((cat) => (
                                    <option key={cat._id} value={cat._id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>

                            {/* Dropdown Icon */}
                            <ChevronDown
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                                size={20}
                            />
                        </div>
                    </label>
                    {/* Subcategory name */}
                    <label className="flex flex-col text-gray-700 text-medium">
                        Name
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                                setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"));
                            }}
                            placeholder="Enter subcategory name"
                            className="mt-2 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-[#e94e4e]"
                            required
                            disabled={isLoading}
                        />
                    </label>

                    {/* Slug */}
                    <label className="flex flex-col text-gray-700 text-medium">
                        Slug
                        <input
                            type="text"
                            value={slug}
                            onChange={(e) => setSlug(e.target.value)}
                            placeholder="auto-generated or custom slug"
                            className="mt-2 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-[#e94e4e]"
                            required
                            disabled={isLoading}
                        />
                    </label>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 mt-4">
                        <button
                            type="button"
                            onClick={handleClose}
                            className={`px-5 py-2 bg-gray-100 text-gray-700 border border-gray-300 rounded-lg 
                        hover:bg-gray-200 transition ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                            disabled={isLoading}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className={`flex items-center gap-2 px-5 py-2 bg-[#e94e4e] text-white rounded-lg shadow-md 
                        hover:bg-red-600 transition ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                            disabled={isLoading}
                        >
                            <CheckCircle size={18} className="text-white" />
                            {subcategory ? "Update" : "Save"}
                        </button>
                    </div>
                </form>

                {/* Loading Overlay */}
                {isLoading && (
                    <div className="absolute inset-0 bg-white/70 flex flex-col items-center justify-center z-50">
                        <div className="flex space-x-3 mb-4">
                            <div className="w-5 h-5 bg-[#e94e4e] rounded-full animate-bounce"></div>
                            <div className="w-5 h-5 bg-[#f97316] rounded-full animate-bounce delay-150"></div>
                            <div className="w-5 h-5 bg-[#facc15] rounded-full animate-bounce delay-300"></div>
                        </div>
                        <p className="text-gray-700 font-semibold text-lg">
                            {subcategory ? "Updating subcategory..." : "Creating subcategory..."}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
