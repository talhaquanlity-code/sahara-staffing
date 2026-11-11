import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import saharaMarkImg from '../assets/sahara-mark.webp';
import { useCMS } from '../context/CMSContext';

const DEFAULT_PIPELINE = {
  eyebrow: 'THE SAHARA PHILOSOPHY',
  quotePrefix: 'Great organizations aren’t built by accident – they’re defined by the',
  quoteHighlight: 'exceptional talent',
  quoteSuffix: 'that moves business forward.',
  pillars: [
    { title: 'Sahara Staffing', desc: 'Executive & Technical Search' },
    { title: '14-Day Placement', desc: '100% Rigorously Vetted' },
    { title: '90-Day Guarantee', desc: 'Placement Performance SLA' },
  ],
};

export default function KineticTalentPipeline() {
  const { content, settings } = useCMS();
  const pipelineData = content?.about?.pipeline || DEFAULT_PIPELINE;
  const pillars =
    Array.isArray(pipelineData?.pillars) && pipelineData.pillars.length > 0
      ? pipelineData.pillars
      : DEFAULT_PIPELINE.pillars;
  const brandMark = settings?.brandMarkUrl || saharaMarkImg;
  const companyName = settings?.companyName || 'Sahara Staffing Inc.';

  const sectionRef = useRef(null);
  const radarRef = useRef(null);
  const [cursorPos, setCursorPos] = useState({ x: 200, y: 200 });
  const [isHovered, setIsHovered] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const radarY = useTransform(scrollYProgress, [0, 1], [25, -25]);
  const quoteY = useTransform(scrollYProgress, [0, 1], [-10, 10]);

  const handleMouseMove = (e) => {
    if (!radarRef.current) return;
    const rect = radarRef.current.getBoundingClientRect();
    setCursorPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <section
      ref={sectionRef}
      id="kinetic-pipeline"
      className="bg-[#0B0F17] py-12 md:py-18 lg:py-20 px-5 md:px-10 lg:px-16 text-white relative select-none font-sans overflow-hidden border-t border-white/[0.08]"
    >
      {/* MOBILE EDITORIAL LAYOUT (< md) */}
      <div className="block md:hidden max-w-md mx-auto relative z-10 text-left">
        <div className="flex justify-center mb-8">
          <div className="relative w-52 h-52 rounded-[24px] bg-[#0E131F]/90 border border-white/[0.08] p-4 flex items-center justify-center overflow-hidden shadow-[0_16px_40px_rgba(0,0,0,0.55)] transform-gpu">
            <svg
              viewBox="0 0 400 400"
              className="w-full h-full absolute inset-0 select-none pointer-events-none"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="200" cy="200" r="180" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
              <circle cx="200" cy="200" r="130" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
              <circle cx="200" cy="200" r="85" stroke="rgba(230,157,43,0.18)" strokeWidth="1" />
              <circle cx="200" cy="200" r="48" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
              <line x1="24" y1="200" x2="376" y2="200" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
              <line x1="200" y1="24" x2="200" y2="376" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
            </svg>

            <div className="w-[82%] h-[82%] absolute inset-0 m-auto pointer-events-none rounded-full overflow-hidden">
              <div
                className="w-full h-full rounded-full animate-spin [animation-duration:8s] [animation-timing-function:linear]"
                style={{
                  background:
                    'conic-gradient(from 0deg, rgba(230,157,43,0.18) 0deg, rgba(230,157,43,0.03) 45deg, transparent 80deg, transparent 360deg)',
                }}
              />
            </div>

            <div className="relative z-10 w-16 h-16 rounded-full bg-[#0B0F17] border border-white/10 shadow-[0_8px_20px_rgba(0,0,0,0.8)] flex items-center justify-center pointer-events-none">
              <img
                src={brandMark}
                onError={(e) => {
                  e.currentTarget.src = saharaMarkImg;
                }}
                alt={companyName}
                loading="lazy"
                decoding="async"
                className="w-9 h-9 object-contain filter drop-shadow-[0_4px_12px_rgba(230,157,43,0.3)]"
                draggable={false}
              />
            </div>
          </div>
        </div>

        <div className="text-[10px] font-mono text-[#E69D2B] uppercase tracking-[0.22em] flex items-center gap-2.5 mb-3">
          <span className="w-4 h-[1px] bg-[#E69D2B]" aria-hidden="true" />
          <span>{pipelineData.eyebrow || DEFAULT_PIPELINE.eyebrow}</span>
        </div>

        <div className="border-l-2 border-[#E69D2B]/70 pl-4 mb-7">
          <h2 className="text-[19px] font-bold text-white leading-[1.38] tracking-[-0.02em] text-left">
            &ldquo;{pipelineData.quotePrefix || DEFAULT_PIPELINE.quotePrefix}{' '}
            <span className="text-[#E69D2B] font-extrabold">
              {pipelineData.quoteHighlight || DEFAULT_PIPELINE.quoteHighlight}
            </span>{' '}
            {pipelineData.quoteSuffix || DEFAULT_PIPELINE.quoteSuffix}&rdquo;
          </h2>
        </div>

        <div className="border-y border-white/[0.08] divide-y divide-white/[0.08]">
          {pillars.map((pillar, idx) => (
            <div key={idx} className="grid grid-cols-12 items-baseline gap-2 py-3.5">
              <h4
                className={`col-span-5 text-xs font-bold text-left tracking-tight ${
                  idx === 1 ? 'text-[#E69D2B]' : 'text-white'
                }`}
              >
                {pillar.title}
              </h4>
              <p className="col-span-7 text-[11px] font-mono text-slate-400 text-right leading-snug">
                {pillar.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* DESKTOP & LAPTOP LAYOUT (md+) */}
      <div className="hidden md:grid max-w-[1360px] mx-auto grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center relative z-10">
        {/* LEFT COLUMN: RADAR */}
        <motion.div
          style={{ y: radarY }}
          className="lg:col-span-5 flex items-center justify-center will-change-transform"
        >
          <div
            ref={radarRef}
            onMouseEnter={() => setIsHovered(true)}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setIsHovered(false)}
            className="relative w-full max-w-[380px] aspect-square rounded-[32px] bg-[#0E131F]/90 border border-white/[0.08] p-6 flex items-center justify-center overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.6)] cursor-crosshair group"
          >
            <svg
              viewBox="0 0 400 400"
              className="w-full h-full absolute inset-0 select-none pointer-events-none"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="200" cy="200" r="180" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
              <circle cx="200" cy="200" r="130" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
              <circle cx="200" cy="200" r="85" stroke="rgba(230,157,43,0.18)" strokeWidth="1" />
              <circle cx="200" cy="200" r="48" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
              <line x1="24" y1="200" x2="376" y2="200" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
              <line x1="200" y1="24" x2="200" y2="376" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
            </svg>

            <div className="w-[340px] h-[340px] absolute inset-0 m-auto pointer-events-none rounded-full overflow-hidden">
              <div
                className="w-full h-full rounded-full animate-spin [animation-duration:8s] [animation-timing-function:linear]"
                style={{
                  background:
                    'conic-gradient(from 0deg, rgba(230,157,43,0.18) 0deg, rgba(230,157,43,0.03) 45deg, transparent 80deg, transparent 360deg)',
                }}
              />
            </div>

            <div className="relative z-10 w-24 h-24 sm:w-26 sm:h-26 rounded-full bg-[#0B0F17] border border-white/10 shadow-[0_12px_28px_rgba(0,0,0,0.85)] flex items-center justify-center pointer-events-none">
              <motion.div
                animate={{ scale: [1, 1.025, 1] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                className="w-14 h-14 sm:w-15 sm:h-15 flex items-center justify-center select-none"
              >
                <img
                  src={brandMark}
                  onError={(e) => {
                    e.currentTarget.src = saharaMarkImg;
                  }}
                  alt={companyName}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-contain filter drop-shadow-[0_8px_20px_rgba(230,157,43,0.3)]"
                  draggable={false}
                />
              </motion.div>
            </div>

            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    left: cursorPos.x,
                    top: cursorPos.y,
                  }}
                  exit={{ opacity: 0, scale: 0.6 }}
                  transition={{
                    left: { type: 'spring', damping: 28, stiffness: 240, mass: 0.35 },
                    top: { type: 'spring', damping: 28, stiffness: 240, mass: 0.35 },
                    opacity: { duration: 0.3 },
                  }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none z-30"
                >
                  <motion.div
                    animate={{
                      scale: [0.8, 2.4, 0.8],
                      opacity: [0.65, 0, 0.65],
                    }}
                    transition={{
                      duration: 2.4,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    className="absolute inset-0 -m-2.5 w-8 h-8 rounded-full border border-[#E69D2B]/60 pointer-events-none"
                  />

                  <motion.div
                    animate={{
                      opacity: [0.15, 1, 0.15],
                      scale: [0.85, 1.25, 0.85],
                      boxShadow: [
                        '0 0 6px rgba(230,157,43,0.3)',
                        '0 0 20px rgba(230,157,43,0.95)',
                        '0 0 6px rgba(230,157,43,0.3)',
                      ],
                    }}
                    transition={{
                      duration: 2.2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    className="w-3.5 h-3.5 rounded-full bg-[#E69D2B]"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* RIGHT COLUMN: EDITORIAL QUOTE */}
        <motion.div
          style={{ y: quoteY }}
          className="lg:col-span-7 space-y-6 sm:space-y-8 lg:pl-4 will-change-transform"
        >
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-3"
          >
            <span className="w-6 h-[1.5px] bg-[#E69D2B]" />
            <span className="text-xs font-semibold tracking-[0.2em] text-[#E69D2B] uppercase font-sans">
              {pipelineData.eyebrow || DEFAULT_PIPELINE.eyebrow}
            </span>
          </motion.div>

          <div className="relative">
            <motion.h2
              initial={{ opacity: 0, y: 28, filter: 'blur(8px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-3xl sm:text-4xl lg:text-[42px] xl:text-[46px] font-bold text-white tracking-[-0.025em] leading-[1.3] sm:leading-[1.28] lg:leading-[1.24] font-sans"
            >
              “{pipelineData.quotePrefix || DEFAULT_PIPELINE.quotePrefix}{' '}
              <span className="text-[#E69D2B]">
                {pipelineData.quoteHighlight || DEFAULT_PIPELINE.quoteHighlight}
              </span>{' '}
              {pipelineData.quoteSuffix || DEFAULT_PIPELINE.quoteSuffix}”
            </motion.h2>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="pt-6 sm:pt-7 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-4 items-start"
          >
            {pillars.map((pillar, idx) => (
              <div
                key={idx}
                className={`space-y-1 ${idx > 0 ? 'sm:border-l sm:border-white/10 sm:pl-6' : ''}`}
              >
                <h4
                  className={`text-sm sm:text-base font-bold font-sans ${
                    idx === 1 ? 'text-[#E69D2B]' : 'text-white'
                  }`}
                >
                  {pillar.title}
                </h4>
                <p className="text-slate-400 text-xs sm:text-[13px] font-sans leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
