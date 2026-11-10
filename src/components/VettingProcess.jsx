import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { useCMS } from '../context/CMSContext';

gsap.registerPlugin(ScrollTrigger);

const DEFAULT_STAGES = [
  { id: '01', name: 'Understand', label: '01 Understand' },
  { id: '02', name: 'Source', label: '02 Source' },
  { id: '03', name: 'Assess', label: '03 Assess' },
  { id: '04', name: 'Coordinate', label: '04 Coordinate' },
  { id: '05', name: 'Support', label: '05 Support' },
];

export default function VettingProcess({ onNavigateContact, onNavigateServices }) {
  const { content, isLivePreview } = useCMS();
  const stagesList = content?.vettingStages && content.vettingStages.length > 0
    ? content.vettingStages.map(s => ({ ...s, label: s.label || `${s.order} ${s.name}` }))
    : DEFAULT_STAGES;
  const vettingImages = content?.images?.vettingSteps || [];
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

  // Scene 2 editorial elements
  const scene2TextRef = useRef(null);
  const scene2ProfileRef = useRef(null);

  // Scene 4 elements
  const scene4ContentRef = useRef(null);
  const ctaBtnRef = useRef(null);

  // Interactive state
  const [activeStage, setActiveStage] = useState(0);
  const [overallProgress, setOverallProgress] = useState(0);
  const [isIvoryMode, setIsIvoryMode] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detect mobile viewport or user motion preference
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || isLivePreview) {
      setIsMobile(true);
      return () => window.removeEventListener('resize', checkMobile);
    }

    const mm = gsap.matchMedia();

    mm.add('(min-width: 768px)', () => {
      const masterTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.1,
          onUpdate: (self) => {
            const p = self.progress;
            setOverallProgress(p);

            // Determine active stage across the 5 steps
            let stageIndex = 0;
            if (p < 0.2) stageIndex = 0;
            else if (p < 0.4) stageIndex = 1;
            else if (p < 0.6) stageIndex = 2;
            else if (p < 0.8) stageIndex = 3;
            else stageIndex = 4;
            setActiveStage(stageIndex);

            // Scene 4 state transition
            setIsIvoryMode(false);
          },
        },
      });

      // Initial visual states
      gsap.set(bg1Ref.current, { opacity: 1, scale: 1 });
      gsap.set(bg2Ref.current, { opacity: 0, scale: 1.04 });
      gsap.set(bg3Ref.current, { opacity: 0, scale: 1.04 });
      gsap.set(bg4Ref.current, { opacity: 0, scale: 1.02 });

      gsap.set(scene1Ref.current, { opacity: 1, visibility: 'visible', y: 0 });
      gsap.set(scene2Ref.current, { opacity: 0, visibility: 'hidden', y: 24 });
      gsap.set(scene3Ref.current, { opacity: 0, visibility: 'hidden', y: 24 });
      gsap.set(scene4Ref.current, { opacity: 0, visibility: 'hidden', y: 24 });

      // =======================================================================
      // MASTER EDITORIAL CHOREOGRAPHY (100 units normalized)
      // =======================================================================

      // --- SCENE 01: THE NEED (0 -> 24) ---
      masterTl
        .to(bg1Ref.current, { scale: 1.04, y: -15, duration: 20, ease: 'none' }, 0)
        // Scene 1 Out
        .to(scene1Ref.current, { opacity: 0, y: -24, duration: 6, ease: 'power2.inOut' }, 20)
        .set(scene1Ref.current, { visibility: 'hidden' }, 26)

        // --- SCENE 02: THE SEARCH (24 -> 48) ---
        .to(bg1Ref.current, { opacity: 0, duration: 8, ease: 'power2.inOut' }, 22)
        .set(scene2Ref.current, { visibility: 'visible' }, 24)
        .to(bg2Ref.current, { opacity: 1, scale: 1, duration: 8, ease: 'power2.inOut' }, 24)
        .to(scene2Ref.current, { opacity: 1, y: 0, duration: 6, ease: 'power2.out' }, 24)
        // Subtle entrance for candidate editorial profile
        .fromTo(
          scene2ProfileRef.current,
          { opacity: 0, y: 35 },
          { opacity: 1, y: 0, duration: 8, ease: 'power2.out' },
          26
        )
        .to(bg2Ref.current, { scale: 1.03, y: -12, duration: 18, ease: 'none' }, 28)
        // Scene 2 Out
        .to(scene2Ref.current, { opacity: 0, y: -24, duration: 6, ease: 'power2.inOut' }, 44)
        .set(scene2Ref.current, { visibility: 'hidden' }, 50)

        // --- SCENE 03: THE CONNECTION (48 -> 72) ---
        .to(bg2Ref.current, { opacity: 0, duration: 8, ease: 'power2.inOut' }, 46)
        .set(scene3Ref.current, { visibility: 'visible' }, 48)
        .to(bg3Ref.current, { opacity: 1, scale: 1, duration: 8, ease: 'power2.inOut' }, 48)
        .to(scene3Ref.current, { opacity: 1, y: 0, duration: 6, ease: 'power2.out' }, 48)
        .to(bg3Ref.current, { scale: 1.03, y: -12, duration: 18, ease: 'none' }, 52)
        // Scene 3 Out
        .to(scene3Ref.current, { opacity: 0, y: -24, duration: 6, ease: 'power2.inOut' }, 68)
        .set(scene3Ref.current, { visibility: 'hidden' }, 74)

        // --- SCENE 04: THE OUTCOME (72 -> 100) ---
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
      window.removeEventListener('resize', checkMobile);
      mm.revert();
    };
  }, []);

  // ===========================================================================
  // RESPONSIVE PRESENTATION: MOBILE STATIC STACK (< md) + DESKTOP PINNED (md+)
  // ===========================================================================
  return (
    <>
      {/* ===================================================================== */}
      {/* 1. DEDICATED EXECUTIVE MOBILE TIMELINE STEPPER (< md)                */}
      {/* ===================================================================== */}
      <section
        id="process-story-mobile"
        className="block md:hidden w-full bg-[#0B0F17] text-white px-5 py-8"
      >
        <div className="max-w-xl mx-auto space-y-6">
          {/* Header */}
          <div>
            <span className="text-xs font-sans font-semibold tracking-[0.2em] uppercase text-[#E69D2B] block mb-2">
              The Sahara Approach
            </span>
            <h2 className="text-2xl font-bold tracking-tight text-white leading-tight mb-2">
              Strategic Process. Measurable Impact.
            </h2>
            <p className="text-slate-400 text-xs leading-relaxed">
              Every successful placement begins with deep understanding, rigorous sourcing, and long-term alignment.
            </p>
          </div>

          {/* Minimal Executive Vertical Timeline Stepper */}
          <div className="relative pl-6 space-y-5 before:absolute before:left-[11px] before:top-4 before:bottom-4 before:w-[2px] before:bg-[#E69D2B]/30">
            {/* Stage 01: DISCOVER */}
            <div className="relative">
              {/* Gold Node Indicator */}
              <div className="absolute -left-6 top-5 w-[14px] h-[14px] rounded-full bg-[#0B0F17] border-2 border-[#E69D2B] shadow-[0_0_8px_rgba(230,157,43,0.5)] -translate-x-[5px]" />
              <div className="bg-[#0E1420] border border-slate-800 rounded-xl p-5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold tracking-wider text-[#E69D2B] uppercase">01</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-[#E69D2B]/10 text-[#E69D2B] border border-[#E69D2B]/20">
                    ORGANIZATIONAL MAPPING
                  </span>
                </div>
                <h3 className="text-base font-bold text-white">Understanding Your Strategic Need</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  We analyze your technical architecture, leadership dynamics, and growth milestones to define the exact talent requirement.
                </p>
              </div>
            </div>

            {/* Stage 02: SOURCE */}
            <div className="relative">
              {/* Gold Node Indicator */}
              <div className="absolute -left-6 top-5 w-[14px] h-[14px] rounded-full bg-[#0B0F17] border-2 border-[#E69D2B] shadow-[0_0_8px_rgba(230,157,43,0.5)] -translate-x-[5px]" />
              <div className="bg-[#0E1420] border border-slate-800 rounded-xl p-5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold tracking-wider text-[#E69D2B] uppercase">02</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-[#E69D2B]/10 text-[#E69D2B] border border-[#E69D2B]/20">
                    CANDIDATE DILIGENCE
                  </span>
                </div>
                <h3 className="text-base font-bold text-white">Active Market Mapping &amp; Diligence</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Direct outbound search targeting passive top-tier candidates with structured technical evaluations and leadership references.
                </p>
              </div>
            </div>

            {/* Stage 03: CONNECT */}
            <div className="relative">
              {/* Gold Node Indicator */}
              <div className="absolute -left-6 top-5 w-[14px] h-[14px] rounded-full bg-[#0B0F17] border-2 border-[#E69D2B] shadow-[0_0_8px_rgba(230,157,43,0.5)] -translate-x-[5px]" />
              <div className="bg-[#0E1420] border border-slate-800 rounded-xl p-5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold tracking-wider text-[#E69D2B] uppercase">03</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-[#E69D2B]/10 text-[#E69D2B] border border-[#E69D2B]/20">
                    ALIGNMENT &amp; DIALOGUE
                  </span>
                </div>
                <h3 className="text-base font-bold text-white">Coordinated Interviews &amp; Offer</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Precision interview scheduling, transparent communication, and structured negotiations for seamless candidate alignment.
                </p>
              </div>
            </div>

            {/* Stage 04: DELIVER */}
            <div className="relative">
              {/* Gold Node Indicator */}
              <div className="absolute -left-6 top-5 w-[14px] h-[14px] rounded-full bg-[#0B0F17] border-2 border-[#E69D2B] shadow-[0_0_8px_rgba(230,157,43,0.5)] -translate-x-[5px]" />
              <div className="bg-[#0E1420] border border-slate-800 rounded-xl p-5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold tracking-wider text-[#E69D2B] uppercase">04</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-[#E69D2B]/10 text-[#E69D2B] border border-[#E69D2B]/20">
                    RETENTION GUARANTEE
                  </span>
                </div>
                <h3 className="text-base font-bold text-white">Seamless Placement &amp; 90-Day SLA</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Executive onboarding support and a complete 90-day retention guarantee ensuring lasting team performance and ROI.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={onNavigateContact}
              className="w-full min-h-[48px] rounded-full px-6 py-3.5 bg-[#E69D2B] hover:bg-[#F6C467] text-[#0B0F17] font-semibold transition-all duration-300 shadow-md inline-flex items-center justify-center gap-2 text-sm cursor-pointer active:scale-95"
            >
              <span className="font-semibold">Discuss Your Hiring Needs</span>
              <ArrowRight className="w-4 h-4 text-[#0B0F17]" />
            </button>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 2. DESKTOP EDITORIAL CANVAS (Pinned Master Scroll Narrative: md+)      */}
      {/* ===================================================================== */}
      <section
        id="process-story"
        ref={containerRef}
        className="hidden md:block relative w-full h-[360vh] bg-[#0B0F17] text-white select-none overflow-clip"
        style={{
          backgroundColor: isIvoryMode ? '#F8F6F1' : '#0B0F17',
          transition: 'background-color 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
      {/* STICKY STAGE CONTAINER */}
      <div
        ref={stageRef}
        className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between"
      >
        {/* ===================================================================== */}
        {/* 1. PHOTOGRAPHIC CANVAS (Authentic Lighting & Real Grading)            */}
        {/* ===================================================================== */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          {/* Canvas 1: The Need (Leadership Discussion) */}
          <div ref={bg1Ref} className="absolute inset-0 w-full h-full will-change-transform">
            <img
              src={vettingImages[0] || content?.vettingStages?.[0]?.image || '/assets/card1-staffing.jpg'}
              alt="Leadership Discussion"
              className="w-full h-full object-cover object-[center_25%]"
              loading="eager"
            />
            {/* Natural side gradient allowing real photo clarity on right */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0B0F17]/95 via-[#0B0F17]/65 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F17] via-transparent to-transparent opacity-60" />
          </div>

          {/* Canvas 2: The Search (Contemporary Office Context) */}
          <div ref={bg2Ref} className="absolute inset-0 w-full h-full will-change-transform">
            <img
              src={vettingImages[1] || content?.vettingStages?.[1]?.image || '/assets/card3-workforce.jpg'}
              alt="Contemporary Office Environment"
              className="w-full h-full object-cover object-center"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0B0F17]/95 via-[#0B0F17]/70 to-[#0B0F17]/35" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F17] via-transparent to-transparent opacity-60" />
          </div>

          {/* Canvas 3: The Connection (Professional Dialogue) */}
          <div ref={bg3Ref} className="absolute inset-0 w-full h-full will-change-transform">
            <img
              src={vettingImages[2] || content?.vettingStages?.[2]?.image || '/assets/service-workforce.jpg'}
              alt="Professional Dialogue"
              className="w-full h-full object-cover object-center"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0B0F17]/95 via-[#0B0F17]/70 to-[#0B0F17]/30" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F17] via-transparent to-transparent opacity-60" />
          </div>

          {/* Canvas 4: The Outcome (Executive Workspace & Dark Slate Atmosphere) */}
          <div ref={bg4Ref} className="absolute inset-0 w-full h-full will-change-transform">
            <img
              src={vettingImages[3] || content?.vettingStages?.[3]?.image || '/assets/hero-1.jpg'}
              alt="Executive Workspace Environment"
              className="w-full h-full object-cover object-center"
              loading="lazy"
            />
            {/* Sophisticated Dark Navy Slate Ambient Backdrop */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0B0F17] via-[#0B0F17]/85 to-[#0B0F17]/45" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F17] via-transparent to-transparent opacity-80" />
          </div>
        </div>

        {/* ===================================================================== */}
        {/* 2. RESTRAINED TOP BAR                                                 */}
        {/* ===================================================================== */}
        <header
          className="relative z-20 w-full px-8 sm:px-14 lg:px-20 pt-8 sm:pt-10 flex items-center justify-between transition-colors duration-700"
          style={{ color: isIvoryMode ? '#0B0F17' : '#FFFFFF' }}
        >
          <div className="flex items-center gap-3">
            <span
              className="text-xs font-sans font-semibold tracking-[0.2em] uppercase transition-colors duration-700"
              style={{ color: isIvoryMode ? '#B87314' : '#F5A623' }}
            >
              The Sahara Approach
            </span>
          </div>

          {/* Quiet Step Counter */}
          <div
            className="text-xs font-sans tracking-wide transition-colors duration-700"
            style={{ color: isIvoryMode ? 'rgba(11,15,23,0.6)' : 'rgba(255,255,255,0.6)' }}
          >
            <span>{stagesList[activeStage]?.label}</span>
          </div>
        </header>

        {/* ===================================================================== */}
        {/* 3. EDITORIAL NARRATIVE STAGE                                          */}
        {/* ===================================================================== */}
        <div className="relative z-10 flex-1 w-full max-w-[1360px] mx-auto px-8 sm:px-14 lg:px-20 flex items-center">
          {/* ----------------------------------------------------------------- */}
          {/* SCENE 01: THE NEED                                                */}
          {/* ----------------------------------------------------------------- */}
          <div
            ref={scene1Ref}
            className="absolute inset-x-8 sm:inset-x-14 lg:inset-x-20 max-w-2xl will-change-transform"
          >
            <h2 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-medium text-white tracking-tight leading-[1.06] mb-8 font-sans">
              Great Teams
              <br />
              Don&apos;t Happen
              <br />
              by Accident.
            </h2>
            <p className="text-slate-300 text-lg sm:text-xl font-normal leading-relaxed max-w-xl font-sans">
              Every successful placement begins with understanding the business, the role, and the
              people who will help it grow.
            </p>
          </div>

          {/* ----------------------------------------------------------------- */}
          {/* SCENE 02: THE SEARCH                                              */}
          {/* ----------------------------------------------------------------- */}
          <div
            ref={scene2Ref}
            className="absolute inset-x-8 sm:inset-x-14 lg:inset-x-20 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center will-change-transform"
          >
            {/* Left Column: Editorial Headline & Copy */}
            <div ref={scene2TextRef} className="lg:col-span-6">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium text-white tracking-tight leading-[1.1] mb-6 font-sans">
                Finding the Right People
                <br />
                Takes More Than a Search.
              </h2>
              <p className="text-slate-300 text-base sm:text-lg font-normal leading-relaxed font-sans max-w-lg">
                We look beyond job titles to understand relevant experience, capabilities, and the
                needs of each role.
              </p>
            </div>

            {/* Right Column: Single Integrated Editorial Profile (Magazine Layout) */}
            <div
              ref={scene2ProfileRef}
              className="lg:col-span-6 flex flex-col sm:flex-row gap-6 sm:gap-8 items-start sm:items-center"
            >
              <img
                src={vettingImages[4] || content?.vettingStages?.[4]?.image || '/assets/female-executive-beige.jpg'}
                alt="Elena Vance"
                className="w-40 sm:w-48 lg:w-52 h-52 sm:h-64 lg:h-72 object-cover object-top shadow-2xl flex-shrink-0"
              />
              <div className="space-y-3 font-sans">
                <div>
                  <h3 className="text-2xl sm:text-3xl font-medium text-white tracking-tight">
                    Elena Vance
                  </h3>
                  <p className="text-sm sm:text-base text-[#F5A623] font-normal mt-0.5">
                    VP of Systems Engineering
                  </p>
                </div>
                <p className="text-slate-300 text-xs sm:text-sm font-normal leading-relaxed max-w-sm">
                  14 years leading infrastructure architecture and distributed systems at
                  scale. Focused on resilient platform scaling, high-concurrency environments.
                </p>
                <div className="pt-2 flex flex-wrap items-center gap-x-2 text-xs text-slate-400 font-normal">
                 
                </div>
              </div>
            </div>
          </div>

          {/* ----------------------------------------------------------------- */}
          {/* SCENE 03: THE CONNECTION                                          */}
          {/* ----------------------------------------------------------------- */}
          <div
            ref={scene3Ref}
            className="absolute inset-x-8 sm:inset-x-14 lg:inset-x-20 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center will-change-transform"
          >
            <div className="lg:col-span-7">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-medium text-white tracking-tight leading-[1.08] mb-6 font-sans">
                The Right Fit
                <br />
                Changes Everything.
              </h2>
              <p className="text-slate-300 text-base sm:text-lg font-normal leading-relaxed max-w-lg font-sans">
                We help businesses and suitable candidates move through the hiring process with
                clarity and communication.
              </p>
            </div>

            {/* Restrained Editorial Accent */}
            <div className="lg:col-span-5 pl-0 lg:pl-6 border-l-0 lg:border-l border-white/20">
              <p className="text-slate-300 text-sm sm:text-base font-normal leading-relaxed font-sans">
                Direct communication, thoughtful alignment, and mutual clarity from first
                conversation through final offer and transition.
              </p>
              <span className="text-xs text-[#F5A623] font-medium tracking-wide mt-3 block">
                Human judgment at every step.
              </span>
            </div>
          </div>

          {/* ----------------------------------------------------------------- */}
          {/* SCENE 04: THE OUTCOME (DARK NAVY SLATE AMBIENT STAGE)              */}
          {/* ----------------------------------------------------------------- */}
          <div
            ref={scene4Ref}
            className="absolute inset-x-8 sm:inset-x-14 lg:inset-x-20 max-w-3xl will-change-transform"
          >
            <div ref={scene4ContentRef}>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-medium text-white tracking-tight leading-[1.06] mb-6 font-sans">
                Build the Team
                <br />
                That Moves You Forward.
              </h2>
              <p className="text-slate-300 text-lg sm:text-xl font-normal leading-relaxed max-w-xl font-sans mb-10">
                From understanding the role to supporting the hiring journey, Sahara helps
                businesses take the next step toward stronger teams.
              </p>

              {/* Action Buttons */}
              <div ref={ctaBtnRef} className="flex flex-wrap items-center gap-6">
                <button
                  type="button"
                  onClick={onNavigateContact}
                  className="rounded-full px-7 py-3.5 bg-[#0B0F17] hover:bg-[#E69D2B] hover:text-[#0B0F17] text-white font-semibold transition-all duration-300 shadow-md border border-white/20 hover:border-[#E69D2B] inline-flex items-center gap-3 cursor-pointer group"
                >
                  <span>Discuss Your Hiring Needs</span>
                  <ArrowRight className="w-4 h-4 text-[#E69D2B] transition-transform duration-200 group-hover:translate-x-1" />
                </button>

                <button
                  type="button"
                  onClick={onNavigateServices}
                  className="text-slate-300 hover:text-white text-base font-medium px-4 py-3.5 transition-colors duration-200 inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>Explore Our Services</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* 4. DISCREET PROGRESS INDICATION (Hairline Edge & Quiet Label)          */}
        {/* ===================================================================== */}
        <footer className="relative z-20 w-full px-8 sm:px-14 lg:px-20 pb-6 sm:pb-8">
          <div className="flex items-center justify-between text-xs font-sans pb-3">
            <div className="flex items-center gap-2">
              <span
                className="w-1.5 h-1.5 rounded-full transition-colors duration-500"
                style={{ backgroundColor: isIvoryMode ? '#B87314' : '#F5A623' }}
              />
              <span
                className="transition-colors duration-500 font-medium"
                style={{ color: isIvoryMode ? '#0B0F17' : '#FFFFFF' }}
              >
                {stagesList[activeStage]?.label}
              </span>
            </div>

            <span
              className="transition-colors duration-500"
              style={{ color: isIvoryMode ? 'rgba(11,15,23,0.5)' : 'rgba(255,255,255,0.5)' }}
            >
              Stage 0{activeStage + 1} of 05
            </span>
          </div>

          {/* 1px Hairline Progress Bar */}
          <div
            className="w-full h-[1px] overflow-hidden"
            style={{
              backgroundColor: isIvoryMode ? 'rgba(11,15,23,0.1)' : 'rgba(255,255,255,0.1)',
            }}
          >
            <div
              className="h-full transition-all duration-75"
              style={{
                width: `${Math.round(overallProgress * 100)}%`,
                backgroundColor: isIvoryMode ? '#B87314' : '#F5A623',
              }}
            />
          </div>
        </footer>
      </div>
    </section>
    </>
  );
}
