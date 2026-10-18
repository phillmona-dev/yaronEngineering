/**
 * Official company information. Source: Yaron Engineering PLC Company Profile (updated August 2026).
 * Anything not confirmed is marked as a placeholder — never present placeholders as facts.
 */
export const company = {
  name: "Yaron Engineering PLC",
  shortName: "Yaron Engineering",
  legalName: "Yaron Engineering PLC",
  tagline: "ICT Infrastructure & Cybersecurity Systems Integrator",
  slogan: "Innovating Infrastructure. Empowering Growth.",
  founded: 2018,
  foundedMonth: "August",
  headquarters: {
    city: "Addis Ababa",
    country: "Ethiopia",
    countryCode: "ET",
    /** Street address as published in the company profile. */
    streetAddress: "Mana Building, 4th Floor, Room 414A, Fiyel Bet, CMC Summit",
    full: "Mana Building, 4th Floor, Room 414A, Fiyel Bet, CMC Summit, Addis Ababa, Ethiopia",
    /** Approximate city coordinates for schema only. */
    geo: { lat: 9.0192, lng: 38.8313 },
  },
  contact: {
    email: "tadesse@yaronengineering.com",
    salesEmail: "sales@yaronengineering.com",
    phones: ["+251 944 159 690", "+251 944 220 055", "+251 944 211 112"],
    phonesE164: ["+251944159690", "+251944220055", "+251944211112"],
    whatsapp: "+251 944 159 690",
    whatsappE164: "251944159690",
  },
  vision:
    "By 2035, Yaron Engineering PLC will be among the top 5 leading ICT Infrastructure & Cyber Security system integration and consulting firms in East Africa, recognized for industry-standard solutions and empowering regional digital transformation.",
  mission:
    "We serve our customers with integrity, lead with professionalism, and deliver solutions that have a real impact.",
  description:
    "Yaron Engineering PLC delivers enterprise ICT infrastructure, cybersecurity, data center, cloud, enterprise technology and security solutions across Ethiopia and East Africa.",
  story: [
    "Founded in 2018 and headquartered in Addis Ababa, Ethiopia, Yaron Engineering PLC was established with a bold and forward-looking vision: to become the leading ICT and Telecom consulting and system integration firm in Ethiopia and the greater East African region.",
    "Since inception, Yaron Engineering has successfully delivered more than 30 high-impact projects for more than 40 clients across government institutions, enterprises, NGOs and financial organizations. That growth is built on a reputation for technical excellence, reliability and results-driven execution.",
  ],
  commitment: [
    "At Yaron Engineering PLC, we do more than deploy systems — we build long-term partnerships rooted in trust, innovation and measurable value. Our customer-centric approach ensures that every solution is designed not just to function, but to empower.",
    "With a growing network of global technology partners and a strong local delivery team, we are uniquely positioned to help organizations digitally transform, scale securely and operate smarter.",
  ],
  coreValues: [
    {
      title: "Professional Excellence & Integrity",
      text: "We uphold the highest standards of professionalism and ethical conduct in every service we provide, ensuring trust, transparency and accountability.",
    },
    {
      title: "Customer-Centric Commitment",
      text: "Our customers are at the heart of everything we do. We actively listen, respond and adapt to deliver solutions tailored to their unique needs.",
    },
    {
      title: "Earning and Sustaining Customer Loyalty",
      text: "We build lasting relationships through consistency, reliability and value — transforming one-time clients into long-term partners.",
    },
    {
      title: "Problem Solving with Purpose",
      text: "We approach every challenge with a solution-oriented mindset, delivering innovative, practical answers that address both current issues and future goals.",
    },
    {
      title: "Value Creation for Every Client",
      text: "We don't just provide services — we deliver measurable value that enhances our clients' operations, performance and competitive edge.",
    },
  ],
  businessLines: [
    "Consultancy services",
    "System integration services",
    "Training services",
    "Hardware and software import and supply",
  ],
  /** Main business areas as listed in the company profile. */
  businessAreas: [
    {
      title: "Data Center Infrastructure & Facilities",
      text: "End-to-end design, construction and modernization of next-generation data center environments — including edge data centers, modular builds, precision cooling and sustainable energy solutions.",
    },
    {
      title: "Data Center Networking",
      text: "Ultra-resilient, high-speed data center fabrics using software-defined networking (SDN), EVPN-VXLAN architecture and AI-driven network automation.",
    },
    {
      title: "Enterprise LAN & WAN Solutions",
      text: "Intelligent, secure and scalable networking — powered by LAN SDN, SD-WAN, Wi-Fi 6/6E and Wi-Fi 7, network segmentation and cloud-managed infrastructure.",
    },
    {
      title: "Cybersecurity Architecture & Solutions",
      text: "Full-spectrum cybersecurity including Zero Trust frameworks, XDR (extended detection and response), AI-powered threat hunting and SOC integration for enterprise resilience.",
    },
    {
      title: "High-Performance Computing & Storage",
      text: "HPC clusters, hyper-converged infrastructure (HCI), NVMe storage, GPU-accelerated computing and scalable parallel file systems.",
    },
    {
      title: "Information Security & IT Governance",
      text: "Enterprise information security strategies aligned with ISO 27001, NIST, CIS Controls and digital risk governance frameworks — combined with audit readiness and compliance automation.",
    },
    {
      title: "Video Surveillance & Access Control",
      text: "Smart physical security with AI-powered video analytics, facial recognition, license plate recognition (LPR), biometric access control and centralized command systems.",
    },
    {
      title: "Cloud Infrastructure & Managed Services",
      text: "SaaS, PaaS and IaaS services, with hybrid and multi-cloud architecture and managed operations.",
    },
    {
      title: "ICT Consultancy",
      text: "Independent ICT consultancy for core insurance, core banking and ERP solutions, and for national-scale infrastructure programmes.",
    },
  ],
  /** Delivery model: the three service lines described in the company profile. */
  serviceLines: [
    {
      title: "Consultancy services",
      text: "Independent design and supervision across every layer of ICT infrastructure.",
      items: [
        "Data center facility design and supervision",
        "Network design and supervision",
        "Computing and storage systems design and supervision",
        "Video surveillance and access control systems design and supervision",
        "Video and IP telephone communication systems design and supervision",
        "Cybersecurity systems design and supervision",
        "ISMS, IT governance and ITSM services",
        "Cloud services design and implementation",
      ],
    },
    {
      title: "System integration services",
      text: "End-to-end integration that turns complex, multi-vendor IT and OT technologies into unified, high-performing, secure and scalable ecosystems aligned to business goals and digital transformation strategies.",
      items: [
        "Data center construction",
        "Network system integration",
        "Computing and storage systems integration",
        "Electronic security systems integration",
        "Video and IP telephone communication systems integration",
        "Cybersecurity systems integration",
        "Cloud services integration",
      ],
    },
    {
      title: "Hardware & software import and supply",
      text: "Sourcing, procurement and delivery of enterprise-grade ICT hardware and software through trusted partnerships with global OEMs and Tier 1 distributors — ensuring genuine products, timely delivery and end-to-end support.",
      items: [
        "Genuine OEM hardware and software",
        "Global OEM and Tier 1 distributor partnerships",
        "Timely delivery",
        "End-to-end support",
      ],
    },
  ],
  /** Social profiles are intentionally empty until official links are provided. */
  social: [] as { label: string; href: string }[],
} as const;

export const stats = [
  { value: 30, suffix: "+", label: "High-impact projects", note: "Delivered since 2018" },
  { value: 40, suffix: "+", label: "Clients served", note: "Government, enterprise, NGO, finance" },
  { value: 20, suffix: "+", label: "Years combined leadership", note: "Founding team experience" },
  { value: 2018, suffix: "", label: "Founded", note: "Addis Ababa, Ethiopia", plain: true },
] as const;

export const sectors = [
  "Government institutions",
  "Enterprises",
  "NGOs",
  "Financial organizations",
] as const;

export const leadershipRoles = [
  "Network Engineers",
  "Data Center Engineers",
  "ICT Project Managers",
  "IT Directors",
  "ICT Sales Managers",
  "Consultants for national and international ICT infrastructure projects",
] as const;
