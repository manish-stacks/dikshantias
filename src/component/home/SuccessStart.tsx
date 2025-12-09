'use client'
import Image from 'next/image'
import React from 'react'

function SuccessStart() {
    return (
        <>
            <section className="bg-[#ecf4fc] py-6 px-2 md:py-16 mt-4">
                <div className="container max-w-7xl mx-auto rounded-lg smx-auto items-center grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className='mb-0'>
                        <h2 className="text-xl md:text-3xl font-bold md:mb-5 text-gray-900">Success Starts with <span className="text-[#f43144]">  One Step</span></h2>
                        <p className="text-sm md:text-xl text-gray-900 md:mb-4">
                            Start learning with our curated programs driven by knowledge, ambition, and result.
                        </p>
                    </div>
                    <div className="flex justify-around items-center gap-3 -mt-[15px] md:mt-0">
                        <div className='bg-white w-full text-center p-5 md:p-10 rounded-lg shadow-md'>
                            <Image
                                src="/img/explore-all-programs.png"
                                alt="Success Start"
                                width={300}
                                height={300}
                                className="w-10 h-10 md:w-16 md:h-16 rounded-lg mx-auto" />
                                <h3 className='font-bold mt-2 text-gray-800 text-sm md:text-[16px]'>Explore All Programs</h3>
                        </div>
                        <div className='bg-white w-full text-center p-5 md:p-10 rounded-lg shadow-md'>
                            <Image
                                src="/img/elearning-cart.png"
                                alt="Success Start"
                                width={300}
                                height={300}
                                className="w-10 h-10 md:w-16 md:h-16 rounded-lg mx-auto" />
                                <h3 className='font-bold mt-2 text-gray-800 text-sm md:text-[16px]'>Enroll Now</h3>
                        </div>
                        
                    </div>
                </div>

            </section>

        </>
    )
}

export default SuccessStart