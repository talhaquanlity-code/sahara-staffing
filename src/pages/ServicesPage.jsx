import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useCMS } from '../context/CMSContext';

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

function HeroPanoramicFrame({
  src,
  fallbackSrc,
  alt,
  isDesktop = false,
  prefersReducedMotion = false,
  children,
}) {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const canParallax = isDesktop && !prefersReducedMotion;
  const parallaxY = useTransform(
    scrollYProgress,
    [0, 1],
    canParallax ? ['-12%', '12%'] : ['0%', '0%']
  );

  return (
    <motion.div
      ref={containerRef}
      initial={
        prefersReducedMotion
          ? { opacity: 0 }
          : { opacity: 0, clipPath: 'inset(4% 0% 4% 0% round 20px)' }
      }
      animate={{ opacity: 1, clipPath: 'inset(0% 0% 0% 0% round 28px)' }}
      transition={{ duration: 1.1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full rounded-2xl sm:rounded-[28px] overflow-hidden bg-slate-900 shadow-2xl border border-black/[0.08] aspect-[16/10] sm:aspect-[21/9] max-h-[320px] sm:max-h-[540px] will-change-transform"
    >
      <div
        className="absolute inset-x-0 -top-[16%] -bottom-[16%] pointer-events-none will-change-transform"
        style={{ transform: 'translateZ(0)' }}
      >
        <motion.img
          src={src}
          onError={(e) => {
            if (fallbackSrc) e.currentTarget.src = fallbackSrc;
          }}
          alt={alt}
          style={{ y: parallaxY }}
          initial={prefersReducedMotion ? { scale: 1 } : { scale: 1.12 }}
          animate={{ scale: 1.05 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          className="w-full h-full object-cover object-center will-change-transform"
          loading="eager"
          decoding="async"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F17]/75 via-transparent to-black/10 pointer-events-none" />
      {children}
    </motion.div>
  );
}

function ServicePhotoFrame({
  src,
  fallbackSrc,
  alt,
  revealType = 'vertical',
  aspectRatio = 'aspect-[16/10] sm:aspect-[14/10]',
  className = '',
  isDesktop = false,
  prefersReducedMotion = false,
}) {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const canParallax = isDesktop && !prefersReducedMotion;
  const parallaxY = useTransform(
    scrollYProgress,
    [0, 1],
    canParallax
      ? revealType === 'vertical'
        ? ['-3%', '3%']
        : revealType === 'horizontal'
          ? ['2.5%', '-2.5%']
          : ['-2%', '2%']
      : ['0%', '0%']
  );

  const clipInitial = prefersReducedMotion
    ? 'inset(0% 0% 0% 0% round 24px)'
    : revealType === 'vertical'
      ? 'inset(0% 0% 10% 0% round 20px)'
      : revealType === 'horizontal'
        ? 'inset(0% 8% 0% 0% round 20px)'
        : 'inset(4% 4% 4% 4% round 20px)';

  const clipFinal = 'inset(0% 0% 0% 0% round 28px)';

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, clipPath: clipInitial }}
      whileInView={{ opacity: 1, clipPath: clipFinal }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
      style={{ transform: 'translateZ(0)' }}
      className={`relative rounded-2xl sm:rounded-[28px] overflow-hidden shadow-2xl ${aspectRatio} ${className} will-change-transform`}
    >
      <motion.img
        src={src}
        onError={(e) => {
          if (fallbackSrc) e.currentTarget.src = fallbackSrc;
        }}
        alt={alt}
        style={{ y: parallaxY }}
        initial={prefersReducedMotion ? { scale: 1 } : { scale: 1.07 }}
        whileInView={{ scale: 1.03 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="w-full h-full object-cover object-center will-change-transform"
        loading="lazy"
        decoding="async"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent pointer-events-none" />
    </motion.div>
  );
}

const DEFAULT_CAPABILITY_ITEMS = [
  {
    id: 'cap-1',
    number: '01',
    badge: 'EXECUTIVE & LEADERSHIP SEARCH',
    title: 'Executive Search',
    highlightWord: 'built for precision.',
    description:
      'Targeted executive search and board-level placement engineered to secure proven leadership for long-term growth.',
    ctaLabel: 'Inquire About Executive Search',
    ctaDestination: '/contact',
    image: '/assets/img 16.webp',
    fallbackImage: '/assets/img 11.webp',
    alt: 'Executive interview and leadership search discussion in modern boardroom',
    theme: 'dark',
  },
  {
    id: 'cap-2',
    number: '02',
    badge: 'FLEXIBLE WORKFORCE & IT STAFF AUGMENTATION',
    title: 'IT Staff Augmentation',
    highlightWord: 'on demand.',
    description:
      'Deploy specialized technical contractors and project teams to scale capacity on demand.',
    ctaLabel: 'Request Technical Contractors',
    ctaDestination: '/contact',
    image: '/assets/img 5.webp',
    fallbackImage: '/assets/hero-2.webp',
    alt: 'Technical contractors collaborating on agile engineering sprints',
    theme: 'light',
  },
  {
    id: 'cap-3',
    number: '03',
    badge: 'DIRECT HIRE & PERMANENT PLACEMENT',
    title: 'Direct Hire Placement',
    highlightWord: 'aligned for impact.',
    description:
      'Rigorously vetted professionals aligned with your organization\'s technical stack and company culture.',
    ctaLabel: 'Inquire About Permanent Hires',
    ctaDestination: '/contact',
    image: '/assets/img 8.webp',
    fallbackImage: '/assets/img 9.webp',
    alt: 'Corporate recruiter onboarding senior permanent engineering lead',
    theme: 'dark',
  },
];

const DEFAULT_APPROACH = {
  eyebrow: 'THE SAHARA PROCESS',
  headline: 'A disciplined approach to talent acquisition.',
  highlightWord: 'talent acquisition.',
  subtitle:
    'From initial role scoping and candidate screening to seamless onboarding and a 90-day placement continuity guarantee.',
  guaranteeBadge: '90-Day Performance & Continuity Commitment',
  steps: [
    {
      num: '01',
      title: 'Scope & Align',
      desc: 'Analyze technical stack requirements, operational goals, and team dynamics to define precise candidate profiles.',
    },
    {
      num: '02',
      title: 'Source & Vet',
      desc: 'Engage specialized networks and execute multi-stage code reviews, architecture screens, and background diligence.',
    },
    {
      num: '03',
      title: 'Place & Support',
      desc: 'Seamless onboarding integration backed by our 90-day placement continuity guarantee.',
    },
  ],
};

function SaharaApproachSection({ approachData = DEFAULT_APPROACH, isDesktop = false, prefersReducedMotion = false }) {
  const { isLivePreview } = useCMS();
  const containerRef = useRef(null);

  const steps =
    Array.isArray(approachData?.steps) && approachData.steps.length > 0
      ? approachData.steps
      : DEFAULT_APPROACH.steps;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const isStickyDesktop = isDesktop && !prefersReducedMotion && !isLivePreview && steps.length <= 3;

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 85,
    damping: 24,
    mass: 0.22,
    restDelta: 0.0001,
  });

  const stage1Opacity = useTransform(
    smoothProgress,
    [0, 0.18, 0.32, 0.5, 0.64, 0.76, 0.88],
    [1, 1, 0.6, 0.6, 0.5, 0.5, 1]
  );
  const stage2Opacity = useTransform(
    smoothProgress,
    [0.14, 0.22, 0.36, 0.5, 0.64, 0.76, 0.88],
    [0, 0.15, 1, 1, 0.5, 0.5, 1]
  );
  const stage2Y = useTransform(smoothProgress, [0.14, 0.36], [28, 0]);
  const stage3Opacity = useTransform(
    smoothProgress,
    [0.46, 0.54, 0.68, 0.76, 1],
    [0, 0.15, 1, 1, 1]
  );
  const stage3Y = useTransform(smoothProgress, [0.46, 0.68], [28, 0]);

  const divider2Scale = useTransform(smoothProgress, [0.14, 0.32], [0, 1]);
  const divider2Opacity = useTransform(smoothProgress, [0.14, 0.24], [0, 1]);
  const divider3Scale = useTransform(smoothProgress, [0.46, 0.64], [0, 1]);
  const divider3Opacity = useTransform(smoothProgress, [0.46, 0.56], [0, 1]);
  const rightColumnY = useTransform(smoothProgress, [0, 0.85], [16, -8]);

  const headlineParts = splitHeadlineHighlight(
    approachData?.headline || DEFAULT_APPROACH.headline,
    approachData?.highlightWord || DEFAULT_APPROACH.highlightWord
  );

  return (
    <section
      ref={containerRef}
      className={`relative w-full bg-[#F8F6F1] text-[#0B0F17] border-t border-[#E7E3D9] selection:bg-[#E69D2B] selection:text-[#0B0F17] ${
        isStickyDesktop ? 'lg:h-[260vh]' : 'py-24 sm:py-32'
      }`}
    >
      <div
        className={`w-full px-6 sm:px-10 lg:px-16 ${
          isStickyDesktop
            ? 'lg:sticky lg:top-0 lg:h-screen lg:flex lg:items-center overflow-hidden py-24 lg:py-0'
            : ''
        }`}
      >
        <div className="max-w-[1360px] mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start lg:items-center">
            <div className="lg:col-span-5 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center gap-3"
              >
                <span className="w-6 h-[1.5px] bg-[#B87314]" />
                <span className="text-[11px] sm:text-xs font-bold tracking-[0.24em] text-[#B87314] uppercase font-sans">
                  {approachData?.eyebrow || DEFAULT_APPROACH.eyebrow}
                </span>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.65, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0B0F17] tracking-[-0.03em] leading-[1.12] font-sans"
              >
                {headlineParts.before}{' '}
                {headlineParts.highlight && (
                  <span className="text-[#B87314]">{headlineParts.highlight}</span>
                )}
              </motion.h2>

              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: 0.16, ease: 'easeOut' }}
                className="text-slate-600 text-base sm:text-lg font-normal leading-relaxed font-sans max-w-md"
              >
                {approachData?.subtitle || DEFAULT_APPROACH.subtitle}
              </motion.p>

              {(approachData?.guaranteeBadge || DEFAULT_APPROACH.guaranteeBadge) && (
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.6, delay: 0.22 }}
                  className="pt-6 border-t border-[#E7E3D9] space-y-1.5 text-xs font-sans text-slate-600"
                >
                  <div className="text-slate-900 font-semibold tracking-tight">
                    {approachData?.guaranteeBadge || DEFAULT_APPROACH.guaranteeBadge}
                  </div>
                </motion.div>
              )}
            </div>

            <motion.div
              style={isStickyDesktop ? { y: rightColumnY } : undefined}
              className="lg:col-span-7 border-t border-b border-[#E7E3D9]"
            >
              {steps.map((step, idx) => {
                const animStyle = isStickyDesktop
                  ? idx === 0
                    ? { opacity: stage1Opacity }
                    : idx === 1
                      ? { opacity: stage2Opacity, y: stage2Y }
                      : { opacity: stage3Opacity, y: stage3Y }
                  : undefined;

                const dividerStyle = isStickyDesktop
                  ? idx === 1
                    ? { scaleX: divider2Scale, opacity: divider2Opacity, transformOrigin: 'left' }
                    : idx === 2
                      ? { scaleX: divider3Scale, opacity: divider3Opacity, transformOrigin: 'left' }
                      : undefined
                  : undefined;

                return (
                  <React.Fragment key={step.num || idx}>
                    {idx > 0 && <motion.div style={dividerStyle} className="h-[1px] w-full bg-[#E7E3D9]" />}
                    <motion.div
                      style={animStyle}
                      initial={!isStickyDesktop ? { opacity: 0, y: 16 } : undefined}
                      whileInView={!isStickyDesktop ? { opacity: 1, y: 0 } : undefined}
                      viewport={{ once: true, margin: '-40px' }}
                      transition={{ duration: 0.55, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                      className="py-7 sm:py-9 grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-6 items-baseline"
                    >
                      <div className="sm:col-span-2 flex items-baseline gap-1 font-sans">
                        <span className="text-xs sm:text-[13px] font-semibold text-[#B87314] tracking-wider">
                          {step.num || `0${idx + 1}`}
                        </span>
                        <span className="text-[10px] text-slate-400 font-normal tracking-wide">
                          / 0{steps.length}
                        </span>
                      </div>
                      <div className="sm:col-span-4">
                        <h3 className="text-2xl sm:text-3xl font-bold text-[#0B0F17] tracking-tight font-sans">
                          {step.title}
                        </h3>
                      </div>
                      <div className="sm:col-span-6">
                        <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-sans font-normal">
                          {step.desc}
                        </p>
                      </div>
                    </motion.div>
                  </React.Fragment>
                );
              })}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function ServicesPage({ onNavigateContact, onNavigate }) {
  const { content, settings } = useCMS();
  const servicesData = content?.servicesPage || {};
  const hero = servicesData?.hero || {};
  const capabilitiesSection = servicesData?.capabilitiesSection || {};
  const capabilityItems =
    Array.isArray(capabilitiesSection?.items) && capabilitiesSection.items.length > 0
      ? capabilitiesSection.items
      : DEFAULT_CAPABILITY_ITEMS;
  const approachData = servicesData?.approach || DEFAULT_APPROACH;
  const closingCta = servicesData?.closingCta || {};
  const companyName = settings?.companyName || 'Sahara Staffing Inc.';

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false
  );
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth >= 1024 : false
  );

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(motionQuery.matches);
    const motionListener = (e) => setPrefersReducedMotion(e.matches);
    motionQuery.addEventListener('change', motionListener);

    const checkDesktop = () => setIsDesktop(window.innerWidth >= 1024);
    checkDesktop();
    window.addEventListener('resize', checkDesktop);

    return () => {
      motionQuery.removeEventListener('change', motionListener);
      window.removeEventListener('resize', checkDesktop);
    };
  }, []);

  const handleInquiry = (serviceName) => {
    if (onNavigateContact) {
      onNavigateContact({
        serviceArea: serviceName,
        projectSummary: `Inquiry regarding Sahara ${serviceName} solutions.`,
      });
    } else if (onNavigate) {
      onNavigate('contact');
    } else {
      window.location.hash = 'contact';
    }
  };

  const handleDestination = (destination, contextLabel) => {
    if (destination === '/about' || destination === 'about') {
      if (onNavigate) onNavigate('about');
      else window.location.hash = 'about';
      return;
    }
    if (destination === '/services' || destination === 'services') {
      document.getElementById('services-capabilities')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    handleInquiry(contextLabel || 'Strategy & Architecture');
  };

  const heroTitleParts = splitHeadlineHighlight(
    hero.headline || 'Execution is the difference.',
    hero.highlightWord || 'difference.'
  );
  const pillars =
    Array.isArray(hero.pillars) && hero.pillars.length > 0
      ? hero.pillars
      : ['Executive Search', 'IT Staff Augmentation', 'Permanent Placement'];

  const closingTitleParts = splitHeadlineHighlight(
    closingCta.headline || 'A better strategic conversation starts here.',
    closingCta.highlightWord || 'starts here.'
  );

  return (
    <div className="w-full bg-[#F8F6F1] text-[#0B0F17] font-sans selection:bg-[#E69D2B] selection:text-[#0B0F17]">
      {/* HERO INTRODUCTION */}
      <section
        id="services-hero"
        className="relative w-full pt-32 sm:pt-40 lg:pt-44 pb-20 sm:pb-28 lg:pb-32 px-6 sm:px-10 lg:px-16 border-b border-[#E7E3D9]"
      >
        <div className="max-w-[1360px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mb-6 sm:mb-8"
          >
            <span className="text-[11px] sm:text-xs font-bold tracking-[0.24em] text-[#B87314] uppercase font-sans">
              {hero.kicker || 'SAHARA STAFFING INC. / OUR SERVICES'}
            </span>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start mb-12 sm:mb-16 lg:mb-20">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-7"
            >
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#0B0F17] tracking-[-0.03em] leading-[1.15] font-sans max-w-xl">
                {heroTitleParts.before} <br className="hidden sm:block" />
                {heroTitleParts.highlight && (
                  <span className="text-[#B87314]">{heroTitleParts.highlight}</span>
                )}
              </h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.18, ease: 'easeOut' }}
              className="lg:col-span-5 flex flex-col justify-between pt-2 sm:pt-3 space-y-5"
            >
              <p className="text-slate-700 text-base sm:text-lg font-normal leading-relaxed font-sans max-w-md">
                &ldquo;
                {hero.quote ||
                  'Connecting ambitious enterprises with top-tier technical contractors, specialized teams, and executive leadership.'}
                &rdquo;
              </p>

              <div className="pt-1 text-xs text-slate-500 font-medium tracking-wide flex flex-wrap items-center gap-y-1">
                {pillars.map((pillar, idx) => (
                  <React.Fragment key={idx}>
                    {idx > 0 && <span className="mx-2.5 text-slate-300">&bull;</span>}
                    <span>{pillar}</span>
                  </React.Fragment>
                ))}
              </div>
            </motion.div>
          </div>

          <HeroPanoramicFrame
            src={hero.panoramicImage || '/assets/img 23.webp'}
            fallbackSrc={hero.panoramicFallbackImage || '/assets/img 6.webp'}
            alt={hero.panoramicCaption || `${companyName} staffing and recruitment overview`}
            isDesktop={isDesktop}
            prefersReducedMotion={prefersReducedMotion}
          >
            <div className="absolute bottom-5 sm:bottom-7 left-5 sm:left-8 right-5 sm:right-8 flex items-center justify-between text-white z-10 pointer-events-none">
              <span className="text-[11px] sm:text-xs text-white/80 font-medium tracking-wide">
                {hero.panoramicCaption ||
                  'Precision technical talent and executive placement across North America.'}
              </span>
              <span className="hidden sm:inline-block text-[10px] text-[#E69D2B] tracking-widest uppercase font-semibold">
                {hero.panoramicBrandTag || companyName}
              </span>
            </div>
          </HeroPanoramicFrame>
        </div>
      </section>

      {/* SERVICE CARDS SECTION HEADER BAND */}
      {(capabilitiesSection.sectionHeader || capabilitiesSection.sectionSubheader) && (
        <section
          id="services-capabilities"
          className="w-full bg-[#0B0F17] text-white pt-16 sm:pt-24 pb-4 px-5 sm:px-10 lg:px-16"
        >
          <div className="max-w-[1360px] mx-auto flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-8">
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
              {capabilitiesSection.sectionHeader || 'Core Service Pillars'}
            </h2>
            {capabilitiesSection.sectionSubheader && (
              <p className="text-slate-400 text-sm sm:text-base max-w-xl leading-relaxed">
                {capabilitiesSection.sectionSubheader}
              </p>
            )}
          </div>
        </section>
      )}

      {/* DYNAMIC ALTERNATING SERVICE CHAPTERS */}
      {capabilityItems.map((item, idx) => {
        const isDark = item.theme ? item.theme === 'dark' : idx % 2 === 0;
        const isImageLeft = !isDark;
        const revealType = idx % 3 === 0 ? 'vertical' : idx % 3 === 1 ? 'horizontal' : 'aperture';
        const titleParts = splitHeadlineHighlight(item.title, item.highlightWord);

        return (
          <section
            key={item.id || idx}
            id={idx === 0 && !capabilitiesSection.sectionHeader ? 'services-capabilities' : `services-pillar-${idx + 1}`}
            className={`relative w-full py-14 sm:py-28 lg:py-36 px-5 sm:px-10 lg:px-16 ${
              isDark
                ? 'bg-[#0B0F17] text-white selection:bg-[#E69D2B] selection:text-[#0B0F17]'
                : 'bg-[#F8F6F1] text-[#0B0F17] border-y border-[#E7E3D9]'
            }`}
          >
            <div className="max-w-[1360px] mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
                {/* Typography Column */}
                <div
                  className={`lg:col-span-6 space-y-5 sm:space-y-6 ${
                    isImageLeft ? 'order-1 lg:order-2 lg:pl-6' : 'lg:pr-6'
                  }`}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="flex items-center gap-3"
                  >
                    <span
                      className={`text-xs font-sans font-bold tracking-wider ${
                        isDark ? 'text-[#E69D2B]' : 'text-[#B87314]'
                      }`}
                    >
                      {item.number || `0${idx + 1}`}
                    </span>
                    <span className={`w-6 h-[1px] ${isDark ? 'bg-white/20' : 'bg-black/15'}`} />
                    <span
                      className={`text-[11px] font-semibold tracking-[0.2em] uppercase ${
                        isDark ? 'text-white/70' : 'text-[#0B0F17]/70'
                      }`}
                    >
                      {item.badge}
                    </span>
                  </motion.div>

                  <motion.h2
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className={`text-2xl xs:text-3xl sm:text-5xl lg:text-[54px] font-extrabold tracking-[-0.03em] leading-[1.12] sm:leading-[1.08] font-sans ${
                      isDark ? 'text-white' : 'text-[#0B0F17]'
                    }`}
                  >
                    {titleParts.before}
                    {titleParts.highlight && (
                      <>
                        {' '}
                        <br className="hidden sm:block" />
                        <span className={isDark ? 'text-[#E69D2B]' : 'text-[#B87314]'}>
                          {titleParts.highlight}
                        </span>
                      </>
                    )}
                  </motion.h2>

                  <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
                    className={`text-base sm:text-lg lg:text-xl font-normal leading-relaxed max-w-xl font-sans ${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}
                  >
                    {item.description}
                  </motion.p>

                  {item.ctaLabel && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-60px' }}
                      transition={{ duration: 0.5, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
                      className="pt-4"
                    >
                      <button
                        type="button"
                        onClick={() => handleDestination(item.ctaDestination, item.badge || item.title)}
                        className={`group inline-flex items-center gap-2.5 text-xs sm:text-sm font-semibold transition-colors focus:outline-none cursor-pointer ${
                          isDark
                            ? 'text-white hover:text-[#E69D2B]'
                            : 'text-[#0B0F17] hover:text-[#B87314]'
                        }`}
                      >
                        <span
                          className={`border-b pb-0.5 transition-colors ${
                            isDark
                              ? 'border-white/30 group-hover:border-[#E69D2B]'
                              : 'border-[#0B0F17]/30 group-hover:border-[#B87314]'
                          }`}
                        >
                          {item.ctaLabel}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                      </button>
                    </motion.div>
                  )}
                </div>

                {/* Image Column */}
                <div className={`lg:col-span-6 ${isImageLeft ? 'order-2 lg:order-1' : ''}`}>
                  <ServicePhotoFrame
                    src={item.image || '/assets/img 15.webp'}
                    fallbackSrc={item.fallbackImage || '/assets/img 11.webp'}
                    alt={item.alt || item.title}
                    revealType={revealType}
                    className={`${
                      isDark
                        ? 'bg-slate-800 border border-white/[0.08]'
                        : 'bg-slate-200 border border-black/[0.08]'
                    } max-h-[500px]`}
                    isDesktop={isDesktop}
                    prefersReducedMotion={prefersReducedMotion}
                  />
                </div>
              </div>
            </div>
          </section>
        );
      })}

      {/* THE SAHARA APPROACH */}
      <SaharaApproachSection
        approachData={approachData}
        isDesktop={isDesktop}
        prefersReducedMotion={prefersReducedMotion}
      />

      {/* CLOSING CALL TO ACTION */}
      <section
        id="services-sla"
        className="relative w-full py-16 sm:py-36 lg:py-40 px-5 sm:px-10 lg:px-16 overflow-hidden bg-gradient-to-b from-[#FAF9F6] via-white to-[#FCEFD2] text-center border-t border-[#DDD7CC] selection:bg-[#E69D2B] selection:text-[#0B0F17]"
      >
        <div className="animate-breathe absolute bottom-0 inset-x-0 h-[640px] bg-gradient-to-t from-saharaGold/35 via-saharaGold/15 to-transparent pointer-events-none" />
        <div className="absolute -bottom-24 inset-x-0 h-80 bg-[radial-gradient(ellipse_80%_60%_at_50%_100%,rgba(230,157,43,0.38),transparent_70%)] pointer-events-none" />

        <div className="relative z-10 max-w-[960px] mx-auto space-y-5 sm:space-y-7">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-[11px] sm:text-xs font-bold tracking-[0.24em] text-[#B87314] uppercase font-sans">
              {closingCta.eyebrow || 'SAHARA STAFFING INC. / GET STARTED'}
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, delay: 0.08 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0B0F17] tracking-tight leading-[1.15] font-sans max-w-3xl mx-auto text-center"
          >
            {closingTitleParts.before}
            {closingTitleParts.highlight && (
              <>
                <br className="hidden sm:block" />
                {!closingTitleParts.before?.endsWith(' ') && ' '}
                {closingTitleParts.highlight}
              </>
            )}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.16 }}
            className="text-slate-600 text-sm sm:text-lg font-normal max-w-xl mx-auto leading-relaxed font-sans"
          >
            &ldquo;
            {closingCta.quote ||
              'Tell us what your organization needs. Let’s design a staffing approach built around your goals.'}
            &rdquo;
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.22 }}
            className="pt-2 sm:pt-4 flex items-center justify-center"
          >
            <button
              type="button"
              onClick={() => handleDestination(closingCta.ctaDestination || '/contact', 'Enterprise Staffing')}
              className="btn-shimmer w-full sm:w-auto justify-center bg-[#0B0F17] hover:bg-[#E69D2B] hover:text-[#0B0F17] text-white font-semibold text-xs sm:text-base px-7 sm:px-9 py-3.5 sm:py-4 rounded-full inline-flex items-center gap-2.5 shadow-xl transition-all duration-300 active:scale-95 group cursor-pointer"
            >
              <span>{closingCta.ctaLabel || 'Request Talent ->'}</span>
              <ArrowRight className="w-4 h-4 text-[#E69D2B] group-hover:text-[#0B0F17] transition-colors" />
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
