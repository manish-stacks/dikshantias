import { initializeApp } from "firebase/app";

import {
  getAnalytics,
  isSupported as isAnalyticsSupported,
} from "firebase/analytics";

import {
  getMessaging,
  isSupported as isMessagingSupported,
} from "firebase/messaging";

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

// =========================
// ANALYTICS
// =========================

let analytics: any = null;

if (typeof window !== "undefined") {

  isAnalyticsSupported()
    .then((supported) => {

      if (supported) {

        analytics =
          getAnalytics(app);

        console.log(
          "✅ Analytics initialized"
        );

      }

    })
    .catch((err) => {

      console.log(
        "Analytics error:",
        err
      );

    });

}

// =========================
// MESSAGING
// =========================

let messaging: any = null;

if (
  typeof window !== "undefined" &&
  "serviceWorker" in navigator &&
  "Notification" in window
) {

  isMessagingSupported()
    .then((supported) => {

      if (supported) {

        try {

          messaging =
            getMessaging(app);

          console.log(
            "✅ Messaging initialized"
          );

        } catch (err) {

          console.log(
            "Messaging init error:",
            err
          );

        }

      } else {

        console.log(
          "⚠️ Messaging not supported"
        );

      }

    })
    .catch((err) => {

      console.log(
        "Messaging support error:",
        err
      );

    });

}

export {
  app,
  analytics,
  messaging,
};