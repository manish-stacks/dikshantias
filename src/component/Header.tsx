'use client'
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, Menu, X, Phone, Play } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import SlidingButtons from './SlidingButtons';

interface SubCategory {
    _id: string;
    name: string;
    slug: string;
    category: {
        _id: string;
        name: string;
        slug: string;
    };
    active: boolean;
}

interface SettingsData {
    image: { url: string };
    name: string;
    phone: string;
    whatsapp: string;
    email: string;
    address: string;
    googleMap: string;
    facebook: string;
    instagram: string;
    youtube: string;
    linkedin: string;
    twitter: string;
    telegram: string;
}




const Header: React.FC = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [openMobileDropdown, setOpenMobileDropdown] = useState<string | null>(null);
    const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
    const [settings, setSettings] = useState<SettingsData | null>(null);
    const { t, i18n } = useTranslation("common")


    // ✅ translations

    const [lang, setLang] = useState(i18n.language || "en");

    // Fetch Sub-Categories
    useEffect(() => {
        const fetchSubCategories = async () => {
            try {
                const res = await fetch('/api/admin/sub-categories');
                const data = await res.json();
                setSubCategories(data.filter((item: SubCategory) => item.active));
            } catch (error) {
                console.error('Error fetching sub-categories:', error);
            }
        };
        fetchSubCategories();
    }, []);

    // Fetch Settings
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch('/api/admin/settings');
                const data = await res.json();
                setSettings(data[0]);
            } catch (error) {
                console.error('Error fetching settings:', error);
            }
        };
        fetchSettings();
    }, []);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
        setOpenMobileDropdown(null);
    };

    const handleMobileDropdownToggle = (menu: string) => {
        setOpenMobileDropdown(openMobileDropdown === menu ? null : menu);
    };

    const handleMouseEnter = (menu: string) => setOpenDropdown(menu);
    const handleMouseLeave = () => setOpenDropdown(null);



    const changeLanguage = (lng: "en" | "hi") => {
        i18n.changeLanguage(lng);
        setLang(lng);
    }



    return (
        <div className="w-full">
            {/* Main Header */}
            <div className="bg-white shadow-sm md:py-2">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-0">
                    <div className="flex items-center justify-between h-14 md:h-16">
                        {/* Logo */}
                        <div className="logo w-[130px] md:w-[160px]">
                            <Link href='/'>
                                {settings?.image?.url ? (
                                    <Image src={settings.image.url} alt={settings.name} width={160} height={100} />
                                ) : (
                                    <Image src={'/img/dikshant-logo.png'} alt="Logo" width={160} height={100} />
                                )}
                            </Link>
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="hidden lg:flex items-center space-x-4">
                            <Link href='/about-us' className="text-gray-900 hover:text-red-500 font-medium py-2">{t("about")}</Link>
                            <Link href='/scholarship-programme' className="text-gray-900 hover:text-red-500 font-medium py-2">{t("scholarship")}</Link>

                            {/* Courses Dropdown */}
                            <div
                                className="relative group"
                                onMouseEnter={() => handleMouseEnter('courses')}
                                onMouseLeave={handleMouseLeave}
                            >
                                <button className="flex items-center space-x-1 text-gray-900 hover:text-red-500 font-medium py-2">
                                    <span>{t("courses")}</span>
                                    <ChevronDown className="w-4 h-4" />
                                </button>
                                {openDropdown === 'courses' && (
                                    <div className="absolute top-full left-0 w-56 bg-white shadow-lg rounded-md py-2 z-50">
                                        <Link href="/online-course" className="block px-4 py-2 text-gray-900 hover:text-red-500 hover:bg-gray-50">{t("onlineMode")}</Link>
                                        <Link href="/offline-course" className="block px-4 py-2 text-gray-900 hover:text-red-500 hover:bg-gray-50"> {t("offlineMode")}</Link>
                                    </div>
                                )}
                            </div>

                            {/* Current Affairs Dropdown */}
                            <div
                                className="relative group"
                                onMouseEnter={() => handleMouseEnter('currentAffairs')}
                                onMouseLeave={handleMouseLeave}
                            >
                                <button className="flex items-center space-x-1 text-gray-900 hover:text-red-500 font-medium py-2">
                                    <span>{t("currentAffairs")}</span>
                                    <ChevronDown className="w-4 h-4" />
                                </button>
                                {openDropdown === 'currentAffairs' && (
                                    <div className="absolute top-full left-0 w-72 bg-white shadow-lg rounded-md py-2 z-50">
                                        {subCategories.map(item => (
                                            <Link
                                                key={item._id}
                                                href={`/current-affairs/${item.slug}`}
                                                className="block px-4 py-2 text-gray-900 hover:text-red-500 hover:bg-gray-50"
                                            >
                                                {item.name}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>


                            <Link href="/blogs" className="text-gray-900 hover:text-red-500 font-medium py-2">{t("blogs")}</Link>
                        </nav>

                        {/* Right Side Actions */}
                        <div className="flex items-center space-x-4">
                            <div className="hidden md:flex items-center space-x-2 text-gray-900">
                                <div className='bg-red-100 p-3 rounded-full'>
                                    <Phone className="w-5 h-5" />
                                </div>
                                <div className="text-sm">
                                    <div className="text-xs text-gray-500">{t("talkToExperts")}</div>
                                    <div className="font-medium"><a href="tel:07428092240">+91 7428092240</a></div>
                                </div>
                            </div>


                            <div className="flex space-x-2">
                                <button
                                    className={`px-3 py-1 rounded font-medium ${lang === "en" ? "bg-red-500 text-white" : "bg-gray-200 text-gray-700"}`}
                                    onClick={() => changeLanguage("en")}
                                >
                                    English
                                </button>
                                <button
                                    className={`px-3 py-1 rounded font-medium ${lang === "hi" ? "bg-red-500 text-white" : "bg-gray-200 text-gray-700"}`}
                                    onClick={() => changeLanguage("hi")}
                                >
                                    हिंदी
                                </button>
                            </div>
                            {/* <Link href="/admin/login">
                                <button className="hidden sm:flex items-center space-x-1 text-gray-700 hover:text-[#950409]">
                                    {t("login")}
                                </button>
                            </Link> */}
                            <button onClick={toggleMobileMenu} className="lg:hidden p-2 text-gray-700 hover:text-[#f43144]">
                                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                            <div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sliding Buttons Component */}
            <SlidingButtons />

            {/* Mobile Sidebar Menu */}
            <div className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                <div className="fixed inset-0 bg-black/65 transition-opacity duration-300" onClick={toggleMobileMenu}></div>
                <div className={`fixed left-0 top-0 h-full w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <div className="p-6 h-full overflow-y-auto">
                        <div className="flex justify-between items-center mb-8">
                            <Link href='/' className='logo'>
                                <Image src={'/img/dikshant-logo.png'} alt="Logo" width={140} height={100} />
                            </Link>
                            <button onClick={toggleMobileMenu} className="p-2 text-gray-600 hover:text-gray-700"><X className="w-6 h-6" /></button>
                        </div>

                        {/* Mobile Navigation */}
                        <nav>
                            <div className="border-b border-gray-200">
                                <Link href="/about-us" onClick={toggleMobileMenu} className="block py-1 text-gray-900 hover:text-red-500 font-medium">
                                    {t("aboutDikshant")}
                                </Link>
                            </div>

                            <div className="border-b border-gray-200">
                                <Link href="/about-upsc" onClick={toggleMobileMenu} className="block py-1 text-gray-900 hover:text-red-500 font-medium">
                                    {t("aboutUpsc")}
                                </Link>
                            </div>

                            {/* Courses Dropdown */}
                            <div className="border-b border-gray-200">
                                <button
                                    className="flex items-center justify-between w-full text-left py-2 text-gray-900 hover:text-red-500 font-medium"
                                    onClick={() => handleMobileDropdownToggle('courses')}
                                >
                                    <span>{t("courses")}</span>
                                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${openMobileDropdown === 'courses' ? 'rotate-180' : ''}`} />
                                </button>
                                <div className={`overflow-hidden transition-all duration-300 ${openMobileDropdown === 'courses' ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}>
                                    <div className="ml-4 space-y-2 pt-2">
                                        <Link href="/online-course" onClick={toggleMobileMenu} className="block py-1 text-gray-700 hover:text-red-500">
                                            {t("onlineMode")}
                                        </Link>
                                        <Link href="/offline-course" onClick={toggleMobileMenu} className="block border-b border-gray-200 py-1 text-gray-700 hover:text-red-500">
                                            {t("offlineMode")}
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            {/* Current Affairs Dropdown */}
                            <div className="border-b border-gray-200">
                                <button
                                    className="flex items-center justify-between w-full text-left py-2 text-gray-900 hover:text-red-500 font-medium"
                                    onClick={() => handleMobileDropdownToggle('currentAffairs')}
                                >
                                    <span>{t("currentAffairs")}</span>
                                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${openMobileDropdown === 'currentAffairs' ? 'rotate-180' : ''}`} />
                                </button>
                                <div className={`overflow-hidden transition-all duration-300 ${openMobileDropdown === 'currentAffairs' ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'}`}>
                                    <div className="ml-4 space-y-2 pt-2">
                                        {subCategories.map(item => (
                                            <Link
                                                key={item._id}
                                                href={`/current-affairs/${item.slug}`}
                                                onClick={toggleMobileMenu}
                                                className="block py-1 text-gray-700 hover:text-red-500"
                                            >
                                                {item.name}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="border-b border-gray-200">
                                <Link href="/scholarship-programme" onClick={toggleMobileMenu} className="block py-2 text-gray-900 hover:text-red-500 font-medium">
                                    {t("scholarship")}
                                </Link>
                            </div>

                            <Link href="/blogs" onClick={toggleMobileMenu} className="block py-2 text-gray-900 hover:text-red-500 font-medium border-b border-gray-200">
                                {t("blogs")}
                            </Link>
                        </nav>


                        {/* Mobile Actions */}
                        <div className="mt-8 space-y-4">
                            <div className="flex items-center space-x-2 text-gray-600 p-3 bg-gray-50 rounded">
                                <div className='bg-red-500 rounded-full p-3'>
                                    <Phone className="w-5 h-5 text-white" />
                                </div>
                                <div className="text-sm">
                                    <div className="text-xs text-gray-500">{t("talkToExperts")}</div>
                                    <div className="font-bold text-gray-900 text-lg">
                                        <a href={`tel:${settings?.phone || '+917428092240'}`} className="hover:text-[#81190B]">
                                            {settings?.phone || '+91 7428092240'}
                                        </a>
                                    </div>

                                </div>
                            </div>
                            <button className="w-full flex items-center justify-center space-x-2 bg-red-500 text-white py-3 rounded hover:bg-red-600 animate-pulse">
                                <Play className="w-4 h-4" />
                                <span className="font-medium">Live Demo</span>
                            </button>
                            <button className="w-full bg-red-500 text-white py-3 rounded hover:bg-red-600 font-medium">Get Started</button>
                            {/* <Link
                                href="/admin/login"
                                target="_blank"
                            >
                                <button className="w-full text-gray-700 hover:text-red-500 py-3 border border-gray-300 rounded">
                                    {t("login")}
                                </button>
                            </Link> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;
