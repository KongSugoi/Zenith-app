'use client'

import { useState } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Clock, Sun, Sunrise, Sunset, Moon } from 'lucide-react'

interface TimeOption {
  time: string
  label: string
  description: string
  icon: React.ComponentType<any>
  period: 'morning' | 'afternoon' | 'evening' | 'night'
  color: string
}

interface SeniorTimePickerProps {
  value?: string
  onChange: (time: string) => void
  activityType?: 'medication' | 'appointment' | 'exercise' | 'other'
}

export function SeniorTimePicker({ value, onChange, activityType = 'other' }: SeniorTimePickerProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<string>('')
  const [customTime, setCustomTime] = useState('')
  const [showCustom, setShowCustom] = useState(false)

  // Common time options with senior-friendly descriptions
  const timeOptions: TimeOption[] = [
    // Morning
    { time: '06:00', label: 'Sáng sớm', description: '6:00 - Khi mặt trời mọc', icon: Sunrise, period: 'morning', color: 'bg-orange-100 text-orange-800 border-orange-200' },
    { time: '07:00', label: 'Sáng', description: '7:00 - Thức dậy', icon: Sun, period: 'morning', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
    { time: '08:00', label: 'Sáng', description: '8:00 - Sau bữa sáng', icon: Sun, period: 'morning', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
    { time: '09:00', label: 'Sáng', description: '9:00 - Đầu buổi sáng', icon: Sun, period: 'morning', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
    { time: '10:00', label: 'Sáng', description: '10:00 - Giữa buổi sáng', icon: Sun, period: 'morning', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
    { time: '11:00', label: 'Sáng muộn', description: '11:00 - Cuối buổi sáng', icon: Sun, period: 'morning', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
    
    // Afternoon
    { time: '12:00', label: 'Trưa', description: '12:00 - Giờ ăn trưa', icon: Sun, period: 'afternoon', color: 'bg-blue-100 text-blue-800 border-blue-200' },
    { time: '13:00', label: 'Chiều', description: '13:00 - Sau bữa trưa', icon: Sun, period: 'afternoon', color: 'bg-blue-100 text-blue-800 border-blue-200' },
    { time: '14:00', label: 'Chiều', description: '14:00 - Đầu buổi chiều', icon: Sun, period: 'afternoon', color: 'bg-blue-100 text-blue-800 border-blue-200' },
    { time: '15:00', label: 'Chiều', description: '15:00 - Giữa buổi chiều', icon: Sun, period: 'afternoon', color: 'bg-blue-100 text-blue-800 border-blue-200' },
    { time: '16:00', label: 'Chiều', description: '16:00 - Cuối buổi chiều', icon: Sun, period: 'afternoon', color: 'bg-blue-100 text-blue-800 border-blue-200' },
    { time: '17:00', label: 'Chiều muộn', description: '17:00 - Chiều tà', icon: Sun, period: 'afternoon', color: 'bg-blue-100 text-blue-800 border-blue-200' },
    
    // Evening
    { time: '18:00', label: 'Tối', description: '18:00 - Giờ ăn tối', icon: Sunset, period: 'evening', color: 'bg-purple-100 text-purple-800 border-purple-200' },
    { time: '19:00', label: 'Tối', description: '19:00 - Sau bữa tối', icon: Sunset, period: 'evening', color: 'bg-purple-100 text-purple-800 border-purple-200' },
    { time: '20:00', label: 'Tối', description: '20:00 - Đầu buổi tối', icon: Sunset, period: 'evening', color: 'bg-purple-100 text-purple-800 border-purple-200' },
    { time: '21:00', label: 'Tối muộn', description: '21:00 - Chuẩn bị ngủ', icon: Moon, period: 'evening', color: 'bg-purple-100 text-purple-800 border-purple-200' },
    
    // Night
    { time: '22:00', label: 'Đêm', description: '22:00 - Giờ đi ngủ', icon: Moon, period: 'night', color: 'bg-gray-100 text-gray-800 border-gray-200' },
  ]

  // Get recommended times based on activity type
  const getRecommendedTimes = () => {
    switch (activityType) {
      case 'medication':
        return timeOptions.filter(opt => 
          ['07:00', '08:00', '12:00', '18:00', '19:00', '21:00'].includes(opt.time)
        )
      case 'exercise':
        return timeOptions.filter(opt => 
          ['06:00', '07:00', '08:00', '16:00', '17:00', '18:00'].includes(opt.time)
        )
      case 'appointment':
        return timeOptions.filter(opt => 
          ['08:00', '09:00', '10:00', '14:00', '15:00', '16:00'].includes(opt.time)
        )
      default:
        return timeOptions
    }
  }

  const periods = [
    { key: 'morning', label: 'Buổi sáng', icon: Sunrise, color: 'bg-yellow-100 text-yellow-800', times: timeOptions.filter(t => t.period === 'morning') },
    { key: 'afternoon', label: 'Buổi chiều', icon: Sun, color: 'bg-blue-100 text-blue-800', times: timeOptions.filter(t => t.period === 'afternoon') },
    { key: 'evening', label: 'Buổi tối', icon: Sunset, color: 'bg-purple-100 text-purple-800', times: timeOptions.filter(t => t.period === 'evening') },
    { key: 'night', label: 'Ban đêm', icon: Moon, color: 'bg-gray-100 text-gray-800', times: timeOptions.filter(t => t.period === 'night') }
  ]

  const handleTimeSelect = (time: string) => {
    onChange(time)
  }

  const handleCustomTimeSubmit = () => {
    if (customTime) {
      onChange(customTime)
      setShowCustom(false)
      setCustomTime('')
    }
  }

  const getActivityTypeLabel = () => {
    switch (activityType) {
      case 'medication': return 'uống thuốc'
      case 'exercise': return 'tập thể dục'
      case 'appointment': return 'hẹn khám'
      default: return 'hoạt động'
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Clock className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-medium">Chọn giờ {getActivityTypeLabel()}</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Chọn khung giờ phù hợp hoặc nhập giờ cụ thể
        </p>
      </div>

      {/* Recommended Times for Activity Type */}
      {activityType !== 'other' && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-green-800 flex items-center gap-2">
              ⭐ Khung giờ được đề xuất cho {getActivityTypeLabel()}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-2 gap-2">
              {getRecommendedTimes().slice(0, 6).map((option) => {
                const IconComponent = option.icon
                return (
                  <Button
                    key={option.time}
                    variant={value === option.time ? "default" : "outline"}
                    onClick={() => handleTimeSelect(option.time)}
                    className={`h-auto p-3 flex flex-col items-center gap-1 ${
                      value === option.time ? 'bg-green-600 text-white' : 'hover:bg-green-100'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span className="font-medium text-sm">{option.time}</span>
                    <span className="text-xs opacity-80">{option.label}</span>
                  </Button>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Period Selection */}
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          {periods.map((period) => {
            const IconComponent = period.icon
            return (
              <Button
                key={period.key}
                variant={selectedPeriod === period.key ? "default" : "outline"}
                onClick={() => setSelectedPeriod(selectedPeriod === period.key ? '' : period.key)}
                className={`h-16 flex flex-col items-center gap-1 ${
                  selectedPeriod === period.key ? 'bg-blue-600 text-white' : ''
                }`}
              >
                <IconComponent className="w-5 h-5" />
                <span className="text-sm font-medium">{period.label}</span>
              </Button>
            )
          })}
        </div>

        {/* Time Options for Selected Period */}
        {selectedPeriod && (
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-2 gap-2">
                {periods.find(p => p.key === selectedPeriod)?.times.map((option) => {
                  const IconComponent = option.icon
                  return (
                    <Button
                      key={option.time}
                      variant={value === option.time ? "default" : "outline"}
                      onClick={() => handleTimeSelect(option.time)}
                      className={`h-auto p-3 flex flex-col items-start gap-1 text-left ${
                        value === option.time ? 'bg-blue-600 text-white' : ''
                      }`}
                    >
                      <div className="flex items-center gap-2 w-full">
                        <IconComponent className="w-4 h-4 flex-shrink-0" />
                        <span className="font-semibold text-base">{option.time}</span>
                      </div>
                      <div className="text-xs opacity-80">
                        <div>{option.label}</div>
                        <div>{option.description}</div>
                      </div>
                    </Button>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Custom Time Input */}
      <div className="border-t pt-4">
        {!showCustom ? (
          <Button
            variant="outline"
            onClick={() => setShowCustom(true)}
            className="w-full"
          >
            <Clock className="w-4 h-4 mr-2" />
            Nhập giờ khác
          </Button>
        ) : (
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="p-4">
              <div className="space-y-3">
                <label className="text-sm font-medium text-orange-800">
                  Nhập giờ cụ thể (ví dụ: 14:30)
                </label>
                <div className="flex gap-2">
                  <input
                    type="time"
                    value={customTime}
                    onChange={(e) => setCustomTime(e.target.value)}
                    className="flex-1 px-3 py-2 border rounded-md text-base"
                  />
                  <Button onClick={handleCustomTimeSubmit} disabled={!customTime}>
                    Chọn
                  </Button>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => {
                    setShowCustom(false)
                    setCustomTime('')
                  }}
                  className="w-full text-orange-700"
                >
                  Hủy
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Selected Time Display */}
      {value && (
        <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center justify-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            <span className="font-medium text-blue-800">
              Đã chọn: {value}
            </span>
          </div>
          <p className="text-sm text-blue-600 mt-1">
            {timeOptions.find(opt => opt.time === value)?.description || 'Giờ tùy chỉnh'}
          </p>
        </div>
      )}
    </div>
  )
}