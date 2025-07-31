'use client'

import { useState } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Progress } from './ui/progress'
import { Heart, Bluetooth, Plus, TrendingDown, TrendingUp } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export function HealthData() {
  const [connectedDevices, setConnectedDevices] = useState([
    { id: 'heart-monitor', name: 'Đồng hồ thông minh Samsung', status: 'connected', lastSync: '5 phút trước' },
    { id: 'fitness-band', name: 'Vòng đeo tay Xiaomi', status: 'connected', lastSync: '10 phút trước' },
  ])

  const heartRateData = [
    { time: '00:00', rate: 65 },
    { time: '04:00', rate: 58 },
    { time: '08:00', rate: 72 },
    { time: '12:00', rate: 78 },
    { time: '16:00', rate: 85 },
    { time: '20:00', rate: 74 },
    { time: '24:00', rate: 68 },
  ]

  const weeklyHeartRateData = [
    { day: 'CN', avg: 68, rest: 58, max: 95 },
    { day: 'T2', avg: 72, rest: 62, max: 88 },
    { day: 'T3', avg: 70, rest: 60, max: 92 },
    { day: 'T4', avg: 74, rest: 63, max: 98 },
    { day: 'T5', avg: 69, rest: 59, max: 87 },
    { day: 'T6', avg: 71, rest: 61, max: 94 },
    { day: 'T7', avg: 67, rest: 57, max: 89 },
  ]

  const currentHeartRate = 72
  const restingHeartRate = 58
  const maxHeartRate = 98
  const heartRateVariability = 42

  const getHeartRateStatus = (rate: number) => {
    if (rate < 60) return { status: 'Chậm', color: 'text-blue-600', bgColor: 'bg-blue-50' }
    if (rate > 100) return { status: 'Nhanh', color: 'text-red-600', bgColor: 'bg-red-50' }
    return { status: 'Bình thường', color: 'text-green-600', bgColor: 'bg-green-50' }
  }

  const handleConnectDevice = () => {
    alert('Đang tìm kiếm thiết bị theo dõi nhịp tim gần đây...')
  }

  const handleManualEntry = () => {
    const heartRate = prompt('Nhập nhịp tim hiện tại (lần/phút):')
    if (heartRate && !isNaN(Number(heartRate))) {
      alert(`Đã ghi nhận nhịp tim: ${heartRate} lần/phút`)
    }
  }

  const currentStatus = getHeartRateStatus(currentHeartRate)

  return (
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

      {/* Current Heart Rate */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <Heart className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Nhịp tim hiện tại</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl text-red-600">{currentHeartRate}</p>
                  <span className="text-sm text-muted-foreground">bpm</span>
                </div>
                <Badge className={`${currentStatus.color} ${currentStatus.bgColor} text-xs`} variant="secondary">
                  {currentStatus.status}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Nhịp nghỉ</p>
              <div className="flex items-center justify-center gap-1 mt-1">
                <p className="text-2xl text-blue-600">{restingHeartRate}</p>
                <span className="text-sm text-muted-foreground">bpm</span>
              </div>
              <div className="flex items-center justify-center gap-1 mt-1">
                <TrendingDown className="w-3 h-3 text-green-600" />
                <span className="text-xs text-green-600">Tốt</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Nhịp tim tối đa</p>
              <div className="flex items-center justify-center gap-1 mt-1">
                <p className="text-2xl text-orange-600">{maxHeartRate}</p>
                <span className="text-sm text-muted-foreground">bpm</span>
              </div>
              <div className="flex items-center justify-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3 text-orange-600" />
                <span className="text-xs text-orange-600">Hôm qua</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">HRV</p>
              <div className="flex items-center justify-center gap-1 mt-1">
                <p className="text-2xl text-purple-600">{heartRateVariability}</p>
                <span className="text-sm text-muted-foreground">ms</span>
              </div>
              <div className="flex items-center justify-center gap-1 mt-1">
                <span className="text-xs text-purple-600">Biến thiên nhịp tim</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts - Ultra-wide layout */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Heart Rate Chart - Today */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-600" />
              Nhịp tim trong ngày
            </CardTitle>
            <CardDescription>Theo dõi nhịp tim theo từng giờ</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={heartRateData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis domain={['dataMin - 10', 'dataMax + 10']} />
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
            
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <p className="text-sm text-muted-foreground">Trung bình</p>
                <p className="text-xl text-red-600">72 bpm</p>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-muted-foreground">Thấp nhất</p>
                <p className="text-xl text-blue-600">58 bpm</p>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <p className="text-sm text-muted-foreground">Cao nhất</p>
                <p className="text-xl text-orange-600">85 bpm</p>
              </div>
            </div>
          </CardContent>
        </Card>

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
                <LineChart data={weeklyHeartRateData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="avg" stroke="#ef4444" name="Trung bình" strokeWidth={2} />
                  <Line type="monotone" dataKey="rest" stroke="#3b82f6" name="Nghỉ" strokeWidth={2} />
                  <Line type="monotone" dataKey="max" stroke="#f59e0b" name="Tối đa" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Heart Rate Zones - Compact for ultra-wide */}
            <div className="space-y-2">
              <h4 className="text-sm">Vùng nhịp tim hôm nay</h4>
              
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

      {/* Health Insights - Ultra-wide layout */}
      <Card>
        <CardHeader>
          <CardTitle>Nhận xét sức khỏe</CardTitle>
          <CardDescription>Phân tích dựa trên dữ liệu nhịp tim của bạn</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start gap-3">
                <Heart className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <p className="text-sm text-green-800">Nhịp tim nghỉ tốt</p>
                  <p className="text-xs text-green-700 mt-1">
                    Nhịp tim nghỉ {restingHeartRate} bpm của bạn nằm trong khoảng tốt cho độ tuổi. 
                    Điều này cho thấy hệ tim mạch khỏe mạnh.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm text-blue-800">Xu hướng ổn định</p>
                  <p className="text-xs text-blue-700 mt-1">
                    Nhịp tim của bạn có xu hướng ổn định trong tuần qua, cho thấy 
                    lối sống và hoạt động đều đặn.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start gap-3">
                <Heart className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="text-sm text-yellow-800">Gợi ý cải thiện</p>
                  <p className="text-xs text-yellow-700 mt-1">
                    Hãy duy trì hoạt động thể chất nhẹ nhàng 30 phút/ngày để cải thiện 
                    sức khỏe tim mạch. Tránh căng thẳng và ngủ đủ giấc.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}