'use client'

import { useState } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Progress } from './ui/progress'
import { Bluetooth, Plus, TrendingDown, TrendingUp, Heart, Droplet, Thermometer } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer} from 'recharts'
import { PageWrapper } from './PageWrapper'

interface HealthDataProps {
  onBackToMenu?: () => void;
}

export function HealthData({ onBackToMenu }: HealthDataProps) {
  const [connectedDevices] = useState([
    { id: 'heart-monitor', name: 'Đồng hồ thông minh Samsung', status: 'connected', lastSync: '5 phút trước' },
    { id: 'fitness-band', name: 'Vòng đeo tay Xiaomi', status: 'connected', lastSync: '10 phút trước' },
  ])

  // Heart Rate Data - 7 days
  const heartRateData = [
    { date: '20/1', avg: 68, rest: 58, max: 95 },
    { date: '21/1', avg: 72, rest: 62, max: 88 },
    { date: '22/1', avg: 70, rest: 60, max: 92 },
    { date: '23/1', avg: 74, rest: 63, max: 98 },
    { date: '24/1', avg: 69, rest: 59, max: 87 },
    { date: '25/1', avg: 71, rest: 61, max: 94 },
    { date: '26/1', avg: 67, rest: 57, max: 89 },
  ]

  // Daily Heart Rate Pattern
  const dailyHeartRateData = [
    { time: '00:00', rate: 65 },
    { time: '04:00', rate: 58 },
    { time: '08:00', rate: 72 },
    { time: '12:00', rate: 78 },
    { time: '16:00', rate: 85 },
    { time: '20:00', rate: 74 },
    { time: '24:00', rate: 68 },
  ]

  // Current health metrics
  const currentHeartRate = 72
  const avgHeartRate = 70
  const restingHeartRate = 59
  const maxHeartRate = 98
  const currentTemp = 36.5
  const currentO2 = 98

  const getHeartRateStatus = (rate: number) => {
    if (rate < 60) return { status: 'Chậm', color: 'text-blue-600', bgColor: 'bg-blue-50' }
    if (rate > 100) return { status: 'Nhanh', color: 'text-red-600', bgColor: 'bg-red-50' }
    return { status: 'Bình thường', color: 'text-green-600', bgColor: 'bg-green-50' }
  }

  const handleConnectDevice = () => {
    alert('Đang tìm kiếm thiết bị theo dõi nhịp tim gần đây...')
  }

  const handleManualEntry = () => {
    alert('Tính năng nhập thủ công đang được phát triển...')
  }

  const heartRateStatus = getHeartRateStatus(currentHeartRate)

  return (
    <PageWrapper title="Dữ Liệu Sức Khỏe" onBackToMenu={onBackToMenu}>
      <div className="space-y-6">
        {/* Device Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bluetooth className="w-5 h-5 text-blue-600" />
              Thiết bị theo dõi nhịp tim
            </CardTitle>
            <CardDescription>Quản lý các thiết bị đo nhịp tim</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {connectedDevices.map((device) => (
                <div key={device.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      device.status === 'connected' ? 'bg-green-500' : 'bg-red-500'
                    }`}></div>
                    <div>
                      <p className="text-sm">{device.name}</p>
                      <p className="text-xs text-muted-foreground">Đồng bộ: {device.lastSync}</p>
                    </div>
                  </div>
                  <Badge variant={device.status === 'connected' ? 'default' : 'secondary'}>
                    {device.status === 'connected' ? 'Đã kết nối' : 'Mất kết nối'}
                  </Badge>
                </div>
              ))}
            </div>
            
            <div className="flex gap-2 mt-4">
              <Button onClick={handleConnectDevice} variant="outline" className="flex-1">
                <Bluetooth className="w-4 h-4 mr-2" />
                Kết nối thiết bị
              </Button>
              <Button onClick={handleManualEntry} variant="outline" className="flex-1">
                <Plus className="w-4 h-4 mr-2" />
                Nhập thủ công
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Current Health Metrics - Focus on Heart Rate */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Heart className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Nhịp tim hiện tại</p>
                  <div className="flex items-center gap-1">
                    <p className="text-lg font-medium text-red-600">{currentHeartRate}</p>
                    <span className="text-xs text-muted-foreground">bpm</span>
                  </div>
                  <Badge className={`${heartRateStatus.color} ${heartRateStatus.bgColor} text-xs`} variant="secondary">
                    {heartRateStatus.status}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Heart className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Nhịp nghỉ</p>
                  <div className="flex items-center gap-1">
                    <p className="text-lg font-medium text-blue-600">{restingHeartRate}</p>
                    <span className="text-xs text-muted-foreground">bpm</span>
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingDown className="w-3 h-3 text-green-600" />
                    <span className="text-xs text-green-600">Tốt</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Heart className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Nhịp tối đa</p>
                  <div className="flex items-center gap-1">
                    <p className="text-lg font-medium text-orange-600">{maxHeartRate}</p>
                    <span className="text-xs text-muted-foreground">bpm</span>
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className="w-3 h-3 text-orange-600" />
                    <span className="text-xs text-orange-600">Hôm qua</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Heart className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Trung bình</p>
                  <div className="flex items-center gap-1">
                    <p className="text-lg font-medium text-purple-600">{avgHeartRate}</p>
                    <span className="text-xs text-muted-foreground">bpm</span>
                  </div>
                  <span className="text-xs text-gray-600">7 ngày qua</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Weekly Heart Rate Trends */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-600" />
                Xu hướng nhịp tim tuần này
              </CardTitle>
              <CardDescription>Theo dõi nhịp tim trung bình, nghỉ và tối đa theo ngày</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={heartRateData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[50, 110]} />
                    <Tooltip 
                      formatter={(value, name) => [`${value} bpm`, name === 'avg' ? 'Trung bình' : name === 'rest' ? 'Nghỉ' : 'Tối đa']}
                      labelFormatter={(label) => `Ngày: ${label}`}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="avg" 
                      stroke="#ef4444" 
                      strokeWidth={2}
                      name="Trung bình"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="rest" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      name="Nghỉ"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="max" 
                      stroke="#f59e0b" 
                      strokeWidth={2}
                      name="Tối đa"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <p className="text-sm text-muted-foreground">TB tuần</p>
                  <p className="text-xl text-red-600">70 bpm</p>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Nghỉ TB</p>
                  <p className="text-xl text-blue-600">60 bpm</p>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Cao nhất</p>
                  <p className="text-xl text-orange-600">98 bpm</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Daily Heart Rate Pattern */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-600" />
                Nhịp tim trong ngày
              </CardTitle>
              <CardDescription>Theo dõi nhịp tim theo từng giờ hôm nay</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dailyHeartRateData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis domain={[50, 90]} />
                    <Tooltip 
                      formatter={(value) => [`${value} bpm`, 'Nhịp tim']}
                      labelFormatter={(label) => `Thời gian: ${label}`}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="rate" 
                      stroke="#ef4444" 
                      strokeWidth={3}
                      dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                      name="Nhịp tim"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              {/* Heart Rate Zones */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Vùng nhịp tim hôm nay</h4>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span>Nghỉ ngơi (50-60%)</span>
                    <span>45 phút</span>
                  </div>
                  <Progress value={75} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span>Đốt mỡ (60-70%)</span>
                    <span>32 phút</span>
                  </div>
                  <Progress value={53} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span>Aerobic (70-80%)</span>
                    <span>18 phút</span>
                  </div>
                  <Progress value={30} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span>Anaerobic (80-90%)</span>
                    <span>5 phút</span>
                  </div>
                  <Progress value={8} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Health Metrics */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <div className="p-3 bg-orange-100 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                  <Thermometer className="w-8 h-8 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-medium text-orange-600">{currentTemp}°C</p>
                  <p className="text-sm text-muted-foreground">Nhiệt độ cơ thể</p>
                  <Badge variant="secondary" className="text-xs mt-2">Bình thường</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <div className="p-3 bg-cyan-100 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                  <Droplet className="w-8 h-8 text-cyan-600" />
                </div>
                <div>
                  <p className="text-2xl font-medium text-cyan-600">{currentO2}%</p>
                  <p className="text-sm text-muted-foreground">SpO2</p>
                  <Badge variant="secondary" className="text-xs mt-2 bg-green-100 text-green-700">Tốt</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Health Insights */}
        <Card>
          <CardHeader>
            <CardTitle>Nhận xét sức khỏe</CardTitle>
            <CardDescription>Phân tích dựa trên dữ liệu nhịp tim của bạn</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <Heart className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-green-800 font-medium">Nhịp tim nghỉ tuyệt vời</p>
                    <p className="text-xs text-green-700 mt-1">
                      Nhịp tim nghỉ {restingHeartRate} bpm của bạn nằm trong mức tối ưu cho độ tuổi. 
                      Điều này cho thấy hệ tim mạch rất khỏe mạnh và thể lực tốt.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-blue-800 font-medium">Xu hướng ổn định tích cực</p>
                    <p className="text-xs text-blue-700 mt-1">
                      Nhịp tim của bạn có xu hướng ổn định trong tuần qua với biến động tự nhiên 
                      theo hoạt động hàng ngày. Hãy duy trì lối sống hiện tại.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  )
}