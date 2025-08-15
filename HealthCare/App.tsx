"use client";

import { useState } from "react";
import { AuthForm } from "./components/AuthForm";
import { UserProfile } from "./components/UserProfile";
import { AIChat } from "./components/AIChat";
import { SmartCalendar } from "./components/SmartCalendar";
import { HealthData } from "./components/HealthData";
import { HealthJournal } from "./components/HealthJournal";
import { HeartRateMonitor } from "./components/HeartRateMonitor";
import { NotificationManager } from "./components/NotificationManager";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";
// import { Preferences } from "@capacitor/preferences"; 
// import axios from 'axios';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}
interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  date: Date;
  time: string;
  type: 'medication' | 'appointment' | 'exercise' | 'other';
  completed?: boolean;
  snoozedUntil?: Date;
}

interface HeartRateReading {
  id: string;
  timestamp: Date;
  rate: number;
  source: 'manual' | 'device' | 'auto';
}

interface HealthAlert {
  id: string;
  type: 'heart_rate_high' | 'heart_rate_low' | 'calendar_event';
  title: string;
  description: string;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high';
  acknowledged?: boolean;
}

type Page = 'ai-chat' | 'profile' | 'calendar' | 'health-data' | 'health-journal' | 'heart-rate' | 'settings';

export default function App() {

  // const SYNTHESIZE_API = import.meta.env.VITE_SYNTHESIZE_URL;

  const [user, setUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState<Page>('ai-chat');

  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(() => {
    // Initialize with some default events for testing
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    
    return [
      {
        id: 'default-1',
        title: 'Uống thuốc huyết áp',
        description: 'Losartan 50mg - 1 viên',
        date: now,
        time: '08:00',
        type: 'medication'
      },
      {
        id: 'default-2',
        title: 'Tập thể dục buổi chiều',
        description: 'Đi bộ 30 phút trong công viên',
        date: now,
        time: '16:00',
        type: 'exercise'
      },
      {
        id: 'default-3',
        title: 'Khám định kỳ tim mạch',
        description: 'Bác sĩ Nguyễn Văn C - Bệnh viện Tim Mạch',
        date: tomorrow,
        time: '14:00',
        type: 'appointment'
      },
      {
        id: 'default-4',
        title: 'Uống thuốc tiểu đường',
        description: 'Metformin 500mg - 2 viên',
        date: now,
        time: '19:00',
        type: 'medication'
      }
    ];
  });

  const [heartRateReadings, setHeartRateReadings] = useState<HeartRateReading[]>(() => {
    // Initialize with some sample readings
    const now = new Date();
    return [
      {
        id: 'hr-1',
        timestamp: new Date(now.getTime() - 30 * 60 * 1000), // 30 min ago
        rate: 72,
        source: 'device'
      },
      {
        id: 'hr-2', 
        timestamp: new Date(now.getTime() - 60 * 60 * 1000), // 1 hour ago
        rate: 68,
        source: 'device'
      },
      {
        id: 'hr-3',
        timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2 hours ago
        rate: 75,
        source: 'device'
      }
    ];
  });

  // Health alerts state
  const [healthAlerts, setHealthAlerts] = useState<HealthAlert[]>([]);

  const handleLogin = (email: string, password: string) => {
    // Mock authentication - in real app, this would call an API
    if (email && password) {
      const mockUser = {
        id: "1",
        name: email
          .split("@")[0]
          .replace(/[0-9]/g, "")
          .replace(/\./g, " "),
        email: email,
      };
      setUser(mockUser);
      setCurrentPage('ai-chat');
      toast.success(
        `Chào mừng ${mockUser.name}! Đăng nhập thành công.`,
      );
    } else {
      toast.error("Vui lòng kiểm tra lại email và mật khẩu");
    }
  };

  const handleRegister = (
    email: string,
    password: string,
    name: string,
  ) => {
    // Mock registration - in real app, this would call an API
    if (email && password && name) {
      const newUser = { id: "1", name, email };
      setUser(newUser);
      setCurrentPage('ai-chat');
      toast.success(
        `Chào mừng ${name}! Tài khoản đã được tạo thành công.`,
      );
    } else {
      toast.error("Vui lòng điền đầy đủ thông tin");
    }
  };
  
  const handleLogout = () => {
    setUser(null);
    setCurrentPage('ai-chat');
    toast.info("Đã đăng xuất thành công");
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page as Page);
  };

  const handleBackToChat = () => {
    setCurrentPage('ai-chat');
  };

  const handleAddCalendarEvent = (event: CalendarEvent) => {
    setCalendarEvents(prev => [...prev, event]);
    toast.success(`✅ Đã thêm sự kiện: ${event.title}`);
  };

  const handleUpdateCalendarEvent = (eventId: string, updates: Partial<CalendarEvent>) => {
    setCalendarEvents(prev => prev.map(event => 
      event.id === eventId ? { ...event, ...updates } : event
    ));
  };

  // Helper function to delete calendar event
  const handleDeleteCalendarEvent = (eventId: string) => {
    setCalendarEvents(prev => prev.filter(event => event.id !== eventId));
  };

  const handleAddHeartRateReading = (reading: Omit<HeartRateReading, 'id'>) => {
    const newReading: HeartRateReading = {
      ...reading,
      id: `hr-${Date.now()}`
    };
    
    setHeartRateReadings(prev => [...prev, newReading]);
    
    // Check if heart rate is outside normal range (60-100 bpm)
    if (reading.rate < 60 || reading.rate > 100) {
      const alert: HealthAlert = {
        id: `alert-${Date.now()}`,
        type: reading.rate < 60 ? 'heart_rate_low' : 'heart_rate_high',
        title: reading.rate < 60 ? 'Nhịp tim chậm' : 'Nhịp tim nhanh',
        description: `Nhịp tim ${reading.rate} bpm nằm ngoài vùng bình thường (60-100 bpm). Vui lòng theo dõi và tham khảo ý kiến bác sĩ nếu cần.`,
        timestamp: reading.timestamp,
        severity: reading.rate < 40 || reading.rate > 120 ? 'high' : 'medium'
      };
      
      setHealthAlerts(prev => [...prev, alert]);
      
      toast.warning(`⚠️ Cảnh báo: ${alert.title} - ${reading.rate} bpm`);
    } else {
      toast.success(`📊 Đã ghi nhận nhịp tim: ${reading.rate} bpm`);
    }
  };

  // Helper function to acknowledge health alert
  const handleAcknowledgeHealthAlert = (alertId: string) => {
    setHealthAlerts(prev => prev.map(alert =>
      alert.id === alertId ? { ...alert, acknowledged: true } : alert
    ));
  };

  if (!user) {
    return (
      <>
        <AuthForm
          onLogin={handleLogin}
          onRegister={handleRegister}
        />
        <Toaster position="top-right" />
      </>
    );
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'ai-chat':
        return (
          <AIChat
            user={{ ...user, onLogout: handleLogout }}
            onNavigate={handleNavigate}
          />
        );
      case 'profile':
        return (
          <UserProfile
            user={user}
            onBackToMenu={handleBackToChat}
          />
        );
      case 'calendar':
        return (
          <SmartCalendar
            events={calendarEvents}
            onAddEvent={handleAddCalendarEvent}
            onUpdateEvent={handleUpdateCalendarEvent}
            onDeleteEvent={handleDeleteCalendarEvent}
            onBackToMenu={handleBackToChat}
          />
        );
      case 'health-data':
        return (
          <HealthData
            heartRateReadings={heartRateReadings}
            onAddHeartRateReading={handleAddHeartRateReading}
            healthAlerts={healthAlerts}
            onAcknowledgeAlert={handleAcknowledgeHealthAlert}
            onBackToMenu={handleBackToChat}
          />
        );
      case 'health-journal':
        return (
          <HealthJournal
            onBackToMenu={handleBackToChat}
          />
        );
      case 'heart-rate':
        return (
          <HeartRateMonitor
            onBackToMenu={handleBackToChat}
          />
        );
      default:
        return (
          <AIChat
            user={{ ...user, onLogout: handleLogout }}
            onNavigate={handleNavigate}
          />
        );
    }
  };

  return (
    <NotificationManager 
      events={calendarEvents} 
      onUpdateEvent={handleUpdateCalendarEvent}
      healthAlerts={healthAlerts}
      onAcknowledgeAlert={handleAcknowledgeHealthAlert}
    >
      {renderCurrentPage()}
      <Toaster position="top-right" />
    </NotificationManager>
  );
}