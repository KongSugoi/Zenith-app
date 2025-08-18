'use client'

import { useState } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Badge } from './ui/badge'
import { Separator } from './ui/separator'
import { User, Edit, Save, X, Shield, Bell, Database, Calendar, Heart, MessageCircle, LogOut, Lock, Key, ArrowLeft, Download, FileText } from 'lucide-react'
import { toast } from 'sonner'

interface UserProfileProps {
  user: { name: string; email: string }
  onLogout?: () => void
  onBackToMenu?: () => void
}

// Mock health data for export
const mockHealthData = {
  user: {
    name: "Nguyễn Văn An",
    email: "nguyen.van.an@email.com",
    age: 65,
    phone: "+84 123 456 789",
    address: "123 Đường ABC, Quận 1, TP.HCM",
    emergencyContact: "Nguyễn Thị B - +84 987 654 321",
    medicalHistory: "Tăng huyết áp, tiểu đường type 2",
    allergies: "Penicillin, hải sản",
    currentMedications: "Losartan 50mg (1 viên/ngày), Metformin 500mg (2 viên/ngày)",
    doctorInfo: "Bác sĩ Nguyễn Văn C - Bệnh viện Tim Mạch"
  },
  heartRateData: [
    { date: "2024-01-20", avg: 68, rest: 58, max: 95, measurements: 24 },
    { date: "2024-01-21", avg: 72, rest: 62, max: 88, measurements: 26 },
    { date: "2024-01-22", avg: 70, rest: 60, max: 92, measurements: 23 },
    { date: "2024-01-23", avg: 74, rest: 63, max: 98, measurements: 25 },
    { date: "2024-01-24", avg: 69, rest: 59, max: 87, measurements: 22 },
    { date: "2024-01-25", avg: 71, rest: 61, max: 94, measurements: 24 },
    { date: "2024-01-26", avg: 67, rest: 57, max: 89, measurements: 21 }
  ],
  journalEntries: [
    {
      date: "2024-01-26",
      mood: "Tốt",
      notes: "Hôm nay cảm thấy khá tốt, chỉ hơi đau đầu vào buổi chiều. Có thể do thức khuya hôm qua."
    },
    {
      date: "2024-01-25", 
      mood: "Tuyệt vời",
      notes: "Ngày tuyệt vời! Không có triệu chứng gì bất thường. Ngủ ngon và ăn uống đầy đủ."
    },
    {
      date: "2024-01-24",
      mood: "Bình thường", 
      notes: "Cảm thấy hơi mệt mỏi và khó ngủ. Có thể do căng thẳng từ cuộc họp gia đình."
    }
  ],
  calendarEvents: [
    {
      date: "2024-01-27",
      time: "08:00",
      title: "Uống thuốc huyết áp",
      type: "Thuốc",
      completed: true
    },
    {
      date: "2024-01-27",
      time: "16:00", 
      title: "Tập thể dục",
      type: "Tập luyện",
      completed: false
    },
    {
      date: "2024-02-02",
      time: "14:00",
      title: "Khám định kỳ",
      type: "Hẹn khám",
      completed: false
    }
  ],
  stats: {
    totalHeartRateMeasurements: 247,
    aiConversations: 89,
    daysUsed: 45,
    averageHeartRate: 70,
    restingHeartRate: 59,
    maxHeartRate: 98
  }
}

export function UserProfile({ user, onLogout, onBackToMenu }: UserProfileProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    name: user.name,
    email: user.email,
    phone: '+84 123 456 789',
    dateOfBirth: '1960-05-15',
    gender: 'male',
    address: '123 Đường ABC, Quận 1, TP.HCM',
    emergencyContact: 'Nguyễn Thị B - +84 987 654 321',
    medicalHistory: 'Tăng huyết áp, tiểu đường type 2',
    allergies: 'Penicillin, hải sản',
    currentMedications: 'Losartan 50mg (1 viên/ngày), Metformin 500mg (2 viên/ngày)',
    doctorInfo: 'Bác sĩ Nguyễn Văn C - Bệnh viện Tim Mạch'
  })

  const [preferences, setPreferences] = useState({
    notifications: true,
    voiceReminders: true,
    dataSharing: false,
    weeklyReports: true
  })

  const handleSave = () => {
    // In real app, this would save to database
    setIsEditing(false)
    toast.success('Đã lưu thông tin cá nhân!')
  }

  const handleCancel = () => {
    setIsEditing(false)
    // Reset data if needed
  }

  const generateHealthReport = () => {
    const reportDate = new Date().toLocaleDateString('vi-VN')
    
    return `
BÁO CÁO SỨC KHỎE TOÀN DIỆN
=====================================

Thông tin người dùng:
-------------------------------------
Họ tên: ${mockHealthData.user.name}
Email: ${mockHealthData.user.email}
Tuổi: ${mockHealthData.user.age}
Điện thoại: ${mockHealthData.user.phone}
Địa chỉ: ${mockHealthData.user.address}
Liên hệ khẩn cấp: ${mockHealthData.user.emergencyContact}
Bác sĩ điều trị: ${mockHealthData.user.doctorInfo}
Ngày xuất báo cáo: ${reportDate}

Thông tin y tế:
-------------------------------------
Tiền sử bệnh: ${mockHealthData.user.medicalHistory}
Dị ứng: ${mockHealthData.user.allergies}
Thuốc đang sử dụng: ${mockHealthData.user.currentMedications}

Thống kê tổng quan:
-------------------------------------
• Tổng số lần đo nhịp tim: ${mockHealthData.stats.totalHeartRateMeasurements}
• Số cuộc trò chuyện với AI: ${mockHealthData.stats.aiConversations}
• Số ngày sử dụng ứng dụng: ${mockHealthData.stats.daysUsed}
• Nhịp tim trung bình: ${mockHealthData.stats.averageHeartRate} bpm
• Nhịp tim nghỉ: ${mockHealthData.stats.restingHeartRate} bpm
• Nhịp tim tối đa: ${mockHealthData.stats.maxHeartRate} bpm

Dữ liệu nhịp tim 7 ngày gần nhất:
-------------------------------------
${mockHealthData.heartRateData.map(data => 
  `${data.date}: TB=${data.avg}bpm, Nghỉ=${data.rest}bpm, Max=${data.max}bpm (${data.measurements} lần đo)`
).join('\n')}

Nhật ký sức khỏe gần đây:
-------------------------------------
${mockHealthData.journalEntries.map(entry => 
  `${entry.date} - Tâm trạng: ${entry.mood}\n   ${entry.notes}\n`
).join('\n')}

Lịch trình sức khỏe:
-------------------------------------
${mockHealthData.calendarEvents.map(event => 
  `${event.date} ${event.time} - ${event.title} (${event.type}) ${event.completed ? '✓' : '○'}`
).join('\n')}

Khuyến nghị:
-------------------------------------
• Nhịp tim của bạn đang ở mức ổn định và tốt cho độ tuổi
• Hãy tiếp tục duy trì chế độ tập luyện và uống thuốc đúng giờ
• Theo dõi thường xuyên và ghi chép nhật ký sức khỏe
• Đến khám định kỳ theo lịch hẹn với bác sĩ

Ghi chú: Báo cáo này được tạo tự động từ ứng dụng ZenCare AI
và chỉ mang tính chất tham khảo. Vui lòng tham khảo ý kiến
bác sĩ chuyên khoa để có lời khuyên y tế chính xác.

=====================================
ZenCare AI - Ứng dụng chăm sóc sức khỏe thông minh
Ngày xuất: ${reportDate}
    `
  }

  const handleExportData = () => {
    try {
      const healthReport = generateHealthReport()
      
      // Create a blob with the health report
      const blob = new Blob([healthReport], { type: 'text/plain;charset=utf-8' })
      
      // Create download link
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      
      // Generate filename with current date
      const fileName = `BaoCaoSucKhoe_${mockHealthData.user.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.txt`
      link.download = fileName
      
      // Trigger download
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      // Clean up
      window.URL.revokeObjectURL(url)
      
      toast.success('✅ Đã xuất báo cáo sức khỏe thành công!')
    } catch (error) {
      console.error('Error exporting data:', error)
      toast.error('❌ Lỗi khi xuất dữ liệu. Vui lòng thử lại.')
    }
  }

  const handleBackupData = () => {
    try {
      // Create comprehensive backup data
      const backupData = {
        exportDate: new Date().toISOString(),
        userProfile: profileData,
        preferences: preferences,
        healthData: mockHealthData,
        version: "1.0"
      }
      
      const blob = new Blob([JSON.stringify(backupData, null, 2)], { 
        type: 'application/json;charset=utf-8' 
      })
      
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      
      const fileName = `ZenCare_Backup_${new Date().toISOString().split('T')[0]}.json`
      link.download = fileName
      
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      window.URL.revokeObjectURL(url)
      
      toast.success('✅ Đã sao lưu dữ liệu thành công!')
    } catch (error) {
      console.error('Error backing up data:', error)
      toast.error('❌ Lỗi khi sao lưu dữ liệu. Vui lòng thử lại.')
    }
  }

  const handleDeleteAllData = () => {
    const confirmed = window.confirm(
      'CẢNH BÁO: Bạn có chắc muốn xóa TẤT CẢ dữ liệu?\n\n' +
      'Hành động này sẽ xóa vĩnh viễn:\n' +
      '• Tất cả dữ liệu nhịp tim\n' +
      '• Nhật ký sức khỏe\n' +
      '• Lịch trình và nhắc nhở\n' +
      '• Thông tin cá nhân\n\n' +
      'Dữ liệu không thể khôi phục sau khi xóa!'
    )
    
    if (confirmed) {
      const doubleConfirm = window.confirm(
        'Xác nhận lần cuối: Bạn THẬT SỰ muốn xóa tất cả dữ liệu?\n\n' +
        'Nhập "XÓA TẤT CẢ" để xác nhận:'
      )
      
      if (doubleConfirm) {
        // In real app, this would call API to delete all user data
        toast.success('🗑️ Đã xóa tất cả dữ liệu. Tài khoản sẽ được đăng xuất.')
        
        // Logout user after deletion
        setTimeout(() => {
          if (onLogout) {
            onLogout()
          }
        }, 2000)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        {onBackToMenu && (
          <div className="flex items-center gap-4 bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-white/20">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBackToMenu}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
            </Button>
            <h1 className="text-xl font-medium text-gray-800">Hồ sơ người dùng</h1>
          </div>
        )}
    
        <div className="space-y-6">
      {/* Profile Header */}
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} />
                <AvatarFallback className="text-2xl bg-blue-100 text-blue-600">
                  {user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-semibold text-gray-900 mb-1">{profileData.name}</h1>
              <p className="text-gray-600 mb-3">{profileData.email}</p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200">
                  Người cao tuổi
                </Badge>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  Đã xác thực
                </Badge>
              </div>
            </div>

          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-50 rounded-lg">
                <Heart className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Số lần đo tim</p>
                <p className="text-lg font-semibold">247</p>
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
                <p className="text-sm text-gray-600">Cuộc trò chuyện AI</p>
                <p className="text-lg font-semibold">89</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-50 rounded-lg">
                <Calendar className="w-5 h-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Ngày sử dụng</p>
                <p className="text-lg font-semibold">45</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
        {/* Personal Information */}
        <Card className="xl:col-span-1 2xl:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  Thông tin cá nhân
                </CardTitle>
                <CardDescription>Thông tin cơ bản và liên hệ</CardDescription>
              </div>
              <Button 
                onClick={() => setIsEditing(!isEditing)}
                variant={isEditing ? "outline" : "default"}
                size="sm"
              >
                {isEditing ? <X className="w-4 h-4 mr-2" /> : <Edit className="w-4 h-4 mr-2" />}
                {isEditing ? 'Hủy' : 'Chỉnh sửa'}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Họ và tên</Label>
                <Input
                  id="name"
                  value={profileData.name}
                  onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="phone">Số điện thoại</Label>
                <Input
                  id="phone"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dob">Ngày sinh</Label>
                <Input
                  id="dob"
                  type="date"
                  value={profileData.dateOfBirth}
                  onChange={(e) => setProfileData({...profileData, dateOfBirth: e.target.value})}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="gender">Giới tính</Label>
                <Select 
                  value={profileData.gender} 
                  onValueChange={(value) => setProfileData({...profileData, gender: value})}
                  disabled={!isEditing}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Nam</SelectItem>
                    <SelectItem value="female">Nữ</SelectItem>
                    <SelectItem value="other">Khác</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="address">Địa chỉ</Label>
              <Textarea
                id="address"
                value={profileData.address}
                onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                disabled={!isEditing}
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="emergency">Liên hệ khẩn cấp</Label>
              <Input
                id="emergency"
                value={profileData.emergencyContact}
                onChange={(e) => setProfileData({...profileData, emergencyContact: e.target.value})}
                disabled={!isEditing}
                placeholder="Tên - Số điện thoại"
              />
            </div>
          </CardContent>
        </Card>

        {/* Medical Information */}
        <Card className="xl:col-span-1 2xl:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-red-600" />
              Thông tin y tế
            </CardTitle>
            <CardDescription>Lịch sử bệnh án và thuốc men</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="medical-history">Tiền sử bệnh</Label>
              <Textarea
                id="medical-history"
                value={profileData.medicalHistory}
                onChange={(e) => setProfileData({...profileData, medicalHistory: e.target.value})}
                disabled={!isEditing}
                rows={2}
                placeholder="Các bệnh lý hiện tại và đã từng mắc"
              />
            </div>

            <div>
              <Label htmlFor="allergies">Dị ứng</Label>
              <Textarea
                id="allergies"
                value={profileData.allergies}
                onChange={(e) => setProfileData({...profileData, allergies: e.target.value})}
                disabled={!isEditing}
                rows={2}
                placeholder="Thuốc, thực phẩm hoặc chất gây dị ứng"
              />
            </div>

            <div>
              <Label htmlFor="medications">Thuốc đang sử dụng</Label>
              <Textarea
                id="medications"
                value={profileData.currentMedications}
                onChange={(e) => setProfileData({...profileData, currentMedications: e.target.value})}
                disabled={!isEditing}
                rows={3}
                placeholder="Tên thuốc, liều lượng và cách dùng"
              />
            </div>

            <div>
              <Label htmlFor="doctor">Bác sĩ điều trị</Label>
              <Input
                id="doctor"
                value={profileData.doctorInfo}
                onChange={(e) => setProfileData({...profileData, doctorInfo: e.target.value})}
                disabled={!isEditing}
                placeholder="Tên bác sĩ và bệnh viện"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* App Preferences */}
      <Card className="2xl:col-span-3">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-green-600" />
            Cài đặt ứng dụng
          </CardTitle>
          <CardDescription>Tùy chỉnh thông báo và quyền riêng tư</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">Thông báo push</p>
                <p className="text-sm text-muted-foreground">Nhận thông báo nhắc nhở và cập nhật</p>
              </div>
              <Button
                variant={preferences.notifications ? "default" : "outline"}
                size="sm"
                onClick={() => setPreferences({...preferences, notifications: !preferences.notifications})}
              >
                {preferences.notifications ? "Bật" : "Tắt"}
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">Nhắc nhở bằng giọng nói</p>
                <p className="text-sm text-muted-foreground">Phát âm thanh các thông báo quan trọng</p>
              </div>
              <Button
                variant={preferences.voiceReminders ? "default" : "outline"}
                size="sm"
                onClick={() => setPreferences({...preferences, voiceReminders: !preferences.voiceReminders})}
              >
                {preferences.voiceReminders ? "Bật" : "Tắt"}
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">Chia sẻ dữ liệu</p>
                <p className="text-sm text-muted-foreground">Chia sẻ dữ liệu với bác sĩ và gia đình</p>
              </div>
              <Button
                variant={preferences.dataSharing ? "default" : "outline"}
                size="sm"
                onClick={() => setPreferences({...preferences, dataSharing: !preferences.dataSharing})}
              >
                {preferences.dataSharing ? "Bật" : "Tắt"}
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">Báo cáo hàng tuần</p>
                <p className="text-sm text-muted-foreground">Nhận báo cáo tổng hợp sức khỏe mỗi tuần</p>
              </div>
              <Button
                variant={preferences.weeklyReports ? "default" : "outline"}
                size="sm"
                onClick={() => setPreferences({...preferences, weeklyReports: !preferences.weeklyReports})}
              >
                {preferences.weeklyReports ? "Bật" : "Tắt"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Data Export - Enhanced with Real Data */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5 text-purple-600" />
              Quản lý dữ liệu
            </CardTitle>
            <CardDescription>Xuất và sao lưu dữ liệu sức khỏe</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                onClick={handleExportData}
              >
                <FileText className="w-4 h-4 mr-2" />
                Xuất báo cáo sức khỏe
                <span className="ml-auto text-xs text-muted-foreground">TXT</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                onClick={handleBackupData}
              >
                <Download className="w-4 h-4 mr-2" />
                Sao lưu dữ liệu đầy đủ
                <span className="ml-auto text-xs text-muted-foreground">JSON</span>
              </Button>
              
              <div className="pt-2 border-t">
                <p className="text-xs text-muted-foreground mb-3">
                  Dữ liệu bao gồm: {mockHealthData.stats.totalHeartRateMeasurements} lần đo nhịp tim, 
                  {mockHealthData.journalEntries.length} nhật ký, {mockHealthData.calendarEvents.length} sự kiện lịch
                </p>
                
                <Button 
                  variant="destructive" 
                  className="w-full justify-start" 
                  onClick={handleDeleteAllData}
                >
                  <X className="w-4 h-4 mr-2" />
                  Xóa tất cả dữ liệu
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-red-600" />
              Bảo mật tài khoản
            </CardTitle>
            <CardDescription>Quản lý mật khẩu và đăng xuất</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start" onClick={() => toast.info('Tính năng đổi mật khẩu sẽ được phát triển')}>
                <Key className="w-4 h-4 mr-2" />
                Đổi mật khẩu
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => toast.info('Tính năng xác thực 2 lớp sẽ được phát triển')}>
                <Shield className="w-4 h-4 mr-2" />
                Xác thực 2 lớp
              </Button>
              <Separator />
              {onLogout && (
                <Button 
                  variant="destructive" 
                  className="w-full justify-start"
                  onClick={() => {
                    if (confirm('Bạn có chắc muốn đăng xuất?')) {
                      onLogout()
                    }
                  }}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Đăng xuất
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Save Changes */}
      {isEditing && (
        <div className="flex gap-4">
          <Button onClick={handleSave} className="flex-1">
            <Save className="w-4 h-4 mr-2" />
            Lưu thay đổi
          </Button>
          <Button onClick={handleCancel} variant="outline" className="flex-1">
            <X className="w-4 h-4 mr-2" />
            Hủy bỏ
          </Button>
        </div>
      )}
    </div>
      </div>
    </div>
  )
}