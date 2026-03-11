"use client";

import Image from "next/image";
import { CheckCircle, Smartphone, Lock } from "lucide-react";

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
          Your course has been successfully purchased.  
          To access your course content, please download the Dikshant IAS mobile app.
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
            Your <span className="font-semibold">password is your registered mobile number</span>.
          </p>

          <p className="text-gray-600 mt-2">
            For security purposes, we strongly recommend resetting your password
            after logging in to the app.
          </p>
        </div>

        {/* Help Section */}
        <div className="text-gray-500 text-sm">
          If you face any issues accessing your course, please contact support.
        </div>

      </div>
    </div>
  );
};

export default Page;