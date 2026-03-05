import type { Metadata } from "next";
import AdminLogin from "./AdminLogin";

export const metadata: Metadata = {
  title: "Admin Login - Dikshant IAS",
  description: "Restricted admin access only.",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function Page() {
  return <AdminLogin />;
}
