/**
 * National and enterprise clients / internal partners in Ethiopia.
 * Includes official logos, service scopes, sector categories and website links.
 */
export type Customer = {
  id: string;
  name: string;
  amharicName?: string;
  logo: string;
  category: string;
  description: string;
  url: string;
};

export const customers: Customer[] = [
  {
    id: "awash-bank",
    name: "Awash Bank",
    amharicName: "አዋሽ ባንክ",
    logo: "/images/customers/awash-bank.png",
    category: "Banking & Financial Services",
    description:
      "Data Center, Network & Security, Computing & Storage, Information security and Governance consultancy.",
    url: "https://awashbank.com",
  },
  {
    id: "aa-culture-tourism",
    name: "Addis Ababa Culture, Art and Tourism Bureau",
    amharicName: "ባህል፣ ሥነ ጥበብ እና ቱሪዝም ቢሮ",
    logo: "/images/customers/aa-culture-tourism.png",
    category: "Government & Public Administration",
    description:
      "HQ Network and Security Project Design and Implementation services for Network and Security, CCTV and Digital Signage systems.",
    url: "https://discoveraddis.gov.et",
  },
  {
    id: "rammis-bank",
    name: "Rammis Bank",
    logo: "/images/customers/rammis-bank.png",
    category: "Banking & Financial Services",
    description:
      "Supply, Installation, and Configuration and Training for Microsoft Office 365 which Includes Email, Teams, OneDrive and Office Word, Excel, and PowerPoint.",
    url: "https://www.rammisbank.com",
  },
  {
    id: "lion-insurance",
    name: "Lion Insurance Company",
    amharicName: "አንበሳ ኢንሹራንስ ኩባንያ",
    logo: "/images/customers/lion-insurance.png",
    category: "Insurance & Financial Protection",
    description:
      "Lion Insurance Company Firewall Supply, installation, Configuration and Training.",
    url: "https://www.anbessainsurance.com",
  },
  {
    id: "debre-tabor-university",
    name: "Debre Tabor University",
    amharicName: "ደብረ ታቦር ዩኒቨርሲቲ",
    logo: "/images/customers/debre-tabor-university.png",
    category: "Higher Education & Research",
    description:
      "CCTV Project Design and Supervision IP Video Surveillance System Project.",
    url: "https://www.dtu.edu.et",
  },
  {
    id: "esl",
    name: "Ethiopian Shipping and Logistics Services Enterprise",
    amharicName: "የኢትዮጵያ ባህር ትራንስፖርትና ሎጂስቲክስ",
    logo: "/images/customers/esl.png",
    category: "State Enterprise & Logistics",
    description:
      "Data Center, Network & Security, and Computing & Storage consultancy service project.",
    url: "https://www.eslse.et",
  },
];
