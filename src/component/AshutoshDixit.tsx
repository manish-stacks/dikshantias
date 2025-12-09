'use client'
import Image from 'next/image'
import React from 'react'

const AshutoshDixit = () => {
    return (
        <div className=" bg-white p-4 md:p-8 flex items-center justify-center">
            <div className="w-full max-w-7xl shadow-md rounded-lg overflow-hidden">
                {/* Cover Banner */}
                <div className="relative h-[150px] md:h-[400px] w-full">
                    <Image
                        src="/img/online-course/online-course-hero.webp"
                        alt="Banner"
                        layout="fill"
                        objectFit="cover"
                    />
                </div>

                {/* Profile Info */}
                <div className="p-6">
                    <div className="flex flex-col md:flex-row items-center md:items-start">
                        {/* Profile Image */}
                        <div className="relative -mt-20 w-24 h-24 md:w-40 md:h-40 border-4 border-white rounded-full overflow-hidden shadow-md">
                            <Image
                                src="/img/ashutosh-pandey.webp"
                                alt="Adrian Brewer"
                                layout="fill"
                                objectFit="cover"
                            />
                        </div>

                        {/* Name + Info */}
                        <div className="mt-2 md:mt-0 md:ml-6 text-center md:text-left">
                            <h1 className="text-xl font-semibold text-gray-900">Ashutosh Dixit</h1>
                            <p className="text-sm text-gray-600">B.Tech • IIT Dhanbad</p>
                            <p className="text-sm text-gray-600">Masters in Technology • IIT Kharagpur</p>
                            <p className="text-sm text-gray-500">MBA • XLRI Jamshedpur</p>
                        </div>

                        {/* Send Message Button */}
                        <div className="mt-4 md:mt-0 md:ml-auto">
                            <button className="bg-red-600 text-white text-sm px-4 py-2 rounded hover:bg-red-700 transition">
                                Send Message
                            </button>
                        </div>
                    </div>

                    {/* Tags */}
                    {/* <div className="mt-6 flex flex-wrap gap-2">
            <span className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded">UX Research</span>
            <span className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded">CX Strategy</span>
            <span className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded">Project Management</span>
          </div> */}

                </div>
                <div className="w-full p-5 max-w-7xl bg-blue-50 shadow-md rounded-lg overflow-hidden pb-15">

                    {/* About Me Section */}
                    <div className="mt-3">
                        <p className='text-gray-900 leading-relaxed'>Armed with degrees from India’s top institutions, Ashutosh Dixit developed a sharp analytical mind, an entrepreneurial vision, and a lifelong commitment to excellence—qualities that continue to define his leadership style.</p>
                        <h2 className="text-xl font-semibold text-gray-800 mb-2 mt-4">In the Corridors of Power and Purpose: The Journey of Ashutosh Dixit</h2>
                        <p className="text-gray-900 leading-relaxed">
                            From the boardrooms of global corporations to the classrooms of aspiring civil servants, Ashutosh Dixit has carved a unique path—where corporate excellence meets educational transformation. A visionary leader with a heart for public good, Ashutosh Dixit today stands as a mentor, strategist, and nation-builder, steering one of India’s most socially committed institutions—Dikshant Education Centre Private Limited.
                        </p>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2 mt-4">Corporate Journey with Global Impact</h3>
                        <p className="text-gray-900 leading-relaxed">Ashutosh’s professional journey is a case study in high-stakes leadership and innovation. He served in senior roles across global giants such as:</p>

                        <div className='w-full grid grid-cols-1 md:grid-cols-3 gap-5 content-between mt-6'>
                            <div className='bg-white card p-4 shadow-md text-center rounded-xl'>
                                <h3 className='font-bold text-xl'>Managing Director </h3>
                                <p>Operation @ Accenture</p>
                            </div>
                            <div className='bg-white card p-4 shadow-md text-center rounded-xl'>
                                <h3 className='font-bold text-xl'>Dy Managing Director </h3>
                                <p>South Asia @ A.P. Moller – Maersk</p>
                            </div>
                            <div className='bg-white card p-4 shadow-md text-center rounded-xl'>
                                <h3 className='font-bold text-xl'>Regional Head</h3>
                                <p>@ Maersk Logistics</p>
                            </div>
                        </div>
                        <div className='mt-6'>
                            <p className="text-gray-900 leading-relaxed">These roles not only honed his strategic insight and operational acumen but also exposed him to global best practices in leadership, scalability, and sustainable growth.</p>

                            <h3 className="text-xl font-semibold text-gray-800 mb-2 mt-4">The Pivot to Purpose: Leading Dikshant’s Mission</h3>

                            <p className="text-gray-900 leading-relaxed">In 2022, Ashutosh Dixit made a defining move—stepping away from the corporate world to take on the role of CEO at Dikshant Education Centre, Delhi. What drew him was not profit, but purpose. He joined hands with Shipra Pandey and Dr. S.S. Pandey to scale their mission of inclusive and ethical education.</p>

                            <ul className='mt-4'>
                                <li className='font-bold mb-2'>Under his leadership, Dikshant IAS has:</li>
                                <li>- Expanded outreach to underserved regions</li>
                                 <li>- Strengthened government collaborations</li>
                                 <li>- Integrated technology for rural access</li>
                                 <li>- Built systems for accountability, innovation, and measurable social impact</li>
                            </ul>

                            <h3 className="text-xl font-semibold text-gray-800 mb-2 mt-4">From Educator to Ecosystem Builder</h3>

                            <p className="text-gray-900 leading-relaxed">What makes Ashutosh Dixit truly exceptional is his ability to blend corporate discipline with grassroots empathy. At Dikshant, he leads not just as a CEO but as a mentor—guiding hundreds of civil service aspirants, especially from SC/ST/OBC and EWS backgrounds.</p>

                            <ul className='mt-4'>
                                <li className='font-bold mb-2'>He has championed:</li>
                                <li>- Scalable digital learning programs</li>
                                 <li>- Faculty development and accountability mechanisms</li>
                                 <li>- Alumni networks for peer mentorship</li>
                                 <li>- Data-driven analytics to improve success rates</li>
                            </ul>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2 mt-4">Skills That Drive the Vision</h3>

                            <ul className='mt-4'>
                                <li className='font-bold mb-2'>Ashutosh Dixit brings a rare mix of strategic and people-centric skills:</li>
                                <li>- Leadership & Business Strategy</li>
                                 <li>- Mentorship & Educator Mindset</li>
                                 <li>- Logistics & Supply Chain Expertise</li>
                                 <li>- Brand Management & Development</li>
                                 <li>- Operational Excellence & Analysis</li>
                            </ul>

                            <p className="text-gray-900 leading-relaxed">These strengths have made him an anchor in transition—guiding Dikshant IAS from a respected institute to a national movement of educational equity.</p>

                             <h3 className="text-xl font-semibold text-gray-800 mb-2 mt-4">Redefining Success: Not in Profits, But in Progress</h3>

                            <ul className='mt-4'>
                                <li className='font-bold mb-2'>For Ashutosh Dixit, the ultimate KPI is not revenue—but how many lives are transformed. His impact is visible:</li>
                                <li>- In the growing number of UPSC rank-holders from marginalized backgrounds</li>
                                 <li>- In the mental wellness initiatives for aspirants under stress</li>
                                 <li>- In the collaborations with ministries to widen opportunity pipelines</li>
                                 <li>- In the faith that students and parents now place in Dikshant IAS</li>
                            </ul>

                             <h3 className="text-xl font-semibold text-gray-800 mb-2 mt-4">A Visionary Leader with a Human Touch</h3>

                            <p className="text-gray-900 leading-relaxed">Ashutosh Dixit is not just managing an education company—he’s sculpting futures. His leadership continues to inspire other professionals to pivot from success to significance, proving that true nation-building lies in enabling others to rise.</p>
                            <p className="text-gray-900 leading-relaxed">“When we educate one student, we don&lsquo;t just create an officer. We create a ripple that touches a thousand lives.”</p>

                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default AshutoshDixit
