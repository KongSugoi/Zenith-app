import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

interface AIContact {
  id: string;
  name: string;
  role: string;
  avatar: string;
  description: string;
  status: 'online' | 'offline';
  specialty?: string;
  lastActive?: string;
  isCustom?: boolean;
}

export default function AIContactsScreen() {
  const navigation = useNavigation();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newContactName, setNewContactName] = useState('');
  const [newContactRole, setNewContactRole] = useState('');

  const [contacts, setContacts] = useState<AIContact[]>([
    {
      id: '1',
      name: 'Bác sĩ Minh',
      role: 'Bác sĩ tim mạch',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=doctor',
      description: 'Chuyên khoa tim mạch, có thể tư vấn về huyết áp, nhịp tim',
      status: 'online',
      specialty: 'Tim mạch',
      lastActive: 'Đang hoạt động',
    },
    {
      id: '2',
      name: 'Cô An',
      role: 'Y tá',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=nurse',
      description: 'Y tá chăm sóc, hỗ trợ theo dõi sức khỏe hàng ngày',
      status: 'online',
      specialty: 'Chăm sóc tổng quát',
      lastActive: 'Đang hoạt động',
    },
    {
      id: '3',
      name: 'Anh Hùng',
      role: 'Con trai',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=son',
      description: 'Con trai yêu thương, luôn quan tâm đến sức khỏe của bạn',
      status: 'online',
      lastActive: '5 phút trước',
      isCustom: true,
    },
    {
      id: '4',
      name: 'Chị Mai',
      role: 'Con gái',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=daughter',
      description: 'Con gái chu đáo, thường xuyên nhắc nhở chăm sóc sức khỏe',
      status: 'offline',
      lastActive: '2 giờ trước',
      isCustom: true,
    },
    {
      id: '5',
      name: 'Thầy Tuấn',
      role: 'Huấn luyện viên',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=trainer',
      description: 'Huấn luyện viên thể dục, hướng dẫn bài tập phù hợp',
      status: 'online',
      specialty: 'Thể dục điều trị',
      lastActive: 'Đang hoạt động',
    },
  ]);

  const handleContactPress = (contact: AIContact) => {
    navigation.navigate('AIChat', {
      contactId: contact.id,
      contactName: contact.name,
      contactRole: contact.role,
      contactAvatar: contact.avatar,
    });
  };

  const handleAddContact = () => {
    if (!newContactName.trim() || !newContactRole.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin');
      return;
    }

    const newContact: AIContact = {
      id: Date.now().toString(),
      name: newContactName.trim(),
      role: newContactRole.trim(),
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newContactName}`,
      description: `AI trợ lý ${newContactRole.toLowerCase()}`,
      status: 'online',
      lastActive: 'Mới tạo',
      isCustom: true,
    };

    setContacts([...contacts, newContact]);
    setNewContactName('');
    setNewContactRole('');
    setShowAddModal(false);
    Alert.alert('Thành công', 'Đã thêm liên hệ AI mới');
  };

  const handleDeleteContact = (contactId: string) => {
    const contact = contacts.find(c => c.id === contactId);
    if (!contact?.isCustom) {
      Alert.alert('Thông báo', 'Không thể xóa liên hệ hệ thống');
      return;
    }

    Alert.alert(
      'Xác nhận',
      'Bạn có chắc muốn xóa liên hệ này?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: () => {
            setContacts(contacts.filter(c => c.id !== contactId));
          },
        },
      ]
    );
  };

  const systemContacts = contacts.filter(c => !c.isCustom);
  const customContacts = contacts.filter(c => c.isCustom);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Trợ lý AI</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowAddModal(true)}
          >
            <Icon name="add" size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>

        {/* System Contacts */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trợ lý chuyên nghiệp</Text>
          {systemContacts.map((contact) => (
            <TouchableOpacity
              key={contact.id}
              style={styles.contactCard}
              onPress={() => handleContactPress(contact)}
            >
              <View style={styles.contactInfo}>
                <View style={styles.avatarContainer}>
                  <Image source={{ uri: contact.avatar }} style={styles.avatar} />
                  <View style={[
                    styles.statusDot,
                    { backgroundColor: contact.status === 'online' ? '#10b981' : '#6b7280' }
                  ]} />
                </View>
                <View style={styles.contactDetails}>
                  <View style={styles.contactHeader}>
                    <Text style={styles.contactName}>{contact.name}</Text>
                    <Text style={styles.contactRole}>{contact.role}</Text>
                  </View>
                  <Text style={styles.contactDescription}>{contact.description}</Text>
                  {contact.specialty && (
                    <View style={styles.specialtyBadge}>
                      <Text style={styles.specialtyText}>{contact.specialty}</Text>
                    </View>
                  )}
                  <Text style={styles.lastActive}>{contact.lastActive}</Text>
                </View>
              </View>
              <Icon name="chevron-right" size={24} color="#6b7280" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Custom Contacts */}
        {customContacts.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Gia đình & Bạn bè</Text>
            {customContacts.map((contact) => (
              <TouchableOpacity
                key={contact.id}
                style={styles.contactCard}
                onPress={() => handleContactPress(contact)}
              >
                <View style={styles.contactInfo}>
                  <View style={styles.avatarContainer}>
                    <Image source={{ uri: contact.avatar }} style={styles.avatar} />
                    <View style={[
                      styles.statusDot,
                      { backgroundColor: contact.status === 'online' ? '#10b981' : '#6b7280' }
                    ]} />
                  </View>
                  <View style={styles.contactDetails}>
                    <View style={styles.contactHeader}>
                      <Text style={styles.contactName}>{contact.name}</Text>
                      <Text style={styles.contactRole}>{contact.role}</Text>
                    </View>
                    <Text style={styles.contactDescription}>{contact.description}</Text>
                    <Text style={styles.lastActive}>{contact.lastActive}</Text>
                  </View>
                </View>
                <View style={styles.contactActions}>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeleteContact(contact.id)}
                  >
                    <Icon name="delete" size={20} color="#ef4444" />
                  </TouchableOpacity>
                  <Icon name="chevron-right" size={24} color="#6b7280" />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thao tác nhanh</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.quickActionCard}>
              <Icon name="mic" size={32} color="#3b82f6" />
              <Text style={styles.quickActionLabel}>Trò chuyện bằng giọng nói</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickActionCard}>
              <Icon name="help" size={32} color="#10b981" />
              <Text style={styles.quickActionLabel}>Hỏi đáp sức khỏe</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Add Contact Modal */}
      <Modal
        visible={showAddModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Thêm liên hệ AI</Text>
              <TouchableOpacity
                onPress={() => setShowAddModal(false)}
                style={styles.closeButton}
              >
                <Icon name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalForm}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Tên</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Ví dụ: Bà Lan"
                  value={newContactName}
                  onChangeText={setNewContactName}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Vai trò</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Ví dụ: Vợ, Mẹ, Bạn thân"
                  value={newContactRole}
                  onChangeText={setNewContactRole}
                />
              </View>

              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleAddContact}
              >
                <Text style={styles.submitButtonText}>Thêm liên hệ</Text>
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
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  contactCard: {
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
  contactInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#e5e7eb',
  },
  statusDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  contactDetails: {
    flex: 1,
  },
  contactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  contactRole: {
    fontSize: 12,
    color: '#6b7280',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  contactDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  specialtyBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#dbeafe',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginBottom: 4,
  },
  specialtyText: {
    fontSize: 12,
    color: '#1e40af',
    fontWeight: '500',
  },
  lastActive: {
    fontSize: 12,
    color: '#9ca3af',
  },
  contactActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  deleteButton: {
    padding: 8,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
  },
  quickActionCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 20,
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
  quickActionLabel: {
    fontSize: 14,
    color: '#1f2937',
    fontWeight: '500',
    marginTop: 8,
    textAlign: 'center',
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
    padding: 24,
    minHeight: 300,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
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
    gap: 16,
  },
  inputContainer: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  textInput: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  submitButton: {
    backgroundColor: '#1e40af',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});