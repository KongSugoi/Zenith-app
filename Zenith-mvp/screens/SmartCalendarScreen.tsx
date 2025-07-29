import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Calendar } from 'react-native-calendars';

interface Reminder {
  id: string;
  title: string;
  time: string;
  type: 'medication' | 'appointment' | 'exercise' | 'other';
  date: string;
  completed?: boolean;
  recurring?: boolean;
}

export default function SmartCalendarScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newReminder, setNewReminder] = useState({
    title: '',
    time: '',
    type: 'medication' as const,
  });

  const [reminders, setReminders] = useState<Reminder[]>([
    {
      id: '1',
      title: 'Uống thuốc huyết áp',
      time: '08:00',
      type: 'medication',
      date: new Date().toISOString().split('T')[0],
      recurring: true,
    },
    {
      id: '2',
      title: 'Khám bác sĩ tim mạch',
      time: '14:30',
      type: 'appointment',
      date: new Date().toISOString().split('T')[0],
    },
    {
      id: '3',
      title: 'Tập thể dục nhẹ',
      time: '17:00',
      type: 'exercise',
      date: new Date().toISOString().split('T')[0],
      recurring: true,
    },
    {
      id: '4',
      title: 'Uống thuốc canxi',
      time: '20:00',
      type: 'medication',
      date: new Date().toISOString().split('T')[0],
      recurring: true,
    },
  ]);

  const reminderTypes = [
    { value: 'medication', label: 'Thuốc men', icon: 'medication', color: '#ef4444' },
    { value: 'appointment', label: 'Hẹn khám', icon: 'local-hospital', color: '#3b82f6' },
    { value: 'exercise', label: 'Tập thể dục', icon: 'fitness-center', color: '#10b981' },
    { value: 'other', label: 'Khác', icon: 'event', color: '#f59e0b' },
  ];

  const getMarkedDates = () => {
    const marked: any = {};
    
    // Mark today
    const today = new Date().toISOString().split('T')[0];
    marked[today] = {
      selected: selectedDate === today,
      selectedColor: '#1e40af',
      marked: true,
      dotColor: '#10b981',
    };

    // Mark selected date
    if (selectedDate !== today) {
      marked[selectedDate] = {
        selected: true,
        selectedColor: '#1e40af',
      };
    }

    // Mark dates with reminders
    reminders.forEach(reminder => {
      if (reminder.date in marked) {
        marked[reminder.date].marked = true;
        marked[reminder.date].dotColor = '#10b981';
      } else {
        marked[reminder.date] = {
          marked: true,
          dotColor: '#10b981',
        };
      }
    });

    return marked;
  };

  const getRemindersForDate = (date: string) => {
    return reminders.filter(reminder => reminder.date === date);
  };

  const handleAddReminder = () => {
    if (!newReminder.title.trim() || !newReminder.time.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin');
      return;
    }

    const reminder: Reminder = {
      id: Date.now().toString(),
      title: newReminder.title.trim(),
      time: newReminder.time.trim(),
      type: newReminder.type,
      date: selectedDate,
    };

    setReminders([...reminders, reminder]);
    setNewReminder({ title: '', time: '', type: 'medication' });
    setShowAddModal(false);
    Alert.alert('Thành công', 'Đã thêm nhắc nhở mới');
  };

  const toggleReminderComplete = (reminderId: string) => {
    setReminders(reminders.map(reminder => 
      reminder.id === reminderId 
        ? { ...reminder, completed: !reminder.completed }
        : reminder
    ));
  };

  const deleteReminder = (reminderId: string) => {
    Alert.alert(
      'Xác nhận',
      'Bạn có chắc muốn xóa nhắc nhở này?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: () => {
            setReminders(reminders.filter(r => r.id !== reminderId));
          },
        },
      ]
    );
  };

  const getReminderTypeInfo = (type: string) => {
    return reminderTypes.find(t => t.value === type) || reminderTypes[0];
  };

  const todayReminders = getRemindersForDate(new Date().toISOString().split('T')[0]);
  const selectedDateReminders = getRemindersForDate(selectedDate);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Lịch thông minh</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowAddModal(true)}
          >
            <Icon name="add" size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>

        {/* Today's Summary */}
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryTitle}>Hôm nay</Text>
          <View style={styles.summaryStats}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{todayReminders.length}</Text>
              <Text style={styles.summaryLabel}>Nhắc nhở</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>
                {todayReminders.filter(r => r.completed).length}
              </Text>
              <Text style={styles.summaryLabel}>Hoàn thành</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>
                {todayReminders.filter(r => r.type === 'medication').length}
              </Text>
              <Text style={styles.summaryLabel}>Thuốc men</Text>
            </View>
          </View>
        </View>

        {/* Calendar */}
        <View style={styles.calendarContainer}>
          <Calendar
            current={selectedDate}
            onDayPress={(day) => setSelectedDate(day.dateString)}
            markedDates={getMarkedDates()}
            theme={{
              backgroundColor: '#ffffff',
              calendarBackground: '#ffffff',
              textSectionTitleColor: '#6b7280',
              selectedDayBackgroundColor: '#1e40af',
              selectedDayTextColor: '#ffffff',
              todayTextColor: '#1e40af',
              dayTextColor: '#1f2937',
              textDisabledColor: '#d1d5db',
              arrowColor: '#1e40af',
              monthTextColor: '#1f2937',
              indicatorColor: '#1e40af',
              textDayFontWeight: '500',
              textMonthFontWeight: '600',
              textDayHeaderFontWeight: '600',
              textDayFontSize: 16,
              textMonthFontSize: 18,
              textDayHeaderFontSize: 14,
            }}
            style={styles.calendar}
          />
        </View>

        {/* Selected Date Reminders */}
        <View style={styles.remindersContainer}>
          <Text style={styles.sectionTitle}>
            {selectedDate === new Date().toISOString().split('T')[0] 
              ? 'Hôm nay' 
              : `Ngày ${new Date(selectedDate).toLocaleDateString('vi-VN')}`}
          </Text>
          
          {selectedDateReminders.length === 0 ? (
            <View style={styles.emptyState}>
              <Icon name="event-available" size={48} color="#d1d5db" />
              <Text style={styles.emptyStateText}>Không có nhắc nhở nào</Text>
            </View>
          ) : (
            selectedDateReminders.map((reminder) => {
              const typeInfo = getReminderTypeInfo(reminder.type);
              return (
                <View key={reminder.id} style={styles.reminderCard}>
                  <View style={styles.reminderLeft}>
                    <View style={[styles.reminderIcon, { backgroundColor: `${typeInfo.color}20` }]}>
                      <Icon name={typeInfo.icon} size={20} color={typeInfo.color} />
                    </View>
                    <View style={styles.reminderInfo}>
                      <Text style={[
                        styles.reminderTitle,
                        reminder.completed && styles.completedText
                      ]}>
                        {reminder.title}
                      </Text>
                      <View style={styles.reminderMeta}>
                        <Icon name="access-time" size={14} color="#6b7280" />
                        <Text style={styles.reminderTime}>{reminder.time}</Text>
                        {reminder.recurring && (
                          <>
                            <Icon name="repeat" size={14} color="#6b7280" />
                            <Text style={styles.reminderRecurring}>Lặp lại</Text>
                          </>
                        )}
                      </View>
                    </View>
                  </View>
                  <View style={styles.reminderActions}>
                    <TouchableOpacity
                      style={[
                        styles.completeButton,
                        reminder.completed && styles.completeButtonActive
                      ]}
                      onPress={() => toggleReminderComplete(reminder.id)}
                    >
                      <Icon 
                        name={reminder.completed ? "check-circle" : "radio-button-unchecked"} 
                        size={24} 
                        color={reminder.completed ? "#10b981" : "#d1d5db"} 
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => deleteReminder(reminder.id)}
                    >
                      <Icon name="delete" size={20} color="#ef4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })
          )}
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Add Reminder Modal */}
      <Modal
        visible={showAddModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Thêm nhắc nhở</Text>
              <TouchableOpacity
                onPress={() => setShowAddModal(false)}
                style={styles.closeButton}
              >
                <Icon name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalForm}>
              <View style={styles.inputSection}>
                <Text style={styles.inputLabel}>Tiêu đề *</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Ví dụ: Uống thuốc huyết áp"
                  value={newReminder.title}
                  onChangeText={(text) => setNewReminder({...newReminder, title: text})}
                />
              </View>

              <View style={styles.inputSection}>
                <Text style={styles.inputLabel}>Thời gian *</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Ví dụ: 08:00"
                  value={newReminder.time}
                  onChangeText={(text) => setNewReminder({...newReminder, time: text})}
                />
              </View>

              <View style={styles.inputSection}>
                <Text style={styles.inputLabel}>Loại nhắc nhở</Text>
                <View style={styles.typeGrid}>
                  {reminderTypes.map((type) => (
                    <TouchableOpacity
                      key={type.value}
                      style={[
                        styles.typeOption,
                        newReminder.type === type.value && {
                          backgroundColor: `${type.color}20`,
                          borderColor: type.color,
                        },
                      ]}
                      onPress={() => setNewReminder({...newReminder, type: type.value as any})}
                    >
                      <Icon 
                        name={type.icon} 
                        size={20} 
                        color={newReminder.type === type.value ? type.color : '#6b7280'} 
                      />
                      <Text
                        style={[
                          styles.typeOptionText,
                          newReminder.type === type.value && { color: type.color },
                        ]}
                      >
                        {type.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleAddReminder}
              >
                <Text style={styles.submitButtonText}>Thêm nhắc nhở</Text>
              </TouchableOpacity>
            </View>
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
  summaryContainer: {
    backgroundColor: '#ffffff',
    marginHorizontal: 24,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e40af',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  calendarContainer: {
    backgroundColor: '#ffffff',
    marginHorizontal: 24,
    marginBottom: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  calendar: {
    borderRadius: 16,
  },
  remindersContainer: {
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  emptyState: {
    backgroundColor: '#ffffff',
    padding: 40,
    borderRadius: 16,
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
  emptyStateText: {
    fontSize: 16,
    color: '#9ca3af',
    marginTop: 12,
  },
  reminderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  reminderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  reminderIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  reminderInfo: {
    flex: 1,
  },
  reminderTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#9ca3af',
  },
  reminderMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  reminderTime: {
    fontSize: 12,
    color: '#6b7280',
    marginRight: 8,
  },
  reminderRecurring: {
    fontSize: 12,
    color: '#6b7280',
  },
  reminderActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  completeButton: {
    padding: 4,
  },
  completeButtonActive: {
    // Additional styling if needed
  },
  deleteButton: {
    padding: 4,
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
    maxHeight: '80%',
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
    padding: 24,
  },
  inputSection: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
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
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeOption: {
    flex: 1,
    minWidth: '47%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    backgroundColor: '#ffffff',
  },
  typeOptionText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
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