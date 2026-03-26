"use client";

import React, { useEffect, useState } from "react";

import DailyBlog from "@/component/DailyBlog";
import BestIasCoaching from "@/component/home/BestIasCoaching";
import DirectorMessage from "@/component/home/DirectorMessage";
import FeatureUpsc from "@/component/home/FeatureUpsc";
import HeroSlider from "@/component/home/HeroSlider";
import OurProudAchivement from "@/component/home/OurProudAchivement";
import TabBestIasCoachingCenter from "@/component/home/TabBestIasCoachingCenter";
import Testimonials from "@/component/home/Testimonials";
import TopperReview from "@/component/home/TopperReview";

import { requestNotificationPermission } from "@/hooks/use-notification";
import { onMessage } from "firebase/messaging";
import { messaging } from "@/lib/firebase";
import NotificationModal from "@/components/NotificationModal/NotificationModal";
import GlobalBanner from "@/component/GlobalBanner";
import HomePopup from "@/component/HomePopup";


function HomePage() {

  const [openModal, setOpenModal] = useState(false);
  const [notificationData, setNotificationData] = useState(null);

  // 🔔 Service Worker
  useEffect(() => {
    if (typeof window === "undefined") return;

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/firebase-messaging-sw.js");
    }
  }, []);

  // 🔔 Permission
  useEffect(() => {
    requestNotificationPermission();
  }, []);

  // 🔥 Foreground Notification Handler
  useEffect(() => {
    const unsubscribe = onMessage(messaging, async (payload) => {
      console.log("📩 Foreground message:", payload);

      const title = payload.notification?.title;
      const body = payload.notification?.body;

      // 📦 Open modal
      setNotificationData({ title, body });
      setOpenModal(true);

      // 🔔 System notification
      const reg = await navigator.serviceWorker.ready;
      reg.showNotification(title, {
        body,
        icon: "/favicon.ico",
      });
    });

    return () => unsubscribe();
  }, []);

  return (
    <>
      {/* 🔔 Notification Modal */}
      <NotificationModal
        open={openModal}
        data={notificationData}
        onClose={() => setOpenModal(false)}
      />
      <HomePopup/>
      <GlobalBanner/>
      <HeroSlider />
      <TopperReview />
      <Testimonials />
      <OurProudAchivement />
      <FeatureUpsc />
      <DirectorMessage />
      <BestIasCoaching />
      <TabBestIasCoachingCenter />
      <DailyBlog />
    </>
  );
}

export default HomePage;