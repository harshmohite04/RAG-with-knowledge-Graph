import React, { createContext, useContext, useEffect, useState } from 'react';
import { Activity, BillingItem, CalendarEvent, Case, Conversation, Document, User } from '../types/types';
import {
    mockActivities,
    mockBillingItems,
    mockCalendarEvents,
    mockCases,
    mockConversations,
    mockDocuments,
} from '../utils/mockData';
import {
    getActivities,
    getBillingItems,
    getCalendarEvents,
    getCases,
    getConversations,
    getDocuments,
    getUser,
    removeUser,
    saveActivities,
    saveBillingItems,
    saveCalendarEvents,
    saveCases,
    saveConversations,
    saveDocuments,
    saveUser,
} from '../utils/storage';

interface AppContextType {
  user: User | null;
  cases: Case[];
  conversations: Conversation[];
  calendarEvents: CalendarEvent[];
  activities: Activity[];
  documents: Document[];
  billingItems: BillingItem[];
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  addCase: (newCase: Case) => Promise<void>;
  updateCase: (caseId: string, updates: Partial<Case>) => Promise<void>;
  deleteCase: (caseId: string) => Promise<void>;
  getCaseById: (caseId: string) => Case | undefined;
  addConversation: (conversation: Conversation) => Promise<void>;
  updateConversation: (conversationId: string, updates: Partial<Conversation>) => Promise<void>;
  markAllMessagesRead: () => Promise<void>;
  addCalendarEvent: (event: CalendarEvent) => Promise<void>;
  updateCalendarEvent: (eventId: string, updates: Partial<CalendarEvent>) => Promise<void>;
  deleteCalendarEvent: (eventId: string) => Promise<void>;
  addActivity: (activity: Activity) => Promise<void>;
  addDocument: (document: Document) => Promise<void>;
  addBillingItem: (item: BillingItem) => Promise<void>;
  updateBillingItem: (itemId: string, updates: Partial<BillingItem>) => Promise<void>;
  isLoading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [cases, setCases] = useState<Case[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [billingItems, setBillingItems] = useState<BillingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from storage on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [
        storedUser,
        storedCases,
        storedConversations,
        storedEvents,
        storedActivities,
        storedDocuments,
        storedBillingItems,
      ] = await Promise.all([
        getUser(),
        getCases(),
        getConversations(),
        getCalendarEvents(),
        getActivities(),
        getDocuments(),
        getBillingItems(),
      ]);

      setUser(storedUser);
      setCases(storedCases.length > 0 ? storedCases : mockCases);
      setConversations(storedConversations.length > 0 ? storedConversations : mockConversations);
      setCalendarEvents(storedEvents.length > 0 ? storedEvents : mockCalendarEvents);
      setActivities(storedActivities.length > 0 ? storedActivities : mockActivities);
      setDocuments(storedDocuments.length > 0 ? storedDocuments : mockDocuments);
      setBillingItems(storedBillingItems.length > 0 ? storedBillingItems : mockBillingItems);

      // Save mock data if nothing was stored
      if (storedCases.length === 0) await saveCases(mockCases);
      if (storedConversations.length === 0) await saveConversations(mockConversations);
      if (storedEvents.length === 0) await saveCalendarEvents(mockCalendarEvents);
      if (storedActivities.length === 0) await saveActivities(mockActivities);
      if (storedDocuments.length === 0) await saveDocuments(mockDocuments);
      if (storedBillingItems.length === 0) await saveBillingItems(mockBillingItems);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Mock authentication - in real app, this would call an API
      const mockUser: User = {
        id: '1',
        name: 'Sarah Chen',
        email: email,
        role: 'Attorney',
        token: 'mock-jwt-token-' + Date.now(),
      };
      setUser(mockUser);
      await saveUser(mockUser);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setUser(null);
      await removeUser();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const addCase = async (newCase: Case): Promise<void> => {
    try {
      const updatedCases = [...cases, newCase];
      setCases(updatedCases);
      await saveCases(updatedCases);

      // Add activity for new case
      const newActivity: Activity = {
        id: Date.now().toString(),
        type: 'document',
        title: 'New case created',
        description: `Case ${newCase.caseNumber} created`,
        time: 'Just now',
        icon: 'briefcase',
        iconBg: '#eff6ff',
        iconColor: '#3b82f6',
        caseId: newCase.id,
        caseName: newCase.title,
      };
      await addActivity(newActivity);
    } catch (error) {
      console.error('Error adding case:', error);
    }
  };

  const updateCase = async (caseId: string, updates: Partial<Case>): Promise<void> => {
    try {
      const updatedCases = cases.map((c) => (c.id === caseId ? { ...c, ...updates } : c));
      setCases(updatedCases);
      await saveCases(updatedCases);
    } catch (error) {
      console.error('Error updating case:', error);
    }
  };

  const deleteCase = async (caseId: string): Promise<void> => {
    try {
      const updatedCases = cases.filter((c) => c.id !== caseId);
      setCases(updatedCases);
      await saveCases(updatedCases);
    } catch (error) {
      console.error('Error deleting case:', error);
    }
  };

  const getCaseById = (caseId: string): Case | undefined => {
    return cases.find((c) => c.id === caseId);
  };

  const addConversation = async (conversation: Conversation): Promise<void> => {
    try {
      const updatedConversations = [conversation, ...conversations];
      setConversations(updatedConversations);
      await saveConversations(updatedConversations);
    } catch (error) {
      console.error('Error adding conversation:', error);
    }
  };

  const updateConversation = async (
    conversationId: string,
    updates: Partial<Conversation>
  ): Promise<void> => {
    try {
      const updatedConversations = conversations.map((c) =>
        c.id === conversationId ? { ...c, ...updates } : c
      );
      setConversations(updatedConversations);
      await saveConversations(updatedConversations);
    } catch (error) {
      console.error('Error updating conversation:', error);
    }
  };

  const markAllMessagesRead = async (): Promise<void> => {
    try {
      const updatedConversations = conversations.map((c) => ({ ...c, unread: false }));
      setConversations(updatedConversations);
      await saveConversations(updatedConversations);
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  const addCalendarEvent = async (event: CalendarEvent): Promise<void> => {
    try {
      const updatedEvents = [...calendarEvents, event];
      setCalendarEvents(updatedEvents);
      await saveCalendarEvents(updatedEvents);
    } catch (error) {
      console.error('Error adding calendar event:', error);
    }
  };

  const updateCalendarEvent = async (
    eventId: string,
    updates: Partial<CalendarEvent>
  ): Promise<void> => {
    try {
      const updatedEvents = calendarEvents.map((e) => (e.id === eventId ? { ...e, ...updates } : e));
      setCalendarEvents(updatedEvents);
      await saveCalendarEvents(updatedEvents);
    } catch (error) {
      console.error('Error updating calendar event:', error);
    }
  };

  const deleteCalendarEvent = async (eventId: string): Promise<void> => {
    try {
      const updatedEvents = calendarEvents.filter((e) => e.id !== eventId);
      setCalendarEvents(updatedEvents);
      await saveCalendarEvents(updatedEvents);
    } catch (error) {
      console.error('Error deleting calendar event:', error);
    }
  };

  const addActivity = async (activity: Activity): Promise<void> => {
    try {
      const updatedActivities = [activity, ...activities];
      setActivities(updatedActivities);
      await saveActivities(updatedActivities);
    } catch (error) {
      console.error('Error adding activity:', error);
    }
  };

  const addDocument = async (document: Document): Promise<void> => {
    try {
      const updatedDocuments = [...documents, document];
      setDocuments(updatedDocuments);
      await saveDocuments(updatedDocuments);
    } catch (error) {
      console.error('Error adding document:', error);
    }
  };

  const addBillingItem = async (item: BillingItem): Promise<void> => {
    try {
      const updatedItems = [...billingItems, item];
      setBillingItems(updatedItems);
      await saveBillingItems(updatedItems);
    } catch (error) {
      console.error('Error adding billing item:', error);
    }
  };

  const updateBillingItem = async (itemId: string, updates: Partial<BillingItem>): Promise<void> => {
    try {
      const updatedItems = billingItems.map((item) =>
        item.id === itemId ? { ...item, ...updates } : item
      );
      setBillingItems(updatedItems);
      await saveBillingItems(updatedItems);
    } catch (error) {
      console.error('Error updating billing item:', error);
    }
  };

  const value: AppContextType = {
    user,
    cases,
    conversations,
    calendarEvents,
    activities,
    documents,
    billingItems,
    login,
    logout,
    addCase,
    updateCase,
    deleteCase,
    getCaseById,
    addConversation,
    updateConversation,
    markAllMessagesRead,
    addCalendarEvent,
    updateCalendarEvent,
    deleteCalendarEvent,
    addActivity,
    addDocument,
    addBillingItem,
    updateBillingItem,
    isLoading,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
