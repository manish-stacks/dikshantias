'use client'

import React, { useState } from 'react';

const FAQItem = ({ question, answer }: { question: string; answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-blue-100 p-4 mb-4 rounded-lg transition-all duration-300 hover:bg-red-200">
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="text-lg font-semibold text-gray-800">{question}</h3>
        <span className="text-gray-600">
          {isOpen ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          )}
        </span>
      </div>
      {isOpen && (
        <p className="mt-2 text-gray-700 text-base">{answer}</p>
      )}
    </div>
  );
};

const FaqPage: React.FC = () => {
  const faqs = [
    {
      question: 'Trump unveils slew of new tariffs on nearly 70 nations; Canada faces punitive levy',
      answer: 'Page 1 – The Hindu – GS2 (IR)',
    },
    {
      question: 'What are the key principles of UX design?',
      answer: 'The key principles include user-centered design, usability, accessibility, and iterative design to enhance user satisfaction.',
    },
    {
      question: 'What is the difference between UX and UI design?',
      answer: 'UX design focuses on the overall feel and user journey, while UI design is about the visual and interactive elements of the interface.',
    },
    {
      question: 'What is the difference between UX and UI design?',
      answer: 'UX design focuses on the overall feel and user journey, while UI design is about the visual and interactive elements of the interface.',
    },
    {
      question: 'What is the difference between UX and UI design?',
      answer: 'UX design focuses on the overall feel and user journey, while UI design is about the visual and interactive elements of the interface.',
    },
    {
      question: 'What is the difference between UX and UI design?',
      answer: 'UX design focuses on the overall feel and user journey, while UI design is about the visual and interactive elements of the interface.',
    },
  ];

  return (
    <div className="bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">Frequently Asked Questions</h1>
        {faqs.map((faq, index) => (
          <FAQItem key={index} question={faq.question} answer={faq.answer} />
        ))}
      </div>
    </div>
  );
};

export default FaqPage;