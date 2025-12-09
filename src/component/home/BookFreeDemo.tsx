'use client'
import Image from 'next/image'
import React from 'react'

function BookFreeDemo() {
    
    return (
        <>
            <section className="bg-[#ecf4fc] py-6 px-2 md:py-12 mt-10">
                <div className="container max-w-7xl mx-auto rounded-lg smx-auto items-center grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className='mb-0'>
                        <h2 className="text-xl md:text-6xl font-bold md:mb-5 text-gray-900 text-center md:text-start">Book Your <span className="text-[#f43144]"> Free Demo </span>Session</h2>
                        <p className="text-sm md:text-xl text-gray-900 md:mb-4 text-center md:text-start">
                            Limited Slots! Claim Your Free UPSC Strategy Session Today
                        </p>
                        <div className='flex justify-center md:justify-start'>
                            <button className="bg-[#fd7636] text-white px-6 py-3 rounded-lg mt-5 md-:mt-8 text-sm md:text-lg font-semibold hover:bg-[#0f172b] transition duration-300">
                                Book A Free Demo
                            </button>
                        </div>
                    </div>
                    <div className="flex justify-around items-center gap-3">
                        <Image src={"/img/book-free-demo2.webp"} alt="Book Free Demo" width={541} height={498} className="" />
                    </div>
                </div>

            </section>

        </>
    )
}

export default BookFreeDemo