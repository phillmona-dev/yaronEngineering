export type Industry = {
  slug: string;
  title: string;
  summary: string;
  description: string;
  image: { src: string; alt: string };
};

export const industries: Industry[] = [
  {
    slug: "government",
    title: "Government",
    summary: "Secure, sovereign infrastructure for public institutions and national programmes.",
    description:
      "Public institutions need infrastructure that is secure, auditable and built to serve citizens at scale. We support government bodies with network, data center, security and consultancy services aligned to national ICT initiatives.",
    image: {
      src: "/images/photos/parliament.jpg",
      alt: "Interior of a parliamentary assembly chamber",
    },
  },
  {
    slug: "banking",
    title: "Banking & Financial Services",
    summary: "Always-on platforms for institutions where downtime is measured in trust.",
    description:
      "Banks depend on resilient data centers, segmented networks and layered security. We deliver infrastructure and advisory for core banking programmes, branch connectivity and security operations.",
    image: {
      src: "/images/photos/financial-district.jpg",
      alt: "Glass towers in a financial district",
    },
  },
  {
    slug: "insurance",
    title: "Insurance",
    summary: "Infrastructure and advisory for core insurance platforms and secure operations.",
    description:
      "Insurers modernizing core platforms need independent advice and secure infrastructure to run them. We provide consultancy, security and data center capabilities tailored to insurance operations.",
    image: {
      src: "/images/photos/towers-glass.jpg",
      alt: "Low-angle view of modern glass office towers",
    },
  },
  {
    slug: "healthcare",
    title: "Healthcare",
    summary: "Reliable networks and protected data for institutions where availability matters.",
    description:
      "Healthcare organizations run clinical and administrative systems that cannot pause. We design networks, security and compute platforms that keep them available and protected.",
    image: { src: "/images/photos/hospital.jpg", alt: "Hospital reception area" },
  },
  {
    slug: "ngo",
    title: "NGOs & Development",
    summary: "Scalable, cost-aware technology for mission-driven organizations.",
    description:
      "Non-governmental and development organizations need dependable infrastructure, secure collaboration and cloud platforms that respect budget and compliance obligations.",
    image: {
      src: "/images/photos/ngo.jpg",
      alt: "Volunteers handling supplies at a distribution site",
    },
  },
  {
    slug: "enterprise",
    title: "Enterprise",
    summary: "End-to-end infrastructure for organizations scaling their digital operations.",
    description:
      "From shipping and logistics to manufacturing and services, enterprises rely on us for network, data center, compute, cloud and security delivered as one coherent programme.",
    image: { src: "/images/photos/open-office.jpg", alt: "Open-plan enterprise office" },
  },
  {
    slug: "education",
    title: "Education",
    summary: "Campus networks and security systems for universities and institutions.",
    description:
      "Universities and institutions need campus-wide connectivity, video surveillance and secure platforms for learning and research. We design and supervise them end to end.",
    image: { src: "/images/photos/university.jpg", alt: "University campus building" },
  },
  {
    slug: "critical-infrastructure",
    title: "Critical Infrastructure",
    summary: "Hardened, monitored systems for utilities, transport and essential services.",
    description:
      "Operators of essential services need infrastructure engineered for resilience and defended in depth. We bring data center, network and security expertise to critical environments.",
    image: { src: "/images/photos/powerlines.jpg", alt: "High-voltage transmission lines at dusk" },
  },
];
