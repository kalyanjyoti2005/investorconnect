import { User, Startup, Investment, Milestone, Nda, Message, Event, EventParticipant, Vote, Notification } from "@shared/schema";

// Re-export types from schema
export type {
  User,
  Startup,
  Investment,
  Milestone,
  Nda,
  Message,
  Event,
  EventParticipant,
  Vote,
  Notification
};

// Additional frontend-specific types
export type SidebarNavItem = {
  title: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
  disabled?: boolean;
};

export type NavItem = {
  title: string;
  href: string;
  disabled?: boolean;
};
