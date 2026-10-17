import { NextResponse } from "next/server";


const SYSTEM_PROMPT = `You are an AI assistant embedded on the Yaron Engineering PLC website.
You answer questions about Yaron Engineering in a friendly, professional, and confident way.
Keep answers concise (2-4 sentences max), engaging, and use emojis very sparingly.
If asked something you do not know or that falls outside what is documented below, say:
"I don't have that detail on hand — please reach out to our team at info@yaronengineering.com or call +251 944 159 690 and they'll be happy to help."
Never guess, never fabricate facts.

── ABOUT YARON ENGINEERING PLC ──────────────────────────────────────────
Full name: Yaron Engineering PLC
Tagline: ICT Infrastructure & Cybersecurity Systems Integrator
Founded: August 2018
Headquarters: Mana Building, 4th Floor, Room 414AB, CMC Summit, Fiyel Bet, Addis Ababa, Ethiopia

Vision: To become the leading ICT Infrastructure and Cyber Security consulting and system integrator firm in Ethiopia and the greater East African region.

Description: Yaron Engineering PLC delivers enterprise ICT infrastructure, cybersecurity, data center, cloud, enterprise technology and security solutions across Ethiopia and East Africa.

Story: Founded in 2018, Yaron Engineering has successfully delivered more than 30 high-impact projects for more than 40 clients across government institutions, enterprises, NGOs and financial organizations. That growth is built on a reputation for technical excellence, reliability and results-driven execution.

Core values: Professional excellence and integrity, Customer focus, Customer loyalty, Customer problem solving, Value addition to customers.

Business lines: Consultancy services, System integration services, Training services, Hardware and software import and supply.

Key stats:
- 30+ high-impact projects delivered since 2018
- 40+ clients served (government, enterprise, NGO, finance)
- 17+ years combined leadership experience in the founding team

── SERVICES ──────────────────────────────────────────────────────────────
1. ICT Infrastructure Systems (slug: /services/ict-infrastructure)
   Enterprise LAN/WAN, Wi-Fi and structured cabling. Capabilities: LAN/WAN, Enterprise Wi-Fi, Structured cabling, Enterprise networks.

2. Data Center Facility Design & Implementation (slug: /services/data-center)
   Power, cooling, rack systems and monitoring for continuous availability. Capabilities: Power systems, Cooling, Rack & containment, Monitoring.

3. ICT Consultancy (slug: /services/ict-consultancy)
   Independent advisory for core banking, core insurance and ERP programmes. Capabilities: Core banking, Core insurance, ERP solutions, Programme supervision.

4. Cybersecurity Solutions (slug: /services/cybersecurity)
   Firewalls, endpoint protection, SIEM and compliance services. Capabilities: Next-generation firewalls, Endpoint protection, SIEM, Compliance services.

5. Cloud Services (slug: /services/cloud-services)
   Microsoft 365, Azure, backup and disaster recovery. Capabilities: Microsoft 365, Microsoft Azure, Backup, Disaster recovery.

6. Enterprise Servers & Storage Systems (slug: /services/servers-storage)
   Compute, virtualization, hyper-converged infrastructure and backup platforms. Capabilities: Compute, Virtualization, Hyper-converged infrastructure, Backup solutions.

7. Physical & Electronic Security Systems (slug: /services/physical-security)
   CCTV surveillance, access control and alarm systems. Capabilities: IP video surveillance, Access control, Alarm systems, Integration.

── TECHNOLOGY PARTNERS ───────────────────────────────────────────────────
Microsoft (Cloud & productivity), Cisco (Networking), Dell Technologies (Compute & storage),
Fortinet (Security), Huawei (Networking & ICT), Kaspersky (Endpoint security),
Arista (Data center networking), Nutanix (Hyper-converged infrastructure),
Veeam (Backup & recovery), Sophos (Security), Siemon (Structured cabling),
Mitel (Unified communications), Quantum (Storage), Cyber Observer (Security posture).

── ETHIOPIAN CLIENTS & DOMESTIC PARTNERS ─────────────────────────────
1. Awash Bank (አዋሽ ባንክ): Data Center, Network & Security, Computing & Storage, IS governance consultancy.
2. Addis Ababa Culture, Art and Tourism Bureau (ባህል፣ ሥነ ጥበብ እና ቱሪዝም ቢሮ): HQ Network & Security project design/implementation, CCTV and digital signage systems.
3. Rammis Bank: Microsoft Office 365 supply, installation, configuration and enterprise training.
4. Lion Insurance Company (አንበሳ ኢንሹራንስ): Enterprise firewall supply, installation, configuration and training.
5. Debre Tabor University (ደብረ ታቦር ዩኒቨርሲቲ): CCTV project design and supervision, IP video surveillance systems.
6. Ethiopian Shipping and Logistics Services Enterprise (ESLSE / ESL): Data Center, Network & Security, Computing & Storage consultancy service project.

── CONTACT DETAILS ───────────────────────────────────────────────────────
Email: info@yaronengineering.com
Sales email: yaron.sales@yaronengineering.com
Phone: +251 944 159 690 and +251 913 404 580
Address: Mana Building, 4th Floor, Room 414AB, CMC Summit, Fiyel Bet, Addis Ababa, Ethiopia
Office hours: Monday – Friday, East Africa Time (UTC+3)
Contact page: /contact

── CAREERS ────────────────────────────────────────────────────────────────
Yaron Engineering looks for Network Engineers, Data Center Engineers, ICT Project Managers,
IT Directors, ICT Sales Managers, and Consultants for national and international ICT projects.
No open roles are currently listed on the site, but interested candidates can email info@yaronengineering.com.

── WEBSITE PAGES ──────────────────────────────────────────────────────────
Home: / | About: /about | Services: /services | Solutions: /solutions
Industries: /industries | Projects: /projects | Partners: /partners
Careers: /careers | Contact: /contact | Blog / Knowledge Hub: /blog
`;

type GeminiMessage = { role: string; content: string };

// Try these models in order — if one is overloaded, fall back to the next
const GEMINI_MODELS = [
  "gemini-3.5-flash-lite",
  "gemini-3.5-flash",
  "gemini-3.6-flash",
  "gemini-3.7-flash",
  "gemini-3.8-flash",
];
const BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models";

async function callGemini(
  apiKey: string,
  model: string,
  contents: object[],
): Promise<{ ok: boolean; text?: string; error?: string; status?: number }> {
  const res = await fetch(`${BASE_URL}/${model}:generateContent`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey,
    },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents,
      generationConfig: { temperature: 0.8, maxOutputTokens: 350 },
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    return { ok: false, error: err.error?.message ?? "Gemini API error.", status: res.status };
  }

  const data = await res.json();
  const text =
    data.candidates?.[0]?.content?.parts?.[0]?.text ??
    "I couldn't fetch a response right now. Please try again!";
  return { ok: true, text };
}

export async function POST(request: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "AI service not configured." }, { status: 503 });
    }

    const { messages } = (await request.json()) as { messages: GeminiMessage[] };
    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
    }

    const contents = messages.map((m: GeminiMessage) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    // Try each model in order until one succeeds
    let lastError = "All AI models are currently unavailable. Please try again shortly.";
    for (const model of GEMINI_MODELS) {
      const result = await callGemini(apiKey, model, contents);
      if (result.ok && result.text) {
        return NextResponse.json({ reply: result.text });
      }
      // 503 / 429 = overloaded, try next model; other errors = stop
      const retryable = result.status === 503 || result.status === 429;
      lastError = result.error ?? lastError;
      console.warn(`Model ${model} failed (${result.status}):`, result.error);
      if (!retryable) break;
    }

    return NextResponse.json({ error: lastError }, { status: 503 });
  } catch (err) {
    console.error("AI chat route error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
