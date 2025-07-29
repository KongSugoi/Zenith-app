import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface JournalEntry {
  id: string;
  date: Date;
  mood: 'great' | 'good' | 'okay' | 'bad' | 'terrible';
  symptoms: string[];
  notes: string;
  medications: string;
  activities: string;
}

export default function HealthJournalScreen() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [medications, setMedications] = useState('');
  const [activities, setActivities] = useState('');

  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([
    {
      id: '1',
      date: new Date(),
      mood: 'good',
      symptoms: ['Hơi mệt'],
      notes: 'Ngủ tốt 7 tiếng. Ăn uống bình thường.',
      medications: 'Thuốc huyết áp sáng, viên canxi tối',
      activities: 'Đi bộ 30 phút, làm vườn',
    },
    {
      id: '2',
      date: new Date(Date.now() - 86400000),
      mood: 'great',
      symptoms: [],
      notes: 'Cảm thấy rất khỏe và tràn đầy năng lượng.',
      medications: 'Thuốc huyết áp sáng',
      activities: 'Tập yoga, gặp bạn bè',
    },
  ]);

  const moodOptions = [
    { value: 'great', label: 'Rất tốt', icon: '😄', color: '#10b981' },
    { value: 'good', label: 'Tốt', icon: '😊', color: '#3b82f6' },
    { value: 'okay', label: 'Bình thường', icon: '😐', color: '#f59e0b' },
    { value: 'bad', label: 'Không tốt', icon: '😔', color: '#ef4444' },
    { value: 'terrible', label: 'Rất tệ', icon: '😢', color: '#dc2626' },
  ];

  const handleAddEntry = () => {
    if (!selectedMood) {
      Alert.alert('Lỗi', 'Vui lòng chọn tâm trạng');
      return;
    }

    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      date: new Date(),
      mood: selectedMood as any,
      symptoms: [],
      notes: notes.trim(),
      medications: medications.trim(),
      activities: activities.trim(),
    };

    setJournalEntries([newEntry, ...journalEntries]);
    setSelectedMood('');
    setNotes('');
    setMedications('');
    setActivities('');
    setShowAddModal(false);
    Alert.alert('Thành công', 'Đã thêm nhật ký mới');
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getMoodOption = (mood: string) => {
    return moodOptions.find(option => option.value === mood);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Nhật ký sức khỏe</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowAddModal(true)}
          >
            <Icon name="add" size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Icon name="book" size={24} color="#3b82f6" />
            <Text style={styles.statValue}>{journalEntries.length}</Text>
            <Text style={styles.statLabel}>Tổng nhật ký</Text>
          </View>
          <View style={styles.statCard}>
            <Icon name="trending-up" size={24} color="#10b981" />
            <Text style={styles.statValue}>7</Text>
            <Text style={styles.statLabel}>Ngày liên tiếp</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.moodEmoji}>😊</Text>
            <Text style={styles.statValue}>Tốt</Text>
            <Text style={styles.statLabel}>Tâm trạng TB</Text>
          </View>
        </View>

        {/* Journal Entries */}
        <View style={styles.entriesContainer}>
          <Text style={styles.sectionTitle}>Nhật ký gần đây</Text>
          {journalEntries.map((entry) => {
            const moodOption = getMoodOption(entry.mood);
            return (
              <View key={entry.id} style={styles.entryCard}>
                <View style={styles.entryHeader}>
                  <View style={styles.entryDate}>
                    <Text style={styles.entryDateText}>
                      {formatDate(entry.date)}
                    </Text>
                  </View>
                  <View style={[styles.moodBadge, { backgroundColor: `${moodOption?.color}20` }]}>
                    <Text style={styles.moodEmoji}>{moodOption?.icon}</Text>
                    <Text style={[styles.moodText, { color: moodOption?.color }]}>
                      {moodOption?.label}
                    </Text>
                  </View>
                </View>

                {entry.notes && (
                  <View style={styles.entrySection}>
                    <Text style={styles.entrySectionTitle}>Ghi chú</Text>
                    <Text style={styles.entrySectionContent}>{entry.notes}</Text>
                  </View>
                )}

                {entry.medications && (
                  <View style={styles.entrySection}>
                    <Text style={styles.entrySectionTitle}>Thuốc men</Text>
                    <Text style={styles.entrySectionContent}>{entry.medications}</Text>
                  </View>
                )}

                {entry.activities && (
                  <View style={styles.entrySection}>
                    <Text style={styles.entrySectionTitle}>Hoạt động</Text>
                    <Text style={styles.entrySectionContent}>{entry.activities}</Text>
                  </View>
                )}

                {entry.symptoms.length > 0 && (
                  <View style={styles.entrySection}>
                    <Text style={styles.entrySectionTitle}>Triệu chứng</Text>
                    <View style={styles.symptomsContainer}>
                      {entry.symptoms.map((symptom, index) => (
                        <View key={index} style={styles.symptomTag}>
                          <Text style={styles.symptomText}>{symptom}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}
              </View>
            );
          })}
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Add Entry Modal */}
      <Modal
        visible={showAddModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Thêm nhật ký mới</Text>
              <TouchableOpacity
                onPress={() => setShowAddModal(false)}
                style={styles.closeButton}
              >
                <Icon name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalForm} showsVerticalScrollIndicator={false}>
              {/* Mood Selection */}
              <View style={styles.inputSection}>
                <Text style={styles.inputLabel}>Tâm trạng hôm nay *</Text>
                <View style={styles.moodGrid}>
                  {moodOptions.map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.moodOption,
                        selectedMood === option.value && {
                          backgroundColor: `${option.color}20`,
                          borderColor: option.color,
                        },
                      ]}
                      onPress={() => setSelectedMood(option.value)}
                    >
                      <Text style={styles.moodOptionEmoji}>{option.icon}</Text>
                      <Text
                        style={[
                          styles.moodOptionText,
                          selectedMood === option.value && { color: option.color },
                        ]}
                      >
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Notes */}
              <View style={styles.inputSection}>
                <Text style={styles.inputLabel}>Ghi chú sức khỏe</Text>
                <TextInput
                  style={styles.textArea}
                  placeholder="Cảm giác, triệu chứng, tình trạng sức khỏe..."
                  value={notes}
                  onChangeText={setNotes}
                  multiline
                  numberOfLines={4}
                />
              </View>

              {/* Medications */}
              <View style={styles.inputSection}>
                <Text style={styles.inputLabel}>Thuốc men đã dùng</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Tên thuốc, liều lượng, thời gian uống..."
                  value={medications}
                  onChangeText={setMedications}
                />
              </View>

              {/* Activities */}
              <View style={styles.inputSection}>
                <Text style={styles.inputLabel}>Hoạt động trong ngày</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Tập thể dục, công việc, giải trí..."
                  value={activities}
                  onChangeText={setActivities}
                />
              </View>

              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleAddEntry}
              >
                <Text style={styles.submitButtonText}>Lưu nhật ký</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1e40af',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  moodEmoji: {
    fontSize: 24,
  },
  entriesContainer: {
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  entryCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  entryDate: {
    flex: 1,
  },
  entryDateText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  moodBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  moodText: {
    fontSize: 12,
    fontWeight: '600',
  },
  entrySection: {
    marginBottom: 12,
  },
  entrySectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  entrySectionContent: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  symptomsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  symptomTag: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  symptomText: {
    fontSize: 12,
    color: '#92400e',
  },
  bottomSpacing: {
    height: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
  },
  closeButton: {
    padding: 4,
  },
  modalForm: {
    flex: 1,
    padding: 24,
  },
  inputSection: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  moodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  moodOption: {
    flex: 1,
    minWidth: '30%',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    backgroundColor: '#ffffff',
  },
  moodOptionEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  moodOptionText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  textInput: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  textArea: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    height: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#1e40af',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});