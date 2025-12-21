export interface Case {
  id: string;
  title: string;
  caseNumber: string;
  client: string;
  clientInitials: string;
  avatarColor: string;
  status: "Active" | "Pending" | "Closed" | "Urgent";
  lastActivity: string;
  hasAvatar?: boolean;
  caseType?: string;
  startDate?: string;
  description?: string;
  assignedTeam?: TeamMember[];
}

export interface TeamMember {
  id: string;
  name: string;
  email?: string;
  role?: string;
}

export interface Message {
  id: string;
  sender: "assistant" | "user";
  text: string;
  time?: string;
  attachments?: Attachment[];
}

export interface Conversation {
  id: string;
  name: string;
  initials: string;
  avatarColor: string;
  subject: string;
  preview: string;
  time: string;
  unread: boolean;
  hasAvatar?: boolean;
  messages?: Message[];
}

export interface Attachment {
  name: string;
  type: string;
  pages?: number;
}

export interface CalendarEvent {
  id: string;
  time: string;
  title: string;
  caseNumber: string;
  caseType: string;
  location?: string;
  attendees?: number;
  type: "deposition" | "meeting" | "sync" | "hearing" | "consultation";
  color: string;
  priority?: "high" | "normal";
  date: string;
  description?: string;
  isRemote?: boolean;
}

export interface Activity {
  id: string;
  type: "document" | "note" | "email" | "payment";
  title: string;
  description?: string;
  time: string;
  icon: string;
  iconColor: string;
  iconBg: string;
  caseId?: string;
  caseName?: string;
  details?: {
    fileName?: string;
    fileSize?: string;
    amount?: string;
    emailFrom?: string;
  };
}

export interface Document {
  id: string;
  name: string;
  version: string;
  date: string;
  type: "Petition" | "Evidence" | "Contract" | "Draft";
  icon: string;
  iconBg: string;
  caseId?: string;
}

export interface BillingItem {
  id: string;
  type: "unbilled" | "expense" | "overdue" | "paid";
  title: string;
  date: string;
  status: string;
  amount: string;
  icon: string;
  iconBg: string;
  caseId?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  token?: string;
}

export interface AppState {
  user: User | null;
  cases: Case[];
  conversations: Conversation[];
  calendarEvents: CalendarEvent[];
  activities: Activity[];
  documents: Document[];
  billingItems: BillingItem[];
}
