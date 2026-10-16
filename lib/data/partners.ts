/**
 * Technology partners as listed on the company's legacy website partners page.
 * Logo files are the partner logos published on the company's own partners page, normalised to
 * transparent PNGs at 120px height in `public/images/partners`. Set `logo: null` to fall back to a wordmark.
 */
export type Partner = { name: string; logo: string | null; category: string };

export const partners: Partner[] = [
  { name: "Microsoft", logo: "/images/partners/microsoft.png", category: "Cloud & productivity" },
  { name: "Cisco", logo: "/images/partners/cisco.png", category: "Networking" },
  { name: "Dell Technologies", logo: "/images/partners/dell.png", category: "Compute & storage" },
  { name: "Fortinet", logo: "/images/partners/fortinet.png", category: "Security" },
  { name: "Huawei", logo: "/images/partners/huawei.png", category: "Networking & ICT" },
  { name: "Kaspersky", logo: "/images/partners/kaspersky.png", category: "Endpoint security" },
  { name: "Arista", logo: "/images/partners/arista.png", category: "Data center networking" },
  {
    name: "Nutanix",
    logo: "/images/partners/nutanix.png",
    category: "Hyper-converged infrastructure",
  },
  { name: "Veeam", logo: "/images/partners/veeam.png", category: "Backup & recovery" },
  { name: "Sophos", logo: "/images/partners/sophos.png", category: "Security" },
  { name: "Siemon", logo: "/images/partners/siemon.png", category: "Structured cabling" },
  { name: "Mitel", logo: "/images/partners/mitel.png", category: "Unified communications" },
  { name: "Quantum", logo: "/images/partners/quantum.png", category: "Storage" },
  {
    name: "Cyber Observer",
    logo: "/images/partners/cyberobserver.png",
    category: "Security posture",
  },
];
