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
import { LocalNotifications } from '@capacitor/local-notifications';
import { TextToSpeech } from "@capacitor-community/text-to-speech";

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

type Page = 'ai-chat' | 'profile' | 'calendar' | 'health-data' | 'health-journal' | 'heart-rate' | 'settings';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState<Page>('ai-chat');

  const sendNotificationAndSpeak = async (title: string, message: string) => {
    try {
      // Xin quyền
      await LocalNotifications.requestPermissions();

      // Gửi thông báo
      await LocalNotifications.schedule({
        notifications: [
          {
            id: Date.now(),
            title,
            body: message,
            schedule: { at: new Date(Date.now() + 500) },
            sound: "default",
            smallIcon: "ic_launcher"
          },
        ],
      });

      // Đọc thông báo
      await TextToSpeech.speak({
        text: `${title}. ${message}`,
        lang: "vi-VN",
        rate: 1.0,
        pitch: 1.0,
        volume: 1.0,
        category: "playback",
      });
    } catch (err) {
      console.error("Notification/TTS error:", err);
    }
  };

  const handleLogin = (email: string) => {  //, password: string) => {
      const mockUser = {
        id: email, // Use email as a simple unique id, or generate a UUID if needed
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
      )
    
  };

  const handleRegister = (
    email: string,
    password: string,
    name: string) => {
    // Mock registration - in real app, this would call an API
    if (email && password && name) {
      const newUser = { id: email, name, email };
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
    <NotificationManager>
      {renderCurrentPage()}
      <Toaster position="top-right" />
      
      {process.env.NODE_ENV === 'development' && (
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
      )}
    </NotificationManager>
  )
}