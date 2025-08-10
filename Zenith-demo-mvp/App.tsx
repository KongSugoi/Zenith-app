"use client";

import { useState } from "react";
import { MainMenu } from "./components/MainMenu";
import { Command, CommandContext } from "./types";
import { AuthForm } from "./components/AuthForm";
import { Dashboard } from "./components/Dashboard";
import { UserProfile } from "./components/UserProfile";
import { AIChat } from "./components/AIChat";
import { SmartCalendar } from "./components/SmartCalendar";
import { HealthData } from "./components/HealthData";
import { HealthJournal } from "./components/HealthJournal";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";

interface User {
  name: string;
  email: string;
}

type Page = 'menu' | 'dashboard' | 'profile' | 'ai-chat' | 'calendar' | 'health-data' | 'health-journal';

export default function App() {
  // const [user, setUser] = useState<User | null>(null);

  const [user, setUser] = useState<User | null>({
    name: 'Người dùng demo',
    email: 'demo@example.com'
  });
  const [screen, setCurrentScreen] = useState<'chat' | 'calendar' | 'health'>('chat');
  const [currentPage, setCurrentPage] = useState<Page>('menu');
  const [calendarDate, setCalendarDate] = useState<string | null>(null)

  const handleLogin = (email: string, password: string) => {
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
      const newUser = { name, email };
      setUser(newUser);
      toast.success(
        `Chào mừng ${name}! Tài khoản đã được tạo thành công.`,
      );
    } else {
      toast.error("Vui lòng điền đầy đủ thông tin");
    }
  };

  const handleLogout = () => {
    setUser(null);
    toast.info("Đã đăng xuất thành công");
  };

  const executeCommand = (command: Command) => {
      switch (command.action) {
        case 'OPEN_CALENDAR':
          setCalendarDate(command.params?.date || null)
          setScreen('calendar')
          break
        case 'SHOW_HEALTH_STATS':
          setScreen('health')
          break
      }
    }

  const handleNavigate = (page: string) => {
    setCurrentPage(page as Page);
  };

  const handleBackToMenu = () => {
    setCurrentPage('menu');
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

  // const renderCurrentPage = () => {
  //   switch (currentPage) {
  //     case 'menu':
  //       return (
  //         <MainMenu
  //           user={user}
  //           onNavigate={handleNavigate}
  //           onLogout={handleLogout}
  //         />
  //       );
  //     case 'dashboard':
  //       return (
  //         <Dashboard
  //           user={user}
  //           onLogout={handleLogout}
  //           onBackToMenu={handleBackToMenu}
  //         />
  //       );
  //     case 'profile':
  //       return (
  //         <UserProfile
  //           user={user}
  //           onBackToMenu={handleBackToMenu}
  //         />
  //       );
  //     case 'ai-chat':
  //       return (
  //         <AIChat
  //           onBackToMenu={handleBackToMenu}
  //         />
  //       );
  //     case 'calendar':
  //       return (
  //         <SmartCalendar
  //           onBackToMenu={handleBackToMenu}
  //         />
  //       );
  //     case 'health-data':
  //       return (
  //         <HealthData
  //           onBackToMenu={handleBackToMenu}
  //         />
  //       );
  //     case 'health-journal':
  //       return (
  //         <HealthJournal
  //           onBackToMenu={handleBackToMenu}
  //         />
  //       );
  //     case 'settings':
  //       return (
  //         <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-4">
  //           <div className="max-w-2xl mx-auto">
  //             <div className="bg-white rounded-2xl p-6 shadow-sm border border-white/20">
  //               <h1 className="text-2xl font-medium mb-6">Cài đặt</h1>
  //               <p className="text-gray-600 mb-4">
  //                 Tính năng cài đặt sẽ được phát triển trong phiên bản tiếp theo.
  //               </p>
  //               <button
  //                 onClick={handleBackToMenu}
  //                 className="btn-primary"
  //               >
  //                 Quay lại Menu
  //               </button>
  //             </div>
  //           </div>
  //         </div>
  //       );
  //     default:
  //       return (
  //         <MainMenu
  //           user={user}
  //           onNavigate={handleNavigate}
  //           onLogout={handleLogout}
  //         />
  //       );
  //   }
  // };

  return (
    <>
      <AIChat
        onBackToMenu={handleBackToMenu}
      />
      <Toaster position="top-right" />
    </>
  );

}