import { initializeApp } from "firebase/app";
import { getMessaging, isSupported } from "firebase/messaging";
import { getAnalytics, isSupported as isAnalyticsSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBXKqG4KT5vMipvobLf9YTUlIb2fyj4WBA",
  authDomain: "dikhshant-e3b6b.firebaseapp.com",
  projectId: "dikhshant-e3b6b",
  storageBucket: "dikhshant-e3b6b.firebasestorage.app",
  messagingSenderId: "1017659561006",
  appId: "1:1017659561006:web:60d55c57f27a1c7b38fbbf",
  measurementId: "G-9DBD67FMEN",
};

const app = initializeApp(firebaseConfig);

// 🔥 SAFE ANALYTICS
let analytics: any = null;

if (typeof window !== "undefined") {
  isAnalyticsSupported().then((yes) => {
    if (yes) {
      analytics = getAnalytics(app);
      console.log("✅ Analytics initialized");
    } else {
      console.log("⚠️ Analytics not supported");
    }
  });
}

// 🔥 SAFE MESSAGING
let messaging: any = null;

if (typeof window !== "undefined") {
  isSupported().then((yes) => {
    if (yes) {
      messaging = getMessaging(app);
      console.log("✅ Messaging initialized");
    } else {
      console.log("⚠️ Messaging not supported");
    }
  });
}

export { app, analytics, messaging };