import type { Metadata } from "next";
import { SEO_DATA } from "@/lib/seo";
import HoliOfferPage from "@/component/summeroffer/HoliOfferPage";

export const metadata: Metadata = SEO_DATA["/summer-offer"];

export default function Page() {
  return <HoliOfferPage />;
}
