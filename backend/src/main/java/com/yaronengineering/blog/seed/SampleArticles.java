package com.yaronengineering.blog.seed;

import java.util.List;

/** Sample bodies for development. Generic, vendor-neutral engineering guidance with no company claims. */
final class SampleArticles {
    private SampleArticles() {}

    static List<SampleContentSeeder.Sample> all() {
        return List.of(
            new SampleContentSeeder.Sample(
                "Building Resilient Enterprise Network Infrastructure",
                "building-resilient-enterprise-network-infrastructure",
                "Resilience is designed, not added. A practical walk through the decisions that make enterprise networks survive failure gracefully.",
                "networking", "Network Design", "network-design",
                "/images/photos/network-patch.jpg", "Patch panel with structured network cabling",
                """
                <p>An enterprise network is judged on its worst day, not its best. The architecture decisions made early — topology, segmentation, redundancy and documentation — determine whether a failed switch is a non-event or an outage that reaches the executive floor. This article sets out the engineering principles we apply when designing networks expected to run for a decade.</p>
                <h2>Start with the failure domains</h2>
                <p>Every design should begin by asking what fails together. A single core switch, a single uplink, a single power feed and a single fibre path are all failure domains that take everything downstream with them. Resilient designs reduce the blast radius of each component so that a failure degrades capacity rather than removing service.</p>
                <h3>Core, distribution and access</h3>
                <p>The classic three-tier model still earns its place in campus environments because it makes failure domains explicit. The core is small, fast and redundant; distribution aggregates policy; access is where users connect. In smaller sites a collapsed core is appropriate, but the redundancy obligations do not disappear — they move into the chassis, the supervisors and the power supplies.</p>
                <h3>Dual everything that matters</h3>
                <ul>
                  <li>Two physically diverse uplinks per access stack, terminating on different distribution devices.</li>
                  <li>Dual power supplies fed from separate circuits where the facility allows it.</li>
                  <li>Two independent paths for any inter-building fibre, routed through different ducts.</li>
                  <li>Redundant default gateways using a first-hop redundancy protocol.</li>
                </ul>
                <h2>Segment by policy, not by convenience</h2>
                <p>Flat networks are easy to build and expensive to secure. Segmentation should follow the organization's trust boundaries: user access, servers, management, guest, voice, building systems and security cameras each belong in their own zone with explicit policy between them. Segmentation also limits the spread of misconfiguration and malware, which is a resilience benefit as much as a security one.</p>
                <blockquote>A network you cannot describe on a whiteboard in five minutes is a network you cannot troubleshoot at two in the morning.</blockquote>
                <h3>Management plane isolation</h3>
                <p>Device management should live on a dedicated out-of-band network wherever possible. When the production network is impaired, the management plane is what lets engineers diagnose and recover without physically visiting every closet.</p>
                <h2>Structured cabling is infrastructure, not an afterthought</h2>
                <p>The best switching design is undermined by uncertified cabling. Structured cabling should be installed to a recognized standard, tested link by link, labelled consistently at both ends and documented in a register that is maintained after handover. Fibre backbones should be sized for growth; pulling a second run later costs far more than extra cores today.</p>
                <div class="callout" data-type="info"><p>Insist on test results for every permanent link before accepting a cabling installation. Certification is the only objective evidence that the physical layer meets specification.</p></div>
                <h2>Operate for resilience</h2>
                <p>Design is half the work. Monitoring that reports link utilization, error counters and device health, configuration backups taken automatically, change control that forces peer review and a tested recovery procedure for the core are what keep a well-designed network resilient over time. Capacity reviews every six months catch the slow creep that eventually becomes an incident.</p>
                <p>None of this is exotic. Resilience is the disciplined application of well-understood practice — and the willingness to spend a little more on the second path before it is needed.</p>
                """),
            new SampleContentSeeder.Sample(
                "Why Cybersecurity Must Be Designed Into Infrastructure",
                "why-cybersecurity-must-be-designed-into-infrastructure",
                "Security bolted on after deployment is expensive and fragile. Here is what changes when it is treated as an architectural requirement from day one.",
                "cybersecurity", "Security Architecture", "security-architecture",
                "/images/photos/soc-analyst.jpg", "Security analyst working across multiple monitors",
                """
                <p>Most security incidents are not failures of technology. They are failures of architecture: a flat network that let a compromised workstation reach a database, an identity model that granted standing administrative rights, a backup that shared credentials with the systems it protected. These are design decisions, and they are made — deliberately or by omission — long before the first firewall rule is written.</p>
                <h2>What "security by design" actually means</h2>
                <p>Security by design is the practice of treating threat models, segmentation and compliance obligations as inputs to architecture rather than checks applied afterwards. In practical terms it means the security team reviews the network diagram, the identity design and the data flows before procurement, not after go-live.</p>
                <h3>Threat modelling as a design activity</h3>
                <p>A threat model does not need to be elaborate. For each system, ask what an attacker would want, how they would reach it and what would stop them. The answers shape the design: which zones exist, where enforcement points sit, what must be logged and which privileges should be temporary.</p>
                <h2>The layers that matter</h2>
                <table>
                  <thead><tr><th>Layer</th><th>Primary control</th><th>Common gap</th></tr></thead>
                  <tbody>
                    <tr><td>Perimeter</td><td>Next-generation firewall with inspection</td><td>Rules that are never reviewed</td></tr>
                    <tr><td>Network</td><td>Segmentation and east-west policy</td><td>Flat server VLANs</td></tr>
                    <tr><td>Endpoint</td><td>Detection and response agents</td><td>Unmanaged devices</td></tr>
                    <tr><td>Identity</td><td>MFA and least privilege</td><td>Shared administrative accounts</td></tr>
                    <tr><td>Data</td><td>Encryption and tested backups</td><td>Backups reachable from production</td></tr>
                  </tbody>
                </table>
                <h3>Identity is the new perimeter</h3>
                <p>With cloud services and remote work, the identity provider is the control plane for the organization. Multi-factor authentication for every account, conditional access based on device health and location, and privileged access that is granted just in time are the highest-value controls most organizations can deploy.</p>
                <h2>Visibility turns controls into operations</h2>
                <p>Controls that nobody watches degrade silently. A security information and event management platform is only useful when it receives the right logs, when alerts are tuned to the environment and when someone is accountable for acting on them. Detection should be designed with the same care as prevention.</p>
                <blockquote>You cannot defend what you cannot see, and you cannot prove compliance for what you did not log.</blockquote>
                <h2>Compliance as evidence, not paperwork</h2>
                <p>Regulatory frameworks ask organizations to demonstrate that controls exist and operate. When security is designed in, evidence is a by-product: configuration baselines, access reviews and log retention already exist because the architecture demanded them. Retrofitting that evidence is where most compliance programmes stall.</p>
                <div class="callout" data-type="warning"><p>Backup infrastructure must never share credentials or network reachability with the systems it protects. Ransomware operators target backups first.</p></div>
                <p>Designing security in is cheaper, more effective and easier to operate than adding it later. The hard part is organizational: making sure the security conversation happens at the architecture stage, every time.</p>
                """),
            new SampleContentSeeder.Sample(
                "Designing Reliable Data Center Infrastructure",
                "designing-reliable-data-center-infrastructure",
                "Power, cooling, racks and monitoring are the physical foundation of every digital service. A guide to the decisions that define availability.",
                "data-centers", "Facility Design", "facility-design",
                "/images/photos/dc-corridor.jpg", "Data center corridor with illuminated server racks",
                """
                <p>Compute platforms are only as reliable as the room they sit in. A data center facility is an engineered system of power, cooling, containment and monitoring, and its availability target should be decided before a single rack is ordered. This guide covers the questions that shape a facility design.</p>
                <h2>Define the availability target first</h2>
                <p>Availability targets drive cost. A facility designed to tolerate a single component failure during maintenance needs redundant power paths, redundant cooling and the physical space to separate them. One designed for planned downtime can be simpler. The target should be a business decision, informed by what the organization loses per hour of outage, and then engineered to — not assumed.</p>
                <h2>Power: the chain is only as strong as its weakest breaker</h2>
                <h3>Utility, generator and UPS</h3>
                <p>A reliable power chain has three layers: utility supply, uninterruptible power supply to ride through transfers, and standby generation sized for the full critical load with cooling included. Transfer switches, distribution boards and rack power distribution units must be sized with growth headroom and tested under load during commissioning.</p>
                <h3>Dual-corded equipment, dual paths</h3>
                <p>Servers and switches with two power supplies only deliver redundancy when each supply is fed from an independent path. Rack layouts should make the A and B feeds obvious, and load should be balanced so that either path can carry the full rack alone.</p>
                <h2>Cooling: manage the air, not just the temperature</h2>
                <ul>
                  <li>Arrange racks in hot and cold aisles and contain one of them to stop mixing.</li>
                  <li>Blank unused rack units so air moves through equipment, not around it.</li>
                  <li>Size cooling for the design load with N+1 redundancy, and verify it with measured intake temperatures.</li>
                  <li>Plan for high-density racks separately; they change the airflow of the whole room.</li>
                </ul>
                <h2>Racks, cabling and containment</h2>
                <p>Rack selection influences everything that follows: depth for modern servers, cable management for high-density patching, and door perforation for airflow. Structured cabling should route overhead or underfloor with clear separation between power and data, and every rack should be labelled in a scheme that survives staff changes.</p>
                <blockquote>Commissioning is the moment the facility proves it can do what the drawings claim. Skipping it is the most expensive saving available.</blockquote>
                <h2>Monitoring: know before the users do</h2>
                <p>Environmental monitoring — temperature at rack intakes, humidity, power per circuit, leak detection and door status — turns the facility from a black box into an operated system. Alerts should reach people who can act, and trends should be reviewed monthly to catch capacity and cooling drift early.</p>
                <div class="callout" data-type="info"><p>Record the as-built state at handover: single-line diagrams, rack elevations, circuit schedules and set points. These documents are the facility's memory.</p></div>
                <p>A data center that meets its availability target is the product of clear requirements, redundant design, disciplined commissioning and attentive operation. Each step is unglamorous; together they are the difference between a facility and a liability.</p>
                """),
            new SampleContentSeeder.Sample(
                "Cloud Adoption and Business Continuity",
                "cloud-adoption-and-business-continuity",
                "Moving to the cloud does not outsource resilience. How to design identity, data protection and recovery so continuity is a tested capability.",
                "cloud", "Business Continuity", "business-continuity-planning",
                "/images/photos/cloud-nodes.jpg", "Abstract network of connected nodes",
                """
                <p>Cloud platforms offer resilience that few organizations could build themselves, but they offer it as raw material. Availability zones, geo-redundant storage and managed backup only protect the business when someone has designed, configured and tested them against the organization's own recovery objectives. This article explains how to approach cloud adoption with continuity as a first-class requirement.</p>
                <h2>Define recovery objectives before migrating</h2>
                <p>Two numbers anchor every continuity design: the recovery time objective — how long a service may be unavailable — and the recovery point objective — how much data may be lost. They should be set per service by the people who depend on it, because they determine architecture and cost. A mail platform and a core transaction system rarely share the same numbers.</p>
                <h2>Identity is the foundation</h2>
                <p>In cloud environments the identity provider is both the front door and the recovery path. If administrators cannot authenticate, nothing else can be restored. Protect it accordingly: enforce multi-factor authentication, keep emergency access accounts with credentials stored offline, and document the break-glass procedure.</p>
                <h3>Least privilege for the control plane</h3>
                <p>Cloud control planes are powerful. Role assignments should be scoped to the smallest resource group that makes sense, privileged roles should be activated just in time, and every elevation should be logged and reviewed.</p>
                <h2>Data protection is not automatic</h2>
                <ul>
                  <li>Productivity suites retain deleted items for limited windows; a dedicated backup is still required for long-term recovery.</li>
                  <li>Virtual machines and databases need backup policies with retention aligned to recovery point objectives.</li>
                  <li>Backups should be stored in a separate subscription or tenant with independent credentials.</li>
                  <li>Immutable or soft-delete protected storage defends backups against deliberate deletion.</li>
                </ul>
                <blockquote>A backup that has never been restored is a hypothesis. Recovery tests are how it becomes a fact.</blockquote>
                <h2>Design for regional failure</h2>
                <p>Zone redundancy protects against hardware and facility failures within a region. Protecting against the loss of a whole region requires replication to a second region and a rehearsed failover plan that includes DNS, identity, networking and the people who will execute it. Not every workload justifies this cost; the recovery objectives decide.</p>
                <h2>Connectivity and the hybrid period</h2>
                <p>Most organizations run hybrid for years. During that period, the link between on-premises infrastructure and the cloud is itself a continuity risk. Redundant connections, clearly documented routing and a tested plan for operating with the link down are part of the design.</p>
                <div class="callout" data-type="success"><p>Schedule a recovery exercise within the first quarter after migration. The lessons learned while the design is fresh are the cheapest you will ever get.</p></div>
                <p>Cloud adoption done well raises the resilience ceiling of an organization. Done without a continuity design, it simply moves the single points of failure somewhere less visible.</p>
                """),
            new SampleContentSeeder.Sample(
                "Modernizing Enterprise ICT Infrastructure",
                "modernizing-enterprise-ict-infrastructure",
                "Modernization programmes succeed when they are sequenced around dependencies, risk and the people who will operate the result. A practical roadmap.",
                "digital-transformation", "Modernization", "modernization",
                "/images/photos/rack-mono.jpg", "Server rack with structured cabling, monochrome",
                """
                <p>Every organization eventually faces the same question: the infrastructure that was adequate five years ago is now the constraint on what the business wants to do next. Modernization is the answer, but modernization programmes fail more often from poor sequencing than from poor technology. This article offers a roadmap built around dependencies and risk.</p>
                <h2>Assess before you architect</h2>
                <p>A modernization programme should begin with an honest current-state assessment: an inventory of systems and their owners, the network and facility that carry them, the support contracts that cover them and the risks each one represents. The assessment reveals the dependencies that dictate order — nobody should migrate applications onto a network that cannot carry them.</p>
                <h3>Classify by risk and value</h3>
                <p>Not everything needs modernizing at once. Classify systems by business criticality, technical risk and the value of change. End-of-support platforms carrying critical services go first; stable systems with low value from change can wait, sometimes indefinitely.</p>
                <h2>A dependency-driven sequence</h2>
                <ol>
                  <li><strong>Foundation:</strong> structured cabling, core network, power and cooling. Everything else depends on these.</li>
                  <li><strong>Identity and security:</strong> a modern identity platform, multi-factor authentication and segmentation define the trust model later phases rely on.</li>
                  <li><strong>Compute and storage:</strong> consolidate onto a platform sized for the workloads that will remain on-premises.</li>
                  <li><strong>Cloud and collaboration:</strong> move the services that benefit most — mail, collaboration, backup — once identity is ready.</li>
                  <li><strong>Applications:</strong> core business systems last, on infrastructure that is now proven.</li>
                </ol>
                <h2>Govern the programme, not just the projects</h2>
                <p>Modernization touches every part of the organization. A steering group with authority over priorities, a single architecture owner and a change process that is fast enough to keep pace are the governance minimum. Without them, individual projects optimize locally and the programme loses coherence.</p>
                <blockquote>The goal is not new equipment. The goal is an organization that can change again next year without starting over.</blockquote>
                <h2>Design for the people who will run it</h2>
                <p>New platforms fail when the team that inherits them was not part of the design. Involve operations staff early, invest in training before go-live, and insist on documentation and runbooks as deliverables rather than afterthoughts. The handover is where modernization becomes sustainable or begins to decay.</p>
                <h3>Measure what changed</h3>
                <p>Agree metrics at the start — availability, incident volume, time to provision, support cost — and report them through the programme. They justify the investment and show where the next round of improvement should focus.</p>
                <div class="callout" data-type="note"><p>Keep a decision log. Six months in, the reasons behind an architectural choice are easy to forget and expensive to rediscover.</p></div>
                <p>Modernization is less about replacing technology than about re-establishing the foundations an organization can build on. Sequenced well and governed properly, it becomes a capability rather than a one-time project.</p>
                """)
        );
    }
}
