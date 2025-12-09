"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/component/admin/AdminLayout";
import { Globe, Mail, CheckCircle, Trophy, User } from "lucide-react";
import ImageUpload from "@/component/admin/ImageUpload";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface IWebSettings {
    _id: string;
    name: string;
    phone: string;
    whatsapp: string;
    email: string;
    address: string;
    image: { url: string; public_url: string; public_id: string };
    googleMap: string;
    facebook: string;
    instagram: string;
    youtube: string;
    linkedin: string;
    twitter: string;
    telegram: string;
}

interface IResultSection {
  _id: string
  description: {
    en: string
    hi: string
  }
  buttonText: {
    en: string
    hi: string
  }
  buttonLink: string
}



export default function PagesPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("web");
    const [settings, setSettings] = useState<IWebSettings | null>(null);
    const [formData, setFormData] = useState<Partial<IWebSettings>>({});
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [resultSection, setResultSection] = useState<IResultSection | null>(null)
    const [resultForm, setResultForm] = useState<Partial<IResultSection>>({})

    const [admin, setAdmin] = useState<IAdmin | null>(null);
    const [profileForm, setProfileForm] = useState<{ name?: string; email?: string; password?: string }>({});



    useEffect(() => {
        fetch("/api/admin/result-section")
            .then((res) => res.json())
            .then((data) => {
                if (data) {
                    setResultSection(data)
                    setResultForm(data)
                }
            })
            .catch((err) => console.error("Error fetching result section:", err))
    }, [])

  const handleResultChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
) => {
  const { name, value } = e.target;

  setResultForm((prev) => {
    const keys = name.split("."); // e.g. ["description", "en"]
    if (keys.length === 2) {
      const [parent, child] = keys;
      return {
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value, // update or clear
        },
      };
    }

    // for non-nested fields like buttonLink
    return {
      ...prev,
      [name]: value,
    };
  });
};



    const handleResultSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const res = await fetch("/api/admin/result-section", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(resultForm),
            })

            if (!res.ok) throw new Error("Failed to update result section")

            toast.success("Result section updated successfully")
        } catch (err) {
            console.error(err)
            toast.error("Failed to update result section")
        }
    }


    useEffect(() => {
        fetch("/api/admin/profile")
            .then((res) => res.json())
            .then((data) => {
                setAdmin(data);
                setProfileForm({ name: data.name, email: data.email });
            })
            .catch((err) => console.error("Error fetching admin profile:", err));
    }, []);



    // Fetch settings from API
    useEffect(() => {
        fetch("/api/admin/settings")
            .then((res) => res.json())
            .then((data) => {
                if (data && data.length > 0) {
                    setSettings(data[0]);
                    setFormData(data[0]);
                }
            })
            .catch((err) => console.error("Error fetching settings:", err));
    }, []);

    // Handle input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };


    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
    };


    // Handle form submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!settings) return;

        try {
            const formDataToSend = new FormData();
            const fields: (keyof IWebSettings)[] = [
                "name",
                "phone",
                "whatsapp",
                "email",
                "address",
                "googleMap",
                "facebook",
                "instagram",
                "youtube",
                "linkedin",
                "twitter",
                "telegram",
            ];

            fields.forEach((field) => {
                if (formData[field]) {
                    formDataToSend.append(field, formData[field] as string);
                }
            });
            if (imageFile) {
                formDataToSend.append("image", imageFile);
            }
            const res = await fetch(`/api/admin/settings/${settings._id}`, {
                method: "PUT",
                body: formDataToSend,
            });

            if (!res.ok) throw new Error("Failed to update web settings");

            toast.success("Web Setting updated successfully");
            router.push("/admin/settings/web");
        } catch (err) {
            console.error(err);
            toast.error("Failed to update web settings");
        }
    };



    const handleProfileSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!admin?._id) {
    toast.error("Admin ID missing, cannot update profile");
    return;
  }

  try {
    const res = await fetch(`/api/admin/profile/${admin._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profileForm),
    });

    if (!res.ok) throw new Error("Failed to update profile");

    const result = await res.json();
    toast.success(result.message);
  } catch (err) {
    console.error(err);
    toast.error("Failed to update profile");
  }
};




    return (
        <AdminLayout>
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Manage Settings</h1>

            <div className="flex flex-col lg:flex-row bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
                {/* Sidebar */}
                <div className="w-full lg:w-1/4 bg-gray-50 border-b lg:border-b-0 lg:border-r border-gray-200">
                    <ul className="flex flex-col p-4 gap-2">
                        {[
                            { name: "Web Setting", key: "web", icon: <Globe size={18} /> },
                            { name: "Profile", key: "profile", icon: <User size={18} /> },
                            { name: "SMTP Setting", key: "smtp", icon: <Mail size={18} /> },
                            { name: "Result Setting", key: "result", icon: <Trophy size={18} /> },
                        ].map((item) => (
                            <li key={item.key}>
                                <button
                                    onClick={() => setActiveTab(item.key)}
                                    className={`flex items-center gap-3 w-full text-left px-4 py-3 font-medium rounded-lg transition-all duration-200
                    ${activeTab === item.key
                                            ? "bg-[#E94E4E] text-white shadow-lg"
                                            : "text-gray-700 hover:bg-gray-100"
                                        }`}
                                >
                                    <span
                                        className={`p-2 rounded-md ${activeTab === item.key
                                            ? "bg-white/20 text-white"
                                            : "bg-gray-10 text-gray-600"
                                            }`}
                                    >
                                        {item.icon}
                                    </span>
                                    <span>{item.name}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Content Area */}
                <div className="w-full lg:w-3/4 p-8">
                    {activeTab === "web" && settings && (
                        <form
                            onSubmit={handleSubmit}
                            className="space-y-5 bg-white p-6 rounded-2xl shadow-md border border-gray-100"
                        >
                            {/* Web Information */}
                            <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b border-gray-300 pb-2">
                                Web Information
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-2">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name || ""}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#E94E4E] transition"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-2">
                                        Phone
                                    </label>
                                    <input
                                        type="text"
                                        name="phone"
                                        value={formData.phone || ""}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#E94E4E] transition"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-2">
                                        WhatsApp
                                    </label>
                                    <input
                                        type="text"
                                        name="whatsapp"
                                        value={formData.whatsapp || ""}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#E94E4E] transition"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-2">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email || ""}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#E94E4E] transition"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-2">
                                    Address
                                </label>
                                <textarea
                                    name="address"
                                    value={formData.address || ""}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#E94E4E] transition"
                                    rows={3}
                                ></textarea>
                            </div>

                            <div>
                                <ImageUpload
                                    onImageSelect={(file) => setImageFile(file)}
                                    isLoading={false}
                                    initialImage={settings.image.url}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-2">
                                    Google Maps
                                </label>
                                <input
                                    type="text"
                                    name="googleMap"
                                    value={formData.googleMap || ""}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#E94E4E] transition"
                                />
                            </div>

                            {/* Social Media */}
                            <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b border-gray-300 pb-2">
                                Social Media
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    "facebook",
                                    "instagram",
                                    "youtube",
                                    "linkedin",
                                    "twitter",
                                    "telegram",
                                ].map((key) => (
                                    <div key={key}>
                                        <label className="block text-sm font-medium text-gray-600 mb-2">
                                            {key.charAt(0).toUpperCase() + key.slice(1)}
                                        </label>
                                        <input
                                            type="text"
                                            name={key}
                                            value={(formData[key as keyof IWebSettings] as string) ?? ""}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#E94E4E] transition"
                                        />
                                    </div>
                                ))}

                            </div>

                            {/* Buttons */}
                            <div className="flex justify-end gap-4 mt-6">
                                <button
                                    type="button"
                                    className="flex items-center gap-2 px-5 py-2 bg-gray-100 text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-200 transition"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="flex items-center gap-2 px-5 py-2 bg-[#E94E4E] text-white rounded-xl shadow-md hover:bg-red-600 transition"
                                >
                                    <CheckCircle size={18} className="text-white" />
                                    Update
                                </button>
                            </div>
                        </form>
                    )}

                    {activeTab === "result" && resultSection && (
                        <form
                            onSubmit={handleResultSubmit}
                            className="space-y-5 bg-white p-6 rounded-2xl shadow-md border border-gray-100"
                        >
                            <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b border-gray-300 pb-2">
                            Result Section
                            </h2>

                            {/* Description EN + HI */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-2">
                                Description (English)
                                </label>
                                <textarea
                                name="description.en"
                                value={resultForm.description?.en || ""}
                                onChange={handleResultChange}
                                className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring-2 focus:ring-[#E94E4E] transition"
                                rows={4}
                                ></textarea>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-2">
                                Description (Hindi)
                                </label>
                                <textarea
                                name="description.hi"
                                value={resultForm.description?.hi || ""}
                                onChange={handleResultChange}
                                className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring-2 focus:ring-[#E94E4E] transition"
                                rows={4}
                                ></textarea>
                            </div>
                            </div>

                            {/* Button Text EN + HI */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-2">
                                Button Text (English)
                                </label>
                                <input
                                type="text"
                                name="buttonText.en"
                                value={resultForm.buttonText?.en || ""}
                                onChange={handleResultChange}
                                className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#E94E4E] transition"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-2">
                                Button Text (Hindi)
                                </label>
                                <input
                                type="text"
                                name="buttonText.hi"
                                value={resultForm.buttonText?.hi || ""}
                                onChange={handleResultChange}
                                className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#E94E4E] transition"
                                />
                            </div>
                            </div>

                            {/* Button Link (single) */}
                            <div>
                            <label className="block text-sm font-medium text-gray-600 mb-2">
                                Button Link
                            </label>
                            <input
                                type="text"
                                name="buttonLink"
                                value={resultForm.buttonLink || ""}
                                onChange={handleResultChange}
                                className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#E94E4E] transition"
                            />
                            </div>

                            <div className="flex justify-end gap-4 mt-6">
                            <button
                                type="button"
                                className="flex items-center gap-2 px-5 py-2 bg-gray-100 text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-200 transition"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="flex items-center gap-2 px-5 py-2 bg-[#E94E4E] text-white rounded-xl shadow-md hover:bg-red-600 transition"
                            >
                                <CheckCircle size={18} className="text-white" />
                                Update
                            </button>
                            </div>
                        </form>
                        )}


                    {activeTab === "profile" && admin && (
                        <form
                            onSubmit={handleProfileSubmit}
                            className="space-y-5 bg-white p-6 rounded-2xl shadow-md border border-gray-100"
                        >
                            <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b border-gray-300 pb-2">
                                Profile Settings
                            </h2>

                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-2">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={profileForm.name || ""}
                                    onChange={handleProfileChange}
                                    className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#E94E4E] transition"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-2">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={profileForm.email || ""}
                                    onChange={handleProfileChange}
                                    className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#E94E4E] transition"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-2">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={profileForm.password || ""}
                                    onChange={handleProfileChange}
                                    placeholder="Enter new password if you want to change"
                                    className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#E94E4E] transition"
                                />
                            </div>

                            <div className="flex justify-end gap-4 mt-6">
                                <button
                                    type="button"
                                    className="flex items-center gap-2 px-5 py-2 bg-gray-100 text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-200 transition"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="flex items-center gap-2 px-5 py-2 bg-[#E94E4E] text-white rounded-xl shadow-md hover:bg-red-600 transition"
                                >
                                    <CheckCircle size={18} className="text-white" />
                                    Update
                                </button>
                            </div>
                        </form>
                    )}


                </div>
            </div>
        </AdminLayout>
    );
}
