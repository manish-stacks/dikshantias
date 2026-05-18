import axiosInstance from "@/lib/axios";

import { messaging } from "@/lib/firebase";

import { getToken } from "firebase/messaging";

export const requestNotificationPermission =
  async () => {

    try {

      // =========================
      // CLIENT CHECK
      // =========================

      if (
        typeof window === "undefined"
      ) {
        return null;
      }

      // =========================
      // SAFARI / IPHONE BLOCK
      // =========================

      const isIphoneSafari =

        /iP(hone|ad|od)/.test(
          navigator.userAgent
        ) &&
        /Safari/.test(
          navigator.userAgent
        );

      if (isIphoneSafari) {

        console.log(
          "⚠️ iPhone Safari - notifications disabled"
        );

        return null;

      }

      // =========================
      // NOTIFICATION SUPPORT
      // =========================

      if (
        !("Notification" in window)
      ) {

        console.log(
          "❌ Notifications unsupported"
        );

        return null;

      }

      // =========================
      // REQUEST PERMISSION
      // =========================

      const permission =

        await Notification.requestPermission();

      if (
        permission !== "granted"
      ) {

        console.log(
          "❌ Notification denied"
        );

        return null;

      }

      // =========================
      // MESSAGING CHECK
      // =========================

      if (!messaging) {

        console.log(
          "❌ Messaging unavailable"
        );

        return null;

      }

      // =========================
      // DEVICE ID
      // =========================

      const device_id =

        localStorage.getItem(
          "device_id"
        ) ||

        crypto.randomUUID();

      localStorage.setItem(
        "device_id",
        device_id
      );

      // =========================
      // TOKEN
      // =========================

      const token = await getToken(messaging, {
      vapidKey: "BLngoYOEgtCvt5U4UcVZBGVHBD3imA3fAT-ez-3amh59aY2gblwRPuipLj5QrwTOBG8Wll3g8PVEcmDs9tTQfgo",
    });

        await getToken(
          messaging,
          {
            vapidKey: "",
          }
        );

      if (!token) {

        console.log(
          "❌ No token received"
        );

        return null;

      }

      console.log(
        "✅ FCM Token:",
        token
      );

      // =========================
      // API
      // =========================

      await axiosInstance.post(
        "/auth/update-fcm-token",
        {
          fcm_token: token,
          device_id,
          platform: "web",
        }
      );

      return token;

    } catch (error) {

      console.error(
        "❌ Notification setup error:",
        error
      );

      return null;

    }

  };