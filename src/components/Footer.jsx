import React from 'react';
import { Linkedin, Twitter, Instagram, Mail, Github, ArrowRight } from 'lucide-react';
import { useUI } from '../context/UIContext';
import { useCMS } from '../context/CMSContext';
import logoImg from '../assets/sahara-logo.webp';

export default function Footer({ onNavigate }) {
  const { showToast } = useUI();
  const cms = useCMS();
  const content = cms?.content;
  const settings = cms?.settings;

  const brandLogo = settings?.brandLogoUrl || logoImg;
  const companyName = settings?.companyName || 'Sahara Staffing Inc.';
  const footerData = content?.home?.footer || content?.footer || {};
  const footerCopyright =
    settings?.footerCopyright ||
    footerData?.copyright ||
    '© 2026 Sahara Staffing Inc. All rights reserved.';
  const brandTagline =
    footerData?.brandTagline ||
    'Enterprise Staffing & Executive Search Solutions. Connecting ambitious enterprises with top-tier technical contractors and executive leadership.';
  const ctaExploreLabel = footerData?.ctaExploreLabel || 'Explore Services';
  const officeTitle = footerData?.officeTitle || 'STAFFING OPERATIONS';
  const officeDesc =
    footerData?.officeDesc ||
    'Dedicated talent partners for enterprise contractor placement, direct hire, and executive search.';

  const showFooterEmail = settings?.showFooterEmail !== false;
  const contactEmail =
    settings?.footerContactEmail ||
    footerData?.contactEmail ||
    settings?.recipientEmail ||
    'contact@sahara-staffing.com';

  // Dynamic social links from settings or CMS content
  const rawSocials =
    settings?.footerSocials ||
    footerData?.socialLinks || [
      { id: 'soc-1', platform: 'linkedin', label: 'LinkedIn', url: 'https://linkedin.com', enabled: true },
      { id: 'soc-2', platform: 'email', label: 'Email', url: 'mailto:contact@sahara-staffing.com', enabled: true },
    ];

  const activeSocials = rawSocials
    .map((s) => {
      const plat = (s.platform || '').toLowerCase();
      if (plat === 'linkedin' && settings?.footerLinkedinUrl) {
        return { ...s, url: settings.footerLinkedinUrl };
      }
      if (plat === 'email' || plat === 'mail') {
        return { ...s, url: `mailto:${contactEmail}`, enabled: showFooterEmail && s.enabled !== false };
      }
      return s;
    })
    .filter((s) => s.enabled !== false);

  const getPlatformIcon = (platform) => {
    switch ((platform || '').toLowerCase()) {
      case 'linkedin':
        return Linkedin;
      case 'twitter':
      case 'x':
        return Twitter;
      case 'instagram':
        return Instagram;
      case 'github':
        return Github;
      case 'email':
      case 'mail':
      default:
        return Mail;
    }
  };

  const navLinks = [
    {
      label: 'Home',
      onClick: () => (onNavigate ? onNavigate('home') : (window.location.hash = 'home')),
    },
    {
      label: 'About Us',
      onClick: () => (onNavigate ? onNavigate('about') : (window.location.hash = 'about')),
    },
    {
      label: 'Services',
      onClick: () => (onNavigate ? onNavigate('services') : (window.location.hash = 'services')),
    },
    {
      label: 'Contact',
      onClick: () => (onNavigate ? onNavigate('contact') : (window.location.hash = 'contact')),
    },
  ];

  return (
    <footer className="w-full">
      {/* Sleek Dark Card Shell: Compact py-8 px-6 on mobile (< md), spacious on desktop */}
      <div className="w-full bg-[#090D14] text-white rounded-[24px] sm:rounded-[36px] lg:rounded-[44px] py-8 px-6 md:p-12 lg:p-14 shadow-2xl border border-white/[0.08]">
        {/* ===================================================================== */}
        {/* 1. COMPACT MOBILE FOOTER (< md): TOTAL HEIGHT < 280px                 */}
        {/* ===================================================================== */}
        <div className="block md:hidden text-center space-y-3.5">
          {/* Brand Logo */}
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => (onNavigate ? onNavigate('home') : (window.location.hash = 'home'))}
              className="inline-block cursor-pointer focus:outline-none"
              aria-label={`${companyName} Home`}
            >
              <img
                src={brandLogo}
                alt={companyName}
                loading="lazy"
                decoding="async"
                className="h-6 w-auto object-contain"
              />
            </button>
          </div>

          {/* Single-Row Horizontal Navigation */}
          <nav className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xs font-medium text-white/85">
            <button
              type="button"
              onClick={() => (onNavigate ? onNavigate('home') : (window.location.hash = 'home'))}
              className="hover:text-[#E69D2B] transition-colors cursor-pointer"
            >
              Home
            </button>
            <span className="text-white/20">•</span>
            <button
              type="button"
              onClick={() => (onNavigate ? onNavigate('about') : (window.location.hash = 'about'))}
              className="hover:text-[#E69D2B] transition-colors cursor-pointer"
            >
              About Us
            </button>
            <span className="text-white/20">•</span>
            <button
              type="button"
              onClick={() => (onNavigate ? onNavigate('services') : (window.location.hash = 'services'))}
              className="hover:text-[#E69D2B] transition-colors cursor-pointer"
            >
              Services
            </button>
            <span className="text-white/20">•</span>
            <button
              type="button"
              onClick={() => (onNavigate ? onNavigate('contact') : (window.location.hash = 'contact'))}
              className="hover:text-[#E69D2B] transition-colors cursor-pointer"
            >
              Contact
            </button>
          </nav>

          {/* Social Icons in Clean Horizontal Row */}
          <div className="flex items-center justify-center gap-2 pt-1">
            {activeSocials.map((social) => {
              const IconComponent = getPlatformIcon(social.platform);
              return (
                <a
                  key={social.id || social.platform}
                  href={social.url}
                  target={social.url?.startsWith('http') ? '_blank' : undefined}
                  rel={social.url?.startsWith('http') ? 'noopener noreferrer' : undefined}
                  aria-label={social.label || social.platform}
                  title={social.label || social.platform}
                  className="w-8 h-8 rounded-full bg-white/[0.05] hover:bg-[#E69D2B] text-white/85 hover:text-[#0B0F17] flex items-center justify-center transition-all duration-200 active:scale-95 border border-white/[0.08] cursor-pointer"
                >
                  <IconComponent className="w-3.5 h-3.5" />
                </a>
              );
            })}
          </div>

          {/* Direct Contact Email Link */}
          <div>
            <a
              href={`mailto:${contactEmail}`}
              className="text-xs text-[#E69D2B] hover:underline font-mono tracking-tight"
            >
              {contactEmail}
            </a>
          </div>

          {/* Compact Copyright + Legal Links */}
          <div className="pt-3 border-t border-white/[0.07] flex flex-col items-center gap-1.5 text-[11px] text-[#64748B]">
            <span>{footerCopyright}</span>
            <div className="flex items-center gap-3 text-[11px] text-[#94A3B8]/60">
              <button
                type="button"
                onClick={() => showToast('Privacy Policy: Contact contact@sahara-staffing.com for details.')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Privacy Policy
              </button>
              <span className="text-white/20">•</span>
              <button
                type="button"
                onClick={() => showToast('Terms of Service: Standard enterprise engagement agreements apply.')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Terms of Service
              </button>
            </div>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* 2. FULL DESKTOP FOOTER (md+): STRICTLY UNTOUCHED                      */}
        {/* ===================================================================== */}
        <div className="hidden md:block">
          {/* Top Row: Brand & Navigation Links */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 pb-8 sm:pb-14">
            {/* Left Brand Block */}
            <div className="lg:col-span-5 space-y-3 sm:space-y-3.5">
              {/* Real Official Sahara Staffing Logo */}
              <button
                type="button"
                onClick={() => (onNavigate ? onNavigate('home') : (window.location.hash = 'home'))}
                className="inline-block group cursor-pointer focus:outline-none text-left"
                aria-label={`${companyName} Home`}
              >
                <img
                  src={brandLogo}
                  alt={companyName}
                  loading="lazy"
                  decoding="async"
                  className="h-7 sm:h-9 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                />
              </button>

              {/* Brand Tagline */}
              <p className="text-[12px] sm:text-[13px] text-[#94A3B8]/75 leading-[1.65] max-w-[330px] font-normal tracking-[-0.01em]">
                {brandTagline}
              </p>

              <div className="pt-1 flex flex-wrap items-center gap-x-3.5 gap-y-2">
                <button
                  type="button"
                  onClick={() => (onNavigate ? onNavigate('services') : (window.location.hash = 'services'))}
                  className="inline-flex items-center gap-1.5 text-[11.5px] sm:text-[12px] font-medium text-[#E69D2B] hover:text-[#F6C467] hover:underline transition-colors group tracking-wide focus:outline-none cursor-pointer"
                >
                  <span>{ctaExploreLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </button>
                <span className="text-white/20 hidden sm:inline">•</span>
                <button
                  type="button"
                  onClick={() => (onNavigate ? onNavigate('about') : (window.location.hash = 'about'))}
                  className="inline-flex items-center gap-1.5 text-[11.5px] sm:text-[12px] font-medium text-white/70 hover:text-[#E69D2B] hover:underline transition-colors group tracking-wide focus:outline-none cursor-pointer"
                >
                  <span>About Sahara</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>

            {/* Right Navigation Links (Top-Right) */}
            <div className="lg:col-span-7 flex flex-wrap items-center justify-start lg:justify-end gap-x-6 sm:gap-x-9 gap-y-2.5 text-[12.5px] sm:text-[13px] font-normal text-white/80 self-start pt-1 sm:pt-1.5">
              {navLinks.map((item) =>
                item.onClick ? (
                  <button
                    key={item.label}
                    onClick={item.onClick}
                    className="hover:text-[#E69D2B] transition-colors focus:outline-none cursor-pointer"
                  >
                    {item.label}
                  </button>
                ) : (
                  <a
                    key={item.label}
                    href={item.href}
                    className="hover:text-[#E69D2B] transition-colors"
                  >
                    {item.label}
                  </a>
                )
              )}
            </div>
          </div>

          {/* Bottom Row: Socials, Copyright, Contact Info & Legal Links */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 lg:gap-10 pt-6 sm:pt-9 border-t border-white/[0.07] items-start">
            {/* Left Column: Social Media Row & Copyright String */}
            <div className="md:col-span-4 space-y-3 sm:space-y-3.5">
              {/* Horizontal Flex Row of Round Dynamic Icon Buttons */}
              <div className="flex items-center gap-2">
                {activeSocials.map((social) => {
                  const IconComponent = getPlatformIcon(social.platform);
                  return (
                    <a
                      key={social.id || social.platform}
                      href={social.url}
                      target={social.url?.startsWith('http') ? '_blank' : undefined}
                      rel={social.url?.startsWith('http') ? 'noopener noreferrer' : undefined}
                      aria-label={social.label || social.platform}
                      title={social.label || social.platform}
                      className="w-[32px] h-[32px] sm:w-[34px] sm:h-[34px] rounded-full bg-white/[0.05] hover:bg-[#E69D2B] text-white/85 hover:text-[#0B0F17] flex items-center justify-center transition-all duration-200 active:scale-95 border border-white/[0.08] hover:border-[#E69D2B] cursor-pointer"
                    >
                      <IconComponent className="w-3.5 h-3.5" />
                    </a>
                  );
                })}
              </div>

              <div className="text-[11px] text-[#64748B] leading-relaxed font-normal tracking-tight flex items-center gap-2">
                <span>{footerCopyright}</span>
                <button
                  type="button"
                  onClick={() => {
                    try {
                      sessionStorage.removeItem('sahara_admin_session_v2');
                    } catch {}
                    window.dispatchEvent(new CustomEvent('sahara:admin-login-redirect'));
                    if (onNavigate) onNavigate('admin');
                    else window.location.hash = 'admin';
                  }}
                  title="Admin Portal"
                  className="text-[#64748B]/50 hover:text-[#E69D2B] transition-colors p-0.5 cursor-pointer"
                  aria-label="Admin Access Portal"
                >
                  &bull;
                </button>
              </div>
            </div>

            {/* Middle Column: Direct Inquiries & Response SLA */}
            <div className="md:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
              <div>
                <div className="text-[10.5px] font-semibold text-white/90 tracking-[0.08em] uppercase mb-1 sm:mb-1.5">
                  {officeTitle}
                </div>
                <div className="space-y-0.5 text-[11.5px] sm:text-[12px] text-[#94A3B8]/75 leading-relaxed">
                  {showFooterEmail && (
                    <div>
                      <a
                        href={`mailto:${contactEmail}`}
                        className="hover:text-[#E69D2B] transition-colors font-mono"
                      >
                        {contactEmail}
                      </a>
                    </div>
                  )}
                  <div className="text-[#64748B] text-[11px]">
                    {officeDesc}
                  </div>
                </div>
              </div>

              <div>
                <div className="text-[10.5px] font-semibold text-white/90 tracking-[0.08em] uppercase mb-1 sm:mb-1.5">
                  Service Level Agreement
                </div>
                <div className="text-[11.5px] sm:text-[12px] text-[#94A3B8]/75 leading-relaxed">
                  <div>Rapid 2-Hour Response Window</div>
                  <div className="text-[#64748B] text-[11px]">Direct Senior Partner Oversight</div>
                </div>
              </div>
            </div>

            {/* Right Column: Quick Legal Links */}
            <div className="md:col-span-3 flex md:justify-end items-start pt-1">
              <div className="flex flex-wrap items-center gap-x-3.5 gap-y-1 text-[11px] sm:text-[11.5px] text-[#94A3B8]/60 md:text-right">
                <button
                  type="button"
                  onClick={() => showToast('Privacy Policy: Contact contact@sahara-staffing.com for details.')}
                  className="hover:text-white transition-colors focus:outline-none cursor-pointer"
                >
                  Privacy Policy
                </button>
                <span className="text-white/20">•</span>
                <button
                  type="button"
                  onClick={() => showToast('Terms of Service: Standard enterprise engagement agreements apply.')}
                  className="hover:text-white transition-colors focus:outline-none cursor-pointer"
                >
                  Terms of Service
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}