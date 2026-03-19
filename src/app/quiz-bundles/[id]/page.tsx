import BunldeDetails from '@/component/bundle/BunldeDetails'
import React from 'react'

const page = ({params}) => {
  return <BunldeDetails id={params.id}/>
}

export default page