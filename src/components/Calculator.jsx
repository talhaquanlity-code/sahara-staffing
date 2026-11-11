import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useCMS } from '../context/CMSContext';
import saharaMarkImg from '../assets/sahara-mark.webp';

gsap.registerPlugin(ScrollTrigger);

// 3 Stations geometrically positioned at 120-degree intervals:
// 01 — DISCOVER at 180° (9 o'clock / left)
// 02 — CONNECT at 300° (2 o'clock / top-right)
// 03 — GROW at 60° (4 o'clock / bottom-right)
const DEFAULT_STATIONS = [
  {
    step: '01',
    title: 'DISCOVER',
    description: 'Define role scoping & technical specs.',
    angle: 180,
    isRight: false,
  },
  {
    step: '02',
    title: 'CONNECT',
    description: 'Source & vet high-impact candidates.',
    angle: 300,
    isRight: true,
  },
  {
    step: '03',
    title: 'SCALE',
    description: 'Deploy specialized talent with 90-day continuity.',
    angle: 60,
    isRight: true,
  },
];

export default function Calculator({ onNavigateContact, onProceedToContact }) {
  const { content, settings } = useCMS();
  const calcData = content?.home?.calculator || {};
  const eyebrow = calcData.eyebrow || 'SAHARA STAFFING INC. / TALENT SOLUTIONS';
  const headline = calcData.headline || 'Talent Solutions That Move Business Forward.';
  const highlightWord = calcData.highlightWord || 'Move';
  const subtitle =
    calcData.subtitle ||
    'The specialized talent and executive leadership behind every great enterprise. We partner with ambitious organizations to deliver precision staffing built to scale.';
  const ctaBtn = (Array.isArray(calcData.buttons) && calcData.buttons.find((b) => b?.enabled !== false)) || {
    label: 'Request Talent ->',
  };
  const ctaLabel = (ctaBtn.label || 'Request Talent ->').replace(/\s*(→|->|&rarr;)\s*$/, '').trim();
  const STATIONS = DEFAULT_STATIONS.map((s, idx) => ({
    ...s,
    step: calcData.stations?.[idx]?.step || s.step,
    title: calcData.stations?.[idx]?.title || s.title,
    description: calcData.stations?.[idx]?.description || s.description,
  }));
  const markLogo = settings?.brandMarkUrl || saharaMarkImg;
  const sectionRef = useRef(null);
  const orbitContainerRef = useRef(null);
  const logoWrapperRef = useRef(null);
  const progressArcRef = useRef(null);
  const travelingHeadRef = useRef(null);
  const outerRingRef = useRef(null);

  // Active stage index (0: DISCOVER, 1: CONNECT, 2: GROW)
  const [activeStage, setActiveStage] = useState(0);
  const activeStageRef = useRef(0);

  // GSAP quickTo functions for slow, luxurious cursor-following logo motion
  const quickRotZ = useRef(null);
  const quickRotX = useRef(null);
  const quickRotY = useRef(null);

  // Orbital geometry constants (420x420 coordinate system)
  const cx = 210;
  const cy = 210;
  const radius = 135;
  const circumference = 2 * Math.PI * radius; // ~848.23px

  // Unified function to apply scroll progress (0 to 1) to all orbital elements
  const applyProgress = (p) => {
    const progress = Math.max(0, Math.min(1, p));

    // 1. Stage selection mapped evenly: 0-33.33%, 33.33-66.67%, 66.67-100%
    let currentStage = 0;
    if (progress < 0.3333) {
      currentStage = 0;
    } else if (progress < 0.6667) {
      currentStage = 1;
    } else {
      currentStage = 2;
    }

    if (currentStage !== activeStageRef.current) {
      activeStageRef.current = currentStage;
      setActiveStage(currentStage);
    }

    // 2. Dynamic Gold Progress Arc starting from Station 01 (180°) clockwise
    if (progressArcRef.current) {
      const strokeLen = progress * circumference;
      progressArcRef.current.style.strokeDasharray = `${strokeLen} ${circumference}`;
    }

    // 3. Traveling Gold Satellite Head that leads the arc along the track (using percentage for responsive scaling)
    if (travelingHeadRef.current) {
      const headAngleDeg = 180 + progress * 360;
      const headRad = (headAngleDeg * Math.PI) / 180;
      const headPctX = ((cx + radius * Math.cos(headRad)) / 420) * 100;
      const headPctY = ((cy + radius * Math.sin(headRad)) / 420) * 100;
      travelingHeadRef.current.style.left = `${headPctX}%`;
      travelingHeadRef.current.style.top = `${headPctY}%`;
    }
  };

  const jumpToStage = (stageIdx) => {
    const progressMap = [0.08, 0.48, 0.88];
    applyProgress(progressMap[stageIdx]);
  };

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Initial position setup at 0 progress
    applyProgress(0);

    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // Mobile fix: Only run floating loops and scrollTrigger on desktop (>= 768px)
      mm.add('(min-width: 768px)', () => {
        // 1. PREMIUM FLOATING HOVER LOOP on the entire right orbit section
        gsap.to(orbitContainerRef.current, {
          y: -12,
          duration: 3.5,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });

        // 2. Slow ethereal ambient drift on the outer decorative guide ring
        gsap.to(outerRingRef.current, {
          rotation: 360,
          duration: 45,
          repeat: -1,
          ease: 'none',
        });

        // 3. Initialize GSAP quickTo for SLOW, luxurious cursor-following logo motion (1.6s duration)
        if (logoWrapperRef.current) {
          quickRotZ.current = gsap.quickTo(logoWrapperRef.current, 'rotation', {
            duration: 1.6,
            ease: 'power3.out',
          });
          quickRotX.current = gsap.quickTo(logoWrapperRef.current, 'rotationX', {
            duration: 1.6,
            ease: 'power3.out',
          });
          quickRotY.current = gsap.quickTo(logoWrapperRef.current, 'rotationY', {
            duration: 1.6,
            ease: 'power3.out',
          });
        }

        // 4. NATURAL SCROLL ANIMATION (Zero scroll hijacking / NO PINNING)
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top 78%',
          end: 'bottom 28%',
          scrub: 0.3,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            applyProgress(self.progress);
          },
        });
      });
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, []);

  // Desktop pointer follow handler: slow, gentle, elegant tilt clamped to ±10°
  const handleMouseMove = (e) => {
    if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) return;
    const rect = orbitContainerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = Math.max(-1, Math.min(1, (e.clientX - centerX) / (rect.width / 2)));
    const dy = Math.max(-1, Math.min(1, (e.clientY - centerY) / (rect.height / 2)));

    // Slow, subtle rotation and 3D directional tilt
    quickRotZ.current?.(dx * 10);
    quickRotX.current?.(-dy * 8);
    quickRotY.current?.(dx * 8);
  };

  const handleMouseLeave = () => {
    // Graceful, slow return to resting center (0°)
    quickRotZ.current?.(0);
    quickRotX.current?.(0);
    quickRotY.current?.(0);
  };

  const handleCtaClick = () => {
    if (onNavigateContact) {
      onNavigateContact();
    } else if (onProceedToContact) {
      onProceedToContact();
    } else {
      (window.history.pushState({}, '', '/contact'), window.dispatchEvent(new PopStateEvent('popstate')));
    }
  };

  return (
    <section
      ref={sectionRef}
      id="staffing-momentum"
      className="hidden md:block rounded-[24px] sm:rounded-[36px] lg:rounded-[44px] overflow-hidden bg-[#0E1420] md:bg-white border border-slate-800 md:border-[#DDD7CC] shadow-[0_4px_24px_rgba(11,15,23,0.03)] py-10 px-5 md:py-16 lg:py-20 md:px-8 lg:px-12 select-none relative"
    >
      <div className="max-w-[1360px] mx-auto px-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* =================================================================== */}
          {/* 1. LEFT COLUMN: EDITORIAL STAFFING NARRATIVE                        */}
          {/* =================================================================== */}
          <div className="lg:col-span-5 space-y-4 md:space-y-6 text-center md:text-left lg:pr-6">
            {/* Eyebrow */}
            <div>
              <span className="text-xs font-sans font-semibold tracking-wider uppercase text-[#E69D2B] md:text-[#B87314] block">
                {eyebrow}
              </span>
            </div>

            {/* Headline */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white md:text-[#0B0F17] leading-tight font-sans mt-1 max-w-lg">
              {highlightWord && headline.includes(highlightWord) ? (
                <>
                  {headline.split(highlightWord)[0]}
                  <span className="text-[#E69D2B] md:text-[#B87314]">{highlightWord}</span>
                  {headline.split(highlightWord).slice(1).join(highlightWord)}
                </>
              ) : (
                headline
              )}
            </h2>

            {/* Supporting Paragraph */}
            <p className="text-xs sm:text-sm md:text-base lg:text-lg text-slate-400 md:text-slate-600 font-normal leading-relaxed max-w-sm mx-auto md:max-w-md md:mx-0 font-sans">
              {subtitle}
            </p>

            {/* Primary CTA */}
            <div className="pt-2 md:pt-2 flex justify-center md:justify-start">
              <button
                type="button"
                onClick={handleCtaClick}
                className="w-full py-3.5 px-6 bg-[#E69D2B] text-[#0B0F17] font-bold text-sm rounded-xl shadow-lg hover:bg-[#d89020] flex items-center justify-center gap-2 md:w-auto md:bg-[#0B0F17] md:hover:bg-[#1E293B] md:text-white md:rounded-full md:px-8 md:py-4 md:text-base transition-all duration-200 group cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#F5A623]/50 active:scale-95"
              >
                <span>{ctaLabel}</span>
                <ArrowRight className="w-4 h-4 text-[#0B0F17] md:text-[#F5A623] transition-transform duration-200 group-hover:translate-x-1" />
              </button>
            </div>
          </div>

          {/* =================================================================== */}
          {/* 2. RIGHT COLUMN: INTERACTIVE FLOATING SAHARA ORBIT (Desktop Only)   */}
          {/* =================================================================== */}
          <div className="hidden md:flex lg:col-span-7 flex-col items-center lg:items-end lg:pr-4">
            <div
              ref={orbitContainerRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="relative w-52 h-52 sm:w-[380px] sm:h-[380px] lg:w-[400px] lg:h-[400px] flex items-center justify-center will-change-transform shrink-0 opacity-100 transform-none"
            >
              {/* Concentric Architectural SVG Tracks */}
              <svg
                viewBox="0 0 420 420"
                className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
              >
                {/* Outermost delicate guide track with subtle ambient rotation */}
                <circle
                  ref={outerRingRef}
                  cx={cx}
                  cy={cy}
                  r="186"
                  fill="none"
                  stroke="#EDE8DF"
                  strokeWidth="1"
                  strokeDasharray="4 6"
                  style={{ transformOrigin: 'center center' }}
                />

                {/* Primary orbital path */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={radius}
                  fill="none"
                  stroke="#E4DED4"
                  strokeWidth="1.5"
                />

                {/* Delicate Inner Accent Ring */}
                <circle
                  cx={cx}
                  cy={cy}
                  r="88"
                  fill="none"
                  stroke="#F5A623"
                  strokeOpacity="0.25"
                  strokeWidth="1"
                />

                {/* Unified Gold Progress Arc: Starts at Station 01 (180°) and traces clockwise */}
                <circle
                  ref={progressArcRef}
                  cx={cx}
                  cy={cy}
                  r={radius}
                  fill="none"
                  stroke="#F5A623"
                  strokeWidth="2.5"
                  strokeDasharray={`0 ${circumference}`}
                  strokeDashoffset="0"
                  strokeLinecap="round"
                  transform={`rotate(180 ${cx} ${cy})`}
                />
              </svg>

              {/* Central Medallion (Stationary Deep Obsidian Navy + Real Sahara Brand Symbol) */}
              <div
                className="relative z-20 w-20 h-20 sm:w-32 sm:h-32 rounded-full bg-[#0B0F17] border border-[#F5A623]/30 shadow-[0_12px_28px_rgba(11,15,23,0.16)] flex items-center justify-center"
                style={{ perspective: 600 }}
              >
                {/* Symbol Wrapper with SLOW Cursor-Following 3D Directional Motion */}
                <div
                  ref={logoWrapperRef}
                  className="w-10 h-10 sm:w-16 sm:h-16 flex items-center justify-center will-change-transform"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <img
                    src={markLogo}
                    alt={settings?.companyName || 'Sahara Staffing Inc.'}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-contain pointer-events-none select-none drop-shadow"
                    draggable={false}
                  />
                </div>
              </div>

              {/* Traveling Gold Satellite Head on Orbit Path (Percentage-based for responsive scale) */}
              <div
                ref={travelingHeadRef}
                className="absolute pointer-events-none will-change-[left,top] z-30"
                style={{
                  left: `${((cx - radius) / 420) * 100}%`,
                  top: '50%',
                }}
              >
                <div className="-translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                  <div className="w-3.5 h-3.5 rounded-full bg-[#F5A623] border-2 border-white shadow-[0_0_12px_rgba(245,166,35,0.8)]" />
                </div>
              </div>

              {/* 3 Orbital Stations at 180°, 300°, 60° (Percentage coordinates) */}
              {STATIONS.map((station, i) => {
                const isActive = activeStage === i;
                const isCompleted = i < activeStage;

                // Exact coordinate on 420x420 viewBox mapped to percentage
                const rad = (station.angle * Math.PI) / 180;
                const x = cx + radius * Math.cos(rad);
                const y = cy + radius * Math.sin(rad);
                const pctX = (x / 420) * 100;
                const pctY = (y / 420) * 100;

                return (
                  <div
                    key={station.step}
                    className="absolute -translate-x-1/2 -translate-y-1/2 will-change-transform"
                    style={{
                      left: `${pctX}%`,
                      top: `${pctY}%`,
                      zIndex: isActive ? 25 : 15,
                    }}
                  >
                    {/* Node Dot Container */}
                    <div
                      onClick={() => jumpToStage(i)}
                      className="relative flex items-center justify-center cursor-pointer p-1"
                    >
                      {/* Station Dot */}
                      <div
                        className="w-2.5 h-2.5 rounded-full border-2 border-white transition-all duration-300"
                        style={{
                          backgroundColor: isActive
                            ? '#F5A623'
                            : isCompleted
                              ? '#D48817'
                              : '#CBD5E1',
                          transform: isActive ? 'scale(1.4)' : 'scale(1)',
                          boxShadow: isActive ? '0 0 14px rgba(245, 166, 35, 0.7)' : 'none',
                        }}
                      />

                      {/* Desktop Station Label (sm:block, hidden on mobile to prevent clipping) */}
                      <div
                        className="station-label absolute whitespace-nowrap transition-all duration-300 hidden sm:block pointer-events-none"
                        style={{
                          left: station.isRight ? '16px' : 'auto',
                          right: station.isRight ? 'auto' : '16px',
                          textAlign: station.isRight ? 'left' : 'right',
                          top: '50%',
                          transform: 'translate(0, -50%)',
                        }}
                      >
                        <div
                          className="text-[11px] font-sans tracking-wider uppercase transition-colors duration-300"
                          style={{
                            color: isActive
                              ? '#B87314'
                              : isCompleted
                                ? '#64748B'
                                : '#94A3B8',
                            fontWeight: isActive ? 700 : isCompleted ? 600 : 500,
                          }}
                        >
                          {station.step} : {station.title}
                        </div>
                        <div
                          className="text-[11px] font-sans leading-tight transition-colors duration-300"
                          style={{
                            color: isActive
                              ? '#0B0F17'
                              : isCompleted
                                ? '#64748B'
                                : '#CBD5E1',
                            fontWeight: isActive ? 500 : 400,
                          }}
                        >
                          {station.description}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Mobile Dedicated Stage Status Indicator (< sm) */}
            <div className="block sm:hidden mt-5 w-full max-w-[280px]">
              {/* 3 Step Interactive Selector */}
              <div className="flex items-center justify-center gap-1.5 p-1 bg-[#FAF9F6] rounded-full border border-[#E4DED4]">
                {STATIONS.map((station, i) => {
                  const isActive = activeStage === i;
                  return (
                    <button
                      key={station.step}
                      type="button"
                      onClick={() => jumpToStage(i)}
                      className={`flex-1 py-1.5 px-2 rounded-full text-[11px] font-semibold transition-all duration-200 cursor-pointer ${
                        isActive
                          ? 'bg-[#0B0F17] text-white shadow-sm'
                          : 'text-slate-500 hover:text-[#0B0F17]'
                      }`}
                    >
                      {station.step} {station.title}
                    </button>
                  );
                })}
              </div>

              {/* Active Stage Description Box */}
              <div className="mt-2.5 text-center px-4 py-2.5 bg-[#FAF9F6] rounded-xl border border-[#E4DED4]/70">
                <div className="text-[11px] font-bold text-[#B87314] tracking-wider uppercase">
                  Stage {(STATIONS[activeStage] || STATIONS[0]).step} &bull; {(STATIONS[activeStage] || STATIONS[0]).title}
                </div>
                <div className="text-xs text-slate-600 mt-0.5 font-normal">
                  {(STATIONS[activeStage] || STATIONS[0]).description}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}