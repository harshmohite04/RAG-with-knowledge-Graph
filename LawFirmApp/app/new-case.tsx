import { useApp } from '@/contexts/AppContext';
import { Case } from '@/types/types';
import { validateNewCaseForm } from '@/utils/validation';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function NewCaseScreen() {
  const router = useRouter();
  const { addCase } = useApp();
  const [caseName, setCaseName] = useState('');
  const [clientName, setClientName] = useState('');
  const [caseType, setCaseType] = useState('');
  const [startDate, setStartDate] = useState('10/27/2023');
  const [description, setDescription] = useState('');
  const [assignedTeam, setAssignedTeam] = useState([
    { id: '1', name: 'Jane Doe' },
    { id: '2', name: 'Mike Ross' },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const removeTeamMember = (id: string) => {
    setAssignedTeam(assignedTeam.filter((member) => member.id !== id));
  };

  const handleSave = async () => {
    // Validate form
    const validation = validateNewCaseForm(caseName, clientName, caseType);
    if (!validation.isValid) {
      Alert.alert('Validation Error', validation.error || 'Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      // Generate client initials
      const initials = clientName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);

      // Generate case number
      const caseNumber = `Case #${Math.floor(Math.random() * 9000) + 1000}`;

      // Create new case
      const newCase: Case = {
        id: Date.now().toString(),
        title: caseName,
        caseNumber,
        client: clientName,
        clientInitials: initials,
        avatarColor: '#3b82f6',
        status: 'Active',
        lastActivity: 'Just now',
        caseType,
        startDate,
        description,
        assignedTeam,
      };

      await addCase(newCase);
      Alert.alert('Success', 'Case created successfully', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to create case. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeButton} onPress={handleCancel}>
          <Ionicons name="close" size={24} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Case</Text>
        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.saveButton}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Case Details Section */}
        <Text style={styles.sectionTitle}>Case Details</Text>

        {/* Case Name */}
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>
            Case Name <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.textInput}
            placeholder="e.g. Smith vs. Jones"
            placeholderTextColor="#94a3b8"
            value={caseName}
            onChangeText={setCaseName}
          />
        </View>

        {/* Client Name */}
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>
            Client Name <Text style={styles.required}>*</Text>
          </Text>
          <View style={styles.searchInput}>
            <Ionicons name="search" size={18} color="#94a3b8" />
            <TextInput
              style={styles.searchInputText}
              placeholder="Search client..."
              placeholderTextColor="#94a3b8"
              value={clientName}
              onChangeText={setClientName}
            />
          </View>
        </View>

        {/* Case Type & Start Date Row */}
        <View style={styles.rowContainer}>
          <View style={styles.halfField}>
            <Text style={styles.fieldLabel}>
              Case Type <Text style={styles.required}>*</Text>
            </Text>
            <TouchableOpacity style={styles.selectInput}>
              <Text style={[styles.selectText, !caseType && styles.placeholderText]}>
                {caseType || 'Select...'}
              </Text>
              <Ionicons name="chevron-down" size={18} color="#64748b" />
            </TouchableOpacity>
          </View>

          <View style={styles.halfField}>
            <Text style={styles.fieldLabel}>Start Date</Text>
            <TouchableOpacity style={styles.dateInput}>
              <Text style={styles.dateText}>{startDate}</Text>
              <Ionicons name="calendar-outline" size={18} color="#64748b" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Assignments & Notes Section */}
        <Text style={styles.sectionTitle}>Assignments & Notes</Text>

        {/* Assigned Team */}
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Assigned Team</Text>
          <View style={styles.teamContainer}>
            {assignedTeam.map((member) => (
              <View key={member.id} style={styles.teamTag}>
                <Text style={styles.teamTagText}>{member.name}</Text>
                <TouchableOpacity onPress={() => removeTeamMember(member.id)}>
                  <Ionicons name="close-circle" size={16} color="#3b82f6" />
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity style={styles.addMemberButton}>
              <Text style={styles.addMemberText}>Add lawyer...</Text>
              <Ionicons name="add-circle-outline" size={18} color="#94a3b8" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Description */}
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Description</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Brief summary of the case matter..."
            placeholderTextColor="#94a3b8"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Initial Documents */}
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Initial Documents</Text>
          <TouchableOpacity style={styles.uploadArea}>
            <View style={styles.uploadIcon}>
              <Ionicons name="document" size={32} color="#3b82f6" />
            </View>
            <Text style={styles.uploadText}>Tap to upload files</Text>
          </TouchableOpacity>
        </View>

        {/* Create Case Button */}
        <TouchableOpacity style={styles.createButton} onPress={handleSave}>
          <Text style={styles.createButtonText}>Create Case</Text>
        </TouchableOpacity>

        {/* Cancel Button */}
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  closeButton: {
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
  saveButton: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3b82f6',
    paddingHorizontal: 8,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 16,
    marginTop: 8,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 8,
  },
  required: {
    color: '#ef4444',
  },
  textInput: {
    height: 48,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    paddingHorizontal: 14,
    fontSize: 15,
    color: '#0f172a',
    backgroundColor: '#fff',
  },
  searchInput: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    paddingHorizontal: 14,
    gap: 10,
    backgroundColor: '#fff',
  },
  searchInputText: {
    flex: 1,
    fontSize: 15,
    color: '#0f172a',
  },
  rowContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  halfField: {
    flex: 1,
  },
  selectInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 48,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    paddingHorizontal: 14,
    backgroundColor: '#fff',
  },
  selectText: {
    fontSize: 15,
    color: '#0f172a',
  },
  placeholderText: {
    color: '#94a3b8',
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 48,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    paddingHorizontal: 14,
    backgroundColor: '#fff',
  },
  dateText: {
    fontSize: 15,
    color: '#0f172a',
  },
  teamContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  teamTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    borderRadius: 16,
    paddingVertical: 6,
    paddingLeft: 12,
    paddingRight: 8,
    gap: 6,
  },
  teamTagText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#3b82f6',
  },
  addMemberButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  addMemberText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#94a3b8',
  },
  textArea: {
    height: 100,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#0f172a',
    backgroundColor: '#fff',
  },
  uploadArea: {
    height: 120,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8fafc',
  },
  uploadIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  uploadText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#64748b',
  },
  createButton: {
    height: 52,
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    marginBottom: 12,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  cancelButton: {
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748b',
  },
});
