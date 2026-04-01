"use client";
import React from "react";
import { useTranslation } from "react-i18next";

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="mb-10">
        <h2 className="text-xl font-semibold border-b pb-2 mb-4">
            {title}
        </h2>
        <div className="text-gray-800 leading-relaxed">{children}</div>
    </div>
);

const Table = ({ headers, rows }: { headers: string[]; rows: string[][] }) => (
    <div className="overflow-x-auto">
        <table className="w-full border border-gray-300 text-sm">
            <thead>
                <tr>
                    {headers.map((h, i) => (
                        <th key={i} className="border p-3 text-left bg-gray-100">
                            {h}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {rows.map((row, i) => (
                    <tr key={i}>
                        {row.map((cell, j) => (
                            <td key={j} className="border p-3">
                                {cell}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

export default function MentorshipPage() {
    const { i18n } = useTranslation("common");
    const language = i18n.language || "en";
    return (
        <div className="max-w-5xl mx-auto p-6 ">
            {language === "en" ? (
                <div>
                    {/* ================= ENGLISH ================= */}
                    <h1 className="text-3xl font-bold mb-4">MENTORSHIP</h1>

                    <Section title="Dikshant IAS Mentorship Programme">
                        <p className="italic mb-3">
                            &quot;Your Hard Work, Our Guidance — A Definitive Step Towards Success&quot;
                        </p>

                        <p>
                            UPSC and State PSC examinations demand more than just knowledge;
                            they require a blend of strategy, consistency, and mental fortitude.
                            Our programme provides the personalized direction needed to rise
                            above the competition.
                        </p>
                    </Section>

                    <Section title="Key Programme Features">
                        <p className="mb-3">
                            Our curriculum is built on three pillars: <strong>Planning, Practice, and Personal Support.</strong>
                        </p>

                        <ul className="list-disc ml-6 space-y-2">
                            <li>
                                <strong>Customized Roadmaps:</strong> Personalized study and revision plans tailored to your pace.
                            </li>
                            <li>
                                <strong>Daily Rigor:</strong> Daily MCQs for prelims.
                                <ul className="ml-6 list-disc">
                                    <li>Daily Answer Writing (DAW) with expert evaluation.</li>
                                </ul>
                            </li>
                            <li>
                                <strong>Direct Access:</strong> 24/7 Chat Support.
                                <ul className="ml-6 list-disc">
                                    <li>Fortnightly one-on-one sessions.</li>
                                </ul>
                            </li>
                            <li>
                                <strong>High-Level Networking:</strong> Interaction with senior bureaucrats and toppers.
                            </li>
                            <li>
                                <strong>Testing & Syllabus Control:</strong>
                                <ul className="ml-6 list-disc">
                                    <li>Weekly mini tests.</li>
                                    <li>Monthly CSAT tests.</li>
                                    <li>Multiple revision cycles.</li>
                                </ul>
                            </li>
                            <li>
                                <strong>Interview Readiness:</strong> Personality development sessions.
                            </li>
                        </ul>
                    </Section>

                    <Section title="Why Choose Dikshant Mentorship?">
                        <Table
                            headers={[
                                "Individual Attention",
                                "Continuous Assessment",
                                "Expert Availability",
                            ]}
                            rows={[
                                [
                                    "We tailor our approach to your strengths.",
                                    "Weekly tests and feedback measure growth.",
                                    "Mentors ensure you never feel lost.",
                                ],
                            ]}
                        />
                    </Section>

                    <Section title="Batch & Enrollment Details">
                        <ul className="list-disc ml-6 space-y-2">
                            <li><strong>Session:</strong> 2026 Admissions Now Open</li>
                            <li><strong>Batch Timing:</strong> 4:00 PM (Evening Batch)</li>
                            <li><strong>Investment:</strong> ₹45,000/- (Inclusive of all taxes)</li>
                        </ul>

                        <p className="mt-4 font-medium">
                            <strong>Summer Special Offer:</strong> Limited-time scholarships available.
                            Secure your seat today!
                        </p>
                    </Section>

                </div>
            ) : (
                <div>

                    {/* ================= HINDI ================= */}
                    <h1 className="text-3xl font-bold mb-4">मेंटॉरशिप</h1>

                    <Section title="दीक्षांत IAS मेंटरशिप प्रोग्राम">
                        <p className="italic mb-3">
                            &quot;आपकी कड़ी मेहनत, हमारा मार्गदर्शन — सफलता की ओर एक निश्चित कदम&quot;
                        </p>

                        <p>
                            UPSC और राज्य PSC परीक्षाएँ केवल ज्ञान की परीक्षा नहीं हैं,
                            बल्कि रणनीति, निरंतरता और मानसिक दृढ़ता की भी परीक्षा हैं।
                            यह कार्यक्रम आपको प्रतिस्पर्धा में आगे बढ़ने के लिए आवश्यक दिशा प्रदान करता है।
                        </p>
                    </Section>

                    <Section title="कार्यक्रम की मुख्य विशेषताएँ">
                        <p className="mb-3">
                            हमारा पाठ्यक्रम तीन स्तंभों पर आधारित है:
                            <strong> नियोजन, अभ्यास और व्यक्तिगत सहायता।</strong>
                        </p>

                        <ul className="list-disc ml-6 space-y-2">
                            <li>
                                <strong>व्यक्तिगत योजना:</strong> आपकी गति के अनुसार स्टडी प्लान।
                            </li>
                            <li>
                                <strong>दैनिक अभ्यास:</strong> दैनिक MCQs।
                                <ul className="ml-6 list-disc">
                                    <li>डेली आंसर राइटिंग मूल्यांकन के साथ।</li>
                                </ul>
                            </li>
                            <li>
                                <strong>सीधा समर्थन:</strong> 24x7 चैट सपोर्ट।
                                <ul className="ml-6 list-disc">
                                    <li>हर 15 दिन में व्यक्तिगत सत्र।</li>
                                </ul>
                            </li>
                            <li>
                                <strong>विशेष मार्गदर्शन:</strong> टॉपर्स और अधिकारियों से संवाद।
                            </li>
                            <li>
                                <strong>परीक्षण प्रणाली:</strong>
                                <ul className="ml-6 list-disc">
                                    <li>साप्ताहिक टेस्ट</li>
                                    <li>मासिक CSAT टेस्ट</li>
                                    <li>रीविजन चक्र</li>
                                </ul>
                            </li>
                            <li>
                                <strong>इंटरव्यू तैयारी:</strong> व्यक्तित्व विकास सत्र।
                            </li>
                        </ul>
                    </Section>

                    <Section title="दीक्षांत मेंटरशिप क्यों चुनें?">
                        <Table
                            headers={[
                                "व्यक्तिगत ध्यान",
                                "सतत मूल्यांकन",
                                "विशेषज्ञ उपलब्धता",
                            ]}
                            rows={[
                                [
                                    "हम आपकी क्षमताओं पर ध्यान देते हैं",
                                    "हर सप्ताह आपकी प्रगति मापी जाती है",
                                    "मेंटर्स हमेशा उपलब्ध रहते हैं",
                                ],
                            ]}
                        />
                    </Section>

                    <Section title="बैच और शुल्क विवरण">
                        <ul className="list-disc ml-6 space-y-2">
                            <li><strong>सत्र:</strong> 2026 से प्रवेश प्रारंभ</li>
                            <li><strong>समय:</strong> शाम 4:00 बजे</li>
                            <li><strong>शुल्क:</strong> ₹45,000/- (सभी कर सहित)</li>
                        </ul>

                        <p className="mt-4 font-medium">
                            <strong>समर ऑफर:</strong> सीमित समय के लिए छात्रवृत्ति उपलब्ध है।
                            आज ही अपनी सीट सुरक्षित करें!
                        </p>
                    </Section>
                </div>
            )}
        </div>
    );
}