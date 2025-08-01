"use client";

import { useState } from "react";
import { AuthForm } from "./components/AuthForm";
import { Dashboard } from "./components/Dashboard";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";

interface User {
  name: string;
  email: string;
}

export default function App() {
  // const [user, setUser] = useState<User | null>(null);

  const [user, setUser] = useState<User>({
    name: 'Người dùng demo',
    email: 'demo@example.com'
  });

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

  return (
  <div className="min-h-screen bg-background text-foreground transition-colors">
    {!user ? (
      <>
        <AuthForm onLogin={handleLogin} onRegister={handleRegister} />
      </>
    ) : (
      <>
        <Dashboard user={user} onLogout={handleLogout} />
      </>
    )}
    <Toaster position="top-right" />
  </div>
);

}