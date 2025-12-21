import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Activity,
  BillingItem,
  CalendarEvent,
  Case,
  Conversation,
  Document,
  User,
} from "../types/types";

const STORAGE_KEYS = {
  USER: "@lawfirm_user",
  CASES: "@lawfirm_cases",
  CONVERSATIONS: "@lawfirm_conversations",
  CALENDAR_EVENTS: "@lawfirm_calendar_events",
  ACTIVITIES: "@lawfirm_activities",
  DOCUMENTS: "@lawfirm_documents",
  BILLING_ITEMS: "@lawfirm_billing_items",
};

// User Storage
export const saveUser = async (user: User): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  } catch (error) {
    console.error("Error saving user:", error);
  }
};

export const getUser = async (): Promise<User | null> => {
  try {
    const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error("Error getting user:", error);
    return null;
  }
};

export const removeUser = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.USER);
  } catch (error) {
    console.error("Error removing user:", error);
  }
};

// Cases Storage
export const saveCases = async (cases: Case[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.CASES, JSON.stringify(cases));
  } catch (error) {
    console.error("Error saving cases:", error);
  }
};

export const getCases = async (): Promise<Case[]> => {
  try {
    const casesData = await AsyncStorage.getItem(STORAGE_KEYS.CASES);
    return casesData ? JSON.parse(casesData) : [];
  } catch (error) {
    console.error("Error getting cases:", error);
    return [];
  }
};

// Conversations Storage
export const saveConversations = async (
  conversations: Conversation[]
): Promise<void> => {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEYS.CONVERSATIONS,
      JSON.stringify(conversations)
    );
  } catch (error) {
    console.error("Error saving conversations:", error);
  }
};

export const getConversations = async (): Promise<Conversation[]> => {
  try {
    const conversationsData = await AsyncStorage.getItem(
      STORAGE_KEYS.CONVERSATIONS
    );
    return conversationsData ? JSON.parse(conversationsData) : [];
  } catch (error) {
    console.error("Error getting conversations:", error);
    return [];
  }
};

// Calendar Events Storage
export const saveCalendarEvents = async (
  events: CalendarEvent[]
): Promise<void> => {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEYS.CALENDAR_EVENTS,
      JSON.stringify(events)
    );
  } catch (error) {
    console.error("Error saving calendar events:", error);
  }
};

export const getCalendarEvents = async (): Promise<CalendarEvent[]> => {
  try {
    const eventsData = await AsyncStorage.getItem(STORAGE_KEYS.CALENDAR_EVENTS);
    return eventsData ? JSON.parse(eventsData) : [];
  } catch (error) {
    console.error("Error getting calendar events:", error);
    return [];
  }
};

// Activities Storage
export const saveActivities = async (activities: Activity[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEYS.ACTIVITIES,
      JSON.stringify(activities)
    );
  } catch (error) {
    console.error("Error saving activities:", error);
  }
};

export const getActivities = async (): Promise<Activity[]> => {
  try {
    const activitiesData = await AsyncStorage.getItem(STORAGE_KEYS.ACTIVITIES);
    return activitiesData ? JSON.parse(activitiesData) : [];
  } catch (error) {
    console.error("Error getting activities:", error);
    return [];
  }
};

// Documents Storage
export const saveDocuments = async (documents: Document[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEYS.DOCUMENTS,
      JSON.stringify(documents)
    );
  } catch (error) {
    console.error("Error saving documents:", error);
  }
};

export const getDocuments = async (): Promise<Document[]> => {
  try {
    const documentsData = await AsyncStorage.getItem(STORAGE_KEYS.DOCUMENTS);
    return documentsData ? JSON.parse(documentsData) : [];
  } catch (error) {
    console.error("Error getting documents:", error);
    return [];
  }
};

// Billing Items Storage
export const saveBillingItems = async (
  billingItems: BillingItem[]
): Promise<void> => {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEYS.BILLING_ITEMS,
      JSON.stringify(billingItems)
    );
  } catch (error) {
    console.error("Error saving billing items:", error);
  }
};

export const getBillingItems = async (): Promise<BillingItem[]> => {
  try {
    const billingItemsData = await AsyncStorage.getItem(
      STORAGE_KEYS.BILLING_ITEMS
    );
    return billingItemsData ? JSON.parse(billingItemsData) : [];
  } catch (error) {
    console.error("Error getting billing items:", error);
    return [];
  }
};

// Clear all storage
export const clearAllStorage = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
  } catch (error) {
    console.error("Error clearing storage:", error);
  }
};
