'use client'
import Image from 'next/image'
import React from 'react'


export default function ComingSoon() {
    return (
        <>                <div className='container  mx-auto my-0 px-2 -mt-14 md:mt-3 md:px-0'>
            <Image src="/img/coming-soon.jpg" width={1920} height={500} alt='About Us' className='rounded-xl' />
        </div>

        </>
    );
}