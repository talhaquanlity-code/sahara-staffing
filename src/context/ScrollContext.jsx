import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ScrollContext = createContext(null);

export function ScrollProvider({ children }) {
  const [lenis, setLenis] = useState(null);
  const lenisRef = useRef(null);

  useEffect(() => {
    // 1. Initialize Lenis Smooth Scroll
    const l = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.8,
    });

    lenisRef.current = l;
    setLenis(l);

    // 2. Synchronize Lenis with GSAP ScrollTrigger
    l.on('scroll', ScrollTrigger.update);

    const updateTicker = (time) => {
      l.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);
    // Smooth lag smoothing to prevent scroll hitching
    gsap.ticker.lagSmoothing(500, 33);

    // 3. Smooth scrolling for internal anchor clicks
    const handleAnchorClick = (e) => {
      const anchor = e.target.closest('a[href^="#"]');
      if (anchor) {
        const targetId = anchor.getAttribute('href');
        if (targetId && targetId !== '#') {
          const targetEl = document.querySelector(targetId);
          if (targetEl) {
            e.preventDefault();
            l.scrollTo(targetEl, { offset: -30, duration: 1.2 });
          }
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);

    // 4. Disable Lenis on Admin route so nested dashboard panels scroll naturally
    const checkAdminRoute = () => {
      const isHashAdmin = window.location.hash.toLowerCase().includes('admin');
      const isPathAdmin = window.location.pathname.toLowerCase().includes('admin');
      const hasAdminAttr = !!document.querySelector('[data-lenis-prevent]');
      if (isHashAdmin || isPathAdmin || hasAdminAttr) {
        l.stop();
      } else {
        l.start();
      }
    };

    checkAdminRoute();
    window.addEventListener('hashchange', checkAdminRoute);
    window.addEventListener('popstate', checkAdminRoute);

    // Clean up
    return () => {
      document.removeEventListener('click', handleAnchorClick);
      window.removeEventListener('hashchange', checkAdminRoute);
      window.removeEventListener('popstate', checkAdminRoute);
      gsap.ticker.remove(updateTicker);
      l.destroy();
    };
  }, []);

  const scrollTo = (target, options = {}) => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(target, { offset: -30, duration: 1.2, ...options });
    }
  };

  const resetScrollToTop = () => {
    const l = lenisRef.current;
    const isAdmin =
      window.location.hash.toLowerCase().includes('admin') ||
      window.location.pathname.toLowerCase().includes('admin');

    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    if (l) {
      if (!isAdmin) {
        l.start();
      }
      l.scrollTo(0, { immediate: true, force: true });
      l.resize();
    }
  };

  return (
    <ScrollContext.Provider value={{ lenis, scrollTo, resetScrollToTop }}>
      {children}
    </ScrollContext.Provider>
  );
}

export function useScroll() {
  const context = useContext(ScrollContext);
  return context || { lenis: null, scrollTo: () => {}, resetScrollToTop: () => {} };
}

