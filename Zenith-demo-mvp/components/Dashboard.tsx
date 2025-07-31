import { useState } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Badge } from './ui/badge'
import { Heart, MessageCircle, Calendar, BookOpen, User, LogOut, Activity, Bell } from 'lucide-react'
import { AIContacts } from './AIContacts'
import { HealthData } from './HealthData'
import { HealthJournal } from './HealthJournal'
import { SmartCalendar } from './SmartCalendar'
import { UserProfile } from './UserProfile'

interface User {
  name: string
  email: string
}

interface DashboardProps {
  user: User
  onLogout: () => void
}

type TabId = 'dashboard' | 'ai-contacts' | 'health' | 'journal' | 'calendar' | 'profile'

export function Dashboard({ user, onLogout }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard')

  const menuItems = [
    { id: 'dashboard', label: 'Tổng quan', icon: Activity, color: 'text-blue-500' },
    { id: 'ai-contacts', label: 'AI Trợ lý', icon: MessageCircle, color: 'text-green-500' },
    { id: 'health', label: 'Sức khỏe', icon: Heart, color: 'text-red-500' },
    { id: 'journal', label: 'Nhật ký', icon: BookOpen, color: 'text-yellow-500' },
    { id: 'calendar', label: 'Lịch', icon: Calendar, color: 'text-purple-500' },
    { id: 'profile', label: 'Hồ sơ', icon: User, color: 'text-gray-500' }
  ]

  const renderActiveContent = () => {
    switch (activeTab) {
      case 'ai-contacts':
        return <AIContacts />
      case 'health':
        return <HealthData />
      case 'journal':
        return <HealthJournal />
      case 'calendar':
        return <SmartCalendar />
      case 'profile':
        return <UserProfile user={user} onLogout={onLogout} />
      default:
        return (
          <div className="space-y-6">
            {/* Header with user greeting */}
            <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Xin chào, {user.name}!</h1>
                <p className="text-gray-600">Hôm nay bạn cảm thấy thế nào?</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                  Trực tuyến
                </Badge>
                <Button variant="outline" size="sm">
                  <Bell className="w-4 h-4 mr-2" />
                  Thông báo
                </Button>
              </div>
            </div>

            {/* Quick stats grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-50 rounded-lg">
                      <Heart className="w-5 h-5 text-red-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Nhịp tim</p>
                      <p className="text-lg font-semibold">72 BPM</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <MessageCircle className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Tin nhắn AI</p>
                      <p className="text-lg font-semibold">3 mới</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-yellow-50 rounded-lg">
                      <BookOpen className="w-5 h-5 text-yellow-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Nhật ký</p>
                      <p className="text-lg font-semibold">7 ngày</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-50 rounded-lg">
                      <Calendar className="w-5 h-5 text-green-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Lịch hẹn</p>
                      <p className="text-lg font-semibold">2 hôm nay</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent activities */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Hoạt động gần đây</CardTitle>
                  <CardDescription>Các sự kiện sức khỏe của bạn</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <Heart className="w-5 h-5 text-red-500" />
                    <div>
                      <p className="font-medium">Đo nhịp tim</p>
                      <p className="text-sm text-gray-600">72 BPM - 10 phút trước</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <BookOpen className="w-5 h-5 text-yellow-500" />
                    <div>
                      <p className="font-medium">Nhật ký sức khỏe</p>
                      <p className="text-sm text-gray-600">"Hôm nay cảm thấy khá tốt" - 2 giờ trước</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                    <MessageCircle className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="font-medium">Tư vấn với AI Doctor</p>
                      <p className="text-sm text-gray-600">Hỏi về chế độ ăn - 1 ngày trước</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Lời nhắc hôm nay</CardTitle>
                  <CardDescription>Những việc cần làm</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3 p-3 border border-blue-200 rounded-lg">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <div>
                      <p className="font-medium">Uống thuốc huyết áp</p>
                      <p className="text-sm text-gray-600">8:00 AM - Còn 30 phút</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 border border-green-200 rounded-lg">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="font-medium">Kiểm tra nhịp tim</p>
                      <p className="text-sm text-gray-600">12:00 PM - Sau 3 giờ</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 border border-purple-200 rounded-lg">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <div>
                      <p className="font-medium">Tập thể dục nhẹ</p>
                      <p className="text-sm text-gray-600">6:00 PM - Sau 9 giờ</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-ultrawide mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Heart className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="font-semibold text-gray-900">HealthCare</h1>
                <p className="text-xs text-gray-500">Ứng dụng sức khỏe thông minh</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Avatar className="w-8 h-8">
                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} />
                <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <Button
                variant="ghost"
                size="sm"
                onClick={onLogout}
                className="text-gray-600 hover:text-gray-900"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-ultrawide mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {renderActiveContent()}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="max-w-ultrawide mx-auto px-2 sm:px-4 lg:px-6 xl:px-8">
          <div className="flex items-center justify-between sm:justify-center py-2">
            <div className="flex items-center justify-between sm:justify-center w-full sm:w-auto sm:gap-4 md:gap-6 lg:gap-8 xl:gap-12 2xl:gap-16">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as TabId)}
                  className={`flex flex-col items-center justify-center gap-1 py-2 px-1 sm:px-2 md:px-3 lg:px-4 xl:px-6 rounded-lg transition-all duration-200 min-w-[50px] sm:min-w-[60px] md:min-w-[70px] lg:min-w-[80px] xl:min-w-[90px] relative ${
                    activeTab === item.id 
                      ? 'bg-blue-50 text-blue-600 scale-105' 
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <item.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${
                    activeTab === item.id ? 'text-blue-600' : 'text-gray-500'
                  }`} />
                  <span className={`text-[10px] sm:text-xs font-medium whitespace-nowrap ${
                    activeTab === item.id ? 'text-blue-600' : 'text-gray-500'
                  }`}>
                    {item.label}
                  </span>
                  {activeTab === item.id && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full"></div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>
    </div>
  )
}