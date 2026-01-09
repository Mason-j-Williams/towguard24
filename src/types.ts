// ===============================
// TowGuard24 — Core Type System
// Chunk 1: Core Enums + Primitives
// ===============================

// ---- AppView: Master Enum for All Screens ----
export enum AppView {
  LANDING = "LANDING",
  ONBOARDING = "ONBOARDING",
  DASHBOARD = "DASHBOARD",
  DISPATCH = "DISPATCH",
  AGENTS = "AGENTS",

  // Guard Hub
  GUARD_HUB = "GUARD_HUB",
  SIGN_SCRUTINY = "SIGN_SCRUTINY",
  FRAUD_SENTRY = "FRAUD_SENTRY",
  COLLISION_GUARD = "COLLISION_GUARD",

  // Business Tier
  HQ_BLACK_OPS = "HQ_BLACK_OPS",
  FLEET_OPS = "FLEET_OPS",
  BLUEPRINT = "BLUEPRINT",

  // Legal & History
  HISTORY = "HISTORY",
  LEGAL_LAB = "LEGAL_LAB",
  FORENSIC_PACKET = "FORENSIC_PACKET",
  HARDSHIP_HUB = "HARDSHIP_HUB",

  // AI Communication Layers
  VOICE_ASSISTANT = "VOICE_ASSISTANT",
  VIDEO_OPS = "VIDEO_OPS",
  AUDIO_DIAGNOSTIC = "AUDIO_DIAGNOSTIC",
}

// ---- Status Enums ----
export enum IncidentStatus {
  CLEARED = "CLEARED",
  PENDING = "PENDING",
  FAILED = "FAILED",
}

export enum VehicleStatus {
  ONLINE = "ONLINE",
  IDLE = "IDLE",
  INCIDENT = "INCIDENT",
}

export enum SeverityBand {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
}

export enum SOPCategory {
  INCIDENT = "INCIDENT",
  FLEET = "FLEET",
  FINANCE = "FINANCE",
}

// ---- Shared Utility Types ----
export type ID = string;

export interface Timestamped {
  createdAt: string;
  updatedAt?: string;
}

export interface BaseRecord extends Timestamped {
  id: ID;
}


// ===============================
// Chunk 2: Navigation + Routing Types
// ===============================

// ---- Navigation Item ----
export interface NavItem {
  label: string;
  view: AppView;
  icon?: React.ReactNode;
  hidden?: boolean; // for admin-only or business-tier views
}

// ---- Route Configuration ----
export interface RouteConfig {
  view: AppView;
  path: string;
  title: string;
  requiresAuth?: boolean;
  businessTier?: boolean;
}

// ---- Master AppView Map ----
// This is used by your router, your sidebar, and v0 for context.
export const AppViewMap: Record<AppView, RouteConfig> = {
  [AppView.LANDING]: {
    view: AppView.LANDING,
    path: "/",
    title: "Landing",
  },
  [AppView.ONBOARDING]: {
    view: AppView.ONBOARDING,
    path: "/onboarding",
    title: "Onboarding",
  },
  [AppView.DASHBOARD]: {
    view: AppView.DASHBOARD,
    path: "/dashboard",
    title: "Dashboard",
    requiresAuth: true,
  },
  [AppView.DISPATCH]: {
    view: AppView.DISPATCH,
    path: "/dispatch",
    title: "Dispatch Center",
    requiresAuth: true,
  },
  [AppView.AGENTS]: {
    view: AppView.AGENTS,
    path: "/agents",
    title: "AI Agents",
    requiresAuth: true,
  },

  // Guard Hub
  [AppView.GUARD_HUB]: {
    view: AppView.GUARD_HUB,
    path: "/guard",
    title: "Guard Hub",
    requiresAuth: true,
  },
  [AppView.SIGN_SCRUTINY]: {
    view: AppView.SIGN_SCRUTINY,
    path: "/guard/sign",
    title: "Sign Scrutiny",
    requiresAuth: true,
  },
  [AppView.FRAUD_SENTRY]: {
    view: AppView.FRAUD_SENTRY,
    path: "/guard/fraud",
    title: "Fraud Sentry",
    requiresAuth: true,
  },
  [AppView.COLLISION_GUARD]: {
    view: AppView.COLLISION_GUARD,
    path: "/guard/collision",
    title: "Collision Guard",
    requiresAuth: true,
  },

  // Business Tier
  [AppView.HQ_BLACK_OPS]: {
    view: AppView.HQ_BLACK_OPS,
    path: "/hq",
    title: "HQ Black-Ops",
    requiresAuth: true,
    businessTier: true,
  },
  [AppView.FLEET_OPS]: {
    view: AppView.FLEET_OPS,
    path: "/fleet",
    title: "Fleet Ops",
    requiresAuth: true,
    businessTier: true,
  },
  [AppView.BLUEPRINT]: {
    view: AppView.BLUEPRINT,
    path: "/blueprint",
    title: "Blueprint Library",
    requiresAuth: true,
    businessTier: true,
  },

  // Legal & History
  [AppView.HISTORY]: {
    view: AppView.HISTORY,
    path: "/history",
    title: "History",
    requiresAuth: true,
  },
  [AppView.LEGAL_LAB]: {
    view: AppView.LEGAL_LAB,
    path: "/legal",
    title: "Legal Lab",
    requiresAuth: true,
  },
  [AppView.FORENSIC_PACKET]: {
    view: AppView.FORENSIC_PACKET,
    path: "/packet",
    title: "Forensic Packet",
    requiresAuth: true,
  },
  [AppView.HARDSHIP_HUB]: {
    view: AppView.HARDSHIP_HUB,
    path: "/hardship",
    title: "Hardship Hub",
    requiresAuth: true,
  },

  // AI Communication Layers
  [AppView.VOICE_ASSISTANT]: {
    view: AppView.VOICE_ASSISTANT,
    path: "/voice",
    title: "Voice Assistant",
    requiresAuth: true,
  },
  [AppView.VIDEO_OPS]: {
    view: AppView.VIDEO_OPS,
    path: "/video",
    title: "Video Ops",
    requiresAuth: true,
  },
  [AppView.AUDIO_DIAGNOSTIC]: {
    view: AppView.AUDIO_DIAGNOSTIC,
    path: "/audio",
    title: "Audio Diagnostic",
    requiresAuth: true,
  },
};


// ===============================
// Chunk 3: Domain Models
// ===============================

// ---- Incident Record (History, Legal Lab, Forensic Packet) ----
export interface IncidentRecord extends BaseRecord {
  date: string;                 // ISO timestamp
  corridor: string;             // e.g., "I-95 North"
  type: string;                 // e.g., "Tow Dispatch"
  status: IncidentStatus;       // CLEARED | PENDING | FAILED
  amount: number;               // billing amount
  notes?: string;               // operator notes
  media?: string[];             // image/video evidence URLs
  aiSummary?: string;           // AI forensic summary
}

// ---- Fleet Vehicle (Fleet Ops) ----
export interface FleetVehicle extends BaseRecord {
  label: string;                // "Unit 204 · I‑95 North"
  status: VehicleStatus;        // ONLINE | IDLE | INCIDENT
  corridor: string;             // current corridor
  speed: number;                // mph
  lastPing: string;             // ISO timestamp
  driverName?: string;
  metadata?: Record<string, any>;
}

// ---- Legal Document (Legal Lab) ----
export interface LegalDocument extends BaseRecord {
  title: string;                // "Affidavit of Tow Dispatch"
  category: SOPCategory;        // INCIDENT | FLEET | FINANCE
  severity: SeverityBand;       // LOW | MEDIUM | HIGH
  incidentId?: string;          // link to IncidentRecord
  content: string;              // markdown or plain text
  official: boolean;            // court-ready flag
}

// ---- Hardship Case (Hardship Hub) ----
export interface HardshipCase extends BaseRecord {
  userId: string;
  reason: string;               // "Job loss", "Medical emergency", etc.
  status: "OPEN" | "REVIEW" | "APPROVED" | "DENIED";
  requestedRelief: number;      // amount requested
  approvedRelief?: number;      // amount approved
  notes?: string;
}


// ===============================
// Chunk 4: AI Models & Forensic Types
// ===============================

// ---- Generic AI Analysis Result ----
export interface AIAnalysisResult {
  summary: string;                     // high-level AI explanation
  confidence?: number;                 // 0–1 confidence score
  tags?: string[];                     // extracted keywords
  raw?: any;                           // full model output
}

// ---- Voice Assistant (Gemini Live) ----
export interface VoiceSession extends BaseRecord {
  transcript: string[];                // running transcript
  status: "IDLE" | "LISTENING" | "PROCESSING" | "RESPONDING";
  lastInteraction?: string;            // ISO timestamp
  aiResponse?: string;                 // last Gemini reply
}

// ---- Video Ops (Veo 3.1 Evidence Generation) ----
export interface VideoGenerationRequest extends BaseRecord {
  prompt: string;                      // forensic prompt
  status: "PENDING" | "GENERATING" | "READY" | "FAILED";
  resultUrl?: string;                  // URL to generated evidence
  metadata?: Record<string, any>;
}

// ---- Forensic Packet (PDF / Evidence Bundle) ----
export interface ForensicPacket extends BaseRecord {
  incidentId: string;                  // link to IncidentRecord
  includedMedia: string[];             // images, audio, video
  aiSummaries: {
    sign?: string;
    fraud?: string;
    collision?: string;
    audio?: string;
  };
  legalNotes?: string;                 // official notes
  status: "BUILDING" | "READY" | "FAILED";
}

