import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface CalendarEvent {
  id: string;
  time: string;
  title: string;
  caseNumber: string;
  caseType: string;
  location?: string;
  attendees?: number;
  type: 'deposition' | 'meeting' | 'sync';
  color: string;
  priority?: 'high' | 'normal';
}

export default function CalendarScreen() {
  const [selectedView, setSelectedView] = useState('Month');
  const [selectedDate, setSelectedDate] = useState(5);
  const [selectedFilter, setSelectedFilter] = useState('All Cases');

  const views = ['Month', 'Week', 'Agenda'];
  const filters = ['All Cases', 'Court Dates', 'Deadlines'];

  // Generate calendar days for October 2023
  const generateCalendarDays = () => {
    const days = [];
    const firstDay = 0; // Sunday (Oct 1, 2023 was a Sunday)
    const daysInMonth = 31;

    // Add empty cells for days before the 1st
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Add actual days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  const calendarDays = generateCalendarDays();
  const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  const events: CalendarEvent[] = [
    {
      id: '1',
      time: '10:00 AM - 11:30 AM',
      title: 'Deposition: Smith v. Jones',
      caseNumber: 'Case #52-401',
      caseType: 'Civil Litigation',
      location: 'Conf. Room B',
      attendees: 3,
      type: 'deposition',
      color: '#3b82f6',
      priority: 'high',
    },
    {
      id: '2',
      time: '1:00 PM - 2:00 PM',
      title: 'Client Intake: Michael Ross',
      caseNumber: 'Case #53-102',
      caseType: 'Corporate Law',
      type: 'meeting',
      color: '#10b981',
    },
    {
      id: '3',
      time: '4:00 PM - 5:00 PM',
      title: 'Firm Weekly Sync',
      caseNumber: 'Internal',
      caseType: 'General',
      type: 'sync',
      color: '#64748b',
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Calendar</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="search-outline" size={22} color="#0f172a" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="options-outline" size={22} color="#0f172a" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="settings-outline" size={22} color="#0f172a" />
          </TouchableOpacity>
        </View>
      </View>

      {/* View Tabs */}
      <View style={styles.viewTabs}>
        {views.map((view) => (
          <TouchableOpacity
            key={view}
            style={[styles.viewTab, selectedView === view && styles.activeViewTab]}
            onPress={() => setSelectedView(view)}
          >
            <Text
              style={[
                styles.viewTabText,
                selectedView === view && styles.activeViewTabText,
              ]}
            >
              {view}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Month Navigation */}
        <View style={styles.monthNavigation}>
          <TouchableOpacity style={styles.navButton}>
            <Ionicons name="chevron-back" size={20} color="#0f172a" />
          </TouchableOpacity>
          <Text style={styles.monthTitle}>October 2023</Text>
          <TouchableOpacity style={styles.navButton}>
            <Ionicons name="chevron-forward" size={20} color="#0f172a" />
          </TouchableOpacity>
        </View>

        {/* Calendar Grid */}
        <View style={styles.calendarContainer}>
          {/* Week Day Headers */}
          <View style={styles.weekDaysRow}>
            {weekDays.map((day, index) => (
              <View key={index} style={styles.weekDayCell}>
                <Text style={styles.weekDayText}>{day}</Text>
              </View>
            ))}
          </View>

          {/* Calendar Days */}
          <View style={styles.calendarGrid}>
            {calendarDays.map((day, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dayCell,
                  day === selectedDate && styles.selectedDayCell,
                  day === null && styles.emptyDayCell,
                ]}
                onPress={() => day && setSelectedDate(day)}
                disabled={day === null}
              >
                {day !== null && (
                  <Text
                    style={[
                      styles.dayText,
                      day === selectedDate && styles.selectedDayText,
                      day === 16 && styles.fadedDayText,
                      day === 17 && styles.fadedDayText,
                    ]}
                  >
                    {day}
                  </Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Filter Pills */}
        <View style={styles.filterContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterContent}
          >
            {filters.map((filter) => (
              <TouchableOpacity
                key={filter}
                style={[
                  styles.filterPill,
                  selectedFilter === filter && styles.activeFilterPill,
                ]}
                onPress={() => setSelectedFilter(filter)}
              >
                <Text
                  style={[
                    styles.filterPillText,
                    selectedFilter === filter && styles.activeFilterPillText,
                  ]}
                >
                  {filter}
                </Text>
                {selectedFilter === filter && (
                  <Ionicons name="chevron-down" size={14} color="#fff" />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Selected Date Header */}
        <View style={styles.dateHeader}>
          <Text style={styles.dateHeaderText}>THURSDAY, OCT {selectedDate}</Text>
        </View>

        {/* Events List */}
        <View style={styles.eventsList}>
          {events.map((event) => (
            <View
              key={event.id}
              style={[styles.eventCard, { borderLeftColor: event.color }]}
            >
              <View style={styles.eventHeader}>
                <Text style={styles.eventTime}>{event.time}</Text>
                {event.priority === 'high' && (
                  <View style={styles.priorityBadge}>
                    <Text style={styles.priorityText}>High Priority</Text>
                  </View>
                )}
              </View>

              <Text style={styles.eventTitle}>{event.title}</Text>

              <View style={styles.eventMeta}>
                <Text style={styles.eventMetaText}>
                  {event.caseNumber} • {event.caseType}
                </Text>
              </View>

              {event.location && (
                <View style={styles.eventDetail}>
                  <Ionicons name="location" size={14} color="#64748b" />
                  <Text style={styles.eventDetailText}>{event.location}</Text>
                </View>
              )}

              {event.attendees && (
                <View style={styles.eventDetail}>
                  <Ionicons name="people" size={14} color="#64748b" />
                  <Text style={styles.eventDetailText}>{event.attendees} Attendees</Text>
                </View>
              )}

              {event.type === 'meeting' && (
                <View style={styles.eventDetail}>
                  <Ionicons name="videocam" size={14} color="#64748b" />
                  <Text style={styles.eventDetailText}>Zoom Meeting</Text>
                </View>
              )}
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab}>
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
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
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0f172a',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewTabs: {
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
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 100,
  },
  monthNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
  },
  navButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  calendarContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 8,
    paddingBottom: 16,
  },
  weekDaysRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  weekDayCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  weekDayText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94a3b8',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
  },
  selectedDayCell: {
    backgroundColor: '#3b82f6',
    borderRadius: 20,
  },
  emptyDayCell: {
    backgroundColor: 'transparent',
  },
  dayText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0f172a',
  },
  selectedDayText: {
    color: '#fff',
    fontWeight: '700',
  },
  fadedDayText: {
    color: '#cbd5e1',
  },
  filterContainer: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  filterContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    gap: 6,
  },
  activeFilterPill: {
    backgroundColor: '#0f172a',
  },
  filterPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
  },
  activeFilterPillText: {
    color: '#fff',
  },
  dateHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  dateHeaderText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94a3b8',
    letterSpacing: 0.5,
  },
  eventsList: {
    paddingHorizontal: 16,
    paddingTop: 8,
    gap: 12,
  },
  eventCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
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
    marginBottom: 8,
  },
  eventTime: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#fef2f2',
    borderRadius: 4,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#ef4444',
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 6,
  },
  eventMeta: {
    marginBottom: 8,
  },
  eventMetaText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748b',
  },
  eventDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  eventDetailText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748b',
  },
  fab: {
    position: 'absolute',
    bottom: 90,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
});
