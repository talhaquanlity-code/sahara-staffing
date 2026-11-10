import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { faqData as fallbackFaqData } from '../data/faqData';
import { useCMS } from '../context/CMSContext';
import ScrollRevealText from './common/ScrollRevealText';

gsap.registerPlugin(ScrollTrigger);

export default function FAQ() {
  const { content } = useCMS();
  const faqList = content?.faqs && content.faqs.length > 0 ? content.faqs : fallbackFaqData;
  const [openIndex, setOpenIndex] = useState(0); // 1st item open by default
  const faqRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add('(min-width: 768px)', () => {
        gsap.fromTo(
          '.faq-row',
          { opacity: 0, y: 25 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.12,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: '.faq-list-container',
              start: 'top 85%',
            },
          }
        );
      });
    }, faqRef);

    return () => ctx.revert();
  }, []);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section ref={faqRef} className="bg-obsidian text-crispWhite px-5 py-6 md:py-32 md:px-8">
      <div className="max-w-[1320px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-start">
          {/* Left Column: Title & Subtitle */}
          <div className="lg:col-span-5">
            <h2 className="text-xl font-bold text-white mb-2 md:text-5xl md:font-semibold md:tracking-[-0.03em] md:leading-[1.08] md:text-saharaGold">
              Frequently
              <br className="hidden sm:inline" />{' '}
              Asked Questions
            </h2>
            <p className="text-xs text-slate-400 mb-6 md:mb-0 md:text-sm md:text-slateGray max-w-sm leading-relaxed">
              Clear answers to the most common questions about our search process and placement guarantees.
            </p>
          </div>

          {/* Right Column: Interactive Accordion List */}
          <div className="faq-list-container lg:col-span-7 divide-y divide-slateCard border-b border-slateCard">
            {faqList.map((item, index) => {
              const isOpen = openIndex === index;
              return (
                <div key={item.id || index} className="faq-row py-4 border-b border-slate-800/60 md:py-6">
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full flex items-center justify-between text-left group focus:outline-none cursor-pointer"
                    aria-expanded={isOpen}
                  >
                    <span
                      className={`text-xs sm:text-sm md:text-lg font-semibold leading-snug transition-colors duration-200 ${
                        isOpen
                          ? 'text-saharaGold'
                          : 'text-slate-200 group-hover:text-saharaGold'
                      }`}
                    >
                      {item.question}
                    </span>
                    <span
                      className={`w-4 h-4 text-[#E69D2B] flex-shrink-0 ml-3 flex items-center justify-center text-xs md:text-2xl font-light transition-transform duration-300 md:w-8 md:h-8 md:rounded-full ${
                        isOpen
                          ? 'rotate-180 md:bg-slateCard/60'
                          : 'group-hover:md:bg-slateCard/40'
                      }`}
                    >
                      {isOpen ? '−' : '+'}
                    </span>
                  </button>
                  <div
                    className={`grid transition-all duration-300 ease-in-out ${
                      isOpen ? 'grid-rows-[1fr] opacity-100 mt-2 sm:mt-3' : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="pt-2 text-xs md:text-sm text-slate-400 leading-relaxed max-w-none font-normal text-left">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
