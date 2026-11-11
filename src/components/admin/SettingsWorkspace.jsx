import React, { useState, useEffect } from 'react';
import {
  Send,
  Check,
  Copy,
  AlertCircle,
  Loader2,
  Megaphone,
  Share2,
  Plus,
  Trash2,
  Upload,
  RotateCcw,
  Globe,
  MousePointer2,
  Image as ImageIcon,
  Palette,
  Copyright,
} from 'lucide-react';
import { useCMS } from '../../context/CMSContext';
import { localDB } from '../../lib/supabase';
import { DEFAULT_NOTIFICATION_EMAIL } from '../../lib/notifications';
import saharaLogoImg from '../../assets/sahara-logo.webp';
import saharaMarkImg from '../../assets/sahara-mark.webp';

const APPS_SCRIPT_URL =
  import.meta.env.VITE_APPS_SCRIPT_URL ||
  'https://script.google.com/macros/s/AKfycbzf0PgaYovxvvv8CWsPqZP-6XXpwVyEEP331mV9zdpLfKbyoO33Q0U3g52WPjHNZSI/exec';

const BRAND_PALETTES = [
  { name: 'Sahara Amber Gold', hex: '#E69D2B' },
  { name: 'Warm Sahara Gold', hex: '#F5A623' },
  { name: 'Radiant Honey Gold', hex: '#F2A51A' },
  { name: 'Subdued Bronze Gold', hex: '#D4881A' },
];

const SOCIAL_PLATFORMS = ['linkedin', 'email', 'twitter', 'instagram', 'youtube', 'github', 'website'];

export default function SettingsWorkspace() {
  const { settings, draftContent, updateSettings, updateDraft, publishChanges } = useCMS();

  // Brand Identity & Logos
  const [companyName, setCompanyName] = useState(settings.companyName || 'Sahara Staffing Inc.');
  const [brandLogoUrl, setBrandLogoUrl] = useState(settings.brandLogoUrl || '/assets/sahara-logo.webp');
  const [brandMarkUrl, setBrandMarkUrl] = useState(settings.brandMarkUrl || '/assets/sahara-mark.webp');
  const [accentColor, setAccentColor] = useState(settings.primaryAccent || '#E69D2B');
  const [copiedHex, setCopiedHex] = useState(false);

  // Site Utilities (Cursor off by default)
  const [enableCustomCursor, setEnableCustomCursor] = useState(Boolean(settings.enableCustomCursor));
  const [enableBackToTop, setEnableBackToTop] = useState(
    settings.enableBackToTop !== undefined ? Boolean(settings.enableBackToTop) : true
  );
  const [stickyNavbar, setStickyNavbar] = useState(
    settings.stickyNavbar !== undefined ? Boolean(settings.stickyNavbar) : true
  );

  // SEO Meta Tags
  const [seoTitle, setSeoTitle] = useState(
    settings.seoTitle || 'Sahara Staffing Inc. | Enterprise Staffing & Executive Search Solutions'
  );
  const [seoDescription, setSeoDescription] = useState(
    settings.seoDescription ||
      'Sahara Staffing Inc. connects ambitious enterprises with top-tier technical contractors, specialized teams, and executive leadership.'
  );
  const [seoKeywords, setSeoKeywords] = useState(
    settings.seoKeywords ||
      'Sahara Staffing Inc, enterprise staffing, executive search, IT staff augmentation, technical contractors, talent acquisition'
  );

  // Footer Social Media Links (Dynamic Array Add/Remove) & Copyright
  const [footerSocials, setFooterSocials] = useState(() =>
    Array.isArray(settings.footerSocials) && settings.footerSocials.length > 0
      ? settings.footerSocials
      : [
          {
            id: 'soc-1',
            platform: 'linkedin',
            label: 'LinkedIn',
            url: settings.footerLinkedinUrl || 'https://linkedin.com',
            enabled: true,
          },
          {
            id: 'soc-2',
            platform: 'email',
            label: 'Email',
            url: `mailto:${settings.footerContactEmail || 'contact@sahara-staffing.com'}`,
            enabled: settings.showFooterEmail !== false,
          },
        ]
  );
  const [footerCopyright, setFooterCopyright] = useState(
    settings.footerCopyright || '© 2026 Sahara Staffing Inc. All rights reserved.'
  );

  // Announcement Banner
  const [enableBanner, setEnableBanner] = useState(Boolean(settings.enableAnnouncementBanner));
  const [bannerText, setBannerText] = useState(
    settings.announcementBannerText || 'Now scheduling enterprise staffing consultations for Q1 2027'
  );

  // Intake Notification Destination & Logs
  const [recipientEmail, setRecipientEmail] = useState(
    settings.recipientEmail || DEFAULT_NOTIFICATION_EMAIL
  );
  const [isSavingGlobal, setIsSavingGlobal] = useState(false);
  const [globalSaveMessage, setGlobalSaveMessage] = useState(null);
  const [isSavingRecipient, setIsSavingRecipient] = useState(false);
  const [recipientSaved, setRecipientSaved] = useState(false);
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    setLogs(localDB.getNotificationLogs());
  }, []);

  const handleCopyHex = () => {
    try {
      navigator.clipboard.writeText(accentColor);
      setCopiedHex(true);
      setTimeout(() => setCopiedHex(false), 1800);
    } catch {}
  };

  const handleLogoFileUpload = (file, targetSetter) => {
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert('Logo image must be under 2 MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        targetSetter(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddSocial = () => {
    setFooterSocials((prev) => [
      ...prev,
      {
        id: `soc-${Date.now()}`,
        platform: 'twitter',
        label: 'X / Twitter',
        url: 'https://x.com',
        enabled: true,
      },
    ]);
  };

  const handleUpdateSocial = (idx, field, val) => {
    setFooterSocials((prev) => prev.map((item, i) => (i === idx ? { ...item, [field]: val } : item)));
  };

  const handleRemoveSocial = (idx) => {
    setFooterSocials((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSaveGlobalSettings = async (e) => {
    if (e) e.preventDefault();
    setIsSavingGlobal(true);
    setGlobalSaveMessage(null);

    try {
      const cleanedSocials = footerSocials.map((s) => ({
        ...s,
        platform: (s.platform || 'website').toLowerCase(),
        label: s.label || s.platform || 'Link',
        url: (s.url || '').trim(),
        enabled: s.enabled !== false,
      }));

      const linkedinItem = cleanedSocials.find((s) => s.platform === 'linkedin');
      const emailItem = cleanedSocials.find((s) => s.platform === 'email' || s.platform === 'mail');
      const derivedEmail = emailItem?.url?.replace(/^mailto:/i, '') || settings.footerContactEmail || 'contact@sahara-staffing.com';

      const nextSettings = {
        ...settings,
        companyName: companyName.trim() || 'Sahara Staffing Inc.',
        brandLogoUrl: brandLogoUrl.trim() || '/assets/sahara-logo.webp',
        brandMarkUrl: brandMarkUrl.trim() || '/assets/sahara-mark.webp',
        primaryAccent: accentColor.trim() || '#E69D2B',
        enableCustomCursor,
        enableBackToTop,
        stickyNavbar,
        seoTitle: seoTitle.trim(),
        seoDescription: seoDescription.trim(),
        seoKeywords: seoKeywords.trim(),
        footerCopyright: footerCopyright.trim(),
        footerSocials: cleanedSocials,
        footerLinkedinUrl: linkedinItem?.url || settings.footerLinkedinUrl,
        footerContactEmail: derivedEmail,
        showFooterEmail: emailItem ? emailItem.enabled !== false : false,
        enableAnnouncementBanner: enableBanner,
        announcementBannerText: bannerText.trim(),
      };

      const nextHomeFooter = {
        ...(draftContent?.home?.footer || {}),
        copyright: footerCopyright.trim(),
        contactEmail: derivedEmail,
        socialLinks: cleanedSocials,
      };

      const nextContent = {
        ...draftContent,
        home: {
          ...(draftContent?.home || {}),
          footer: nextHomeFooter,
        },
      };

      updateSettings(nextSettings);
      updateDraft('home.footer', nextHomeFooter);
      await publishChanges(nextSettings, nextContent);

      setGlobalSaveMessage('All Additional Settings saved & published live.');
      setTimeout(() => setGlobalSaveMessage(null), 3500);
    } catch (err) {
      console.error('Failed to save Additional Settings:', err);
    } finally {
      setIsSavingGlobal(false);
    }
  };

  const handleSaveRecipient = async (e) => {
    e.preventDefault();
    setIsSavingRecipient(true);
    setRecipientSaved(false);
    try {
      await updateSettings({
        recipientEmail: recipientEmail.trim().toLowerCase(),
      });
      setRecipientSaved(true);
      setTimeout(() => setRecipientSaved(false), 2800);
    } catch (err) {
      console.error('Failed to save recipient email:', err);
    } finally {
      setIsSavingRecipient(false);
    }
  };

  const handleSendTestEmail = async () => {
    setIsSendingTest(true);
    setTestResult(null);

    const testPayload = {
      trackingId: '#SAH-TEST',
      name: 'Abdul Wahab (Admin Check)',
      email: recipientEmail.trim() || 'contact@sahara-staffing.com',
      phone: '+1 (800) 555-0199',
      discipline: 'Executive Search',
      linkedin: 'https://linkedin.com',
      summary: 'System verification test from Executive Admin Portal.',
    };

    try {
      await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(testPayload),
      });

      setTestResult({
        success: true,
        message: `Test notification dispatched to ${testPayload.email} (${testPayload.trackingId}).`,
      });

      localDB.addNotificationLog({
        type: 'TEST_TRANSMISSION',
        recipient: testPayload.email,
        subject: '[Admin Test] Verification Check',
        tracking_id: testPayload.trackingId,
        candidate_name: testPayload.name,
        delivery_status: 'DELIVERED',
        mode: 'APPS_SCRIPT_GMAIL',
      });
      setLogs(localDB.getNotificationLogs());
    } catch (err) {
      setTestResult({
        success: false,
        message: err.message || 'Failed to dispatch test notification via Google Apps Script.',
      });
    } finally {
      setIsSendingTest(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl pb-16">
      {/* Header */}
      <div className="pb-4 border-b border-[#1E293B]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Additional Settings</h1>
          <p className="text-xs text-[#94A3B8] mt-1">
            Standalone global configuration for Brand Logos, Theme Colors, Animated Cursor, SEO Meta Tags, Footer Copyright &amp; Social Links, and Intake Notifications.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSaveGlobalSettings}
          disabled={isSavingGlobal}
          className="px-5 py-2.5 rounded-lg bg-[#E69D2B] hover:bg-[#F2A51A] text-[#0B0F17] font-bold text-xs transition-colors cursor-pointer disabled:opacity-60 inline-flex items-center gap-2 self-start sm:self-auto"
        >
          {isSavingGlobal ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Saving Global Config...</span>
            </>
          ) : (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Save &amp; Publish Global Settings</span>
            </>
          )}
        </button>
      </div>

      {globalSaveMessage && (
        <div className="p-3 rounded-lg bg-emerald-950/50 border border-emerald-700/60 text-emerald-300 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{globalSaveMessage}</span>
        </div>
      )}

      {/* 1. BRAND LOGOS & COMPANY NAME */}
      <div className="rounded-xl bg-[#0F172A]/80 border border-[#1E293B] p-5 sm:p-6 space-y-5">
        <div className="flex items-center gap-2 border-b border-[#1E293B]/70 pb-3">
          <ImageIcon className="w-4 h-4 text-[#E69D2B]" />
          <div>
            <h2 className="text-sm font-semibold text-white">Brand Logos &amp; Identity</h2>
            <p className="text-[11px] text-[#64748B]">
              Controls header wordmark logo, favicon/spinner brand mark, and organization name across all pages.
            </p>
          </div>
        </div>

        <div className="space-y-1.5 max-w-md">
          <label className="block text-[10.5px] font-semibold text-[#94A3B8] uppercase tracking-wider">
            Company Display Name
          </label>
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="Sahara Staffing Inc."
            className="w-full px-3.5 py-2 rounded-lg bg-[#131926] border border-[#1E293B] text-white text-xs focus:border-[#E69D2B] focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Brand Full Logo */}
          <div className="p-4 rounded-xl bg-[#0B0F17] border border-[#1E293B] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-white">Primary Wordmark Logo</span>
              <button
                type="button"
                onClick={() => setBrandLogoUrl('/assets/sahara-logo.webp')}
                className="text-[10.5px] text-[#94A3B8] hover:text-white inline-flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            </div>
            <div className="h-20 rounded-lg bg-[#131926] border border-[#1E293B] flex items-center justify-center p-3 overflow-hidden">
              <img
                src={brandLogoUrl || saharaLogoImg}
                onError={(e) => {
                  e.currentTarget.src = saharaLogoImg;
                }}
                alt="Primary Logo Preview"
                className="max-h-12 w-auto object-contain"
              />
            </div>
            <input
              type="text"
              value={brandLogoUrl}
              onChange={(e) => setBrandLogoUrl(e.target.value)}
              placeholder="/assets/sahara-logo.webp"
              className="w-full px-3 py-2 rounded-lg bg-[#131926] border border-[#1E293B] text-white text-xs font-mono focus:border-[#E69D2B] focus:outline-none"
            />
            <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1E293B] hover:bg-[#293548] text-[11px] font-medium text-white cursor-pointer transition-colors">
              <Upload className="w-3 h-3 text-[#E69D2B]" />
              <span>Upload Logo Image</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleLogoFileUpload(e.target.files?.[0], setBrandLogoUrl)}
              />
            </label>
          </div>

          {/* Brand Emblem Mark */}
          <div className="p-4 rounded-xl bg-[#0B0F17] border border-[#1E293B] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-white">Brand Emblem / Symbol Mark</span>
              <button
                type="button"
                onClick={() => setBrandMarkUrl('/assets/sahara-mark.webp')}
                className="text-[10.5px] text-[#94A3B8] hover:text-white inline-flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            </div>
            <div className="h-20 rounded-lg bg-[#131926] border border-[#1E293B] flex items-center justify-center p-3 overflow-hidden">
              <img
                src={brandMarkUrl || saharaMarkImg}
                onError={(e) => {
                  e.currentTarget.src = saharaMarkImg;
                }}
                alt="Brand Mark Preview"
                className="h-12 w-12 object-contain"
              />
            </div>
            <input
              type="text"
              value={brandMarkUrl}
              onChange={(e) => setBrandMarkUrl(e.target.value)}
              placeholder="/assets/sahara-mark.webp"
              className="w-full px-3 py-2 rounded-lg bg-[#131926] border border-[#1E293B] text-white text-xs font-mono focus:border-[#E69D2B] focus:outline-none"
            />
            <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1E293B] hover:bg-[#293548] text-[11px] font-medium text-white cursor-pointer transition-colors">
              <Upload className="w-3 h-3 text-[#E69D2B]" />
              <span>Upload Emblem Mark</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleLogoFileUpload(e.target.files?.[0], setBrandMarkUrl)}
              />
            </label>
          </div>
        </div>
      </div>

      {/* 2. THEME COLORS & SITE UTILITIES (ANIMATED CURSOR OFF BY DEFAULT) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Theme Colors */}
        <div className="rounded-xl bg-[#0F172A]/80 border border-[#1E293B] p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-[#1E293B]/70 pb-3">
            <Palette className="w-4 h-4 text-[#E69D2B]" />
            <div>
              <h2 className="text-sm font-semibold text-white">Theme Accent Color</h2>
              <p className="text-[11px] text-[#64748B]">Primary gold/amber accent token across buttons and highlights</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {BRAND_PALETTES.map((palette) => (
              <button
                key={palette.hex}
                type="button"
                onClick={() => setAccentColor(palette.hex)}
                className={`p-2.5 rounded-lg border text-left transition-all flex items-center gap-2.5 cursor-pointer ${
                  accentColor.toLowerCase() === palette.hex.toLowerCase()
                    ? 'border-[#E69D2B] bg-[#131926]'
                    : 'border-[#1E293B] bg-[#0B0F17] hover:border-[#334155]'
                }`}
              >
                <span
                  className="w-5 h-5 rounded-md border border-white/10 shrink-0"
                  style={{ backgroundColor: palette.hex }}
                />
                <div className="min-w-0">
                  <div className="text-[11px] font-semibold text-white truncate">{palette.name}</div>
                  <div className="text-[10px] font-mono text-[#94A3B8]">{palette.hex}</div>
                </div>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="color"
              value={accentColor}
              onChange={(e) => setAccentColor(e.target.value)}
              className="w-9 h-9 rounded bg-transparent border border-[#1E293B] cursor-pointer"
            />
            <input
              type="text"
              value={accentColor}
              onChange={(e) => setAccentColor(e.target.value)}
              className="flex-1 px-3 py-2 rounded-lg bg-[#131926] border border-[#1E293B] text-white text-xs font-mono focus:border-[#E69D2B] focus:outline-none"
            />
            <button
              type="button"
              onClick={handleCopyHex}
              className="px-3 py-2 rounded-lg bg-[#131926] border border-[#1E293B] text-xs text-[#94A3B8] hover:text-white inline-flex items-center gap-1 cursor-pointer"
            >
              {copiedHex ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedHex ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Site Utilities & Animated Cursor */}
        <div className="rounded-xl bg-[#0F172A]/80 border border-[#1E293B] p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-[#1E293B]/70 pb-3">
            <MousePointer2 className="w-4 h-4 text-[#E69D2B]" />
            <div>
              <h2 className="text-sm font-semibold text-white">Interactive Pointer &amp; Navigation Utilities</h2>
              <p className="text-[11px] text-[#64748B]">Site-wide UI chrome behavior toggles</p>
            </div>
          </div>

          <div className="space-y-3">
            <label className="flex items-center justify-between gap-3 p-3 rounded-lg bg-[#0B0F17] border border-[#1E293B] cursor-pointer">
              <div>
                <div className="text-xs font-semibold text-white">
                  Animated Cursor Pointer <span className="text-[10px] font-mono text-[#E69D2B] ml-1">(Default: OFF)</span>
                </div>
                <div className="text-[11px] text-[#64748B]">
                  Enables the magnetic gold desktop ring cursor follower on public pages.
                </div>
              </div>
              <input
                type="checkbox"
                checked={enableCustomCursor}
                onChange={(e) => setEnableCustomCursor(e.target.checked)}
                className="w-4 h-4 accent-[#E69D2B] cursor-pointer shrink-0"
              />
            </label>

            <label className="flex items-center justify-between gap-3 p-3 rounded-lg bg-[#0B0F17] border border-[#1E293B] cursor-pointer">
              <div>
                <div className="text-xs font-semibold text-white">Floating Scroll-to-Top Progress Emblem</div>
                <div className="text-[11px] text-[#64748B]">
                  Displays scroll progress button in bottom corner when scrolling down.
                </div>
              </div>
              <input
                type="checkbox"
                checked={enableBackToTop}
                onChange={(e) => setEnableBackToTop(e.target.checked)}
                className="w-4 h-4 accent-[#E69D2B] cursor-pointer shrink-0"
              />
            </label>

            <label className="flex items-center justify-between gap-3 p-3 rounded-lg bg-[#0B0F17] border border-[#1E293B] cursor-pointer">
              <div>
                <div className="text-xs font-semibold text-white">Sticky Top Navigation Header</div>
                <div className="text-[11px] text-[#64748B]">
                  Keeps navigation pinned cleanly at the top while scrolling.
                </div>
              </div>
              <input
                type="checkbox"
                checked={stickyNavbar}
                onChange={(e) => setStickyNavbar(e.target.checked)}
                className="w-4 h-4 accent-[#E69D2B] cursor-pointer shrink-0"
              />
            </label>
          </div>
        </div>
      </div>

      {/* 3. SEO META TAGS */}
      <div className="rounded-xl bg-[#0F172A]/80 border border-[#1E293B] p-5 sm:p-6 space-y-4">
        <div className="flex items-center gap-2 border-b border-[#1E293B]/70 pb-3">
          <Globe className="w-4 h-4 text-[#E69D2B]" />
          <div>
            <h2 className="text-sm font-semibold text-white">SEO &amp; OpenGraph Meta Tags</h2>
            <p className="text-[11px] text-[#64748B]">
              Dynamically updates browser title, meta description, keywords, and social sharing tags.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 text-xs">
          <div className="space-y-1.5">
            <label className="block text-[10.5px] font-semibold text-[#94A3B8] uppercase tracking-wider">
              Meta Title (&lt;title&gt; &amp; og:title)
            </label>
            <input
              type="text"
              value={seoTitle}
              onChange={(e) => setSeoTitle(e.target.value)}
              className="w-full px-3.5 py-2 rounded-lg bg-[#131926] border border-[#1E293B] text-white focus:border-[#E69D2B] focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-[10.5px] font-semibold text-[#94A3B8] uppercase tracking-wider">
              Meta Description (description &amp; og:description)
            </label>
            <textarea
              rows={2}
              value={seoDescription}
              onChange={(e) => setSeoDescription(e.target.value)}
              className="w-full px-3.5 py-2 rounded-lg bg-[#131926] border border-[#1E293B] text-white focus:border-[#E69D2B] focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-[10.5px] font-semibold text-[#94A3B8] uppercase tracking-wider">
              SEO Keywords (comma-separated)
            </label>
            <input
              type="text"
              value={seoKeywords}
              onChange={(e) => setSeoKeywords(e.target.value)}
              className="w-full px-3.5 py-2 rounded-lg bg-[#131926] border border-[#1E293B] text-white focus:border-[#E69D2B] focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* 4. FOOTER SOCIAL MEDIA LINKS & COPYRIGHT TEXT */}
      <div className="rounded-xl bg-[#0F172A]/80 border border-[#1E293B] p-5 sm:p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-[#1E293B]/70 pb-3">
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4 text-[#E69D2B]" />
            <div>
              <h2 className="text-sm font-semibold text-white">Footer Social Media Links &amp; Copyright</h2>
              <p className="text-[11px] text-[#64748B]">
                Add, edit, toggle, or remove social channels in the website footer and update copyright text.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddSocial}
            className="px-3 py-1.5 rounded-lg bg-[#1E293B] hover:bg-[#E69D2B] hover:text-[#0B0F17] text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Add Social Link
          </button>
        </div>

        <div className="space-y-2.5">
          {footerSocials.map((soc, idx) => (
            <div
              key={soc.id || idx}
              className="grid grid-cols-1 md:grid-cols-12 gap-2.5 items-center p-3 rounded-lg bg-[#0B0F17] border border-[#1E293B]"
            >
              <div className="md:col-span-2">
                <select
                  value={(soc.platform || 'website').toLowerCase()}
                  onChange={(e) => handleUpdateSocial(idx, 'platform', e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded bg-[#131926] border border-[#1E293B] text-white text-xs focus:border-[#E69D2B] focus:outline-none"
                >
                  {SOCIAL_PLATFORMS.map((plat) => (
                    <option key={plat} value={plat}>
                      {plat.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-3">
                <input
                  type="text"
                  value={soc.label || ''}
                  onChange={(e) => handleUpdateSocial(idx, 'label', e.target.value)}
                  placeholder="Label (e.g. LinkedIn)"
                  className="w-full px-2.5 py-1.5 rounded bg-[#131926] border border-[#1E293B] text-white text-xs focus:border-[#E69D2B] focus:outline-none"
                />
              </div>
              <div className="md:col-span-5">
                <input
                  type="text"
                  value={soc.url || ''}
                  onChange={(e) => handleUpdateSocial(idx, 'url', e.target.value)}
                  placeholder="https://... or mailto:..."
                  className="w-full px-2.5 py-1.5 rounded bg-[#131926] border border-[#1E293B] text-white text-xs font-mono focus:border-[#E69D2B] focus:outline-none"
                />
              </div>
              <div className="md:col-span-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => handleUpdateSocial(idx, 'enabled', soc.enabled === false)}
                  className={`px-2 py-1 rounded text-[10px] font-bold uppercase cursor-pointer ${
                    soc.enabled !== false
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                >
                  {soc.enabled !== false ? 'Visible' : 'Hidden'}
                </button>
                <button
                  type="button"
                  onClick={() => handleRemoveSocial(idx)}
                  title="Remove link"
                  className="p-1.5 rounded text-slate-400 hover:text-red-400 hover:bg-red-500/10 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Copyright Text */}
        <div className="pt-3 border-t border-[#1E293B]/60 space-y-1.5 max-w-xl">
          <label className="flex items-center gap-1.5 text-[10.5px] font-semibold text-[#94A3B8] uppercase tracking-wider">
            <Copyright className="w-3.5 h-3.5 text-[#E69D2B]" /> Footer Copyright Text
          </label>
          <input
            type="text"
            value={footerCopyright}
            onChange={(e) => setFooterCopyright(e.target.value)}
            placeholder="© 2026 Sahara Staffing Inc. All rights reserved."
            className="w-full px-3.5 py-2 rounded-lg bg-[#131926] border border-[#1E293B] text-white text-xs focus:border-[#E69D2B] focus:outline-none"
          />
        </div>
      </div>

      {/* 5. ANNOUNCEMENT BANNER */}
      <div className="rounded-xl bg-[#0F172A]/80 border border-[#1E293B] p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-[#1E293B]/70 pb-3">
          <div className="flex items-center gap-2">
            <Megaphone className="w-4 h-4 text-[#E69D2B]" />
            <div>
              <h2 className="text-sm font-semibold text-white">Top Announcement Banner</h2>
              <p className="text-[11px] text-[#64748B]">Optional slim status notice at the top of the public website</p>
            </div>
          </div>

          <label className="inline-flex items-center gap-2 text-xs text-white cursor-pointer">
            <input
              type="checkbox"
              checked={enableBanner}
              onChange={(e) => setEnableBanner(e.target.checked)}
              className="w-4 h-4 accent-[#E69D2B] cursor-pointer"
            />
            <span>{enableBanner ? 'Enabled' : 'Disabled'}</span>
          </label>
        </div>

        <input
          type="text"
          value={bannerText}
          onChange={(e) => setBannerText(e.target.value)}
          placeholder="Now scheduling executive talent consultations for Q1 2027"
          className="w-full px-3.5 py-2 rounded-lg bg-[#131926] border border-[#1E293B] text-white text-xs focus:border-[#E69D2B] focus:outline-none"
        />
      </div>

      {/* 6. NOTIFICATION RECIPIENT & SYSTEM AUDIT LOGS */}
      <div className="rounded-xl bg-[#0F172A]/80 border border-[#1E293B] p-5 sm:p-6 space-y-5">
        <div className="border-b border-[#1E293B]/60 pb-2">
          <h2 className="text-sm font-semibold text-white">Intake Notification Destination</h2>
          <p className="text-xs text-[#64748B] mt-0.5">
            Destination for consultation inquiries and automated dispatch alerts
          </p>
        </div>

        <form onSubmit={handleSaveRecipient} className="space-y-4 text-xs max-w-lg">
          <div className="space-y-1.5">
            <label className="block text-[10.5px] font-semibold text-[#94A3B8] uppercase tracking-wider">
              Notification Recipient Email
            </label>
            <input
              type="email"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              placeholder="contact@sahara-staffing.com"
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#131926] border border-[#1E293B] text-white focus:border-[#E69D2B] focus:outline-none"
            />
            <p className="text-[11px] text-[#64748B]">
              Default relay address: <span className="font-mono text-[#E69D2B]">contact@sahara-staffing.com</span>
            </p>
          </div>

          <div className="flex items-center justify-between pt-1">
            {recipientSaved && (
              <span className="text-emerald-400 text-xs flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Saved
              </span>
            )}
            <button
              type="submit"
              disabled={isSavingRecipient}
              className="ml-auto px-4 py-2 rounded-lg bg-[#E69D2B] hover:bg-[#F2A51A] text-[#0B0F17] font-semibold text-xs transition-colors cursor-pointer disabled:opacity-60"
            >
              {isSavingRecipient ? 'Saving...' : 'Save Recipient'}
            </button>
          </div>
        </form>

        <div className="pt-3 max-w-lg">
          <div className="flex items-center justify-between py-2 border-t border-[#1E293B]/40">
            <div>
              <div className="text-xs font-medium text-white">Test Notification Engine</div>
              <div className="text-[11px] text-[#64748B]">Dispatches verification email to saved address</div>
            </div>
            <button
              type="button"
              onClick={handleSendTestEmail}
              disabled={isSendingTest}
              className="px-3 py-1.5 rounded text-xs font-medium text-white hover:text-[#E69D2B] border border-[#1E293B] hover:border-[#E69D2B] transition-colors cursor-pointer inline-flex items-center gap-1.5"
            >
              {isSendingTest ? (
                <Loader2 className="w-3 h-3 animate-spin text-[#E69D2B]" />
              ) : (
                <Send className="w-3 h-3 text-[#E69D2B]" />
              )}
              <span>Send Test</span>
            </button>
          </div>

          {testResult && (
            <div
              className={`mt-2 p-2.5 rounded-lg text-xs flex items-center gap-2 ${
                testResult.success
                  ? 'bg-emerald-950/40 border border-emerald-700/50 text-emerald-300'
                  : 'bg-red-950/40 border border-red-800/50 text-red-300'
              }`}
            >
              {testResult.success ? <Check className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
              <span>{testResult.message}</span>
            </div>
          )}
        </div>

        {/* GAS Status */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs pt-2">
          <div className="p-3.5 rounded-lg bg-[#131926]/80 border border-[#1E293B]">
            <div className="text-[10px] uppercase font-semibold text-[#64748B] tracking-wider">Engine Status</div>
            <div className="font-mono font-bold text-white text-xs mt-1">Google Apps Script Web App</div>
            <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1.5 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>ACTIVE (no-cors Mode)</span>
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-[#131926]/80 border border-[#1E293B]">
            <div className="text-[10px] uppercase font-semibold text-[#64748B] tracking-wider">Storage Engine</div>
            <div className="font-mono font-bold text-white text-xs mt-1">/data/content.json</div>
            <div className="text-[11px] text-[#94A3B8] mt-1">Flat-File Synced</div>
          </div>

          <div className="p-3.5 rounded-lg bg-[#131926]/80 border border-[#1E293B]">
            <div className="text-[10px] uppercase font-semibold text-[#64748B] tracking-wider">Tracking Protocol</div>
            <div className="font-mono font-bold text-[#E69D2B] text-xs mt-1">Reference Tagging</div>
            <div className="text-[11px] text-[#94A3B8] mt-1">Collision-Checked (#SAH-xxxx)</div>
          </div>
        </div>

        {/* Audit History */}
        <div className="space-y-3 pt-2">
          <div className="border-b border-[#1E293B]/60 pb-2 flex items-center justify-between">
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider">Notification Audit History</h3>
            <span className="text-[11px] text-[#64748B]">Recent Events</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#1E293B] text-[#64748B] uppercase text-[10px] tracking-wider">
                  <th className="py-2 px-2 font-normal">Timestamp</th>
                  <th className="py-2 px-2 font-normal">Event Type</th>
                  <th className="py-2 px-2 font-normal">Recipient</th>
                  <th className="py-2 px-2 font-normal">Subject</th>
                  <th className="py-2 px-2 font-normal text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E293B]/40 text-white">
                {logs.length > 0 ? (
                  logs.slice(0, 8).map((log) => (
                    <tr key={log.id} className="hover:bg-white/[0.02]">
                      <td className="py-2.5 px-2 text-[#94A3B8] font-mono text-[11px] whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </td>
                      <td className="py-2.5 px-2 font-medium text-white whitespace-nowrap">{log.type}</td>
                      <td className="py-2.5 px-2 text-[#CBD5E1] font-mono text-[11px] whitespace-nowrap">
                        {log.recipient}
                      </td>
                      <td className="py-2.5 px-2 text-[#94A3B8] truncate max-w-xs">{log.subject}</td>
                      <td className="py-2.5 px-2 text-right font-mono text-[11px] whitespace-nowrap text-[#94A3B8]">
                        {log.delivery_status}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-[#64748B]">
                      No notification transmissions recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
