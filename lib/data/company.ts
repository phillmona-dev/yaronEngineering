/**
 * Official company information. Source: yaronengineering.com (legacy site) and the brief.
 * Anything not confirmed is marked as a placeholder — never present placeholders as facts.
 */
export const company = {
  name: "Yaron Engineering PLC",
  shortName: "Yaron Engineering",
  legalName: "Yaron Engineering PLC",
  tagline: "ICT Infrastructure & Cybersecurity Systems Integrator",
  founded: 2018,
  foundedMonth: "August",
  headquarters: {
    city: "Addis Ababa",
    country: "Ethiopia",
    countryCode: "ET",
    /** Street address as published on the legacy site. */
    streetAddress: "Mana Building, 4th Floor, Room 414AB, CMC Summit, Fiyel Bet",
    full: "Mana Building, 4th Floor, Room 414AB, CMC Summit, Fiyel Bet, Addis Ababa, Ethiopia",
    /** Approximate city coordinates for schema only. */
    geo: { lat: 9.0192, lng: 38.8313 },
  },
  contact: {
    email: "info@yaronengineering.com",
    salesEmail: "yaron.sales@yaronengineering.com",
    phones: ["+251 944 159 690", "+251 913 404 580"],
    phonesE164: ["+251944159690", "+251913404580"],
    whatsapp: "+251 944 159 690",
    whatsappE164: "251944159690",
  },
  vision:
    "To become the leading ICT Infrastructure and Cyber Security consulting and system integrator firm in Ethiopia and the greater East African region.",
  description:
    "Yaron Engineering PLC delivers enterprise ICT infrastructure, cybersecurity, data center, cloud, enterprise technology and security solutions across Ethiopia and East Africa.",
  story: [
    "Founded in 2018 and headquartered in Addis Ababa, Ethiopia, Yaron Engineering PLC was established with a bold and forward-looking vision: to become the leading ICT Infrastructure and Cyber Security consulting and system integrator firm in Ethiopia and the greater East African region.",
    "Since inception, Yaron Engineering has successfully delivered more than 30 high-impact projects for more than 40 clients across government institutions, enterprises, NGOs and financial organizations. That growth is built on a reputation for technical excellence, reliability and results-driven execution.",
  ],
  commitment: [
    "At Yaron Engineering PLC, we do more than deploy systems — we build long-term partnerships rooted in trust, innovation and measurable value. Our customer-centric approach ensures that every solution is designed not just to function, but to empower.",
    "With a growing network of global technology partners and a strong local delivery team, we are uniquely positioned to help organizations digitally transform, scale securely and operate smarter.",
  ],
  coreValues: [
    "Professional excellence and integrity",
    "Customer focus",
    "Customer loyalty",
    "Customer problem solving",
    "Value addition to customers",
  ],
  businessLines: [
    "Consultancy services",
    "System integration services",
    "Training services",
    "Hardware and software import and supply",
  ],
  /** Social profiles are intentionally empty until official links are provided. */
  social: [] as { label: string; href: string }[],
} as const;

export const stats = [
  { value: 30, suffix: "+", label: "High-impact projects", note: "Delivered since 2018" },
  { value: 40, suffix: "+", label: "Clients served", note: "Government, enterprise, NGO, finance" },
  { value: 17, suffix: "+", label: "Years combined leadership", note: "Founding team experience" },
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
