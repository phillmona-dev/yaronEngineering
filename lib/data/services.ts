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
      "Enterprise LAN/WAN, Wi-Fi and structured cabling engineered as a single, resilient fabric.",
    description: [
      "Every digital service an organization runs depends on the quality of its network. We design and build enterprise network infrastructure that is deterministic, segmented and ready for the next decade of growth.",
      "From campus LAN and wide-area connectivity to high-density Wi-Fi and certified structured cabling, our engineers deliver infrastructure that is documented, testable and supportable.",
    ],
    capabilities: ["LAN / WAN", "Enterprise Wi-Fi", "Structured cabling", "Enterprise networks"],
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
      "Our approach covers concept design, capacity planning, implementation supervision and commissioning, giving organizations a facility they can audit, operate and expand with confidence.",
    ],
    capabilities: ["Power systems", "Cooling", "Rack & containment", "Monitoring"],
    outcomes: [
      "Facility designed to defined availability targets",
      "Capacity headroom for growth",
      "Real-time environmental visibility",
    ],
    image: {
      src: "/images/photos/dc-corridor.jpg",
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
    capabilities: ["Core banking", "Core insurance", "ERP solutions", "Programme supervision"],
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
      "Our cybersecurity practice covers next-generation firewalls, endpoint detection and response, SIEM deployment and tuning, and compliance services that map controls to the regulatory frameworks organizations answer to.",
    ],
    capabilities: [
      "Next-generation firewalls",
      "Endpoint protection",
      "SIEM",
      "Compliance services",
    ],
    outcomes: [
      "Layered defense across network, endpoint and identity",
      "Centralized detection and response",
      "Controls mapped to compliance obligations",
    ],
    image: {
      src: "/images/photos/soc-analyst.jpg",
      alt: "Security analyst working across multiple monitors in a dark operations room",
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
      "Microsoft 365, Azure, backup and disaster recovery designed for secure, continuous operation.",
    description: [
      "Cloud adoption succeeds when identity, data protection and connectivity are designed together. We help organizations move to Microsoft 365 and Azure with a security-first architecture and a clear operating model.",
      "Backup and disaster recovery are engineered as part of the same design, so business continuity is a tested capability rather than an assumption.",
    ],
    capabilities: ["Microsoft 365", "Microsoft Azure", "Backup", "Disaster recovery"],
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
      "Virtualization, backup and data protection are designed in from the start so platforms are efficient to run and simple to recover.",
    ],
    capabilities: [
      "Compute",
      "Virtualization",
      "Hyper-converged infrastructure",
      "Backup solutions",
    ],
    outcomes: [
      "Right-sized platforms with growth headroom",
      "Consolidated, efficient operations",
      "Recoverable by design",
    ],
    image: {
      src: "/images/photos/server-hands.jpg",
      alt: "Engineer installing components into a server chassis",
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
      "The result is a security estate that is centrally managed, reliably recorded and defensible.",
    ],
    capabilities: ["IP video surveillance", "Access control", "Alarm systems", "Integration"],
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
