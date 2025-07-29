import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface User {
  name: string;
  email: string;
}

interface UserProfileScreenProps {
  user: User;
  onLogout: () => void;
}

export default function UserProfileScreen({ user, onLogout }: UserProfileScreenProps) {
  const [preferences, setPreferences] = useState({
    notifications: true,
    voiceReminders: true,
    dataSharing: false,
    weeklyReports: true,
  });

  const profileStats = [
    { label: 'Số lần đo tim', value: '247', icon: 'favorite', color: '#ef4444' },
    { label: 'Cuộc trò chuyện AI', value: '89', icon: 'chat', color: '#3b82f6' },
    { label: 'Ngày sử dụng', value: '45', icon: 'event', color: '#f59e0b' },
    { label: 'Điểm sức khỏe', value: '8.5/10', icon: 'trending-up', color: '#10b981' },
  ];

  const menuItems = [
    {
      icon: 'person',
      title: 'Thông tin cá nhân',
      subtitle: 'Chỉnh sửa hồ sơ và thông tin liên hệ',
      onPress: () => Alert.alert('Thông báo', 'Tính năng đang phát triển'),
    },
    {
      icon: 'medical-services',
      title: 'Thông tin y tế',
      subtitle: 'Tiền sử bệnh, thuốc men, dị ứng',
      onPress: () => Alert.alert('Thông báo', 'Tính năng đang phát triển'),
    },
    {
      icon: 'family-restroom',
      title: 'Liên hệ khẩn cấp',
      subtitle: 'Quản lý danh sách liên hệ khẩn cấp',
      onPress: () => Alert.alert('Thông báo', 'Tính năng đang phát triển'),
    },
    {
      icon: 'download',
      title: 'Xuất dữ liệu',
      subtitle: 'Tải xuống báo cáo sức khỏe',
      onPress: () => Alert.alert('Thông báo', 'Đang xuất dữ liệu...'),
    },
    {
      icon: 'backup',
      title: 'Sao lưu dữ liệu',
      subtitle: 'Lưu trữ dữ liệu an toàn',
      onPress: () => Alert.alert('Thông báo', 'Đang sao lưu...'),
    },
    {
      icon: 'help',
      title: 'Trợ giúp & Hỗ trợ',
      subtitle: 'Hướng dẫn sử dụng và liên hệ hỗ trợ',
      onPress: () => Alert.alert('Hỗ trợ', 'Liên hệ: support@healthapp.com'),
    },
    {
      icon: 'info',
      title: 'Về ứng dụng',
      subtitle: 'Phiên bản 1.0.0',
      onPress: () => Alert.alert('Về ứng dụng', 'Ứng dụng Sức khỏe v1.0.0\nDành cho người cao tuổi'),
    },
  ];

  const handleLogout = () => {
    Alert.alert(
      'Đăng xuất',
      'Bạn có chắc muốn đăng xuất?',
      [
        { text: 'Hủy', style: 'cancel' },
        { text: 'Đăng xuất', style: 'destructive', onPress: onLogout },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}` }}
              style={styles.avatar}
            />
            <View style={styles.statusDot} />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user.name}</Text>
            <Text style={styles.profileEmail}>{user.email}</Text>
            <View style={styles.badges}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>Người cao tuổi</Text>
              </View>
              <View style={[styles.badge, styles.verifiedBadge]}>
                <Icon name="verified" size={12} color="#10b981" />
                <Text style={[styles.badgeText, { color: '#10b981' }]}>Đã xác thực</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Profile Stats */}
        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>Thống kê</Text>
          <View style={styles.statsGrid}>
            {profileStats.map((stat, index) => (
              <View key={index} style={styles.statCard}>
                <View style={[styles.statIcon, { backgroundColor: `${stat.color}20` }]}>
                  <Icon name={stat.icon} size={20} color={stat.color} />
                </View>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Settings */}
        <View style={styles.settingsContainer}>
          <Text style={styles.sectionTitle}>Cài đặt</Text>
          
          <View style={styles.settingCard}>
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Thông báo push</Text>
                <Text style={styles.settingSubtitle}>Nhận thông báo nhắc nhở và cập nhật</Text>
              </View>
              <Switch
                value={preferences.notifications}
                onValueChange={(value) => 
                  setPreferences({ ...preferences, notifications: value })
                }
                trackColor={{ false: '#d1d5db', true: '#3b82f6' }}
                thumbColor={preferences.notifications ? '#ffffff' : '#ffffff'}
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Nhắc nhở bằng giọng nói</Text>
                <Text style={styles.settingSubtitle}>Phát âm thanh các thông báo quan trọng</Text>
              </View>
              <Switch
                value={preferences.voiceReminders}
                onValueChange={(value) => 
                  setPreferences({ ...preferences, voiceReminders: value })
                }
                trackColor={{ false: '#d1d5db', true: '#3b82f6' }}
                thumbColor={preferences.voiceReminders ? '#ffffff' : '#ffffff'}
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Chia sẻ dữ liệu</Text>
                <Text style={styles.settingSubtitle}>Chia sẻ dữ liệu với bác sĩ và gia đình</Text>
              </View>
              <Switch
                value={preferences.dataSharing}
                onValueChange={(value) => 
                  setPreferences({ ...preferences, dataSharing: value })
                }
                trackColor={{ false: '#d1d5db', true: '#3b82f6' }}
                thumbColor={preferences.dataSharing ? '#ffffff' : '#ffffff'}
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Báo cáo hàng tuần</Text>
                <Text style={styles.settingSubtitle}>Nhận báo cáo tổng hợp sức khỏe mỗi tuần</Text>
              </View>
              <Switch
                value={preferences.weeklyReports}
                onValueChange={(value) => 
                  setPreferences({ ...preferences, weeklyReports: value })
                }
                trackColor={{ false: '#d1d5db', true: '#3b82f6' }}
                thumbColor={preferences.weeklyReports ? '#ffffff' : '#ffffff'}
              />
            </View>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          <Text style={styles.sectionTitle}>Quản lý</Text>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={item.onPress}
            >
              <View style={styles.menuItemLeft}>
                <View style={styles.menuIcon}>
                  <Icon name={item.icon} size={24} color="#6b7280" />
                </View>
                <View style={styles.menuInfo}>
                  <Text style={styles.menuTitle}>{item.title}</Text>
                  <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                </View>
              </View>
              <Icon name="chevron-right" size={24} color="#d1d5db" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <View style={styles.logoutContainer}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Icon name="logout" size={20} color="#ef4444" />
            <Text style={styles.logoutText}>Đăng xuất</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
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
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    margin: 24,
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
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#e5e7eb',
  },
  statusDot: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#10b981',
    borderWidth: 3,
    borderColor: '#ffffff',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 12,
  },
  badges: {
    flexDirection: 'row',
    gap: 8,
  },
  badge: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  verifiedBadge: {
    backgroundColor: '#f0fdf4',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  badgeText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  statsContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '47%',
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
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  settingsContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  settingCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  menuContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuInfo: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  logoutContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fecaca',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ef4444',
  },
  bottomSpacing: {
    height: 20,
  },
});