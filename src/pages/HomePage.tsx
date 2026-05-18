import GlobalBanner from "@/component/GlobalBanner";

import HeroSlider from "@/component/home/HeroSlider";

import HomeClient from "@/component/HomeClient";

export default function HomePage() {

  return (
    <>
      {/* FAST SERVER RENDER */}
      <GlobalBanner />

      <HeroSlider />

      {/* CLIENT COMPONENTS */}
      <HomeClient />
    </>
  );
}


