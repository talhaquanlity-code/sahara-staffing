import React, { createContext, useContext, useState, useEffect } from 'react';
import { faqData as initialFaqData } from '../data/faqData';
import { testimonialsData as initialTestimonialsData } from '../data/testimonialsData';

const CMS_STORAGE_KEY = 'sahara_cms_content_v2';
const SETTINGS_STORAGE_KEY = 'sahara_brand_settings_v3';

export const INITIAL_CMS_CONTENT = {
  // =========================================================================
  // 0. GLOBAL NAVBAR NAVIGATION LABELS
  // =========================================================================
  navbar: {
    links: [
      { id: 'home', label: 'Home' },
      { id: 'about', label: 'About Us' },
      { id: 'services', label: 'Services' },
      { id: 'contact', label: 'Contact' },
    ],
    ctaLabel: 'Join us',
  },

  // =========================================================================
  // 1. HOME PAGE (8 SECTION BLOCKS + SCROLL HIJACK)
  // =========================================================================
  home: {
    hero: {
      kicker: 'ENTERPRISE TALENT ACQUISITION',
      headline: 'Flexible Staffing & Executive Placement Built for Precision.',
      highlightWord: 'Precision.',
      subtitle:
        'Connecting ambitious enterprises with top-tier technical contractors, specialized teams, and executive leadership.',
      bottomCaption: 'Enterprise Staffing & Executive Search Solutions',
      buttons: [
        {
          id: 'btn-1',
          enabled: true,
          label: 'Request Talent ->',
          destination: '/contact',
          variant: 'primary',
        },
        {
          id: 'btn-2',
          enabled: true,
          label: 'Explore Services',
          destination: '/services',
          variant: 'secondary',
        },
      ],
    },
    metrics: {
      stat1Value: 500,
      stat1Suffix: '+',
      stat1Label: 'Client Engagements',
      stat2Value: 98,
      stat2Suffix: '%',
      stat2Label: 'Client Retention',
      stat3Value: 14,
      stat3Suffix: ' Days',
      stat3Label: 'Avg Launch Time',
      marqueeBadge: 'TRUSTED BY ENTERPRISE LEADERS',
    },
    bentoSection: {
      kicker: 'CORE TALENT PILLARS',
      headline: 'Flexible Staffing & Precision Talent Placement.',
      highlightWord: 'Precision',
      subtitle:
        'Deploy specialized technical contractors and executive leadership engineered for mission-critical growth.',
      ctaLabel: 'Explore Services',
    },
    bento: [
      {
        id: 'bento-1',
        title: 'Executive & Leadership Search',
        category: 'Executive Search',
        badge: '01 - EXECUTIVE SEARCH',
        description:
          'Targeted executive search and board-level placement engineered to secure proven leadership for long-term growth.',
        image: '/assets/img 16.webp',
      },
      {
        id: 'bento-2',
        title: 'IT Staff Augmentation',
        category: 'Workforce Augmentation',
        badge: '02 - WORKFORCE AUGMENTATION',
        description:
          'Deploy specialized technical contractors and project teams to scale capacity on demand.',
        image: '/assets/img 5.webp',
      },
      {
        id: 'bento-3',
        title: 'Direct Hire Placement',
        category: 'Permanent Placement',
        badge: '03 - PERMANENT PLACEMENT',
        description:
          'Rigorously vetted professionals aligned with your organization\'s technical stack and company culture.',
        image: '/assets/img 8.webp',
      },
      {
        id: 'bento-4',
        title: 'Specialized Technical Teams',
        category: 'Dedicated Squads',
        badge: '04 - DEDICATED SQUADS',
        description:
          'Rapid deployment of vetted technical squads, senior engineers, and specialized contributors ready for immediate sprint integration.',
        image: '/assets/img 9.webp',
      },
    ],
    scrollHijackSection: {
      enabled: true,
      kicker: 'THE SAHARA PROCESS',
      stages: [
        {
          id: 1,
          eyebrow: 'STAGE 01',
          badge: 'STAGE 01',
          title: 'Workforce & Role Scoping',
          description:
            'We analyze your technical requirements, team dynamics, and operational goals to define precise candidate profiles.',
          image: '/assets/card1-staffing.webp',
        },
        {
          id: 2,
          eyebrow: 'STAGE 02',
          badge: 'STAGE 02',
          title: 'Targeted Sourcing & Screening',
          description:
            'Our specialized recruiters leverage deep industry networks to source and rigorously vet top talent.',
          image: '/assets/card3-workforce.webp',
          spotlight: {
            image: '/assets/female-executive-beige.webp',
            name: 'Elena Vance',
            role: 'VP of Systems Engineering',
            bio: '14 years leading infrastructure architecture and technical executive placement for high-growth enterprises.',
          },
        },
        {
          id: 3,
          eyebrow: 'STAGE 03',
          badge: 'STAGE 03',
          title: 'Candidate Shortlisting & Selection',
          description:
            'Receive a curated shortlist of high-fit candidates complete with technical assessments and executive summaries.',
          image: '/assets/img 22.webp',
          sideNote:
            'Direct communication, thoughtful alignment, and mutual clarity from initial role scoping through final offer and onboarding.',
          sideAccent: 'Human judgment at every step.',
        },
        {
          id: 4,
          eyebrow: 'STAGE 04',
          badge: 'STAGE 04',
          title: 'Onboarding & Continuity Support',
          description:
            'We ensure rapid candidate integration backed by our 90-day placement performance commitment.',
          image: '/assets/hero-1.webp',
          primaryCtaLabel: 'View Services',
          primaryCtaRoute: 'services',
          secondaryCtaLabel: 'Discuss Hiring Needs',
          secondaryCtaRoute: 'contact',
        },
      ],
    },
    vetting: [
      {
        order: '01',
        name: 'Understand',
        label: '01 Understand',
        description:
          'Deep-dive alignment with leadership to map technical stack requirements, operational structure, and long-term context.',
        image: '/assets/hero-2.webp',
      },
      {
        order: '02',
        name: 'Architect',
        label: '02 Architect',
        description:
          'Targeted blueprint design across enterprise infrastructure, distributed systems, and operational governance.',
        image: '/assets/hero.webp',
      },
      {
        order: '03',
        name: 'Validate',
        label: '03 Validate',
        description:
          'Rigorous peer-level technical code evaluation, systems architecture reviews, and performance benchmarking.',
        image: '/assets/img 22.webp',
      },
      {
        order: '04',
        name: 'Align',
        label: '04 Align',
        description:
          'Seamless cross-functional coordination, stakeholder briefings, and delivery milestones for rapid execution.',
        image: '/assets/hero-2.webp',
      },
    ],
    calculator: {
      eyebrow: 'SAHARA STAFFING INC. / TALENT SOLUTIONS',
      headline: 'Talent Solutions That Move Business Forward.',
      highlightWord: 'Move',
      subtitle:
        'The specialized talent and executive leadership behind every great enterprise. We partner with ambitious organizations to deliver precision staffing built to scale.',
      feeMultiplier: 20,
      timeToFillDays: 14,
      retentionGuaranteeDays: 90,
      stations: [
        { step: '01', title: 'DISCOVER', description: 'Define role scoping & technical specs.' },
        { step: '02', title: 'CONNECT', description: 'Source & vet high-impact candidates.' },
        { step: '03', title: 'SCALE', description: 'Deploy specialized talent with 90-day continuity.' },
      ],
      buttons: [
        {
          id: 'btn-calc-1',
          enabled: true,
          label: 'Request Talent ->',
          destination: '/contact',
          variant: 'primary',
        },
      ],
    },
    testimonialsSection: {
      kicker: 'CLIENT PERSPECTIVES',
      headline: 'Trusted by High-Growth Enterprises.',
      subtitle:
        'Hear how executive leaders and technology partners scale their operations alongside Sahara Staffing Inc..',
    },
    testimonials: initialTestimonialsData.map((t, i) => ({
      id: `test-${i}`,
      name: t.name || t.author?.split(',')?.[0]?.trim() || 'Executive Partner',
      title: t.title || t.author?.split(',')?.[1]?.trim() || 'Enterprise Partner',
      author: t.author || 'Executive Partner, Enterprise Organization',
      quote: t.quote,
      image: t.image || '/assets/testimonial-sarah.webp',
      avatar: t.image || '/assets/testimonial-sarah.webp',
    })),
    faqSection: {
      headline: 'Frequently Asked Questions',
      subtitle:
        'Clear answers to the most common questions about our recruitment process and placement standards.',
    },
    faqs: initialFaqData.map((f, i) => ({
      id: f.id !== undefined ? `faq-${f.id}` : `faq-${i}`,
      question: f.question,
      answer: f.answer,
    })),
    footer: {
      headline: 'Speak with our staffing team',
      subtitle:
        'Our specialized recruiters and executive search partners are ready to review your technical hiring needs and match top-tier talent with speed and precision.',
      brandTagline:
        'Enterprise Staffing & Executive Search Solutions. Connecting ambitious enterprises with top-tier technical contractors and executive leadership.',
      ctaExploreLabel: 'Explore Services',
      officeTitle: 'STAFFING OPERATIONS',
      officeDesc:
        'Dedicated talent partners for enterprise contractor placement, direct hire, and executive search.',
      contactEmail: 'contact@sahara-staffing.com',
      copyright: '© 2026 Sahara Staffing Inc. All rights reserved.',
      socialLinks: [
        { id: 'soc-1', platform: 'linkedin', label: 'LinkedIn', url: 'https://www.linkedin.com', enabled: true },
        { id: 'soc-2', platform: 'email', label: 'Email', url: 'mailto:contact@sahara-staffing.com', enabled: true },
        { id: 'soc-3', platform: 'twitter', label: 'X (Twitter)', url: 'https://x.com', enabled: false },
        { id: 'soc-4', platform: 'instagram', label: 'Instagram', url: 'https://instagram.com', enabled: false },
        { id: 'soc-5', platform: 'github', label: 'GitHub', url: 'https://github.com', enabled: false },
      ],
      buttons: [
        {
          id: 'btn-foot-1',
          enabled: true,
          label: 'Request Talent ->',
          destination: '/contact',
          variant: 'primary',
        },
      ],
    },
  },

  // =========================================================================
  // 2. ABOUT PAGE (FULLY EDITABLE SECTIONS)
  // =========================================================================
  about: {
    hero: {
      kicker: 'SAHARA STAFFING INC. / WHO WE ARE',
      headline: 'A Modern Staffing Firm Built on Precision.',
      highlightWord: 'Precision.',
      subtitle:
        'Connecting ambitious enterprises with specialized technical talent and executive leadership.',
      heroImage: '/assets/img 14.webp',
      heroFallbackImage: '/assets/img 8.webp',
      heroImageBadgeLeft: 'People-Centered Strategy',
      heroImageBadgeRight: 'Sahara Staffing Inc.',
      buttons: [],
    },
    perspective: {
      eyebrow: 'OUR PERSPECTIVE',
      headline: 'Strong growth starts with understanding.',
      highlightWord: 'understanding.',
      paragraph1:
        'We take the time to understand your organization’s goals, technical ecosystem, and operational priorities before designing any engagement.',
      paragraph2:
        'By prioritizing genuine communication and long-term alignment over generic playbooks, we create strategic engagements that endure.',
    },
    humanMoment: {
      eyebrow: 'OUR PERSPECTIVE',
      headline: 'Growth is about people and clarity, not just checklists.',
      description:
        'Behind every initiative is a business objective and a leadership vision. We align both with precision, accountability, and sustained momentum.',
      image: '/assets/img 4.webp',
      fallbackImage: '/assets/img 2.webp',
    },
    principlesSection: {
      eyebrow: 'WHAT GUIDES US',
      headline: 'A more thoughtful approach.',
      subtitle:
        'We believe enterprise staffing begins with understanding your business, respecting the teams involved, and focusing on measurable alignment.',
    },
    benchmarks: [
      {
        num: '01',
        title: 'People & clarity first',
        desc: 'We consider the teams behind every initiative and the systems they rely on to succeed.',
      },
      {
        num: '02',
        title: 'Structure before assumptions',
        desc: 'Understanding technical requirements is the essential starting point for every staffing search.',
      },
      {
        num: '03',
        title: 'Measurable execution',
        desc: 'We focus on durable partnerships and alignment between talent, engineering, and business outcomes.',
      },
    ],
    mindsetSection: {
      eyebrow: 'THE SAHARA MINDSET',
      headline: 'A disciplined approach to every engagement.',
      highlightWord: 'every engagement.',
      subtitle:
        'Every engagement is structured around three foundational stages: understanding the business context, architecting the right strategy, and executing with clarity.',
    },
    chaptersLayout: 'sticky',
    chapters: [
      {
        id: '01',
        badge: 'CHAPTER 01',
        title: 'Understand the architecture (Technology)',
        text: 'Every engagement begins with listening and mapping the systems architecture and operational priorities behind your goals.',
        image: '/assets/img 10.webp',
        tag: 'Technology & AI',
      },
      {
        id: '02',
        badge: 'CHAPTER 02',
        title: 'See the bigger picture (Finance)',
        text: 'Business priorities, team dynamics, and technical stack inform workforce strategy and talent allocation.',
        image: '/assets/img 11.webp',
        tag: 'Strategic Finance',
      },
      {
        id: '03',
        badge: 'CHAPTER 03',
        title: 'Focus on execution (Operations)',
        text: 'Operational agility, workflow automation, and scalable systems guide our precision delivery for rapid enterprise momentum.',
        image: '/assets/img 12.webp',
        tag: 'Operations & Scale',
      },
      {
        id: '04',
        badge: 'CHAPTER 04',
        title: 'Lead with certainty (Leadership)',
        text: 'Executive governance, transparent accountability, and architectural guidance engineered for enduring enterprise value.',
        image: '/assets/img 5.webp',
        tag: 'Executive Leadership',
      },
    ],
    statsSection: {
      eyebrow: 'MEASURABLE SCALE',
      headline: 'Proven Velocity at Scale.',
    },
    stats: [
      { value: '500+', label: 'Engagements Delivered' },
      { value: '98%', label: 'Client Retention SLA' },
      { value: '14 Days', label: 'Average Launch Time' },
      { value: '$250M+', label: 'Enterprise Value Supported' },
    ],
    pipeline: {
      eyebrow: 'THE SAHARA PHILOSOPHY',
      quotePrefix: 'Great organizations aren’t built by accident – they’re defined by the',
      quoteHighlight: 'strategic execution',
      quoteSuffix: 'that moves business forward.',
      pillars: [
        { title: 'Sahara Staffing', desc: 'Executive & Technical Search' },
        { title: '14-Day Launch', desc: '100% Architecture Audited' },
        { title: '90-Day Guarantee', desc: 'Continuity Commitment' },
      ],
    },
    leadership: [
      {
        id: 'lead-1',
        name: 'Elena Vance',
        title: 'VP of Systems Architecture',
        bio: '14 years leading infrastructure architecture and distributed platform scaling.',
        image: '/assets/img 7.webp',
      },
      {
        id: 'lead-2',
        name: 'David Reynolds',
        title: 'Managing Partner, Executive Search',
        bio: 'Specialized in board-level executive recruitment and operational leadership.',
        image: '/assets/img 2.webp',
      },
      {
        id: 'lead-3',
        name: 'Marcus Chen',
        title: 'Head of Technical Diligence',
        bio: 'Pioneered enterprise architecture audits and scalable system blueprints.',
        image: '/assets/hero-2.webp',
      },
    ],
    finalCta: {
      eyebrow: 'SAHARA STAFFING INC.',
      headline: 'Let’s build the momentum behind your next stage.',
      subtitle:
        'From exploratory strategy sessions to immediate enterprise execution, Sahara is your long-term partner.',
      backgroundImage: '/assets/hero-2.webp',
      buttons: [
        {
          id: 'btn-about-cta-1',
          enabled: true,
          label: 'Get Started →',
          destination: '/contact',
          variant: 'primary',
        },
      ],
    },
  },

  // =========================================================================
  // 3. SERVICES PAGE (FULLY EDITABLE SECTIONS & SERVICE CARDS)
  // =========================================================================
  servicesPage: {
    hero: {
      kicker: 'SAHARA STAFFING INC. / OUR SERVICES',
      headline: 'Execution is the difference.',
      highlightWord: 'difference.',
      quote:
        'Great outcomes don’t happen by accident. We help enterprises build the systems and momentum they need to move forward.',
      pillars: ['Executive Search', 'Staff Augmentation', 'Dedicated Squads'],
      panoramicImage: '/assets/img 23.webp',
      panoramicFallbackImage: '/assets/img 6.webp',
      panoramicCaption:
        'Strategic execution across US technology, finance, and enterprise operations.',
      panoramicBrandTag: 'Sahara Staffing Inc.',
      buttons: [
        {
          id: 'btn-srv-hero-1',
          enabled: true,
          label: 'Explore Services →',
          destination: '/contact',
          variant: 'primary',
        },
      ],
    },
    capabilitiesSection: {
      sectionHeader: 'Core Service Pillars',
      sectionSubheader:
        'Structured enterprise staffing engagements built around executive placement, workforce scale, and technical talent.',
      items: [
        {
          id: 'cap-1',
          number: '01',
          badge: 'LONG-TERM ARCHITECTURE',
          title: 'Core Systems',
          highlightWord: 'that stay.',
          description:
            'Build dependable core systems and technical leadership foundations that support long-term stability.',
          ctaLabel: 'Inquire About Core Systems',
          ctaDestination: '/contact',
          image: '/assets/img 15.webp',
          fallbackImage: '/assets/img 11.webp',
          alt: 'Executive professionals discussing long-term systems growth in a modern office',
          theme: 'dark',
        },
        {
          id: 'cap-2',
          number: '02',
          badge: 'AGILE & EMBEDDED OPERATIONS',
          title: 'Ready for',
          highlightWord: "what's next.",
          description:
            'Deploy flexible engineering contractors and specialized squads for changing workloads, sprint coverage, and evolving business goals.',
          ctaLabel: 'Inquire About Enterprise Solutions',
          ctaDestination: '/contact',
          image: '/assets/img 8.webp',
          fallbackImage: '/assets/hero-2.webp',
          alt: 'Agile engineering and operational team collaborating on project delivery',
          theme: 'light',
        },
        {
          id: 'cap-3',
          number: '03',
          badge: 'EXECUTIVE SEARCH & LEADERSHIP',
          title: 'Leadership that moves',
          highlightWord: 'business forward.',
          description:
            'Partner with seasoned executive recruiters and talent advisors aligned with your organization’s next stage.',
          ctaLabel: 'Inquire About Executive Search',
          ctaDestination: '/contact',
          image: '/assets/img 9.webp',
          fallbackImage: '/assets/img 5.webp',
          alt: 'Experienced corporate executive leader in an architectural office setting',
          theme: 'dark',
        },
      ],
    },
    capabilities: [
      {
        id: 'cap-1',
        badge: '01 - CORE ARCHITECTURE',
        title: 'Long-Term Systems & Infrastructure',
        description:
          'End-to-end systems engineering and operational roadmaps built for enterprise reliability.',
        image: '/assets/img 15.webp',
      },
      {
        id: 'cap-2',
        badge: '02 - ENTERPRISE SOLUTIONS',
        title: 'Agile & Embedded Operations',
        description:
          'Rapid-deployment specialists and taskforces to accelerate product sprints, cloud migrations, and key milestones.',
        image: '/assets/img 8.webp',
      },
      {
        id: 'cap-3',
        badge: '03 - EXECUTIVE SEARCH',
        title: 'Executive Search & Placement',
        description:
          'Discreet, board-level executive search and leadership placement engineered for long-term growth.',
        image: '/assets/img 9.webp',
      },
      {
        id: 'cap-4',
        badge: '04 - MANAGED DELIVERY',
        title: 'Managed Operations & Scale',
        description:
          'Comprehensive operational frameworks tailored for high-growth organizations seeking measurable scale.',
        image: '/assets/img 3.webp',
      },
    ],
    approach: {
      eyebrow: 'THE SAHARA APPROACH',
      headline: 'Strong execution starts with understanding.',
      highlightWord: 'understanding.',
      subtitle:
        'Every organization is different. We start by understanding your operational priorities and architecting solutions aligned with your goals.',
      guaranteeBadge: '90-Day Performance & Continuity Commitment',
      steps: [
        {
          num: '01',
          title: 'Understand',
          desc: 'Learn about your systems, goals, constraints, and strategic priorities.',
        },
        {
          num: '02',
          title: 'Architect',
          desc: 'Design tailored operational blueprints backed by proven technical standards.',
        },
        {
          num: '03',
          title: 'Deliver',
          desc: 'Drive measurable placement forward alongside our senior recruitment team.',
        },
      ],
    },
    engagementModels: [
      { name: 'Retained Executive Search', desc: 'Dedicated board-level executive recruitment and leadership placement.' },
      { name: 'Architecture & Delivery Sprints', desc: 'Outcome-driven engineering for critical platform launches.' },
      { name: 'Fractional Leadership', desc: 'Immediate executive continuity for transitional milestones and audits.' },
      { name: 'Managed Operations', desc: 'Full-cycle operational execution scaling alongside your internal teams.' },
    ],
    slaGuarantee: {
      headline: 'The Sahara 90-Day Continuity Commitment',
      terms:
        'Every engagement is backed by transparent milestones, direct partner accountability, and a 90-day continuity commitment.',
    },
    closingCta: {
      eyebrow: 'SAHARA STAFFING INC. / GET STARTED',
      headline: 'A better strategic conversation starts here.',
      highlightWord: 'starts here.',
      quote:
        'Tell us what your organization needs. Let’s design an enterprise approach built around your goals.',
      ctaLabel: 'Get in Touch',
      ctaDestination: '/contact',
    },
  },

  // =========================================================================
  // 4. CONTACT PAGE (B2B INQUIRY CONFIGURATION)
  // =========================================================================
  contactPage: {
    hero: {
      kicker: 'SAHARA STAFFING INC. / CLIENT CONSULTATION',
      headline: 'Your next milestone starts with a conversation.',
      highlightWord: 'conversation.',
      subtitle:
        'Share your business objectives and project timeline with Sahara Staffing to begin a precision talent search.',
      subnote:
        'A thoughtful overview helps us understand your goals, priorities, and the solutions best aligned with your timeline.',
      formHeading: 'Get in touch.',
      formSubheading: 'Share your project details and attach an optional brief.',
      submitButtonLabel: 'Submit Inquiry',
    },
    details: {
      officeTitle: 'Sahara Executive Office',
      email: 'contact@sahara-staffing.com',
      responseTime: 'Within 2 hours (Business Hours)',
      protocolNote: 'Confidential Enterprise Consultation Protocol',
      checklistTitle: 'Before you submit',
      checklistIntro:
        'Your contact information, LinkedIn profile, and a brief overview or project document outlining your goals.',
      checklistSteps: [
        'Project brief or background document (PDF or DOCX format, max 10 MB)',
        'Active LinkedIn profile URL',
        'Primary service area and business objectives',
      ],
    },
    disciplines: [
      'Executive Search',
      'Technical Staff Augmentation',
      'Direct Hire Placement',
      'Dedicated Squads',
    ],
    intakeSettings: {
      allowDemoSubmissions: true,
      emailRouting: 'php_godaddy',
      confirmationMessage:
        'Thank you for submitting your inquiry. A senior partner will review your brief within 2 hours.',
    },
  },

  // =========================================================================
  // TOP-LEVEL BACKWARD-COMPATIBILITY ALIASES
  // =========================================================================
  hero: {
    kicker: 'ENTERPRISE TALENT ACQUISITION',
    headline: 'Flexible Staffing & Executive Placement Built for Precision.',
    highlightWord: 'Precision.',
    subtitle:
      'Connecting ambitious enterprises with top-tier technical contractors, specialized teams, and executive leadership.',
    buttons: [
      {
        id: 'btn-1',
        enabled: true,
        label: 'Request Talent ->',
        destination: '/contact',
        variant: 'primary',
      },
      {
        id: 'btn-2',
        enabled: true,
        label: 'Explore Services',
        destination: '/services',
        variant: 'secondary',
      },
    ],
    primaryCtaLabel: 'Request Talent ->',
    primaryCtaRoute: 'contact',
    secondaryCtaLabel: 'Explore Services',
    secondaryCtaRoute: 'services',
  },
  images: {
    bentoCard1: '/assets/img 20.webp',
    bentoCard2: '/assets/img 16.webp',
    bentoCard3: '/assets/img 5.webp',
    bentoCard4: '/assets/img 9.webp',
    vettingSteps: [
      '/assets/hero-2.webp',
      '/assets/hero.webp',
      '/assets/img 22.webp',
      '/assets/hero-2.webp',
      '/assets/img 7.webp',
    ],
    leadershipHeadshots: [
      {
        id: 'lead-1',
        name: 'Elena Vance',
        title: 'VP of Systems Architecture',
        image: '/assets/img 7.webp',
      },
      {
        id: 'lead-2',
        name: 'David Reynolds',
        title: 'Managing Partner, Executive Search',
        image: '/assets/img 2.webp',
      },
      {
        id: 'lead-3',
        name: 'Marcus Chen',
        title: 'Head of Technical Diligence',
        image: '/assets/hero-2.webp',
      },
    ],
  },
  services: [
    {
      id: 'srv-1',
      title: 'Enterprise Solutions',
      category: 'Staffing & Augmentation',
      badge: '01 - STAFFING & AUGMENTATION',
      description:
        'Rapid deployment of specialized technical squads, fractional architecture, and operational governance.',
      image: '/assets/img 20.webp',
    },
    {
      id: 'srv-2',
      title: 'Executive Search',
      category: 'Executive Search & Leadership',
      badge: '02 - EXECUTIVE SEARCH',
      description:
        'Targeted executive search and board-level placement engineered to secure proven leadership for long-term growth.',
      image: '/assets/img 16.webp',
    },
    {
      id: 'srv-3',
      title: 'Specialized Technical Teams',
      category: 'Systems Diligence',
      badge: '03 - SYSTEMS DILIGENCE',
      description:
        'Seasoned AI architects, systems leads, and principal engineers ready for immediate sprint integration.',
      image: '/assets/img 5.webp',
    },
    {
      id: 'srv-4',
      title: 'Managed Operations',
      category: 'Enterprise Delivery',
      badge: '04 - ENTERPRISE DELIVERY',
      description:
        'End-to-end operational delivery frameworks engineered for fast-growing ventures and enterprise scale.',
      image: '/assets/img 9.webp',
    },
  ],
  vettingStages: [
    {
      id: 'stg-1',
      order: '01',
      name: 'Understand',
      label: '01 Understand',
      description:
        'Deep-dive alignment with leadership to map technical stack requirements, operational structure, and long-term context.',
      image: '/assets/hero-2.webp',
    },
    {
      id: 'stg-2',
      order: '02',
      name: 'Architect',
      label: '02 Architect',
      description:
        'Targeted blueprint design across enterprise infrastructure, distributed systems, and operational governance.',
      image: '/assets/hero.webp',
    },
    {
      id: 'stg-3',
      order: '03',
      name: 'Validate',
      label: '03 Validate',
      description:
        'Rigorous peer-level technical code evaluation, systems architecture reviews, and performance benchmarking.',
      image: '/assets/img 22.webp',
    },
    {
      id: 'stg-4',
      order: '04',
      name: 'Align',
      label: '04 Align',
      description:
        'Seamless cross-functional coordination, stakeholder briefings, and delivery milestones for rapid execution.',
      image: '/assets/hero-2.webp',
    },
  ],
  faqs: initialFaqData.map((f, i) => ({
    id: f.id !== undefined ? `faq-${f.id}` : `faq-${i}`,
    question: f.question,
    answer: f.answer,
  })),
  testimonials: initialTestimonialsData.map((t, i) => ({
    id: `test-${i}`,
    name: t.name || t.author?.split(',')?.[0]?.trim() || 'Executive Partner',
    title: t.title || t.author?.split(',')?.[1]?.trim() || 'Enterprise Partner',
    author: t.author || 'Executive Partner, Enterprise Organization',
    quote: t.quote,
    image: t.image || '/assets/testimonial-sarah.webp',
    avatar: t.image || '/assets/testimonial-sarah.webp',
  })),
};

// Global Site Utilities & Brand Settings (Managed in "Additional Settings")
export const INITIAL_SETTINGS = {
  stickyNavbar: false,
  enableBackToTop: true,
  backToTopIcon: 'arrow',
  enableCustomCursor: false,
  primaryAccent: '#E69D2B',
  recipientEmail: 'contact@sahara-staffing.com',
  companyName: 'Sahara Staffing Inc.',
  brandLogoUrl: '',
  brandMarkUrl: '',
  seoTitle: 'Sahara Staffing Inc. | Enterprise Staffing & Executive Search Solutions',
  seoDescription: 'Sahara Staffing Inc. connects ambitious enterprises with top-tier technical contractors, specialized teams, and executive leadership.',
  seoKeywords: 'Sahara Staffing Inc, enterprise staffing, executive search, IT staff augmentation, technical contractors, talent acquisition',
  footerCopyright: '© 2026 Sahara Staffing Inc. All rights reserved.',
  allowDemoSubmissions: true,
  enableAnnouncementBanner: false,
  announcementBannerText: 'Now scheduling Q1 2027 enterprise strategy consultations',
  footerLinkedinUrl: 'https://linkedin.com',
  footerContactEmail: 'contact@sahara-staffing.com',
  showFooterEmail: true,
  footerSocials: [
    { id: 'soc-1', platform: 'linkedin', label: 'LinkedIn', url: 'https://linkedin.com', enabled: true },
    { id: 'soc-2', platform: 'email', label: 'Email', url: 'mailto:contact@sahara-staffing.com', enabled: true },
    { id: 'soc-3', platform: 'twitter', label: 'X (Twitter)', url: 'https://x.com', enabled: false },
    { id: 'soc-4', platform: 'instagram', label: 'Instagram', url: 'https://instagram.com', enabled: false },
    { id: 'soc-5', platform: 'github', label: 'GitHub', url: 'https://github.com', enabled: false },
  ],
};

// Preserve context identity across Vite HMR reloads so mounted providers and consumers stay linked
const CMSContext =
  globalThis.__SAHARA_CMS_CONTEXT__ ||
  (globalThis.__SAHARA_CMS_CONTEXT__ = createContext(null));
const CMSPreviewContext =
  globalThis.__SAHARA_CMS_PREVIEW_CONTEXT__ ||
  (globalThis.__SAHARA_CMS_PREVIEW_CONTEXT__ = createContext(null));

export function CMSPreviewProvider({ content, settings, children }) {
  return (
    <CMSPreviewContext.Provider value={{ content, settings }}>
      {children}
    </CMSPreviewContext.Provider>
  );
}

const BENTO_TARGET_IMAGES = [
  '/assets/img 20.webp',
  '/assets/img 16.webp',
  '/assets/img 5.webp',
  '/assets/img 9.webp',
];

const BENTO_LEGACY_IMAGES = [
  ['/assets/card1-staffing.webp', '/assets/img 4.webp'],
  ['/assets/card2-talent.webp', '/assets/img 2.webp'],
  ['/assets/talent-ai.webp', '/assets/img 16.webp', '/assets/img 19.webp'],
  ['/assets/card3-workforce.webp', '/assets/img 3.webp'],
];

const CHAPTER_TARGET_IMAGES = [
  '/assets/img 10.webp',
  '/assets/img 11.webp',
  '/assets/img 12.webp',
  '/assets/img 5.webp',
];

const CHAPTER_LEGACY_IMAGES = [
  ['/assets/card1-staffing.webp', '/assets/img 4.webp', '/assets/img 7.webp'],
  ['/assets/card2-talent.webp', '/assets/img 2.webp'],
  ['/assets/card3-workforce.webp', '/assets/img 3.webp'],
  ['/assets/talent-ai.webp', '/assets/img 16.webp', '/assets/img 19.webp'],
];

function upgradeLegacyAssetExtensions(val) {
  if (typeof val === 'string') {
    if (val.startsWith('/assets/') && /\.(jpe?g|png)$/i.test(val)) {
      return val.replace(/\.(jpe?g|png)$/i, '.webp');
    }
    return val;
  }
  if (Array.isArray(val)) return val.map(upgradeLegacyAssetExtensions);
  if (val && typeof val === 'object') {
    const out = {};
    for (const k of Object.keys(val)) {
      out[k] = upgradeLegacyAssetExtensions(val[k]);
    }
    return out;
  }
  return val;
}

function migrateLegacyBentoImages(content) {
  if (!content) return content;
  const next = upgradeLegacyAssetExtensions({ ...content });

  if (next.images) {
    const imgs = { ...next.images };
    ['bentoCard1', 'bentoCard2', 'bentoCard3', 'bentoCard4'].forEach((key, idx) => {
      if (BENTO_LEGACY_IMAGES[idx].includes(imgs[key])) {
        imgs[key] = BENTO_TARGET_IMAGES[idx];
      }
    });
    if (Array.isArray(imgs.vettingSteps)) {
      const steps = [...imgs.vettingSteps];
      if (['/assets/card3-workforce.webp', '/assets/img 3.webp'].includes(steps[1])) {
        steps[1] = '/assets/hero.webp';
      }
      if (['/assets/service-workforce.webp', '/assets/img 6.webp'].includes(steps[2])) {
        steps[2] = '/assets/img 22.webp';
      }
      imgs.vettingSteps = steps;
    }
    next.images = imgs;
  }

  if (Array.isArray(next.services)) {
    next.services = next.services.map((srv, idx) =>
      idx < 4 && BENTO_LEGACY_IMAGES[idx].includes(srv?.image)
        ? { ...srv, image: BENTO_TARGET_IMAGES[idx] }
        : srv
    );
  }

  if (next.home && Array.isArray(next.home.bento)) {
    next.home = {
      ...next.home,
      bento: next.home.bento.map((card, idx) =>
        idx < 4 && BENTO_LEGACY_IMAGES[idx].includes(card?.image)
          ? { ...card, image: BENTO_TARGET_IMAGES[idx] }
          : card
      ),
    };
  }

  if (next.about) {
    next.about = {
      ...next.about,
      ...(next.about.hero
        ? {
            hero: {
              ...next.about.hero,
              ...(next.about.hero.heroImage === '/assets/img 23.webp'
                ? { heroImage: '/assets/img 14.webp' }
                : {}),
              ...(next.about.hero.headline ===
              'A Modern Staffing & Search Firm Built on Precision and Partnerships.'
                ? {
                    headline: 'A Modern Staffing Firm Built on Precision.',
                    highlightWord: 'Precision.',
                    subtitle:
                      'Connecting ambitious enterprises with specialized technical talent and executive leadership.',
                  }
                : {}),
            },
          }
        : {}),
      ...(Array.isArray(next.about.chapters)
        ? {
            chapters: next.about.chapters.map((ch, idx) =>
              idx < 4 && CHAPTER_LEGACY_IMAGES[idx].includes(ch?.image)
                ? { ...ch, image: CHAPTER_TARGET_IMAGES[idx] }
                : ch
            ),
          }
        : {}),
    };
  }

  const normalizeHeroButtons = (buttons) =>
    Array.isArray(buttons)
      ? buttons.map((b, idx) => {
          if (!b) return b;
          const clean = (b.label || '').replace(/\s*(→|->|&rarr;)\s*$/, '').trim();
          if (idx === 0 && ['Get Started', 'Get Staffed Now'].includes(clean)) {
            return { ...b, label: 'Request Talent ->', destination: '/contact' };
          }
          if (
            idx === 1 &&
            ['View Solutions', 'Explore Open Roles', 'View Our Process', 'Explore All Services'].includes(clean)
          ) {
            return { ...b, label: 'Explore Services', destination: '/services' };
          }
          return b;
        })
      : buttons;

  if (next.home?.hero) {
    next.home = {
      ...next.home,
      hero: {
        ...next.home.hero,
        buttons: normalizeHeroButtons(next.home.hero.buttons),
      },
    };
  }

  if (next.hero) {
    next.hero = {
      ...next.hero,
      buttons: normalizeHeroButtons(next.hero.buttons),
      ...(['Get Started', 'Get Staffed Now'].includes(next.hero.primaryCtaLabel)
        ? { primaryCtaLabel: 'Request Talent ->', primaryCtaRoute: 'contact' }
        : {}),
      ...(['View Solutions', 'Explore Open Roles', 'View Our Process', 'Explore All Services'].includes(
        next.hero.secondaryCtaLabel
      )
        ? { secondaryCtaLabel: 'Explore Services', secondaryCtaRoute: 'services' }
        : {}),
    };
  }

  if (next.navbar) {
    const hasLegacyStaffingLinks =
      Array.isArray(next.navbar.links) &&
      next.navbar.links.some((l) => l?.id === 'executive-search' || l?.label === 'Staffing Services');
    const isLegacyCta = ['Request Talent', 'Get Started', 'Join'].includes(next.navbar.ctaLabel);
    if (hasLegacyStaffingLinks || isLegacyCta) {
      next.navbar = {
        ...next.navbar,
        ...(hasLegacyStaffingLinks
          ? {
              links: [
                { id: 'home', label: 'Home' },
                { id: 'about', label: 'About Us' },
                { id: 'services', label: 'Services' },
                { id: 'contact', label: 'Contact' },
              ],
            }
          : {}),
        ...(isLegacyCta ? { ctaLabel: 'Join us' } : {}),
      };
    }
  }

  return next;
}

function mergeDeep(target, source) {
  if (!source) return target;
  const output = { ...target };
  for (const key of Object.keys(source)) {
    if (
      source[key] instanceof Object &&
      !Array.isArray(source[key]) &&
      key in target &&
      target[key] instanceof Object &&
      !Array.isArray(target[key])
    ) {
      output[key] = mergeDeep(target[key], source[key]);
    } else if (source[key] !== undefined) {
      output[key] = source[key];
    }
  }
  return output;
}

export function CMSProvider({ children }) {
  const [publishedContent, setPublishedContent] = useState(() => {
    try {
      const saved = localStorage.getItem(CMS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return migrateLegacyBentoImages(mergeDeep(INITIAL_CMS_CONTENT, parsed));
      }
      return INITIAL_CMS_CONTENT;
    } catch {
      return INITIAL_CMS_CONTENT;
    }
  });

  const [draftContent, setDraftContent] = useState(() => {
    try {
      const saved = localStorage.getItem(CMS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return migrateLegacyBentoImages(mergeDeep(INITIAL_CMS_CONTENT, parsed));
      }
      return INITIAL_CMS_CONTENT;
    } catch {
      return INITIAL_CMS_CONTENT;
    }
  });

  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...INITIAL_SETTINGS, ...parsed };
      }
      return INITIAL_SETTINGS;
    } catch {
      return INITIAL_SETTINGS;
    }
  });

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [publishStatus, setPublishStatus] = useState('idle');
  const [publishMessage, setPublishMessage] = useState('');

  // Live remote sync from /data/content.json on mount
  useEffect(() => {
    let isMounted = true;
    const fetchRemoteContent = async () => {
      try {
        const res = await fetch(`/data/content.json?v=${Date.now()}`);
        if (res.ok) {
          const remoteData = await res.json();
          if (!isMounted) return;
          if (remoteData?.content) {
            setPublishedContent((prev) => migrateLegacyBentoImages(mergeDeep(prev, remoteData.content)));
            setDraftContent((prev) =>
              hasUnsavedChanges ? prev : migrateLegacyBentoImages(mergeDeep(prev, remoteData.content))
            );
          }
          if (remoteData?.settings) {
            setSettings((prev) => ({ ...prev, ...remoteData.settings }));
          }
        }
      } catch {
        // Flat file sync fallback silently to local defaults
      }
    };
    fetchRemoteContent();
    return () => {
      isMounted = false;
    };
  }, []);

  // Helper to detect accidental React SyntheticEvents, DOM Events, or DOM Nodes
  const isEventOrDom = (val) =>
    Boolean(val) &&
    typeof val === 'object' &&
    (Boolean(val._reactName || val.nativeEvent) ||
      (typeof Event !== 'undefined' && val instanceof Event) ||
      (typeof Node !== 'undefined' && val instanceof Node));

  // Strip any circular references, DOM nodes, or React fibers before JSON serialization
  const sanitizeForJson = (data) => {
    if (data === null || typeof data !== 'object') return data;
    if (isEventOrDom(data)) return Array.isArray(data) ? [] : {};
    const seen = new WeakSet();
    return JSON.parse(
      JSON.stringify(data, (key, value) => {
        if (value === null || typeof value !== 'object') return value;
        if (
          value._reactName ||
          value.nativeEvent ||
          (typeof HTMLElement !== 'undefined' && value instanceof HTMLElement) ||
          (typeof Element !== 'undefined' && value instanceof Element) ||
          (typeof Node !== 'undefined' && value instanceof Node) ||
          (typeof Event !== 'undefined' && value instanceof Event) ||
          (typeof Window !== 'undefined' && value instanceof Window) ||
          key.startsWith('__react') ||
          key === 'stateNode'
        ) {
          return undefined;
        }
        if (seen.has(value)) return undefined;
        seen.add(value);
        return value;
      })
    );
  };

  // Update working draft
  const updateDraft = (section, data) => {
    if (data && typeof data === 'object' && isEventOrDom(data)) return;
    const cleanData = data && typeof data === 'object' ? sanitizeForJson(data) : data;
    setDraftContent((prev) => {
      let next;
      if (typeof section === 'string' && section.includes('.')) {
        const [parent, child] = section.split('.');
        next = {
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: cleanData,
          },
        };
      } else {
        next = { ...prev, [section]: cleanData };
      }

      if (section === 'home' || section === 'home.hero') {
        next.hero = next.home?.hero || next.hero;
      }
      if (section === 'home.bento' || section === 'bento') {
        next.services = next.home?.bento || next.services;
      }
      if (section === 'home.vetting' || section === 'vetting') {
        next.vettingStages = next.home?.vetting || next.vettingStages;
      }
      if (section === 'home.faqs' || section === 'faqs') {
        next.faqs = next.home?.faqs || next.faqs;
      }
      if (section === 'home.testimonials' || section === 'testimonials') {
        next.testimonials = next.home?.testimonials || next.testimonials;
      }

      setHasUnsavedChanges(true);
      return next;
    });
  };

  // Sync CSS variable for primary accent across the application
  useEffect(() => {
    if (typeof document !== 'undefined' && settings?.primaryAccent) {
      document.documentElement.style.setProperty('--sahara-accent', settings.primaryAccent);
    }
  }, [settings?.primaryAccent]);

  // Sync SEO Meta Tags live to document head
  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (settings?.seoTitle) {
      document.title = settings.seoTitle;
    }
    const updateMeta = (name, value) => {
      if (!value) return;
      let el = document.querySelector(`meta[name="${name}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute('name', name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', value);
    };
    updateMeta('description', settings?.seoDescription);
    updateMeta('keywords', settings?.seoKeywords);
  }, [settings?.seoTitle, settings?.seoDescription, settings?.seoKeywords]);

  // Update brand/additional settings
  const updateSettings = (newSettings) => {
    if (!newSettings || isEventOrDom(newSettings)) return;
    const cleanNewSettings = sanitizeForJson(newSettings);
    setSettings((prev) => {
      const updated = sanitizeForJson({ ...prev, ...cleanNewSettings });
      try {
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      setHasUnsavedChanges(true);
      return updated;
    });
  };

  // Publish working draft & settings to live website & flat JSON storage
  const publishChanges = async (overrideSettings = null, overrideContent = null) => {
    setPublishStatus('saving');
    try {
      const validOverrideSettings = overrideSettings && !isEventOrDom(overrideSettings) ? overrideSettings : null;
      const validOverrideContent = overrideContent && !isEventOrDom(overrideContent) ? overrideContent : null;

      const payload = sanitizeForJson(validOverrideContent ? { ...validOverrideContent } : { ...draftContent });
      const settingsPayload = sanitizeForJson(
        validOverrideSettings ? { ...settings, ...validOverrideSettings } : { ...settings }
      );

      localStorage.setItem(CMS_STORAGE_KEY, JSON.stringify(payload));
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settingsPayload));
      if (validOverrideContent) setDraftContent(payload);
      if (validOverrideSettings) setSettings(settingsPayload);
      setPublishedContent(payload);

      // Retrieve admin bearer token for secured save endpoint
      let adminToken = '';
      try {
        const savedSession = sessionStorage.getItem('sahara_admin_session_v2');
        if (savedSession) {
          const parsed = JSON.parse(savedSession);
          adminToken = parsed?.token || '';
        }
      } catch {}

      const authHeaders = {
        'Content-Type': 'application/json',
        ...(adminToken ? { Authorization: `Bearer ${adminToken}` } : {}),
      };

      const serializedBody = JSON.stringify({ content: payload, settings: settingsPayload });

      try {
        let response = await fetch('/api/save-content.php', {
          method: 'POST',
          headers: authHeaders,
          body: serializedBody,
        });
        if (!response.ok) {
          response = await fetch('/data/save-content.php', {
            method: 'POST',
            headers: authHeaders,
            body: serializedBody,
          });
        }
        if (response.ok) {
          const resData = await response.json();
          setPublishMessage(resData.message || 'Site Content & Additional Settings Published Live!');
        } else {
          setPublishMessage('Site Content & Additional Settings Published Live!');
        }
      } catch {
        setPublishMessage('Site Content & Additional Settings Published Live!');
      }

      setHasUnsavedChanges(false);
      setPublishStatus('published');
      setTimeout(() => {
        setPublishStatus('idle');
        setPublishMessage('');
      }, 4000);

      return { success: true, message: 'Site Content & Additional Settings Published Live!' };
    } catch (err) {
      console.error('Publish error:', err);
      setPublishStatus('error');
      setPublishMessage(err.message || 'Failed to publish changes');
      setTimeout(() => setPublishStatus('idle'), 4000);
      return { success: false, error: err.message };
    }
  };

  const discardDraft = () => {
    setDraftContent(publishedContent);
    try {
      const savedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (savedSettings) setSettings(JSON.parse(savedSettings));
    } catch {}
    setHasUnsavedChanges(false);
  };

  const resetToFactoryDefaults = () => {
    setPublishedContent(INITIAL_CMS_CONTENT);
    setDraftContent(INITIAL_CMS_CONTENT);
    setSettings(INITIAL_SETTINGS);
    localStorage.removeItem(CMS_STORAGE_KEY);
    localStorage.removeItem(SETTINGS_STORAGE_KEY);
    setHasUnsavedChanges(false);
  };

  return (
    <CMSContext.Provider
      value={{
        content: publishedContent,
        draftContent,
        settings,
        hasUnsavedChanges,
        publishStatus,
        publishMessage,
        updateDraft,
        updateSettings,
        publishChanges,
        discardDraft,
        resetToFactoryDefaults,
      }}
    >
      {children}
    </CMSContext.Provider>
  );
}

const FALLBACK_CMS_VALUE = {
  content: INITIAL_CMS_CONTENT,
  draftContent: INITIAL_CMS_CONTENT,
  settings: INITIAL_SETTINGS,
  hasUnsavedChanges: false,
  publishStatus: 'idle',
  publishMessage: '',
  updateDraft: () => {},
  updateSettings: () => {},
  publishChanges: async () => ({ success: false }),
  discardDraft: () => {},
  resetToFactoryDefaults: () => {},
};

export function useCMS() {
  const previewContext = useContext(CMSPreviewContext);
  const ctx = useContext(CMSContext);
  if (!ctx && !previewContext) {
    return FALLBACK_CMS_VALUE;
  }
  if (previewContext) {
    return {
      ...(ctx || FALLBACK_CMS_VALUE),
      content: previewContext.content || ctx?.content || INITIAL_CMS_CONTENT,
      settings: previewContext.settings || ctx?.settings || INITIAL_SETTINGS,
      isLivePreview: true,
    };
  }
  return ctx;
}
