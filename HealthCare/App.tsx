"use client";

import { useState } from "react";
import { AuthForm } from "./components/AuthForm";
import { UserProfile } from "./components/UserProfile";
import { AIChat } from "./components/AIChat";
import { SmartCalendar } from "./components/SmartCalendar";
import { HealthData } from "./components/HealthData";
import { HealthJournal } from "./components/HealthJournal";
import { HeartRateMonitor } from "./components/HeartRateMonitor";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";

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
    <>
      {renderCurrentPage()}
      <Toaster position="top-right" />
    </>
  );
}