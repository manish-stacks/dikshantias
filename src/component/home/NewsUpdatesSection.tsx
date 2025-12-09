'use client';

import { useState } from 'react';
import { Calendar, Clock, ArrowRight, Bell, BookOpen, FileText, TrendingUp } from 'lucide-react';
import Image from 'next/image';

interface NewsItem {
  id: number;
  type: 'Announcement' | 'Results' | 'Event';
  title: string;
  description: string;
  date: string;
  readTime: string;
  image: string;
  category: string;
}

interface QuickResource {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
}

const NewsUpdatesSection = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const newsItems: NewsItem[] = [
    {
      id: 1,
      type: 'Announcement',
      title: 'Boosting the Capacity of Legal Aid Systems in India (GS Paper 2, Social Justice)',
      description: 'India’s legal aid system is built on a powerful idea — that justice should not depend on one’s ability to pay for it',
      date: 'July 31, 2025',
      readTime: '3 min read',
      image: 'https://images.pexels.com/photos/7092615/pexels-photo-7092615.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop',
      category: 'announcement'
    },
    {
      id: 2,
      type: 'Results',
      title: 'From Assam to Cambodia: How the Hargila Army Became a Global Inspiration (GS Paper 1, Indian Society)',
      description: 'In the heart of Assam, India, a group of village women stood up for a bird many considered ugly and unwanted',
      date: 'July 31, 2025',
      readTime: '5 min read',
      image: 'https://images.pexels.com/photos/1595391/pexels-photo-1595391.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop',
      category: 'results'
    },
    {
      id: 3,
      type: 'Event',
      title: 'Judicial Discretion in POCSO Bail: Legal Grey Zones and Recent Trends (GS Paper 2, Governance)',
      description: 'A special POCSO court in Mumbai recently granted bail to a 40-year-old teacher accused of sexually assaulting a minor, citing a consensual relationship.',
      date: 'July 31, 2025',
      readTime: '2 min read',
      image: 'https://images.pexels.com/photos/4050320/pexels-photo-4050320.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop',
      category: 'event'
    }
    
  ];

  const importantUpdates = [
    'Boosting the Capacity of Legal Aid Systems in India (GS Paper 2, Social Justice)',
    'From Assam to Cambodia: How the Hargila Army Became a Global Inspiration (GS Paper 1, Indian Society)',
    'Judicial Discretion in POCSO Bail: Legal Grey Zones and Recent Trends (GS Paper 2, Governance)',
    'Girl Child Trafficking in India (GS Paper 2 – Issues Related to Children, Women and Vulnerable Sections)',
    'Flash Floods in India: Causes, Climate Links & Regional Adaptation Strategies (GS 3, Environment & Disaster Management)'
  ];

  const quickResources: QuickResource[] = [
    {
      title: 'Current Affairs',
      subtitle: 'Daily & Monthly Updates',
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'text-blue-600'
    },
    {
      title: 'Mock Tests',
      subtitle: 'Practice Test Series',
      icon: <FileText className="w-5 h-5" />,
      color: 'text-green-600'
    },
    {
      title: 'Study Material',
      subtitle: 'Notes & Resources',
      icon: <BookOpen className="w-5 h-5" />,
      color: 'text-purple-600'
    }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Announcement':
        return 'text-pink-600 bg-pink-50';
      case 'Results':
        return 'text-green-600 bg-green-50';
      case 'Event':
        return 'text-blue-600 bg-blue-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <section className="py-16 md:py-20 bg-gray-50 mt-8">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-6">
            Latest News & Updates
          </h2>
          <p className="text-lg md:text-xl text-gray-800 max-w-3xl mx-auto leading-relaxed">
            Stay updated with the latest announcements, results, and important information
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Left Column - News Items */}
          <div className="lg:col-span-2 space-y-6">
            {newsItems.map((item, index) => (
              <article 
                key={item.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
              >
                <div className="flex flex-col sm:flex-row">
                  
                  {/* News Image */}
                  <div className="sm:w-48 md:w-56 h-48 sm:h-auto flex-shrink-0 overflow-hidden">
                    <Image
                    width={600}
                    height={400}
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* News Content */}
                  <div className="flex-1 p-6 sm:p-8">
                    
                    {/* News Meta */}
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(item.type)}`}>
                        {item.type}
                      </span>
                      <div className="flex items-center text-gray-800 text-sm">
                        <Calendar className="w-4 h-4 mr-1" />
                        {item.date}
                      </div>
                      <div className="flex items-center text-gray-800 text-sm">
                        <Clock className="w-4 h-4 mr-1" />
                        {item.readTime}
                      </div>
                    </div>

                    {/* News Title */}
                    <h3 className="text-[18px] md:text-2xl font-bold text-gray-900 mb-3 group-hover:text-[#f43144] transition-colors duration-300">
                      {item.title}
                    </h3>

                    {/* News Description */}
                    <p className="text-gray-800 mb-4 leading-relaxed">
                      {item.description}
                    </p>

                    {/* Read More Button */}
                    <button className="inline-flex items-center text-[#f43144] font-semibold hover:[#f43144] transition-colors duration-300 group/btn">
                      Read More
                      <ArrowRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform duration-300" />
                    </button>
                  </div>
                </div>
              </article>
            ))}

            {/* View All News Button */}
            {/* <div className="text-center pt-6">
              <button className="inline-flex items-center px-8 py-3 bg-white text-orange-600 font-semibold rounded-full border-2 border-orange-600 hover:bg-orange-600 hover:text-white transition-all duration-300">
                View All News
              </button>
            </div> */}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-8">
            
            {/* Important Updates */}
            <div className="bg-[#112933] rounded-2xl p-6 text-white">
              <div className="flex items-center mb-6">
                <Bell className="w-6 h-6 mr-3" />
                <h3 className="text-xl font-bold">Important Updates</h3>
              </div>
              
              <div className="space-y-4">
                {importantUpdates.map((update, index) => (
                  <div key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-white rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <p className="text-sm leading-relaxed">{update}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Resources */}
            <div className="bg-red-100 rounded-2xl p-6 shadow-md">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Resources</h3>
              
              <div className="space-y-4">
                {quickResources.map((resource, index) => (
                  <div key={index} className="flex items-start p-4 rounded-xl hover:bg-gray-50 transition-colors duration-300 cursor-pointer group">
                    <div className={`${resource.color} mr-4 mt-1`}>
                      {resource.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 group-hover:text-pink-600 transition-colors duration-300">
                        {resource.title}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">{resource.subtitle}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-pink-600 group-hover:translate-x-1 transition-all duration-300" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsUpdatesSection;