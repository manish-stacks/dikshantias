importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js");

firebase.initializeApp({
    apiKey: "AIzaSyBXKqG4KT5vMipvobLf9YTUlIb2fyj4WBA",
    authDomain: "dikhshant-e3b6b.firebaseapp.com",
    projectId: "dikhshant-e3b6b",
    storageBucket: "dikhshant-e3b6b.firebasestorage.app",
    messagingSenderId: "1017659561006",
    appId: "1:1017659561006:web:60d55c57f27a1c7b38fbbf",
    measurementId: "G-9DBD67FMEN"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("📩 Background message:", payload);

  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/favicon.ico",
  });
});