'use client'
import { useState } from 'react';
import { Award, Users, BookOpen, MessageSquare, Star } from 'lucide-react';
import { useTranslation } from "react-i18next";

interface TabData {
    id: string;
    color: string;
    hoverColor: string;
    icon: React.ReactNode;
}

const tabsData: TabData[] = [
    {
        id: 'journey',
        color: 'bg-red-500',
        hoverColor: 'hover:bg-red-600',
        icon: <Award className="w-16 h-16 text-[#d3b054]" />
    },
    {
        id: 'faculty',
        color: 'bg-blue-400',
        hoverColor: 'hover:bg-blue-500',
        icon: <Users className="w-16 h-16 text-[#d3b054]" />
    },
    {
        id: 'materials',
        color: 'bg-purple-500',
        hoverColor: 'hover:bg-purple-600',
        icon: <BookOpen className="w-16 h-16 text-[#d3b054]" />
    },
    {
        id: 'interview',
        color: 'bg-orange-400',
        hoverColor: 'hover:bg-orange-500',
        icon: <MessageSquare className="w-16 h-16 text-[#d3b054]" />
    },
    {
        id: 'seminar',
        color: 'bg-pink-400',
        hoverColor: 'hover:bg-pink-500',
        icon: <Star className="w-16 h-16 text-[#d3b054]" />
    }
];

export default function TabBestIasCoachingCenter() {
    const { t } = useTranslation("common");
    const [activeTab, setActiveTab] = useState<string>('journey');

    return (
        <div className='bg-[#00072c] py-15 mb-10'>
            <div className="w-full max-w-7xl mx-auto p-4">
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Left Tabs */}
                    <div className="lg:w-1/2 space-y-3">
                        {tabsData.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`
                                    w-full md:h-auto md:w-130 text-left px-6 py-4 rounded-full text-white font-medium md:text-xl
                                    transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl
                                    ${tab.color} ${tab.hoverColor}
                                `}
                            >
                                {t(`tabs.${tab.id}.title`)}
                            </button>
                        ))}
                    </div>

                    {/* Right Content */}
                    <div className="lg:w-1/2">
                        <div className="bg-white/6 border border-gray-100/20 rounded-2xl shadow-xl p-6 md:p-8 h-full flex flex-col justify-between min-h-[300px]">
                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
                                <div className="flex-1 mb-4 md:mb-0 md:pr-6">
                                    <div className="w-80 bg-red-500 text-white px-4 py-2 rounded-full text-center md:text-left text-md font-bold mb-4">
                                        {t(`tabs.${activeTab}.cardTitle`)}
                                    </div>
                                    <p className="text-white leading-relaxed text-md text-center md:text-left md:text-base">
                                        {t(`tabs.${activeTab}.description`)}
                                    </p>
                                </div>

                                {/* Icon */}
                                <div className="flex-shrink-0 mx-auto">
                                    <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-slate-200 to-slate-300 rounded-2xl flex items-center justify-center shadow-lg transform hover:rotate-6 transition-transform duration-300">
                                        {activeTab === 'journey' ? (
                                            <div className="text-center">
                                                <div className="text-2xl md:text-3xl font-bold text-[#d3b054]">20</div>
                                                <div className="text-xs text-[#d3b054] opacity-90">YEARS</div>
                                                <div className="flex justify-center mt-1">
                                                    {[...Array(3)].map((_, i) => (
                                                        <Star key={i} className="w-3 h-3 text-[#d3b054] fill-current" />
                                                    ))}
                                                </div>
                                            </div>
                                        ) : (
                                            tabsData.find((t) => t.id === activeTab)?.icon
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Only for Journey tab */}
                            {activeTab === 'journey' && (
                                <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border-l-4 border-yellow-500">
                                    <div className="flex items-center">
                                        <Award className="w-6 h-6 text-yellow-600 mr-2" />
                                        <span className="text-sm font-medium text-gray-800">
                                            {t("tabs.journey.achievement")}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
