"use client";

import { usePathname } from "next/navigation";
import Header from "@/component/Header";
import Footer from "@/component/Footer";

export default function ClientLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {

  const pathname = usePathname();

  const isAdmin =
    pathname?.startsWith("/admin");

  const isDashboard =
    pathname?.startsWith("/dashboard");

  return (

    <>

      {!isAdmin &&
        !isDashboard &&
        <Header />
      }

      {children}

      {!isAdmin &&
        <Footer />
      }

    </>

  );

}