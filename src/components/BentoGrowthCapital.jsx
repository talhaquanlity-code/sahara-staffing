import React, { useRef, useState } from 'react';
import { motion, useSpring, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCMS } from '../context/CMSContext';

// ---------------------------------------------------------------------------
// STAFFING SOLUTIONS DATA
// ---------------------------------------------------------------------------
const solutionCards = [
  {
    id: '01',
    tag: '01 - EXECUTIVE SEARCH',
    title: 'Executive & Leadership Search',
    subtitle: 'Targeted executive search and board-level placement engineered to secure proven leadership for long-term growth.',
    image: '/assets/img 16.webp',
    fallbackImage: '/assets/hero-1.webp',
  },
  {
    id: '02',
    tag: '02 - WORKFORCE AUGMENTATION',
    title: 'IT Staff Augmentation',
    subtitle: 'Deploy specialized technical contractors and project teams to scale capacity on demand.',
    image: '/assets/img 5.webp',
    fallbackImage: '/assets/img 6.webp',
  },
  {
    id: '03',
    tag: '03 - PERMANENT PLACEMENT',
    title: 'Direct Hire Placement',
    subtitle: 'Rigorously vetted professionals aligned with your organization\'s technical stack and company culture.',
    image: '/assets/img 8.webp',
    fallbackImage: '/assets/img 10.webp',
  },
  {
    id: '04',
    tag: '04 - DEDICATED SQUADS',
    title: 'Specialized Technical Teams',
    subtitle: 'Rapid deployment of vetted technical squads, senior engineers, and specialized contributors ready for immediate sprint integration.',
    image: '/assets/img 9.webp',
    fallbackImage: '/assets/img 12.webp',
  },
];

// ---------------------------------------------------------------------------
// 3D TILT + SCROLL PARALLAX BENTO CARD COMPONENT
// ---------------------------------------------------------------------------
function BentoCard({
  tag,
  title,
  subtitle,
  image,
  fallbackImage,
  className = '',
  orientation = 'vertical', // 'vertical' or 'horizontal'
  scrollYProgress,
  scrollParallaxRange = ['-8%', '8%'],
  columnY,
  onClick,
}) {
  const cardRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  // Smooth spring physics for 3D cursor tilt & mouse parallax
  const rotateX = useSpring(0, { damping: 22, stiffness: 200 });
  const rotateY = useSpring(0, { damping: 22, stiffness: 200 });
  const mouseImgX = useSpring(0, { damping: 22, stiffness: 200 });
  const mouseImgY = useSpring(0, { damping: 22, stiffness: 200 });

  // Scroll parallax for the background image inside the frame
  const imgScrollY = useTransform(
    scrollYProgress,
    [0, 1],
    scrollParallaxRange
  );

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Normalized spotlight coordinates (0 - 100%)
    setMousePos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
    });

    // Normalized coordinates (-1 to 1) for 3D tilt
    const normX = (x / rect.width - 0.5) * 2;
    const normY = (y / rect.height - 0.5) * 2;

    rotateX.set(-normY * 5);
    rotateY.set(normX * 5);
    mouseImgX.set(normX * -10);
    mouseImgY.set(normY * -10);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    rotateX.set(0);
    rotateY.set(0);
    mouseImgX.set(0);
    mouseImgY.set(0);
  };

  return (
    <motion.div
      style={{ y: columnY }}
      className={`h-full ${className}`}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
        style={{ perspective: 1000 }}
        className="group cursor-pointer select-none w-full h-full"
      >
        <motion.div
          style={{
            rotateX,
            rotateY,
            transformStyle: 'preserve-3d',
          }}
          className="relative w-full h-full rounded-[28px] sm:rounded-[32px] overflow-hidden border border-slate-200/90 hover:border-[#E69D2B]/70 bg-[#0B0F17] transition-colors duration-500 shadow-xl flex flex-col justify-between p-7 sm:p-8"
        >
          {/* Hardware-Accelerated Parallax Image Background (Oversized for Scroll Parallax) */}
          <div
            className="absolute inset-[-10%] z-0 overflow-hidden pointer-events-none will-change-transform"
            style={{ transform: 'translateZ(0)' }}
          >
            <motion.img
              src={image}
              onError={(e) => {
                if (fallbackImage) e.currentTarget.src = fallbackImage;
              }}
              alt={title}
              loading="lazy"
              decoding="async"
              style={{
                x: mouseImgX,
                y: imgScrollY,
                scale: isHovered ? 1.08 : 1.03,
              }}
              transition={{
                scale: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
              }}
              className="w-full h-full object-cover object-center will-change-transform"
            />

            {/* Luxury Filmic Gradient Vignette */}
            {orientation === 'vertical' ? (
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F17] via-[#0B0F17]/55 to-[#0B0F17]/20 transition-opacity duration-500" />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-r from-[#0B0F17]/95 via-[#0B0F17]/75 to-[#0B0F17]/35 transition-opacity duration-500" />
            )}

            {/* Interactive Specular Spotlight Following Cursor */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{
                background: `radial-gradient(circle 320px at ${mousePos.x}% ${mousePos.y}%, rgba(255,255,255,0.12), transparent 70%)`,
              }}
            />
          </div>

          {/* Top Header: Understated Index & Category Tag */}
          <div className="relative z-10 flex items-center justify-between">
            <span className="text-[11px] font-semibold tracking-widest text-[#E69D2B] uppercase font-sans">
              {tag}
            </span>
            <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-center text-white/70 group-hover:text-white group-hover:bg-[#E69D2B] group-hover:text-[#0B0F17] group-hover:border-[#E69D2B] transition-all duration-300">
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </div>
          </div>

          {/* Bottom Content: Clean, Confident Title & Subtitle */}
          <div className="relative z-10 space-y-2 max-w-md">
            <h3 className="text-2xl sm:text-[28px] font-bold text-white tracking-tight leading-tight font-sans transition-transform duration-300 group-hover:translate-x-0.5">
              {title}
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-sans line-clamp-2">
              {subtitle}
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// MAIN BENTO GROWTH CAPITAL SECTION WITH SCROLL PARALLAX
// ---------------------------------------------------------------------------
export default function BentoGrowthCapital({ onNavigateService, onNavigateContact }) {
  const { content } = useCMS();
  const cmsImages = content?.images || {};
  const cmsBento = content?.home?.bento || content?.services || [];
  const sectionMeta = content?.home?.bentoSection || {};

  const activeSolutions = [0, 1, 2, 3].map((idx) => ({
    id: `0${idx + 1}`,
    tag: cmsBento[idx]?.badge || solutionCards[idx].tag,
    title: cmsBento[idx]?.title || solutionCards[idx].title,
    subtitle: cmsBento[idx]?.description || solutionCards[idx].subtitle,
    image:
      cmsImages[`bentoCard${idx + 1}`] ||
      cmsBento[idx]?.image ||
      solutionCards[idx].image,
    fallbackImage: solutionCards[idx].fallbackImage,
  }));

  const sectionKicker = sectionMeta.kicker || 'CORE TALENT PILLARS';
  const sectionHeadline = sectionMeta.headline || 'Flexible Staffing & Precision Talent Placement.';
  const sectionHighlight = sectionMeta.highlightWord || 'Precision';
  const sectionSubtitle =
    sectionMeta.subtitle ||
    'Deploy specialized technical contractors and executive leadership engineered for mission-critical growth.';
  const sectionCtaLabel = sectionMeta.ctaLabel || 'Explore Services';

  const sectionRef = useRef(null);
  const carouselRef = useRef(null);
  const [activeSlide, setActiveSlide] = useState(0);

  const handleCarouselScroll = () => {
    if (!carouselRef.current) return;
    const { scrollLeft, clientWidth } = carouselRef.current;
    const cardWidth = 300;
    const index = Math.round(scrollLeft / (cardWidth + 14));
    setActiveSlide(Math.min(activeSolutions.length - 1, Math.max(0, index)));
  };

  const scrollToSlide = (idx) => {
    if (!carouselRef.current) return;
    const cards = carouselRef.current.children;
    if (cards[idx]) {
      cards[idx].scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
      setActiveSlide(idx);
    }
  };

  // Track scroll progress across the section
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  // Staggered column vertical parallax offsets (gives multiplane depth on scroll)
  const yCard1 = useTransform(scrollYProgress, [0, 1], [35, -35]);
  const yCenter = useTransform(scrollYProgress, [0, 1], [-18, 18]);
  const yCard4 = useTransform(scrollYProgress, [0, 1], [50, -50]);

  const handleServicesClick = () => {
    if (onNavigateService) {
      onNavigateService('services');
    } else {
      (window.history.pushState({}, '', '/services'), window.dispatchEvent(new PopStateEvent('popstate')));
    }
  };

  const handleCardClick = () => {
    if (onNavigateService) {
      onNavigateService('services');
    } else if (onNavigateContact) {
      onNavigateContact();
    } else {
      (window.history.pushState({}, '', '/services'), window.dispatchEvent(new PopStateEvent('popstate')));
    }
  };

  return (
    <section
      ref={sectionRef}
      id="capital-section"
      className="relative z-20 bg-gradient-to-b from-[#F1F4F9] via-[#F7F9FC] to-[#EDF2F7] text-[#0B0F17] py-14 sm:py-24 lg:py-28 font-sans selection:bg-[#E69D2B] selection:text-[#0B0F17] overflow-hidden"
    >
      {/* Subtle Warm Ambient Top Glow */}
      <div className="absolute top-0 inset-x-0 h-48 bg-[radial-gradient(ellipse_70%_50%_at_50%_-10%,rgba(230,157,43,0.08),transparent_70%)] pointer-events-none" />

      <div className="max-w-[1360px] mx-auto px-5 sm:px-8 relative z-10">
        
        {/* ========================================================================= */}
        {/* 1. SECTION HEADER                                                         */}
        {/* ========================================================================= */}
        <div
          className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-5 sm:gap-6 mb-8 sm:mb-12 opacity-100 transform-none"
        >
          {/* Left Column */}
          <div className="max-w-2xl space-y-2.5 opacity-100 transform-none">
            <span className="text-[#B87314] text-xs font-bold tracking-wider uppercase font-sans">
              {sectionKicker}
            </span>

            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-[-0.03em] text-[#0B0F17] leading-[1.15] sm:leading-[1.1] font-sans">
              {sectionHighlight && sectionHeadline.includes(sectionHighlight) ? (
                <>
                  {sectionHeadline.split(sectionHighlight)[0]}
                  <span className="text-[#B87314]">{sectionHighlight}</span>
                  {sectionHeadline.split(sectionHighlight).slice(1).join(sectionHighlight)}
                </>
              ) : (
                sectionHeadline
              )}
            </h2>
          </div>

          {/* Right Column */}
          <div className="flex flex-col items-start lg:items-end gap-3.5 sm:gap-4 opacity-100 transform-none">
            <p className="text-slate-600 text-xs sm:text-sm max-w-sm lg:text-right leading-relaxed font-sans">
              {sectionSubtitle}
            </p>

            <button
              onClick={handleServicesClick}
              className="bg-[#0B0F17] hover:bg-[#E69D2B] hover:text-[#0B0F17] text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-full text-xs font-semibold transition-all duration-300 shadow-md inline-flex items-center gap-2 cursor-pointer active:scale-95 group font-sans"
            >
              <span>{sectionCtaLabel}</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. MOBILE SWIPEABLE CAROUSEL (< md)                                       */}
        {/* ========================================================================= */}
        <div className="block md:hidden">
          <div
            ref={carouselRef}
            onScroll={handleCarouselScroll}
            className="overflow-x-auto snap-x snap-mandatory flex gap-4 px-5 pb-4 -mx-5 scrollbar-none"
            style={{
              WebkitOverflowScrolling: 'touch',
              touchAction: 'pan-x pan-y',
            }}
          >
            {activeSolutions.map((item) => (
              <div
                key={item.id}
                onClick={handleCardClick}
                style={{ touchAction: 'pan-x pan-y' }}
                className="w-[84vw] max-w-[320px] h-[390px] shrink-0 snap-center rounded-[24px] overflow-hidden border border-slate-200/90 bg-[#0B0F17] shadow-xl relative flex flex-col justify-between p-6 select-none cursor-pointer active:scale-[0.98] transition-transform duration-200 opacity-100 transform-none"
              >
                {/* Background Image & Vignette */}
                <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                  <img
                    src={item.image}
                    onError={(e) => {
                      if (item.fallbackImage) e.currentTarget.src = item.fallbackImage;
                    }}
                    alt={item.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F17] via-[#0B0F17]/65 to-[#0B0F17]/25" />
                </div>

                {/* Top Header: Tag & Arrow Action */}
                <div className="relative z-10 flex items-center justify-between">
                  <span className="text-[10.5px] font-semibold tracking-widest text-[#E69D2B] uppercase font-sans">
                    {item.tag}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-center text-white/80">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Bottom Content: Title & Subtitle */}
                <div className="relative z-10 space-y-2 opacity-100 transform-none">
                  <h3 className="text-2xl font-bold text-white tracking-tight leading-tight font-sans">
                    {item.title}
                  </h3>
                  <p className="text-slate-300 text-xs leading-relaxed font-sans line-clamp-3">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Dot Indicators & Hint */}
          <div className="flex items-center justify-between pt-3 px-1">
            <div className="flex items-center gap-1.5">
              {activeSolutions.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  aria-label={`Go to solution ${idx + 1}`}
                  onClick={() => scrollToSlide(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    activeSlide === idx
                      ? 'w-6 bg-[#E69D2B]'
                      : 'w-1.5 bg-slate-300 hover:bg-slate-400'
                  }`}
                />
              ))}
            </div>
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider flex items-center gap-1 font-sans">
              Swipe to explore &rarr;
            </span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. DESKTOP 4-CARD BENTO GRID WITH MULTIPLANE SCROLL PARALLAX (md+)       */}
        {/* ========================================================================= */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="hidden md:grid md:grid-cols-2 lg:grid-cols-12 gap-6 sm:gap-7 lg:gap-5 w-full"
        >
          {/* --------------------------------------------------------------------- */}
          {/* CARD 1: VERTICAL 1 (LEFT FLANK - 3 COLS)                              */}
          {/* --------------------------------------------------------------------- */}
          <BentoCard
            tag={activeSolutions[0].tag}
            title={activeSolutions[0].title}
            subtitle={activeSolutions[0].subtitle}
            image={activeSolutions[0].image}
            fallbackImage={activeSolutions[0].fallbackImage}
            orientation="vertical"
            scrollYProgress={scrollYProgress}
            scrollParallaxRange={['-10%', '10%']}
            columnY={yCard1}
            className="lg:col-span-3 h-[480px] sm:h-[510px] lg:h-[540px]"
            onClick={handleCardClick}
          />

          {/* --------------------------------------------------------------------- */}
          {/* CENTER STACK: 2 HORIZONTAL CARDS (6 COLS)                             */}
          {/* --------------------------------------------------------------------- */}
          <motion.div
            style={{ y: yCenter }}
            className="lg:col-span-6 flex flex-col gap-5 h-auto lg:h-[540px]"
          >
            {/* HORIZONTAL CARD 1 (TOP) */}
            <BentoCard
              tag={activeSolutions[1].tag}
              title={activeSolutions[1].title}
              subtitle={activeSolutions[1].subtitle}
              image={activeSolutions[1].image}
              fallbackImage={activeSolutions[1].fallbackImage}
              orientation="horizontal"
              scrollYProgress={scrollYProgress}
              scrollParallaxRange={['-7%', '7%']}
              className="h-[260px]"
              onClick={handleCardClick}
            />

            {/* HORIZONTAL CARD 2 (BOTTOM) */}
            <BentoCard
              tag={activeSolutions[2].tag}
              title={activeSolutions[2].title}
              subtitle={activeSolutions[2].subtitle}
              image={activeSolutions[2].image}
              fallbackImage={activeSolutions[2].fallbackImage}
              orientation="horizontal"
              scrollYProgress={scrollYProgress}
              scrollParallaxRange={['-7%', '7%']}
              className="h-[260px]"
              onClick={handleCardClick}
            />
          </motion.div>

          {/* --------------------------------------------------------------------- */}
          {/* CARD 4: VERTICAL 2 (RIGHT FLANK - 3 COLS)                             */}
          {/* --------------------------------------------------------------------- */}
          <BentoCard
            tag={activeSolutions[3].tag}
            title={activeSolutions[3].title}
            subtitle={activeSolutions[3].subtitle}
            image={activeSolutions[3].image}
            fallbackImage={activeSolutions[3].fallbackImage}
            orientation="vertical"
            scrollYProgress={scrollYProgress}
            scrollParallaxRange={['-12%', '12%']}
            columnY={yCard4}
            className="lg:col-span-3 h-[480px] sm:h-[510px] lg:h-[540px]"
            onClick={handleCardClick}
          />
        </motion.div>

      </div>
    </section>
  );
}

