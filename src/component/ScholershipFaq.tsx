"use client";
import { useState } from "react";
import { ChevronDown, ChevronUp, CheckCircle2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";

interface FaqItem {
  id: number;
  title: string;
  key: string;
  content: string[];
}

export default function ScholarshipFaq() {
  const { t } = useTranslation("common");
  const [active, setActive] = useState<number | null>(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedScholarship, setSelectedScholarship] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // From i18n translation
  const faqsRaw = t("scholarshipDetails.faq", { returnObjects: true });
  const faqs: FaqItem[] = Array.isArray(faqsRaw) ? (faqsRaw as FaqItem[]) : [];
  const applyNowText = t("scholarshipDetails.applyNow");
  const scholarshipShortMap = t("scholarshipShortMap", { returnObjects: true }) as Record<string, string>;

  const toggleAccordion = (id: number) => setActive(active === id ? null : id);
  const openModal = (key: string) => {
    setSelectedScholarship(key);
    setIsModalOpen(true);
  };
  const closeModal = () => setIsModalOpen(false);

  // Form select options
  const genderOptions = ["Male", "Female", "Other"];
  const categoryOptions = ["SC / ST", "OBC", "Girl", "Minorities", "EWS", "General", "Defence Ward"];
  const courseOptions = ["General Studies", "BPSC", "UPPSC", "Others"];
  const mediumOptions = ["Hindi", "English", "Others"];

  // Handle submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const res = await fetch("/api/admin/scholarship", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (data.success) {
        setSuccessMessage(data.message || "Application submitted successfully!");
        form.reset();
      } else {
        toast.error(data.message || "Submission failed");
      }


    } catch {
      toast.error("Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  // Conditional fields
  const renderFormFields = () => {
    const prog = (selectedScholarship || "").toLowerCase();

    return (
      <>
        {/* Full Name */}
        <div>
          {/* <label className="block text-gray-700 font-semibold mb-1">
            Full Name <span className="text-red-600">*</span>
          </label> */}
          <input
            name="name"
            type="text"
            placeholder="Enter your full name"
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-1 focus:ring-red-500 focus:border-red-500 transition-all outline-none"
          />
        </div>

        {/* Mobile Number */}
        <div>
          {/* <label className="block text-gray-700 font-semibold mb-1">
            Mobile Number <span className="text-red-600">*</span>
          </label> */}
          <input
            name="phone"
            type="tel"
            placeholder="Enter your mobile number"
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-1 focus:ring-red-500 focus:border-red-500 transition-all outline-none"
          />
        </div>

        {/* Programme-related fields in grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Gender */}
          <div>
            {/* <label className="block text-gray-700 font-semibold mb-1">
              Gender <span className="text-red-600">*</span>
            </label> */}
            <select
              name="gender"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white focus:ring-1 focus:ring-red-500 focus:border-red-500 transition-all outline-none"
            >
              <option value="">Select Gender</option>
              {genderOptions.map((g) => (
                <option key={g}>{g}</option>
              ))}
            </select>
          </div>

          {/* Category - only for Programme 1 & 2 */}
          {(prog === "p1" || prog === "p2" || prog === "programme1" || prog === "programme2") && (
            <div>
              {/* <label className="block text-gray-700 font-semibold mb-1">
                Category <span className="text-red-600">*</span>
              </label> */}
              <select
                name="category"
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white focus:ring-1 focus:ring-red-500 focus:border-red-500 transition-all outline-none"
              >
                <option value="">Select Category</option>
                {categoryOptions.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
          )}

          {/* Course */}
          <div>
            {/* <label className="block text-gray-700 font-semibold mb-1">
              Course <span className="text-red-600">*</span>
            </label> */}
            <select
              name="course"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white focus:ring-1 focus:ring-red-500 focus:border-red-500 transition-all outline-none"
            >
              <option value="">Select Course</option>
              {courseOptions.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Medium */}
          <div>
            {/* <label className="block text-gray-700 font-semibold mb-1">
              Medium <span className="text-red-600">*</span>
            </label> */}
            <select
              name="medium"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white focus:ring-1 focus:ring-red-500 focus:border-red-500 transition-all outline-none"
            >
              <option value="">Select Medium</option>
              {mediumOptions.map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Certificate Upload (For Programme 1 & 2 Only) */}
        {(prog === "p1" || prog === "p2" || prog === "programme1" || prog === "programme2") && (
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-4 shadow-sm">
            <label className="block text-gray-800 font-semibold text-lg mb-1">
              Upload Certificate <span className="text-red-600">*</span>
            </label>
            <p className="text-sm text-gray-600 mb-3 italic">
              (Please upload your caste / income / other valid certificate)
            </p>
            <input
              type="file"
              name="certificate"
              accept=".jpg,.jpeg,.png,.pdf"
              required
              className="block w-full text-sm text-gray-700 
                border border-gray-300 rounded-lg cursor-pointer 
                bg-white file:mr-4 file:py-2 file:px-4 
                file:rounded-lg file:border-0 
                file:bg-red-600 file:text-white 
                hover:file:bg-red-700 focus:outline-none 
                focus:ring-1 focus:ring-red-500 transition-all"
            />
          </div>
        )}

        {/* Candidate Photo Upload */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 shadow-sm">
          <label className="block text-gray-800 font-semibold text-lg mb-1">
            Upload Candidate Photo <span className="text-red-600">*</span>
          </label>
          <p className="text-sm text-gray-600 mb-3 italic">
            (Upload a clear, recent passport-size photo — JPG or PNG only)
          </p>
          <input
            type="file"
            name="photo"
            accept=".jpg,.jpeg,.png"
            required
            className="block w-full text-sm text-gray-700 
              border border-gray-300 rounded-lg cursor-pointer 
              bg-white file:mr-4 file:py-2 file:px-4 
              file:rounded-lg file:border-0 
              file:bg-red-600 file:text-white 
              hover:file:bg-red-700 focus:outline-none 
              focus:ring-1 focus:ring-red-500 transition-all"
          />
        </div>

      </>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-0">
      {/* FAQ Accordion */}
      {faqs.map((faq) => (
        <div key={faq.id} className="mb-3 bg-[#f0f4f8] rounded-lg shadow-sm">
          <button
            onClick={() => toggleAccordion(faq.id)}
            className="w-full flex justify-between items-center text-left px-5 py-3 font-semibold text-gray-900 hover:bg-gray-100 rounded-t-lg"
          >
            {faq.title}
            {active === faq.id ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
          </button>

          {active === faq.id && (
            <div className="px-5 pb-4 text-gray-700">
              <p>{faq.content[0]}</p>
              <button
                onClick={() => openModal(faq.key)}
                className="mt-4 bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700 transition"
              >
                {applyNowText}
              </button>
            </div>
          )}
        </div>
      ))}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl md:max-w-4xl relative flex flex-col max-h-[90vh]">

            {/* Modal Header */}
            <div className="bg-red-600 text-white p-6 flex-shrink-0 relative">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setSuccessMessage(null);
                }}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white text-red-600 hover:bg-gray-200 hover:text-red-700 shadow transition"
              >
                ✕
              </button>
              <h2 className="text-2xl font-bold mb-1">{applyNowText}</h2>
             <p className="text-white text-opacity-90">
                {t("scholarshipDetails.applyFor")}{" "}
                <span className="font-semibold">
                  {t(`scholarshipShortMap.${selectedScholarship || "p1"}`)}
                </span>
              </p>

            </div>

            {/* Conditional Content */}
            {successMessage ? (
              <div className="flex-1 flex flex-col items-center justify-center p-10 text-center space-y-5 animate-fadeIn">
                <div className="bg-green-100 p-4 rounded-full">
                  <CheckCircle2 className="text-green-600 w-16 h-16 animate-scaleIn" />
                </div>

                <h3 className="text-2xl font-bold text-gray-800 tracking-wide">
                  Thank You!
                </h3>
                <p className="text-gray-600 text-lg font-semibold text-center tracking-wide">
                  {successMessage}
                </p>



              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="flex-1 overflow-y-auto px-6 py-4 space-y-4"
                encType="multipart/form-data"
              >
                <input
                  type="hidden"
                  name="scholarship"
                  value={scholarshipShortMap[selectedScholarship || "p1"]}
                />
                {renderFormFields()}

                {/* Buttons */}
                <div className="flex justify-end gap-3 mt-4 border-t pt-4 sticky bottom-0 bg-white">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-5 py-2 rounded bg-gray-200 text-gray-800 font-medium hover:bg-gray-300 transition"
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`px-5 py-2 rounded text-white font-semibold shadow-md ${isLoading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-red-600 hover:bg-red-700"
                      }`}
                  >
                    {isLoading ? "Submitting..." : "Submit"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
