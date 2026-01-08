import axios from "axios";
// Assuming types are defined or inferred
import api from "./api";
// or just:
// import api from './api';

export interface Case {
  _id: string;
  title: string;
  description: string;
  status: "Open" | "In Progress" | "Closed" | "Paused";
  legalMatter: string;
  assignedLawyers: any[]; // or User[]
  leadAttorney?: any; // Populated object or ID
  createdAt: string;
  updatedAt: string;
  recordStatus: number;
  settings?: {
    notifications: {
      email: boolean;
      sms: boolean;
    };
  };
  teamMembers?: {
    userId: any; // Populated User
    role: string;
    joinedAt: string;
  }[];
}

export interface ActivityLog {
  type: string;
  description: string;
  performedBy: any;
  createdAt: string;
}

export interface Document {
  _id: string;
  fileName: string;
  filePath: string;
  category: string;
  uploadedBy: any;
  uploadedAt: string;
  fileSize: number;
}

export interface BillingRecord {
  _id?: string;
  amount: number;
  description: string;
  status: "Paid" | "Unpaid" | "Pending";
  date: string;
  receiptUrl?: string;
}

// -- Main Case Endpoints --

const getCases = async (): Promise<Case[]> => {
  const response = await api.get("/cases");
  return response.data;
};

const getCaseById = async (id: string): Promise<Case> => {
  const response = await api.get(`/cases/${id}`);
  return response.data;
};

const createCase = async (caseData: any): Promise<Case> => {
  // Get token manually to bypass api instance config issues
  const userInfo = localStorage.getItem("user");
  let token = "";
  if (userInfo) {
    try {
      token = JSON.parse(userInfo).token;
    } catch (e) {
      console.error("Error parsing user info", e);
    }
  }

  // Use raw axios to ensure clean state
  const response = await axios.post(
    "https://f1dfffb60441.ngrok-free.app/cases",
    caseData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        // Do NOT set Content-Type; let browser handle it for FormData
      },
    }
  );
  return response.data;
};

// Soft Delete via Settings or Main
const deleteCase = async (id: string): Promise<void> => {
  await api.delete(`/cases/${id}`);
};

// -- Documents Tab --

const getCaseDocuments = async (id: string): Promise<Document[]> => {
  const response = await api.get(`/cases/${id}/documents`);
  return response.data;
};

const uploadDocument = async (
  id: string,
  formData: FormData
): Promise<Document[]> => {
  const response = await api.post(`/cases/${id}/documents`, formData, {
    headers: {
      "Content-Type": undefined,
    },
  });
  return response.data;
};

const deleteDocument = async (
  caseId: string,
  documentId: string
): Promise<void> => {
  await api.delete(`/cases/${caseId}/documents/${documentId}`);
};

// -- Activity Tab --

const getCaseActivity = async (id: string): Promise<ActivityLog[]> => {
  const response = await api.get(`/cases/${id}/activity`);
  return response.data;
};

const addCaseActivity = async (
  id: string,
  activityData: { description: string; type?: string }
): Promise<ActivityLog[]> => {
  const response = await api.post(`/cases/${id}/activity`, activityData);
  return response.data;
};

// -- Billing Tab --

const getCaseBilling = async (id: string): Promise<BillingRecord[]> => {
  const response = await api.get(`/cases/${id}/billing`);
  return response.data;
};

const addCaseBilling = async (
  id: string,
  billingData: any
): Promise<BillingRecord[]> => {
  const response = await api.post(`/cases/${id}/billing`, billingData);
  return response.data;
};

// -- Settings Tab --

const updateCaseSettings = async (id: string, updates: any): Promise<Case> => {
  const response = await api.patch(`/cases/${id}/settings`, updates);
  return response.data;
};

const caseService = {
  getCases,
  getCaseById,
  createCase,
  deleteCase,

  getCaseDocuments,
  uploadDocument,
  deleteDocument,

  getCaseActivity,
  addCaseActivity,

  getCaseBilling,
  addCaseBilling,

  updateCaseSettings,

  // -- Team Management --
  validateTeamMember: async (id: string, email: string) => {
    const response = await api.post(`/cases/${id}/team/validate`, { email });
    return response.data;
  },

  addTeamMember: async (id: string, email: string, role: string) => {
    const response = await api.post(`/cases/${id}/team/members`, {
      email,
      role,
    });
    return response.data;
  },

  removeTeamMember: async (id: string, userId: string) => {
    const response = await api.delete(`/cases/${id}/team/members/${userId}`);
    return response.data;
  },
};

export default caseService;
