// Local mock mirror of the backend payloads. Kept isolated so the app still
// works offline and so the real orchestrator can replace the API cleanly.

import {
  CapabilityProfile,
  HistoryItem,
  MissionDetail,
  MissionSummary,
} from "./types";

const EAT_EAT_LOGO =
  "https://images.unsplash.com/photo-1680986157053-5fa731966cfc?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzR8MHwxfHNlYXJjaHwxfHxFYXQlMjBFYXQlMjBsb2dvJTIwdHJhbnNwYXJlbnR8ZW58MHx8fHwxNzg4MDgwNjY1fDA&ixlib=rb-4.1.0&q=85";

const CHEF_BG =
  "https://images.unsplash.com/photo-1665206221363-568ea2f7b195?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxODF8MHwxfHNlYXJjaHwxfHxTb3V0aCUyMEluZGlhbiUyMGNoZWYlMjBjb29raW5nJTIwcmVhbCUyMHBob3RvfGVufDB8fHx8MTc4ODA4MDY2NXww&ixlib=rb-4.1.0&q=85";

export const MOCK_MISSION_DETAILS: MissionDetail[] = [
  {
    id: "m_chef_voice",
    company: "Eat Eat",
    companyLogo: EAT_EAT_LOGO,
    title: "South Indian Chef Simulation",
    purpose: "Help Eat Eat evaluate how you approach real kitchen problems.",
    action: "Talk through a live service problem",
    durationLabel: "3 min",
    durationMinutes: 3,
    type: "voice",
    status: "New mission",
    isExtra: false,
    urgency: "Ready to start?",
    bgImage: CHEF_BG,
    context:
      "Eat Eat is opening a new South Indian kitchen and wants to understand how you think on your feet during a real service rush.",
    scenario:
      "Your dosa batter fermentation has stalled before service. Explain how you would diagnose and fix it.",
    requiresConsent: true,
    voice: {
      agentName: "8x Voice",
      introLine: "When you're ready, walk me through what you'd do. Take your time.",
      consentTitle: "We'd like to record your voice",
      consentBody:
        "Your voice is recorded so Eat Eat can understand how you approach the problem — not just your final answer. You can stop anytime.",
    },
    questions: [],
  },
  {
    id: "m_extra_text",
    company: "Eat Eat",
    companyLogo: EAT_EAT_LOGO,
    title: "One more perspective needed",
    purpose: "8x needs another angle on how you'd handle a sudden rush.",
    action: "Answer 2 quick questions",
    durationLabel: "2 min",
    durationMinutes: 2,
    type: "text",
    status: "Extra mission",
    isExtra: true,
    urgency: "One more perspective needed",
    bgImage: null,
    context:
      "A large unexpected party of 12 walks in 10 minutes before closing. The kitchen is already winding down for the night.",
    scenario: null,
    requiresConsent: false,
    voice: null,
    questions: [
      { id: "q1", prompt: "What's the first thing you do, and why?", placeholder: "Start with your first move…" },
      { id: "q2", prompt: "How do you keep quality high while moving fast?", placeholder: "A sentence or two is plenty…" },
    ],
  },
  {
    id: "m_prep_text",
    company: "Eat Eat",
    companyLogo: EAT_EAT_LOGO,
    title: "Morning prep priorities",
    purpose: "See how you sequence work when time is tight.",
    action: "Answer 3 short questions",
    durationLabel: "4 min",
    durationMinutes: 4,
    type: "text",
    status: "New mission",
    isExtra: false,
    urgency: null,
    bgImage: null,
    context:
      "It's 7am and service starts at 11. Deliveries just arrived and one of your line cooks called in sick.",
    scenario: null,
    requiresConsent: false,
    voice: null,
    questions: [
      { id: "q1", prompt: "What do you prep first?", placeholder: "Your first priority…" },
      { id: "q2", prompt: "How do you adjust for the missing cook?", placeholder: "How you'd rebalance the line…" },
      { id: "q3", prompt: "What would you drop if you run out of time?", placeholder: "What can wait…" },
    ],
  },
];

export const MOCK_MISSIONS: MissionSummary[] = MOCK_MISSION_DETAILS.map((m) => ({
  id: m.id,
  company: m.company,
  companyLogo: m.companyLogo,
  title: m.title,
  purpose: m.purpose,
  action: m.action,
  durationLabel: m.durationLabel,
  durationMinutes: m.durationMinutes,
  type: m.type,
  status: m.status,
  isExtra: m.isExtra,
  urgency: m.urgency,
}));

export const MOCK_PROFILE: CapabilityProfile = {
  headline: "Your capabilities",
  subtitle: "Your profile evolves from how you approach real work.",
  observedMissions: 3,
  processLabel: "Process",
  outcomeLabel: "Outcome",
  dimensions: [
    { key: "domain_intuition", label: "Domain Intuition", description: "You reason from real kitchen experience.", process: 56, outcome: 20 },
    { key: "problem_solving", label: "Problem Solving", description: "You break messy problems into clear steps.", process: 60, outcome: 18 },
    { key: "communication", label: "Communication", description: "You explain your thinking so others can follow.", process: 48, outcome: 22 },
    { key: "reliability", label: "Reliability", description: "You stay steady when service gets hard.", process: 52, outcome: 16 },
    { key: "adaptability", label: "Adaptability", description: "You adjust quickly when plans change.", process: 58, outcome: 14 },
  ],
};

export const MOCK_HISTORY: HistoryItem[] = [
  { id: "h_inventory", title: "Kitchen inventory triage", company: "Eat Eat", date: "2 days ago", type: "voice", summary: "Talked through prioritizing a delayed vegetable delivery." },
  { id: "h_complaint", title: "Handling a customer complaint", company: "Eat Eat", date: "Last week", type: "text", summary: "Explained how you'd recover gracefully from a spice-level mistake." },
  { id: "h_festival", title: "Line setup for a festival rush", company: "Eat Eat", date: "Last week", type: "voice", summary: "Walked through station layout for a 3x volume day." },
];
