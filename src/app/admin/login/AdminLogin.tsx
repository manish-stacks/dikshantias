"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Poppins } from "next/font/google";
import toast, { Toaster } from "react-hot-toast";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("adminToken", data.token);
        toast.success("Login successful!");
        setTimeout(() => {
          window.location.href = "/admin/dashboard";
        }, 500);
      } else {
        toast.error(data.message || "Login failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className={`${poppins.className} flex min-h-screen bg-gray-100`}>
      <Toaster position="top-center" reverseOrder={false} />

      <div className="flex flex-1 items-center justify-center p-6">
        <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md border border-gray-200">
          {/* Logo */}
          <div className="text-center mb-6">
            <Link href="/" className="inline-block">
              <Image
                src="/img/dikshant-logo.png"
                alt="Logo"
                width={160}
                height={100}
              />
            </Link>

            <p className="mt-3 text-gray-700 font-medium">
              Enter your credentials to login
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Email
              </label>

              <input
                type="email"
                placeholder="example@gmail.com"
                className="border border-gray-300 p-3 w-full rounded-xl focus:ring-2 focus:ring-[#e94e4e] focus:outline-none transition"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Password
              </label>

              <input
                type="password"
                placeholder="Enter your password"
                className="border border-gray-300 p-3 w-full rounded-xl focus:ring-2 focus:ring-[#e94e4e] focus:outline-none transition"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full py-3 bg-[#e94e4e] text-white font-semibold rounded-xl shadow-lg hover:bg-red-600 transition-all"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
