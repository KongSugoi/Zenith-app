import 'react-native-url-polyfill/auto';
import 'text-encoding-polyfill';

import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { 
  SafeAreaProvider, 
  SafeAreaView,
  useSafeAreaInsets 
} from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  StatusBar, 
  StyleSheet, 
  Platform,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Import screens
import AuthScreen from './screens/AuthScreen';
import DashboardScreen from './screens/DashboardScreen';
import HealthDataScreen from './screens/HealthDataScreen';
import AIContactsScreen from './screens/AIContactsScreen';
import AIChatScreen from './screens/AIChatScreen';
import HealthJournalScreen from './screens/HealthJournalScreen';
import SmartCalendarScreen from './screens/SmartCalendarScreen';
import UserProfileScreen from './screens/UserProfileScreen';

// Types
interface User {
  name: string;
  email: string;
}

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Stack Navigator for AI Chat flow
function AIChatStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#1e40af',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      <Stack.Screen 
        name="AIContacts" 
        component={AIContactsScreen}
        options={{ title: 'Trợ lý AI' }}
      />
      <Stack.Screen 
        name="AIChat" 
        component={AIChatScreen}
        options={({ route }) => ({ 
          title: route.params?.contactName || 'Trò chuyện'
        })}
      />
    </Stack.Navigator>
  );
}

// Main Tab Navigator
function TabNavigator({ user, onLogout }: { user: User; onLogout: () => void }) {
  const insets = useSafeAreaInsets();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = '';

          switch (route.name) {
            case 'Dashboard':
              iconName = 'dashboard';
              break;
            case 'HealthData':
              iconName = 'favorite';
              break;
            case 'AIChat':
              iconName = 'chat';
              break;
            case 'Journal':
              iconName = 'book';
              break;
            case 'Calendar':
              iconName = 'event';
              break;
            case 'Profile':
              iconName = 'person';
              break;
            default:
              iconName = 'circle';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#e5e7eb',
          paddingBottom: insets.bottom > 0 ? insets.bottom - 10 : 10,
          paddingTop: 10,
          height: 70 + (insets.bottom > 0 ? insets.bottom - 10 : 0),
        },
        tabBarActiveTintColor: '#1e40af',
        tabBarInactiveTintColor: '#6b7280',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginTop: 4,
        },
        headerStyle: {
          backgroundColor: '#1e40af',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: '600',
        },
      })}
    >
      <Tab.Screen 
        name="Dashboard" 
        options={{ title: 'Tổng quan' }}
      >
        {() => <DashboardScreen user={user} />}
      </Tab.Screen>
      
      <Tab.Screen 
        name="HealthData" 
        component={HealthDataScreen}
        options={{ title: 'Sức khỏe' }}
      />
      
      <Tab.Screen 
        name="AIChat" 
        component={AIChatStack}
        options={{ 
          title: 'AI Chat',
          headerShown: false
        }}
      />
      
      <Tab.Screen 
        name="Journal" 
        component={HealthJournalScreen}
        options={{ title: 'Nhật ký' }}
      />
      
      <Tab.Screen 
        name="Calendar" 
        component={SmartCalendarScreen}
        options={{ title: 'Lịch' }}
      />
      
      <Tab.Screen 
        name="Profile" 
        options={{ title: 'Hồ sơ' }}
      >
        {() => <UserProfileScreen user={user} onLogout={onLogout} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user data on app start
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (email: string, password: string) => {
    // Mock authentication - in real app, this would call an API
    if (email && password) {
      const mockUser = {
        name: email
          .split("@")[0]
          .replace(/[0-9]/g, "")
          .replace(/\./g, " "),
        email: email,
      };
      
      setUser(mockUser);
      
      // Save user data
      try {
        await AsyncStorage.setItem('userData', JSON.stringify(mockUser));
      } catch (error) {
        console.error('Error saving user data:', error);
      }
      
      Alert.alert(
        'Thành công',
        `Chào mừng ${mockUser.name}! Đăng nhập thành công.`
      );
    } else {
      Alert.alert(
        'Lỗi',
        'Vui lòng kiểm tra lại email và mật khẩu'
      );
    }
  };

  const handleRegister = async (
    email: string,
    password: string,
    name: string,
  ) => {
    // Mock registration - in real app, this would call an API
    if (email && password && name) {
      const newUser = { name, email };
      setUser(newUser);
      
      // Save user data
      try {
        await AsyncStorage.setItem('userData', JSON.stringify(newUser));
      } catch (error) {
        console.error('Error saving user data:', error);
      }
      
      Alert.alert(
        'Thành công',
        `Chào mừng ${name}! Tài khoản đã được tạo thành công.`
      );
    } else {
      Alert.alert(
        'Lỗi',
        'Vui lòng điền đầy đủ thông tin'
      );
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Đăng xuất',
      'Bạn có chắc muốn đăng xuất?',
      [
        {
          text: 'Hủy',
          style: 'cancel',
        },
        {
          text: 'Đăng xuất',
          onPress: async () => {
            setUser(null);
            try {
              await AsyncStorage.removeItem('userData');
            } catch (error) {
              console.error('Error removing user data:', error);
            }
            Alert.alert('Thông báo', 'Đã đăng xuất thành công');
          },
        },
      ]
    );
  };

  if (isLoading) {
    return null; // You can add a loading screen here
  }

  return (
    <SafeAreaProvider>
      <StatusBar 
        barStyle={Platform.OS === 'ios' ? 'light-content' : 'light-content'}
        backgroundColor="#1e40af"
      />
      <NavigationContainer>
        {!user ? (
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Auth">
              {() => (
                <AuthScreen
                  onLogin={handleLogin}
                  onRegister={handleRegister}
                />
              )}
            </Stack.Screen>
          </Stack.Navigator>
        ) : (
          <TabNavigator user={user} onLogout={handleLogout} />
        )}
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
});