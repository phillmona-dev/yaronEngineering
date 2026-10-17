/**
 * Technology partners as listed on the company's legacy website partners page.
 * Logo files are the partner logos published on the company's own partners page, normalised to
 * transparent PNGs at 120px height in `public/images/partners`. Set `logo: null` to fall back to a wordmark.
 */
export type Partner = { name: string; logo: string | null; category: string; url: string };

export const partners: Partner[] = [
  { name: "Microsoft", logo: "/images/partners/microsoft.png", category: "Cloud & productivity", url: "https://www.microsoft.com" },
  { name: "Cisco", logo: "/images/partners/cisco.png", category: "Networking", url: "https://www.cisco.com" },
  { name: "Dell Technologies", logo: "/images/partners/dell.png", category: "Compute & storage", url: "https://www.dell.com" },
  { name: "Fortinet", logo: "/images/partners/fortinet.png", category: "Security", url: "https://www.fortinet.com" },
  { name: "Huawei", logo: "/images/partners/huawei.png", category: "Networking & ICT", url: "https://www.huawei.com" },
  { name: "Kaspersky", logo: "/images/partners/kaspersky.png", category: "Endpoint security", url: "https://www.kaspersky.com" },
  { name: "Arista", logo: "/images/partners/arista.png", category: "Data center networking", url: "https://www.arista.com" },
  { name: "Nutanix", logo: "/images/partners/nutanix.png", category: "Hyper-converged infrastructure", url: "https://www.nutanix.com" },
  { name: "Veeam", logo: "/images/partners/veeam.png", category: "Backup & recovery", url: "https://www.veeam.com" },
  { name: "Sophos", logo: "/images/partners/sophos.png", category: "Security", url: "https://www.sophos.com" },
  { name: "Siemon", logo: "/images/partners/siemon.png", category: "Structured cabling", url: "https://www.siemon.com" },
  { name: "Mitel", logo: "/images/partners/mitel.png", category: "Unified communications", url: "https://www.mitel.com" },
  { name: "Quantum", logo: "/images/partners/quantum.png", category: "Storage", url: "https://www.quantum.com" },
  { name: "Cyber Observer", logo: "/images/partners/cyberobserver.png", category: "Security posture", url: "https://www.cyberobserver.com" },
];

