'use client';

import 'swiper/css';
import 'swiper/css/pagination';
import AnnouncementBox from './AnnouncementBox';
import { useTranslation } from 'react-i18next';

export default function AnnouncementRow() {
  const { t } = useTranslation("common");

  return (
    <div className="bg-white mt-5 md:mt-7 md:mx-2">
      <div className="md:max-w-7xl md:mx-auto mx-1 flex md:space-x-5 justify-between items-center">
        
        {/* Left content */}
        <div className='content-area w-full hidden md:flex lg:flex'>
          <div className='bg-blue-100 py-22 px-10 rounded-xl '>
            <h2 className="text-xl md:text-3xl font-bold mb-4 text-[#040c33] pl-2 md:pl-0">
              {t("new")} <span className="text-[#f43144]">{t("announcement")}</span>
            </h2>
            <span className='font-bold italic text-blue-950'>
              {t("announcementSubtitle")}
            </span>
            <p className='text-blue-950 mt-2'>
              {t("announcementDesc")}
            </p>
          </div>
        </div>

        {/* Right content */}
        <div className='announcement-area w-[100%] md:w-[60%]'>
          <div>
            <AnnouncementBox />
          </div>
        </div>
      </div>
    </div>
  );
}
