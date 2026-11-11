import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useCMS } from '../context/CMSContext';
import ScrollRevealText from './common/ScrollRevealText';

export default function SpeakToExperts({ onNavigateContact }) {
  const { content } = useCMS();
  const footerData = content?.home?.footer || {};
  const headline = footerData.headline || 'Speak with our staffing team';
  const subtitle =
    footerData.subtitle ||
    'Our specialized recruiters and executive search partners are ready to review your technical hiring needs and match top-tier talent with speed and precision.';
  const ctaBtn = (Array.isArray(footerData.buttons) && footerData.buttons.find((b) => b?.enabled !== false)) || {
    label: 'Request Talent ->',
  };
  const ctaLabel = (ctaBtn.label || 'Request Talent ->').replace(/\s*(→|->|&rarr;)\s*$/, '').trim();

  return (
    <section className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 py-14 sm:py-24 text-center">
      <ScrollRevealText
        as="h2"
        text={headline}
        className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-[-0.03em] leading-tight text-obsidian font-sans max-w-2xl mx-auto"
      />

      <p className="text-xs sm:text-sm text-obsidian/75 max-w-md mx-auto leading-relaxed mt-4 sm:mt-5 font-inter">
        {subtitle}
      </p>

      {/* Experts Avatar Stack + Primary CTA Button */}
      <div className="mt-7 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4">
        <div className="flex items-center gap-2.5 bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full border border-slate-200/80 shadow-sm">
          <span className="text-xs font-semibold text-obsidian font-sans">Recruiters</span>
          <div className="flex -space-x-2.5">
            <img
              src="/assets/testimonial-sarah.webp"
              alt="Advisor 1"
              loading="lazy"
              decoding="async"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover ring-2 ring-crispWhite shadow-sm hover:scale-110 hover:z-10 transition-transform duration-200 cursor-pointer"
            />
            <img
              src="/assets/testimonial-marcus.webp"
              alt="Advisor 2"
              loading="lazy"
              decoding="async"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover ring-2 ring-crispWhite shadow-sm hover:scale-110 hover:z-10 transition-transform duration-200 cursor-pointer"
            />
            <img
              src="/assets/testimonial-elena.webp"
              alt="Advisor 3"
              loading="lazy"
              decoding="async"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover ring-2 ring-crispWhite shadow-sm hover:scale-110 hover:z-10 transition-transform duration-200 cursor-pointer"
            />
          </div>
        </div>

        <button
          onClick={() => {
            if (onNavigateContact) onNavigateContact();
            else (window.history.pushState({}, '', '/contact'), window.dispatchEvent(new PopStateEvent('popstate')));
          }}
          className="btn-shimmer w-full sm:w-auto min-h-[48px] justify-center bg-obsidian hover:bg-slateCard text-crispWhite text-xs sm:text-sm font-medium px-6 sm:px-8 py-3.5 sm:py-4 rounded-full inline-flex items-center gap-2.5 transition-all shadow-lg active:scale-95 group cursor-pointer"
        >
          <span>{ctaLabel}</span>
          <ArrowRight className="w-4 h-4 text-saharaGold transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </section>
  );
}
