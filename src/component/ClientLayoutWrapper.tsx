"use client";

import { usePathname } from "next/navigation";
import Header from "@/component/Header";
import Footer from "@/component/Footer";
import WhatsAppMessage from "@/component/calltoaction/WhatsAppMessage";
import CallButton from "@/component/calltoaction/CallButton";
import { useAuthStore } from "@/lib/store/auth.store";
import { SocketProvider } from "@/lib/socket";

export default function ClientLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuthStore();
  const pathname = usePathname();

  const isAdmin = pathname?.startsWith("/admin");
  const isDashboard = pathname?.startsWith("/dashboard");

  return (
    <SocketProvider userId={user?.id}>
      {!isAdmin && !isDashboard && <Header />}

      {children}

      {!isAdmin && <Footer />}
      {!isAdmin && <WhatsAppMessage />}
      {!isAdmin && <CallButton />}
    </SocketProvider>
  );
}