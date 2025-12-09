"use client";

import Header from "@/component/admin/Header";
import Sidebar from "@/component/admin/Sidebar";
import Footer from "@/component/admin/Footer";
import { usePathname } from "next/navigation";
import { Poppins } from "next/font/google";
import { Toaster } from "react-hot-toast";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Login page layout (no sidebar/header/footer)
  if (pathname === "/admin/login") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        {children}
      </div>
    );
  }

  return (
    <div className={`flex flex-col min-h-screen bg-gray-100 ${poppins.variable} font-sans`}>
      {/* Toaster for success/error messages */}
      <Toaster position="top-center" reverseOrder={false} />

      <Header />

      {/* Layout with sidebar + content */}
      <div className="flex flex-1">
        {/* Sidebar fixed */}
        <Sidebar />

        {/* Main content */}
        <main className="flex-1 p-6 ml-64 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Footer pushed to bottom */}
      <Footer />
    </div>
  );
}
