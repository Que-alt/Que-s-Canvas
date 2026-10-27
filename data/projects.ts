// ─────────────────────────────────────────────────────────────
//  Case studies (/work/<slug>), in the order of the Selected
//  Work categories on the home page (data/work.ts).
//
//  Anything left out renders as a clearly-labelled placeholder
//  (or is simply not shown), so the template never shows
//  invented content.
//
//  Images: put files in /public/images/projects/<slug>/.
//  - gallery: 16:10 screens (2400×1500) shown in The Outcome,
//    every third one full width (or set `wide` on each image to
//    choose). Until it's filled in, The Outcome
//    shows one labelled slot per `showcase` item.
//  - cover: a wide image (2:1) for the "Next project" panel and
//    link previews. The home-page card image lives in data/work.ts.
//  Replacing an image? Give it a new file name: Next.js caches
//  resized images by path.
// ─────────────────────────────────────────────────────────────

export type ProjectImage = { src: string; alt: string; caption?: string; wide?: boolean }; // wide: see the gallery note above

// The case study reads as chapters (numbered in order; Overview only when written):
//  Overview — What did we set out to create?               → overview
//  The Business Problem — Why did it matter?               → challenge
//  The Approach & Solution — How did we solve it?          → approach, process, stack
//  The Outcome — Let the work speak for itself.            → gallery (or showcase slots), outcome, outcomes
//  My Role — What was my contribution?                     → role
export type CaseStudy = {
  overview?: string;
  challenge?: string;
  approach?: string;
  process?: { title: string; body: string }[];
  stack?: string[];
  showcase?: string[]; // screens to show; placeholders until `gallery` has images
  gallery?: ProjectImage[];
  outcome?: string;
  outcomes?: string[];
  role?: string[];
};

export type Project = {
  slug: string; // URL: /work/<slug>
  title: string;
  tagline: string; // the line under the title
  description: string; // search results and link previews
  category: string; // the Selected Work category
  client?: string; // client work…
  product?: string; // …or an in-house product
  agency?: string; // where the work was executed, shown as "Executed at"
  year?: string;
  link?: string; // "View the project" — shown once added
  cover?: ProjectImage; // "Next project" panel and link previews
  tint: string; // background colour used behind the placeholder cover
  caseStudy?: CaseStudy;
};

const ENTERPRISE = "Enterprise UX & Digital Transformation";
const AI = "AI & Product Innovation";
const PRODUCT = "Product Design & Engineering";
const CREATIVE = "Creative Technology & Interactive Experiences";

export const projects: Project[] = [
  {
    slug: "kcb-digital-banking",
    title: "KCB Mobile Banking App & Design System",
    tagline: "Reimagining everyday banking.",
    description:
      "A redesigned mobile banking experience built around simpler journeys, clearer interactions and a unified design language.",
    category: ENTERPRISE,
    client: "KCB Group",
    agency: "Dentsu",
    cover: { src: "/images/projects/kcb-digital-banking/banner.jpg", alt: "KCB app onboarding, light home dashboard and dark home dashboard" },
    tint: "#E3FAF1",
    caseStudy: {
      challenge:
        "KCB needed to simplify complex banking journeys and deliver a more intuitive, consistent mobile experience. The opportunity was to reduce friction across everyday transactions while building a scalable foundation for future digital banking services.",
      approach:
        "We combined customer research, journey mapping and UX strategy to redesign critical banking experiences, including onboarding, payments, transfers and loans. Alongside the app redesign, we developed a scalable design system to unify interactions, improve usability and support consistent product development.",
      outcome:
        "A redesigned mobile banking experience built around simpler journeys, clearer interactions and a unified design language.",
      showcase: ["App onboarding", "Home dashboard", "Payments", "Transfers", "Loans", "Design system components"],
      gallery: [
        { src: "/images/projects/kcb-digital-banking/home.jpg", alt: "KCB home dashboards in light and dark themes", caption: "Home dashboard, light and dark", wide: true },
        { src: "/images/projects/kcb-digital-banking/onboarding.jpg", alt: "KCB onboarding screens: Let your money play, Bill Payments Made Easy", caption: "App onboarding", wide: false },
        { src: "/images/projects/kcb-digital-banking/account.jpg", alt: "KCB settings and loans screens", caption: "Settings and loans", wide: false },
        { src: "/images/projects/kcb-digital-banking/design-system.jpg", alt: "KCB mobile app design system: typography, colours, iconography, cards, buttons and tabs", caption: "Design system components", wide: true },
        { src: "/images/projects/kcb-digital-banking/settings-discover-loans.jpg", alt: "KCB settings, change theme, Discover coming soon and active loans", caption: "Settings, themes, Discover and loans", wide: true },
      ],
      role: ["UX Strategy", "Product Leadership", "Technology Strategy", "Implementation Oversight"],
    },
  },
  {
    // From the "Apps" slides (The Britam Customer App), the Britam App and Portal Pitch file
    // (portal) and the Super App RFP slides (UI kit and copy).
    slug: "britam",
    title: "Britam Customer App & Portal",
    tagline: "With you every step of the way.",
    description: "Britam's customer app and web portal for insurance, investments and pensions in one place.",
    category: ENTERPRISE,
    client: "Britam",
    agency: "Dentsu",
    cover: { src: "/images/projects/britam/banner.jpg", alt: "Britam onboarding, home and help screens on mobile" },
    tint: "#E6EEFA",
    caseStudy: {
      challenge:
        "Britam sought to unify its digital ecosystem by establishing a single design language that would standardise customer experiences across insurance and investment products while accelerating digital product delivery through an enterprise design system.",
      approach:
        "We established Britam's enterprise design system and led the end-to-end UX process, including user research, stakeholder workshops, journey mapping, information architecture, wireframing, prototyping, and UX/UI design. The customer application was subsequently developed in Flutter using the design system to ensure consistency across web and mobile experiences.",
      outcome:
        "The initiative established a single source of truth for Britam's digital products, delivering a consistent customer experience, accelerating design and development, strengthening brand consistency, and creating a scalable foundation for future digital platforms across the organisation.",
      gallery: [
        { src: "/images/projects/britam/welcome.jpg", alt: "Britam splash screen and Welcome to the new app", caption: "Splash and welcome", wide: true },
        { src: "/images/projects/britam/design-system.jpg", alt: "Britam UI kit: colours, buttons, navigation, form controls, alerts, grid and icons", caption: "Design system", wide: false },
        { src: "/images/projects/britam/portal.jpg", alt: "Britam customer portal: Buy Now products for insurance, retirement and investments", caption: "Customer portal", wide: false },
        { src: "/images/projects/britam/onboarding.jpg", alt: "Britam onboarding, home with quick actions and products, and New to Britam help", caption: "Onboarding, home and help", wide: true },
        { src: "/images/projects/britam/products.jpg", alt: "My Products, Discover offers, an AutoExpress discount and Buy Now investment funds", caption: "Products, offers and buying", wide: true },
      ],
      role: ["UX Strategy", "Product Leadership", "Technology Strategy", "Implementation Oversight"],
    },
  },
  // Rido and Orbit are provisional: copy reflects what's been shared so far, pending product documentation
  {
    slug: "rido",
    title: "Rido — AI-Powered CRM",
    tagline: "Turning customer interest into business growth.",
    description: "A CRM platform designed to help businesses turn customer demand into measurable commercial opportunities.",
    category: AI,
    product: "Rido",
    agency: "Dentsu",
    cover: { src: "/images/projects/rido/banner.jpg", alt: "Rido's welcome screen, leads dashboard and log-in" },
    tint: "#F2EBFB",
    caseStudy: {
      challenge:
        "Businesses invest heavily in generating customer leads, yet fragmented tracking, delayed follow-ups and limited visibility can result in missed conversion opportunities. Rido addresses the need for a more connected approach to managing leads from initial interest through to conversion.",
      approach:
        "We developed Rido as an AI-powered CRM designed to centralise lead management, support customer nurturing and improve visibility across the conversion journey. The platform brings together lead tracking and follow-up workflows to help teams manage opportunities more effectively.",
      outcome:
        "A CRM platform designed to help businesses turn customer demand into measurable commercial opportunities.",
      showcase: [
        "Lead dashboard",
        "Lead management",
        "Customer profiles",
        "Nurturing workflows",
        "Conversion reporting",
        "AI capabilities",
      ],
      gallery: [
        { src: "/images/projects/rido/dashboard-framed.jpg", alt: "Rido web dashboard: overall lead performance, top products and lead analysis", caption: "Home dashboard" },
        { src: "/images/projects/rido/customer-profile-framed.jpg", alt: "Rido customer profile: segments and recent customers", caption: "Customer profiles" },
        { src: "/images/projects/rido/campaigns-framed.jpg", alt: "Rido campaign dashboard: overall campaign performance and channel performance", caption: "Email automation" },
        { src: "/images/projects/rido/screens.jpg", alt: "Rido welcome, log-in and leads dashboard on mobile", caption: "Mobile app" },
      ],
      role: ["Product Strategy", "UX Leadership", "Technology Strategy", "Implementation Oversight"],
    },
  },
  {
    slug: "orbit",
    title: "Orbit — AI Platform",
    tagline: "Turning AI possibilities into practical innovation.",
    description:
      "An AI-focused product initiative demonstrating how emerging technologies can be translated into practical digital experiences.",
    category: AI,
    product: "Orbit",
    agency: "Dentsu",
    link: "https://orbitos.africa/",
    cover: { src: "/images/projects/orbit/banner.jpg", alt: "Orbit's homepage on desktop beside its Discover step on mobile" },
    tint: "#EAE6F7",
    caseStudy: {
      challenge:
        "As AI capabilities evolve, businesses need ways to move beyond experimentation and apply emerging technologies to meaningful challenges. Orbit was developed as an in-house AI innovation initiative focused on exploring practical applications of artificial intelligence.",
      approach:
        "We approached Orbit through product and technology strategy, bringing together UX thinking and AI-enabled product development to explore how intelligent capabilities could support real-world business needs.",
      outcome:
        "An AI-focused product initiative demonstrating how emerging technologies can be translated into practical digital experiences.",
      showcase: ["Orbit interface", "Primary workflows", "AI interactions", "Product capabilities"],
      gallery: [
        { src: "/images/projects/orbit/homepage.jpg", alt: "Orbit homepage: Turn trends into smarter action", caption: "Homepage" },
        { src: "/images/projects/orbit/setup.jpg", alt: "Step 01, Set up: brand, market, team and channels", caption: "01 — Set up" },
        { src: "/images/projects/orbit/discover.jpg", alt: "Step 02, Discover: trending topics and suggested posts", caption: "02 — Discover" },
        { src: "/images/projects/orbit/mobile.jpg", alt: "Orbit's Discover step, homepage and Create step on mobile", caption: "Mobile" },
        { src: "/images/projects/orbit/create.jpg", alt: "Step 03, Create: creative directions, captions and channels", caption: "03 — Create" },
        { src: "/images/projects/orbit/learn.jpg", alt: "Step 04, Learn: publish, then track performance", caption: "04 — Learn" },
      ],
      role: ["Product Strategy", "UX Leadership", "AI Innovation", "Technology Strategy"],
    },
  },
  {
    slug: "brrd",
    title: "Brrd — Short Stays & Storage",
    tagline: "Freedom to explore, without the baggage.",
    description:
      "A functional MVP combining short stays, luggage storage and booking experiences in one platform, developed and refined through iterative testing.",
    category: PRODUCT,
    product: "Brrd",
    agency: "Morpheus",
    link: "https://brrd-app.vercel.app/",
    cover: { src: "/images/projects/brrd/banner.jpg", alt: "Brrd's explore page on desktop beside a Nest listing on mobile" },
    tint: "#E9E8F4",
    caseStudy: {
      challenge:
        "Travellers often find themselves carrying luggage between check-in and check-out times, limiting their freedom to explore. Traditional storage options can be inconvenient and disconnected from the wider travel experience, creating an opportunity for a simpler, more flexible solution.",
      approach:
        "I designed and developed Brrd as a mobile-first platform bringing short-stay accommodation and luggage storage into one experience. From discovering nearby Nests to managing bookings, the product simplifies travel logistics and introduces luggage pickup and delivery as part of its service concept.",
      outcome:
        "A functional MVP combining short stays, luggage storage and booking experiences in one platform, developed and refined through iterative testing.",
      showcase: [
        "Homepage",
        "Location discovery",
        "Nest listings",
        "Accommodation and storage details",
        "Booking flow",
        "Checkout",
        "Mobile experiences",
      ],
      gallery: [
        { src: "/images/projects/brrd/recommended.jpg", alt: "Recommended in Nairobi: short stays with hourly prices", caption: "Recommended stays" },
        { src: "/images/projects/brrd/why-brrd.jpg", alt: "Why Travellers Choose Brrd: hourly stays, luggage storage, bag delivery and protection", caption: "Why travellers choose Brrd" },
        { src: "/images/projects/brrd/explore-map.jpg", alt: "Nest listings beside a map of Nairobi", caption: "Location discovery and Nest listings" },
        { src: "/images/projects/brrd/mobile.jpg", alt: "Brrd's map, homepage and listing on mobile", caption: "Mobile experiences" },
      ],
      role: ["Product Strategy", "UX/UI Design", "Full-Stack Development", "Deployment & Maintenance"],
    },
  },
  {
    slug: "safaricom-design-system",
    title: "Safaricom Website & Enterprise Design System",
    tagline: "One digital language. Multiple experiences.",
    description:
      "A unified design foundation supporting consistent, scalable digital experiences across Safaricom's ecosystem.",
    category: PRODUCT,
    client: "Safaricom",
    agency: "WPP Scangroup & Dentsu",
    cover: { src: "/images/projects/safaricom-design-system/banner.jpg", alt: "Safaricom's corporate website on a tablet beside its mobile shop" },
    tint: "#EEE7FA",
    caseStudy: {
      challenge:
        "As Safaricom's digital ecosystem expanded, maintaining consistent user experiences across multiple websites and platforms became increasingly complex. The challenge was to establish a unified design foundation that could strengthen brand consistency, simplify customer journeys and support scalable digital development.",
      approach:
        "We created an enterprise design system built around reusable UI components, design tokens and consistent interaction patterns. Using this foundation, we designed and developed Safaricom's corporate website and extended the system across other digital platforms, including Safaricom Foundation, M-PESA Foundation, Safaricom Chapa Dimba and Safaricom Golf Tour, ensuring consistent experiences while streamlining design and development.",
      outcome:
        "A connected digital ecosystem built on a unified design system, delivering consistent, scalable experiences across Safaricom's corporate website and multiple customer-facing platforms.",
      showcase: [
        "Corporate website",
        "Responsive layouts",
        "Design system components",
        "Typography",
        "Interaction patterns",
        "Examples across Safaricom platforms",
      ],
      gallery: [
        { src: "/images/projects/safaricom-design-system/website-tablet-md.jpg", alt: "Safaricom corporate website on a tablet", caption: "Corporate website" },
        { src: "/images/projects/safaricom-design-system/design-system.jpg", alt: "Safaricom design system: colours, icons, cards, toggles, buttons and checkboxes", caption: "Design system components" },
        { src: "/images/projects/safaricom-design-system/shop.jpg", alt: "Safaricom shop page: This Month's Picks", caption: "Shop: This Month's Picks" },
      ],
      role: ["UX & Product Strategy", "Design System Leadership", "Technology Strategy", "Implementation Oversight"],
    },
  },
  {
    slug: "friday",
    title: "Friday — Modern ERP",
    tagline: "Business management, without the complexity.",
    description:
      "A modern ERP product experience designed to make business workflows clearer, more accessible and easier to manage.",
    category: PRODUCT,
    product: "Friday",
    agency: "Morpheus",
    cover: { src: "/images/projects/friday/banner-v2.jpg", alt: "Friday's home dashboard on desktop and mobile" },
    tint: "#EAE6F7",
    caseStudy: {
      challenge:
        "Traditional ERP systems can make everyday business operations unnecessarily complex. Friday was conceived to create a simpler, more intuitive way for teams to interact with business processes and manage their work through a modern digital experience.",
      approach:
        "I approached Friday as an end-to-end product design and engineering initiative, combining UX strategy, interface design and software development. The focus was on simplifying workflows, improving navigation and establishing a consistent experience across the platform.",
      outcome:
        "A modern ERP product experience designed to make business workflows clearer, more accessible and easier to manage.",
      showcase: ["Friday dashboard", "Navigation", "Operational modules", "Workflows", "Responsive interfaces"],
      gallery: [
        { src: "/images/projects/friday/homepage.jpg", alt: "Friday homepage: The simple way to manage your finances", caption: "Homepage" },
        { src: "/images/projects/friday/dashboard.jpg", alt: "Friday home dashboard: cash, budget, approvals, payroll and grants", caption: "Home dashboard" },
        { src: "/images/projects/friday/dashboard-insights.jpg", alt: "Grant burn rate, AP aging, payroll cost by country and procurement pipeline", caption: "Insights at a glance" },
        { src: "/images/projects/friday/modules.jpg", alt: "Six modules: Finance, Procurement, HR, Payroll, Reporting and Admin", caption: "One platform, six modules" },
      ],
      role: ["Product Strategy", "UX/UI Design", "Full-Stack Development", "Deployment & Maintenance"],
    },
  },
  {
    // From the Baze Pitch design file, submitted to Safaricom; the redesign didn't go live.
    // The agency is still to come; until then it shows a placeholder.
    slug: "baze",
    title: "Baze — Entertainment App",
    tagline: "Find your favourite games, movies, music and so much more.",
    description: "Baze, an entertainment app for games, movies and music, pitched to Safaricom.",
    category: CREATIVE,
    client: "Safaricom (pitch)",
    cover: { src: "/images/projects/baze/banner.jpg", alt: "Baze welcome, home and movie screens on mobile" },
    tint: "#EEE7FA",
    caseStudy: {
      challenge:
        "Safaricom BAZE faced challenges with content discoverability, navigation and user engagement. Research revealed that users struggled to find entertainment, encountered friction during sign-up and subscription, and lacked compelling reasons to return. The opportunity was to create a more intuitive, engaging entertainment experience.",
      approach:
        "We conducted a UX audit with 57 participants to identify usability gaps across navigation, content, interface design and key user journeys. Using these insights, we proposed a redesigned experience with simplified navigation, clearer content categorisation, intuitive menu drawers and an information architecture designed to support future growth.",
      outcome:
        "A research-informed redesign concept focused on making entertainment easier to discover, simplifying navigation and creating a more scalable digital experience.",
      gallery: [
        { src: "/images/projects/baze/welcome.jpg", alt: "Baze welcome screen, home and browse-by-category on mobile", caption: "Welcome, home and categories", wide: true },
        { src: "/images/projects/baze/welcome-sign-in.jpg", alt: "Baze welcome and sign-in screens on mobile", caption: "Welcome and sign in", wide: false },
        { src: "/images/projects/baze/games-light-dark.jpg", alt: "Baze games screen in light and dark mode", caption: "Games, light and dark", wide: false },
        { src: "/images/projects/baze/web-home.jpg", alt: "Baze web home: The Batman hero with app store badges", caption: "Web home", wide: true },
        { src: "/images/projects/baze/videos-music-games.jpg", alt: "Baze videos, music and games screens on mobile", caption: "Videos, music and games", wide: true },
      ],
      role: ["UX Strategy", "Product Leadership", "Technology Strategy", "Implementation Oversight"],
    },
  },

  {
    // From the "Cadbury Africa — AI Powered Library" slide and the ROA Gen 5 design file.
    slug: "cadbury-story-time",
    title: "Cadbury Story Time — AI-Powered Library",
    tagline: "Give a generous voice to Story Time.",
    description: "Cadbury Africa's AI-powered library of children's audiobooks.",
    category: CREATIVE,
    client: "Cadbury Africa",
    cover: { src: "/images/projects/cadbury-story-time/banner-web.jpg", alt: "Cadbury Story Time landing page on desktop and mobile" },
    tint: "#F2EBFB",
    caseStudy: {
      challenge:
        "Africa has a rich tradition of oral storytelling, yet fewer stories are being passed down between generations. Cadbury saw an opportunity to preserve this cultural heritage while helping parents create meaningful storytelling moments with their children, even when they couldn't physically be together.",
      approach:
        "We created an AI-powered digital storytelling platform where parents could discover, read and co-create African stories. Parents could record their own stories, which were then refined and published in the library, or record themselves reading featured books for their children to enjoy later. AI-powered recommendations helped surface culturally relevant stories based on region, while translation made stories accessible across different languages.",
      outcome:
        "A digital library that brought African storytelling into the modern age, preserving cultural narratives and allowing children to experience the comfort of their parents' voices, even when they were miles apart.",
      gallery: [
        { src: "/images/projects/cadbury-story-time/hero-1610.jpg", alt: "Story Time landing page: Give a Generous Voice to Story Time", caption: "Landing page" },
        { src: "/images/projects/cadbury-story-time/audiobooks-card.jpg", alt: "Explore Our Audiobooks carousel with play and download", caption: "Explore our audiobooks" },
        { src: "/images/projects/cadbury-story-time/ebooks-card.jpg", alt: "Explore Our E-Books grid of illustrated children's books", caption: "Explore our e-books" },
        { src: "/images/projects/cadbury-story-time/player-section-1610.jpg", alt: "Audiobook page for When the Flamboyant Trees Will Flower, with Listeners also enjoyed", caption: "Listen, then discover more" },
      ],
      role: ["UX Strategy", "Product Leadership", "Creative Technology", "AI Innovation", "Implementation Oversight"],
    },
  },

];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
