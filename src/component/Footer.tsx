'use client';

import React, { useEffect, useState } from 'react';
import { Facebook, Instagram, Youtube, Linkedin, Twitter, Send, ChevronsRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';


interface FooterLink {
  name: string;
  href: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

interface Settings {
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
  image: {
    url: string;
  };
}

const Footer: React.FC = () => {
  const { t } = useTranslation('common');
  const [settings, setSettings] = useState<Settings | null>(null);

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(res => res.json())
      .then(data => setSettings(data[0]))
      .catch(err => console.error(err));
  }, []);

  const footerSections: FooterSection[] = [
    {
      title: t('footer.sections.quickLinks'),
      links: [
        { name: t('footer.links.home'), href: '/' },
        { name: t('footer.links.about'), href: '/about-us' },
        { name: t('footer.links.scholarshipProgramme'), href: '/scholarship-programme' },
        { name: t('footer.links.blog'), href: '/blogs' },
        { name: t('footer.links.contact'), href: '/contact-us' },
        { name: t('footer.links.gallery'), href: '/gallery' }
      ]
    },
    {
      title: t('footer.sections.courses'),
      links: [
        { name: t('footer.links.onlineCourse'), href: '/online-course' },
        { name: t('footer.links.offlineCourse'), href: '/offline-course' },
        { name: t('footer.links.mainsCorner'), href: '/mains-corner' },
        { name: t('footer.links.mentorshipProgramme'), href: '/coming-soon' },
        { name: t('footer.links.interviewGuidancer'), href: '/coming-soon' },
        { name: t('footer.links.essayAnswerWriting'), href: '/coming-soon' }
      ]
    },
    {
      title: "CURRENT AFFAIRS",
      links: [
        { name: "What to Read in Hindu", href: "/current-affairs/what-to-read-in-hindu" },
        { name: "What to Read in Indian Express", href: "/current-affairs/what-to-read-in-indian-express" },
        { name: "Editorial Analysis", href: "/current-affairs/editorial-analysis" },
        { name: "Daily Current Affairs Analysis", href: "/current-affairs/daily-current-affairs-analysis" },
        { name: "Daily Current Affairs Quiz", href: "/current-affairs/daily-current-affairs-quiz" },
        { name: "Important Facts of the Day", href: "/current-affairs/important-facts-of-the-day" },
      ]
    },
    {
      title: t('footer.sections.policies'),
      links: [
        { name: t('footer.links.privacyRefundPolicy'), href: "/privacy-refund-policy" },
        { name: t('footer.links.termsConditions'), href: "/terms-conditions" },
        { name: t('footer.links.dataPolicy'), href: "/data-policy" }
      ]
    }
  ];

  const socialMedia = settings ? [
    { icon: Facebook, href: settings.facebook, label: "Facebook", backgroundColor: "bg-[#3b579d]" },
    { icon: Instagram, href: settings.instagram, label: "Instagram", backgroundColor: "bg-[#a408f3]" },
    { icon: Youtube, href: settings.youtube, label: "YouTube", backgroundColor: "bg-red-600" },
    { icon: Linkedin, href: settings.linkedin, label: "LinkedIn", backgroundColor: "bg-[#0274b3]" },
    { icon: Twitter, href: settings.twitter, label: "Twitter", backgroundColor: "bg-[#1d9bf0]" },
    { icon: Send, href: settings.telegram, label: "Telegram", backgroundColor: "bg-[#29a9eb]" }
  ] : [];

  if (!settings) return null; // Or a loader

  return (
    <footer className="bg-[#ecf4fc] py-12 px-4 border-t border-gray-200">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Logo and Contact Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-4">
              <div className="logo w-[300px] md:w-[200px] flex flex-col items-center md:items-start text-center md:text-left mx-auto md:mx-0">
                <Image
                  src={settings.image.url}
                  alt="Logo"
                  width={200}
                  height={100}
                  className="mx-auto md:mx-0"
                />
                <div className="text-md font-medium text-blue-950 mt-2 text-center md:text-left">
                  Empowering minds for a brighter future.
                </div>
              </div>
            </div>

            <div className="space-y-1 text-sm text-blue-950">
              <div><span className='font-semibold'> {t('footer.sections.address')}:</span> <a href="https://maps.app.goo.gl/EDCVmQbp1YNhk1277"
                target="_blank"
                rel="nooperner noreferrer"
                className="text-slate-700 hover:underline">
                {settings?.address}
              </a></div>
              <div>
                <span className="font-semibold">{t('footer.sections.phone')}:</span>{' '}
                <a
                  href={`tel:${settings?.phone || '+919312511015'}`}
                  className="text-slate-700 hover:underline"
                >
                  {settings?.phone || '+91 7428092240'}
                </a>
              </div>
              <div>
  <span className="font-semibold">{t('footer.sections.whatsapp')}:</span>{' '}
  <a
    href="https://wa.me/919312511015"
    target="_blank"
    rel="noopener noreferrer"
    className="text-slate-700 hover:underline"
  >
    +91 9312511015
  </a>
</div>
             
<div>
  <span className="font-semibold">{t('footer.sections.email')}:</span>{' '}
  <a
    href="mailto:info@dikshantias.com"
    className="text-slate-700 hover:underline"
  >
    info@dikshantias.com
  </a>
</div>
              <div className="mt-5">
  <a
    href="https://maps.app.goo.gl/EDCVmQbp1YNhk1277"
    target="_blank"
    rel="noopener noreferrer"
    className="px-4 py-2 bg-[#a50309] text-white rounded-md inline-block"
  >
    {t('footer.sections.getDirection')}
  </a>
</div>
            </div>
          </div>

          {/* Footer Sections */}
          {footerSections.map((section, index) => (
            <div key={index} className="lg:col-span-1">
              {section.title && (
                <h3 className="font-semibold text-[#a50309] mb-4 text-sm">
                  {section.title}
                </h3>
              )}
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex} className='flex'>
                    <ChevronsRight className='text-sm text-red-800' />
                    <a
                      href={link.href}
                      className="text-sm text-blue-950 hover:text-[#990312] transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Social Media and Download App */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-8">
            <div>
              <h4 className="text-sm font-semibold text-[#8a0101] mb-3">{t('footer.sections.socialMedia')}</h4>
              <div className="flex space-x-3">
                {socialMedia.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className={`w-8 h-8 text-white rounded-full flex items-center justify-center hover:bg-[#f43144] hover:text-white transition-colors ${social.backgroundColor}`}
                    aria-label={social.label}
                    target='_blank'
                  >
                    <social.icon size={16} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Download App */}
          <div className="text-right">
            <Link href="#" className="bg-red-700 rounded-sm text-sm px-5 py-3 font-medium text-gray-50 my-3 mx-1">
              {t('footer.sections.downloadApp')}
            </Link>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-6 border-t border-gray-200">
          <p className="text-xs text-blue-950">
            {settings.name} © 2025. | All Rights Reserved. | Develop By Hover Business Services LLP
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
