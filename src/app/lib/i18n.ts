"use client";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpBackend from "i18next-http-backend";

if (!i18n.isInitialized) {
  i18n
    .use(HttpBackend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      fallbackLng: "en",
      supportedLngs: ["en", "hi"],
      interpolation: { escapeValue: false },
      backend: {
        loadPath: "/locales/{{lng}}/{{ns}}.json",
      },
      detection: {
        order: ["localStorage", "cookie", "htmlTag"],
        caches: ["localStorage", "cookie"],
        lookupLocalStorage: "i18nextLng",
        lookupCookie: "i18nextLng",
      },
      react: {
        useSuspense: false, // ✅ prevents React suspense errors
        bindI18n: "loaded languageChanged", // ✅ re-render when translations load
        bindI18nStore: "added removed",
      },
      returnEmptyString: false,
      returnNull: false,
    });
}

export default i18n;
