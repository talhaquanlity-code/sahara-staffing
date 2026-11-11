import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Check,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Eye,
  Loader2,
  Upload,
  Image as ImageIcon,
  Link as LinkIcon,
  RotateCcw,
  Monitor,
  Smartphone,
  Lock,
  RefreshCw,
  ExternalLink,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  AlertCircle,
  X,
  Home,
  Info,
  Briefcase,
  PhoneCall,
  Settings as SettingsIcon,
  MousePointer,
  ArrowUpCircle,
  Layers,
  Palette,
  CheckCircle2,
  Edit3,
  LayoutGrid,
} from 'lucide-react';
import { useCMS, CMSPreviewProvider } from '../../context/CMSContext';

// Import public site components for real-time live preview rendering
import Header from '../Header';
import Hero from '../Hero';
import SocialProofMarquee from '../SocialProofMarquee';
import BentoGrowthCapital from '../BentoGrowthCapital';
import VettingProcess from '../VettingProcess';
import Calculator from '../Calculator';
import Testimonials from '../Testimonials';
import FAQ from '../FAQ';
import SpeakToExperts from '../SpeakToExperts';
import Footer from '../Footer';

// Import subpages for preview navigation
import AboutPage from '../../pages/AboutPage';
import ServicesPage from '../../pages/ServicesPage';
import ContactPage from '../../pages/ContactPage';


// ---------------------------------------------------------------------------
// INTERACTIVE SECTION WRAPPER WITH HOVER HIGHLIGHTS & CLICK-TO-EDIT
// ---------------------------------------------------------------------------
function EditableSection({
  blockId,
  blockNumber,
  blockTitle,
  children,
  activeBlock,
  isDrawerOpen,
  onSelectBlock,
}) {
  const [isHovered, setIsHovered] = useState(false);
  const isSelected = isDrawerOpen && activeBlock === blockId;

  return (
    <div
      id={blockId}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onSelectBlock(blockId);
      }}
      className={`relative transition-all duration-150 cursor-pointer group ${
        isSelected
          ? 'outline outline-2 outline-[#E69D2B] outline-offset-[-2px] shadow-[0_0_30px_rgba(230,157,43,0.3)] z-20'
          : isHovered
          ? 'outline outline-2 outline-[#E69D2B] outline-offset-[-2px] shadow-[0_0_20px_rgba(230,157,43,0.2)] z-10'
          : ''
      }`}
    >
      <AnimatePresence>
        {(isHovered || isSelected) && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-3 left-3 z-30 flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#0B0F17]/95 border border-[#E69D2B] text-white shadow-2xl pointer-events-none"
          >
            <span className="w-2 h-2 rounded-full bg-[#E69D2B] animate-pulse" />
            <span className="text-xs font-bold font-mono text-[#E69D2B]">
              âœï¸ Edit Block {blockNumber}: {blockTitle}
            </span>
            <span className="text-[10px] text-white/70 font-sans hidden sm:inline">
              (Click to edit)
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// TRUE 375PX MOBILE PREVIEW IFRAME ENGINE (React Portal & Isolated Head CSS)
// ---------------------------------------------------------------------------
function MobilePreviewIframe({ children }) {
  const iframeRef = useRef(null);
  const [mountNode, setMountNode] = useState(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const setupIframe = () => {
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!doc) return;

      const syncStyles = () => {
        doc.head.innerHTML = '';

        // Inject base mobile reset styles & disable button navigation
        const baseStyle = doc.createElement('style');
        baseStyle.textContent = `
          *, *::before, *::after {
            box-sizing: border-box;
          }
          html, body {
            margin: 0;
            padding: 0;
            background-color: #0B0F17;
            overflow-x: hidden;
            width: 100%;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
          /* Custom scrollbar */
          ::-webkit-scrollbar {
            width: 4px;
          }
          ::-webkit-scrollbar-track {
            background: #0B0F17;
          }
          ::-webkit-scrollbar-thumb {
            background: #E69D2B;
            border-radius: 9999px;
          }
          /* Disable live preview button & link navigation */
          button, a, [role="button"] {
            pointer-events: none !important;
            cursor: pointer !important;
          }
        `;
        doc.head.appendChild(baseStyle);

        // Copy parent styles & link stylesheets
        const parentStyles = document.querySelectorAll('style, link[rel="stylesheet"], link[rel="preconnect"]');
        parentStyles.forEach((el) => {
          doc.head.appendChild(el.cloneNode(true));
        });
      };

      syncStyles();

      const observer = new MutationObserver(() => syncStyles());
      observer.observe(document.head, { childList: true, subtree: true });

      setMountNode(doc.body);

      return () => observer.disconnect();
    };

    if (iframe.contentDocument?.readyState === 'complete') {
      setupIframe();
    } else {
      iframe.addEventListener('load', setupIframe);
      return () => iframe.removeEventListener('load', setupIframe);
    }
  }, []);

  return (
    <iframe
      ref={iframeRef}
      title="Sahara Staffing Inc. Mobile Live Viewport"
      className="w-full h-full border-0 block bg-[#0B0F17] rounded-[38px] overflow-y-auto"
      style={{ border: 'none' }}
    >
      {mountNode && createPortal(children, mountNode)}
    </iframe>
  );
}

// ---------------------------------------------------------------------------
// SECTION PILLS CONFIGURATION (FOR BOTTOM QUICK-JUMP BAR)
// ---------------------------------------------------------------------------
const SECTION_PILLS = {
  home: [
    { id: 'home-block-01', num: '01', label: 'Hero & Navbar', anchor: '#hero-section' },
    { id: 'home-block-02', num: '02', label: 'Partners & Metrics', anchor: '#metrics-section' },
    { id: 'home-block-03', num: '03', label: 'Bento Solutions', anchor: '#capital-section' },
    { id: 'home-block-04', num: '04', label: 'Scroll-Hijacked Narrative', anchor: '#process-story' },
    { id: 'home-block-05', num: '05', label: 'Value Estimator', anchor: '#staffing-momentum' },
    { id: 'home-block-06', num: '06', label: 'Testimonials', anchor: '#testimonials-section' },
    { id: 'home-block-07', num: '07', label: 'FAQ', anchor: '#faq-section' },
    { id: 'home-block-08', num: '08', label: 'CTA & Footer', anchor: '#footer-section' },
  ],
  about: [
    { id: 'about-block-01', num: '01', label: 'About Hero', anchor: '#about-hero' },
    { id: 'about-block-02', num: '02', label: 'Perspective & Values', anchor: '#about-benchmarks' },
    { id: 'about-block-03', num: '03', label: 'Mindset Chapters', anchor: '#about-mindset' },
    { id: 'about-block-04', num: '04', label: 'Scale Stats & Philosophy', anchor: '#about-stats' },
    { id: 'about-block-05', num: '05', label: 'Final CTA', anchor: '#about-final-cta' },
  ],
  services: [
    { id: 'services-block-01', num: '01', label: 'Services Hero', anchor: '#services-hero' },
    { id: 'services-block-02', num: '02', label: 'Service Cards', anchor: '#services-capabilities' },
    { id: 'services-block-03', num: '03', label: 'Our Approach', anchor: '#services-sla' },
    { id: 'services-block-04', num: '04', label: 'Closing CTA', anchor: '#services-sla' },
  ],
  contact: [
    { id: 'contact-block-01', num: '01', label: 'Contact Intake', anchor: '#contact-workspace' },
  ],
  settings: [
    { id: 'global-settings', num: 'âš™ï¸', label: 'Site Utilities', anchor: '#global-settings' },
  ],
};

export default function CMSWorkspace({
  onToggleSidebar,
  onOpenMobileMenu,
  sidebarCollapsed,
  onOpenAdditionalSettings,
}) {
  const {
    draftContent,
    content: publishedContent,
    settings,
    updateDraft,
    updateSettings,
    publishChanges,
    discardDraft,
    hasUnsavedChanges,
    publishStatus,
    publishMessage,
  } = useCMS();

  // =========================================================================
  // 1. TOP PAGE TAB SWITCHER STATE
  // 'home' | 'about' | 'services' | 'contact' | 'settings'
  // =========================================================================
  const [activePageTab, setActivePageTab] = useState('home');
  const [expandedStageIdx, setExpandedStageIdx] = useState(0);

  // Set of currently expanded block IDs inside the drawer
  const [expandedBlocks, setExpandedBlocks] = useState(() => new Set(['home-block-01']));

  // Active focused section block (for outline highlight in preview canvas)
  const [activeBlock, setActiveBlock] = useState('home-block-01');

  // Right Section Block Editor Drawer state (docked open by default on desktop)
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);

  // Preview viewport mode: 'desktop' (True 1440px Scaled) | 'mobile' (Phone 375px)
  const [viewportMode, setViewportMode] = useState('desktop');

  // Center Stage & Preview Sizing Refs
  const stageRef = useRef(null);
  const previewScrollRef = useRef(null);
  const contentRef = useRef(null);
  const drawerScrollRef = useRef(null);
  const [stageWidth, setStageWidth] = useState(1100);
  const [stageHeight, setStageHeight] = useState(760);
  const [contentHeight, setContentHeight] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [previewKey, setPreviewKey] = useState(0);
  const [dragOverKey, setDragOverKey] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);

  // Track Center Stage dimensions for responsive Desktop & Mobile chassis scaling
  useEffect(() => {
    if (!stageRef.current) return;
    const updateSize = () => {
      if (stageRef.current) {
        setStageWidth(stageRef.current.clientWidth);
        setStageHeight(stageRef.current.clientHeight);
      }
    };
    updateSize();
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 0) {
          setStageWidth(entry.contentRect.width);
        }
        if (entry.contentRect.height > 0) {
          setStageHeight(entry.contentRect.height);
        }
      }
    });
    ro.observe(stageRef.current);
    return () => ro.disconnect();
  }, [isDrawerOpen]);

  // Scaled desktop math: Fits true 1440px desktop frame cleanly inside stage at any viewport width
  const desktopScale = Math.min(1, Math.max(0.24, (stageWidth - 48) / 1440));
  // Scaled mobile phone chassis math: Fits the entire 395x790 phone mockup visibly inside stage
  const mobileScale = Math.min(
    1,
    Math.max(0.45, Math.min((stageWidth - 36) / 395, (stageHeight - 80) / 790))
  );

  // Track rendered content height
  useEffect(() => {
    if (!contentRef.current) return;
    const updateHeight = () => {
      if (contentRef.current) {
        setContentHeight(contentRef.current.scrollHeight || contentRef.current.offsetHeight);
      }
    };
    updateHeight();
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.height > 0) {
          setContentHeight(entry.contentRect.height);
        }
      }
    });
    ro.observe(contentRef.current);
    return () => ro.disconnect();
  }, [activePageTab, previewKey, draftContent]);

  const isBlockExpanded = (blockId) => expandedBlocks.has(blockId);

  const getBlocksForPage = (pageTab) => {
    switch (pageTab) {
      case 'home':
        return [
          'home-block-01',
          'home-block-02',
          'home-block-03',
          'home-block-04',
          'home-block-05',
          'home-block-06',
          'home-block-07',
          'home-block-08',
        ];
      case 'about':
        return [
          'about-block-01',
          'about-block-02',
          'about-block-03',
          'about-block-04',
          'about-block-05',
        ];
      case 'services':
        return [
          'services-block-01',
          'services-block-02',
          'services-block-03',
          'services-block-04',
          'services-block-05',
        ];
      case 'contact':
        return ['contact-block-01'];
      case 'settings':
        return ['global-settings'];
      default:
        return [];
    }
  };

  const expandAllBlocks = () => {
    const blocks = getBlocksForPage(activePageTab);
    setExpandedBlocks(new Set(blocks));
  };

  const collapseAllBlocks = () => {
    setExpandedBlocks(new Set());
  };

  // Smooth scroll center preview canvas to element anchor with transform math
  const scrollToPreviewAnchor = (domAnchorId) => {
    if (!domAnchorId || !previewScrollRef.current) return;
    setTimeout(() => {
      try {
        const container = previewScrollRef.current;
        const el = container.querySelector(domAnchorId);
        if (el) {
          const containerRect = container.getBoundingClientRect();
          const elRect = el.getBoundingClientRect();
          const delta = elRect.top - containerRect.top;
          const targetScrollTop = container.scrollTop + delta - 20;
          container.scrollTo({
            top: Math.max(0, targetScrollTop),
            behavior: 'smooth',
          });
        }
      } catch (err) {
        console.warn('Scroll anchor calculation error:', err);
      }
    }, 80);
  };

  const openBlockDrawer = (blockId, domAnchorId) => {
    setActiveBlock(blockId);
    setExpandedBlocks((prev) => new Set(prev).add(blockId));
    if (!isDrawerOpen) setIsDrawerOpen(true);
    scrollToPreviewAnchor(domAnchorId);
    setTimeout(() => {
      const editorEl = document.getElementById(`editor-${blockId}`);
      if (editorEl) {
        editorEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 100);
  };

  const handlePillClick = (pill) => {
    setActiveBlock(pill.id);
    setExpandedBlocks((prev) => new Set(prev).add(pill.id));
    if (!isDrawerOpen) setIsDrawerOpen(true);
    scrollToPreviewAnchor(pill.anchor);
    setTimeout(() => {
      const editorEl = document.getElementById(`editor-${pill.id}`);
      if (editorEl) {
        editorEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 100);
  };

  const handleBlockToggle = (blockId, domAnchorId) => {
    setExpandedBlocks((prev) => {
      const next = new Set(prev);
      if (next.has(blockId)) {
        next.delete(blockId);
      } else {
        next.add(blockId);
      }
      return next;
    });
    setActiveBlock(blockId);
    scrollToPreviewAnchor(domAnchorId);
  };

  const noOp = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (e && e.stopPropagation) e.stopPropagation();
  };

  const getBlockTitle = (blockId) => {
    switch (blockId) {
      case 'home-block-01': return 'Block 01: Hero & Navigation';
      case 'home-block-02': return 'Block 02: Partners & Metrics Strip';
      case 'home-block-03': return 'Block 03: Bento Solutions Grid';
      case 'home-block-04': return 'Block 04: Scroll-Hijacked Narrative';
      case 'home-block-05': return 'Block 05: Talent Solutions Estimator';
      case 'home-block-06': return 'Block 06: Testimonials Carousel';
      case 'home-block-07': return 'Block 07: Frequently Asked Questions';
      case 'home-block-08': return 'Block 08: Bottom CTA & Footer';
      case 'about-block-01': return 'Block 01: About Hero Section';
      case 'about-block-02': return 'Block 02: Perspective & Core Values';
      case 'about-block-03': return 'Block 03: Mindset Chapters';
      case 'about-block-04': return 'Block 04: Hard Scale Stats & Philosophy';
      case 'about-block-05': return 'Block 05: Final CTA';
      case 'services-block-01': return 'Block 01: Services Hero Section';
      case 'services-block-02': return 'Block 02: Service Cards Manager';
      case 'services-block-03': return 'Block 03: Our Approach';
      case 'services-block-04': return 'Block 04: Closing CTA';
      case 'contact-block-01': return 'Block 01: Contact Form & Consultation Intake';
      default: return 'Section Settings';
    }
  };

  // Scroll to top of preview when switching page tabs
  useEffect(() => {
    if (previewScrollRef.current) {
      previewScrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
    let defaultBlock = 'home-block-01';
    if (activePageTab === 'home') defaultBlock = 'home-block-01';
    else if (activePageTab === 'about') defaultBlock = 'about-block-01';
    else if (activePageTab === 'services') defaultBlock = 'services-block-01';
    else if (activePageTab === 'contact') defaultBlock = 'contact-block-01';
    setActiveBlock(defaultBlock);
    setExpandedBlocks(new Set([defaultBlock]));
  }, [activePageTab]);

  // ---------------------------------------------------------------------------
  // GENERIC DRAG-AND-DROP FILE UPLOAD TO BASE64
  // ---------------------------------------------------------------------------
  const handleFileUpload = (file, callback) => {
    if (!file || !file.type.startsWith('image/')) {
      alert('Please upload a valid image file (PNG, JPG, WEBP, or SVG).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      callback(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  // ---------------------------------------------------------------------------
  // STRICT 2-BUTTON MANAGER HELPER COMPONENT
  // ---------------------------------------------------------------------------
  const renderStrictButtonManager = ({
    buttons = [],
    onAdd,
    onRemove,
    onToggle,
    onUpdate,
    sectionName = 'Section',
  }) => {
    const btnCount = buttons.length;
    return (
      <div className="pt-3 border-t border-[#1E293B]/70 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
              CTA Button Manager
              <span className="px-1.5 py-0.2 rounded bg-white/10 text-[10px] text-[#E69D2B]">
                {btnCount}/2 Configured
              </span>
            </span>
            <p className="text-[10px] text-[#64748B] mt-0.5 font-inter">
              Strict max 2 buttons. Renders 0, 1, or 2 buttons on {sectionName}.
            </p>
          </div>

          <button
            type="button"
            onClick={onAdd}
            disabled={btnCount >= 2}
            className="px-3 py-1.5 rounded-lg bg-[#1E293B] hover:bg-[#E69D2B] text-white hover:text-[#0B0F17] font-semibold text-[11px] transition-colors flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            title={btnCount >= 2 ? 'Strict maximum of 2 buttons reached' : 'Add Button'}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Button</span>
          </button>
        </div>

        {btnCount === 0 && (
          <div className="p-3 rounded-lg bg-[#131926] border border-dashed border-[#1E293B] text-center">
            <span className="text-[11px] text-[#94A3B8]">
              No CTA buttons configured for this section.
            </span>
          </div>
        )}

        <div className="space-y-2.5">
          {buttons.map((btn, idx) => {
            const isPrimary = idx === 0;
            return (
              <div
                key={btn.id || idx}
                className={`p-3 rounded-xl border transition-all ${
                  btn.enabled ? 'bg-[#131926] border-[#1E293B]' : 'bg-[#131926]/50 border-[#1E293B]/40 opacity-70'
                }`}
              >
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#1E293B]/60">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[9.5px] font-bold uppercase tracking-wider font-mono ${
                        isPrimary
                          ? 'bg-[#E69D2B]/20 text-[#E69D2B] border border-[#E69D2B]/30'
                          : 'bg-white/10 text-white border border-white/20'
                      }`}
                    >
                      {isPrimary ? 'Button 1: Primary Gold Pill' : 'Button 2: Secondary Outline Pill'}
                    </span>

                    <button
                      type="button"
                      onClick={() => onToggle(idx)}
                      className={`text-[10px] font-medium flex items-center gap-1 transition-colors ${
                        btn.enabled ? 'text-emerald-400' : 'text-[#64748B]'
                      }`}
                    >
                      {btn.enabled ? (
                        <>
                          <ToggleRight className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Active</span>
                        </>
                      ) : (
                        <>
                          <ToggleLeft className="w-3.5 h-3.5 text-[#64748B]" />
                          <span>Hidden</span>
                        </>
                      )}
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => onRemove(idx)}
                    className="text-[#64748B] hover:text-red-400 p-1 rounded transition-colors cursor-pointer"
                    title="Remove button"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[9.5px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1 font-mono">
                      Button Label
                    </label>
                    <input
                      type="text"
                      value={btn.label || ''}
                      onChange={(e) => onUpdate(idx, 'label', e.target.value)}
                      placeholder={isPrimary ? 'Get Started' : 'Explore Services'}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-[#0E131F] border border-[#1E293B] text-white text-xs font-inter focus:border-[#E69D2B] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[9.5px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1 font-mono">
                      Link Destination
                    </label>
                    <select
                      value={btn.destination || '/contact'}
                      onChange={(e) => onUpdate(idx, 'destination', e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-[#0E131F] border border-[#1E293B] text-white text-xs font-inter focus:border-[#E69D2B] focus:outline-none cursor-pointer"
                    >
                      <option value="/contact">/contact — Consultation &amp; Contact</option>
                      <option value="/services">/services — Services &amp; Solutions</option>
                      <option value="/about">/about â€” Company &amp; Mindset</option>
                      <option value="#calculator">#calculator â€” Retainer Calculator</option>
                      <option value="#vetting">#vetting â€” 5-Stage Diligence</option>
                      <option value="#testimonials">#testimonials â€” Client Success</option>
                    </select>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // ---------------------------------------------------------------------------
  // GENERIC IMAGE UPLOAD & URL FIELD HELPER
  // ---------------------------------------------------------------------------
  const renderImageDropzone = ({
    title,
    currentValue,
    defaultValue,
    onUpdate,
    onReset,
    fieldKey,
  }) => {
    return (
      <div className="p-3.5 rounded-xl bg-[#131926] border border-[#1E293B] space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-white font-mono">{title}</span>
          {defaultValue && currentValue !== defaultValue && (
            <button
              type="button"
              onClick={onReset}
              className="text-[10px] text-[#E69D2B] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Default</span>
            </button>
          )}
        </div>

        <div className="flex gap-3 items-center">
          <div className="w-20 h-14 rounded-lg overflow-hidden border border-[#1E293B] bg-black/40 shrink-0">
            <img src={currentValue} alt={title} className="w-full h-full object-cover" />
          </div>

          <div className="flex-1 relative">
            <LinkIcon className="w-3.5 h-3.5 text-[#64748B] absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={currentValue || ''}
              onChange={(e) => onUpdate(e.target.value)}
              placeholder="https://... or /assets/..."
              className="w-full pl-8 pr-2 py-1.5 rounded-lg bg-[#0E131F] border border-[#1E293B] text-white text-[11px] focus:border-[#E69D2B] focus:outline-none font-mono"
            />
          </div>
        </div>

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOverKey(fieldKey);
          }}
          onDragLeave={() => setDragOverKey(null)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOverKey(null);
            if (e.dataTransfer.files?.[0]) {
              handleFileUpload(e.dataTransfer.files[0], onUpdate);
            }
          }}
          className={`p-2 rounded-lg border border-dashed transition-all text-center flex items-center justify-center gap-2 cursor-pointer ${
            dragOverKey === fieldKey
              ? 'border-[#E69D2B] bg-[#E69D2B]/10 text-white'
              : 'border-[#1E293B] hover:border-[#E69D2B]/60 text-[#64748B] hover:text-[#94A3B8]'
          }`}
          onClick={() => {
            const el = document.getElementById(`upload-${fieldKey}`);
            if (el) el.click();
          }}
        >
          <input
            type="file"
            id={`upload-${fieldKey}`}
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                handleFileUpload(e.target.files[0], onUpdate);
              }
            }}
          />
          <Upload className="w-3.5 h-3.5" />
          <span className="text-[10.5px]">Drag &amp; Drop local image or <strong className="text-[#E69D2B]">browse</strong></span>
        </div>
      </div>
    );
  };

  // =========================================================================
  // LIVE SITE PREVIEW CANVAS CONTENT (EXACT 1:1 REPLICA OF THE REAL SITE)
  // Replicates exact architectural Bento Canvas, warm stone #EBE7DE gutter,
  // detached rounded cards, and non-interactive preview action buttons.
  // =========================================================================
  const renderPreviewContent = () => (
    <div className="preview-site-content w-full relative min-h-screen bg-[#EBE7DE] text-[#0B0F17] selection:bg-[#E69D2B] selection:text-[#0B0F17]">
      {/* Scoped CSS rule: Disables link navigation and button hijacking in live preview */}
      <style>{`
        .preview-site-content button,
        .preview-site-content a,
        .preview-site-content [role="button"] {
          pointer-events: none !important;
          cursor: pointer !important;
        }
      `}</style>

      {/* ===================================================================== */}
      {/* 1. HOMEPAGE VIEWPORT (EXACT MATCH OF REAL SITE DOM & ARCHITECTURE)   */}
      {/* ===================================================================== */}
      {activePageTab === 'home' && (
        <>
          {/* Block 01: Hero Section (Embeds 3-Part Glassmorphic Header) */}
          <EditableSection
            blockId="home-block-01"
            blockNumber="01"
            blockTitle="Hero Section"
            activeBlock={activeBlock}
            isDrawerOpen={isDrawerOpen}
            onSelectBlock={openBlockDrawer}
          >
            <div id="hero-section">
              <Hero
                onNavigate={noOp}
                onNavigateContact={noOp}
                onNavigateServices={noOp}
                currentRoute="home"
              />
            </div>
          </EditableSection>

          {/* Architectural Bento Canvas (Warm Stone Gutter with Rounded Cards) */}
          <main className="relative z-10 px-3 sm:px-6 lg:px-8 py-4 sm:py-6 flex flex-col gap-3.5 sm:gap-5 lg:gap-6 bg-[#EBE7DE]">
            {/* Block 02: Partners & Metrics Strip (White Detached Rounded Card) */}
            <EditableSection
              blockId="home-block-02"
              blockNumber="02"
              blockTitle="Partners & Metrics Strip"
              activeBlock={activeBlock}
              isDrawerOpen={isDrawerOpen}
              onSelectBlock={openBlockDrawer}
            >
              <div id="metrics-section">
                <section className="rounded-2xl sm:rounded-[20px] overflow-hidden bg-white border border-[#DDD7CC] shadow-[0_4px_24px_rgba(11,15,23,0.03)]">
                  <SocialProofMarquee />
                </section>
              </div>
            </EditableSection>

            {/* Block 03: Bento Solutions Grid (Warm Cream Detached Rounded Card) */}
            <EditableSection
              blockId="home-block-03"
              blockNumber="03"
              blockTitle="Bento Solutions Grid"
              activeBlock={activeBlock}
              isDrawerOpen={isDrawerOpen}
              onSelectBlock={openBlockDrawer}
            >
              <div id="capital-section">
                <section className="rounded-2xl sm:rounded-[20px] overflow-hidden bg-[#FAF9F6] border border-[#DDD7CC] shadow-[0_4px_24px_rgba(11,15,23,0.03)]">
                  <BentoGrowthCapital onNavigateService={noOp} />
                </section>
              </div>
            </EditableSection>
          </main>

          {/* Block 04: Scroll-Hijacked Narrative (Full-Width Cinematic Stage) */}
          <EditableSection
            blockId="home-block-04"
            blockNumber="04"
            blockTitle="Scroll-Hijacked Narrative"
            activeBlock={activeBlock}
            isDrawerOpen={isDrawerOpen}
            onSelectBlock={openBlockDrawer}
          >
            <div id="process-story">
              <VettingProcess
                onNavigateContact={noOp}
                onNavigateServices={noOp}
              />
            </div>
          </EditableSection>

          {/* Architectural Bento Canvas */}
          <main className="relative z-10 px-3 sm:px-6 lg:px-8 py-4 sm:py-6 flex flex-col gap-3.5 sm:gap-5 lg:gap-6 bg-[#EBE7DE]">
            {/* Block 05: Talent Solutions Estimator */}
            <EditableSection
              blockId="home-block-05"
              blockNumber="05"
              blockTitle="Talent Solutions Estimator"
              activeBlock={activeBlock}
              isDrawerOpen={isDrawerOpen}
              onSelectBlock={openBlockDrawer}
            >
              <div id="staffing-momentum">
                <section className="rounded-2xl sm:rounded-[20px] overflow-hidden bg-white border border-[#DDD7CC] shadow-[0_4px_24px_rgba(11,15,23,0.03)]">
                  <Calculator
                    onNavigateContact={noOp}
                    onProceedToContact={noOp}
                  />
                </section>
              </div>
            </EditableSection>

            {/* Block 06: Testimonials Carousel */}
            <EditableSection
              blockId="home-block-06"
              blockNumber="06"
              blockTitle="Testimonials Carousel"
              activeBlock={activeBlock}
              isDrawerOpen={isDrawerOpen}
              onSelectBlock={openBlockDrawer}
            >
              <div id="testimonials-section">
                <section className="rounded-2xl sm:rounded-[20px] overflow-hidden bg-[#FAF9F6] border border-[#DDD7CC] shadow-[0_4px_24px_rgba(11,15,23,0.03)]">
                  <Testimonials />
                </section>
              </div>
            </EditableSection>

            {/* Block 07: Frequently Asked Questions */}
            <EditableSection
              blockId="home-block-07"
              blockNumber="07"
              blockTitle="Frequently Asked Questions"
              activeBlock={activeBlock}
              isDrawerOpen={isDrawerOpen}
              onSelectBlock={openBlockDrawer}
            >
              <div id="faq-section">
                <section className="rounded-2xl sm:rounded-[20px] overflow-hidden bg-white border border-[#DDD7CC] shadow-[0_4px_24px_rgba(11,15,23,0.03)]">
                  <FAQ />
                </section>
              </div>
            </EditableSection>

            {/* Block 08: Bottom CTA & Global Footer */}
            <EditableSection
              blockId="home-block-08"
              blockNumber="08"
              blockTitle="Bottom CTA & Footer"
              activeBlock={activeBlock}
              isDrawerOpen={isDrawerOpen}
              onSelectBlock={openBlockDrawer}
            >
              <div id="footer-section">
                <section className="relative rounded-2xl sm:rounded-[20px] overflow-hidden bg-gradient-to-b from-white via-white to-[#FCEFD2] border border-[#DDD7CC] shadow-[0_4px_24px_rgba(11,15,23,0.03)] mb-4 sm:mb-6">
                  <div className="animate-breathe absolute bottom-0 inset-x-0 h-[720px] bg-gradient-to-t from-[#E69D2B]/30 via-[#E69D2B]/10 to-transparent pointer-events-none" />
                  <SpeakToExperts onNavigateContact={noOp} />
                </section>
                <Footer onNavigate={noOp} />
              </div>
            </EditableSection>
          </main>
        </>
      )}

      {/* ===================================================================== */}
      {/* 2. ABOUT PAGE VIEWPORT                                                 */}
      {/* ===================================================================== */}
      {activePageTab === 'about' && (
        <div className="min-h-screen bg-[#0B0F17] flex flex-col justify-between">
          <Header onNavigate={noOp} currentRoute="about" />
          <EditableSection
            blockId="about-block-01"
            blockNumber="01"
            blockTitle="About Narrative & Benchmarks"
            activeBlock={activeBlock}
            isDrawerOpen={isDrawerOpen}
            onSelectBlock={openBlockDrawer}
          >
            <div id="about-hero">
              <AboutPage
                onNavigateContact={noOp}
                onNavigateServices={noOp}
              />
            </div>
          </EditableSection>
          <div className="px-3 sm:px-5 lg:px-7 py-4 sm:py-6 bg-[#EBE7DE]">
            <Footer onNavigate={noOp} />
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 3. SERVICES PAGE VIEWPORT                                              */}
      {/* ===================================================================== */}
      {activePageTab === 'services' && (
        <div className="min-h-screen bg-[#F8F6F1] flex flex-col justify-between">
          <Header onNavigate={noOp} currentRoute="services" />
          <EditableSection
            blockId="services-block-01"
            blockNumber="01"
            blockTitle="Services Capabilities & Practice"
            activeBlock={activeBlock}
            isDrawerOpen={isDrawerOpen}
            onSelectBlock={openBlockDrawer}
          >
            <div id="services-hero">
              <ServicesPage
                onNavigateContact={noOp}
                onNavigate={noOp}
              />
            </div>
          </EditableSection>
          <div className="px-3 sm:px-5 lg:px-7 py-4 sm:py-6 bg-[#EBE7DE]">
            <Footer onNavigate={noOp} />
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 4. CONTACT PAGE VIEWPORT                                               */}
      {/* ===================================================================== */}
      {activePageTab === 'contact' && (
        <div className="min-h-screen bg-[#F8F6F1] flex flex-col justify-between">
          <Header onNavigate={noOp} currentRoute="contact" />
          <EditableSection
            blockId="contact-block-01"
            blockNumber="01"
            blockTitle="Contact Form & Intake Portal"
            activeBlock={activeBlock}
            isDrawerOpen={isDrawerOpen}
            onSelectBlock={openBlockDrawer}
          >
            <div id="contact-workspace">
              <ContactPage />
            </div>
          </EditableSection>
          <div className="px-3 sm:px-5 lg:px-7 py-4 sm:py-6 bg-[#EBE7DE]">
            <Footer onNavigate={noOp} />
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="relative w-full h-full flex flex-col min-h-screen bg-[#0B0F17] overflow-hidden">
      {/* ===================================================================== */}
      {/* GLOBAL GREEN SUCCESS TOAST BANNER                                     */}
      {/* ===================================================================== */}
      <AnimatePresence>
        {publishStatus === 'published' && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.96 }}
            transition={{ duration: 0.3 }}
            className="fixed top-20 right-8 z-[60] p-4 rounded-xl bg-gradient-to-r from-emerald-950/95 via-[#064e3b]/95 to-emerald-950/95 border border-emerald-500/50 text-white shadow-2xl flex items-center justify-between gap-4 max-w-md"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 shrink-0">
                <Check className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <p className="text-sm font-bold text-white tracking-wide">
                  {publishMessage || 'Site Content & Global Settings Published Live!'}
                </p>
                <p className="text-[11px] text-emerald-200/80">
                  Published to GoDaddy flat-file storage (/data/save-content.php) and synchronized worldwide.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===================================================================== */}
      {/* 1. COMPACT TOP EDITOR BAR (Whiteboard Top Bar: Controls & Publish)     */}
      {/* ===================================================================== */}
      <header className="sticky top-0 z-30 w-full px-4 sm:px-6 py-2.5 bg-[#0E131F] border-b border-white/10 flex items-center justify-between gap-4 shrink-0 select-none shadow-md">
        {/* Left: Sidebar Toggle + Workspace Title */}
        <div className="flex items-center gap-3 min-w-0">
          {onOpenMobileMenu && (
            <button
              type="button"
              onClick={onOpenMobileMenu}
              className="lg:hidden w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 text-[#94A3B8] hover:text-[#E69D2B] flex items-center justify-center transition-colors cursor-pointer shrink-0"
              aria-label="Open navigation menu"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          )}
          {onToggleSidebar && (
            <button
              type="button"
              onClick={onToggleSidebar}
              className="hidden lg:flex w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 text-[#94A3B8] hover:text-[#E69D2B] items-center justify-center transition-colors cursor-pointer shrink-0"
              title={sidebarCollapsed ? 'Expand sidebar overlay (260px)' : 'Collapse sidebar rail (68px)'}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          )}

          <div className="flex items-center gap-2.5 truncate">
            <span className="text-xs sm:text-sm font-bold text-white tracking-tight truncate">
              Visual Site Editor
            </span>
            <span className="hidden sm:inline-block text-[10.5px] font-mono text-[#E69D2B] bg-[#E69D2B]/10 border border-[#E69D2B]/25 px-2 py-0.5 rounded-full uppercase tracking-wider">
              {activePageTab}
            </span>
          </div>
        </div>

        {/* Right: Additional Settings Shortcut + Expand/Collapse + Publish CTA */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {onOpenAdditionalSettings && (
            <button
              type="button"
              onClick={onOpenAdditionalSettings}
              className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-[#E69D2B]/15 text-[11px] text-[#E69D2B] border border-[#E69D2B]/25 transition-colors cursor-pointer font-semibold"
              title="Open Additional Settings (Logos, Theme, Cursor, SEO, Socials, Copyright)"
            >
              <SettingsIcon className="w-3.5 h-3.5" />
              <span>Additional Settings</span>
            </button>
          )}
          <button
            type="button"
            onClick={expandAllBlocks}
            className="hidden sm:inline-flex px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] text-[#94A3B8] hover:text-white transition-colors cursor-pointer font-medium"
            title="Expand all section blocks"
          >
            Expand All
          </button>
          <button
            type="button"
            onClick={collapseAllBlocks}
            className="hidden sm:inline-flex px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] text-[#94A3B8] hover:text-white transition-colors cursor-pointer font-medium"
            title="Collapse all section blocks"
          >
            Collapse All
          </button>

          {/* Save & Publish Changes Gold CTA */}
          <button
            type="button"
            onClick={() => publishChanges()}
            disabled={publishStatus === 'saving' || !hasUnsavedChanges}
            className="bg-[#E69D2B] text-[#0B0F17] font-bold px-4 py-2 rounded-xl text-xs hover:bg-[#F2A51A] transition-all shadow-lg flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-95"
          >
            {publishStatus === 'saving' ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#0B0F17]" />
                <span className="hidden sm:inline">Publishing...</span>
              </>
            ) : publishStatus === 'published' ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#0B0F17] stroke-[3]" />
                <span className="hidden sm:inline">Published Live</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-[#0B0F17]" />
                <span>Save &amp; Publish Changes</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* ===================================================================== */}
      {/* 2. MASTER SPLIT-SCREEN WORKSPACE (WHITEBOARD SKETCH ARCHITECTURE)     */}
      {/* Left: Spacious Blocks Panel | Right: Rounded Pages Pill + Live Preview */}
      {/* ===================================================================== */}
      <div className="flex-1 min-h-0 w-full flex flex-col lg:flex-row overflow-hidden relative p-3 sm:p-4 gap-4 bg-[#080B12]">
        {/* =================================================================== */}
        {/* ZONE A: LEFT "BLOCKS" PANEL (Spacious, Un-squeezed Accordion Editor) */}
        {/* =================================================================== */}
        <div
          data-lenis-prevent
          className="w-full lg:w-[44%] xl:w-[45%] min-w-0 lg:min-w-[380px] max-w-full lg:max-w-[580px] shrink-0 h-full flex flex-col bg-[#0B0F17] rounded-2xl border border-white/10 overflow-hidden shadow-xl"
        >
          {/* Clean Blocks Header Strip */}
          <div className="px-4 py-2.5 border-b border-white/10 bg-[#0E131F]/70 flex items-center justify-between shrink-0 select-none">
            <span className="text-[11px] font-mono font-bold tracking-[0.2em] text-[#E69D2B] uppercase">
              Blocks
            </span>
            <span className="text-[11px] font-mono text-[#64748B] uppercase">
              {`${activePageTab} Page`}
            </span>
          </div>

          {/* Scrollable Block Accordions */}
          <div
            className="flex-1 overflow-y-auto px-4 py-4 space-y-3.5 custom-scrollbar"
            style={{ scrollbarWidth: 'thin', scrollbarColor: '#E69D2B #131926' }}
          >
          {/* ================================================================= */}
          {/* TAB A: HOME PAGE (8 SECTION BLOCKS)                               */}
          {/* ================================================================= */}
          {activePageTab === 'home' && (
            <div className="space-y-3">
              {/* BLOCK 01: HERO SECTION */}
              <div className="bg-[#1E293B]/60 rounded-2xl p-5 mb-4 border-0 shadow-lg">
                <button
                  type="button"
                  onClick={() => handleBlockToggle('home-block-01', '#hero-section')}
                  className="w-full flex items-center justify-between text-left cursor-pointer select-none"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-[#E69D2B]/15 flex items-center justify-center font-mono text-xs font-bold text-[#E69D2B]">
                      01
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-white font-sans">
                        Block 01: Hero Section
                      </h3>
                      <p className="text-[11px] text-[#64748B]">
                        Headline, Subtitle, Kicker, and Strict Max 2 Buttons Manager
                      </p>
                    </div>
                  </div>
                  {isBlockExpanded('home-block-01') ? (
                    <ChevronUp className="w-4 h-4 text-[#94A3B8]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#94A3B8]" />
                  )}
                </button>

                {isBlockExpanded('home-block-01') && (
                  <div className="mt-4 pt-4 border-t border-white/5 space-y-4 text-xs">
                    <div>
                      <label className="block text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1 font-mono">
                        Kicker Eyebrow Badge
                      </label>
                      <input
                        type="text"
                        value={draftContent.home?.hero?.kicker || draftContent.hero?.kicker || ''}
                        onChange={(e) => {
                          const updated = { ...(draftContent.home?.hero || draftContent.hero), kicker: e.target.value };
                          updateDraft('home.hero', updated);
                          updateDraft('hero', updated);
                        }}
                        className="w-full px-3 py-2 rounded-lg bg-[#131926] border border-[#1E293B] text-white focus:border-[#E69D2B] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1 font-mono">
                        Main Headline
                      </label>
                      <input
                        type="text"
                        value={draftContent.home?.hero?.headline || draftContent.hero?.headline || ''}
                        onChange={(e) => {
                          const updated = { ...(draftContent.home?.hero || draftContent.hero), headline: e.target.value };
                          updateDraft('home.hero', updated);
                          updateDraft('hero', updated);
                        }}
                        className="w-full px-3 py-2 rounded-lg bg-[#131926] border border-[#1E293B] text-white focus:border-[#E69D2B] focus:outline-none font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1 font-mono">
                        Gold Highlight Word (Inline Accent)
                      </label>
                      <input
                        type="text"
                        value={draftContent.home?.hero?.highlightWord || draftContent.hero?.highlightWord || ''}
                        onChange={(e) => {
                          const updated = { ...(draftContent.home?.hero || draftContent.hero), highlightWord: e.target.value };
                          updateDraft('home.hero', updated);
                          updateDraft('hero', updated);
                        }}
                        className="w-full px-3 py-2 rounded-lg bg-[#131926] border border-[#1E293B] text-[#E69D2B] font-semibold focus:border-[#E69D2B] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1 font-mono">
                        Supporting Subtitle Paragraph
                      </label>
                      <textarea
                        rows={2}
                        value={draftContent.home?.hero?.subtitle || draftContent.hero?.subtitle || ''}
                        onChange={(e) => {
                          const updated = { ...(draftContent.home?.hero || draftContent.hero), subtitle: e.target.value };
                          updateDraft('home.hero', updated);
                          updateDraft('hero', updated);
                        }}
                        className="w-full px-3 py-2 rounded-lg bg-[#131926] border border-[#1E293B] text-white focus:border-[#E69D2B] focus:outline-none leading-relaxed"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1 font-mono">
                          Hero Bottom Caption
                        </label>
                        <input
                          type="text"
                          value={draftContent.home?.hero?.bottomCaption || ''}
                          onChange={(e) => {
                            const updated = { ...(draftContent.home?.hero || draftContent.hero), bottomCaption: e.target.value };
                            updateDraft('home.hero', updated);
                            updateDraft('hero', updated);
                          }}
                          className="w-full px-3 py-2 rounded-lg bg-[#131926] border border-[#1E293B] text-white focus:border-[#E69D2B] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1 font-mono">
                          Navbar Action Button Label
                        </label>
                        <input
                          type="text"
                          value={draftContent.navbar?.ctaLabel || 'Join us'}
                          onChange={(e) => updateDraft('navbar', { ...(draftContent.navbar || {}), ctaLabel: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-[#131926] border border-[#1E293B] text-[#E69D2B] font-semibold focus:border-[#E69D2B] focus:outline-none"
                        />
                      </div>
                    </div>

                    {renderImageDropzone({
                      title: 'Hero Background Photography',
                      currentValue: draftContent.images?.heroBg || '/assets/hero-2.webp',
                      defaultValue: '/assets/hero-2.webp',
                      fieldKey: 'home-hero-bg',
                      onReset: () =>
                        updateDraft('images', { ...(draftContent.images || {}), heroBg: '/assets/hero-2.webp' }),
                      onUpdate: (newUrl) =>
                        updateDraft('images', { ...(draftContent.images || {}), heroBg: newUrl }),
                    })}

                    {/* Button Manager */}
                    {renderStrictButtonManager({
                      buttons: draftContent.home?.hero?.buttons || draftContent.hero?.buttons || [],
                      sectionName: 'Hero Section',
                      onAdd: () => {
                        const current = draftContent.home?.hero?.buttons || draftContent.hero?.buttons || [];
                        if (current.length >= 2) return;
                        const isFirst = current.length === 0;
                        const newBtn = {
                          id: 'btn-' + Date.now(),
                          enabled: true,
                          label: isFirst ? 'Get Started' : 'Explore Services',
                          destination: isFirst ? '/contact' : '/services',
                          variant: isFirst ? 'primary' : 'secondary',
                        };
                        const updated = [...current, newBtn];
                        updateDraft('home.hero', { ...(draftContent.home?.hero || draftContent.hero), buttons: updated });
                        updateDraft('hero', { ...draftContent.hero, buttons: updated });
                      },
                      onRemove: (idx) => {
                        const current = draftContent.home?.hero?.buttons || draftContent.hero?.buttons || [];
                        const updated = current.filter((_, i) => i !== idx);
                        updateDraft('home.hero', { ...(draftContent.home?.hero || draftContent.hero), buttons: updated });
                        updateDraft('hero', { ...draftContent.hero, buttons: updated });
                      },
                      onToggle: (idx) => {
                        const current = [...(draftContent.home?.hero?.buttons || draftContent.hero?.buttons || [])];
                        current[idx] = { ...current[idx], enabled: !current[idx].enabled };
                        updateDraft('home.hero', { ...(draftContent.home?.hero || draftContent.hero), buttons: current });
                        updateDraft('hero', { ...draftContent.hero, buttons: current });
                      },
                      onUpdate: (idx, field, value) => {
                        const current = [...(draftContent.home?.hero?.buttons || draftContent.hero?.buttons || [])];
                        current[idx] = { ...current[idx], [field]: value };
                        updateDraft('home.hero', { ...(draftContent.home?.hero || draftContent.hero), buttons: current });
                        updateDraft('hero', { ...draftContent.hero, buttons: current });
                      },
                    })}
                  </div>
                )}
              </div>

              {/* BLOCK 02: PARTNERS & METRICS STRIP */}
              <div className="bg-[#1E293B]/60 rounded-2xl p-5 mb-4 border-0 shadow-lg">
                <button
                  type="button"
                  onClick={() => handleBlockToggle('home-block-02', '#metrics-section')}
                  className="w-full flex items-center justify-between text-left cursor-pointer select-none"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-[#E69D2B]/15 flex items-center justify-center font-mono text-xs font-bold text-[#E69D2B]">
                      02
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-white font-sans">
                        Block 02: Partners &amp; Metrics Strip
                      </h3>
                      <p className="text-[11px] text-[#64748B]">
                        3 Core Metrics, SLA counts, and Enterprise Marquee Header
                      </p>
                    </div>
                  </div>
                  {isBlockExpanded('home-block-02') ? (
                    <ChevronUp className="w-4 h-4 text-[#94A3B8]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#94A3B8]" />
                  )}
                </button>

                {isBlockExpanded('home-block-02') && (
                  <div className="mt-4 pt-4 border-t border-white/5 space-y-3.5 text-xs">
                    <div>
                      <label className="block text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1 font-mono">
                        Partner Ticker Kicker Label
                      </label>
                      <input
                        type="text"
                        value={draftContent.home?.metrics?.marqueeBadge || 'TRUSTED BY ENTERPRISE LEADERS'}
                        onChange={(e) => updateDraft('home.metrics', { ...draftContent.home?.metrics, marqueeBadge: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-lg bg-[#131926] border border-[#1E293B] text-white focus:border-[#E69D2B] focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[9.5px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1 font-mono">
                          Stat 1 (Engagements)
                        </label>
                        <input
                          type="number"
                          value={draftContent.home?.metrics?.stat1Value || 500}
                          onChange={(e) => updateDraft('home.metrics', { ...draftContent.home?.metrics, stat1Value: Number(e.target.value) })}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-[#131926] border border-[#1E293B] text-[#E69D2B] font-bold"
                        />
                        <span className="text-[10px] text-[#64748B] block mt-0.5">500+ Engagements</span>
                      </div>

                      <div>
                        <label className="block text-[9.5px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1 font-mono">
                          Stat 2 (Retention %)
                        </label>
                        <input
                          type="number"
                          value={draftContent.home?.metrics?.stat2Value || 98}
                          onChange={(e) => updateDraft('home.metrics', { ...draftContent.home?.metrics, stat2Value: Number(e.target.value) })}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-[#131926] border border-[#1E293B] text-white font-bold"
                        />
                        <span className="text-[10px] text-[#64748B] block mt-0.5">98% Retention</span>
                      </div>

                      <div>
                        <label className="block text-[9.5px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1 font-mono">
                          Stat 3 (Days to Fill)
                        </label>
                        <input
                          type="number"
                          value={draftContent.home?.metrics?.stat3Value || 14}
                          onChange={(e) => updateDraft('home.metrics', { ...draftContent.home?.metrics, stat3Value: Number(e.target.value) })}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-[#131926] border border-[#1E293B] text-[#E69D2B] font-bold"
                        />
                        <span className="text-[10px] text-[#64748B] block mt-0.5">14 Days Avg</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* BLOCK 03: BENTO SOLUTIONS GRID */}
              <div className="bg-[#1E293B]/60 rounded-2xl p-5 mb-4 border-0 shadow-lg">
                <button
                  type="button"
                  onClick={() => handleBlockToggle('home-block-03', '#capital-section')}
                  className="w-full flex items-center justify-between text-left cursor-pointer select-none"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-[#E69D2B]/15 flex items-center justify-center font-mono text-xs font-bold text-[#E69D2B]">
                      03
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-white font-sans">
                        Block 03: Bento Solutions Grid (4 Cards)
                      </h3>
                      <p className="text-[11px] text-[#64748B]">
                        Titles, Badges, Descriptions, and Replaceable Images
                      </p>
                    </div>
                  </div>
                  {isBlockExpanded('home-block-03') ? (
                    <ChevronUp className="w-4 h-4 text-[#94A3B8]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#94A3B8]" />
                  )}
                </button>

                {isBlockExpanded('home-block-03') && (
                  <div className="mt-4 pt-4 border-t border-white/5 space-y-4 text-xs">
                    <div className="p-3.5 rounded-xl bg-[#131926] border border-[#1E293B] space-y-2.5">
                      <div className="text-[10px] font-mono uppercase tracking-wider text-[#E69D2B]">
                        Section Header &amp; CTA
                      </div>
                      <input
                        type="text"
                        value={draftContent.home?.bentoSection?.eyebrow || 'CAPABILITIES MATRIX'}
                        onChange={(e) =>
                          updateDraft('home.bentoSection', {
                            ...(draftContent.home?.bentoSection || {}),
                            eyebrow: e.target.value,
                          })
                        }
                        placeholder="Section Eyebrow"
                        className="w-full px-2.5 py-1.5 rounded bg-[#0E131F] border border-[#1E293B] text-[#E69D2B] text-xs"
                      />
                      <input
                        type="text"
                        value={draftContent.home?.bentoSection?.headline || ''}
                        onChange={(e) =>
                          updateDraft('home.bentoSection', {
                            ...(draftContent.home?.bentoSection || {}),
                            headline: e.target.value,
                          })
                        }
                        placeholder="Section Headline"
                        className="w-full px-2.5 py-1.5 rounded bg-[#0E131F] border border-[#1E293B] text-white font-semibold text-xs"
                      />
                      <textarea
                        rows={2}
                        value={draftContent.home?.bentoSection?.subtitle || ''}
                        onChange={(e) =>
                          updateDraft('home.bentoSection', {
                            ...(draftContent.home?.bentoSection || {}),
                            subtitle: e.target.value,
                          })
                        }
                        placeholder="Section Subtitle"
                        className="w-full px-2.5 py-1.5 rounded bg-[#0E131F] border border-[#1E293B] text-white text-xs"
                      />
                    </div>
                    {(draftContent.home?.bento || draftContent.services || []).map((card, idx) => (
                      <div key={card.id || idx} className="p-3.5 rounded-xl bg-[#131926] border border-[#1E293B] space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-[#E69D2B] font-mono">
                            Card 0{idx + 1}: {card.title}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2.5">
                          <div>
                            <label className="block text-[9.5px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1 font-mono">
                              Title
                            </label>
                            <input
                              type="text"
                              value={card.title}
                              onChange={(e) => {
                                const list = [...(draftContent.home?.bento || draftContent.services)];
                                list[idx] = { ...list[idx], title: e.target.value };
                                updateDraft('home.bento', list);
                                updateDraft('services', list);
                              }}
                              className="w-full px-2.5 py-1.5 rounded bg-[#0E131F] border border-[#1E293B] text-white text-xs"
                            />
                          </div>

                          <div>
                            <label className="block text-[9.5px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1 font-mono">
                              Badge
                            </label>
                            <input
                              type="text"
                              value={card.badge || card.category}
                              onChange={(e) => {
                                const list = [...(draftContent.home?.bento || draftContent.services)];
                                list[idx] = { ...list[idx], badge: e.target.value, category: e.target.value };
                                updateDraft('home.bento', list);
                                updateDraft('services', list);
                              }}
                              className="w-full px-2.5 py-1.5 rounded bg-[#0E131F] border border-[#1E293B] text-white text-xs font-mono"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[9.5px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1 font-mono">
                            Description
                          </label>
                          <textarea
                            rows={2}
                            value={card.description}
                            onChange={(e) => {
                              const list = [...(draftContent.home?.bento || draftContent.services)];
                              list[idx] = { ...list[idx], description: e.target.value };
                              updateDraft('home.bento', list);
                              updateDraft('services', list);
                            }}
                            className="w-full px-2.5 py-1.5 rounded bg-[#0E131F] border border-[#1E293B] text-white text-xs"
                          />
                        </div>

                        {/* Image Dropzone */}
                        {renderImageDropzone({
                          title: `Card 0${idx + 1} Portrait Image`,
                          currentValue: card.image,
                          fieldKey: `bento-${idx}`,
                          onUpdate: (newUrl) => {
                            const list = [...(draftContent.home?.bento || draftContent.services)];
                            list[idx] = { ...list[idx], image: newUrl };
                            updateDraft('home.bento', list);
                            updateDraft('services', list);

                            const keyMap = ['bentoCard1', 'bentoCard2', 'bentoCard3', 'bentoCard4'];
                            if (keyMap[idx]) {
                              updateDraft('images', { ...(draftContent.images || {}), [keyMap[idx]]: newUrl });
                            }
                          },
                        })}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* BLOCK 04: SCROLL-HIJACKED SECTION (MULTI-STAGE ACCORDION EDITOR) */}
              <div className="bg-[#1E293B]/60 rounded-2xl p-5 mb-4 border-0 shadow-lg">
                <button
                  type="button"
                  onClick={() => handleBlockToggle('home-block-04', '#process-story')}
                  className="w-full flex items-center justify-between text-left cursor-pointer select-none"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-[#E69D2B]/15 flex items-center justify-center font-mono text-xs font-bold text-[#E69D2B]">
                      04
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-white font-sans">
                        Block 04: Scroll-Hijacked Narrative (4 Stages)
                      </h3>
                      <p className="text-[11px] text-[#64748B]">
                        Accordion Stage Editor for Stage 1–4 Headings, Descriptions, Badges &amp; Photos
                      </p>
                    </div>
                  </div>
                  {isBlockExpanded('home-block-04') ? (
                    <ChevronUp className="w-4 h-4 text-[#94A3B8]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#94A3B8]" />
                  )}
                </button>

                {isBlockExpanded('home-block-04') && (() => {
                  const scrollCfg = draftContent.home?.scrollHijackSection || {
                    enabled: true,
                    kicker: 'The Sahara Approach',
                    stages: [],
                  };
                  const stages = [0, 1, 2, 3].map((i) => ({
                    id: i + 1,
                    badge: `STAGE 0${i + 1}`,
                    title: '',
                    description: '',
                    image: '/assets/hero-2.webp',
                    ...(scrollCfg.stages?.[i] || {}),
                  }));

                  const updateScrollCfg = (partial) => {
                    updateDraft('home.scrollHijackSection', { ...scrollCfg, ...partial });
                  };

                  const updateStage = (idx, partial) => {
                    const nextStages = stages.map((st, i) => (i === idx ? { ...st, ...partial } : st));
                    updateScrollCfg({ stages: nextStages });
                  };

                  return (
                    <div className="mt-4 pt-4 border-t border-white/5 space-y-4 text-xs">
                      {/* Enable Toggle + Section Kicker */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center p-3 rounded-xl bg-[#131926] border border-[#1E293B]">
                        <label className="flex items-center justify-between gap-2 cursor-pointer">
                          <span className="text-xs font-semibold text-white">Enable Scroll-Hijacked Section</span>
                          <input
                            type="checkbox"
                            checked={scrollCfg.enabled !== false}
                            onChange={(e) => updateScrollCfg({ enabled: e.target.checked })}
                            className="w-4 h-4 accent-[#E69D2B] cursor-pointer"
                          />
                        </label>
                        <div>
                          <label className="block text-[9.5px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1 font-mono">
                            Top Section Kicker
                          </label>
                          <input
                            type="text"
                            value={scrollCfg.kicker || ''}
                            onChange={(e) => updateScrollCfg({ kicker: e.target.value })}
                            placeholder="The Sahara Approach"
                            className="w-full px-2.5 py-1.5 rounded bg-[#0E131F] border border-[#1E293B] text-white text-xs"
                          />
                        </div>
                      </div>

                      {/* Stage 1-4 Individual Accordion Editor */}
                      <div className="space-y-2.5">
                        {stages.map((stage, idx) => {
                          const isOpen = expandedStageIdx === idx;
                          return (
                            <div
                              key={stage.id || idx}
                              className="rounded-xl bg-[#131926] border border-[#1E293B] overflow-hidden"
                            >
                              <button
                                type="button"
                                onClick={() => setExpandedStageIdx(isOpen ? -1 : idx)}
                                className="w-full px-3.5 py-2.5 flex items-center justify-between text-left hover:bg-white/[0.02] cursor-pointer"
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <span className="font-mono font-bold text-[#E69D2B] text-xs shrink-0">
                                    0{idx + 1}
                                  </span>
                                  <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-[#E69D2B]/15 text-[#E69D2B] shrink-0">
                                    {stage.badge || `STAGE 0${idx + 1}`}
                                  </span>
                                  <span className="text-white font-semibold text-xs truncate">
                                    {stage.title || `Stage ${idx + 1}`}
                                  </span>
                                </div>
                                {isOpen ? (
                                  <ChevronUp className="w-4 h-4 text-[#94A3B8] shrink-0" />
                                ) : (
                                  <ChevronDown className="w-4 h-4 text-[#94A3B8] shrink-0" />
                                )}
                              </button>

                              {isOpen && (
                                <div className="p-3.5 pt-2 border-t border-[#1E293B] space-y-3">
                                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                                    <div>
                                      <label className="block text-[9.5px] font-semibold text-[#94A3B8] uppercase mb-1 font-mono">
                                        Stage Badge
                                      </label>
                                      <input
                                        type="text"
                                        value={stage.badge || ''}
                                        onChange={(e) => updateStage(idx, { badge: e.target.value })}
                                        className="w-full px-2.5 py-1.5 rounded bg-[#0E131F] border border-[#1E293B] text-[#E69D2B] font-mono text-xs"
                                      />
                                    </div>
                                    <div className="sm:col-span-2">
                                      <label className="block text-[9.5px] font-semibold text-[#94A3B8] uppercase mb-1 font-mono">
                                        Stage Heading
                                      </label>
                                      <input
                                        type="text"
                                        value={stage.title || ''}
                                        onChange={(e) => updateStage(idx, { title: e.target.value })}
                                        className="w-full px-2.5 py-1.5 rounded bg-[#0E131F] border border-[#1E293B] text-white font-semibold text-xs"
                                      />
                                    </div>
                                  </div>

                                  <div>
                                    <label className="block text-[9.5px] font-semibold text-[#94A3B8] uppercase mb-1 font-mono">
                                      Stage Description
                                    </label>
                                    <textarea
                                      rows={2}
                                      value={stage.description || ''}
                                      onChange={(e) => updateStage(idx, { description: e.target.value })}
                                      className="w-full px-2.5 py-1.5 rounded bg-[#0E131F] border border-[#1E293B] text-white text-xs leading-relaxed"
                                    />
                                  </div>

                                  {renderImageDropzone({
                                    title: `Stage 0${idx + 1} Background Image`,
                                    currentValue: stage.image,
                                    defaultValue: '/assets/hero-2.webp',
                                    fieldKey: `scroll-stage-${idx}`,
                                    onReset: () => updateStage(idx, { image: '/assets/hero-2.webp' }),
                                    onUpdate: (newUrl) => updateStage(idx, { image: newUrl }),
                                  })}

                                  {/* Stage 2 Spotlight Card Fields */}
                                  {idx === 1 && (
                                    <div className="p-3 rounded-lg bg-[#0B0F17] border border-white/5 space-y-2.5">
                                      <div className="text-[10px] font-mono uppercase tracking-wider text-[#E69D2B]">
                                        Stage 02 Spotlight Profile Card
                                      </div>
                                      <div className="grid grid-cols-2 gap-2">
                                        <input
                                          type="text"
                                          value={stage.spotlight?.name || ''}
                                          onChange={(e) =>
                                            updateStage(idx, {
                                              spotlight: { ...(stage.spotlight || {}), name: e.target.value },
                                            })
                                          }
                                          placeholder="Name"
                                          className="px-2.5 py-1.5 rounded bg-[#131926] border border-[#1E293B] text-white text-xs"
                                        />
                                        <input
                                          type="text"
                                          value={stage.spotlight?.role || ''}
                                          onChange={(e) =>
                                            updateStage(idx, {
                                              spotlight: { ...(stage.spotlight || {}), role: e.target.value },
                                            })
                                          }
                                          placeholder="Role"
                                          className="px-2.5 py-1.5 rounded bg-[#131926] border border-[#1E293B] text-[#E69D2B] text-xs"
                                        />
                                      </div>
                                      <textarea
                                        rows={2}
                                        value={stage.spotlight?.bio || ''}
                                        onChange={(e) =>
                                          updateStage(idx, {
                                            spotlight: { ...(stage.spotlight || {}), bio: e.target.value },
                                          })
                                        }
                                        placeholder="Profile bio..."
                                        className="w-full px-2.5 py-1.5 rounded bg-[#131926] border border-[#1E293B] text-white text-xs"
                                      />
                                      {renderImageDropzone({
                                        title: 'Spotlight Portrait Image',
                                        currentValue: stage.spotlight?.image || '/assets/img 7.webp',
                                        defaultValue: '/assets/img 7.webp',
                                        fieldKey: 'scroll-stage-2-spotlight',
                                        onReset: () =>
                                          updateStage(idx, {
                                            spotlight: { ...(stage.spotlight || {}), image: '/assets/img 7.webp' },
                                          }),
                                        onUpdate: (newUrl) =>
                                          updateStage(idx, {
                                            spotlight: { ...(stage.spotlight || {}), image: newUrl },
                                          }),
                                      })}
                                    </div>
                                  )}

                                  {/* Stage 3 Side Callout Fields */}
                                  {idx === 2 && (
                                    <div className="p-3 rounded-lg bg-[#0B0F17] border border-white/5 space-y-2">
                                      <div className="text-[10px] font-mono uppercase tracking-wider text-[#E69D2B]">
                                        Stage 03 Side Callout
                                      </div>
                                      <textarea
                                        rows={2}
                                        value={stage.sideNote || ''}
                                        onChange={(e) => updateStage(idx, { sideNote: e.target.value })}
                                        placeholder="Right-hand side note..."
                                        className="w-full px-2.5 py-1.5 rounded bg-[#131926] border border-[#1E293B] text-white text-xs"
                                      />
                                      <input
                                        type="text"
                                        value={stage.sideAccent || ''}
                                        onChange={(e) => updateStage(idx, { sideAccent: e.target.value })}
                                        placeholder="Amber accent tagline"
                                        className="w-full px-2.5 py-1.5 rounded bg-[#131926] border border-[#1E293B] text-[#E69D2B] text-xs"
                                      />
                                    </div>
                                  )}

                                  {/* Stage 4 Action Buttons */}
                                  {idx === 3 && (
                                    <div className="p-3 rounded-lg bg-[#0B0F17] border border-white/5 space-y-2">
                                      <div className="text-[10px] font-mono uppercase tracking-wider text-[#E69D2B]">
                                        Stage 04 Action Buttons
                                      </div>
                                      <div className="grid grid-cols-2 gap-2">
                                        <input
                                          type="text"
                                          value={stage.primaryCtaLabel || ''}
                                          onChange={(e) => updateStage(idx, { primaryCtaLabel: e.target.value })}
                                          placeholder="Primary CTA Label"
                                          className="px-2.5 py-1.5 rounded bg-[#131926] border border-[#1E293B] text-white text-xs"
                                        />
                                        <select
                                          value={stage.primaryCtaRoute || 'contact'}
                                          onChange={(e) => updateStage(idx, { primaryCtaRoute: e.target.value })}
                                          className="px-2.5 py-1.5 rounded bg-[#131926] border border-[#1E293B] text-white text-xs"
                                        >
                                          <option value="contact">Contact Page</option>
                                          <option value="services">Services Page</option>
                                        </select>
                                        <input
                                          type="text"
                                          value={stage.secondaryCtaLabel || ''}
                                          onChange={(e) => updateStage(idx, { secondaryCtaLabel: e.target.value })}
                                          placeholder="Secondary CTA Label"
                                          className="px-2.5 py-1.5 rounded bg-[#131926] border border-[#1E293B] text-white text-xs"
                                        />
                                        <select
                                          value={stage.secondaryCtaRoute || 'services'}
                                          onChange={(e) => updateStage(idx, { secondaryCtaRoute: e.target.value })}
                                          className="px-2.5 py-1.5 rounded bg-[#131926] border border-[#1E293B] text-white text-xs"
                                        >
                                          <option value="services">Services Page</option>
                                          <option value="contact">Contact Page</option>
                                        </select>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* BLOCK 05: TALENT SOLUTIONS ESTIMATOR */}
              <div className="bg-[#1E293B]/60 rounded-2xl p-5 mb-4 border-0 shadow-lg">
                <button
                  type="button"
                  onClick={() => handleBlockToggle('home-block-05', '#staffing-momentum')}
                  className="w-full flex items-center justify-between text-left cursor-pointer select-none"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-[#E69D2B]/15 flex items-center justify-center font-mono text-xs font-bold text-[#E69D2B]">
                      05
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-white font-sans">
                        Block 05: Talent Solutions Estimator (Orbit &amp; Benchmarks)
                      </h3>
                      <p className="text-[11px] text-[#64748B]">
                        Enterprise Overview Copy, Orbit Heading, and Delivery Multipliers
                      </p>
                    </div>
                  </div>
                  {isBlockExpanded('home-block-05') ? (
                    <ChevronUp className="w-4 h-4 text-[#94A3B8]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#94A3B8]" />
                  )}
                </button>

                {isBlockExpanded('home-block-05') && (
                  <div className="mt-4 pt-4 border-t border-white/5 space-y-3.5 text-xs">
                    <div>
                      <label className="block text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1 font-mono">
                        Estimator Eyebrow
                      </label>
                      <input
                        type="text"
                        value={draftContent.home?.calculator?.eyebrow || 'SAHARA STAFFING INC. / TALENT OVERVIEW'}
                        onChange={(e) => updateDraft('home.calculator', { ...draftContent.home?.calculator, eyebrow: e.target.value })}
                        className="w-full px-3 py-1.5 rounded bg-[#131926] border border-[#1E293B] text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1 font-mono">
                        Headline
                      </label>
                      <input
                        type="text"
                        value={draftContent.home?.calculator?.headline || 'Solutions That Move Business Forward.'}
                        onChange={(e) => updateDraft('home.calculator', { ...draftContent.home?.calculator, headline: e.target.value })}
                        className="w-full px-3 py-1.5 rounded bg-[#131926] border border-[#1E293B] text-white font-medium"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[9.5px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1 font-mono">
                          Center Orbit Label
                        </label>
                        <input
                          type="text"
                          value={draftContent.home?.calculator?.orbitLabel || 'Sahara Talent Orbit'}
                          onChange={(e) => updateDraft('home.calculator', { ...draftContent.home?.calculator, orbitLabel: e.target.value })}
                          className="w-full px-2.5 py-1.5 rounded bg-[#131926] border border-[#1E293B] text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[9.5px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1 font-mono">
                          Orbit Summary Line 2
                        </label>
                        <input
                          type="text"
                          value={draftContent.home?.calculator?.bottomLine2 || 'Technical Contracting & Executive Search'}
                          onChange={(e) => updateDraft('home.calculator', { ...draftContent.home?.calculator, bottomLine2: e.target.value })}
                          className="w-full px-2.5 py-1.5 rounded bg-[#131926] border border-[#1E293B] text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[9.5px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1 font-mono">
                          Direct Scope %
                        </label>
                        <input
                          type="number"
                          value={draftContent.home?.calculator?.feeMultiplier || 20}
                          onChange={(e) => updateDraft('home.calculator', { ...draftContent.home?.calculator, feeMultiplier: Number(e.target.value) })}
                          className="w-full px-2 py-1.5 rounded bg-[#131926] border border-[#1E293B] text-[#E69D2B] font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-[9.5px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1 font-mono">
                          SLA Days
                        </label>
                        <input
                          type="number"
                          value={draftContent.home?.calculator?.timeToFillDays || 14}
                          onChange={(e) => updateDraft('home.calculator', { ...draftContent.home?.calculator, timeToFillDays: Number(e.target.value) })}
                          className="w-full px-2 py-1.5 rounded bg-[#131926] border border-[#1E293B] text-white font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-[9.5px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1 font-mono">
                          Guarantee Days
                        </label>
                        <input
                          type="number"
                          value={draftContent.home?.calculator?.retentionGuaranteeDays || 90}
                          onChange={(e) => updateDraft('home.calculator', { ...draftContent.home?.calculator, retentionGuaranteeDays: Number(e.target.value) })}
                          className="w-full px-2 py-1.5 rounded bg-[#131926] border border-[#1E293B] text-[#E69D2B] font-bold"
                        />
                      </div>
                    </div>

                    {renderStrictButtonManager({
                      buttons: draftContent.home?.calculator?.buttons || [
                        { id: 'btn-calc-1', enabled: true, label: 'Explore Solutions →', destination: '/contact', variant: 'primary' },
                      ],
                      sectionName: 'Estimator Section',
                      onAdd: () => {
                        const current = draftContent.home?.calculator?.buttons || [];
                        if (current.length >= 2) return;
                        updateDraft('home.calculator', {
                          ...draftContent.home?.calculator,
                          buttons: [...current, { id: 'calc-' + Date.now(), enabled: true, label: 'Discuss Hiring', destination: '/contact', variant: 'secondary' }],
                        });
                      },
                      onRemove: (idx) => {
                        const current = (draftContent.home?.calculator?.buttons || []).filter((_, i) => i !== idx);
                        updateDraft('home.calculator', { ...draftContent.home?.calculator, buttons: current });
                      },
                      onToggle: (idx) => {
                        const current = [...(draftContent.home?.calculator?.buttons || [])];
                        current[idx] = { ...current[idx], enabled: !current[idx].enabled };
                        updateDraft('home.calculator', { ...draftContent.home?.calculator, buttons: current });
                      },
                      onUpdate: (idx, field, value) => {
                        const current = [...(draftContent.home?.calculator?.buttons || [])];
                        current[idx] = { ...current[idx], [field]: value };
                        updateDraft('home.calculator', { ...draftContent.home?.calculator, buttons: current });
                      },
                    })}
                  </div>
                )}
              </div>

              {/* BLOCK 06: TESTIMONIALS CAROUSEL */}
              <div className="bg-[#1E293B]/60 rounded-2xl p-5 mb-4 border-0 shadow-lg">
                <button
                  type="button"
                  onClick={() => handleBlockToggle('home-block-06', '#testimonials-section')}
                  className="w-full flex items-center justify-between text-left cursor-pointer select-none"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-[#E69D2B]/15 flex items-center justify-center font-mono text-xs font-bold text-[#E69D2B]">
                      06
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-white font-sans">
                        Block 06: Testimonials Carousel
                      </h3>
                      <p className="text-[11px] text-[#64748B]">
                        Enterprise Partner Quotes, Reviewer Names, and Avatars
                      </p>
                    </div>
                  </div>
                  {isBlockExpanded('home-block-06') ? (
                    <ChevronUp className="w-4 h-4 text-[#94A3B8]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#94A3B8]" />
                  )}
                </button>

                {isBlockExpanded('home-block-06') && (
                  <div className="mt-4 pt-4 border-t border-white/5 space-y-4 text-xs">
                    <div className="p-3 rounded-xl bg-[#131926] border border-[#1E293B] space-y-2">
                      <input
                        type="text"
                        value={draftContent.home?.testimonialsSection?.eyebrow || 'TRUSTED BY GLOBAL LEADERSHIP'}
                        onChange={(e) =>
                          updateDraft('home.testimonialsSection', {
                            ...(draftContent.home?.testimonialsSection || {}),
                            eyebrow: e.target.value,
                          })
                        }
                        placeholder="Section Eyebrow"
                        className="w-full px-2.5 py-1.5 rounded bg-[#0E131F] border border-[#1E293B] text-[#E69D2B] text-xs"
                      />
                      <input
                        type="text"
                        value={draftContent.home?.testimonialsSection?.headline || 'Measured by outcomes. Backed by partners.'}
                        onChange={(e) =>
                          updateDraft('home.testimonialsSection', {
                            ...(draftContent.home?.testimonialsSection || {}),
                            headline: e.target.value,
                          })
                        }
                        placeholder="Section Headline"
                        className="w-full px-2.5 py-1.5 rounded bg-[#0E131F] border border-[#1E293B] text-white font-semibold text-xs"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10.5px] font-bold text-[#E69D2B] uppercase tracking-wider font-mono">
                        Active Reviews ({draftContent.testimonials?.length || 0})
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const newTest = {
                            id: 'test-' + Date.now(),
                            name: 'Executive Partner',
                            title: 'VP of Technology at High-Growth Enterprise',
                            quote: 'â€œSahara Staffing transformed our hiring velocity with exceptionally vetted candidates.â€',
                            image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
                            avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
                          };
                          const updated = [...(draftContent.testimonials || []), newTest];
                          updateDraft('testimonials', updated);
                          updateDraft('home.testimonials', updated);
                        }}
                        className="px-2.5 py-1 rounded bg-[#1E293B] hover:bg-[#E69D2B] text-white hover:text-[#0B0F17] font-semibold text-[10.5px] transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add Testimonial</span>
                      </button>
                    </div>

                    {(draftContent.testimonials || []).map((t, idx) => (
                      <div key={t.id || idx} className="p-3.5 rounded-xl bg-[#131926] border border-[#1E293B] space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono text-[#E69D2B] font-semibold">Review 0{idx + 1}</span>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = draftContent.testimonials.filter((_, i) => i !== idx);
                              updateDraft('testimonials', updated);
                              updateDraft('home.testimonials', updated);
                            }}
                            className="text-[#64748B] hover:text-red-400 p-1 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={t.name || ''}
                            onChange={(e) => {
                              const list = [...draftContent.testimonials];
                              list[idx] = { ...list[idx], name: e.target.value };
                              updateDraft('testimonials', list);
                              updateDraft('home.testimonials', list);
                            }}
                            placeholder="Name..."
                            className="px-2 py-1 rounded bg-[#0E131F] border border-[#1E293B] text-white text-xs"
                          />
                          <input
                            type="text"
                            value={t.title || t.role || ''}
                            onChange={(e) => {
                              const list = [...draftContent.testimonials];
                              list[idx] = { ...list[idx], title: e.target.value, role: e.target.value };
                              updateDraft('testimonials', list);
                              updateDraft('home.testimonials', list);
                            }}
                            placeholder="Company Title..."
                            className="px-2 py-1 rounded bg-[#0E131F] border border-[#1E293B] text-white text-xs"
                          />
                        </div>

                        <textarea
                          rows={2}
                          value={t.quote || ''}
                          onChange={(e) => {
                            const list = [...draftContent.testimonials];
                            list[idx] = { ...list[idx], quote: e.target.value };
                            updateDraft('testimonials', list);
                            updateDraft('home.testimonials', list);
                          }}
                          className="w-full px-2 py-1 rounded bg-[#0E131F] border border-[#1E293B] text-white text-xs"
                        />

                        <div className="flex items-center gap-2">
                          <img src={t.avatar || t.image} alt="Avatar" className="w-6 h-6 rounded-full object-cover" />
                          <input
                            type="text"
                            value={t.avatar || t.image || ''}
                            onChange={(e) => {
                              const list = [...draftContent.testimonials];
                              list[idx] = { ...list[idx], avatar: e.target.value, image: e.target.value };
                              updateDraft('testimonials', list);
                              updateDraft('home.testimonials', list);
                            }}
                            placeholder="Avatar URL..."
                            className="flex-1 px-2 py-1 rounded bg-[#0E131F] border border-[#1E293B] text-white text-[10px] font-mono"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* BLOCK 07: FAQS */}
              <div className="bg-[#1E293B]/60 rounded-2xl p-5 mb-4 border-0 shadow-lg">
                <button
                  type="button"
                  onClick={() => handleBlockToggle('home-block-07', '#faq-section')}
                  className="w-full flex items-center justify-between text-left cursor-pointer select-none"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-[#E69D2B]/15 flex items-center justify-center font-mono text-xs font-bold text-[#E69D2B]">
                      07
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-white font-sans">
                        Block 07: Frequently Asked Questions
                      </h3>
                      <p className="text-[11px] text-[#64748B]">
                        Accordion Q&amp;A pairs for client clarity and SLA guidance
                      </p>
                    </div>
                  </div>
                  {isBlockExpanded('home-block-07') ? (
                    <ChevronUp className="w-4 h-4 text-[#94A3B8]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#94A3B8]" />
                  )}
                </button>

                {isBlockExpanded('home-block-07') && (
                  <div className="mt-4 pt-4 border-t border-white/5 space-y-4 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[10.5px] font-bold text-[#E69D2B] uppercase tracking-wider font-mono">
                        Questions ({draftContent.faqs?.length || 0})
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const newFaq = {
                            id: 'faq-' + Date.now(),
                            question: 'How does the Sahara 90-day continuity commitment work?',
                            answer: 'Every staffing placement includes transparent onboarding milestones and a 90-day continuity performance guarantee.',
                          };
                          const updated = [...(draftContent.faqs || []), newFaq];
                          updateDraft('faqs', updated);
                          updateDraft('home.faqs', updated);
                        }}
                        className="px-2.5 py-1 rounded bg-[#1E293B] hover:bg-[#E69D2B] text-white hover:text-[#0B0F17] font-semibold text-[10.5px] transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add Question</span>
                      </button>
                    </div>

                    {(draftContent.faqs || []).map((faq, idx) => (
                      <div key={faq.id || idx} className="p-3 rounded-xl bg-[#131926] border border-[#1E293B] space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <input
                            type="text"
                            value={faq.question}
                            onChange={(e) => {
                              const list = [...draftContent.faqs];
                              list[idx] = { ...list[idx], question: e.target.value };
                              updateDraft('faqs', list);
                              updateDraft('home.faqs', list);
                            }}
                            className="w-full px-2.5 py-1.5 rounded bg-[#0E131F] border border-[#1E293B] text-white font-medium text-xs"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const updated = draftContent.faqs.filter((_, i) => i !== idx);
                              updateDraft('faqs', updated);
                              updateDraft('home.faqs', updated);
                            }}
                            className="text-[#64748B] hover:text-red-400 p-1 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <textarea
                          rows={2}
                          value={faq.answer}
                          onChange={(e) => {
                            const list = [...draftContent.faqs];
                            list[idx] = { ...list[idx], answer: e.target.value };
                            updateDraft('faqs', list);
                            updateDraft('home.faqs', list);
                          }}
                          className="w-full px-2.5 py-1.5 rounded bg-[#0E131F] border border-[#1E293B] text-[#CBD5E1] text-xs leading-relaxed"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* BLOCK 08: BOTTOM CTA & FOOTER */}
              <div className="bg-[#1E293B]/60 rounded-2xl p-5 mb-4 border-0 shadow-lg">
                <button
                  type="button"
                  onClick={() => handleBlockToggle('home-block-08', '#footer-section')}
                  className="w-full flex items-center justify-between text-left cursor-pointer select-none"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-[#E69D2B]/15 flex items-center justify-center font-mono text-xs font-bold text-[#E69D2B]">
                      08
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-white font-sans">
                        Block 08: Bottom CTA &amp; Footer
                      </h3>
                      <p className="text-[11px] text-[#64748B]">
                        Closing CTA Headline, Tagline, Office Details &amp; Contact Email
                      </p>
                    </div>
                  </div>
                  {isBlockExpanded('home-block-08') ? (
                    <ChevronUp className="w-4 h-4 text-[#94A3B8]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#94A3B8]" />
                  )}
                </button>

                {isBlockExpanded('home-block-08') && (
                  <div className="mt-4 pt-4 border-t border-white/5 space-y-3.5 text-xs">
                    <div>
                      <label className="block text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1 font-mono">
                        Closing Banner Headline
                      </label>
                      <input
                        type="text"
                        value={draftContent.home?.footer?.headline || 'Ready for Strategic Scale?'}
                        onChange={(e) => updateDraft('home.footer', { ...draftContent.home?.footer, headline: e.target.value })}
                        className="w-full px-3 py-1.5 rounded bg-[#131926] border border-[#1E293B] text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1 font-mono">
                        Footer Brand Tagline
                      </label>
                      <textarea
                        rows={2}
                        value={draftContent.home?.footer?.brandTagline || ''}
                        onChange={(e) => updateDraft('home.footer', { ...draftContent.home?.footer, brandTagline: e.target.value })}
                        className="w-full px-3 py-1.5 rounded bg-[#131926] border border-[#1E293B] text-white"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[9.5px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1 font-mono">
                          Office Title
                        </label>
                        <input
                          type="text"
                          value={draftContent.home?.footer?.officeTitle || 'Global Executive Office'}
                          onChange={(e) => updateDraft('home.footer', { ...draftContent.home?.footer, officeTitle: e.target.value })}
                          className="w-full px-2.5 py-1.5 rounded bg-[#131926] border border-[#1E293B] text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[9.5px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1 font-mono">
                          Official Contact Email
                        </label>
                        <input
                          type="text"
                          value={draftContent.home?.footer?.contactEmail || 'contact@sahara-staffing.com'}
                          onChange={(e) => updateDraft('home.footer', { ...draftContent.home?.footer, contactEmail: e.target.value })}
                          className="w-full px-2.5 py-1.5 rounded bg-[#131926] border border-[#1E293B] text-white font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[9.5px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1 font-mono">
                          Office Subtitle
                        </label>
                        <input
                          type="text"
                          value={draftContent.home?.footer?.officeDesc || ''}
                          onChange={(e) => updateDraft('home.footer', { ...draftContent.home?.footer, officeDesc: e.target.value })}
                          className="w-full px-2.5 py-1.5 rounded bg-[#131926] border border-[#1E293B] text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[9.5px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1 font-mono">
                          Footer Solutions Link Label
                        </label>
                        <input
                          type="text"
                          value={draftContent.home?.footer?.ctaExploreLabel || 'View Solutions'}
                          onChange={(e) => updateDraft('home.footer', { ...draftContent.home?.footer, ctaExploreLabel: e.target.value })}
                          className="w-full px-2.5 py-1.5 rounded bg-[#131926] border border-[#1E293B] text-white"
                        />
                      </div>
                    </div>

                    {renderStrictButtonManager({
                      buttons: draftContent.home?.footer?.buttons || [
                        { id: 'btn-foot-1', enabled: true, label: 'Get Started →', destination: '/contact', variant: 'primary' },
                      ],
                      sectionName: 'Footer CTA',
                      onAdd: () => {
                        const current = draftContent.home?.footer?.buttons || [];
                        if (current.length >= 2) return;
                        updateDraft('home.footer', {
                          ...draftContent.home?.footer,
                          buttons: [...current, { id: 'btn-foot-2', enabled: true, label: 'Explore Services', destination: '/services', variant: 'secondary' }],
                        });
                      },
                      onRemove: (idx) => {
                        const current = (draftContent.home?.footer?.buttons || []).filter((_, i) => i !== idx);
                        updateDraft('home.footer', { ...draftContent.home?.footer, buttons: current });
                      },
                      onToggle: (idx) => {
                        const current = [...(draftContent.home?.footer?.buttons || [])];
                        current[idx] = { ...current[idx], enabled: !current[idx].enabled };
                        updateDraft('home.footer', { ...draftContent.home?.footer, buttons: current });
                      },
                      onUpdate: (idx, field, value) => {
                        const current = [...(draftContent.home?.footer?.buttons || [])];
                        current[idx] = { ...current[idx], [field]: value };
                        updateDraft('home.footer', { ...draftContent.home?.footer, buttons: current });
                      },
                    })}

                    {onOpenAdditionalSettings && (
                      <div className="p-3 rounded-lg bg-[#0B0F17] border border-white/5 flex items-center justify-between gap-2">
                        <span className="text-[11px] text-[#94A3B8]">
                          Social media links &amp; footer copyright text are managed in Additional Settings.
                        </span>
                        <button
                          type="button"
                          onClick={onOpenAdditionalSettings}
                          className="px-2.5 py-1 rounded bg-[#1E293B] hover:bg-[#E69D2B] hover:text-[#0B0F17] text-[#E69D2B] text-[10.5px] font-semibold shrink-0 cursor-pointer transition-colors"
                        >
                          Open Settings
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB B: ABOUT PAGE (COMPLETE DYNAMIC EDITORS)                      */}
          {/* ================================================================= */}
          {activePageTab === 'about' && (
            <div className="space-y-3">
              {/* BLOCK 01: HERO SECTION */}
              <div className="bg-[#1E293B]/60 rounded-2xl p-5 mb-4 border-0 shadow-lg">
                <button
                  type="button"
                  onClick={() => handleBlockToggle('about-block-01', '#about-hero')}
                  className="w-full flex items-center justify-between text-left cursor-pointer select-none"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-[#E69D2B]/15 flex items-center justify-center font-mono text-xs font-bold text-[#E69D2B]">
                      01
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-white font-sans">
                        Block 01: About Hero Section
                      </h3>
                      <p className="text-[11px] text-[#64748B]">Kicker, Headline, Badges, Hero Portrait &amp; CTAs</p>
                    </div>
                  </div>
                  {isBlockExpanded('about-block-01') ? <ChevronUp className="w-4 h-4 text-[#94A3B8]" /> : <ChevronDown className="w-4 h-4 text-[#94A3B8]" />}
                </button>

                {isBlockExpanded('about-block-01') && (
                  <div className="mt-4 pt-4 border-t border-white/5 space-y-3 text-xs">
                    <div>
                      <label className="block text-[10px] font-semibold text-[#94A3B8] uppercase mb-1 font-mono">Kicker Eyebrow</label>
                      <input
                        type="text"
                        value={draftContent.about?.hero?.kicker || 'SAHARA STAFFING INC. / WHO WE ARE'}
                        onChange={(e) => updateDraft('about.hero', { ...draftContent.about?.hero, kicker: e.target.value })}
                        className="w-full px-2.5 py-1.5 rounded bg-[#131926] border border-[#1E293B] text-white"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-semibold text-[#94A3B8] uppercase mb-1 font-mono">Headline</label>
                        <input
                          type="text"
                          value={draftContent.about?.hero?.headline || 'Strategy Built on Precision'}
                          onChange={(e) => updateDraft('about.hero', { ...draftContent.about?.hero, headline: e.target.value })}
                          className="w-full px-2.5 py-1.5 rounded bg-[#131926] border border-[#1E293B] text-white font-medium"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-[#94A3B8] uppercase mb-1 font-mono">Highlight Word</label>
                        <input
                          type="text"
                          value={draftContent.about?.hero?.highlightWord || 'Precision'}
                          onChange={(e) => updateDraft('about.hero', { ...draftContent.about?.hero, highlightWord: e.target.value })}
                          className="w-full px-2.5 py-1.5 rounded bg-[#131926] border border-[#1E293B] text-[#E69D2B]"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-[#94A3B8] uppercase mb-1 font-mono">Subtitle</label>
                      <textarea
                        rows={2}
                        value={draftContent.about?.hero?.subtitle || ''}
                        onChange={(e) => updateDraft('about.hero', { ...draftContent.about?.hero, subtitle: e.target.value })}
                        className="w-full px-2.5 py-1.5 rounded bg-[#131926] border border-[#1E293B] text-white"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-semibold text-[#94A3B8] uppercase mb-1 font-mono">Image Badge Left</label>
                        <input
                          type="text"
                          value={draftContent.about?.hero?.heroImageBadgeLeft || 'People-Centered Strategy'}
                          onChange={(e) => updateDraft('about.hero', { ...draftContent.about?.hero, heroImageBadgeLeft: e.target.value })}
                          className="w-full px-2.5 py-1.5 rounded bg-[#131926] border border-[#1E293B] text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-[#94A3B8] uppercase mb-1 font-mono">Image Badge Right</label>
                        <input
                          type="text"
                          value={draftContent.about?.hero?.heroImageBadgeRight || 'Sahara Staffing Inc.'}
                          onChange={(e) => updateDraft('about.hero', { ...draftContent.about?.hero, heroImageBadgeRight: e.target.value })}
                          className="w-full px-2.5 py-1.5 rounded bg-[#131926] border border-[#1E293B] text-[#E69D2B]"
                        />
                      </div>
                    </div>
                    {renderImageDropzone({
                      title: 'About Hero Portrait Image',
                      currentValue: draftContent.about?.hero?.heroImage || '/assets/img 14.webp',
                      defaultValue: '/assets/img 14.webp',
                      fieldKey: 'about-hero-img',
                      onReset: () => updateDraft('about.hero', { ...draftContent.about?.hero, heroImage: '/assets/img 14.webp' }),
                      onUpdate: (newUrl) => updateDraft('about.hero', { ...draftContent.about?.hero, heroImage: newUrl }),
                    })}
                    {renderStrictButtonManager({
                      buttons: draftContent.about?.hero?.buttons || [],
                      sectionName: 'About Hero',
                      onAdd: () => {
                        const current = draftContent.about?.hero?.buttons || [];
                        if (current.length >= 2) return;
                        updateDraft('about.hero', {
                          ...draftContent.about?.hero,
                          buttons: [...current, { id: 'about-' + Date.now(), enabled: true, label: 'Get Started', destination: '/contact', variant: 'primary' }],
                        });
                      },
                      onRemove: (idx) => updateDraft('about.hero', { ...draftContent.about?.hero, buttons: (draftContent.about?.hero?.buttons || []).filter((_, i) => i !== idx) }),
                      onToggle: (idx) => {
                        const current = [...(draftContent.about?.hero?.buttons || [])];
                        current[idx] = { ...current[idx], enabled: !current[idx].enabled };
                        updateDraft('about.hero', { ...draftContent.about?.hero, buttons: current });
                      },
                      onUpdate: (idx, field, value) => {
                        const current = [...(draftContent.about?.hero?.buttons || [])];
                        current[idx] = { ...current[idx], [field]: value };
                        updateDraft('about.hero', { ...draftContent.about?.hero, buttons: current });
                      },
                    })}
                  </div>
                )}
              </div>

              {/* BLOCK 02: PERSPECTIVE, HUMAN MOMENT & CORE VALUES */}
              <div className="bg-[#1E293B]/60 rounded-2xl p-5 mb-4 border-0 shadow-lg">
                <button
                  type="button"
                  onClick={() => handleBlockToggle('about-block-02', '#about-benchmarks')}
                  className="w-full flex items-center justify-between text-left cursor-pointer select-none"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-[#E69D2B]/15 flex items-center justify-center font-mono text-xs font-bold text-[#E69D2B]">
                      02
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-white font-sans">Block 02: Perspective Story &amp; Core Values</h3>
                      <p className="text-[11px] text-[#64748B]">Story Paragraphs, Editorial Feature Image &amp; Core Values List</p>
                    </div>
                  </div>
                  {isBlockExpanded('about-block-02') ? <ChevronUp className="w-4 h-4 text-[#94A3B8]" /> : <ChevronDown className="w-4 h-4 text-[#94A3B8]" />}
                </button>

                {isBlockExpanded('about-block-02') && (
                  <div className="mt-4 pt-4 border-t border-white/5 space-y-4 text-xs">
                    {/* Perspective Story Copy */}
                    <div className="p-3 rounded-xl bg-[#131926] border border-[#1E293B] space-y-2">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#E69D2B] block">Story Perspective Band</span>
                      <input
                        type="text"
                        value={draftContent.about?.perspective?.headline || ''}
                        onChange={(e) => updateDraft('about.perspective', { ...draftContent.about?.perspective, headline: e.target.value })}
                        placeholder="Perspective Headline"
                        className="w-full px-2.5 py-1.5 rounded bg-[#0E131F] border border-[#1E293B] text-white font-medium"
                      />
                      <textarea
                        rows={2}
                        value={draftContent.about?.perspective?.paragraph1 || ''}
                        onChange={(e) => updateDraft('about.perspective', { ...draftContent.about?.perspective, paragraph1: e.target.value })}
                        placeholder="Story Paragraph 1"
                        className="w-full px-2.5 py-1.5 rounded bg-[#0E131F] border border-[#1E293B] text-white"
                      />
                      <textarea
                        rows={2}
                        value={draftContent.about?.perspective?.paragraph2 || ''}
                        onChange={(e) => updateDraft('about.perspective', { ...draftContent.about?.perspective, paragraph2: e.target.value })}
                        placeholder="Story Paragraph 2"
                        className="w-full px-2.5 py-1.5 rounded bg-[#0E131F] border border-[#1E293B] text-white"
                      />
                    </div>

                    {/* Human Moment Feature Photo */}
                    <div className="p-3 rounded-xl bg-[#131926] border border-[#1E293B] space-y-2.5">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#E69D2B] block">Cinematic Statement Card</span>
                      <input
                        type="text"
                        value={draftContent.about?.humanMoment?.headline || ''}
                        onChange={(e) => updateDraft('about.humanMoment', { ...draftContent.about?.humanMoment, headline: e.target.value })}
                        placeholder="Statement Headline"
                        className="w-full px-2.5 py-1.5 rounded bg-[#0E131F] border border-[#1E293B] text-white font-medium"
                      />
                      <textarea
                        rows={2}
                        value={draftContent.about?.humanMoment?.description || ''}
                        onChange={(e) => updateDraft('about.humanMoment', { ...draftContent.about?.humanMoment, description: e.target.value })}
                        placeholder="Statement Description"
                        className="w-full px-2.5 py-1.5 rounded bg-[#0E131F] border border-[#1E293B] text-white"
                      />
                      {renderImageDropzone({
                        title: 'Statement Feature Photography',
                        currentValue: draftContent.about?.humanMoment?.image || '/assets/img 4.webp',
                        defaultValue: '/assets/img 4.webp',
                        fieldKey: 'about-human-moment-img',
                        onReset: () => updateDraft('about.humanMoment', { ...draftContent.about?.humanMoment, image: '/assets/img 4.webp' }),
                        onUpdate: (newUrl) => updateDraft('about.humanMoment', { ...draftContent.about?.humanMoment, image: newUrl }),
                      })}
                    </div>

                    {/* Core Values Header & Items */}
                    <div className="p-3 rounded-xl bg-[#131926] border border-[#1E293B] space-y-2">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#E69D2B] block">Core Values Section Header</span>
                      <input
                        type="text"
                        value={draftContent.about?.principlesSection?.headline || 'A more thoughtful approach.'}
                        onChange={(e) => updateDraft('about.principlesSection', { ...draftContent.about?.principlesSection, headline: e.target.value })}
                        className="w-full px-2.5 py-1.5 rounded bg-[#0E131F] border border-[#1E293B] text-white font-medium"
                      />
                      <textarea
                        rows={2}
                        value={draftContent.about?.principlesSection?.subtitle || ''}
                        onChange={(e) => updateDraft('about.principlesSection', { ...draftContent.about?.principlesSection, subtitle: e.target.value })}
                        className="w-full px-2.5 py-1.5 rounded bg-[#0E131F] border border-[#1E293B] text-white"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[10.5px] font-bold text-[#E69D2B] uppercase tracking-wider font-mono">
                        Core Values ({(draftContent.about?.benchmarks || []).length})
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const current = draftContent.about?.benchmarks || [];
                          updateDraft('about.benchmarks', [
                            ...current,
                            { num: `0${current.length + 1}`, title: 'New Core Value', desc: 'Guiding principle description.' },
                          ]);
                        }}
                        className="px-2.5 py-1 rounded bg-[#1E293B] hover:bg-[#E69D2B] text-white hover:text-[#0B0F17] font-semibold text-[10.5px] inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" /> Add Core Value
                      </button>
                    </div>

                    {(draftContent.about?.benchmarks || []).map((b, idx) => (
                      <div key={idx} className="p-3 rounded-lg bg-[#131926] border border-[#1E293B] space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[#E69D2B] font-bold">{b.num || `0${idx + 1}`}</span>
                          <input
                            type="text"
                            value={b.title}
                            onChange={(e) => {
                              const list = [...(draftContent.about?.benchmarks || [])];
                              list[idx] = { ...list[idx], title: e.target.value };
                              updateDraft('about.benchmarks', list);
                            }}
                            className="flex-1 px-2 py-1 rounded bg-[#0E131F] border border-[#1E293B] text-white font-semibold"
                          />
                          {(draftContent.about?.benchmarks || []).length > 1 && (
                            <button
                              type="button"
                              onClick={() =>
                                updateDraft(
                                  'about.benchmarks',
                                  (draftContent.about?.benchmarks || []).filter((_, i) => i !== idx)
                                )
                              }
                              className="p-1 text-slate-400 hover:text-red-400 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                        <textarea
                          rows={2}
                          value={b.desc}
                          onChange={(e) => {
                            const list = [...(draftContent.about?.benchmarks || [])];
                            list[idx] = { ...list[idx], desc: e.target.value };
                            updateDraft('about.benchmarks', list);
                          }}
                          className="w-full px-2 py-1 rounded bg-[#0E131F] border border-[#1E293B] text-white"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* BLOCK 03: MINDSET CHAPTERS */}
              <div id="editor-about-block-03" className="bg-[#1E293B]/60 rounded-2xl p-5 mb-4 border-0 shadow-lg scroll-mt-4">
                <button
                  type="button"
                  onClick={() => handleBlockToggle('about-block-03', '#about-mindset')}
                  className="w-full flex items-center justify-between text-left cursor-pointer select-none"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-[#E69D2B]/15 flex items-center justify-center font-mono text-xs font-bold text-[#E69D2B]">
                      03
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-white font-sans">Block 03: Mindset Chapters &amp; Imagery</h3>
                      <p className="text-[11px] text-[#64748B]">Story chapters, section headers &amp; chapter photography</p>
                    </div>
                  </div>
                  {isBlockExpanded('about-block-03') ? <ChevronUp className="w-4 h-4 text-[#94A3B8]" /> : <ChevronDown className="w-4 h-4 text-[#94A3B8]" />}
                </button>

                {isBlockExpanded('about-block-03') && (
                  <div className="mt-4 pt-4 border-t border-white/5 space-y-3.5 text-xs">
                    <div className="p-3 rounded-xl bg-[#131926] border border-[#1E293B] space-y-2">
                      <input
                        type="text"
                        value={draftContent.about?.mindsetSection?.headline || 'A disciplined approach to every engagement.'}
                        onChange={(e) => updateDraft('about.mindsetSection', { ...draftContent.about?.mindsetSection, headline: e.target.value })}
                        placeholder="Mindset Section Headline"
                        className="w-full px-2.5 py-1.5 rounded bg-[#0E131F] border border-[#1E293B] text-white font-medium"
                      />
                      <textarea
                        rows={2}
                        value={draftContent.about?.mindsetSection?.subtitle || ''}
                        onChange={(e) => updateDraft('about.mindsetSection', { ...draftContent.about?.mindsetSection, subtitle: e.target.value })}
                        placeholder="Mindset Section Subtitle"
                        className="w-full px-2.5 py-1.5 rounded bg-[#0E131F] border border-[#1E293B] text-white"
                      />
                    </div>

                    <div className="p-3 rounded-xl bg-[#131926] border border-[#1E293B] space-y-2">
                      <label className="block text-[10px] font-semibold text-[#94A3B8] uppercase font-mono">
                        Mindset Narrative Layout Engine
                      </label>
                      <div className="grid grid-cols-2 gap-2 bg-[#0B0F17] p-1 rounded-lg border border-white/10">
                        <button
                          type="button"
                          onClick={() => updateDraft('about.chaptersLayout', 'sticky')}
                          className={`px-2 py-1.5 rounded text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                            (draftContent.about?.chaptersLayout || 'sticky') === 'sticky'
                              ? 'bg-[#E69D2B] text-[#0B0F17] font-bold shadow'
                              : 'text-[#94A3B8] hover:text-white'
                          }`}
                        >
                          <span>Sticky Hijack</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => updateDraft('about.chaptersLayout', 'grid')}
                          className={`px-2 py-1.5 rounded text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                            draftContent.about?.chaptersLayout === 'grid'
                              ? 'bg-[#E69D2B] text-[#0B0F17] font-bold shadow'
                              : 'text-[#94A3B8] hover:text-white'
                          }`}
                        >
                          <span>Static Cards</span>
                        </button>
                      </div>
                    </div>

                    {(draftContent.about?.chapters || []).map((ch, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl bg-[#131926] border border-[#1E293B] space-y-2.5">
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={ch.badge || ''}
                            onChange={(e) => {
                              const list = [...(draftContent.about?.chapters || [])];
                              list[idx] = { ...list[idx], badge: e.target.value };
                              updateDraft('about.chapters', list);
                            }}
                            className="px-2 py-1 rounded bg-[#0E131F] border border-[#1E293B] text-[#E69D2B] font-mono text-[11px]"
                          />
                          <input
                            type="text"
                            value={ch.tag || ''}
                            onChange={(e) => {
                              const list = [...(draftContent.about?.chapters || [])];
                              list[idx] = { ...list[idx], tag: e.target.value };
                              updateDraft('about.chapters', list);
                            }}
                            className="px-2 py-1 rounded bg-[#0E131F] border border-[#1E293B] text-white/80 text-[11px]"
                          />
                        </div>
                        <input
                          type="text"
                          value={ch.title}
                          onChange={(e) => {
                            const list = [...(draftContent.about?.chapters || [])];
                            list[idx] = { ...list[idx], title: e.target.value };
                            updateDraft('about.chapters', list);
                          }}
                          className="w-full px-2 py-1 rounded bg-[#0E131F] border border-[#1E293B] text-white font-medium"
                        />
                        <textarea
                          rows={2}
                          value={ch.text}
                          onChange={(e) => {
                            const list = [...(draftContent.about?.chapters || [])];
                            list[idx] = { ...list[idx], text: e.target.value };
                            updateDraft('about.chapters', list);
                          }}
                          className="w-full px-2 py-1 rounded bg-[#0E131F] border border-[#1E293B] text-white"
                        />
                        {renderImageDropzone({
                          title: `${ch.badge} (${ch.tag}) Imagery`,
                          currentValue: ch.image,
                          fieldKey: `about-ch-${idx}`,
                          onUpdate: (newUrl) => {
                            const list = [...(draftContent.about?.chapters || [])];
                            list[idx] = { ...list[idx], image: newUrl };
                            updateDraft('about.chapters', list);
                          },
                        })}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* BLOCK 04: HARD SCALE STATS & PHILOSOPHY PIPELINE */}
              <div id="editor-about-block-04" className="bg-[#1E293B]/60 rounded-2xl p-5 mb-4 border-0 shadow-lg scroll-mt-4">
                <button
                  type="button"
                  onClick={() => handleBlockToggle('about-block-04', '#about-stats')}
                  className="w-full flex items-center justify-between text-left cursor-pointer select-none"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-[#E69D2B]/15 flex items-center justify-center font-mono text-xs font-bold text-[#E69D2B]">
                      04
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-white font-sans">Block 04: Scale Stats &amp; Philosophy Radar</h3>
                      <p className="text-[11px] text-[#64748B]">Metrics cards and Philosophy Radar Quote</p>
                    </div>
                  </div>
                  {isBlockExpanded('about-block-04') ? <ChevronUp className="w-4 h-4 text-[#94A3B8]" /> : <ChevronDown className="w-4 h-4 text-[#94A3B8]" />}
                </button>

                {isBlockExpanded('about-block-04') && (
                  <div className="mt-4 pt-4 border-t border-white/5 space-y-4 text-xs">
                    <div className="grid grid-cols-2 gap-3">
                      {(draftContent.about?.stats || []).map((s, idx) => (
                        <div key={idx} className="p-3 rounded-lg bg-[#131926] border border-[#1E293B] space-y-1">
                          <input
                            type="text"
                            value={s.value}
                            onChange={(e) => {
                              const list = [...(draftContent.about?.stats || [])];
                              list[idx] = { ...list[idx], value: e.target.value };
                              updateDraft('about.stats', list);
                            }}
                            className="w-full px-2 py-1 rounded bg-[#0E131F] border border-[#1E293B] text-[#E69D2B] font-bold text-sm"
                          />
                          <input
                            type="text"
                            value={s.label}
                            onChange={(e) => {
                              const list = [...(draftContent.about?.stats || [])];
                              list[idx] = { ...list[idx], label: e.target.value };
                              updateDraft('about.stats', list);
                            }}
                            className="w-full px-2 py-1 rounded bg-[#0E131F] border border-[#1E293B] text-white text-[11px]"
                          />
                        </div>
                      ))}
                    </div>

                    <div className="p-3 rounded-xl bg-[#131926] border border-[#1E293B] space-y-2">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#E69D2B] block">Philosophy Radar Quote</span>
                      <input
                        type="text"
                        value={draftContent.about?.pipeline?.quotePrefix || ''}
                        onChange={(e) => updateDraft('about.pipeline', { ...draftContent.about?.pipeline, quotePrefix: e.target.value })}
                        placeholder="Quote Prefix"
                        className="w-full px-2.5 py-1.5 rounded bg-[#0E131F] border border-[#1E293B] text-white"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={draftContent.about?.pipeline?.quoteHighlight || ''}
                          onChange={(e) => updateDraft('about.pipeline', { ...draftContent.about?.pipeline, quoteHighlight: e.target.value })}
                          placeholder="Gold Highlight Phrase"
                          className="px-2.5 py-1.5 rounded bg-[#0E131F] border border-[#1E293B] text-[#E69D2B]"
                        />
                        <input
                          type="text"
                          value={draftContent.about?.pipeline?.quoteSuffix || ''}
                          onChange={(e) => updateDraft('about.pipeline', { ...draftContent.about?.pipeline, quoteSuffix: e.target.value })}
                          placeholder="Quote Suffix"
                          className="px-2.5 py-1.5 rounded bg-[#0E131F] border border-[#1E293B] text-white"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* BLOCK 05: FINAL CTA */}
              <div id="editor-about-block-05" className="bg-[#1E293B]/60 rounded-2xl p-5 mb-4 border-0 shadow-lg scroll-mt-4">
                <button
                  type="button"
                  onClick={() => handleBlockToggle('about-block-05', '#about-final-cta')}
                  className="w-full flex items-center justify-between text-left cursor-pointer select-none"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-[#E69D2B]/15 flex items-center justify-center font-mono text-xs font-bold text-[#E69D2B]">
                      05
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-white font-sans">Block 05: Final CTA</h3>
                      <p className="text-[11px] text-[#64748B]">About Page closing banner and actions</p>
                    </div>
                  </div>
                  {isBlockExpanded('about-block-05') ? <ChevronUp className="w-4 h-4 text-[#94A3B8]" /> : <ChevronDown className="w-4 h-4 text-[#94A3B8]" />}
                </button>

                {isBlockExpanded('about-block-05') && (
                  <div className="mt-4 pt-4 border-t border-white/5 space-y-3 text-xs">
                    <div>
                      <label className="block text-[10px] font-semibold text-[#94A3B8] uppercase mb-1 font-mono">Closing Eyebrow</label>
                      <input
                        type="text"
                        value={draftContent.about?.finalCta?.eyebrow || 'SAHARA STAFFING INC.'}
                        onChange={(e) => updateDraft('about.finalCta', { ...draftContent.about?.finalCta, eyebrow: e.target.value })}
                        className="w-full px-2.5 py-1.5 rounded bg-[#131926] border border-[#1E293B] text-[#E69D2B]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-[#94A3B8] uppercase mb-1 font-mono">Closing Headline</label>
                      <input
                        type="text"
                        value={draftContent.about?.finalCta?.headline || 'Let’s build the momentum behind your next stage.'}
                        onChange={(e) => updateDraft('about.finalCta', { ...draftContent.about?.finalCta, headline: e.target.value })}
                        className="w-full px-2.5 py-1.5 rounded bg-[#131926] border border-[#1E293B] text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-[#94A3B8] uppercase mb-1 font-mono">Closing Subtitle</label>
                      <textarea
                        rows={2}
                        value={draftContent.about?.finalCta?.subtitle || 'From exploratory strategy sessions to immediate enterprise execution, Sahara is your long-term partner.'}
                        onChange={(e) => updateDraft('about.finalCta', { ...draftContent.about?.finalCta, subtitle: e.target.value })}
                        className="w-full px-2.5 py-1.5 rounded bg-[#131926] border border-[#1E293B] text-white"
                      />
                    </div>
                    {renderImageDropzone({
                      title: 'Final CTA Background Image Override',
                      currentValue: draftContent.about?.finalCta?.backgroundImage || '/assets/hero-2.webp',
                      defaultValue: '/assets/hero-2.webp',
                      fieldKey: 'about-final-cta-bg',
                      onReset: () => {
                        updateDraft('about.finalCta', {
                          ...draftContent.about?.finalCta,
                          backgroundImage: '/assets/hero-2.webp',
                        });
                      },
                      onUpdate: (newUrl) => {
                        updateDraft('about.finalCta', {
                          ...draftContent.about?.finalCta,
                          backgroundImage: newUrl,
                        });
                      },
                    })}
                    {renderStrictButtonManager({
                      buttons: draftContent.about?.finalCta?.buttons || [],
                      sectionName: 'About Closing CTA',
                      onAdd: () => {
                        const current = draftContent.about?.finalCta?.buttons || [];
                        if (current.length >= 2) return;
                        updateDraft('about.finalCta', {
                          ...draftContent.about?.finalCta,
                          buttons: [...current, { id: 'cta-' + Date.now(), enabled: true, label: 'Get Started', destination: '/contact', variant: 'primary' }],
                        });
                      },
                      onRemove: (idx) => updateDraft('about.finalCta', { ...draftContent.about?.finalCta, buttons: (draftContent.about?.finalCta?.buttons || []).filter((_, i) => i !== idx) }),
                      onToggle: (idx) => {
                        const current = [...(draftContent.about?.finalCta?.buttons || [])];
                        current[idx] = { ...current[idx], enabled: !current[idx].enabled };
                        updateDraft('about.finalCta', { ...draftContent.about?.finalCta, buttons: current });
                      },
                      onUpdate: (idx, field, value) => {
                        const current = [...(draftContent.about?.finalCta?.buttons || [])];
                        current[idx] = { ...current[idx], [field]: value };
                        updateDraft('about.finalCta', { ...draftContent.about?.finalCta, buttons: current });
                      },
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB C: SERVICES PAGE (FULL DYNAMIC SECTIONS & CARDS MANAGER)      */}
          {/* ================================================================= */}
          {activePageTab === 'services' && (
            <div className="space-y-3">
              {/* BLOCK 01: HERO */}
              <div className="bg-[#1E293B]/60 rounded-2xl p-5 mb-4 border-0 shadow-lg">
                <button
                  type="button"
                  onClick={() => handleBlockToggle('services-block-01', '#services-hero')}
                  className="w-full flex items-center justify-between text-left cursor-pointer select-none"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-[#E69D2B]/15 flex items-center justify-center font-mono text-xs font-bold text-[#E69D2B]">
                      01
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-white font-sans">Block 01: Services Hero</h3>
                      <p className="text-[11px] text-[#64748B]">Kicker, Headline, Quote, Pillars &amp; Panoramic Banner</p>
                    </div>
                  </div>
                  {isBlockExpanded('services-block-01') ? <ChevronUp className="w-4 h-4 text-[#94A3B8]" /> : <ChevronDown className="w-4 h-4 text-[#94A3B8]" />}
                </button>

                {isBlockExpanded('services-block-01') && (
                  <div className="mt-4 pt-4 border-t border-white/5 space-y-3.5 text-xs">
                    <div>
                      <label className="block text-[10px] font-semibold text-[#94A3B8] uppercase mb-1 font-mono">Kicker Eyebrow</label>
                      <input
                        type="text"
                        value={draftContent.servicesPage?.hero?.kicker || 'SAHARA STAFFING INC. / OUR SERVICES'}
                        onChange={(e) => updateDraft('servicesPage.hero', { ...draftContent.servicesPage?.hero, kicker: e.target.value })}
                        className="w-full px-2.5 py-1.5 rounded bg-[#131926] border border-[#1E293B] text-white"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-semibold text-[#94A3B8] uppercase mb-1 font-mono">Headline</label>
                        <input
                          type="text"
                          value={draftContent.servicesPage?.hero?.headline || 'Execution is the difference.'}
                          onChange={(e) => updateDraft('servicesPage.hero', { ...draftContent.servicesPage?.hero, headline: e.target.value })}
                          className="w-full px-2.5 py-1.5 rounded bg-[#131926] border border-[#1E293B] text-white font-medium"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-[#94A3B8] uppercase mb-1 font-mono">Highlight Word</label>
                        <input
                          type="text"
                          value={draftContent.servicesPage?.hero?.highlightWord || 'difference.'}
                          onChange={(e) => updateDraft('servicesPage.hero', { ...draftContent.servicesPage?.hero, highlightWord: e.target.value })}
                          className="w-full px-2.5 py-1.5 rounded bg-[#131926] border border-[#1E293B] text-[#E69D2B]"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-[#94A3B8] uppercase mb-1 font-mono">Supporting Quote</label>
                      <textarea
                        rows={2}
                        value={draftContent.servicesPage?.hero?.quote || ''}
                        onChange={(e) => updateDraft('servicesPage.hero', { ...draftContent.servicesPage?.hero, quote: e.target.value })}
                        className="w-full px-2.5 py-1.5 rounded bg-[#131926] border border-[#1E293B] text-white"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-semibold text-[#94A3B8] uppercase mb-1 font-mono">Banner Caption</label>
                        <input
                          type="text"
                          value={draftContent.servicesPage?.hero?.panoramicCaption || ''}
                          onChange={(e) => updateDraft('servicesPage.hero', { ...draftContent.servicesPage?.hero, panoramicCaption: e.target.value })}
                          className="w-full px-2.5 py-1.5 rounded bg-[#131926] border border-[#1E293B] text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-[#94A3B8] uppercase mb-1 font-mono">Service Pillars (comma-separated)</label>
                        <input
                          type="text"
                          value={(draftContent.servicesPage?.hero?.pillars || ['Executive Search', 'Staff Augmentation', 'Dedicated Squads']).join(', ')}
                          onChange={(e) =>
                            updateDraft('servicesPage.hero', {
                              ...draftContent.servicesPage?.hero,
                              pillars: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                            })
                          }
                          className="w-full px-2.5 py-1.5 rounded bg-[#131926] border border-[#1E293B] text-white"
                        />
                      </div>
                    </div>
                    {renderImageDropzone({
                      title: 'Panoramic Hero Header Banner',
                      currentValue: draftContent.servicesPage?.hero?.panoramicImage || '/assets/img 23.webp',
                      defaultValue: '/assets/img 23.webp',
                      fieldKey: 'services-panoramic',
                      onReset: () => updateDraft('servicesPage.hero', { ...draftContent.servicesPage?.hero, panoramicImage: '/assets/img 23.webp' }),
                      onUpdate: (newUrl) => updateDraft('servicesPage.hero', { ...draftContent.servicesPage?.hero, panoramicImage: newUrl }),
                    })}
                  </div>
                )}
              </div>

              {/* BLOCK 02: SERVICE CARDS & CAPABILITIES */}
              <div className="bg-[#1E293B]/60 rounded-2xl p-5 mb-4 border-0 shadow-lg">
                <button
                  type="button"
                  onClick={() => handleBlockToggle('services-block-02', '#services-capabilities')}
                  className="w-full flex items-center justify-between text-left cursor-pointer select-none"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-[#E69D2B]/15 flex items-center justify-center font-mono text-xs font-bold text-[#E69D2B]">
                      02
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-white font-sans">Block 02: Service Cards &amp; Capabilities</h3>
                      <p className="text-[11px] text-[#64748B]">Section Header, Subheader, Service Cards, Images &amp; CTAs</p>
                    </div>
                  </div>
                  {isBlockExpanded('services-block-02') ? <ChevronUp className="w-4 h-4 text-[#94A3B8]" /> : <ChevronDown className="w-4 h-4 text-[#94A3B8]" />}
                </button>

                {isBlockExpanded('services-block-02') && (() => {
                  const capSec = draftContent.servicesPage?.capabilitiesSection || {
                    sectionHeader: 'Core Service Pillars',
                    sectionSubheader: '',
                    items: [],
                  };
                  const items = Array.isArray(capSec.items) ? capSec.items : [];
                  const updateCapSec = (partial) => updateDraft('servicesPage.capabilitiesSection', { ...capSec, ...partial });

                  return (
                    <div className="mt-4 pt-4 border-t border-white/5 space-y-4 text-xs">
                      <div className="p-3 rounded-xl bg-[#131926] border border-[#1E293B] space-y-2.5">
                        <div>
                          <label className="block text-[9.5px] font-semibold text-[#94A3B8] uppercase mb-1 font-mono">Section Header</label>
                          <input
                            type="text"
                            value={capSec.sectionHeader || ''}
                            onChange={(e) => updateCapSec({ sectionHeader: e.target.value })}
                            className="w-full px-2.5 py-1.5 rounded bg-[#0E131F] border border-[#1E293B] text-white font-semibold"
                          />
                        </div>
                        <div>
                          <label className="block text-[9.5px] font-semibold text-[#94A3B8] uppercase mb-1 font-mono">Section Subheader</label>
                          <textarea
                            rows={2}
                            value={capSec.sectionSubheader || ''}
                            onChange={(e) => updateCapSec({ sectionSubheader: e.target.value })}
                            className="w-full px-2.5 py-1.5 rounded bg-[#0E131F] border border-[#1E293B] text-white"
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-[10.5px] font-bold text-[#E69D2B] uppercase tracking-wider font-mono">
                          Service Cards ({items.length})
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            const nextNum = `0${items.length + 1}`;
                            updateCapSec({
                              items: [
                                ...items,
                                {
                                  id: `cap-${Date.now()}`,
                                  number: nextNum,
                                  badge: 'NEW SERVICE PILLAR',
                                  title: 'Strategic Execution',
                                  highlightWord: 'at scale.',
                                  description: 'Tailored enterprise solutions designed around measurable objectives.',
                                  ctaLabel: 'Inquire About Solution',
                                  ctaDestination: '/contact',
                                  image: '/assets/img 8.webp',
                                  fallbackImage: '/assets/hero-2.webp',
                                  alt: 'Sahara Staffing Inc. service card',
                                  theme: items.length % 2 === 0 ? 'dark' : 'light',
                                },
                              ],
                            });
                          }}
                          className="px-2.5 py-1 rounded bg-[#1E293B] hover:bg-[#E69D2B] text-white hover:text-[#0B0F17] font-semibold text-[10.5px] inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" /> Add Service Card
                        </button>
                      </div>

                      {items.map((item, idx) => (
                        <div key={item.id || idx} className="p-3.5 rounded-xl bg-[#131926] border border-[#1E293B] space-y-2.5">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-mono text-[#E69D2B] font-bold">
                              {item.number || `0${idx + 1}`} — {item.badge || 'Service Card'}
                            </span>
                            {items.length > 1 && (
                              <button
                                type="button"
                                onClick={() => updateCapSec({ items: items.filter((_, i) => i !== idx) })}
                                className="text-slate-400 hover:text-red-400 p-1 cursor-pointer"
                                title="Remove Service Card"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>

                          <div className="grid grid-cols-3 gap-2">
                            <input
                              type="text"
                              value={item.number || ''}
                              onChange={(e) => {
                                const list = [...items];
                                list[idx] = { ...list[idx], number: e.target.value };
                                updateCapSec({ items: list });
                              }}
                              placeholder="01"
                              className="px-2 py-1 rounded bg-[#0E131F] border border-[#1E293B] text-[#E69D2B] font-mono"
                            />
                            <input
                              type="text"
                              value={item.badge || ''}
                              onChange={(e) => {
                                const list = [...items];
                                list[idx] = { ...list[idx], badge: e.target.value };
                                updateCapSec({ items: list });
                              }}
                              placeholder="BADGE LABEL"
                              className="col-span-2 px-2 py-1 rounded bg-[#0E131F] border border-[#1E293B] text-white"
                            />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            <input
                              type="text"
                              value={item.title || ''}
                              onChange={(e) => {
                                const list = [...items];
                                list[idx] = { ...list[idx], title: e.target.value };
                                updateCapSec({ items: list });
                              }}
                              placeholder="Card Title"
                              className="sm:col-span-2 px-2 py-1 rounded bg-[#0E131F] border border-[#1E293B] text-white font-medium"
                            />
                            <input
                              type="text"
                              value={item.highlightWord || ''}
                              onChange={(e) => {
                                const list = [...items];
                                list[idx] = { ...list[idx], highlightWord: e.target.value };
                                updateCapSec({ items: list });
                              }}
                              placeholder="Highlight Word"
                              className="px-2 py-1 rounded bg-[#0E131F] border border-[#1E293B] text-[#E69D2B]"
                            />
                          </div>

                          <textarea
                            rows={2}
                            value={item.description || ''}
                            onChange={(e) => {
                              const list = [...items];
                              list[idx] = { ...list[idx], description: e.target.value };
                              updateCapSec({ items: list });
                            }}
                            className="w-full px-2 py-1 rounded bg-[#0E131F] border border-[#1E293B] text-white"
                          />

                          <div className="grid grid-cols-3 gap-2">
                            <input
                              type="text"
                              value={item.ctaLabel || ''}
                              onChange={(e) => {
                                const list = [...items];
                                list[idx] = { ...list[idx], ctaLabel: e.target.value };
                                updateCapSec({ items: list });
                              }}
                              placeholder="CTA Label"
                              className="px-2 py-1 rounded bg-[#0E131F] border border-[#1E293B] text-white"
                            />
                            <select
                              value={item.ctaDestination || '/contact'}
                              onChange={(e) => {
                                const list = [...items];
                                list[idx] = { ...list[idx], ctaDestination: e.target.value };
                                updateCapSec({ items: list });
                              }}
                              className="px-2 py-1 rounded bg-[#0E131F] border border-[#1E293B] text-white"
                            >
                              <option value="/contact">/contact</option>
                              <option value="/about">/about</option>
                              <option value="/services">/services</option>
                            </select>
                            <select
                              value={item.theme || 'dark'}
                              onChange={(e) => {
                                const list = [...items];
                                list[idx] = { ...list[idx], theme: e.target.value };
                                updateCapSec({ items: list });
                              }}
                              className="px-2 py-1 rounded bg-[#0E131F] border border-[#1E293B] text-white"
                            >
                              <option value="dark">Dark Surface</option>
                              <option value="light">Warm Cream</option>
                            </select>
                          </div>

                          {renderImageDropzone({
                            title: `Card 0${idx + 1} Image`,
                            currentValue: item.image || '/assets/img 15.webp',
                            defaultValue: '/assets/img 15.webp',
                            fieldKey: `srv-cap-${idx}`,
                            onReset: () => {
                              const list = [...items];
                              list[idx] = { ...list[idx], image: '/assets/img 15.webp' };
                              updateCapSec({ items: list });
                            },
                            onUpdate: (newUrl) => {
                              const list = [...items];
                              list[idx] = { ...list[idx], image: newUrl };
                              updateCapSec({ items: list });
                            },
                          })}
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>

              {/* BLOCK 03: THE SAHARA APPROACH */}
              <div className="bg-[#1E293B]/60 rounded-2xl p-5 mb-4 border-0 shadow-lg">
                <button
                  type="button"
                  onClick={() => handleBlockToggle('services-block-03', '#services-sla')}
                  className="w-full flex items-center justify-between text-left cursor-pointer select-none"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-[#E69D2B]/15 flex items-center justify-center font-mono text-xs font-bold text-[#E69D2B]">
                      03
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-white font-sans">Block 03: Our Approach (3-Step Methodology)</h3>
                      <p className="text-[11px] text-[#64748B]">Eyebrow, Headline, Continuity Badge &amp; Delivery Steps</p>
                    </div>
                  </div>
                  {isBlockExpanded('services-block-03') ? <ChevronUp className="w-4 h-4 text-[#94A3B8]" /> : <ChevronDown className="w-4 h-4 text-[#94A3B8]" />}
                </button>

                {isBlockExpanded('services-block-03') && (() => {
                  const app = draftContent.servicesPage?.approach || {};
                  const steps = Array.isArray(app.steps) ? app.steps : [];
                  const updateApp = (partial) => updateDraft('servicesPage.approach', { ...app, ...partial });

                  return (
                    <div className="mt-4 pt-4 border-t border-white/5 space-y-3 text-xs">
                      <input
                        type="text"
                        value={app.eyebrow || 'THE SAHARA APPROACH'}
                        onChange={(e) => updateApp({ eyebrow: e.target.value })}
                        placeholder="Eyebrow"
                        className="w-full px-2.5 py-1.5 rounded bg-[#131926] border border-[#1E293B] text-[#E69D2B]"
                      />
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <input
                          type="text"
                          value={app.headline || ''}
                          onChange={(e) => updateApp({ headline: e.target.value })}
                          placeholder="Headline"
                          className="sm:col-span-2 px-2.5 py-1.5 rounded bg-[#131926] border border-[#1E293B] text-white font-medium"
                        />
                        <input
                          type="text"
                          value={app.highlightWord || ''}
                          onChange={(e) => updateApp({ highlightWord: e.target.value })}
                          placeholder="Highlight Word"
                          className="px-2.5 py-1.5 rounded bg-[#131926] border border-[#1E293B] text-[#E69D2B]"
                        />
                      </div>
                      <textarea
                        rows={2}
                        value={app.subtitle || ''}
                        onChange={(e) => updateApp({ subtitle: e.target.value })}
                        placeholder="Methodology Subtitle"
                        className="w-full px-2.5 py-1.5 rounded bg-[#131926] border border-[#1E293B] text-white"
                      />
                      <input
                        type="text"
                        value={app.guaranteeBadge || ''}
                        onChange={(e) => updateApp({ guaranteeBadge: e.target.value })}
                        placeholder="Continuity Commitment Badge"
                        className="w-full px-2.5 py-1.5 rounded bg-[#131926] border border-[#1E293B] text-white"
                      />

                      {steps.map((st, idx) => (
                        <div key={idx} className="p-3 rounded-lg bg-[#131926] border border-[#1E293B] space-y-1.5">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[#E69D2B] font-bold">{st.num || `0${idx + 1}`}</span>
                            <input
                              type="text"
                              value={st.title || ''}
                              onChange={(e) => {
                                const list = [...steps];
                                list[idx] = { ...list[idx], title: e.target.value };
                                updateApp({ steps: list });
                              }}
                              className="flex-1 px-2 py-1 rounded bg-[#0E131F] border border-[#1E293B] text-white font-semibold"
                            />
                          </div>
                          <textarea
                            rows={2}
                            value={st.desc || ''}
                            onChange={(e) => {
                              const list = [...steps];
                              list[idx] = { ...list[idx], desc: e.target.value };
                              updateApp({ steps: list });
                            }}
                            className="w-full px-2 py-1 rounded bg-[#0E131F] border border-[#1E293B] text-white"
                          />
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>

              {/* BLOCK 04: CLOSING CTA */}
              <div className="bg-[#1E293B]/60 rounded-2xl p-5 mb-4 border-0 shadow-lg">
                <button
                  type="button"
                  onClick={() => handleBlockToggle('services-block-04', '#services-sla')}
                  className="w-full flex items-center justify-between text-left cursor-pointer select-none"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-[#E69D2B]/15 flex items-center justify-center font-mono text-xs font-bold text-[#E69D2B]">
                      04
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-white font-sans">Block 04: Closing Call to Action</h3>
                      <p className="text-[11px] text-[#64748B]">Closing Headline, Quote &amp; Primary Action Button</p>
                    </div>
                  </div>
                  {isBlockExpanded('services-block-04') ? <ChevronUp className="w-4 h-4 text-[#94A3B8]" /> : <ChevronDown className="w-4 h-4 text-[#94A3B8]" />}
                </button>

                {isBlockExpanded('services-block-04') && (() => {
                  const cta = draftContent.servicesPage?.closingCta || {};
                  const updateCta = (partial) => updateDraft('servicesPage.closingCta', { ...cta, ...partial });

                  return (
                    <div className="mt-4 pt-4 border-t border-white/5 space-y-3 text-xs">
                      <input
                        type="text"
                        value={cta.eyebrow || ''}
                        onChange={(e) => updateCta({ eyebrow: e.target.value })}
                        placeholder="Eyebrow"
                        className="w-full px-2.5 py-1.5 rounded bg-[#131926] border border-[#1E293B] text-[#E69D2B]"
                      />
                      <input
                        type="text"
                        value={cta.headline || ''}
                        onChange={(e) => updateCta({ headline: e.target.value })}
                        placeholder="Headline"
                        className="w-full px-2.5 py-1.5 rounded bg-[#131926] border border-[#1E293B] text-white font-medium"
                      />
                      <textarea
                        rows={2}
                        value={cta.quote || ''}
                        onChange={(e) => updateCta({ quote: e.target.value })}
                        placeholder="Closing Quote"
                        className="w-full px-2.5 py-1.5 rounded bg-[#131926] border border-[#1E293B] text-white"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={cta.ctaLabel || 'Get in Touch'}
                          onChange={(e) => updateCta({ ctaLabel: e.target.value })}
                          placeholder="Button Label"
                          className="px-2.5 py-1.5 rounded bg-[#131926] border border-[#1E293B] text-white font-semibold"
                        />
                        <select
                          value={cta.ctaDestination || '/contact'}
                          onChange={(e) => updateCta({ ctaDestination: e.target.value })}
                          className="px-2.5 py-1.5 rounded bg-[#131926] border border-[#1E293B] text-white"
                        >
                          <option value="/contact">/contact</option>
                          <option value="/about">/about</option>
                        </select>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB D: CONTACT PAGE (COMPLETE CONSULTATION & INTAKE MANAGER)      */}
          {/* ================================================================= */}
          {activePageTab === 'contact' && (
            <div className="space-y-3">
              <div className="bg-[#1E293B]/60 rounded-2xl p-5 mb-4 border-0 shadow-lg">
                <button
                  type="button"
                  onClick={() => handleBlockToggle('contact-block-01', '#contact-workspace')}
                  className="w-full flex items-center justify-between text-left cursor-pointer select-none"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-[#E69D2B]/15 flex items-center justify-center font-mono text-xs font-bold text-[#E69D2B]">
                      01
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-white font-sans">
                        Block 01: Contact Form &amp; Consultation Intake Manager
                      </h3>
                      <p className="text-[11px] text-[#64748B]">Headline, Intake Routing, Direct Contact Info &amp; Service Areas</p>
                    </div>
                  </div>
                  {isBlockExpanded('contact-block-01') ? <ChevronUp className="w-4 h-4 text-[#94A3B8]" /> : <ChevronDown className="w-4 h-4 text-[#94A3B8]" />}
                </button>

                {isBlockExpanded('contact-block-01') && (
                  <div className="mt-4 pt-4 border-t border-white/5 space-y-3.5 text-xs">
                    <div>
                      <label className="block text-[10px] font-semibold text-[#94A3B8] uppercase mb-1 font-mono">Kicker Eyebrow</label>
                      <input
                        type="text"
                        value={draftContent.contactPage?.hero?.kicker || 'SAHARA STAFFING INC. / CLIENT CONSULTATION'}
                        onChange={(e) => updateDraft('contactPage.hero', { ...draftContent.contactPage?.hero, kicker: e.target.value })}
                        className="w-full px-2.5 py-1.5 rounded bg-[#131926] border border-[#1E293B] text-[#E69D2B]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-semibold text-[#94A3B8] uppercase mb-1 font-mono">Headline</label>
                        <input
                          type="text"
                          value={draftContent.contactPage?.hero?.headline || 'Your next milestone starts with a conversation.'}
                          onChange={(e) => updateDraft('contactPage.hero', { ...draftContent.contactPage?.hero, headline: e.target.value })}
                          className="w-full px-2.5 py-1.5 rounded bg-[#131926] border border-[#1E293B] text-white font-medium"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-[#94A3B8] uppercase mb-1 font-mono">Highlight Word</label>
                        <input
                          type="text"
                          value={draftContent.contactPage?.hero?.highlightWord || 'conversation.'}
                          onChange={(e) => updateDraft('contactPage.hero', { ...draftContent.contactPage?.hero, highlightWord: e.target.value })}
                          className="w-full px-2.5 py-1.5 rounded bg-[#131926] border border-[#1E293B] text-[#E69D2B]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold text-[#94A3B8] uppercase mb-1 font-mono">Subtitle</label>
                      <textarea
                        rows={2}
                        value={draftContent.contactPage?.hero?.subtitle || ''}
                        onChange={(e) => updateDraft('contactPage.hero', { ...draftContent.contactPage?.hero, subtitle: e.target.value })}
                        className="w-full px-2.5 py-1.5 rounded bg-[#131926] border border-[#1E293B] text-white"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[9.5px] font-semibold text-[#94A3B8] uppercase mb-1 font-mono">Form Heading</label>
                        <input
                          type="text"
                          value={draftContent.contactPage?.hero?.formHeading || 'Get in touch.'}
                          onChange={(e) => updateDraft('contactPage.hero', { ...draftContent.contactPage?.hero, formHeading: e.target.value })}
                          className="w-full px-2.5 py-1.5 rounded bg-[#131926] border border-[#1E293B] text-white font-medium"
                        />
                      </div>
                      <div>
                        <label className="block text-[9.5px] font-semibold text-[#94A3B8] uppercase mb-1 font-mono">Submit Button Label</label>
                        <input
                          type="text"
                          value={draftContent.contactPage?.hero?.submitButtonLabel || 'Submit Inquiry'}
                          onChange={(e) => updateDraft('contactPage.hero', { ...draftContent.contactPage?.hero, submitButtonLabel: e.target.value })}
                          className="w-full px-2.5 py-1.5 rounded bg-[#131926] border border-[#1E293B] text-[#E69D2B] font-semibold"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[9.5px] font-semibold text-[#94A3B8] uppercase mb-1 font-mono">Office Title</label>
                        <input
                          type="text"
                          value={draftContent.contactPage?.details?.officeTitle || 'Sahara Executive Office'}
                          onChange={(e) => updateDraft('contactPage.details', { ...draftContent.contactPage?.details, officeTitle: e.target.value })}
                          className="w-full px-2.5 py-1.5 rounded bg-[#131926] border border-[#1E293B] text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[9.5px] font-semibold text-[#94A3B8] uppercase mb-1 font-mono">Routing Email</label>
                        <input
                          type="email"
                          value={draftContent.contactPage?.details?.email || 'contact@sahara-staffing.com'}
                          onChange={(e) => updateDraft('contactPage.details', { ...draftContent.contactPage?.details, email: e.target.value })}
                          className="w-full px-2.5 py-1.5 rounded bg-[#131926] border border-[#1E293B] text-[#E69D2B] font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[9.5px] font-semibold text-[#94A3B8] uppercase mb-1 font-mono">Response Time SLA</label>
                        <input
                          type="text"
                          value={draftContent.contactPage?.details?.responseTime || 'Within 2 hours (Business Hours)'}
                          onChange={(e) => updateDraft('contactPage.details', { ...draftContent.contactPage?.details, responseTime: e.target.value })}
                          className="w-full px-2.5 py-1.5 rounded bg-[#131926] border border-[#1E293B] text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[9.5px] font-semibold text-[#94A3B8] uppercase mb-1 font-mono">Security Protocol Note</label>
                        <input
                          type="text"
                          value={draftContent.contactPage?.details?.protocolNote || 'Confidential Enterprise Consultation Protocol'}
                          onChange={(e) => updateDraft('contactPage.details', { ...draftContent.contactPage?.details, protocolNote: e.target.value })}
                          className="w-full px-2.5 py-1.5 rounded bg-[#131926] border border-[#1E293B] text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[9.5px] font-semibold text-[#94A3B8] uppercase mb-1 font-mono">
                        Service Area Dropdown Options (comma-separated)
                      </label>
                      <input
                        type="text"
                        value={(draftContent.contactPage?.disciplines || []).join(', ')}
                        onChange={(e) =>
                          updateDraft(
                            'contactPage.disciplines',
                            e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                          )
                        }
                        className="w-full px-2.5 py-1.5 rounded bg-[#131926] border border-[#1E293B] text-white"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          </div>
        </div>

        {/* =================================================================== */}
        {/* ZONE B: RIGHT COLUMN — ROUNDED PAGES PILL + LIVE PREVIEW VIEWPORT   */}
        <div className="flex-1 min-w-0 h-full flex flex-col gap-3">
          {/* Top Pill Bar: Pages Navigation (Matches Whiteboard Rounded Pill) */}
          <div className="bg-[#0E131F] border border-white/10 rounded-full p-1.5 flex items-center gap-1 overflow-x-auto no-scrollbar shadow-lg shrink-0 select-none">
            {[
              { id: 'home', label: 'Home Page', icon: Home },
              { id: 'about', label: 'About Page', icon: Info },
              { id: 'services', label: 'Services Page', icon: Briefcase },
              { id: 'contact', label: 'Contact Page', icon: PhoneCall },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activePageTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActivePageTab(tab.id)}
                  className={`relative flex-1 justify-center px-3 py-2 rounded-full font-sans text-xs font-bold transition-all cursor-pointer select-none flex items-center gap-1.5 whitespace-nowrap ${
                    isActive ? 'text-[#0B0F17]' : 'text-[#94A3B8] hover:text-white hover:bg-white/5'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeCmsTab"
                      className="absolute inset-0 bg-[#E69D2B] rounded-full shadow-md z-0"
                      transition={{ type: 'spring', bounce: 0.18, duration: 0.35 }}
                    />
                  )}
                  <Icon
                    className={`w-3.5 h-3.5 relative z-10 shrink-0 ${
                      isActive ? 'text-[#0B0F17]' : 'text-[#E69D2B]'
                    }`}
                  />
                  <span className="relative z-10">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Below Pages Pill: Live Preview Window */}
          <div
            ref={stageRef}
            className="flex-1 min-h-0 flex flex-col relative overflow-hidden bg-[#070A10] border border-white/10 rounded-2xl shadow-2xl"
          >
            {/* Top Browser Chrome Bar */}
            <div className="h-12 px-3 sm:px-4 bg-[#0E131F] border-b border-white/10 flex items-center justify-between gap-2 shrink-0 select-none">
              {/* Left: Lock + URL + Reload (Truncates cleanly, never squeezes Mobile button) */}
              <div className="flex items-center gap-2 min-w-0">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#131926] border border-white/5 text-xs font-mono text-[#94A3B8] min-w-0">
                  <Lock className="w-3.5 h-3.5 text-[#E69D2B] shrink-0" />
                  <span className="text-white/80 truncate hidden sm:inline">saharaenterprise.com</span>
                  <span className="text-[#E69D2B] font-semibold truncate">
                    {activePageTab === 'home' ? '/preview' : `/preview/${activePageTab}`}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setIsRefreshing(true);
                      setPreviewKey((k) => k + 1);
                      setTimeout(() => setIsRefreshing(false), 400);
                    }}
                    className="p-0.5 rounded hover:bg-white/10 text-[#94A3B8] hover:text-[#E69D2B] transition-colors cursor-pointer ml-1 shrink-0"
                    title="Reload Preview Canvas"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#E69D2B]' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Right: Device Switcher (Desktop / Mobile) â€” Never clipped */}
              <div className="flex items-center gap-1.5 bg-[#131926] p-1 rounded-xl border border-white/5 shrink-0">
                <button
                  type="button"
                  onClick={() => setViewportMode('desktop')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                    viewportMode === 'desktop'
                      ? 'bg-[#E69D2B] text-[#0B0F17] shadow-md'
                      : 'text-[#94A3B8] hover:text-white'
                  }`}
                >
                  <Monitor className="w-3.5 h-3.5 shrink-0" />
                  <span>Desktop</span>
                </button>

                <button
                  type="button"
                  onClick={() => setViewportMode('mobile')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                    viewportMode === 'mobile'
                      ? 'bg-[#E69D2B] text-[#0B0F17] shadow-md'
                      : 'text-[#94A3B8] hover:text-white'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5 shrink-0" />
                  <span>Mobile</span>
                </button>
              </div>
            </div>

          {/* Independent Vertical Scroll Viewport */}
          <div
            ref={previewScrollRef}
            data-lenis-prevent
            className={`flex-1 h-full relative custom-scrollbar ${
              viewportMode === 'mobile'
                ? 'overflow-hidden flex items-center justify-center p-3'
                : 'overflow-y-auto overflow-x-hidden overscroll-contain p-3 sm:p-5'
            }`}
            style={{ scrollbarWidth: 'thin', scrollbarColor: '#E69D2B #131926' }}
          >
            <CMSPreviewProvider content={draftContent} settings={settings} key={previewKey}>
              {viewportMode === 'desktop' ? (
                /* SCALED TRUE-DESKTOP PREVIEW (1440px True Dimensions) */
                <div
                  className="mx-auto relative"
                  style={{
                    width: `${1440 * desktopScale}px`,
                    height: contentHeight > 0 ? `${contentHeight * desktopScale + 80}px` : 'auto',
                    minHeight: '100%',
                  }}
                >
                  <div
                    ref={contentRef}
                    style={{
                      width: '1440px',
                      transform: `scale(${desktopScale})`,
                      transformOrigin: 'top left',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      boxShadow: '0 25px 60px -15px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.08)',
                      borderRadius: '16px',
                      overflow: 'hidden',
                      backgroundColor: '#0B0F17',
                    }}
                  >
                    {renderPreviewContent()}
                  </div>
                </div>
              ) : (
                /* AUTHENTIC 375PX MOBILE PHONE CHASSIS â€” SCALED TO FIT WHOLE PHONE IN VIEW */
                <div
                  className="relative shrink-0 mx-auto"
                  style={{
                    width: `${395 * mobileScale}px`,
                    height: `${790 * mobileScale}px`,
                  }}
                >
                  <div
                    style={{
                      width: '395px',
                      height: '790px',
                      transform: `scale(${mobileScale})`,
                      transformOrigin: 'top left',
                    }}
                    className="rounded-[48px] border-[10px] border-[#1E293B] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.1)] bg-[#0B0F17] flex flex-col overflow-hidden"
                  >
                    {/* Dedicated Top Status Bezel with Dynamic Island (Prevents navbar overlap) */}
                    <div className="h-7 shrink-0 bg-[#0B0F17] flex items-center justify-center pointer-events-none">
                      <div className="w-24 h-4 bg-[#05070B] border border-white/10 rounded-full flex items-center justify-center gap-1.5 shadow-inner">
                        <div className="w-2 h-2 rounded-full bg-[#1E293B]" />
                        <div className="w-2.5 h-2.5 rounded-full bg-[#131926] border border-white/10" />
                      </div>
                    </div>

                    {/* True 375px Scrollable Mobile Viewport */}
                    <div className="w-full flex-1 min-h-0 overflow-hidden bg-[#0B0F17]">
                      <MobilePreviewIframe>
                        <CMSPreviewProvider content={draftContent} settings={settings}>
                          {renderPreviewContent()}
                        </CMSPreviewProvider>
                      </MobilePreviewIframe>
                    </div>

                    {/* Dedicated Bottom Home Indicator Bezel */}
                    <div className="h-5 shrink-0 bg-[#0B0F17] flex items-center justify-center pointer-events-none">
                      <div className="w-28 h-1 bg-white/30 rounded-full" />
                    </div>
                  </div>
                </div>
              )}
            </CMSPreviewProvider>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

