import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface Activity {
  id: string;
  type: 'document' | 'note' | 'email' | 'payment';
  title: string;
  description: string;
  time: string;
  icon: string;
  iconColor: string;
  iconBg: string;
  details?: {
    fileName?: string;
    fileSize?: string;
    amount?: string;
    emailFrom?: string;
  };
}

interface Message {
  id: string;
  sender: 'assistant' | 'user';
  text: string;
  time?: string;
  attachments?: {
    name: string;
    type: string;
    pages?: number;
  }[];
}

export default function CaseDetailScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Chat');
  const [messageInput, setMessageInput] = useState('');

  const tabs = ['Chat', 'Docs', 'Billing', 'Calendar', 'Activity'];

  const messages: Message[] = [
    {
      id: '1',
      sender: 'assistant',
      text: 'I have reviewed 14 documents in this case file. Ask me anything regarding the deposition or financial statements.',
      time: 'Today, 9:41 AM',
    },
    {
      id: '2',
      sender: 'user',
      text: 'What is the discrepancy in the Q3 financial report?',
    },
    {
      id: '3',
      sender: 'assistant',
      text: 'The Q3 report lists total assets at $1.2M, but the June bank statement shows a closing balance of $950k. This creates an unexplained gap of $250k between the self-reported financials and the actual bank records.',
      attachments: [
        {
          name: 'Q3_Financial.pdf',
          type: 'Financial Summary',
          pages: 8,
        },
        {
          name: 'June_Bank_Stmt.pdf',
          type: 'Closing Balance',
          pages: 1,
        },
      ],
    },
  ];

  interface Document {
    id: string;
    name: string;
    version: string;
    date: string;
    type: 'Petition' | 'Evidence' | 'Contract' | 'Draft';
    icon: string;
    iconBg: string;
  }

  const [activeDocFilter, setActiveDocFilter] = useState('All');

  const documents: Document[] = [
    {
      id: '1',
      name: 'Motion_to_Dismiss....',
      version: 'v2.0',
      date: 'Oct 24, 2023',
      type: 'Petition',
      icon: 'document-text',
      iconBg: '#fef2f2',
    },
    {
      id: '2',
      name: 'Exhibit_A_Photos....',
      version: 'v1.0',
      date: 'Oct 22, 2023',
      type: 'Evidence',
      icon: 'image',
      iconBg: '#fef3c7',
    },
    {
      id: '3',
      name: 'Client_Retainer.pdf',
      version: 'v1.0',
      date: 'Sep 15, 2023',
      type: 'Contract',
      icon: 'document-text',
      iconBg: '#dbeafe',
    },
    {
      id: '4',
      name: 'Court_Memo_Draft.do...',
      version: 'v0.1',
      date: 'Sep 12, 2023',
      type: 'Draft',
      icon: 'document',
      iconBg: '#f1f5f9',
    },
  ];

  interface CalendarEvent {
    id: string;
    time: string;
    type: 'HEARING' | 'INTERNAL' | 'CONSULTATION';
    title: string;
    description: string;
    location?: string;
    isRemote?: boolean;
    hasAvatar?: boolean;
  }

  const [calendarView, setCalendarView] = useState('Week');
  const [selectedDate, setSelectedDate] = useState(12);

  const calendarEvents: CalendarEvent[] = [
    {
      id: '1',
      time: '09:00',
      type: 'HEARING',
      title: 'Smith vs. Jones',
      description: 'Pre-trial motion hearing regarding...',
      location: 'Room 304',
      hasAvatar: true,
    },
    {
      id: '2',
      time: '11:30',
      type: 'INTERNAL',
      title: 'Billing Summary Review',
      description: 'Monthly reconciliation with accounting team.',
      location: 'Conf. B',
    },
    {
      id: '3',
      time: '02:00',
      type: 'CONSULTATION',
      title: 'Estate of H. Ford',
      description: 'Will drafting and asset allocation discussion.',
      isRemote: true,
      hasAvatar: true,
    },
  ];

  const weekDays = [
    { day: 'Mon', date: 9 },
    { day: 'Tue', date: 10 },
    { day: 'Wed', date: 11 },
    { day: 'Thu', date: 12 },
    { day: 'Fri', date: 13 },
    { day: 'Sat', date: 14 },
    { day: 'Sun', date: 15 },
  ];

  interface BillingItem {
    id: string;
    type: 'unbilled' | 'expense' | 'overdue' | 'paid';
    title: string;
    date: string;
    status: string;
    amount: string;
    icon: string;
    iconBg: string;
  }

  const billingItems: BillingItem[] = [
    {
      id: '1',
      type: 'unbilled',
      title: 'Client Meeting',
      date: 'OCT 24',
      status: 'UNBILLED',
      amount: '$450.00',
      icon: 'briefcase',
      iconBg: '#64748b',
    },
    {
      id: '2',
      type: 'expense',
      title: 'Court Filing Fee',
      date: 'OCT 23',
      status: 'EXPENSE',
      amount: '$120.00',
      icon: 'document-text',
      iconBg: '#64748b',
    },
    {
      id: '3',
      type: 'overdue',
      title: 'Invoice #002',
      date: 'OCT 15',
      status: 'OVERDUE',
      amount: '$2,700.00',
      icon: 'alert-circle',
      iconBg: '#ef4444',
    },
    {
      id: '4',
      type: 'paid',
      title: 'Invoice #001',
      date: 'OCT 01',
      status: 'PAID',
      amount: '$2,500.00',
      icon: 'checkmark-circle',
      iconBg: '#10b981',
    },
  ];

  const activities: Activity[] = [
    {
      id: '1',
      type: 'document',
      title: 'Document Uploaded',
      description: 'Counsel uploaded a new motion to dismiss for the TechCorp case.',
      time: '10:00 AM',
      icon: 'document-text',
      iconColor: '#3b82f6',
      iconBg: '#eff6ff',
      details: {
        fileName: 'Motion_to_Dismiss_v2.pdf',
        fileSize: '2.4MB PDF',
      },
    },
    {
      id: '2',
      type: 'note',
      title: 'Note Added',
      description: 'Review meeting scheduled for next Tuesday with senior partners regarding the discovery strategy.',
      time: '09:15 AM',
      icon: 'document-attach',
      iconColor: '#64748b',
      iconBg: '#f1f5f9',
    },
    {
      id: '3',
      type: 'email',
      title: 'Email Received',
      description: '"Regarding the extension request for the upcoming deadline."',
      time: '4:30 PM',
      icon: 'mail',
      iconColor: '#64748b',
      iconBg: '#f1f5f9',
      details: {
        emailFrom: 'opposing.counsel@lawfirm.com',
      },
    },
    {
      id: '4',
      type: 'payment',
      title: 'Payment Received',
      description: 'Invoice #1024 was paid in full.',
      time: '2:00 PM',
      icon: 'checkmark-circle',
      iconColor: '#10b981',
      iconBg: '#d1fae5',
      details: {
        amount: '$4,500.00',
      },
    },
  ];

  const renderActivityItem = (activity: Activity) => {
    return (
      <View key={activity.id} style={styles.activityItem}>
        <View style={styles.activityIconContainer}>
          <View style={[styles.activityIcon, { backgroundColor: activity.iconBg }]}>
            <Ionicons name={activity.icon as any} size={20} color={activity.iconColor} />
          </View>
          {activity.id !== '4' && <View style={styles.activityLine} />}
        </View>

        <View style={styles.activityContent}>
          <View style={styles.activityHeader}>
            <Text style={styles.activityTitle}>{activity.title}</Text>
            <Text style={styles.activityTime}>{activity.time}</Text>
          </View>

          <Text style={styles.activityDescription}>{activity.description}</Text>

          {activity.details?.fileName && (
            <View style={styles.documentCard}>
              <View style={styles.documentIcon}>
                <Ionicons name="document" size={20} color="#ef4444" />
              </View>
              <View style={styles.documentInfo}>
                <Text style={styles.documentName}>{activity.details.fileName}</Text>
                <Text style={styles.documentSize}>{activity.details.fileSize}</Text>
              </View>
              <TouchableOpacity style={styles.downloadButton}>
                <Ionicons name="download-outline" size={20} color="#64748b" />
              </TouchableOpacity>
            </View>
          )}

          {activity.details?.emailFrom && (
            <View style={styles.emailActions}>
              <TouchableOpacity style={styles.emailButton}>
                <Text style={styles.emailButtonText}>Reply</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.emailButton}>
                <Text style={styles.emailButtonText}>Forward</Text>
              </TouchableOpacity>
            </View>
          )}

          {activity.details?.amount && (
            <Text style={styles.paymentAmount}>{activity.details.amount}</Text>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#0f172a" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerLabel}>CLIENT</Text>
          <Text style={styles.headerTitle}>TechCorp Inc.</Text>
        </View>
        <TouchableOpacity>
          <Text style={styles.editButton}>Edit</Text>
        </TouchableOpacity>
      </View>

      {/* Case Title */}
      <View style={styles.caseTitleSection}>
        <Text style={styles.caseTitle}>IP Infringement Defense - 2024</Text>
        <View style={styles.badgesRow}>
          <View style={styles.phaseBadge}>
            <Ionicons name="information-circle" size={14} color="#3b82f6" />
            <Text style={styles.phaseBadgeText}>Discovery Phase</Text>
          </View>
          <View style={styles.priorityBadge}>
            <Ionicons name="warning" size={14} color="#f59e0b" />
            <Text style={styles.priorityBadgeText}>High Priority</Text>
          </View>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContent}
        >
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Conditional Content based on active tab */}
      {activeTab === 'Chat' ? (
        <>

          {/* Chat Messages */}
          <ScrollView
            style={styles.chatContainer}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.chatContent}
          >
            {/* Date Header */}
            <View style={styles.dateHeader}>
              <Text style={styles.dateHeaderText}>Today, 9:41 AM</Text>
            </View>

            {messages.map((message) => (
              <View key={message.id} style={styles.messageWrapper}>
                {message.sender === 'assistant' ? (
                  <View style={styles.assistantMessageContainer}>
                    <View style={styles.assistantAvatar}>
                      <Ionicons name="sparkles" size={16} color="#3b82f6" />
                    </View>
                    <View style={styles.assistantMessageContent}>
                      <Text style={styles.assistantLabel}>Case Assistant</Text>
                      <View style={styles.assistantBubble}>
                        <Text style={styles.assistantText}>{message.text}</Text>
                      </View>
                      {message.attachments && message.attachments.length > 0 && (
                        <View style={styles.attachmentsContainer}>
                          {message.attachments.map((attachment, index) => (
                            <TouchableOpacity key={index} style={styles.attachmentCard}>
                              <View style={styles.attachmentIcon}>
                                <Ionicons name="document" size={18} color="#3b82f6" />
                              </View>
                              <View style={styles.attachmentInfo}>
                                <Text style={styles.attachmentName}>{attachment.name}</Text>
                                <Text style={styles.attachmentMeta}>
                                  Page {attachment.pages} • {attachment.type}
                                </Text>
                              </View>
                            </TouchableOpacity>
                          ))}
                        </View>
                      )}
                    </View>
                  </View>
                ) : (
                  <View style={styles.userMessageContainer}>
                    <View style={styles.userBubble}>
                      <Text style={styles.userText}>{message.text}</Text>
                    </View>
                    <View style={styles.userAvatar}>
                      <Ionicons name="person" size={16} color="#fff" />
                    </View>
                  </View>
                )}
              </View>
            ))}

            {/* You label */}
            <View style={styles.youLabel}>
              <Text style={styles.youLabelText}>You</Text>
            </View>
          </ScrollView>

          {/* Chat Input */}
          <View style={styles.chatInputContainer}>
            <View style={styles.chatInputWrapper}>
              <TouchableOpacity style={styles.attachButton}>
                <Ionicons name="add-circle" size={24} color="#64748b" />
              </TouchableOpacity>
              <TextInput
                style={styles.chatInput}
                placeholder="Ask about this case..."
                placeholderTextColor="#94a3b8"
                value={messageInput}
                onChangeText={setMessageInput}
                multiline
              />
              <TouchableOpacity style={styles.sendButton}>
                <LinearGradient colors={['#3b82f6', '#2563eb']} style={styles.sendButtonGradient}>
                  <Ionicons name="arrow-up" size={20} color="#fff" />
                </LinearGradient>
              </TouchableOpacity>
            </View>
            <Text style={styles.chatDisclaimer}>
              All responses should be verified against original documents.
            </Text>
          </View>
        </>
      ) : activeTab === 'Docs' ? (
        <>

          <ScrollView
            style={styles.docsContainer}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.docsContent}
          >
            {/* Upload Area */}
            <TouchableOpacity style={styles.uploadArea}>
              <View style={styles.uploadIcon}>
                <Ionicons name="cloud-upload" size={40} color="#3b82f6" />
              </View>
              <Text style={styles.uploadTitle}>Upload Documents</Text>
              <Text style={styles.uploadSubtitle}>Tap or drop files here to upload</Text>
            </TouchableOpacity>

            {/* Filter Tabs */}
            <View style={styles.filterTabsContainer}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filterTabsContent}
              >
                {['All', 'Evidence', 'Court Orders', 'Drafts'].map((filter) => (
                  <TouchableOpacity
                    key={filter}
                    style={[
                      styles.filterTab,
                      activeDocFilter === filter && styles.activeFilterTab,
                    ]}
                    onPress={() => setActiveDocFilter(filter)}
                  >
                    <Text
                      style={[
                        styles.filterTabText,
                        activeDocFilter === filter && styles.activeFilterTabText,
                      ]}
                    >
                      {filter}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Case Files Header */}
            <View style={styles.caseFilesHeader}>
              <Text style={styles.caseFilesTitle}>Case Files</Text>
              <TouchableOpacity>
                <Text style={styles.sortButton}>Sort by: Date</Text>
              </TouchableOpacity>
            </View>

            {/* Documents List */}
            <View style={styles.documentsList}>
              {documents.map((doc) => (
                <TouchableOpacity key={doc.id} style={styles.documentItem}>
                  <View style={[styles.documentIconWrapper, { backgroundColor: doc.iconBg }]}>
                    <Ionicons name={doc.icon as any} size={28} color="#ef4444" />
                  </View>
                  <View style={styles.documentDetails}>
                    <Text style={styles.docItemName}>{doc.name}</Text>
                    <View style={styles.documentMeta}>
                      <Text style={styles.documentVersion}>{doc.version}</Text>
                      <Text style={styles.documentDot}>•</Text>
                      <Text style={styles.documentDate}>{doc.date}</Text>
                    </View>
                  </View>
                  <View style={styles.documentBadgeContainer}>
                    <View
                      style={[
                        styles.documentBadge,
                        {
                          backgroundColor:
                            doc.type === 'Petition'
                              ? '#f3e8ff'
                              : doc.type === 'Evidence'
                              ? '#fef3c7'
                              : doc.type === 'Contract'
                              ? '#dbeafe'
                              : '#f1f5f9',
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.documentBadgeText,
                          {
                            color:
                              doc.type === 'Petition'
                                ? '#a855f7'
                                : doc.type === 'Evidence'
                                ? '#f59e0b'
                                : doc.type === 'Contract'
                                ? '#3b82f6'
                                : '#64748b',
                          },
                        ]}
                      >
                        {doc.type}
                      </Text>
                    </View>
                    <TouchableOpacity style={styles.documentMenuButton}>
                      <Ionicons name="ellipsis-vertical" size={18} color="#94a3b8" />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          {/* Floating Action Button */}
          <TouchableOpacity style={styles.fab} activeOpacity={0.8}>
            <LinearGradient colors={['#3b82f6', '#2563eb']} style={styles.fabGradient}>
              <Ionicons name="add" size={28} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
        </>
      ) : activeTab === 'Calendar' ? (
        <>

          {/* View Tabs */}
          <View style={styles.viewTabsContainer}>
            {['Month', 'Week', 'Agenda'].map((view) => (
              <TouchableOpacity
                key={view}
                style={[styles.viewTab, calendarView === view && styles.activeViewTab]}
                onPress={() => setCalendarView(view)}
              >
                <Text
                  style={[
                    styles.viewTabText,
                    calendarView === view && styles.activeViewTabText,
                  ]}
                >
                  {view}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <ScrollView
            style={styles.calendarContainer}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.calendarContent}
          >
            {/* Week Calendar */}
            <View style={styles.weekCalendar}>
              {weekDays.map((day) => (
                <TouchableOpacity
                  key={day.date}
                  style={[
                    styles.dayColumn,
                    selectedDate === day.date && styles.selectedDayColumn,
                  ]}
                  onPress={() => setSelectedDate(day.date)}
                >
                  <Text
                    style={[
                      styles.dayLabel,
                      selectedDate === day.date && styles.selectedDayLabel,
                    ]}
                  >
                    {day.day}
                  </Text>
                  <View
                    style={[
                      styles.dateCircle,
                      selectedDate === day.date && styles.selectedDateCircle,
                    ]}
                  >
                    <Text
                      style={[
                        styles.dateText,
                        selectedDate === day.date && styles.selectedDateText,
                      ]}
                    >
                      {day.date}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            {/* Events List */}
            <View style={styles.eventsList}>
              {calendarEvents.map((event) => (
                <View key={event.id} style={styles.eventItem}>
                  <View style={styles.eventTimeColumn}>
                    <Text style={styles.eventTime}>{event.time}</Text>
                    <Text style={styles.eventPeriod}>
                      {parseInt(event.time.split(':')[0]) < 12 ? 'AM' : 'PM'}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.eventCard,
                      {
                        borderLeftColor:
                          event.type === 'HEARING'
                            ? '#3b82f6'
                            : event.type === 'INTERNAL'
                            ? '#64748b'
                            : '#ef4444',
                      },
                    ]}
                  >
                    <View style={styles.eventHeader}>
                      <View
                        style={[
                          styles.eventTypeBadge,
                          {
                            backgroundColor:
                              event.type === 'HEARING'
                                ? '#eff6ff'
                                : event.type === 'INTERNAL'
                                ? '#f1f5f9'
                                : '#fef2f2',
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.eventTypeText,
                            {
                              color:
                                event.type === 'HEARING'
                                  ? '#3b82f6'
                                  : event.type === 'INTERNAL'
                                  ? '#64748b'
                                  : '#ef4444',
                            },
                          ]}
                        >
                          {event.type}
                        </Text>
                      </View>
                      {event.location && (
                        <View style={styles.eventLocation}>
                          <Ionicons
                            name={event.isRemote ? 'videocam' : 'location'}
                            size={12}
                            color="#94a3b8"
                          />
                          <Text style={styles.eventLocationText}>
                            {event.isRemote ? 'Remote' : event.location}
                          </Text>
                        </View>
                      )}
                    </View>

                    <Text style={styles.eventTitle}>{event.title}</Text>
                    <Text style={styles.eventDescription}>{event.description}</Text>

                    {event.hasAvatar && (
                      <View style={styles.eventAvatars}>
                        <View style={styles.avatar}>
                          <Ionicons name="person" size={14} color="#fff" />
                        </View>
                        <View style={[styles.avatar, styles.avatarOverlap]}>
                          <Ionicons name="person" size={14} color="#fff" />
                        </View>
                      </View>
                    )}
                  </View>
                </View>
              ))}

              {/* No Events Message */}
              <View style={styles.noEventsContainer}>
                <Text style={styles.noEventsText}>No events scheduled</Text>
              </View>
            </View>
          </ScrollView>

          {/* Floating Action Button */}
          <TouchableOpacity style={styles.fab} activeOpacity={0.8}>
            <LinearGradient colors={['#3b82f6', '#2563eb']} style={styles.fabGradient}>
              <Ionicons name="add" size={28} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
        </>
      ) : activeTab === 'Billing' ? (
        <>
          <ScrollView
            style={styles.billingContainer}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.billingContent}
          >
            {/* Critical Action Card */}
            <LinearGradient
              colors={['#3b82f6', '#2563eb']}
              style={styles.criticalActionCard}
            >
              <View style={styles.criticalActionHeader}>
                <View style={styles.alertIconWrapper}>
                  <Ionicons name="alert-circle" size={24} color="#fff" />
                </View>
                <Text style={styles.criticalActionTitle}>CRITICAL ACTION REQUIRED</Text>
              </View>

              <View style={styles.outstandingSection}>
                <Text style={styles.outstandingLabel}>Total Outstanding</Text>
                <Text style={styles.outstandingAmount}>$2,700.00</Text>
              </View>

              <View style={styles.creditLimitSection}>
                <View style={styles.creditLimitHeader}>
                  <Text style={styles.creditLimitLabel}>Credit Limit Usage</Text>
                  <Text style={styles.creditLimitPercentage}>65%</Text>
                </View>
                <View style={styles.progressBarContainer}>
                  <View style={styles.progressBarBg}>
                    <View style={[styles.progressBarFill, { width: '65%' }]} />
                  </View>
                </View>
              </View>

              <TouchableOpacity style={styles.sendReminderButton}>
                <Ionicons name="mail" size={18} color="#3b82f6" />
                <Text style={styles.sendReminderText}>Send Reminder</Text>
              </TouchableOpacity>
            </LinearGradient>

            {/* Financial Timeline Header */}
            <View style={styles.timelineHeader}>
              <Text style={styles.timelineTitle}>Financial Timeline</Text>
              <TouchableOpacity>
                <Ionicons name="options-outline" size={22} color="#0f172a" />
              </TouchableOpacity>
            </View>

            {/* Billing Items */}
            <View style={styles.billingItemsList}>
              {billingItems.map((item) => (
                <View
                  key={item.id}
                  style={[
                    styles.billingItemCard,
                    item.type === 'overdue' && styles.overdueCard,
                  ]}
                >
                  <View style={styles.billingItemHeader}>
                    <View style={styles.billingItemLeft}>
                      <View style={[styles.billingIcon, { backgroundColor: item.iconBg }]}>
                        <Ionicons name={item.icon as any} size={20} color="#fff" />
                      </View>
                      <View style={styles.billingItemInfo}>
                        <Text style={styles.billingItemTitle}>{item.title}</Text>
                        <Text
                          style={[
                            styles.billingItemStatus,
                            item.type === 'overdue' && styles.overdueStatus,
                          ]}
                        >
                          {item.date} • {item.status}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.billingItemAmount}>{item.amount}</Text>
                  </View>

                  <View style={styles.billingItemActions}>
                    {item.type === 'unbilled' || item.type === 'expense' ? (
                      <>
                        <TouchableOpacity style={styles.editButton}>
                          <Text style={styles.editButtonText}>Edit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.approveButton}>
                          <Text style={styles.approveButtonText}>Approve & Invoice</Text>
                        </TouchableOpacity>
                      </>
                    ) : item.type === 'overdue' ? (
                      <>
                        <TouchableOpacity style={styles.viewDetailsButton}>
                          <Text style={styles.viewDetailsButtonText}>View Details</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.resendButton}>
                          <Ionicons name="reload" size={16} color="#fff" />
                          <Text style={styles.resendButtonText}>Resend</Text>
                        </TouchableOpacity>
                      </>
                    ) : (
                      <View style={styles.paidIndicator}>
                        <Ionicons name="checkmark-circle" size={20} color="#10b981" />
                        <Text style={styles.paidText}>Paid</Text>
                      </View>
                    )}
                  </View>
                </View>
              ))}
            </View>

            {/* View Full History */}
            <TouchableOpacity style={styles.viewHistoryButton}>
              <Ionicons name="time-outline" size={18} color="#64748b" />
              <Text style={styles.viewHistoryText}>View Full History</Text>
            </TouchableOpacity>
          </ScrollView>
        </>
      ) : (
        <>
          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <View style={styles.searchBar}>
              <Ionicons name="search" size={18} color="#94a3b8" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search activity..."
                placeholderTextColor="#94a3b8"
              />
            </View>
            <TouchableOpacity style={styles.filterButton}>
              <Ionicons name="options-outline" size={20} color="#64748b" />
            </TouchableOpacity>
          </View>

          {/* Activity Feed */}
          <ScrollView
            style={styles.activityFeed}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.activityFeedContent}
          >
            {activities.map((activity) => renderActivityItem(activity))}
          </ScrollView>

          {/* Floating Action Button */}
          <TouchableOpacity style={styles.fab} activeOpacity={0.8}>
            <LinearGradient colors={['#3b82f6', '#2563eb']} style={styles.fabGradient}>
              <Ionicons name="add" size={28} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  menuButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748b',
    letterSpacing: 1,
    marginBottom: 2,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButton: {
    fontSize: 15,
    fontWeight: '600',
    color: '#3b82f6',
    width: 40,
    textAlign: 'right',
  },
  caseTitleSection: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  caseTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 12,
    lineHeight: 28,
  },
  badgesRow: {
    flexDirection: 'row',
    gap: 8,
  },
  phaseBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 4,
  },
  phaseBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#3b82f6',
  },
  priorityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 4,
  },
  priorityBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#f59e0b',
  },
  tabsContainer: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  tabsContent: {
    paddingHorizontal: 16,
    gap: 24,
  },
  tab: {
    paddingVertical: 12,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#3b82f6',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  activeTabText: {
    color: '#3b82f6',
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
    backgroundColor: '#fff',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 40,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#0f172a',
  },
  filterButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 10,
  },
  activityFeed: {
    flex: 1,
  },
  activityFeedContent: {
    padding: 16,
    paddingBottom: 100,
  },
  activityItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  activityIconContainer: {
    alignItems: 'center',
    marginRight: 12,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#e2e8f0',
    marginTop: 8,
  },
  activityContent: {
    flex: 1,
    paddingBottom: 20,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  activityTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
  },
  activityTime: {
    fontSize: 12,
    fontWeight: '500',
    color: '#94a3b8',
  },
  activityDescription: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
    marginBottom: 12,
  },
  documentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 10,
  },
  documentIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#fef2f2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  documentInfo: {
    flex: 1,
  },
  documentName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 2,
  },
  documentSize: {
    fontSize: 11,
    color: '#94a3b8',
  },
  downloadButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emailActions: {
    flexDirection: 'row',
    gap: 12,
  },
  emailButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#fff',
  },
  emailButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#3b82f6',
  },
  paymentAmount: {
    fontSize: 20,
    fontWeight: '800',
    color: '#10b981',
  },
  fab: {
    position: 'absolute',
    bottom: 90,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  fabGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Chat Styles
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatHeaderInfo: {
    flex: 1,
    alignItems: 'center',
  },
  chatHeaderTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  chatHeaderSubtitle: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  moreButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  chatContent: {
    padding: 16,
    paddingBottom: 100,
  },
  dateHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  dateHeaderText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94a3b8',
  },
  messageWrapper: {
    marginBottom: 16,
  },
  assistantMessageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  assistantAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  assistantMessageContent: {
    flex: 1,
  },
  assistantLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 6,
  },
  assistantBubble: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderTopLeftRadius: 4,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  assistantText: {
    fontSize: 14,
    color: '#0f172a',
    lineHeight: 20,
  },
  attachmentsContainer: {
    marginTop: 10,
    gap: 8,
  },
  attachmentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 10,
  },
  attachmentIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  attachmentInfo: {
    flex: 1,
  },
  attachmentName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 2,
  },
  attachmentMeta: {
    fontSize: 11,
    color: '#94a3b8',
  },
  userMessageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
  },
  userBubble: {
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    borderTopRightRadius: 4,
    padding: 14,
    maxWidth: '75%',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  userText: {
    fontSize: 14,
    color: '#fff',
    lineHeight: 20,
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#64748b',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  youLabel: {
    alignItems: 'flex-end',
    marginTop: 8,
  },
  youLabelText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94a3b8',
  },
  chatInputContainer: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
  },
  chatInputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#f8fafc',
    borderRadius: 24,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  attachButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatInput: {
    flex: 1,
    fontSize: 14,
    color: '#0f172a',
    maxHeight: 100,
    paddingVertical: 6,
  },
  sendButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    overflow: 'hidden',
  },
  sendButtonGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatDisclaimer: {
    fontSize: 11,
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 8,
  },
  // Docs Styles
  docsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  docsHeaderInfo: {
    flex: 1,
    alignItems: 'center',
  },
  docsHeaderLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#94a3b8',
    letterSpacing: 1,
    marginBottom: 2,
  },
  docsHeaderTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
  },
  searchIconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  docsContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  docsContent: {
    padding: 16,
    paddingBottom: 100,
  },
  uploadArea: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderStyle: 'dashed',
    padding: 40,
    alignItems: 'center',
    marginBottom: 20,
  },
  uploadIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  uploadTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 6,
  },
  uploadSubtitle: {
    fontSize: 13,
    color: '#64748b',
  },
  filterTabsContainer: {
    marginBottom: 20,
  },
  filterTabsContent: {
    gap: 10,
  },
  filterTab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  activeFilterTab: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  activeFilterTabText: {
    color: '#fff',
  },
  caseFilesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  caseFilesTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
  },
  sortButton: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
  },
  documentsList: {
    gap: 12,
  },
  documentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  documentIconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  documentDetails: {
    flex: 1,
  },
  docItemName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 4,
  },
  documentMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  documentVersion: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  documentDot: {
    fontSize: 12,
    color: '#cbd5e1',
  },
  documentDate: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  documentBadgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  documentBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  documentBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  documentMenuButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Calendar Styles
  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  monthSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  monthText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  calendarHeaderButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  todayButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#eff6ff',
    borderRadius: 6,
  },
  todayButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#3b82f6',
  },
  calendarMenuButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewTabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  viewTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
  },
  activeViewTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#3b82f6',
  },
  viewTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  activeViewTabText: {
    color: '#3b82f6',
  },
  calendarContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  calendarContent: {
    paddingBottom: 100,
  },
  weekCalendar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  dayColumn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  selectedDayColumn: {
    backgroundColor: 'transparent',
  },
  dayLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94a3b8',
    marginBottom: 8,
  },
  selectedDayLabel: {
    color: '#3b82f6',
  },
  dateCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  selectedDateCircle: {
    backgroundColor: '#3b82f6',
  },
  dateText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  selectedDateText: {
    color: '#fff',
  },
  eventsList: {
    padding: 16,
  },
  eventItem: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  eventTimeColumn: {
    width: 60,
    alignItems: 'flex-end',
    paddingRight: 12,
    paddingTop: 4,
  },
  eventTime: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  eventPeriod: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94a3b8',
    marginTop: 2,
  },
  eventCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  eventTypeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  eventTypeText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  eventLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  eventLocationText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#94a3b8',
  },
  eventTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 6,
  },
  eventDescription: {
    fontSize: 13,
    color: '#64748b',
    lineHeight: 18,
    marginBottom: 10,
  },
  eventAvatars: {
    flexDirection: 'row',
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#64748b',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  avatarOverlap: {
    marginLeft: -10,
  },
  noEventsContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  noEventsText: {
    fontSize: 14,
    color: '#94a3b8',
    fontWeight: '500',
  },
  // Billing Styles
  billingContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  billingContent: {
    padding: 16,
    paddingBottom: 100,
  },
  criticalActionCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  criticalActionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 10,
  },
  alertIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  criticalActionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.5,
  },
  outstandingSection: {
    marginBottom: 20,
  },
  outstandingLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 8,
  },
  outstandingAmount: {
    fontSize: 36,
    fontWeight: '800',
    color: '#fff',
  },
  creditLimitSection: {
    marginBottom: 20,
  },
  creditLimitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  creditLimitLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  creditLimitPercentage: {
    fontSize: 13,
    fontWeight: '700',
    color: '#fff',
  },
  progressBarContainer: {
    marginBottom: 4,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 4,
  },
  sendReminderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 14,
    gap: 8,
  },
  sendReminderText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#3b82f6',
  },
  timelineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  timelineTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
  },
  billingItemsList: {
    gap: 12,
  },
  billingItemCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  overdueCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#ef4444',
  },
  billingItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  billingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  billingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  billingItemInfo: {
    flex: 1,
  },
  billingItemTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 4,
  },
  billingItemStatus: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
  overdueStatus: {
    color: '#ef4444',
  },
  billingItemAmount: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
  },
  billingItemActions: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  approveButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
  },
  approveButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  viewDetailsButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  viewDetailsButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  resendButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#ef4444',
    gap: 6,
  },
  resendButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  paidIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  paidText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10b981',
  },
  viewHistoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    marginTop: 16,
    gap: 8,
  },
  viewHistoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
});
