'use client'
import Image from 'next/image'
import React from 'react'

function AboutHero() {
    return (
        <>
            <div className='container max-w-7xl mx-auto my-4 px-2 -mt-14 md:mt-3 md:px-0'>
                <Image src="/img/about-us-hero.webp" width={1920} height={500} alt='About Us' className='rounded-xl' />
            </div>
        </>
    )
}

export default AboutHero