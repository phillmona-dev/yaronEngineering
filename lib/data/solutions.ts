export type ProcessStep = {
  index: string;
  title: string;
  statement: string;
  detail: string;
  points: string[];
};

export const processSteps: ProcessStep[] = [
  {
    index: "01",
    title: "Discover",
    statement: "Understand the mission before the technology.",
    detail:
      "We begin with the organization's objectives, operating constraints, regulatory obligations and risk posture. The output is a clear definition of what the infrastructure must achieve.",
    points: ["Objectives & constraints", "Regulatory requirements", "Current-state assessment"],
  },
  {
    index: "02",
    title: "Architect",
    statement: "Design for performance, security and growth at once.",
    detail:
      "Reference architectures are tailored to performance requirements, security requirements and scalability. Every design decision is documented and vendor-neutral.",
    points: ["Target architecture", "Capacity & resilience planning", "Security by design"],
  },
  {
    index: "03",
    title: "Integrate",
    statement: "Deliver as one system, not a set of products.",
    detail:
      "Our engineers implement network, data center, compute, cloud and security components as an integrated whole — tested, documented and handed over with the knowledge to run it.",
    points: ["Implementation & commissioning", "Testing & documentation", "Knowledge transfer"],
  },
  {
    index: "04",
    title: "Secure",
    statement: "Protect every layer and prove it.",
    detail:
      "Controls are layered across perimeter, endpoint, identity and data, with monitoring that turns events into decisions and compliance that can be evidenced.",
    points: ["Layered controls", "Detection & response", "Compliance evidence"],
  },
  {
    index: "05",
    title: "Operate",
    statement: "Keep it running with measurable reliability.",
    detail:
      "Operational readiness, monitoring and support models are defined so the organization — or our team alongside it — can operate the platform with confidence.",
    points: ["Monitoring & visibility", "Support models", "Business continuity"],
  },
  {
    index: "06",
    title: "Scale",
    statement: "Grow without re-engineering.",
    detail:
      "Because capacity, segmentation and governance were designed in, expansion is incremental — new sites, new workloads and new services land on a foundation built for them.",
    points: ["Incremental expansion", "New services & sites", "Continuous improvement"],
  },
];

export const tailoringPillars = [
  {
    title: "Organizational objectives",
    text: "Technology mapped to the outcomes leadership is accountable for.",
  },
  {
    title: "Performance requirements",
    text: "Capacity, latency and throughput engineered to defined targets.",
  },
  {
    title: "Regulatory requirements",
    text: "Controls aligned to the frameworks the organization must evidence.",
  },
  {
    title: "Security requirements",
    text: "Threat models and defense in depth from the first design review.",
  },
  { title: "Scalability", text: "Architectures that expand incrementally without redesign." },
  {
    title: "Business continuity",
    text: "Backup, recovery and resilience treated as core requirements.",
  },
] as const;
