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

