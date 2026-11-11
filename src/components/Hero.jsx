import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useCMS } from '../context/CMSContext';
import Header from './Header';

gsap.registerPlugin(ScrollTrigger);

export default function Hero({ onNavigate, onNavigateContact, onNavigateServices, currentRoute }) {
  const { content } = useCMS();
  const heroData = content?.hero;
  const heroRef = useRef(null);

  // =========================================================================
  // 1. SEAMLESS DUAL-BUFFER VIDEO CROSSFADE (10-SECOND CINEMATIC DISSOLVE)
  // Eliminates end-frame freeze/stutter by crossfading at 8.8s before the 10s end
  // =========================================================================
  const videoSources = [
    '/assets/hero-video-4.mp4',
    '/assets/hero-video-5.mp4',
    '/assets/hero-video.mp4',
    '/assets/hero-video-2.mp4',
    '/assets/hero-video-3.mp4',
  ];

  const videoRefA = useRef(null);
  const videoRefB = useRef(null);

  const [activeChannel, setActiveChannel] = useState('A'); // 'A' or 'B'
  const [srcIndexA, setSrcIndexA] = useState(0);
  const [srcIndexB, setSrcIndexB] = useState(1);
  const [isCrossfading, setIsCrossfading] = useState(false);
  const [currentLoopIndex, setCurrentLoopIndex] = useState(0);

  // Timeupdate handler for Video A
  const handleTimeUpdateA = () => {
    if (activeChannel !== 'A' || isCrossfading) return;
    const vA = videoRefA.current;
    if (!vA) return;

    // Trigger crossfade 1.2s before the 10.006s video end (~8.8s)
    if (vA.currentTime >= 8.8) {
      setIsCrossfading(true);
      const vB = videoRefB.current;
      if (vB) {
        vB.currentTime = 0;
        vB.play().catch(() => {});
      }
      setActiveChannel('B');
      const nextIdx = (srcIndexA + 1) % videoSources.length;
      setCurrentLoopIndex(nextIdx);

      // Once crossfade completes (1.2s), queue next video for channel A
      setTimeout(() => {
        setIsCrossfading(false);
        if (vA) {
          vA.pause();
          vA.currentTime = 0;
        }
        setSrcIndexA((nextIdx + 1) % videoSources.length);
      }, 1300);
    }
  };

  // Timeupdate handler for Video B
  const handleTimeUpdateB = () => {
    if (activeChannel !== 'B' || isCrossfading) return;
    const vB = videoRefB.current;
    if (!vB) return;

    // Trigger crossfade 1.2s before the 10.006s video end (~8.8s)
    if (vB.currentTime >= 8.8) {
      setIsCrossfading(true);
      const vA = videoRefA.current;
      if (vA) {
        vA.currentTime = 0;
        vA.play().catch(() => {});
      }
      setActiveChannel('A');
      const nextIdx = (srcIndexB + 1) % videoSources.length;
      setCurrentLoopIndex(nextIdx);

      // Once crossfade completes (1.2s), queue next video for channel B
      setTimeout(() => {
        setIsCrossfading(false);
        if (vB) {
          vB.pause();
          vB.currentTime = 0;
        }
        setSrcIndexB((nextIdx + 1) % videoSources.length);
      }, 1300);
    }
  };

  // Manual video selector from bottom indicators
  const switchVideoManually = (targetIndex) => {
    if (isCrossfading) return;
    setIsCrossfading(true);
    setCurrentLoopIndex(targetIndex);

    if (activeChannel === 'A') {
      setSrcIndexB(targetIndex);
      setTimeout(() => {
        const vB = videoRefB.current;
        if (vB) {
          vB.currentTime = 0;
          vB.play().catch(() => {});
        }
        setActiveChannel('B');
        setTimeout(() => {
          setIsCrossfading(false);
          if (videoRefA.current) {
            videoRefA.current.pause();
          }
          setSrcIndexA((targetIndex + 1) % videoSources.length);
        }, 1200);
      }, 50);
    } else {
      setSrcIndexA(targetIndex);
      setTimeout(() => {
        const vA = videoRefA.current;
        if (vA) {
          vA.currentTime = 0;
          vA.play().catch(() => {});
        }
        setActiveChannel('A');
        setTimeout(() => {
          setIsCrossfading(false);
          if (videoRefB.current) {
            videoRefB.current.pause();
          }
          setSrcIndexB((targetIndex + 1) % videoSources.length);
        }, 1200);
      }, 50);
    }
  };

  // =========================================================================
  // 2. RELOAD APPEARING ANIMATIONS (GSAP CASCADE FOR ALL TEXT ELEMENTS)
  // =========================================================================
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(
        '.hero-appear-badge',
        { opacity: 0, y: -18 },
        { opacity: 1, y: 0, duration: 0.7, delay: 0.15 }
      )
        .fromTo(
          '.hero-appear-title',
          { opacity: 0, y: 28 },
          { opacity: 1, y: 0, duration: 0.85 },
          '-=0.4'
        )
        .fromTo(
          '.hero-appear-subtitle',
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.7 },
          '-=0.45'
        )
        .fromTo(
          '.hero-appear-actions',
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.65 },
          '-=0.45'
        );

      // 3. Smooth Parallax Effect on Hero Background on Scroll
      gsap.to('.hero-parallax-bg', {
        yPercent: 16,
        scale: 1.08,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.2,
        },
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative w-full min-h-screen overflow-hidden flex flex-col justify-between bg-[#0B0F17] select-none"
    >
      {/* ========================================================================= */}
      {/* BACKGROUND LAYER: SEAMLESS 10-SEC DUAL VIDEO CROSSFADE WITH PARALLAX     */}
      {/* ========================================================================= */}
      <div
        className="hero-parallax-bg absolute inset-0 z-0 overflow-hidden pointer-events-none will-change-transform"
        style={{ transform: 'translateZ(0)' }}
      >
        {/* Channel A Video */}
        <video
          ref={videoRefA}
          src={videoSources[srcIndexA]}
          autoPlay
          muted
          playsInline
          onTimeUpdate={handleTimeUpdateA}
          className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-[1200ms] ease-in-out ${
            activeChannel === 'A' ? 'opacity-100 z-10' : 'opacity-0 z-0'
          } ${
            videoSources[srcIndexA]?.includes('hero-video-5')
              ? 'filter contrast-[1.12] brightness-[0.88] saturate-[0.65]'
              : ''
          }`}
        />

        {/* Channel B Video */}
        <video
          ref={videoRefB}
          src={videoSources[srcIndexB]}
          muted
          playsInline
          onTimeUpdate={handleTimeUpdateB}
          className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-[1200ms] ease-in-out ${
            activeChannel === 'B' ? 'opacity-100 z-10' : 'opacity-0 z-0'
          } ${
            videoSources[srcIndexB]?.includes('hero-video-5')
              ? 'filter contrast-[1.12] brightness-[0.88] saturate-[0.65]'
              : ''
          }`}
        />

        {/* Dynamic Premium Duotone Film Overlay for Video 5 */}
        <div
          className={`absolute inset-0 pointer-events-none z-15 transition-opacity duration-[1200ms] ease-in-out mix-blend-color ${
            (activeChannel === 'A' && videoSources[srcIndexA]?.includes('hero-video-5')) ||
            (activeChannel === 'B' && videoSources[srcIndexB]?.includes('hero-video-5'))
              ? 'opacity-70'
              : 'opacity-0'
          } bg-gradient-to-tr from-[#080B12] via-[#1A1813] to-[#E69D2B]/50`}
        />

        {/* Subtle Specular Duotone Light Overlay */}
        <div
          className={`absolute inset-0 pointer-events-none z-15 transition-opacity duration-[1200ms] ease-in-out mix-blend-soft-light ${
            (activeChannel === 'A' && videoSources[srcIndexA]?.includes('hero-video-5')) ||
            (activeChannel === 'B' && videoSources[srcIndexB]?.includes('hero-video-5'))
              ? 'opacity-85'
              : 'opacity-0'
          } bg-gradient-to-b from-[#E69D2B]/35 via-transparent to-[#080B12]/80`}
        />

        {/* Crisp Cinematic Dark Tint Canvas without Blur */}
        <div className="absolute inset-0 bg-[#0B0F17]/55 z-20" />

        {/* Subtle Centered Warm Ambient Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(230,157,43,0.15)_0%,_transparent_65%)] pointer-events-none z-20" />

        {/* Soft edge gradients for seamless blending */}
        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#0B0F17] via-[#0B0F17]/80 to-transparent z-20" />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#0B0F17]/70 to-transparent z-20" />
      </div>

      {/* ========================================================================= */}
      {/* 1. TOP HEADER (3-PART SYMMETRICAL NAVBAR)                                 */}
      {/* ========================================================================= */}
      <Header onNavigate={onNavigate} currentRoute={currentRoute} />

      {/* ========================================================================= */}
      {/* 2. CENTERED CONTENT STACK WITH MINIMAL CLEAN TEXT EFFECTS & REVEAL ANIM   */}
      {/* ========================================================================= */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 28 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ type: 'spring', stiffness: 220, damping: 22, mass: 0.8 }}
        className="will-change-transform relative z-30 w-full max-w-4xl mx-auto px-5 sm:px-8 pt-10 sm:pt-14 pb-20 sm:pb-24 flex flex-col items-center text-center my-auto"
      >
        
        {/* Creative Artistic Badge: No bubble, pure luxury letterspaced typography & gold brush stroke */}
        <div className="hero-appear-badge mb-7 flex flex-col items-center group cursor-default">
          <div className="flex items-center gap-2.5 text-[#E69D2B] text-[11px] sm:text-xs font-semibold tracking-[0.22em] uppercase drop-shadow-[0_2px_12px_rgba(230,157,43,0.4)]">
            <span className="text-xs transition-transform duration-300 group-hover:rotate-45">✦</span>
            <span>{heroData?.kicker || 'ENTERPRISE TALENT ACQUISITION'}</span>
            <span className="text-xs transition-transform duration-300 group-hover:rotate-45">✦</span>
          </div>

          {/* Artistic Calligraphic Gold Brush Stroke Flourish Underline */}
          <svg
            className="w-48 sm:w-64 h-3.5 mt-0.5 text-[#E69D2B] transition-transform duration-500 group-hover:scale-105"
            viewBox="0 0 260 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2 9.5C48 4 135 2 258 7.5C195 9.5 90 13 2 9.5Z"
              fill="url(#saharaBrushGrad)"
            />
            <path
              d="M18 11.5C72 7 150 5.5 240 9"
              stroke="#FFF0A8"
              strokeWidth="0.75"
              strokeLinecap="round"
              opacity="0.6"
            />
            <defs>
              <linearGradient id="saharaBrushGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#E69D2B" stopOpacity="0.1" />
                <stop offset="25%" stopColor="#E69D2B" stopOpacity="0.85" />
                <stop offset="50%" stopColor="#F6C467" stopOpacity="1" />
                <stop offset="75%" stopColor="#E69D2B" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#E69D2B" stopOpacity="0.1" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Clean, Minimalist Headline with Subtle Text Sheen */}
        <h1 className="hero-appear-title text-4xl sm:text-5xl md:text-6xl lg:text-[62px] font-extrabold text-white leading-[1.08] tracking-tight mb-5 sm:mb-6 max-w-4xl drop-shadow-xl">
          {(() => {
            const headline = heroData?.headline || 'Flexible Staffing & Executive Placement Built for Precision.';
            const highlight = heroData?.highlightWord || 'Precision.';
            if (highlight && headline.includes(highlight)) {
              const parts = headline.split(highlight);
              return (
                <>
                  {parts[0]}
                  <span className="relative inline-block text-[#E69D2B] drop-shadow-[0_2px_20px_rgba(230,157,43,0.35)] transition-colors duration-300 hover:text-[#F6C467] cursor-default">
                    {highlight}
                  </span>
                  {parts.slice(1).join(highlight)}
                </>
              );
            }
            return headline;
          })()}
        </h1>

        {/* Subtitle */}
        <p className="hero-appear-subtitle text-[#94A3B8] text-sm sm:text-base leading-relaxed max-w-2xl mb-7 sm:mb-9 font-normal">
          {heroData?.subtitle || 'Connecting ambitious enterprises with top-tier technical contractors, specialized teams, and executive leadership.'}
        </p>

        {/* Dynamic Action Buttons (Strict Max 2 Buttons: 0, 1, or 2 rendered) */}
        {(() => {
          // Normalize buttons from heroData.buttons or fallback to legacy labels
          let configuredButtons = [];
          if (Array.isArray(heroData?.buttons)) {
            configuredButtons = heroData.buttons.filter((b) => b && b.enabled !== false);
          } else {
            if (heroData?.primaryCtaLabel) {
              configuredButtons.push({
                id: 'btn-1',
                enabled: true,
                label: heroData.primaryCtaLabel,
                destination: heroData.primaryCtaRoute ? `/${heroData.primaryCtaRoute}` : '/contact',
                variant: 'primary',
              });
            }
            if (heroData?.secondaryCtaLabel) {
              configuredButtons.push({
                id: 'btn-2',
                enabled: true,
                label: heroData.secondaryCtaLabel,
                destination: heroData.secondaryCtaRoute ? `/${heroData.secondaryCtaRoute}` : '/services',
                variant: 'secondary',
              });
            }
          }

          if (configuredButtons.length === 0) return null;

          const handleButtonClick = (btn) => {
            const dest = (btn.destination || '').toLowerCase();
            if (dest.includes('contact') && onNavigateContact) {
              onNavigateContact();
            } else if (dest.includes('services') && onNavigateServices) {
              onNavigateServices();
            } else if (dest.startsWith('#')) {
              const el = document.querySelector(dest);
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            } else if (onNavigate && dest.replace('/', '')) {
              onNavigate(dest.replace('/', ''));
            } else if (onNavigateContact) {
              onNavigateContact();
            } else {
              window.location.hash = 'contact';
            }
          };

          const visibleButtons = configuredButtons.slice(0, 2);

          return (
            <div
              className={`hero-appear-actions ${
                visibleButtons.length === 1 ? 'grid grid-cols-1' : 'grid grid-cols-2'
              } gap-2.5 w-full sm:w-auto sm:flex sm:flex-row items-center justify-center sm:gap-4 mb-10 sm:mb-12`}
            >
              {visibleButtons.map((btn, idx) => {
                const isPrimary = btn.variant === 'primary' || idx === 0;
                const rawLabel = btn.label || (isPrimary ? 'Request Talent ->' : 'Explore Services');
                const cleanLabel = rawLabel.replace(/\s*(→|->|&rarr;)\s*$/, '').trim();

                if (isPrimary) {
                  return (
                    <button
                      key={btn.id || idx}
                      type="button"
                      onClick={() => handleButtonClick(btn)}
                      className="btn-shimmer w-full sm:w-auto min-h-[44px] sm:min-h-[48px] justify-center bg-[#E69D2B] hover:bg-[#F6C467] text-[#0B0F17] text-xs sm:text-base px-3 sm:px-8 py-3 sm:py-4 rounded-full inline-flex items-center shadow-xl transition-all duration-200 active:scale-95 hover:-translate-y-0.5 group cursor-pointer whitespace-nowrap"
                    >
                      <span className="font-semibold truncate">{cleanLabel}</span>
                      <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-1.5 sm:ml-2 shrink-0 inline-block transition-transform group-hover:translate-x-1" />
                    </button>
                  );
                }
                return (
                  <button
                    key={btn.id || idx}
                    type="button"
                    onClick={() => handleButtonClick(btn)}
                    className="w-full sm:w-auto min-h-[44px] sm:min-h-[48px] justify-center bg-white/5 border border-white/20 hover:border-white/40 text-white font-medium text-xs sm:text-base px-3 sm:px-8 py-3 sm:py-4 rounded-full hover:bg-white/10 transition-all duration-200 active:scale-95 hover:-translate-y-0.5 cursor-pointer backdrop-blur-sm inline-flex items-center whitespace-nowrap"
                  >
                    <span className="truncate">{cleanLabel}</span>
                  </button>
                );
              })}
            </div>
          );
        })()}
      </motion.div>

      {/* ========================================================================= */}
      {/* DISCREET VIDEO CAROUSEL INDICATOR PILLS (BOTTOM)                          */}
      {/* ========================================================================= */}
      <div className="relative z-30 w-full max-w-[1400px] mx-auto px-5 sm:px-8 pb-4 sm:pb-6 flex items-center justify-center sm:justify-between text-xs text-slateGray pointer-events-auto">
        <div className="text-[11px] text-white/40 hidden sm:block font-medium">
          {heroData?.bottomCaption || 'Enterprise Staffing & Executive Search Solutions'}
        </div>

        {/* 10-Second Loop Indicators */}
        <div className="flex items-center gap-2 ml-0 sm:ml-auto">
          <span className="text-[10px] text-white/50 tracking-wider uppercase mr-1">
          
          </span>
          {videoSources.map((_, i) => (
            <button
              key={i}
              onClick={() => switchVideoManually(i)}
              className={`h-1.5 transition-all duration-500 rounded-full cursor-pointer ${
                currentLoopIndex === i
                  ? 'w-6 bg-saharaGold shadow-[0_0_8px_rgba(230,157,43,0.6)]'
                  : 'w-1.5 bg-white/25 hover:bg-white/50'
              }`}
              aria-label={`Switch to background video ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
