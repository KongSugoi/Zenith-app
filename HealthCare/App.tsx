"use client";

import { useState } from "react";
import { AuthForm } from "./components/AuthForm";
import { UserProfile } from "./components/UserProfile";
import { AIChat } from "./components/AIChat";
import { SmartCalendar } from "./components/SmartCalendar";
import { HealthData } from "./components/HealthData";
import { HealthJournal } from "./components/HealthJournal";
import { HeartRateMonitor } from "./components/HeartRateMonitor";
import { CalendarEvent, NotificationManager } from "./components/NotificationManager";
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

  // Helper function to add new calendar event
  const handleAddCalendarEvent = (event: CalendarEvent) => {
    setCalendarEvents(prev => [...prev, event]);
    toast.success(`✅ Đã thêm sự kiện: ${event.title}`);
  };

  // Helper function to update calendar event
  const handleUpdateCalendarEvent = (eventId: string, updates: Partial<CalendarEvent>) => {
    setCalendarEvents(prev => prev.map(event => 
      event.id === eventId ? { ...event, ...updates } : event
    ));
  };

  // Helper function to delete calendar event
  const handleDeleteCalendarEvent = (eventId: string) => {
    setCalendarEvents(prev => prev.filter(event => event.id !== eventId));
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
            userId={Number(user.id)}
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
    <NotificationManager events={calendarEvents} onUpdateEvent={handleUpdateCalendarEvent}>
      {renderCurrentPage()}
      <Toaster position="top-right" />
      
      {/* {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 bg-black/90 text-white p-3 rounded-lg text-xs font-mono z-40 max-w-[200px] sm:max-w-xs">
          <div className="text-yellow-300 font-semibold mb-2">🔔 DEBUG</div>
          <div className="space-y-1 mb-2 text-xs">
            <div>👤 {user.name.split(' ')[0]}</div>
            <div>📱 {currentPage}</div>
          </div>
          
          <button
            onClick={() => {
              sendNotificationAndSpeak("Test Notification", "Đây là một thông báo thử nghiệm")
              if ((window as any).triggerTestNotification) {
                (window as any).triggerTestNotification()
                toast.info('🧪 Test!')
              }
            }}
            className="w-full bg-red-600 hover:bg-red-700 text-white text-xs py-2 px-2 rounded transition-colors"
          >
            🚨 TEST
          </button>
        </div>
      )} */}
    </NotificationManager>
  )
}