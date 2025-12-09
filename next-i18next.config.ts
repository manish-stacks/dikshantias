import path from "path";
/** @type {import('next-i18next').UserConfig} */
const nextI18NextConfig = {
  i18n: {
    defaultLocale: "en",
    locales: ["en", "hi"], 
  },
  localePath: path.resolve("./public/locales"),
};

export default nextI18NextConfig;



