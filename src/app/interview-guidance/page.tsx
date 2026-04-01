"use client";
import React from "react";
import { useTranslation } from "react-i18next";

export default function InterviewGuidance() {
    const { i18n } = useTranslation("common");
    const language = i18n.language || "en";
    return (
        <div>
            <div className="max-w-5xl mx-auto p-6 bg-white ">
                {language === "en" ? (
                    <div>
                        {/* Heading */}
                        <h1 className="text-xl font-bold uppercase mb-4">INTERVIEW GUIDANCE</h1>
                        <h2 className="text-2xl font-semibold mb-6">Dikshant IAS: Interview Guidance Programme (IGP)</h2>

                        <div className="border-t-4 border-gray-800 my-6"></div>

                        {/* Intro */}
                        <p className="italic mb-4">&quot;Your Knowledge has been tested; now it&apos;s time to showcase your Personality.&quot;</p>

                        <p className="mb-6">
                            The UPSC and State PSC interview is not just a test of facts, but an assessment of your
                            administrative traits, decision-making skills, and mental composure. Our programme is crafted to
                            help you present the best version of yourself to the board.
                        </p>

                        <hr className="my-6" />

                        {/* Key Features */}
                        <h3 className="text-lg font-semibold mb-4">Key Features of the Programme</h3>

                        <ul className="list-disc pl-6 space-y-2">
                            <li><b>DAF Analysis (Detailed Application Form):</b> In-depth scrutiny of every word in your DAF to identify potential high-yield questions.</li>
                            <li><b>Mock Interview Panels:</b> Experience real-time simulation with a board consisting of Retired IAS/IPS Officers and Subject Matter Experts.</li>
                            <li><b>Video Feedback Analysis:</b> Record and review your mock sessions with mentors to refine your body language, tone, and delivery.</li>
                            <li><b>Current Affairs Briefing:</b> Exclusive sessions on high-priority national and international issues from an interview perspective.</li>
                            <li><b>State-Specific Sessions:</b> Detailed guidance on your home state’s culture, economy, and administrative challenges.</li>
                            <li><b>Personality Grooming:</b> Specialized tips on dress code, entry etiquette, eye contact, and stress management.</li>
                            <li><b>One-on-One Mentorship:</b> Direct sessions to address personal inhibitions and build unwavering confidence.</li>
                        </ul>

                        <hr className="my-6" />

                        {/* Why Choose */}
                        <h3 className="text-lg font-semibold mb-4">Why Choose Our Panel?</h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 border">
                            <div className="border p-4">
                                <h4 className="font-semibold mb-2">Veteran Bureaucrats</h4>
                                <p>Gain insights from former UPSC/PSC board members.</p>
                            </div>
                            <div className="border p-4">
                                <h4 className="font-semibold mb-2">Psychological Insights</h4>
                                <p>Feedback on your behavioral reflexes and confidence levels.</p>
                            </div>
                            <div className="border p-4">
                                <h4 className="font-semibold mb-2">Subject Experts</h4>
                                <p>Guidance on complex issues of Diplomacy, Economy, and Governance.</p>
                            </div>
                        </div>

                        <hr className="my-6" />

                        {/* Registration */}
                        <h3 className="text-lg font-semibold mb-4">Registration & Enrollment</h3>

                        <ul className="list-disc pl-6 space-y-2">
                            <li><b>Eligibility:</b> Candidates who have cleared the UPSC / State PSC Mains examination.</li>
                            <li><b>Registration:</b> Open Now (Submit your DAF for a personalized questionnaire).</li>
                            <li><b>Mode:</b> Available both Offline (Face-to-Face) and Online (Via Zoom/Google Meet).</li>
                            <li><b>Masterclass:</b> &quot;How to Impress the Board&quot; – A special session by Senior Bureaucrats.</li>
                        </ul>

                        <div className="border-t-4 border-gray-800 my-6"></div>

                        <p className="mb-6"><b>Venue:</b> Dikshant IAS Main Centre (or Online).</p>

                    </div>
                ) : (
                    <div>
                        {/* Hindi Section */}
                        <h2 className="text-2xl font-semibold mb-4">दिक्षांत IAS: इंटरव्यू गाइडेंस प्रोग्राम (IGP)</h2>

                        <p className="italic mb-4">&quot;ज्ञान का परीक्षण हो चुका है, अब बारी है आपके व्यक्तित्व की&quot;</p>

                        <p className="mb-6">
                            साक्षात्कार केवल आपके ज्ञान की जांच नहीं है, बल्कि यह आपके प्रशासनिक कौशल, निर्णय लेने
                            की क्षमता और आपके व्यक्तित्व के संपूर्ण का परीक्षण है। हमारा कार्यक्रम आपको बोर्ड के
                            सामने आत्मविश्वास के साथ प्रस्तुत होने के लिए तैयार करता है।
                        </p>

                        <h3 className="text-lg font-semibold mb-4">कार्यक्रम की मुख्य विशेषताएं (Key Features)</h3>

                        <ul className="list-disc pl-6 space-y-2">
                            <li><b>DAF विश्लेषण (Detailed Application Form):</b> आपके DAF के एक-एक शब्द का गहन विश्लेषण और उस पर आधारित संभावित प्रश्नों की सूची।</li>
                            <li><b>मॉक इंटरव्यू (Mock Interviews):</b> सेवानिवृत्त IAS/IPS अधिकारियों और विषय विशेषज्ञों के पैनल के साथ वास्तविक इंटरव्यू जैसा अनुभव।</li>
                            <li><b>वीडियो विश्लेषण:</b> आपके मॉक इंटरव्यू की रिकॉर्डिंग का विशेषज्ञों के साथ विश्लेषण, ताकि आप अपनी बॉडी लैंग्वेज और बोलने की शैली में सुधार कर सकें।</li>
                            <li><b>करेंट अफेयर्स ब्रीफिंग:</b> साक्षात्कार के दृष्टि से महत्वपूर्ण राष्ट्रीय और अंतरराष्ट्रीय मुद्दों पर विशेष चर्चा।</li>
                            <li><b>राज्य-विशिष्ट कक्षाएं:</b> आपके गृह राज्य की संस्कृति, अर्थव्यवस्था और प्रशासनिक मुद्दों पर केंद्रित चर्चा।</li>
                            <li><b>पर्सनालिटी ग्रूमिंग:</b> ड्रेस कोड, बैठने का तरीका, आई-कॉन्टैक्ट और तनाव प्रबंधन (Stress Management) पर विशेष टिप्स।</li>
                            <li><b>वन-ऑन-वन मेंटरशिप:</b> व्यक्तिगत कमियों को दूर करने के लिए सीनियर मेंटर्स के साथ सीधी सलाह।</li>
                        </ul>

                        <hr className="my-6" />

                        <h3 className="text-lg font-semibold mb-4">हमारे पैनल की विशेषता</h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 border">
                            <div className="border p-4">
                                <h4 className="font-semibold mb-2">अनुभवी नौकरशाह</h4>
                                <p>बोर्ड के नजरिए को समझने के लिए पूर्व UPSC/PSC बोर्ड सदस्य।</p>
                            </div>
                            <div className="border p-4">
                                <h4 className="font-semibold mb-2">मनोवैज्ञानिक विश्लेषण</h4>
                                <p>आपके आत्मविश्वास और प्रतिक्रियात्मक व्यवहार (Reflexes) पर फीडबैक।</p>
                            </div>
                            <div className="border p-4">
                                <h4 className="font-semibold mb-2">विषय विशेषज्ञ</h4>
                                <p>कूटनीति, अर्थशास्त्र और शासन व्यवस्था के विषयों का मार्गदर्शन।</p>
                            </div>
                        </div>

                        <hr className="my-6" />

                        <h3 className="text-lg font-semibold mb-4">पंजीकरण एवं विवरण (Registration Details)</h3>

                        <ul className="list-disc pl-6 space-y-2">
                            <li><b>पात्रता:</b> UPSC / State PSC मुख्य परीक्षा (Mains) उत्तीर्ण अभ्यर्थी।</li>
                            <li><b>पंजीकरण:</b> आज ही अपना DAF जमा करें।</li>
                            <li><b>सत्र का प्रकार:</b> ऑनलाइन और ऑफलाइन (आमने-सामने) दोनों विकल्प उपलब्ध।</li>
                            <li><b>विशेष सत्र:</b> &quot;बोर्ड को कैसे प्रभावित करें&quot; - सीनियर ब्यूरोक्रेट्स द्वारा।</li>
                        </ul>

                        <p className="mt-6"><b>स्थान:</b> दिक्षांत IAS मुख्य केंद्र (या ऑनलाइन ज़ूम सत्र)।</p>

                    </div>
                )}
            </div>
        </div>
    );
}
