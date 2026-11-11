import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useCMS } from '../context/CMSContext';
import logoImg from '../assets/sahara-logo.webp';

export default function Header({ onNavigate, currentRoute = 'home' }) {
  const { content, settings } = useCMS();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const brandLogo = settings?.brandLogoUrl || logoImg;
  const companyName = settings?.companyName || 'Sahara Staffing Inc.';
  const navConfig = content?.navbar || {};
  const navLinks =
    Array.isArray(navConfig.links) && navConfig.links.length > 0
      ? navConfig.links
      : [
          { id: 'home', label: 'Home' },
          { id: 'about', label: 'About Us' },
          { id: 'services', label: 'Services' },
          { id: 'contact', label: 'Contact' },
        ];
  const ctaLabel = navConfig.ctaLabel || 'Join us';

  // Other than homepage, navbar has fixed floating positioning.
  // On homepage, obeys global settings.stickyNavbar toggle (defaults to false / non-sticky)
  const isFixed = currentRoute !== 'home';
  const isStickyNavbar = Boolean(settings?.stickyNavbar);

  const handleNav = (route, anchorFallback) => {
    const targetRoute = route === 'executive-search' ? 'services' : route;
    if (onNavigate) {
      onNavigate(targetRoute);
    } else if (anchorFallback) {
      const el = document.querySelector(anchorFallback);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      else window.location.hash = targetRoute;
    } else {
      window.location.hash = targetRoute;
    }
  };

  return (
    <header
      className={`z-50 w-full transition-all duration-300 ${
        isFixed
          ? 'fixed top-0 inset-x-0 pt-4 sm:pt-6 pointer-events-auto'
          : isStickyNavbar
          ? 'sticky top-0 inset-x-0 pt-4 pb-2 z-50 backdrop-blur-md bg-[#0B0F17]/40 max-w-[1400px] mx-auto px-4 sm:px-8'
          : 'fixed top-0 inset-x-0 pt-3 z-50 pointer-events-none md:pointer-events-auto md:relative md:top-auto md:inset-auto md:max-w-[1400px] md:mx-auto md:px-8 md:pt-6'
      }`}
    >
      {/* ========================================================================= */}
      {/* MOBILE STICKY FLOATING PILL (< md)                                        */}
      {/* ========================================================================= */}
      <div className="md:hidden sticky top-4 z-50 flex items-center justify-between px-4 py-2 mx-4 rounded-full bg-[#0B0F17]/85 backdrop-blur-md border border-slate-800 shadow-xl transition-all duration-300 pointer-events-auto">
        {/* Left: Sahara Logo */}
        <button
          type="button"
          onClick={() => handleNav('home', '#')}
          className="flex items-center focus:outline-none cursor-pointer"
          aria-label={`${companyName} Home`}
        >
          <img
            src={brandLogo}
            alt={companyName}
            loading="eager"
            decoding="async"
            className="h-6 w-auto object-contain drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)]"
          />
        </button>

        {/* Right Actions: CTA | Hamburger Toggle */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => handleNav('contact')}
            className="bg-saharaGold hover:bg-saharaGoldLight text-obsidian font-semibold text-xs px-4 py-1.5 rounded-full transition-all shadow-md active:scale-95 cursor-pointer focus:outline-none whitespace-nowrap"
          >
            {ctaLabel}
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-8 h-8 rounded-full bg-slateCard/90 hover:bg-slateCard hover:text-saharaGold flex items-center justify-center text-white transition-colors cursor-pointer border border-white/5 active:scale-95 focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* DESKTOP 3-PART SYMMETRICAL NAVBAR (md+) — STRICTLY UNTOUCHED              */}
      {/* ========================================================================= */}
      <div
        className={`hidden md:flex w-full max-w-[1400px] mx-auto items-center justify-between gap-4 ${
          isFixed ? 'px-8' : ''
        }`}
      >
        {/* PART 1: LEFT — SAHARA LOGO */}
        <div className="flex items-center">
          <button
            type="button"
            onClick={() => handleNav('home', '#')}
            className={`flex items-center group cursor-pointer focus:outline-none transition-all duration-300 ${
              isFixed
                ? 'bg-[#0B0F17]/85 backdrop-blur-xl border border-white/10 rounded-full px-5 py-3 shadow-2xl hover:border-white/20 hover:bg-[#0B0F17]/95 active:scale-95'
                : ''
            }`}
            aria-label={`${companyName} Home`}
          >
            <img
              src={brandLogo}
              alt={companyName}
              loading="eager"
              decoding="async"
              className="h-8 w-auto object-contain transition-transform duration-300 group-hover:scale-105 drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)]"
            />
          </button>
        </div>

        {/* PART 2: CENTER PILL */}
        <nav className="flex items-center gap-7 lg:gap-8 xl:gap-9 bg-[#0B0F17]/85 backdrop-blur-xl border border-white/10 rounded-full px-8 lg:px-10 py-4 shadow-2xl text-[13px] font-medium text-white/85 transition-all">
          {navLinks.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() =>
                handleNav(
                  item.id,
                  item.id === 'home' ? '#' : item.id === 'services' ? '#payment-section' : undefined
                )
              }
              className={`transition-colors tracking-wide cursor-pointer focus:outline-none ${
                currentRoute === item.id ? 'text-saharaGold font-semibold' : 'hover:text-saharaGold'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* PART 3: RIGHT PILL */}
        <div className="flex items-center bg-[#0B0F17]/85 backdrop-blur-xl border border-white/10 rounded-full p-2 shadow-2xl shrink-0">
          <button
            type="button"
            onClick={() => handleNav('contact')}
            className="bg-saharaGold hover:bg-saharaGoldLight text-obsidian font-semibold text-[13px] px-8 py-2.5 min-w-[120px] rounded-full transition-all shadow-md active:scale-95 cursor-pointer focus:outline-none whitespace-nowrap text-center"
          >
            {ctaLabel}
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MOBILE DRAWER MENU                                                        */}
      {/* ========================================================================= */}
      {mobileMenuOpen && (
        <div className="pointer-events-auto absolute top-20 right-4 left-4 bg-[#0B0F17]/95 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 shadow-2xl flex flex-col gap-3 text-center z-50 md:hidden animate-in fade-in slide-in-from-top-2">
          {navLinks.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                handleNav(
                  item.id,
                  item.id === 'home' ? '#' : item.id === 'services' ? '#payment-section' : undefined
                );
              }}
              className={`text-sm py-2 transition-colors border-b border-white/5 cursor-pointer ${
                currentRoute === item.id ? 'text-saharaGold font-bold' : 'text-white hover:text-saharaGold'
              }`}
            >
              {item.label}
            </button>
          ))}

          <div className="flex flex-col gap-2 pt-2">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                handleNav('contact');
              }}
              className="w-full py-2.5 rounded-full bg-saharaGold text-obsidian text-xs font-bold hover:bg-saharaGoldLight transition-colors cursor-pointer"
            >
              {ctaLabel}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
