import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { useCMS } from '../context/CMSContext';

gsap.registerPlugin(ScrollTrigger);

const DEFAULT_SCROLL_SECTION = {
  enabled: true,
  kicker: 'THE SAHARA PROCESS',
  stages: [
    {
      id: 1,
      eyebrow: 'STAGE 01',
      badge: 'STAGE 01',
      title: 'Workforce & Role Scoping',
      description:
        'We analyze your technical requirements, team dynamics, and operational goals to define precise candidate profiles.',
      image: '/assets/card1-staffing.webp',
    },
    {
      id: 2,
      eyebrow: 'STAGE 02',
      badge: 'STAGE 02',
      title: 'Targeted Sourcing & Screening',
      description:
        'Our specialized recruiters leverage deep industry networks to source and rigorously vet top talent.',
      image: '/assets/card3-workforce.webp',
      spotlight: {
        image: '/assets/female-executive-beige.webp',
        name: 'Elena Vance',
        role: 'VP of Systems Engineering',
        bio: '14 years leading infrastructure architecture and technical executive placement for high-growth enterprises.',
      },
    },
    {
      id: 3,
      eyebrow: 'STAGE 03',
      badge: 'STAGE 03',
      title: 'Candidate Shortlisting & Selection',
      description:
        'Receive a curated shortlist of high-fit candidates complete with technical assessments and executive summaries.',
      image: '/assets/img 22.webp',
      sideNote:
        'Direct communication, thoughtful alignment, and mutual clarity from initial role scoping through final offer and onboarding.',
      sideAccent: 'Human judgment at every step.',
    },
    {
      id: 4,
      eyebrow: 'STAGE 04',
      badge: 'STAGE 04',
      title: 'Onboarding & Continuity Support',
      description:
        'We ensure rapid candidate integration backed by our 90-day placement performance commitment.',
      image: '/assets/hero-1.webp',
      primaryCtaLabel: 'View Services',
      primaryCtaRoute: 'services',
      secondaryCtaLabel: 'Discuss Hiring Needs',
      secondaryCtaRoute: 'contact',
    },
  ],
};

export default function VettingProcess({ onNavigateContact, onNavigateServices }) {
  const { content, isLivePreview } = useCMS();
  const scrollSection = content?.home?.scrollHijackSection || DEFAULT_SCROLL_SECTION;
  const isEnabled = scrollSection?.enabled !== false;
  const kicker = scrollSection?.kicker || DEFAULT_SCROLL_SECTION.kicker;

  const stages = [0, 1, 2, 3].map((idx) => ({
    ...DEFAULT_SCROLL_SECTION.stages[idx],
    ...(scrollSection?.stages?.[idx] || {}),
  }));

  const [stage1, stage2, stage3, stage4] = stages;

  const containerRef = useRef(null);
  const stageRef = useRef(null);

  // Background photographic layers
  const bg1Ref = useRef(null);
  const bg2Ref = useRef(null);
  const bg3Ref = useRef(null);
  const bg4Ref = useRef(null);

  // Scene DOM refs
  const scene1Ref = useRef(null);
  const scene2Ref = useRef(null);
  const scene3Ref = useRef(null);
  const scene4Ref = useRef(null);

  // Scene 2 & 4 editorial refs
  const scene2TextRef = useRef(null);
  const scene2ProfileRef = useRef(null);
  const scene4ContentRef = useRef(null);
  const ctaBtnRef = useRef(null);

  // Interactive state
  const [activeStage, setActiveStage] = useState(0);
  const [overallProgress, setOverallProgress] = useState(0);
  const [isStaticStage, setIsStaticStage] = useState(Boolean(isLivePreview));

  useEffect(() => {
    if (!isEnabled) return undefined;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || isLivePreview) {
      setIsStaticStage(true);
      return undefined;
    }

    setIsStaticStage(false);

    const mm = gsap.matchMedia();

    mm.add('(min-width: 768px)', () => {
      if (!containerRef.current || !bg1Ref.current || !scene1Ref.current) return;

      const masterTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.1,
          onUpdate: (self) => {
            const p = self.progress;
            setOverallProgress(p);

            let stageIndex = 0;
            if (p < 0.25) stageIndex = 0;
            else if (p < 0.5) stageIndex = 1;
            else if (p < 0.75) stageIndex = 2;
            else stageIndex = 3;
            setActiveStage(stageIndex);
          },
        },
      });

      gsap.set(bg1Ref.current, { opacity: 1, scale: 1 });
      gsap.set(bg2Ref.current, { opacity: 0, scale: 1.04 });
      gsap.set(bg3Ref.current, { opacity: 0, scale: 1.04 });
      gsap.set(bg4Ref.current, { opacity: 0, scale: 1.02 });

      gsap.set(scene1Ref.current, { opacity: 1, visibility: 'visible', y: 0 });
      gsap.set(scene2Ref.current, { opacity: 0, visibility: 'hidden', y: 24 });
      gsap.set(scene3Ref.current, { opacity: 0, visibility: 'hidden', y: 24 });
      gsap.set(scene4Ref.current, { opacity: 0, visibility: 'hidden', y: 24 });

      masterTl
        .to(bg1Ref.current, { scale: 1.04, y: -15, duration: 20, ease: 'none' }, 0)
        .to(scene1Ref.current, { opacity: 0, y: -24, duration: 6, ease: 'power2.inOut' }, 20)
        .set(scene1Ref.current, { visibility: 'hidden' }, 26)

        .to(bg1Ref.current, { opacity: 0, duration: 8, ease: 'power2.inOut' }, 22)
        .set(scene2Ref.current, { visibility: 'visible' }, 24)
        .to(bg2Ref.current, { opacity: 1, scale: 1, duration: 8, ease: 'power2.inOut' }, 24)
        .to(scene2Ref.current, { opacity: 1, y: 0, duration: 6, ease: 'power2.out' }, 24)
        .fromTo(
          scene2ProfileRef.current,
          { opacity: 0, y: 35 },
          { opacity: 1, y: 0, duration: 8, ease: 'power2.out' },
          26
        )
        .to(bg2Ref.current, { scale: 1.03, y: -12, duration: 18, ease: 'none' }, 28)
        .to(scene2Ref.current, { opacity: 0, y: -24, duration: 6, ease: 'power2.inOut' }, 44)
        .set(scene2Ref.current, { visibility: 'hidden' }, 50)

        .to(bg2Ref.current, { opacity: 0, duration: 8, ease: 'power2.inOut' }, 46)
        .set(scene3Ref.current, { visibility: 'visible' }, 48)
        .to(bg3Ref.current, { opacity: 1, scale: 1, duration: 8, ease: 'power2.inOut' }, 48)
        .to(scene3Ref.current, { opacity: 1, y: 0, duration: 6, ease: 'power2.out' }, 48)
        .to(bg3Ref.current, { scale: 1.03, y: -12, duration: 18, ease: 'none' }, 52)
        .to(scene3Ref.current, { opacity: 0, y: -24, duration: 6, ease: 'power2.inOut' }, 68)
        .set(scene3Ref.current, { visibility: 'hidden' }, 74)

        .to(bg3Ref.current, { opacity: 0, duration: 8, ease: 'power2.inOut' }, 70)
        .set(scene4Ref.current, { visibility: 'visible' }, 72)
        .to(bg4Ref.current, { opacity: 1, scale: 1, duration: 8, ease: 'power2.inOut' }, 72)
        .to(scene4Ref.current, { opacity: 1, y: 0, duration: 6, ease: 'power2.out' }, 72)
        .fromTo(
          scene4ContentRef.current,
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, duration: 8, ease: 'power2.out' },
          74
        )
        .fromTo(
          ctaBtnRef.current,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 8, ease: 'power2.out' },
          78
        )
        .to(bg4Ref.current, { scale: 1.02, y: -10, duration: 18, ease: 'none' }, 78);
    });

    return () => {
      mm.revert();
    };
  }, [isEnabled, isLivePreview]);

  if (!isEnabled) {
    return null;
  }

  const handleRouteClick = (route) => {
    if (route === 'services' && onNavigateServices) {
      onNavigateServices();
      return;
    }
    if (onNavigateContact) {
      onNavigateContact();
    }
  };

  const renderDesktopBg = (bgRef, idx, src, alt, objectPosition = 'object-center', eager = false) => (
    <div
      ref={bgRef}
      className={`absolute inset-0 w-full h-full will-change-transform transition-opacity duration-500 ${
        isStaticStage
          ? Math.min(3, activeStage) === idx
            ? 'opacity-100 visible'
            : 'opacity-0 invisible'
          : idx === 0
            ? ''
            : 'opacity-0'
      }`}
    >
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover ${objectPosition}`}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0B0F17]/95 via-[#0B0F17]/70 to-[#0B0F17]/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F17] via-transparent to-transparent opacity-65" />
    </div>
  );

  const sceneClass = (idx, extra = 'w-full') =>
    `will-change-transform transition-all duration-500 ease-in-out ${extra} ${
      isStaticStage
        ? Math.min(3, activeStage) === idx
          ? 'relative z-10 opacity-100 translate-y-0 pointer-events-auto visible'
          : 'absolute inset-x-8 sm:inset-x-14 lg:inset-x-20 z-0 opacity-0 translate-y-4 pointer-events-none invisible'
        : `absolute inset-x-8 sm:inset-x-14 lg:inset-x-20 ${idx === 0 ? '' : 'opacity-0 invisible'}`
    }`;

  return (
    <>
      {/* 1. MOBILE: STAGE STACK (< md) */}
      <section
        id="process-story-mobile"
        className="block md:hidden w-full bg-[#0B0F17] text-white px-4 py-10"
      >
        <div className="max-w-xl mx-auto">
          <div className="text-left mb-5">
            <span className="text-[11px] font-mono font-bold tracking-[0.2em] uppercase text-[#E69D2B] block mb-1">
              {kicker}
            </span>
            <h2 className="text-lg font-bold text-white text-left tracking-tight leading-snug">
              {stage1.title}
            </h2>
          </div>

          <div>
            {stages.map((st, idx) => (
              <div
                key={st.id || idx}
                className="relative w-full rounded-xl overflow-hidden border border-slate-800/80 min-h-[104px] flex items-center mb-3 shadow-lg bg-[#0B0F17]"
              >
                <img
                  src={st.image || DEFAULT_SCROLL_SECTION.stages[idx].image}
                  onError={(e) => {
                    e.currentTarget.src = DEFAULT_SCROLL_SECTION.stages[idx].image;
                  }}
                  alt={st.title}
                  className="absolute inset-0 w-full h-full object-cover grayscale contrast-125 opacity-40 pointer-events-none"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0B0F17] via-[#0B0F17]/90 to-[#0B0F17]/30 pointer-events-none" />

                <div className="relative z-10 p-4 flex items-start justify-between w-full gap-4">
                  <span className="text-xl font-black font-mono text-[#E69D2B] min-w-[32px] leading-none pt-0.5">
                    0{idx + 1}
                  </span>

                  <div className="flex-1 min-w-0 text-left">
                    {st.badge && (
                      <span className="text-[10px] font-mono uppercase tracking-[0.16em] text-[#E69D2B] block mb-0.5">
                        {st.badge}
                      </span>
                    )}
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                      {st.title}
                    </h3>
                    <p className="text-[11px] text-slate-300 leading-snug mt-1 font-normal">
                      {st.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. DESKTOP EDITORIAL CANVAS (Pinned Master Scroll Narrative: md+) */}
      <section
        id="process-story"
        ref={containerRef}
        className={`hidden md:block relative w-full ${
          isStaticStage ? 'min-h-[620px] h-auto' : 'h-[360vh]'
        } bg-[#0B0F17] text-white select-none overflow-clip`}
      >
        <div
          ref={stageRef}
          className={`${
            isStaticStage ? 'relative min-h-[620px]' : 'sticky top-0 h-screen'
          } w-full overflow-hidden flex flex-col justify-between`}
        >
          {/* Photographic Canvas */}
          <div
            className="absolute inset-0 z-0 pointer-events-none overflow-hidden will-change-transform"
            style={{ transform: 'translateZ(0)' }}
          >
            {renderDesktopBg(bg1Ref, 0, stage1.image, stage1.title, 'object-[center_25%]', true)}
            {renderDesktopBg(bg2Ref, 1, stage2.image, stage2.title)}
            {renderDesktopBg(bg3Ref, 2, stage3.image, stage3.title)}
            {renderDesktopBg(bg4Ref, 3, stage4.image, stage4.title)}
          </div>

          {/* Restrained Top Kicker */}
          <header className="relative z-20 w-full px-8 sm:px-14 lg:px-20 pt-8 sm:pt-10 flex items-center justify-between text-white transition-colors duration-700">
            <div className="flex items-center gap-3">
              <span className="text-xs font-sans font-semibold tracking-[0.2em] uppercase text-[#F5A623]">
                {kicker}
              </span>
            </div>

            {/* Quiet Step Counter on Static Top Right */}
            <div className="text-xs font-sans tracking-wide text-white/70">
              <span>{stages[activeStage]?.badge || `STAGE 0${activeStage + 1}`}</span>
            </div>
          </header>

          {/* Narrative Stage */}
          <div className="relative z-10 flex-1 w-full max-w-[1360px] mx-auto px-8 sm:px-14 lg:px-20 flex items-center min-h-[400px]">
            {/* SCENE 01 */}
            <div ref={scene1Ref} className={sceneClass(0, 'max-w-2xl')}>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium text-white tracking-tight leading-[1.08] mb-6 font-sans">
                {stage1.title}
              </h2>
              <p className="text-slate-300 text-base sm:text-lg font-normal leading-relaxed max-w-xl font-sans">
                {stage1.description}
              </p>
            </div>

            {/* SCENE 02 */}
            <div
              ref={scene2Ref}
              className={sceneClass(1, stage2.spotlight ? 'grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center' : 'max-w-2xl')}
            >
              <div ref={scene2TextRef} className={stage2.spotlight ? 'lg:col-span-6 pr-0 lg:pr-4' : ''}>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium text-white tracking-tight leading-[1.08] mb-6 font-sans">
                  {stage2.title}
                </h2>
                <p className="text-slate-300 text-base sm:text-lg font-normal leading-relaxed font-sans max-w-lg">
                  {stage2.description}
                </p>
              </div>

              {stage2.spotlight && (
                <div
                  ref={scene2ProfileRef}
                  className="lg:col-span-6 flex flex-col sm:flex-row gap-5 sm:gap-6 items-start sm:items-center min-w-0"
                >
                  <img
                    src={stage2.spotlight.image || '/assets/female-executive-beige.webp'}
                    alt={stage2.spotlight.name || 'Recruitment Leadership'}
                    loading="lazy"
                    decoding="async"
                    className="w-36 sm:w-44 lg:w-48 h-48 sm:h-56 lg:h-64 object-cover object-top shadow-2xl flex-shrink-0 rounded-sm"
                  />
                  <div className="space-y-2.5 font-sans min-w-0 flex-1 pr-2">
                    <div>
                      <h3 className="text-2xl sm:text-3xl font-medium text-white tracking-tight">
                        {stage2.spotlight.name}
                      </h3>
                      <p className="text-sm sm:text-base text-[#F5A623] font-normal mt-0.5">
                        {stage2.spotlight.role}
                      </p>
                    </div>
                    <p className="text-slate-300 text-xs sm:text-sm font-normal leading-relaxed max-w-xs">
                      {stage2.spotlight.bio}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* SCENE 03 */}
            <div
              ref={scene3Ref}
              className={sceneClass(2, stage3.sideNote ? 'grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center' : 'max-w-2xl')}
            >
              <div className={stage3.sideNote ? 'lg:col-span-7 pr-0 lg:pr-4' : ''}>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium text-white tracking-tight leading-[1.08] mb-6 font-sans">
                  {stage3.title}
                </h2>
                <p className="text-slate-300 text-base sm:text-lg font-normal leading-relaxed max-w-lg font-sans">
                  {stage3.description}
                </p>
              </div>

              {stage3.sideNote && (
                <div className="lg:col-span-5 pl-0 lg:pl-6 border-l-0 lg:border-l border-white/20 min-w-0">
                  <p className="text-slate-300 text-sm sm:text-base font-normal leading-relaxed font-sans max-w-sm">
                    {stage3.sideNote}
                  </p>
                  {stage3.sideAccent && (
                    <span className="text-xs text-[#F5A623] font-medium tracking-wide mt-3 block">
                      {stage3.sideAccent}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* SCENE 04 */}
            <div ref={scene4Ref} className={sceneClass(3, 'max-w-3xl')}>
              <div ref={scene4ContentRef}>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium text-white tracking-tight leading-[1.08] mb-6 font-sans">
                  {stage4.title}
                </h2>
                <p className="text-slate-300 text-base sm:text-lg font-normal leading-relaxed max-w-xl font-sans mb-8">
                  {stage4.description}
                </p>

                <div ref={ctaBtnRef} className="flex flex-wrap items-center gap-6">
                  <button
                    type="button"
                    onClick={() => handleRouteClick(stage4.primaryCtaRoute || 'services')}
                    className="rounded-full px-7 py-3.5 bg-[#0B0F17] hover:bg-[#E69D2B] hover:text-[#0B0F17] text-white font-semibold transition-all duration-300 shadow-md border border-white/20 hover:border-[#E69D2B] inline-flex items-center gap-3 cursor-pointer group"
                  >
                    <span>{stage4.primaryCtaLabel || 'View Services'}</span>
                    <ArrowRight className="w-4 h-4 text-[#E69D2B] transition-transform duration-200 group-hover:translate-x-1" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRouteClick(stage4.secondaryCtaRoute || 'contact')}
                    className="text-slate-300 hover:text-white text-base font-medium px-4 py-3.5 transition-colors duration-200 inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>{stage4.secondaryCtaLabel || 'Discuss Hiring Needs'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 1px Hairline Progress Bar */}
          <footer className="relative z-20 w-full px-8 sm:px-14 lg:px-20 pb-6 sm:pb-8">
            <div className="w-full h-[1px] overflow-hidden bg-white/10">
              <div
                className="h-full transition-all duration-75 bg-[#F5A623]"
                style={{ width: `${Math.round(overallProgress * 100)}%` }}
              />
            </div>
          </footer>
        </div>
      </section>
    </>
  );
}
