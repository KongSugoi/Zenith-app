import { useState } from "react";
import { 
  Bot, 
  Calendar, 
  Heart, 
  BookOpen, 
  BarChart3,
  User,
  Settings,
  LogOut 
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "./ui/dropdown-menu";

interface User {
  name: string;
  email: string;
}

interface MainMenuProps {
  user: User;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

export function MainMenu({ user, onNavigate, onLogout }: MainMenuProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every minute
  useState(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(interval);
  });

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('vi-VN', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('vi-VN', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Chào buổi sáng";
    if (hour < 18) return "Chào buổi chiều";
    return "Chào buổi tối";
  };

  // Separate AI Assistant (featured prominently)
  const aiAssistant = {
    id: 'ai-assistant',
    title: 'AI Trợ Lý',
    subtitle: 'Trò chuyện với AI thông minh',
    description: 'Bác sĩ AI, gia đình ảo và bạn bè AI luôn sẵn sàng lắng nghe',
    icon: Bot,
    color: 'bg-gradient-to-br from-blue-50 to-indigo-100 hover:from-blue-100 hover:to-indigo-200 border-blue-200',
    iconColor: 'text-blue-600',
    page: 'ai-chat'
  };

  // Other 4 menu items in 2x2 grid
  const gridMenuItems = [
    {
      id: 'calendar',
      title: 'Lịch',
      subtitle: 'Lịch hẹn & nhắc nhở',
      icon: Calendar,
      color: 'bg-green-50 hover:bg-green-100 border-green-200',
      iconColor: 'text-green-600',
      page: 'calendar'
    },
    {
      id: 'health',
      title: 'Sức Khỏe',
      subtitle: 'Theo dõi sức khỏe',
      icon: Heart,
      color: 'bg-red-50 hover:bg-red-100 border-red-200',
      iconColor: 'text-red-600',
      page: 'health-data'
    },
    {
      id: 'journal',
      title: 'Nhật Ký',
      subtitle: 'Ghi chép hàng ngày',
      icon: BookOpen,
      color: 'bg-purple-50 hover:bg-purple-100 border-purple-200',
      iconColor: 'text-purple-600',
      page: 'health-journal'
    },
    {
      id: 'dashboard',
      title: 'Tổng Quan',
      subtitle: 'Dashboard & báo cáo',
      icon: BarChart3,
      color: 'bg-orange-50 hover:bg-orange-100 border-orange-200',
      iconColor: 'text-orange-600',
      page: 'dashboard'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-2 sm:p-4">
      <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6 lg:space-y-8">
        
        {/* Header với lời chào và avatar - Responsive */}
        <div className="flex items-center justify-between bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 shadow-sm border border-white/20">
          <div className="space-y-0.5 sm:space-y-1">
            <h1 className="text-lg sm:text-2xl lg:text-3xl font-medium text-gray-800">
              ZenCare
            </h1>
            <p className="text-sm sm:text-lg lg:text-xl text-gray-600">
              {getGreeting()}, {user.name}
            </p>
            <p className="text-xs sm:text-sm text-gray-500">
              {formatDate(currentTime)} • {formatTime(currentTime)}
            </p>
          </div>
          
          {/* Avatar với dropdown menu - Responsive */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="relative h-10 w-10 sm:h-12 sm:w-12 lg:h-16 lg:w-16 rounded-full hover:bg-white/50 transition-colors"
              >
                <Avatar className="h-8 w-8 sm:h-10 sm:w-10 lg:h-14 lg:w-14 border-2 border-white shadow-md">
                  <AvatarImage src="" alt={user.name} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm sm:text-base lg:text-lg">
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuItem 
                onClick={() => onNavigate('profile')}
                className="cursor-pointer"
              >
                <User className="mr-2 h-4 w-4" />
                <span>Hồ sơ của tôi</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onNavigate('settings')}
                className="cursor-pointer"
              >
                <Settings className="mr-2 h-4 w-4" />
                <span>Cài đặt</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={onLogout}
                className="cursor-pointer text-red-600 focus:text-red-600"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Đăng xuất</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Main Content Layout - Responsive */}
        <div className="grid grid-cols-1 sm:gap-4 lg:gap-6 xl:gap-8 items-start">
          
          {/* AI Assistant - Featured (Mobile: full width, Desktop: 1 column) */}
          <div>
            <Card 
              className={`${aiAssistant.color} cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-xl border-2 h-full`}
              onClick={() => onNavigate(aiAssistant.page)}
            >
              <CardContent className="p-4 sm:p-6 lg:p-8">
                <div className="flex flex-col items-center space-y-3 sm:space-y-4 lg:space-y-6 text-center h-full justify-center">
                  <div className={`p-3 sm:p-4 lg:p-6 rounded-full bg-white/60 ${aiAssistant.iconColor}`}>
                    <aiAssistant.icon className="h-6 w-6 sm:h-8 sm:w-8 lg:h-12 lg:w-12 xl:h-16 xl:w-16" />
                  </div>
                  <div className="space-y-1 sm:space-y-2 lg:space-y-3">
                    <h3 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-medium text-gray-800">
                      {aiAssistant.title}
                    </h3>
                    <p className="text-sm sm:text-base lg:text-lg text-gray-600 font-medium">
                      {aiAssistant.subtitle}
                    </p>
                    <p className="text-xs sm:text-sm lg:text-base text-gray-500 max-w-xs hidden sm:block">
                      {aiAssistant.description}
                    </p>
                  </div>

                </div>
              </CardContent>
            </Card>
          </div>

          {/* Other 4 Functions - 2x2 Grid (Mobile: 2x2, Desktop: 2x2 in 2nd column) */}
          <div>
            <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:gap-4 xl:gap-6 h-full">
              {gridMenuItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Card 
                    key={item.id}
                    className={`${item.color} cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg border-2 aspect-square`}
                    onClick={() => onNavigate(item.page)}
                  >
                    <CardContent className="p-2 sm:p-3 lg:p-4 xl:p-6 h-full">
                      <div className="flex flex-col items-center space-y-1 sm:space-y-2 lg:space-y-3 xl:space-y-4 text-center h-full justify-center">
                        <div className={`p-2 sm:p-2.5 lg:p-3 xl:p-4 rounded-full bg-white/50 ${item.iconColor}`}>
                          <IconComponent className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 xl:h-8 xl:w-8 2xl:h-10 2xl:w-10" />
                        </div>
                        <div className="space-y-0.5 sm:space-y-1 lg:space-y-2">
                          <h3 className="text-sm sm:text-base lg:text-lg xl:text-xl 2xl:text-2xl font-medium text-gray-800">
                            {item.title}
                          </h3>
                          <p className="text-xs sm:text-sm lg:text-base text-gray-600 hidden sm:block">
                            {item.subtitle}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>


      </div>

      {/* Ultra-wide display enhancements */}
      <style>{`
        @media (min-width: 2200px) {
          .max-w-6xl {
            max-width: 1800px;
          }
          .grid.lg\\:grid-cols-3 {
            grid-template-columns: 1fr 2fr;
            gap: 3rem;
          }
          .grid.grid-cols-2 {
            gap: 2rem;
          }
          .grid.grid-cols-2.lg\\:grid-cols-4 {
            grid-template-columns: repeat(4, 1fr);
            gap: 2rem;
          }
        }
      `}</style>
    </div>
  );
}