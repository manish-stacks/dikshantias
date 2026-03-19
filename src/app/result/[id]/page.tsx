import ResultDetailPage from '@/component/test-series/Result'
import React from 'react'

const page = ({ params }) => {
    return <ResultDetailPage submissionId={params.id} />
}

export default page