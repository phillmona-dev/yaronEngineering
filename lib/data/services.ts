import type { LucideIcon } from "lucide-react";
import { Network, Server, Briefcase, ShieldCheck, Cloud, HardDrive, Cctv } from "lucide-react";

export type Service = {
  slug: string;
  index: string;
  title: string;
  shortTitle: string;
  summary: string;
  description: string[];
  capabilities: string[];
  outcomes: string[];
  image: { src: string; alt: string };
  icon: LucideIcon;
  theme: string;
};

export const services: Service[] = [
  {
    slug: "ict-infrastructure",
    index: "01",
    title: "ICT Infrastructure Systems",
    shortTitle: "ICT Infrastructure",
    summary:
      "Enterprise LAN/WAN, SD-WAN, Wi-Fi, data center networking and structured cabling engineered as a single, resilient fabric.",
    description: [
      "Every digital service an organization runs depends on the quality of its network. We design and build enterprise network infrastructure that is deterministic, segmented and ready for the next decade of growth.",
      "From campus LAN, LAN SDN and SD-WAN to Wi-Fi 6/6E and Wi-Fi 7, network segmentation and cloud-managed infrastructure, our engineers deliver networks that are documented, testable and supportable.",
      "In the data center we build ultra-resilient, high-speed fabrics using software-defined networking, EVPN-VXLAN architecture and AI-driven automation — and we integrate video and IP telephone communication systems on the same foundation.",
    ],
    capabilities: [
      "LAN / WAN & SD-WAN",
      "Wi-Fi 6/6E & Wi-Fi 7",
      "Structured cabling",
      "Data center networking (SDN, EVPN-VXLAN)",
      "Video & IP telephony",
      "Cloud-managed networks",
    ],
    outcomes: [
      "Predictable performance under peak load",
      "Segmented, policy-driven architecture",
      "Certified cabling with full documentation",
    ],
    image: {
      src: "/images/photos/network-patch.jpg",
      alt: "Patch panel with structured network cabling",
    },
    icon: Network,
    theme: "Network infrastructure",
  },
  {
    slug: "data-center",
    index: "02",
    title: "Data Center Facility Design & Implementation",
    shortTitle: "Data Center",
    summary:
      "Power, cooling, rack systems and monitoring designed for continuous, measurable availability.",
    description: [
      "A data center is a physical system first. We design the facility layer — power distribution, precision cooling, rack and containment systems and environmental monitoring — so the compute layer never has to compensate for it.",
      "Our approach covers concept design, construction, modernization, implementation supervision and commissioning — from edge and modular data centers to main and disaster-recovery sites — giving organizations a facility they can audit, operate and expand with confidence.",
    ],
    capabilities: [
      "Power systems",
      "Precision cooling",
      "Rack & aisle containment",
      "Edge & modular data centers",
      "Fire detection & suppression",
      "Monitoring & DCIM",
      "Sustainable energy",
    ],
    outcomes: [
      "Facility designed to defined availability targets",
      "Capacity headroom for growth",
      "Real-time environmental visibility",
    ],
    image: {
      src: "/images/photos/hero-datacenter.jpg",
      alt: "Data center corridor with illuminated server racks",
    },
    icon: Server,
    theme: "Data center facility",
  },
  {
    slug: "ict-consultancy",
    index: "03",
    title: "ICT Consultancy",
    shortTitle: "ICT Consultancy",
    summary:
      "Independent advisory for core banking, core insurance and ERP programmes — from strategy to supervision.",
    description: [
      "Large technology programmes fail in the gaps between business objectives, vendors and infrastructure. We work on the client's side of the table to close those gaps.",
      "Our consultants support requirements definition, architecture, procurement, implementation supervision and governance for core banking, core insurance and ERP platforms, as well as national-scale ICT infrastructure initiatives.",
    ],
    capabilities: [
      "Core banking",
      "Core insurance",
      "ERP solutions",
      "Design & supervision",
      "ISMS, IT governance & ITSM",
    ],
    outcomes: [
      "Vendor-neutral architecture decisions",
      "Procurement aligned to real requirements",
      "Governance from design to go-live",
    ],
    image: {
      src: "/images/photos/boardroom.jpg",
      alt: "Modern executive boardroom with glass walls",
    },
    icon: Briefcase,
    theme: "Enterprise advisory",
  },
  {
    slug: "cybersecurity",
    index: "04",
    title: "Cybersecurity Solutions",
    shortTitle: "Cybersecurity",
    summary:
      "Firewalls, endpoint protection, SIEM and compliance services that turn security into an operating discipline.",
    description: [
      "Security is not a product; it is an architecture and a practice. We design layered defenses that protect the perimeter, the endpoint and the identity — and give security teams the visibility to act.",
      "Our cybersecurity practice covers next-generation firewalls, endpoint protection, SIEM, Zero Trust frameworks, XDR, AI-powered threat hunting and SOC integration for enterprise resilience.",
      "Information security and IT governance strategies are aligned with ISO 27001, NIST, CIS Controls and digital risk governance frameworks — combined with audit readiness and compliance automation.",
    ],
    capabilities: [
      "Next-generation firewalls",
      "Endpoint protection",
      "SIEM & SOC integration",
      "Zero Trust & XDR",
      "ISO 27001 / NIST / CIS governance",
      "Compliance services",
    ],
    outcomes: [
      "Layered defense across network, endpoint and identity",
      "Centralized detection and response",
      "Controls mapped to compliance obligations",
    ],
    image: {
      src: "/images/photos/network-red.jpg",
      alt: "Dense red patch cabling in a network rack",
    },
    icon: ShieldCheck,
    theme: "Security operations",
  },
  {
    slug: "cloud-services",
    index: "05",
    title: "Cloud Services",
    shortTitle: "Cloud",
    summary:
      "Microsoft 365, Azure, hybrid and multi-cloud, backup and disaster recovery designed for secure, continuous operation.",
    description: [
      "Cloud adoption succeeds when identity, data protection and connectivity are designed together. We help organizations move to Microsoft 365 and Azure with a security-first architecture and a clear operating model.",
      "We design SaaS, PaaS and IaaS adoption across hybrid and multi-cloud architectures and provide managed services to run them. Backup and disaster recovery are engineered as part of the same design, so business continuity is a tested capability rather than an assumption.",
    ],
    capabilities: [
      "Microsoft 365",
      "Microsoft Azure",
      "Hybrid & multi-cloud",
      "Managed services",
      "Backup & disaster recovery",
    ],
    outcomes: [
      "Secure identity-centric cloud foundation",
      "Tested recovery objectives",
      "Modern collaboration at enterprise scale",
    ],
    image: { src: "/images/photos/cloud-nodes.jpg", alt: "Abstract network of connected nodes" },
    icon: Cloud,
    theme: "Cloud infrastructure",
  },
  {
    slug: "servers-storage",
    index: "06",
    title: "Enterprise Servers & Storage Systems",
    shortTitle: "Servers & Storage",
    summary:
      "Compute, virtualization, hyper-converged infrastructure and backup platforms sized for real workloads.",
    description: [
      "The compute and storage layer must match the applications it serves — not the other way round. We size, design and implement server, storage and hyper-converged platforms around workload profiles, growth and recovery requirements.",
      "Virtualization, backup and data protection are designed in from the start so platforms are efficient to run and simple to recover. For demanding workloads we deliver HPC clusters, NVMe storage, GPU-accelerated computing and scalable parallel file systems.",
    ],
    capabilities: [
      "Compute",
      "Virtualization",
      "Hyper-converged infrastructure",
      "HPC & GPU computing",
      "NVMe & parallel storage",
      "Backup solutions",
    ],
    outcomes: [
      "Right-sized platforms with growth headroom",
      "Consolidated, efficient operations",
      "Recoverable by design",
    ],
    image: {
      src: "/images/photos/storage-disk.jpg",
      alt: "Open hard-disk drive platter and actuator",
    },
    icon: HardDrive,
    theme: "Compute & storage",
  },
  {
    slug: "physical-security",
    index: "07",
    title: "Physical & Electronic Security Systems",
    shortTitle: "Physical Security",
    summary:
      "CCTV surveillance, access control and alarm systems integrated with the IP network they run on.",
    description: [
      "Physical security systems are network systems. We design IP video surveillance, access control and alarm platforms as part of the enterprise infrastructure — with the bandwidth, storage and segmentation they need.",
      "Smart capabilities — AI-powered video analytics, facial recognition, license plate recognition (LPR), biometric access control and centralized command systems — turn the estate into one that is centrally managed, reliably recorded and defensible.",
    ],
    capabilities: [
      "IP video surveillance",
      "AI video analytics & LPR",
      "Biometric access control",
      "Alarm & fire systems",
      "Video walls & command centers",
    ],
    outcomes: [
      "Centrally managed security estate",
      "Reliable retention and retrieval",
      "Integrated with network and identity",
    ],
    image: {
      src: "/images/photos/cctv-wall.jpg",
      alt: "Grid of surveillance cameras mounted on a wall",
    },
    icon: Cctv,
    theme: "Physical security",
  },
];

export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}
