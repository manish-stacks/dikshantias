import type { Metadata } from "next";
import { SEO_DATA } from "@/lib/seo";
import NotificationsPage from '@/component/notifications/Notifications'
import React from 'react'

export const metadata: Metadata = SEO_DATA["/notifications"];

const page = () => {
  return <NotificationsPage/>
}

export default page