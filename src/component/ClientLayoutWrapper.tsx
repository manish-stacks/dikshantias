"use client";

import { usePathname } from "next/navigation";
import Header from "@/component/Header";
import Footer from "@/component/Footer";
import WhatsAppMessage from "@/component/calltoaction/WhatsAppMessage";
import CallButton from "@/component/calltoaction/CallButton";

export default function ClientLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  return (
    <>
      {!isAdmin && <Header />}
      {children}
      {!isAdmin && <Footer />}
      {!isAdmin && <WhatsAppMessage />}
      {!isAdmin && <CallButton />}
    </>
  );
}
