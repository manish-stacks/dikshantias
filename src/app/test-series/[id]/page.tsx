import TestSeriesDetailPage from '@/component/test-series/TestSeriesDetailPage'
import React from 'react'

const page = ({params}) => {
  return <TestSeriesDetailPage id={params.id}/>
}

export default page