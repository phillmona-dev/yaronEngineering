import { NextResponse } from "next/server";
import { company, leadershipRoles, stats } from "@/lib/data/company";
import { services } from "@/lib/data/services";
import { partners } from "@/lib/data/partners";
import { projectGroups, projects } from "@/lib/data/projects";

const SYSTEM_PROMPT = `You are an AI assistant embedded on the Yaron Engineering PLC website.
You answer questions about Yaron Engineering in a friendly, professional, and confident way.
Keep answers concise (2-4 sentences max), engaging, and use emojis very sparingly.
If asked something you do not know or that falls outside what is documented below, say:
"I don't have that detail on hand — please reach out to our team at ${company.contact.salesEmail} or call ${company.contact.phones[0]} and they'll be happy to help."
Never guess, never fabricate facts. Never quote contract values, prices or project costs.

── ABOUT YARON ENGINEERING PLC ──────────────────────────────────────────
Full name: ${company.legalName}
Tagline: ${company.tagline} — "${company.slogan}"
Founded: ${company.founded}
Headquarters: ${company.headquarters.full}

Vision: ${company.vision}
Mission: ${company.mission}

Description: ${company.description}

Story: ${company.story.join(" ")}

Core values:
${company.coreValues.map((v) => `- ${v.title}: ${v.text}`).join("\n")}

Business lines: ${company.businessLines.join(", ")}.

Main business areas:
${company.businessAreas.map((a) => `- ${a.title}: ${a.text}`).join("\n")}

Key stats:
${stats.map((s) => `- ${s.value}${s.suffix} ${s.label.toLowerCase()} (${s.note})`).join("\n")}

── SERVICES ──────────────────────────────────────────────────────────────
${services
  .map(
    (s, i) =>
      `${i + 1}. ${s.title} (/services/${s.slug})\n   ${s.summary} Capabilities: ${s.capabilities.join(", ")}.`,
  )
  .join("\n")}

How we deliver:
${company.serviceLines.map((l) => `- ${l.title}: ${l.items.join("; ")}.`).join("\n")}

── TECHNOLOGY PARTNERS ───────────────────────────────────────────────────
${partners.map((p) => `${p.name} (${p.category})`).join(", ")}.

── PROJECTS & CLIENTS (see /projects) ────────────────────────────────────
${projectGroups
  .map(
    (g) =>
      `${g.title}:\n${projects
        .filter((p) => p.group === g.id)
        .map(
          (p) =>
            `- ${p.client} — ${p.name}${p.year ? ` (${p.year})` : ""}: ${p.summary}${p.highlights.length ? ` Scale: ${p.highlights.join(", ")}.` : ""}`,
        )
        .join("\n")}`,
  )
  .join("\n\n")}

── CONTACT DETAILS ───────────────────────────────────────────────────────
Email: ${company.contact.email}
Sales email: ${company.contact.salesEmail}
Phone: ${company.contact.phones.join(", ")}
WhatsApp: ${company.contact.whatsapp}
Address: ${company.headquarters.full}
Office hours: Monday – Friday, East Africa Time (UTC+3)
Contact page: /contact

── CAREERS ────────────────────────────────────────────────────────────────
Yaron Engineering looks for ${leadershipRoles.join(", ")}.
No open roles are currently listed on the site, but interested candidates can email ${company.contact.email}.

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
