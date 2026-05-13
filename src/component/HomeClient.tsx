"use client";

import {
  useEffect,
  useState,
} from "react";

import dynamic from "next/dynamic";

import {
  requestNotificationPermission,
} from "@/hooks/use-notification";

import {
  onMessage,
} from "firebase/messaging";

import { messaging } from "@/lib/firebase";

import NotificationModal from
  "@/components/NotificationModal/NotificationModal";

// Lazy Components
const HomePopup = dynamic(
  () => import("@/component/HomePopup"),
  {
    ssr: false,
  }
);

const TopperReview = dynamic(
  () =>
    import(
      "@/component/home/TopperReview"
    )
);

const Testimonials = dynamic(
  () =>
    import(
      "@/component/home/Testimonials"
    )
);

const OurProudAchivement =
  dynamic(
    () =>
      import(
        "@/component/home/OurProudAchivement"
      )
  );

const FeatureUpsc = dynamic(
  () =>
    import(
      "@/component/home/FeatureUpsc"
    )
);

const DirectorMessage = dynamic(
  () =>
    import(
      "@/component/home/DirectorMessage"
    )
);

const BestIasCoaching = dynamic(
  () =>
    import(
      "@/component/home/BestIasCoaching"
    )
);

const TabBestIasCoachingCenter =
  dynamic(
    () =>
      import(
        "@/component/home/TabBestIasCoachingCenter"
      )
  );

const DailyBlog = dynamic(
  () => import("@/component/DailyBlog")
);

export default function HomeClient() {

  const [
    openModal,
    setOpenModal,
  ] = useState(false);

  const [
    notificationData,
    setNotificationData,
  ] = useState<any>(null);

  useEffect(() => {

    if (
      "serviceWorker" in navigator
    ) {

      navigator.serviceWorker.register(
        "/firebase-messaging-sw.js"
      );

    }

  }, []);

  useEffect(() => {

    requestNotificationPermission();

  }, []);

  useEffect(() => {

    const unsubscribe = onMessage(
      messaging,
      async (payload) => {

        const title =
          payload.notification?.title;

        const body =
          payload.notification?.body;

        setNotificationData({
          title,
          body,
        });

        setOpenModal(true);

      }
    );

    return () => unsubscribe();

  }, []);

  return (
    <>
      <NotificationModal
        open={openModal}
        data={notificationData}
        onClose={() =>
          setOpenModal(false)
        }
      />

      <HomePopup />

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