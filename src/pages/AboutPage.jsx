import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useInView, animate } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useCMS } from '../context/CMSContext';
import saharaMarkImg from '../assets/sahara-mark.webp';
import KineticTalentPipeline from '../components/KineticTalentPipeline';

function AnimatedStatCounter({ value }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const [displayVal, setDisplayVal] = useState(value);

  useEffect(() => {
    if (!isInView) return;

    const strVal = String(value || '');
    const match = strVal.match(/^([^0-9]*)([0-9]+)(.*)$/);
    if (!match) {
      setDisplayVal(strVal);
      return;
    }

    const prefix = match[1] || '';
    const targetNum = parseInt(match[2], 10);
    const suffix = match[3] || '';

    const controls = animate(0, targetNum, {
      duration: 1.8,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => {
        setDisplayVal(`${prefix}${Math.floor(latest)}${suffix}`);
      },
      onComplete: () => {
        setDisplayVal(strVal);
      },
    });

    return () => controls.stop();
  }, [isInView, value]);

  return <span ref={ref}>{displayVal}</span>;
}

const DEFAULT_BENCHMARKS = [
  {
    num: '01',
    title: 'Precision & alignment first',
    desc: 'We prioritize candidates whose technical capabilities and leadership temperament align directly with your organizational stack.',
  },
  {
    num: '02',
    title: 'Rigorous multi-stage vetting',
    desc: 'Every candidate completes hands-on technical architecture screens, peer code evaluations, and leadership interviews.',
  },
  {
    num: '03',
    title: 'Placement performance commitment',
    desc: 'We back every technical and executive hire with our comprehensive 90-day placement continuity guarantee.',
  },
];

const DEFAULT_CHAPTERS = [
  {
    id: '01',
    badge: 'CHAPTER 01',
    title: 'Workforce & Role Scoping (Scoping)',
    text: 'Deep-dive alignment with engineering leads and executives to define precise candidate profiles and technical specs.',
    image: '/assets/img 10.webp',
    fallback: '/assets/hero-2.webp',
    tag: 'Role Scoping',
  },
  {
    id: '02',
    badge: 'CHAPTER 02',
    title: 'Targeted Sourcing & Screening (Sourcing)',
    text: 'Leveraging specialized recruiter networks and passive talent pipelines to source and vet exceptional contributors.',
    image: '/assets/img 11.webp',
    fallback: '/assets/img 6.webp',
    tag: 'Targeted Sourcing',
  },
  {
    id: '03',
    badge: 'CHAPTER 03',
    title: 'Candidate Shortlisting & Selection (Selection)',
    text: 'Peer-level technical interviews and architectural screens deliver a curated shortlist complete with diligence notes.',
    image: '/assets/img 12.webp',
    fallback: '/assets/img 4.webp',
    tag: 'Technical Selection',
  },
  {
    id: '04',
    badge: 'CHAPTER 04',
    title: 'Onboarding & Retention SLA (Placement)',
    text: 'Rapid onboarding integration backed by our comprehensive 90-day placement performance commitment.',
    image: '/assets/img 5.webp',
    fallback: '/assets/img 6.webp',
    tag: 'Placement SLA',
  },
];

function splitHeadlineHighlight(headline, highlightWord) {
  const full = String(headline || '');
  const kw = String(highlightWord || '').trim();
  if (!kw) return { before: full, highlight: '' };
  const idx = full.toLowerCase().lastIndexOf(kw.toLowerCase());
  if (idx === -1) return { before: full, highlight: '' };
  return {
    before: full.slice(0, idx).trimEnd(),
    highlight: full.slice(idx),
  };
}

// ============================================================================
// MOBILE HARDWARE-ACCELERATED SNAP DECK (< md)
// ============================================================================
function MobileMindsetDeck({ chapters = DEFAULT_CHAPTERS, mindsetSection = {} }) {
  const deckCards = (chapters && chapters.length > 0 ? chapters : DEFAULT_CHAPTERS).slice(0, 4);
  const scrollRef = useRef(null);
  const thumbRef = useRef(null);
  const rafRef = useRef(null);

  const handleScroll = () => {
    if (rafRef.current) return;
    rafRef.current = window.requestAnimationFrame(() => {
      const container = scrollRef.current;
      const thumb = thumbRef.current;
      if (container && thumb) {
        const maxScroll = container.scrollWidth - container.clientWidth;
        const progress =
          maxScroll > 0 ? Math.min(1, Math.max(0, container.scrollLeft / maxScroll)) : 0;
        const maxTranslatePct = Math.max(0, deckCards.length - 1) * 100;
        thumb.style.transform = `translate3d(${progress * maxTranslatePct}%, 0, 0)`;
      }
      rafRef.current = null;
    });
  };

  const handleTrackClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickRatio = (e.clientX - rect.left) / rect.width;
    const container = scrollRef.current;
    if (container) {
      const maxScroll = container.scrollWidth - container.clientWidth;
      container.scrollTo({ left: clickRatio * maxScroll, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    return () => {
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <section
      id="about-mindset-mobile"
      className="block md:hidden w-full bg-[#FAF9F6] text-[#080B12] border-t border-[#E7E3D9] py-12 px-4 overflow-hidden"
    >
      <div className="max-w-md mx-auto">
        <div className="text-left space-y-2 mb-6">
          <div className="flex items-center gap-2">
            <span className="w-4 h-[1.5px] bg-[#F5A623]" />
            <span className="text-[10px] font-mono font-bold tracking-[0.22em] text-[#B87314] uppercase">
              {mindsetSection?.eyebrow || 'THE SAHARA MINDSET'}
            </span>
          </div>
          <h2 className="text-xl font-bold text-[#080B12] text-left tracking-tight leading-snug font-sans">
            {mindsetSection?.headline || 'A disciplined approach to every engagement.'}
          </h2>
          <p className="text-xs text-slate-600 text-left leading-relaxed mt-1 font-sans">
            {mindsetSection?.subtitle ||
              'Every engagement is structured around clarity, precision, and enduring execution.'}
          </p>
        </div>

        <div
          ref={scrollRef}
          onScroll={handleScroll}
          style={{
            WebkitOverflowScrolling: 'touch',
            touchAction: 'pan-x pan-y',
          }}
          className="overflow-x-auto snap-x snap-mandatory flex gap-4 scrollbar-none px-4 -mx-4 pb-2"
        >
          {deckCards.map((ch, idx) => (
            <div
              key={ch.id || idx}
              className="w-[86vw] max-w-[340px] shrink-0 snap-center relative h-[360px] rounded-2xl overflow-hidden shadow-2xl border border-slate-800 bg-[#0B0F17] select-none transform-gpu will-change-transform transition-transform duration-300 ease-out"
            >
              <img
                src={ch.image}
                onError={(e) => {
                  e.currentTarget.src = ch.fallback || '/assets/hero-2.webp';
                }}
                alt={ch.title}
                className="object-cover w-full h-full brightness-75 contrast-110 pointer-events-none"
                draggable={false}
                loading="lazy"
                decoding="async"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F17] via-[#0B0F17]/60 to-transparent p-6 flex flex-col justify-end text-left pointer-events-none">
                <span className="text-[10px] font-mono text-[#E69D2B] uppercase tracking-widest mb-1 block">
                  {ch.badge || `CHAPTER 0${idx + 1}`} {ch.tag ? `• ${ch.tag}` : ''}
                </span>
                <h3 className="text-xl font-bold text-white tracking-tight leading-snug mb-2 font-sans">
                  {ch.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed font-normal line-clamp-3 font-sans">
                  {ch.text}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-4">
          <div
            onClick={handleTrackClick}
            role="scrollbar"
            aria-label="Chapter scroll indicator"
            className="relative w-28 h-[3px] bg-[#E2DBD0] rounded-full overflow-hidden cursor-pointer"
          >
            <div
              ref={thumbRef}
              style={{
                width: `${100 / Math.max(1, deckCards.length)}%`,
                transform: 'translate3d(0%, 0, 0)',
              }}
              className="h-full bg-[#E69D2B] rounded-full transform-gpu will-change-transform"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// COMPONENT: SECTION FIVE — THE SAHARA MINDSET NARRATIVE CHAPTERS
// ============================================================================
function MindsetSection({
  chapters = DEFAULT_CHAPTERS,
  mindsetSection = {},
  layoutEngine = 'sticky',
  prefersReducedMotion,
  isLivePreview = false,
}) {
  const containerRef = useRef(null);
  const [activeChapter, setActiveChapter] = useState(0);

  const activeChapters = chapters && chapters.length > 0 ? chapters : DEFAULT_CHAPTERS;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  useEffect(() => {
    return scrollYProgress.on('change', (latest) => {
      const total = activeChapters.length;
      const ch = Math.min(total - 1, Math.floor(latest * total));
      setActiveChapter((prev) => (prev !== ch ? ch : prev));
    });
  }, [scrollYProgress, activeChapters.length]);

  const current = activeChapters[activeChapter] || activeChapters[0];
  const eyebrow = mindsetSection?.eyebrow || 'THE SAHARA MINDSET';
  const headline = mindsetSection?.headline || 'A disciplined approach to every engagement.';
  const subtitle =
    mindsetSection?.subtitle ||
    'Every engagement is structured around three foundational stages: understanding the business context, architecting the right strategy, and executing with clarity.';

  if (layoutEngine === 'grid') {
    return (
      <>
        <MobileMindsetDeck chapters={activeChapters} mindsetSection={mindsetSection} />

        <section
          id="about-mindset"
          className="hidden md:block w-full bg-[#FAF9F6] text-[#080B12] border-t border-[#E7E3D9] py-16 sm:py-24 px-5 sm:px-10 lg:px-16"
        >
          <div className="max-w-[1360px] mx-auto space-y-12">
            <div className="max-w-2xl space-y-3">
              <div className="flex items-center gap-2.5">
                <span className="w-5 h-[1.5px] bg-[#F5A623]" />
                <span className="text-[11px] font-bold tracking-[0.24em] text-[#B87314] uppercase font-sans">
                  {eyebrow}
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#080B12] tracking-tight leading-tight font-sans">
                {headline}
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-sans">
                {subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {activeChapters.map((ch, idx) => (
                <div
                  key={ch.id || idx}
                  className="group relative rounded-[28px] overflow-hidden bg-[#0D111B] shadow-xl p-8 sm:p-10 text-white min-h-[340px] flex flex-col justify-end border border-black/10 transition-all duration-300 hover:shadow-2xl"
                >
                  <img
                    src={ch.image}
                    onError={(e) => {
                      e.currentTarget.src = ch.fallback || '/assets/hero-2.webp';
                    }}
                    alt={ch.title}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover object-[center_18%] filter contrast-[1.05] group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#080B12]/95 via-[#080B12]/60 to-[#080B12]/20 pointer-events-none" />
                  <div className="relative z-10 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10.5px] font-mono font-bold tracking-[0.2em] text-[#F5A623] uppercase">
                        {ch.badge || `CHAPTER 0${idx + 1}`}
                      </span>
                      {ch.tag && <span className="text-white/40 text-xs">&bull;</span>}
                      {ch.tag && (
                        <span className="text-[11px] text-white/70 font-sans font-medium">
                          {ch.tag}
                        </span>
                      )}
                    </div>
                    <h3 className="text-2xl font-bold tracking-tight text-white font-sans">
                      {ch.title}
                    </h3>
                    <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-sans font-normal pt-1">
                      {ch.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <MobileMindsetDeck chapters={activeChapters} mindsetSection={mindsetSection} />

      <section
        ref={containerRef}
        id="about-mindset"
        className={`hidden md:block relative w-full bg-[#FAF9F6] text-[#080B12] border-t border-[#E7E3D9] ${
          isLivePreview ? 'h-auto py-8' : 'h-[300vh]'
        }`}
      >
        <div
          className={`${
            isLivePreview
              ? 'relative w-full flex items-center justify-center'
              : 'sticky top-[96px] h-[calc(100vh-108px)] min-h-[420px] w-full flex items-center justify-center'
          }`}
        >
          <div className="w-full max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center overflow-hidden">
            <div className="lg:col-span-5 space-y-4 min-w-0">
              <div className="flex items-center gap-3">
                <span className="w-6 h-[1.5px] bg-[#F5A623]" />
                <span className="text-[11px] sm:text-xs font-bold tracking-[0.24em] text-[#B87314] uppercase font-sans">
                  {eyebrow}
                </span>
              </div>

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#080B12] tracking-[-0.03em] leading-[1.15] font-sans max-w-xl">
                {headline}
              </h2>

              <p className="text-slate-600 text-base sm:text-lg leading-relaxed font-sans max-w-xl font-normal">
                {subtitle}
              </p>

              <div className="flex items-center gap-5 pt-4">
                <div className="flex items-center gap-1.5 font-sans text-xs font-extrabold text-[#B87314]">
                  <span>0{activeChapter + 1}</span>
                  <span className="text-slate-300 font-normal">/</span>
                  <span className="text-slate-400 font-normal">0{activeChapters.length}</span>
                </div>

                {isLivePreview ? (
                  <div className="flex items-center gap-2">
                    {activeChapters.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveChapter(idx)}
                        className={`h-1.5 rounded-full transition-all cursor-pointer ${
                          activeChapter === idx ? 'w-8 bg-[#F5A623]' : 'w-3 bg-[#E2DBD0]'
                        }`}
                        aria-label={`Chapter 0${idx + 1}`}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="relative w-36 sm:w-44 h-[3px] bg-[#E2DBD0] rounded-full overflow-hidden">
                    <motion.div
                      style={{
                        scaleX: scrollYProgress,
                        transformOrigin: 'left',
                      }}
                      className="absolute inset-0 bg-[#F5A623]"
                    />
                  </div>
                )}

                <span className="text-[11px] font-sans font-bold text-slate-500 uppercase tracking-wider transition-colors duration-300 truncate">
                  {current?.tag}
                </span>
              </div>
            </div>

            <div className="lg:col-span-7 relative w-full flex justify-center lg:justify-end min-w-0">
              <div className="relative w-full max-w-lg h-[min(460px,calc(100vh-156px))] min-h-[340px] rounded-[28px] sm:rounded-[36px] overflow-hidden bg-[#0D111B] shadow-2xl">
                {activeChapters.map((ch, idx) => {
                  const isCurrent = activeChapter === idx;
                  return (
                    <div
                      key={ch.id || idx}
                      className={`absolute inset-0 w-full h-full flex flex-col justify-end p-8 sm:p-10 text-white transition-all duration-700 ease-out ${
                        isCurrent
                          ? 'opacity-100 scale-100 z-10 pointer-events-auto visible'
                          : 'opacity-0 scale-[0.98] z-0 pointer-events-none invisible'
                      }`}
                    >
                      <img
                        src={ch.image}
                        onError={(e) => {
                          e.currentTarget.src = ch.fallback || '/assets/hero-2.webp';
                        }}
                        alt={ch.title}
                        loading="lazy"
                        decoding="async"
                        className="absolute inset-0 w-full h-full object-cover object-[center_18%] filter contrast-[1.05]"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-[#080B12]/95 via-[#080B12]/50 to-transparent pointer-events-none" />

                      <div className="relative z-10 max-w-xl space-y-3">
                        <span className="text-[11px] font-sans font-bold tracking-[0.2em] text-[#F5A623] uppercase block">
                          {ch.badge || `CHAPTER 0${idx + 1}`} {ch.tag ? `• ${ch.tag}` : ''}
                        </span>

                        <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-sans leading-tight">
                          {ch.title}
                        </h3>

                        <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-sans font-normal pt-1">
                          {ch.text}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

// ============================================================================
// MAIN COMPONENT: SAHARA STAFFING INC. ABOUT PAGE
// ============================================================================
export default function AboutPage({ onNavigateContact, onNavigateServices }) {
  const { content, settings, isLivePreview } = useCMS();
  const aboutData = content?.about || {};
  const heroData = aboutData?.hero || {};
  const perspectiveData = aboutData?.perspective || {};
  const humanMomentData = aboutData?.humanMoment || {};
  const principlesSection = aboutData?.principlesSection || {};
  const benchmarks =
    Array.isArray(aboutData?.benchmarks) && aboutData.benchmarks.length > 0
      ? aboutData.benchmarks
      : DEFAULT_BENCHMARKS;
  const mindsetSection = aboutData?.mindsetSection || {};
  const statsSection = aboutData?.statsSection || {};
  const stats =
    Array.isArray(aboutData?.stats) && aboutData.stats.length > 0
      ? aboutData.stats
      : [
          { value: '500+', label: 'Technical Placements' },
          { value: '98%', label: 'Placement Retention Rate' },
          { value: '14 Days', label: 'Average Match Time' },
          { value: '90 Days', label: 'Performance Guarantee SLA' },
        ];
  const finalCta = aboutData?.finalCta || {};
  const brandMark = settings?.brandMarkUrl || saharaMarkImg;
  const companyName = settings?.companyName || 'Sahara Staffing Inc.';

  const heroRef = useRef(null);
  const perspectiveRef = useRef(null);
  const humanMomentRef = useRef(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(motionQuery.matches);
    const motionListener = (e) => setPrefersReducedMotion(e.matches);
    motionQuery.addEventListener('change', motionListener);
    return () => motionQuery.removeEventListener('change', motionListener);
  }, []);

  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroImgParallax = useTransform(
    heroScroll,
    [0, 1],
    !prefersReducedMotion ? ['0%', '16%'] : ['0%', '0%']
  );
  const heroTextParallax = useTransform(
    heroScroll,
    [0, 1],
    !prefersReducedMotion ? ['0%', '-12%'] : ['0%', '0%']
  );

  const { scrollYProgress: perspectiveScroll } = useScroll({
    target: perspectiveRef,
    offset: ['start end', 'end start'],
  });
  const perspectiveLeftY = useTransform(
    perspectiveScroll,
    [0, 1],
    !prefersReducedMotion ? [20, -20] : [0, 0]
  );
  const perspectiveRightY = useTransform(
    perspectiveScroll,
    [0, 1],
    !prefersReducedMotion ? [-18, 18] : [0, 0]
  );

  const { scrollYProgress: humanScroll } = useScroll({
    target: humanMomentRef,
    offset: ['start end', 'end start'],
  });
  const humanImgY = useTransform(
    humanScroll,
    [0, 1],
    !prefersReducedMotion ? ['-15%', '15%'] : ['0%', '0%']
  );
  const humanImgScale = useTransform(
    humanScroll,
    [0, 0.5, 1],
    !prefersReducedMotion ? [1.18, 1.12, 1.18] : [1, 1, 1]
  );
  const humanTextY = useTransform(
    humanScroll,
    [0, 1],
    !prefersReducedMotion ? ['18px', '-18px'] : ['0px', '0px']
  );

  const navigateDestination = (destination) => {
    if (destination === '/services' || destination === 'services') {
      if (onNavigateServices) onNavigateServices();
      else window.location.hash = 'services';
      return;
    }
    if (onNavigateContact) onNavigateContact();
    else window.location.hash = 'contact';
  };

  const heroTitleParts = splitHeadlineHighlight(
    heroData.headline || 'A Modern Staffing Firm Built on Precision.',
    heroData.highlightWord || 'Precision.'
  );
  const perspectiveTitleParts = splitHeadlineHighlight(
    perspectiveData.headline || 'Strong growth starts with understanding.',
    perspectiveData.highlightWord || 'understanding.'
  );

  const enabledHeroButtons = (heroData.buttons || []).filter((b) => b?.enabled !== false);
  const enabledFinalButtons = (finalCta.buttons || []).filter((b) => b?.enabled !== false);

  return (
    <div className="w-full bg-[#080B12] text-white font-sans selection:bg-[#F5A623] selection:text-[#080B12] overflow-x-clip">
      {/* 01. HERO SECTION */}
      <section
        id="about-hero"
        ref={heroRef}
        className="relative w-full pt-28 sm:pt-36 lg:pt-36 pb-14 sm:pb-20 px-5 sm:px-10 lg:px-16 flex flex-col justify-center border-b border-white/[0.08] overflow-hidden"
      >
        <div className="max-w-[1360px] mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
            <motion.div
              style={{ y: heroTextParallax }}
              className="lg:col-span-7 space-y-4 sm:space-y-5 will-change-transform"
            >
              <motion.div
                initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center gap-3"
              >
                <span className="w-6 h-[1.5px] bg-[#F5A623]" />
                <span className="text-[11px] sm:text-xs font-bold tracking-[0.24em] text-[#F5A623] uppercase font-sans">
                  {heroData.kicker || 'SAHARA STAFFING INC. / WHO WE ARE'}
                </span>
              </motion.div>

              <h1 className="text-3xl sm:text-4xl lg:text-[48px] font-extrabold text-white tracking-tight leading-[1.12] font-sans max-w-xl">
                {heroTitleParts.before && (
                  <span className="block overflow-hidden">
                    <motion.span
                      initial={prefersReducedMotion ? { y: 0 } : { y: '100%' }}
                      animate={{ y: 0 }}
                      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                      className="block"
                    >
                      {heroTitleParts.before}
                    </motion.span>
                  </span>
                )}
                {heroTitleParts.highlight && (
                  <span className="block overflow-hidden">
                    <motion.span
                      initial={prefersReducedMotion ? { y: 0 } : { y: '100%' }}
                      animate={{ y: 0 }}
                      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                      className="block text-[#F5A623]"
                    >
                      {heroTitleParts.highlight}
                    </motion.span>
                  </span>
                )}
              </h1>

              <motion.div
                initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-4 pt-1"
              >
                <p className="text-gray-400 text-base sm:text-lg leading-relaxed font-normal max-w-lg font-sans">
                  {heroData.subtitle ||
                    'Connecting ambitious enterprises with specialized technical talent and executive leadership.'}
                </p>
              </motion.div>
            </motion.div>

            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <motion.div
                initial={
                  prefersReducedMotion
                    ? { opacity: 1 }
                    : { opacity: 0, clipPath: 'inset(10% 0% 10% 0% round 24px)' }
                }
                animate={{ opacity: 1, clipPath: 'inset(0% 0% 0% 0% round 32px)' }}
                transition={{ duration: 1.1, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                style={{ y: heroImgParallax }}
                className="relative w-full max-w-[440px] aspect-[4/5] sm:aspect-[1/1] lg:aspect-[4/5] rounded-[28px] sm:rounded-[36px] overflow-hidden border border-white/10 shadow-[0_28px_72px_rgba(0,0,0,0.65)] bg-[#0D111B] group will-change-transform"
              >
                <img
                  src={heroData.heroImage || '/assets/img 14.webp'}
                  onError={(e) => {
                    e.currentTarget.src = heroData.heroFallbackImage || '/assets/img 8.webp';
                  }}
                  alt={heroData.heroImageBadgeRight || companyName}
                  loading="eager"
                  decoding="async"
                  className="w-full h-full object-cover object-top filter grayscale-[15%] contrast-[1.05] group-hover:scale-103 group-hover:grayscale-0 transition-all duration-700 ease-out"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#080B12]/85 via-transparent to-transparent pointer-events-none" />

                <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-xs text-slate-300/90 font-sans pointer-events-none">
                  <span className="font-medium tracking-wide">
                    {heroData.heroImageBadgeLeft || 'People-Centered Strategy'}
                  </span>
                  <span className="text-[#F5A623] font-sans font-semibold text-[11px] uppercase tracking-wider">
                    {heroData.heroImageBadgeRight || companyName}
                  </span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* 02. EDITORIAL PERSPECTIVE BAND */}
      <section
        id="about-perspective"
        ref={perspectiveRef}
        className="relative w-full bg-[#FAF9F6] text-[#080B12] py-16 sm:py-24 px-5 sm:px-10 lg:px-16 border-b border-[#E7E3D9] overflow-hidden"
      >
        <div className="max-w-[1360px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          <motion.div style={{ y: perspectiveLeftY }} className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-6 h-[1.5px] bg-[#F5A623]" />
              <span className="text-[11px] sm:text-xs font-bold tracking-[0.24em] text-[#B87314] uppercase font-sans">
                {perspectiveData.eyebrow || 'OUR PERSPECTIVE'}
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#080B12] tracking-[-0.03em] leading-[1.15] font-sans max-w-xl">
              {perspectiveTitleParts.before}{' '}
              {perspectiveTitleParts.highlight && (
                <span className="text-[#B87314]">{perspectiveTitleParts.highlight}</span>
              )}
            </h2>
          </motion.div>

          <motion.div style={{ y: perspectiveRightY }} className="lg:col-span-7 space-y-4 text-slate-700 text-base sm:text-lg leading-relaxed font-sans">
            <p>
              {perspectiveData.paragraph1 ||
                'We take the time to understand your organization’s goals, technical ecosystem, and operational priorities before designing any engagement.'}
            </p>
            <p className="text-slate-600">
              {perspectiveData.paragraph2 ||
                'By prioritizing genuine communication and long-term alignment over generic playbooks, we create strategic engagements that endure.'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* 03. STREAMLINED CINEMATIC EDITORIAL STATEMENT */}
      <section
        ref={humanMomentRef}
        className="relative w-full bg-[#FAF9F6] py-10 sm:py-20 lg:py-24 px-4 sm:px-8 lg:px-12 border-b border-[#E7E3D9] overflow-hidden"
      >
        <div className="max-w-[1360px] mx-auto w-full">
          <div
            style={{
              transform: 'translateZ(0)',
              WebkitMaskImage: '-webkit-radial-gradient(white, black)',
            }}
            className="relative w-full rounded-[24px] sm:rounded-[36px] lg:rounded-[44px] overflow-hidden bg-[#0D111B] shadow-2xl min-h-[360px] sm:min-h-[480px] aspect-auto sm:aspect-[2/1] lg:aspect-[2.3/1] flex items-end p-5 sm:p-14 lg:p-16 text-white group border-0 outline-none ring-0 isolate"
          >
            <div
              className="absolute inset-x-0 -top-[20%] -bottom-[20%] w-full h-[140%] pointer-events-none overflow-hidden will-change-transform"
              style={{ transform: 'translateZ(0)' }}
            >
              <motion.img
                src={humanMomentData.image || '/assets/img 4.webp'}
                onError={(e) => {
                  e.currentTarget.src = humanMomentData.fallbackImage || '/assets/img 2.webp';
                }}
                alt={humanMomentData.headline || 'Enterprise leadership collaboration'}
                loading="lazy"
                decoding="async"
                style={{ y: humanImgY, scale: humanImgScale }}
                className="w-full h-full object-cover object-center filter contrast-[1.05] will-change-transform"
              />
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-[#080B12]/95 via-[#080B12]/45 to-transparent pointer-events-none" />

            <motion.div
              style={{ y: humanTextY }}
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 22 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 max-w-2xl space-y-2.5 sm:space-y-3.5 will-change-transform w-full"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-5 h-[1.5px] bg-[#F5A623]" />
                <span className="text-[10px] sm:text-[11px] font-sans font-bold tracking-[0.24em] text-[#F5A623] uppercase block">
                  {humanMomentData.eyebrow || 'OUR PERSPECTIVE'}
                </span>
              </div>

              <h2 className="text-xl sm:text-4xl lg:text-[44px] font-extrabold text-white tracking-tight sm:tracking-[-0.03em] leading-snug sm:leading-[1.12] font-sans break-words">
                {humanMomentData.headline || 'Growth is about people and clarity, not just checklists.'}
              </h2>

              <p className="text-slate-200 text-xs sm:text-base lg:text-lg leading-relaxed font-sans max-w-xl font-normal pt-1">
                {humanMomentData.description ||
                  'Behind every initiative is a business objective and a leadership vision. We align both with precision, accountability, and sustained momentum.'}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 04. SECTION FOUR — PRINCIPLES / CORE VALUES */}
      <section
        id="about-benchmarks"
        className="relative w-full bg-[#0D111B] text-white py-28 sm:py-36 lg:py-40 px-6 sm:px-10 lg:px-16 border-b border-white/[0.08]"
      >
        <div className="max-w-[1360px] mx-auto space-y-16 sm:space-y-20">
          <motion.div
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl space-y-4"
          >
            <div className="flex items-center gap-3">
              <span className="w-6 h-[1.5px] bg-[#F5A623]" />
              <span className="text-[11px] sm:text-xs font-bold tracking-[0.24em] text-[#F5A623] uppercase font-sans">
                {principlesSection.eyebrow || 'WHAT GUIDES US'}
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-[-0.03em] leading-[1.15] font-sans max-w-xl">
              {principlesSection.headline || 'A more thoughtful approach.'}
            </h2>

            <p className="text-slate-300 text-base sm:text-lg leading-relaxed font-sans max-w-xl pt-1">
              {principlesSection.subtitle ||
                'We believe enterprise staffing begins with understanding your business, respecting the teams involved, and focusing on measurable alignment.'}
            </p>
          </motion.div>

          <div className="divide-y divide-white/10 border-y border-white/10">
            {benchmarks.map((item, index) => (
              <motion.div
                key={item.num || index}
                initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.55, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="group py-8 sm:py-10 transition-colors duration-300 hover:bg-white/[0.02]"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-baseline">
                  <div className="lg:col-span-2 flex items-baseline gap-3">
                    <span className="text-xl sm:text-2xl font-sans font-extrabold text-[#F5A623] tracking-tight">
                      {item.num || `0${index + 1}`}
                    </span>
                    <span className="hidden lg:block w-8 h-[2px] bg-white/20 group-hover:w-14 group-hover:bg-[#F5A623] transition-all duration-500 rounded-full" />
                  </div>

                  <div className="lg:col-span-4">
                    <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-sans group-hover:text-[#F5A623] transition-colors duration-300">
                      {item.title}
                    </h3>
                  </div>

                  <div className="lg:col-span-6">
                    <p className="text-slate-300 text-base sm:text-lg leading-relaxed font-sans font-normal">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 05. SECTION FIVE — THE SAHARA MINDSET */}
      <MindsetSection
        chapters={aboutData?.chapters}
        mindsetSection={mindsetSection}
        layoutEngine={aboutData?.chaptersLayout}
        prefersReducedMotion={prefersReducedMotion}
        isLivePreview={isLivePreview}
      />

      {/* 06. SECTION SIX — HARD SCALE STATS */}
      <section
        id="about-stats"
        className="relative w-full bg-[#FAF9F6] text-[#080B12] py-14 sm:py-28 px-4 sm:px-10 lg:px-16 border-b border-[#E7E3D9]"
      >
        <div className="max-w-[1360px] mx-auto space-y-8 sm:space-y-12">
          <div className="max-w-2xl space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-6 h-[1.5px] bg-[#F5A623]" />
              <span className="text-[11px] sm:text-xs font-bold tracking-[0.24em] text-[#B87314] uppercase font-sans">
                {statsSection.eyebrow || 'MEASURABLE SCALE'}
              </span>
            </div>
            <h2 className="text-2xl sm:text-5xl font-extrabold text-[#080B12] tracking-tight leading-tight font-sans">
              {statsSection.headline || 'Proven Velocity at Scale.'}
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className="p-4 sm:p-6 rounded-2xl bg-white border border-[#E7E3D9] shadow-sm space-y-1.5 sm:space-y-2 min-w-0 flex flex-col justify-between overflow-hidden"
              >
                <span className="text-[22px] sm:text-4xl lg:text-5xl font-extrabold text-[#B87314] tracking-tight font-sans block leading-tight whitespace-nowrap">
                  <AnimatedStatCounter value={stat.value} />
                </span>
                <span className="text-[11px] sm:text-sm font-semibold text-slate-700 tracking-wide font-sans block leading-snug">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 07. PHILOSOPHY PIPELINE */}
      <KineticTalentPipeline />

      {/* 08. FINAL CTA */}
      <section
        id="about-final-cta"
        className="relative w-full bg-[#080B12] text-white py-28 sm:py-36 lg:py-44 px-6 sm:px-10 lg:px-16 text-center overflow-hidden"
      >
        {finalCta?.backgroundImage && (
          <div className="absolute inset-0 pointer-events-none opacity-25">
            <img
              src={finalCta.backgroundImage}
              alt="Background overlay"
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#080B12] via-[#080B12]/80 to-[#080B12]" />
          </div>
        )}
        <motion.div
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 max-w-[880px] mx-auto space-y-7 sm:space-y-8"
        >
          <div className="flex justify-center">
            <img
              src={brandMark}
              onError={(e) => {
                e.currentTarget.src = saharaMarkImg;
              }}
              alt={companyName}
              loading="lazy"
              decoding="async"
              className="h-9 sm:h-10 w-auto object-contain opacity-90 drop-shadow-[0_4px_16px_rgba(245,166,35,0.25)]"
            />
          </div>

          <span className="text-[11px] sm:text-xs font-bold tracking-[0.24em] text-[#F5A623] uppercase font-sans block">
            {finalCta?.eyebrow || 'SAHARA STAFFING INC.'}
          </span>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-[-0.03em] leading-[1.15] font-sans max-w-xl mx-auto">
            {finalCta?.headline || 'Let’s secure the talent behind your next stage.'}
          </h2>

          <p className="text-slate-300 text-base sm:text-lg lg:text-xl max-w-xl mx-auto leading-relaxed font-sans font-normal">
            {finalCta?.subtitle ||
              'From critical contractor placements to executive search, Sahara Staffing is your precision talent partner.'}
          </p>

          <div className="pt-4 flex flex-wrap justify-center gap-4">
            {(enabledFinalButtons.length > 0
              ? enabledFinalButtons
              : [{ id: 'default-cta', label: 'Request Talent ->', destination: '/contact', variant: 'primary' }]
            ).map((btn, idx) => (
              <button
                key={btn.id || idx}
                type="button"
                onClick={() => navigateDestination(btn.destination)}
                className="bg-[#F5A623] hover:bg-[#F2A51A] text-[#080B12] font-bold text-sm sm:text-base px-9 sm:px-10 py-4 rounded-full inline-flex items-center gap-3 shadow-xl hover:shadow-2xl transition-all duration-300 active:scale-95 group cursor-pointer"
              >
                <span>{btn.label}</span>
                <ArrowRight className="w-4 h-4 text-[#080B12] group-hover:translate-x-1.5 transition-transform duration-300" />
              </button>
            ))}
          </div>
        </motion.div>
      </section>
    </div>
  );
}
