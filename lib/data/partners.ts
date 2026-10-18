/**
 * Technology partners as listed in the company profile (updated August 2026), plus the partners
 * previously published on the company's own partners page (Arista, Siemon, Quantum, Cyber Observer).
 * Logo files are official vendor logos normalised to transparent PNGs at 120px height in
 * `public/images/partners`. Set `logo: null` to fall back to a wordmark.
 */
export type Partner = { name: string; logo: string | null; category: string; url?: string };

export const partners: Partner[] = [
  // Networking
  {
    name: "Cisco",
    logo: "/images/partners/cisco.png",
    category: "Enterprise networking, SD-Access & security",
    url: "https://www.cisco.com",
  },
  {
    name: "Huawei",
    logo: "/images/partners/huawei.png",
    category: "Campus & carrier-grade networking, modular data centers",
    url: "https://www.huawei.com",
  },
  {
    name: "Aruba Networks (HPE)",
    logo: "/images/partners/aruba.png",
    category: "Intelligent edge, Wi-Fi 6/6E",
    url: "https://www.hpe.com/us/en/aruba-networking.html",
  },
  {
    name: "Ruijie Networks",
    logo: "/images/partners/ruijie.png",
    category: "Agile access networking",
    url: "https://www.ruijienetworks.com",
  },
  {
    name: "Arista",
    logo: "/images/partners/arista.png",
    category: "Data center networking",
    url: "https://www.arista.com",
  },
  // Data center facility
  {
    name: "Attom Technologies",
    logo: "/images/partners/attom.png",
    category: "Power & physical infrastructure",
    url: "https://attom.tech",
  },
  {
    name: "Siemon",
    logo: "/images/partners/siemon.png",
    category: "Structured cabling",
    url: "https://www.siemon.com",
  },
  // Security
  {
    name: "Fortinet",
    logo: "/images/partners/fortinet.png",
    category: "Network security",
    url: "https://www.fortinet.com",
  },
  {
    name: "Check Point",
    logo: "/images/partners/checkpoint.png",
    category: "Threat prevention",
    url: "https://www.checkpoint.com",
  },
  {
    name: "Sophos",
    logo: "/images/partners/sophos.png",
    category: "Threat prevention",
    url: "https://www.sophos.com",
  },
  {
    name: "Kaspersky",
    logo: "/images/partners/kaspersky.png",
    category: "Threat prevention",
    url: "https://www.kaspersky.com",
  },
  { name: "Delina Technologies", logo: null, category: "Regional cyber security solutions" },
  {
    name: "Cyber Observer",
    logo: "/images/partners/cyberobserver.png",
    category: "Security posture",
    url: "https://www.cyberobserver.com",
  },
  // Compute & storage
  {
    name: "Dell Technologies",
    logo: "/images/partners/dell.png",
    category: "Enterprise hardware",
    url: "https://www.dell.com",
  },
  {
    name: "HPE",
    logo: "/images/partners/hpe.png",
    category: "Enterprise hardware",
    url: "https://www.hpe.com",
  },
  {
    name: "Lenovo",
    logo: "/images/partners/lenovo.png",
    category: "Enterprise hardware",
    url: "https://www.lenovo.com",
  },
  {
    name: "IBM",
    logo: "/images/partners/ibm.png",
    category: "Enterprise hardware & software",
    url: "https://www.ibm.com",
  },
  {
    name: "Nutanix",
    logo: "/images/partners/nutanix.png",
    category: "Software-defined HCI",
    url: "https://www.nutanix.com",
  },
  {
    name: "Veeam",
    logo: "/images/partners/veeam.png",
    category: "Backup, replication & disaster recovery",
    url: "https://www.veeam.com",
  },
  {
    name: "Quantum",
    logo: "/images/partners/quantum.png",
    category: "Storage",
    url: "https://www.quantum.com",
  },
  // Software & cloud
  {
    name: "Microsoft",
    logo: "/images/partners/microsoft.png",
    category: "Windows, Server, SQL & Microsoft 365",
    url: "https://www.microsoft.com",
  },
  {
    name: "Microsoft Azure",
    logo: "/images/partners/azure.png",
    category: "Cloud platform",
    url: "https://azure.microsoft.com",
  },
  {
    name: "Google Cloud",
    logo: "/images/partners/google-cloud.png",
    category: "Cloud platform",
    url: "https://cloud.google.com",
  },
  {
    name: "Red Hat",
    logo: "/images/partners/redhat.png",
    category: "Enterprise Linux & container orchestration",
    url: "https://www.redhat.com",
  },
  // Unified communications
  {
    name: "Mitel",
    logo: "/images/partners/mitel.png",
    category: "Unified communications",
    url: "https://www.mitel.com",
  },
  {
    name: "Avaya",
    logo: "/images/partners/avaya.png",
    category: "Unified communications",
    url: "https://www.avaya.com",
  },
  {
    name: "3CX",
    logo: "/images/partners/3cx.png",
    category: "IP telephony",
    url: "https://www.3cx.com",
  },
  // Physical security
  {
    name: "Hikvision",
    logo: "/images/partners/hikvision.png",
    category: "Video surveillance",
    url: "https://www.hikvision.com",
  },
  {
    name: "Dahua Technology",
    logo: "/images/partners/dahua.png",
    category: "Video surveillance",
    url: "https://www.dahuasecurity.com",
  },
  {
    name: "ZKTeco",
    logo: "/images/partners/zkteco.png",
    category: "Access control & biometrics",
    url: "https://www.zkteco.com",
  },
];

export { customers, type Customer } from "./customers";
export { customers as internalPartners } from "./customers";
