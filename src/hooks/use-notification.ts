import axiosInstance from "@/lib/axios";
import { messaging } from "@/lib/firebase";
import { getToken } from "firebase/messaging";

export const requestNotificationPermission = async () => {
  try {
     if (typeof window === "undefined") return;
    // 🔔 Ask permission
    const permission = await Notification.requestPermission();

    if (permission !== "granted") {
      console.log("❌ Notification permission denied");
      return null;
    }

    // 📱 Generate device_id (unique for browser)
    const device_id = localStorage.getItem("device_id") || crypto.randomUUID();
    localStorage.setItem("device_id", device_id);

    // 🔑 Get FCM token
    const token = await getToken(messaging, {
      vapidKey: "BLngoYOEgtCvt5U4UcVZBGVHBD3imA3fAT-ez-3amh59aY2gblwRPuipLj5QrwTOBG8Wll3g8PVEcmDs9tTQfgo",
    });

    if (!token) {
      console.log("❌ No FCM token received");
      return null;
    }

    console.log("✅ FCM Token:", token);

    // 📦 Prepare payload
    const data = {
      fcm_token: token,
      device_id,
      platform: "web",
    };

    // 🚀 Send to backend
    await axiosInstance.post("/auth/update-fcm-token", data);

    return token;

  } catch (error) {
    console.error("❌ Notification setup error:", error);
    return null;
  }
};