"use client";

import { CheckCircle, Smartphone, Lock, Phone, Mail } from "lucide-react";

const Page = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        {/* Success Icon */}
        <div className="flex justify-center mb-4">
          <CheckCircle className="text-green-500 w-16 h-16" />
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-bold text-[#040c33] mb-3">
          Course Purchased Successfully 🎉
        </h1>

        <p className="text-gray-600 mb-6">
          Your course has been successfully purchased. To access your course
          content, please download the Dikshant IAS mobile app.
        </p>

        {/* App Section */}
        <div className="bg-blue-50 rounded-xl p-6 mb-6">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Smartphone className="text-blue-600" />
            <span className="font-semibold text-lg text-blue-900">
              Download Dikshant IAS App
            </span>
          </div>

          <p className="text-gray-600 mb-4">
            Access all your purchased courses directly from our mobile app.
          </p>

          <a
            href="https://play.google.com/store/apps/details?id=in.kaksya.dikshant&hl=en_IN"
            target="_blank"
            className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg transition"
          >
            Download from Play Store
          </a>
        </div>

        {/* Login Info */}
        <div className="bg-yellow-50 rounded-xl p-6 mb-6">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Lock className="text-yellow-600" />
            <span className="font-semibold text-lg text-yellow-800">
              Login Information
            </span>
          </div>

          <p className="text-gray-700">
            Your{" "}
            <span className="font-semibold">
              password is your registered mobile number
            </span>
            .
          </p>

          <p className="text-gray-600 mt-2">
            For security purposes, we strongly recommend resetting your password
            after logging in to the app.
          </p>
        </div>

        {/* Help & Support Section */}
        <div className="bg-gray-50 rounded-xl p-6 mb-6 border border-gray-200">
          <p className="font-semibold text-gray-800 mb-4">
            For any Help &amp; Support — feel free to get in touch with us
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="flex items-center gap-2 text-gray-700">
              <Phone className="text-[#040c33] w-4 h-4" />
              <a
                href="tel:9354994539"
                className="hover:text-blue-600 transition font-medium"
              >
                9354994539
              </a>
              <span className="text-gray-400">|</span>
              <a
                href="tel:9312511015"
                className="hover:text-blue-600 transition font-medium"
              >
                9312511015
              </a>
            </div>

            <div className="flex items-center gap-2 text-gray-700">
              <Mail className="text-[#040c33] w-4 h-4" />
              <a
                href="mailto:info@dikshantias.com"
                className="hover:text-blue-600 transition font-medium"
              >
                info@dikshantias.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
