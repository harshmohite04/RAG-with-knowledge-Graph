import { useApp } from '@/contexts/AppContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface TimeEntry {
  id: string;
  date: string;
  title: string;
  description: string;
  hours: string;
  rate: string;
  status: 'billable' | 'billed';
}

export default function BillableScreen() {
  const router = useRouter();
  const { cases } = useApp();
  const [selectedTab, setSelectedTab] = useState<'hours' | 'expenses'>('hours');

  // Mock data - in real app, this would come from context
  const currentCase = cases[0] || {
    title: 'Smith v. Jones',
    client: 'John Smith',
  };

  const timeEntries: TimeEntry[] = [
    {
      id: '1',
      date: 'OCT\n12',
      title: 'Case Research & Review',
      description: 'Reviewed precedent cases...',
      hours: '1h\n30m',
      rate: '$250.00/hr',
      status: 'billable',
    },
    {
      id: '2',
      date: 'OCT\n10',
      title: 'Client Meeting',
      description: 'Initial consultation and...',
      hours: '0h\n45m',
      rate: '$250.00/hr',
      status: 'billed',
    },
    {
      id: '3',
      date: 'OCT\n08',
      title: 'Drafting Motion',
      description: 'Drafting motion to dismiss for...',
      hours: '2h\n15m',
      rate: '$250.00/hr',
      status: 'billed',
    },
    {
      id: '4',
      date: 'OCT\n05',
      title: 'Phone Conference',
      description: 'Call with opposing counsel...',
      hours: '0h\n30m',
      rate: '$250.00/hr',
      status: 'billed',
    },
  ];

  const totalHours = 14.5;
  const totalExpenses = 320.0;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Billable Money</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Case Info */}
        <View style={styles.caseInfo}>
          <View style={styles.caseHeader}>
            <View>
              <Text style={styles.caseTitle}>{currentCase.title}</Text>
              <View style={styles.clientRow}>
                <Ionicons name="person" size={14} color="#64748b" />
                <Text style={styles.clientText}>Client: {currentCase.client}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.folderButton}>
              <Ionicons name="folder-open" size={24} color="#3b82f6" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <View style={styles.statHeader}>
              <Ionicons name="time" size={20} color="#3b82f6" />
              <Text style={styles.statLabel}>Total Hours</Text>
            </View>
            <Text style={styles.statValue}>{totalHours}h</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statHeader}>
              <Ionicons name="cash" size={20} color="#10b981" />
              <Text style={styles.statLabel}>Total Expenses</Text>
            </View>
            <Text style={styles.statValue}>${totalExpenses.toFixed(2)}</Text>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'hours' && styles.activeTab]}
            onPress={() => setSelectedTab('hours')}
          >
            <Text style={[styles.tabText, selectedTab === 'hours' && styles.activeTabText]}>
              Billable Hours
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'expenses' && styles.activeTab]}
            onPress={() => setSelectedTab('expenses')}
          >
            <Text style={[styles.tabText, selectedTab === 'expenses' && styles.activeTabText]}>
              Billable Expenses
            </Text>
          </TouchableOpacity>
        </View>

        {/* Recent Entries Header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>RECENT ENTRIES</Text>
          <TouchableOpacity>
            <Text style={styles.filterText}>Filter</Text>
          </TouchableOpacity>
        </View>

        {/* Time Entries List */}
        <View style={styles.entriesList}>
          {timeEntries.map((entry) => (
            <TouchableOpacity key={entry.id} style={styles.entryCard}>
              <View style={styles.entryLeft}>
                <View style={styles.dateBox}>
                  <Text style={styles.dateText}>{entry.date}</Text>
                </View>
              </View>

              <View style={styles.entryContent}>
                <Text style={styles.entryTitle}>{entry.title}</Text>
                <Text style={styles.entryDescription} numberOfLines={1}>
                  {entry.description}
                </Text>
                <Text style={styles.entryRate}>{entry.rate}</Text>
              </View>

              <View style={styles.entryRight}>
                <Text style={styles.entryHours}>{entry.hours}</Text>
                <View
                  style={[
                    styles.statusDot,
                    { backgroundColor: entry.status === 'billable' ? '#f59e0b' : '#10b981' },
                  ]}
                />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Log Time Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.logTimeButton}>
          <Ionicons name="add-circle" size={20} color="#fff" />
          <Text style={styles.logTimeText}>Log Time</Text>
        </TouchableOpacity>
      </View>
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
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  caseInfo: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  caseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  caseTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 6,
  },
  clientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  clientText: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '500',
  },
  folderButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0f172a',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
    gap: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#3b82f6',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
  },
  activeTabText: {
    color: '#fff',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94a3b8',
    letterSpacing: 0.5,
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#3b82f6',
  },
  entriesList: {
    gap: 12,
  },
  entryCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  entryLeft: {
    marginRight: 12,
  },
  dateBox: {
    width: 48,
    height: 48,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 14,
  },
  entryContent: {
    flex: 1,
  },
  entryTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 4,
  },
  entryDescription: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 6,
  },
  entryRate: {
    fontSize: 11,
    fontWeight: '500',
    color: '#94a3b8',
  },
  entryRight: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginLeft: 12,
  },
  entryHours: {
    fontSize: 13,
    fontWeight: '700',
    color: '#3b82f6',
    textAlign: 'right',
    lineHeight: 16,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingBottom: 32,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  logTimeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    paddingVertical: 16,
    gap: 8,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  logTimeText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
});
