
"use client";
import React from "react";
import { useTranslation } from "react-i18next";

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3 border-b pb-2">
            {title}
        </h2>
        <div className="text-gray-700 leading-relaxed">{children}</div>
    </div>
);

const EssayPage = () => {
    const { i18n } = useTranslation("common");
    const language = i18n.language || "en";
    return (
        <>
            {language === "en" ? (
                <div className="max-w-5xl mx-auto p-6 bg-white ">

                    {/* Header */}
                    <h1 className="text-3xl font-bold mb-4">Essay Writing</h1>

                    <p className="font-semibold mb-2">
                        Dikshant IAS — &quot;Precision in Thought, Excellence in Expression&quot;
                    </p>

                    <p className="text-gray-700 mb-6">
                        In the UPSC and State PSC landscape, the Essay paper is not just a test
                        of your vocabulary—it is a window into your personality, your analytical
                        depth, and your vision as a future administrator. At 250 marks, it is
                        often the single most significant factor in securing a top rank.
                    </p>

                    {/* Examination Blueprint */}
                    <Section title="Examination Blueprint">
                        <ul className="list-disc ml-6 space-y-2">
                            <li>
                                <strong>The Task:</strong> Write 2 essays within 3 hours.
                            </li>
                            <li>
                                <strong>Word Count:</strong> 1000–1200 words per essay.
                            </li>
                            <li>
                                <strong>The Structure:</strong> Choose one topic from Section A and
                                one from Section B.
                            </li>
                            <li>
                                <strong>The Goal:</strong> To exhibit a coherent, orderly, and
                                persuasive exposition on the given subject.
                            </li>
                        </ul>
                    </Section>

                    {/* Anatomy */}
                    <Section title="The Anatomy of a High-Scoring Essay">
                        <p className="mb-3">
                            A Dikshant-standard essay moves beyond mere data: it weaves a narrative.
                        </p>

                        <ol className="list-decimal ml-6 space-y-3">
                            <li>
                                <strong>The Captivating Intro:</strong> Start with a &quot;Hook&quot;. This
                                could be a poignant anecdote, a powerful quote, or a provocative
                                question that defines the thesis statement.
                            </li>
                            <li>
                                <strong>The Logical Body:</strong> Use &quot;Thematic Continuity&quot;.
                                <ul className="list-disc ml-6 mt-2">
                                    <li>Each paragraph should introduce one core idea.</li>
                                    <li>
                                        Transition smoothly from social issues to economic impacts using
                                        &quot;bridge sentences.&quot;
                                    </li>
                                </ul>
                            </li>
                            <li>
                                <strong>The Visionary Conclusion:</strong> Never end on a pessimistic
                                note. Conclude with a &quot;Silver Lining&quot; approach—summarizing your points
                                while offering a constructive, hopeful way forward for the nation.
                            </li>
                        </ol>
                    </Section>

                    {/* PESTLE */}
                    <Section title="The Multi-Dimensional Lens (PESTLE-H)">
                        <p className="mb-3">
                            To ensure your essay isn&apos;t one-dimensional, analyze every topic through
                            the PESTLE-H framework:
                        </p>

                        <ul className="list-disc ml-6 space-y-1">
                            <li>Political & Administrative</li>
                            <li>Economic & Financial</li>
                            <li>Socio-Cultural</li>
                            <li>Technological & Scientific</li>
                            <li>Legal & Constitutional</li>
                            <li>Environmental & Ecological</li>
                            <li>Historical & Ethical</li>
                        </ul>
                    </Section>

                    {/* 30 Min Rule */}
                    <Section title="The 30-Minute Blueprinting Rule">
                        <p className="mb-3">
                            Success is decided <strong>before</strong> the pen hits the answer sheet.
                            Spend the first 25–30 minutes on:
                        </p>

                        <ul className="list-disc ml-6 space-y-2">
                            <li>
                                <strong>Deconstructing the Topic:</strong> What is the examiner really
                                asking?
                            </li>
                            <li>
                                <strong>Brainstorming:</strong> Mapping out causes, consequences, and
                                stakeholders.
                            </li>
                            <li>
                                <strong>Outlining:</strong> Deciding the sequence of paragraphs to
                                ensure a &quot;Known-to-New&quot; flow.
                            </li>
                        </ul>
                    </Section>

                    {/* Ethics */}
                    <Section title="The Dikshant Ethics of Writing">
                        <ul className="list-disc ml-6 space-y-2">
                            <li>
                                <strong>Constitutional Morality:</strong> Your arguments must always
                                uphold the values of Equality, Justice, and Secularism.
                            </li>
                            <li>
                                <strong>The Middle Path:</strong> Avoid radical or biased stances. A
                                balanced, bureaucratic temperament is what the board seeks.
                            </li>
                            <li>
                                <strong>Avoid Generalizations:</strong> Don’t just say &quot;Corruption is
                                everywhere.&quot; Instead, discuss institutional challenges in
                                transparency.
                            </li>
                            <li>
                                <strong>The Evidence Toolkit (FREQOES):</strong>
                                <ul className="list-disc ml-6 mt-2">
                                    <li>Facts & Data</li>
                                    <li>Reasons</li>
                                    <li>Examples (Current Affairs)</li>
                                    <li>Quotes</li>
                                    <li>Opinions (Committee Reports / Think Tanks)</li>
                                    <li>Experiences</li>
                                    <li>Solutions</li>
                                </ul>
                            </li>
                        </ul>
                    </Section>

                </div>
            ) : (
                <div className="max-w-5xl mx-auto p-6 bg-white ">

                    {/* Header */}
                    <h1 className="text-3xl font-bold mb-4">
                        निबंध लेखन: सफलता का वैचारिक मार्ग
                    </h1>

                    <p className="font-semibold mb-2">
                        दीक्षांत IAS - &quot;विशेष मार्गदर्शन, उत्कृष्ट अभिव्यक्ति&quot;
                    </p>

                    <p className="text-gray-700 mb-6">
                        UPSC और राज्य PSC परीक्षाओं में निबंध का प्रश्नपत्र केवल आपकी लेखन क्षमता का नहीं,
                        बल्कि आपके व्यक्तित्व, तार्किक स्पष्टता और दृष्टिकोण की गहराई का परीक्षण है।
                        250 अंकों का यह पेपर आपके चयन और रैंक निर्धारण में निर्णायक भूमिका निभाता है।
                    </p>

                    {/* परीक्षा का स्वरूप */}
                    <Section title="परीक्षा का स्वरूप और अपेक्षाएं">
                        <ul className="list-disc ml-6 space-y-2">
                            <li>
                                <strong>समय व शब्द सीमा:</strong> 3 घंटे में 2 निबंध (प्रत्येक 1000-1200 शब्द)
                            </li>
                            <li>
                                <strong>अंक वितरण:</strong> कुल 250 अंक (प्रत्येक निबंध 125 अंक)
                            </li>
                            <li>
                                <strong>चयन:</strong> खंड &quot;A&quot; और &quot;B&quot; में से एक-एक विषय का चयन अनिवार्य है
                            </li>
                            <li>
                                <strong>आयोग की मांग:</strong> विचारों की स्पष्टता, सुव्यवस्थित संरचना और प्रभावशाली अभिव्यक्ति
                            </li>
                        </ul>
                    </Section>

                    {/* Structure */}
                    <Section title="एक आदर्श निबंध की संरचना (The Master Structure)">
                        <p className="mb-3">
                            एक प्रभावशाली निबंध केवल सूचनाओं का ढेर नहीं, बल्कि विचारों का एक सुगठित प्रवाह है:
                        </p>

                        <ol className="list-decimal ml-6 space-y-3">
                            <li>
                                <strong>प्रभावी प्रस्तावना (Introduction):</strong> पाठक की उत्सुकता जगाएं।
                                आप किसी प्रासंगिक किस्से (Anecdote), उदाहरण या विषय की संक्षिप्त व्याख्या से शुरुआत कर सकते हैं।
                            </li>

                            <li>
                                <strong>मुख्य भाग (The Body):</strong> विचारों को विभिन्न अनुच्छेदों में विभाजित करें।
                                <ul className="list-disc ml-6 mt-2 space-y-1">
                                    <li>
                                        <strong>सकारात्मक पक्ष:</strong> विषय के समर्थन में तर्क
                                    </li>
                                    <li>
                                        <strong>विश्लेषणात्मक पक्ष:</strong> आलोचनात्मक मूल्यांकन और चुनौतियां
                                    </li>
                                    <li>
                                        <strong>प्रवाह:</strong> एक पैराग्राफ दूसरे से तार्किक रूप से जुड़ा होना चाहिए
                                    </li>
                                </ul>
                            </li>

                            <li>
                                <strong>निष्कर्ष (Conclusion):</strong> यह भविष्य-उन्मुख और सकारात्मक होना चाहिए।
                                समाधान सुझाते हुए विषय को पूर्णता प्रदान करें।
                            </li>
                        </ol>
                    </Section>

                    {/* PESTLE */}
                    <Section title="PESTLE+ दृष्टिकोण: आयामों का विस्तार">
                        <p className="mb-3">
                            किसी भी विषय को बहुआयामी बनाने के लिए PESTLE तकनीक का उपयोग करें:
                        </p>

                        <ul className="list-disc ml-6 space-y-1">
                            <li>Political (राजनीतिक)</li>
                            <li>Economic (आर्थिक)</li>
                            <li>Social (सामाजिक)</li>
                            <li>Technological (तकनीकी)</li>
                            <li>Legal (कानूनी)</li>
                            <li>Environmental (पर्यावरणीय)</li>
                            <li>अतिरिक्त: Ethical (नैतिक) और Historical (ऐतिहासिक) संदर्भ</li>
                        </ul>
                    </Section>

                    {/* Brainstorming */}
                    <Section title="ब्रेनस्टॉर्मिंग: लिखने से पहले की योजना (25-30 मिनट)">
                        <p className="mb-3">
                            लिखना शुरू करने से पहले एक स्पष्ट योजना बनाना आवश्यक है:
                        </p>

                        <ul className="list-disc ml-6 space-y-2">
                            <li>
                                <strong>केंद्र बिंदु पहचानें:</strong> विषय की मुख्य थीम क्या है?
                                (जैसे: नवाचार, जल विवाद, या नैतिकता)
                            </li>
                            <li>
                                <strong>विविध विचार:</strong> जो भी बिंदु दिमाग में आएं, उन्हें एक पेज पर नोट करें
                            </li>
                            <li>
                                <strong>सीमा निर्धारण:</strong>
                                तय करें कि क्या लिखना है और क्या छोड़ना है (अप्रासंगिक बातों से बचें)।
                            </li>
                        </ul>
                    </Section>
                    <hr className="my-6 border-gray-300" />

                    {/* Section 2 */}
                    <h2 className="text-xl font-bold mb-4">
                        दीवांत ‘लेखन मंत्र’ (Success Tips)
                    </h2>

                    <ul className="list-disc pl-6 space-y-3">
                        <li>
                            <span className="font-semibold">संवैधानिक मूल्यों का पालन:</span>{" "}
                            आपके विचार हमेशा लोकतांत्रिक और संवैधानिक मूल्यों के पक्ष में होने चाहिए।
                        </li>

                        <li>
                            <span className="font-semibold">मध्यम मार्ग:</span>{" "}
                            किसी भी मुद्दे पर अतिवादी रुख अपनाने के बजाय संतुलित और न्यायसंगत दृष्टिकोण रखें।
                        </li>

                        <li>
                            <span className="font-semibold">स्पष्टता और संक्षिप्तता:</span>{" "}
                            जटिल शब्दों के बजाय सरल लेकिन प्रभावी भाषा का प्रयोग करें।
                        </li>

                        <li>
                            <span className="font-semibold">
                                विविधता के लिए &apos;VREQUESS&apos; तकनीक:
                            </span>

                            <ul className="list-disc pl-6 mt-2 space-y-1">
                                <li>V - Values (मूल्य)</li>
                                <li>R - Reasons (कारण)</li>
                                <li>E - Examples (उदाहरण)</li>
                                <li>Q - Quotes (उद्धरण)</li>
                                <li>U - Unique Insights (मौलिक विचार)</li>
                                <li>E - Evidence/Facts (तथ्य)</li>
                                <li>S - Statistics (आंकड़े)</li>
                            </ul>
                        </li>
                    </ul>

                    <hr className="my-6 border-gray-300" />

                    {/* Section 3 */}
                    <h2 className="text-xl font-bold mb-3"> संशोधन (Revision)</h2>

                    <p>
                        निबंध पूरा करने के बाद अंतिम 5-10 मिनट पुनरीक्षण के लिए रखें।
                        महत्वपूर्ण शब्दों को <span className="underline">(Underline)</span> करें
                        और व्याकरण संबंधी त्रुटियों को सुधारें।
                    </p>

                </div>
            )}
        </>
    );
};

export default EssayPage;