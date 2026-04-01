"use client";
import React from "react";
import { useTranslation } from "react-i18next";

export default function MainsCorner() {
    const { i18n } = useTranslation("common");
    const language = i18n.language || "en";
    return (
        <>
            <div className="container mx-auto px-2 mt-2 md:mt-2 md:px-0">

                {language === "en" ? (
                    <div className="max-w-5xl mx-auto p-6 text-[16px] leading-6 text-black font-serif bg-white">
                        <h2 className="font-bold text-2xl mb-2">
                            Mains Corner
                        </h2>
                        <p className="italic mb-2">
                            &ldquo;The Mains exam is not a test of information, but a showcase of your analytical prowess and administrative temperament.&rdquo;
                        </p>

                        <p className="mb-4">
                            The UPSC/State PSC Mains is the most critical stage of your journey. It demands a transition
                            from <span className="font-bold">recognition</span> (choosing the right answer) to <span className="font-bold">reproduction</span> (crafting a coherent argument).
                            At Dikshant IAS, we simplify this transition with a structured, multi-dimensional approach.

                        </p>

                        <hr className="border-black my-3" />

                        {/* Fundamentals */}
                        <h3 className="font-bold mb-2">
                            The Fundamentals: Mains Strategy
                        </h3>

                        <table className="w-full border border-black border-collapse text-sm mb-4">
                            <thead>
                                <tr>
                                    <th className="border border-black p-2 bg-gray-100 text-left">
                                        The Don&apos;s
                                    </th>
                                    <th className="border border-black p-2 bg-gray-100 text-left">
                                        The Don&apos;ts
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="border border-black p-2">
                                        <span className="font-bold">Understand the Directive</span>: Address what is asked
                                        (Discuss vs. Evaluate).
                                    </td>
                                    <td className="border border-black p-2">
                                        <span className="font-bold">Avoid &quot;Information Dumping&quot;</span>: Don&apos;t
                                        write everything you know; write what is
                                        relevant.
                                    </td>
                                </tr>
                                <tr>
                                    <td className="border border-black p-2">
                                        <span className="font-bold">Multi-Dimensionality</span>: Use the <span className="font-bold">PESTLE-H</span>
                                        framework for every answer.
                                    </td>
                                    <td className="border border-black p-2">
                                        <span className="font-bold">Avoid Extremism</span>: Never take a radical or
                                        unconstitutional stance.
                                    </td>
                                </tr>
                                <tr>
                                    <td className="border border-black p-2">
                                        <span className="font-bold">Data-Backed Arguments</span>: Use NITI Aayog
                                        reports, Economic Survey, and Supreme Court
                                        judgments.
                                    </td>
                                    <td className="border border-black p-2">
                                        <span className="font-bold">Don&apos;t Ignore Presentation</span>: Avoid long,
                                        dense paragraphs; use bullets and diagrams.
                                    </td>
                                </tr>
                            </tbody>
                        </table>


                        <h3 className="font-bold mb-2">
                            Strategic Syllabus Segregation: Core vs. Peripheral
                        </h3>

                        <p className="mb-2">
                            You cannot master 100% of the syllabus. The secret lies in selective intensity:
                        </p>

                        <ul className="list-disc pl-6 mb-3">
                            <li>
                                <b>Core Areas (High ROI): </b>These subjects appear every year and require in-depth
                                conceptual clarity.
                                <ul className="list-disc pl-6 mt-1">
                                    <li>GS I: Modern History, Physical Geography, Indian Society.</li>
                                    <li>GS II: Constitutional Articles, Governance, International Relations.</li>
                                    <li>GS III: Agriculture, Economy (Infrastructure & Banking), Internal Security.</li>
                                </ul>
                            </li>
                        </ul>

                        <hr className="border-black my-3" />

                        <ul className="list-disc pl-6 mb-4">
                            <li>
                                <b>Peripheral Areas:</b> World History, Post-Independence India, certain parts of Culture.
                                Cover these through summaries and previous year questions (PYQs) once core areas are
                                secure.
                            </li>
                        </ul>

                        <hr className="border-black my-3" />

                        {/* Answer Structure */}
                        <h3 className="font-bold mb-2">
                            The Architecture of a Model Answer
                        </h3>

                        <p className="mb-2">
                            Every answer should be a journey for the examiner, following this structural flow:
                        </p>

                        <ol className="list-decimal pl-6 mb-4 space-y-1">
                            <li>
                                <b>Contextual Introduction:</b> Define the term or mention a recent news event related to the
                                question.
                            </li>
                            <li>
                                <b>The Body (The Analysis):</b>
                                <ul className="list-disc pl-6 mt-1">
                                    <li>Use sub-headings to make the answer scannable.</li>
                                    <li>Incorporate flowcharts or maps to save words and increase impact.</li>
                                    <li>Use the Known-to-New logic: start with established facts and move to your
                                        unique analysis.</li>
                                </ul>
                            </li>
                            <li>
                                <b>The &quot;Silver Lining&quot; Conclusion:</b> End with a positive, solution-oriented outlook. As a
                                future bureaucrat, you must be a &quot;possibilist.&quot;
                            </li>
                        </ol>

                        <hr className="border-black my-3" />

                        {/* Directives */}
                        <h3 className="font-bold mb-2">
                            Deciphering the &quot;Directives&quot;: Directives (Question Tags)
                        </h3>

                        <p className="mb-2">
                            Aspirants often lose marks because they ignore the command word at the end of the question.
                        </p>

                        <ul className="list-disc pl-6 mb-4 space-y-1">
                            <li><b>Discuss:</b> Provide a broad, all-encompassing view, covering both pros and cons.</li>
                            <li><b>Critically Examine:</b> Go deep into the &quot;how&quot; and &quot;why,&quot; highlighting flaws and strengths
                                backed by evidence.
                            </li>
                            <li><b>Analyze:</b>  Break the concept into parts and explain the significance of each part
                                individually.</li>
                            <li><b>Evaluate/Assess:</b> Determine the &quot;value&quot; or success of a policy or statement. Did it work?
                                Why or why not?</li>
                        </ul>

                        <hr className="border-black my-3" />

                        {/* Power Moves */}
                        <h3 className="font-bold mb-2">
                            Subject-Specific &quot;Power Moves&quot;
                        </h3>

                        <ul className="list-disc pl-6 space-y-1">
                            <li><b>GS IV (Ethics):</b> In Case Studies, always identify the Stakeholders and the Ethical
                                Dilemma before proposing a solution.</li>
                            <li><b>GS III (S&T/Environment):</b> Focus on the &quot;Application&quot; of technology (e.g., how AI
                                helps in Agriculture) rather than just the theory.</li>
                            <li><b>Current Affairs Integration:</b> Use the &quot;Backward Linkage&quot; method. If a new bill is
                                passed, link it to the static Constitutional provisions in GS II.</li>
                        </ul>
                        <hr className="border-black my-3" />

                        {/* Power Moves */}
                        <h3 className="font-bold mb-2">
                            The Dikshant Drill: &quot;Read, Write, Refine&quot;
                        </h3>

                        <ul className="list-disc pl-6 space-y-1">
                            <li><b>Read:</b>  Stick to standard texts and limit your sources.</li>
                            <li><b>Write:</b>  Join our Daily Answer Writing (DAW) program.</li>
                            <li><b>Refine:</b> Use our expert feedback to reduce wordiness and improve &quot;hit-ratio&quot; on
                                keywords.   </li>
                        </ul>

                    </div>
                ) : (

                    <div className="max-w-5xl mx-auto p-6 text-[15px] leading-7 text-black font-serif bg-white">

                        {/* Title */}
                        <h1 className="text-xl font-bold mb-3">
                            दीक्षांत IAS: मेंस कॉर्नर (Mains Corner)
                        </h1>

                        {/* Quote */}
                        <p className="italic mb-3">
                            &quot;मुख्य परीक्षा केवल सूचनाओं का संचय नहीं, बल्कि उनके विश्लेषणात्मक प्रस्तुतिकरण की कला है।&quot;
                        </p>

                        <p className="mb-4">
                            UPSC मुख्य परीक्षा आपकी वैचारिक स्पष्टता, समस्या-समाधान दृष्टिकोण और समय प्रबंधन का वास्तविक परीक्षण है।
                            दीक्षांत IAS की यह रणनीति आपको भीड़ से अलग हटकर ‘चयनित सूची’ में स्थान दिलाने के लिए डिज़ाइन की गई है।
                        </p>

                        <hr className="border-black my-4" />

                        {/* Golden Rules */}
                        <h2 className="font-bold mb-3">
                            मुख्य परीक्षा के स्वर्णिम नियम (The Golden Rules)
                        </h2>

                        <table className="w-full border border-black border-collapse mb-6">
                            <thead>
                                <tr>
                                    <th className="border border-black p-2 text-left">
                                        क्या करें (Do&apos;s)
                                    </th>
                                    <th className="border border-black p-2 text-left">
                                        क्या न करें (Don&apos;ts)
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                <tr>
                                    <td className="border border-black p-2">
                                        प्रश्न की &quot;डिमांड&quot; को समझें और सीधे उत्तर दें।
                                    </td>
                                    <td className="border border-black p-2">
                                        अप्रासंगिक डेटा या &quot;फ्लोवरी भाषा&quot; से बचें।
                                    </td>
                                </tr>

                                <tr>
                                    <td className="border border-black p-2">
                                        उत्तर को बहुआयामी (Multidimensional) बनाएं।
                                    </td>
                                    <td className="border border-black p-2">
                                        केवल एक ही दृष्टिकोण (जैसे केवल राजनीतिक) न लिखें।
                                    </td>
                                </tr>

                                <tr>
                                    <td className="border border-black p-2">
                                        निरंतर उत्तर लेखन (Answer Writing) का अभ्यास करें।
                                    </td>
                                    <td className="border border-black p-2">
                                        बिना रूपरेखा (Framework) बनाए उत्तर लिखना शुरू न करें।
                                    </td>
                                </tr>

                                <tr>
                                    <td className="border border-black p-2">
                                        सरकारी रिपोर्ट्स और डेटा (जैसे Economic Survey) का प्रयोग करें।
                                    </td>
                                    <td className="border border-black p-2">
                                        व्यक्तित्वगत पूर्वाग्रह या अतिवादी विचारों को उत्तर में न लाएं।
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        <hr className="border-black my-4" />

                        {/* Core vs Peripheral */}
                        <h2 className="font-bold mb-3">
                            पाठ्यक्रम का रणनीतिक विभाजन: कोर बनाम परिधीय (Core vs Peripheral)
                        </h2>

                        <p className="mb-3">
                            मुख्य परीक्षा का पाठ्यक्रम विशाल है, इसलिए &quot;स्मार्ट वर्क&quot; अनिवार्य है:
                        </p>

                        <ul className="list-disc pl-6 space-y-2 mb-4">
                            <li>
                                <b>कोर क्षेत्र (Core Areas):</b> ये वे विषय हैं जहाँ से हर साल प्रश्न पूछे जाते हैं।
                                इन पर आपकी पकड़ गहन (Intensive) होनी चाहिए।

                                <ul className="list-disc pl-6 mt-2 space-y-1">
                                    <li><b>GS I:</b> आधुनिक इतिहास, भूगोल (मानव और भौतिक), भारतीय समाज।</li>
                                    <li><b>GS II:</b> भारतीय राजव्यवस्था (अनुच्छेद और वाद), शासन व्यवस्था, अंतर्राष्ट्रीय संबंध।</li>
                                    <li><b>GS III:</b> अर्थव्यवस्था (कृषि, बुनियादी ढांचा), आंतरिक सुरक्षा, आपदा प्रबंधन।</li>
                                </ul>
                            </li>

                            <li>
                                <b>परिधीय क्षेत्र (Peripheral Areas):</b> विश्व इतिहास, कला एवं संस्कृति के कुछ हिस्से।
                                इन्हें आप तुलनात्मक रूप से कम समय दे सकते हैं या मुख्य बिंदुओं तक सीमित रख सकते हैं।
                            </li>
                        </ul>

                        <hr className="border-black my-4" />

                        {/* Answer Writing */}
                        <h2 className="font-bold mb-3">
                            उत्तर लेखन की संरचना (The Architecture of a Model Answer)
                        </h2>

                        <ol className="list-decimal pl-6 space-y-2 mb-4">
                            <li>
                                <b>परिचय (Introduction):</b> परिभाषा दें या हालिया घटना से जोड़ें।
                            </li>
                            <li>
                                <b>मुख्य भाग (Body):</b>
                                <ul className="list-disc pl-6 mt-1">
                                    <li>उपशीर्षक (Subheadings) का प्रयोग करें</li>
                                    <li>फ्लोचार्ट/डायग्राम का उपयोग करें</li>
                                    <li>Known → New लॉजिक अपनाएं</li>
                                </ul>
                            </li>
                            <li>
                                <b>निष्कर्ष (Conclusion):</b> सकारात्मक और समाधान आधारित रखें (&quot;Silver Lining&quot;)
                            </li>
                        </ol>

                        <hr className="border-black my-4" />

                        {/* Directives */}
                        <h2 className="font-bold mb-3">
                            प्रश्नों के निर्देश शब्द (Deciphering the Directives)
                        </h2>

                        <ul className="list-disc pl-6 space-y-1 mb-4">
                            <li><b>Discuss:</b> सभी पहलुओं को कवर करें</li>
                            <li><b>Critically Examine:</b> गहराई + पक्ष और विपक्ष</li>
                            <li><b>Analyze:</b> भागों में विभाजित करें</li>
                            <li><b>Evaluate:</b> सफलता का आकलन करें</li>
                        </ul>

                        <hr className="border-black my-4" />

                        {/* Power Moves */}
                        <h2 className="font-bold mb-3">
                            विषय-विशिष्ट &quot;Power Moves&quot;
                        </h2>

                        <ul className="list-disc pl-6 space-y-1">
                            <li><b>GS IV:</b> Stakeholders और Ethical Dilemma पहचानें</li>
                            <li><b>GS III:</b> Technology के Application पर फोकस करें</li>
                            <li><b>Current Affairs:</b> Backward Linkage अपनाएं</li>
                        </ul>

                    </div>
                )}
            </div>
        </>
    );
}
