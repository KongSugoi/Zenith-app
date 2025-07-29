import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LineChart } from 'react-native-chart-kit';

interface User {
  name: string;
  email: string;
}

interface DashboardScreenProps {
  user: User;
}

export default function DashboardScreen({ user }: DashboardScreenProps) {
  const [refreshing, setRefreshing] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const screenWidth = Dimensions.get('window').width;

  // Mock health data
  const [healthStats, setHealthStats] = useState({
    heartRate: 72,
    bloodPressure: { systolic: 120, diastolic: 80 },
    temperature: 36.5,
    steps: 3247,
    sleep: 7.5,
  });

  const [todayReminders] = useState([
    { id: 1, title: 'Uống thuốc huyết áp', time: '08:00' },
    { id: 2, title: 'Khám bác sĩ Tim mạch', time: '14:30' },
    { id: 3, title: 'Tập thể dục nhẹ', time: '17:00' },
  ]);

  // Heart rate chart data
  const heartRateData = {
    labels: ['6h', '9h', '12h', '15h', '18h', '21h'],
    datasets: [
      {
        data: [68, 72, 75, 70, 74, 69],
        color: (opacity = 1) => `rgba(239, 68, 68, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate data refresh
    setTimeout(() => {
      setHealthStats({
        ...healthStats,
        heartRate: Math.floor(Math.random() * 20) + 65,
        steps: Math.floor(Math.random() * 2000) + 2000,
      });
      setRefreshing(false);
    }, 1000);
  }, [healthStats]);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Chào buổi sáng';
    if (hour < 18) return 'Chào buổi chiều';
    return 'Chào buổi tối';
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>
              {getGreeting()}, {user.name}!
            </Text>
            <Text style={styles.date}>{formatDate(currentTime)}</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Icon name="notifications" size={24} color="#1e40af" />
          </TouchableOpacity>
        </View>

        {/* Quick Health Stats */}
        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>Chỉ số sức khỏe hôm nay</Text>
          <View style={styles.statsGrid}>
            <View style={[styles.statCard, { borderLeftColor: '#ef4444' }]}>
              <Icon name="favorite" size={24} color="#ef4444" />
              <Text style={styles.statValue}>{healthStats.heartRate}</Text>
              <Text style={styles.statLabel}>Nhịp tim</Text>
              <Text style={styles.statUnit}>BPM</Text>
            </View>

            <View style={[styles.statCard, { borderLeftColor: '#3b82f6' }]}>
              <Icon name="thermostat" size={24} color="#3b82f6" />
              <Text style={styles.statValue}>{healthStats.temperature}</Text>
              <Text style={styles.statLabel}>Nhiệt độ</Text>
              <Text style={styles.statUnit}>°C</Text>
            </View>

            <View style={[styles.statCard, { borderLeftColor: '#10b981' }]}>
              <Icon name="directions-walk" size={24} color="#10b981" />
              <Text style={styles.statValue}>{healthStats.steps.toLocaleString()}</Text>
              <Text style={styles.statLabel}>Bước chân</Text>
              <Text style={styles.statUnit}>bước</Text>
            </View>

            <View style={[styles.statCard, { borderLeftColor: '#8b5cf6' }]}>
              <Icon name="bedtime" size={24} color="#8b5cf6" />
              <Text style={styles.statValue}>{healthStats.sleep}</Text>
              <Text style={styles.statLabel}>Giấc ngủ</Text>
              <Text style={styles.statUnit}>giờ</Text>
            </View>
          </View>
        </View>

        {/* Heart Rate Chart */}
        <View style={styles.chartContainer}>
          <Text style={styles.sectionTitle}>Nhịp tim trong ngày</Text>
          <LineChart
            data={heartRateData}
            width={screenWidth - 48}
            height={200}
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(239, 68, 68, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: '4',
                strokeWidth: '2',
                stroke: '#ef4444',
              },
            }}
            bezier
            style={styles.chart}
          />
        </View>

        {/* Today's Reminders */}
        <View style={styles.remindersContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Lịch hôm nay</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllButton}>Xem tất cả</Text>
            </TouchableOpacity>
          </View>
          {todayReminders.map((reminder) => (
            <View key={reminder.id} style={styles.reminderCard}>
              <View style={styles.reminderTime}>
                <Icon name="access-time" size={16} color="#6b7280" />
                <Text style={styles.reminderTimeText}>{reminder.time}</Text>
              </View>
              <Text style={styles.reminderTitle}>{reminder.title}</Text>
              <TouchableOpacity style={styles.reminderButton}>
                <Icon name="check" size={16} color="#10b981" />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsContainer}>
          <Text style={styles.sectionTitle}>Thao tác nhanh</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity style={styles.actionCard}>
              <Icon name="favorite" size={32} color="#ef4444" />
              <Text style={styles.actionLabel}>Đo nhịp tim</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard}>
              <Icon name="chat" size={32} color="#3b82f6" />
              <Text style={styles.actionLabel}>Hỏi AI</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard}>
              <Icon name="edit" size={32} color="#f59e0b" />
              <Text style={styles.actionLabel}>Ghi nhật ký</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard}>
              <Icon name="add-alarm" size={32} color="#10b981" />
              <Text style={styles.actionLabel}>Đặt nhắc nhở</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Bottom spacing */}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    paddingBottom: 16,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
  },
  date: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#dbeafe',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllButton: {
    fontSize: 14,
    color: '#1e40af',
    fontWeight: '500',
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
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  statUnit: {
    fontSize: 10,
    color: '#9ca3af',
  },
  chartContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  chart: {
    borderRadius: 16,
  },
  remindersContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  reminderCard: {
    flexDirection: 'row',
    alignItems: 'center',
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
  reminderTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginRight: 12,
  },
  reminderTimeText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  reminderTitle: {
    flex: 1,
    fontSize: 14,
    color: '#1f2937',
    fontWeight: '500',
  },
  reminderButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#dcfce7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionsContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  actionLabel: {
    fontSize: 14,
    color: '#1f2937',
    fontWeight: '500',
    marginTop: 8,
  },
  bottomSpacing: {
    height: 20,
  },
});