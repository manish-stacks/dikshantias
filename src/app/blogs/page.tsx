'use client'
import BlogPage from '@/component/BlogPage'
import React, { Suspense } from 'react'

function page() {
  return (
    <>
    <Suspense fallback={<div>Loading...</div>}>
    <BlogPage />
    </Suspense>
    </>
  )
}

export default page