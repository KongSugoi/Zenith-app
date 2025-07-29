import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';

export default function HealthDataScreen() {
  const [selectedTab, setSelectedTab] = useState('heart');
  const screenWidth = Dimensions.get('window').width;

  // Mock data
  const [heartRateData] = useState({
    labels: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
    datasets: [
      {
        data: [68, 72, 75, 70, 74, 69, 71],
        color: (opacity = 1) => `rgba(239, 68, 68, ${opacity})`,
        strokeWidth: 3,
      },
    ],
  });

  const [bloodPressureData] = useState({
    labels: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
    datasets: [
      {
        data: [120, 118, 122, 119, 121, 117, 120],
        color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
        strokeWidth: 3,
      },
      {
        data: [80, 78, 82, 79, 81, 77, 80],
        color: (opacity = 1) => `rgba(168, 85, 247, ${opacity})`,
        strokeWidth: 3,
      },
    ],
  });

  const [stepsData] = useState({
    labels: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
    datasets: [
      {
        data: [3200, 4100, 2800, 3500, 4200, 3800, 2900],
      },
    ],
  });

  const [sleepData] = useState([
    {
      name: 'Ngủ sâu',
      population: 4.5,
      color: '#1e40af',
      legendFontColor: '#374151',
      legendFontSize: 14,
    },
    {
      name: 'Ngủ nhẹ',
      population: 2.8,
      color: '#3b82f6',
      legendFontColor: '#374151',
      legendFontSize: 14,
    },
    {
      name: 'REM',
      population: 1.2,
      color: '#60a5fa',
      legendFontColor: '#374151',
      legendFontSize: 14,
    },
  ]);

  const tabs = [
    { id: 'heart', label: 'Nhịp tim', icon: 'favorite' },
    { id: 'pressure', label: 'Huyết áp', icon: 'monitor-heart' },
    { id: 'steps', label: 'Bước chân', icon: 'directions-walk' },
    { id: 'sleep', label: 'Giấc ngủ', icon: 'bedtime' },
  ];

  const handleMeasureHeartRate = () => {
    Alert.alert(
      'Đo nhịp tim',
      'Đặt ngón tay lên camera và giữ yên trong 30 giây.',
      [
        { text: 'Hủy', style: 'cancel' },
        { text: 'Bắt đầu', onPress: () => Alert.alert('Đang đo...', 'Vui lòng giữ yên') },
      ]
    );
  };

  const renderChart = () => {
    const chartConfig = {
      backgroundColor: '#ffffff',
      backgroundGradientFrom: '#ffffff',
      backgroundGradientTo: '#ffffff',
      decimalPlaces: 0,
      color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
      labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
      style: {
        borderRadius: 16,
      },
      propsForDots: {
        r: '4',
        strokeWidth: '2',
      },
    };

    switch (selectedTab) {
      case 'heart':
        return (
          <LineChart
            data={heartRateData}
            width={screenWidth - 48}
            height={220}
            chartConfig={{
              ...chartConfig,
              color: (opacity = 1) => `rgba(239, 68, 68, ${opacity})`,
            }}
            bezier
            style={styles.chart}
          />
        );
      case 'pressure':
        return (
          <LineChart
            data={bloodPressureData}
            width={screenWidth - 48}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        );
      case 'steps':
        return (
          <BarChart
            data={stepsData}
            width={screenWidth - 48}
            height={220}
            chartConfig={{
              ...chartConfig,
              color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
            }}
            style={styles.chart}
          />
        );
      case 'sleep':
        return (
          <PieChart
            data={sleepData}
            width={screenWidth - 48}
            height={220}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            style={styles.chart}
          />
        );
      default:
        return null;
    }
  };

  const getTabColor = (tabId: string) => {
    switch (tabId) {
      case 'heart': return '#ef4444';
      case 'pressure': return '#3b82f6';
      case 'steps': return '#10b981';
      case 'sleep': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  const getCurrentStats = () => {
    switch (selectedTab) {
      case 'heart':
        return {
          current: '72 BPM',
          status: 'Bình thường',
          trend: '+2% so với hôm qua',
          color: '#ef4444',
        };
      case 'pressure':
        return {
          current: '120/80 mmHg',
          status: 'Tốt',
          trend: 'Ổn định',
          color: '#3b82f6',
        };
      case 'steps':
        return {
          current: '3,247 bước',
          status: 'Tốt',
          trend: '+15% so với hôm qua',
          color: '#10b981',
        };
      case 'sleep':
        return {
          current: '7.5 giờ',
          status: 'Đủ giấc',
          trend: 'Chất lượng tốt',
          color: '#8b5cf6',
        };
      default:
        return null;
    }
  };

  const stats = getCurrentStats();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Current Stats Card */}
        {stats && (
          <View style={[styles.currentStatsCard, { borderTopColor: stats.color }]}>
            <View style={styles.statsHeader}>
              <Text style={styles.currentValue}>{stats.current}</Text>
              <View style={[styles.statusBadge, { backgroundColor: `${stats.color}20` }]}>
                <Text style={[styles.statusText, { color: stats.color }]}>
                  {stats.status}
                </Text>
              </View>
            </View>
            <Text style={styles.trendText}>{stats.trend}</Text>
          </View>
        )}

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabScrollContent}
          >
            {tabs.map((tab) => (
              <TouchableOpacity
                key={tab.id}
                style={[
                  styles.tab,
                  selectedTab === tab.id && {
                    backgroundColor: `${getTabColor(tab.id)}20`,
                    borderColor: getTabColor(tab.id),
                  },
                ]}
                onPress={() => setSelectedTab(tab.id)}
              >
                <Icon
                  name={tab.icon}
                  size={20}
                  color={selectedTab === tab.id ? getTabColor(tab.id) : '#6b7280'}
                />
                <Text style={[
                  styles.tabText,
                  selectedTab === tab.id && { color: getTabColor(tab.id) },
                ]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Chart */}
        <View style={styles.chartContainer}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>
              Biểu đồ 7 ngày qua
            </Text>
            <TouchableOpacity style={styles.exportButton}>
              <Icon name="download" size={16} color="#1e40af" />
              <Text style={styles.exportText}>Xuất</Text>
            </TouchableOpacity>
          </View>
          {renderChart()}
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsContainer}>
          <Text style={styles.sectionTitle}>Thao tác nhanh</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={handleMeasureHeartRate}
            >
              <Icon name="favorite" size={24} color="#ef4444" />
              <Text style={styles.actionLabel}>Đo nhịp tim</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard}>
              <Icon name="add" size={24} color="#3b82f6" />
              <Text style={styles.actionLabel}>Thêm dữ liệu</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard}>
              <Icon name="history" size={24} color="#10b981" />
              <Text style={styles.actionLabel}>Lịch sử</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard}>
              <Icon name="share" size={24} color="#f59e0b" />
              <Text style={styles.actionLabel}>Chia sẻ</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Measurements */}
        <View style={styles.recentContainer}>
          <Text style={styles.sectionTitle}>Đo gần đây</Text>
          {[
            { time: '10:30', value: '72 BPM', type: 'Nhịp tim', icon: 'favorite', color: '#ef4444' },
            { time: '09:15', value: '120/80', type: 'Huyết áp', icon: 'monitor-heart', color: '#3b82f6' },
            { time: '08:00', value: '36.5°C', type: 'Nhiệt độ', icon: 'thermostat', color: '#10b981' },
          ].map((item, index) => (
            <View key={index} style={styles.recentItem}>
              <View style={[styles.recentIcon, { backgroundColor: `${item.color}20` }]}>
                <Icon name={item.icon} size={20} color={item.color} />
              </View>
              <View style={styles.recentInfo}>
                <Text style={styles.recentType}>{item.type}</Text>
                <Text style={styles.recentTime}>{item.time}</Text>
              </View>
              <Text style={styles.recentValue}>{item.value}</Text>
            </View>
          ))}
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
  currentStatsCard: {
    backgroundColor: '#ffffff',
    margin: 24,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
    borderTopWidth: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  currentValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1f2937',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  trendText: {
    fontSize: 14,
    color: '#6b7280',
  },
  tabContainer: {
    marginBottom: 16,
  },
  tabScrollContent: {
    paddingHorizontal: 24,
    gap: 12,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#ffffff',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  chartContainer: {
    backgroundColor: '#ffffff',
    marginHorizontal: 24,
    marginBottom: 24,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  exportText: {
    fontSize: 14,
    color: '#1e40af',
    fontWeight: '500',
  },
  chart: {
    borderRadius: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
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
    padding: 16,
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
  recentContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  recentItem: {
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
  recentIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  recentInfo: {
    flex: 1,
  },
  recentType: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
  },
  recentTime: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  recentValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  bottomSpacing: {
    height: 20,
  },
});