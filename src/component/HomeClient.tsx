"use client";

import {
  useEffect,
  useState,
} from "react";

import dynamic from "next/dynamic";

import {
  requestNotificationPermission,
} from "@/hooks/use-notification";

import NotificationModal from
  "@/components/NotificationModal/NotificationModal";

// =========================
// Lazy Components
// =========================

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
  () =>
    import(
      "@/component/DailyBlog"
    )
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

  // =========================
  // SAFE SERVICE WORKER
  // =========================

  useEffect(() => {

    if (
      typeof window !==
        "undefined" &&
      "serviceWorker" in
        navigator
    ) {

      navigator.serviceWorker
        .register(
          "/firebase-messaging-sw.js"
        )
        .catch((err) => {

          console.log(
            "Service worker error:",
            err
          );

        });

    }

  }, []);

  // =========================
  // SAFE NOTIFICATIONS
  // =========================

  useEffect(() => {

    const isIphoneSafari =

      /iP(hone|ad|od)/.test(
        navigator.userAgent
      ) &&
      /Safari/.test(
        navigator.userAgent
      );

    // ❌ SKIP SAFARI
    if (isIphoneSafari) {

      console.log(
        "Skipping notifications on iPhone Safari"
      );

      return;

    }

    requestNotificationPermission();

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