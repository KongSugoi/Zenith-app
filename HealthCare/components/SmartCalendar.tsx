'use client'

import { useState } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Calendar } from './ui/calendar'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { CalendarDays, Plus, Pill, Activity, Stethoscope, Bell, Clock, TestTube } from 'lucide-react'
import { vi } from 'date-fns/locale'
import { PageWrapper } from './PageWrapper'
import { SeniorTimePicker } from './SeniorTimePicker'
import { toast } from 'sonner'
import { CalendarEvent } from './NotificationManager'

interface SmartCalendarProps {
  events: CalendarEvent[]
  onAddEvent: (event: CalendarEvent) => void
  onUpdateEvent: (eventId: string, updates: Partial<CalendarEvent>) => void
  onDeleteEvent?: (eventId: string) => void
  onBackToMenu?: () => void
}

export function SmartCalendar({ 
  events, 
  onAddEvent, 
  onUpdateEvent, 
  onDeleteEvent,
  onBackToMenu 
}: SmartCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    time: '',
    type: 'other' as 'medication' | 'appointment' | 'exercise' | 'other'
  })
  const [isAddingEvent, setIsAddingEvent] = useState(false)

  const eventTypes = {
    medication: { icon: Pill, label: 'Thuốc', color: 'bg-blue-100 text-blue-800 border-blue-200' },
    appointment: { icon: Stethoscope, label: 'Hẹn khám', color: 'bg-red-100 text-red-800 border-red-200' },
    exercise: { icon: Activity, label: 'Tập luyện', color: 'bg-green-100 text-green-800 border-green-200' },
    other: { icon: CalendarDays, label: 'Khác', color: 'bg-gray-100 text-gray-800 border-gray-200' }
  }

  const getEventsForDate = (date: Date) => {
    return events.filter(event => 
      event.date.toDateString() === date.toDateString()
    ).sort((a, b) => a.time.localeCompare(b.time))
  }

  const getTodayEvents = () => {
    const today = new Date()
    return getEventsForDate(today)
  }

  const getUpcomingEvents = () => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    
    return events
      .filter(event => event.date >= today)
      .sort((a, b) => {
        if (a.date.getTime() === b.date.getTime()) {
          return a.time.localeCompare(b.time)
        }
        return a.date.getTime() - b.date.getTime()
      })
      .slice(0, 5)
  }

  const handleAddEvent = () => {
    if (!selectedDate || !newEvent.title || !newEvent.time) {
      toast.error('Vui lòng điền đầy đủ thông tin')
      return
    }

    const event: CalendarEvent = {
      id: Date.now().toString(),
      title: newEvent.title,
      description: newEvent.description,
      date: selectedDate,
      time: newEvent.time,
      type: newEvent.type
    }

    onAddEvent(event)
    setNewEvent({ title: '', description: '', time: '', type: 'other' })
    setIsAddingEvent(false)
  }

  const handleCompleteEvent = (eventId: string) => {
    const event = events.find(e => e.id === eventId)
    if (event) {
      onUpdateEvent(eventId, { completed: !event.completed })
      toast.success(event.completed ? '↩️ Đã bỏ đánh dấu hoàn thành' : '✅ Đã đánh dấu hoàn thành')
    }
  }

  // Add quick test event function
  const addQuickTestEvent = () => {
    const now = new Date()
    const testTime = new Date(now.getTime() + 10000) // 10 seconds from now
    
    const testEvent: CalendarEvent = {
      id: `test-${Date.now()}`,
      title: 'Test Nhắc Nhở',
      description: 'Đây là sự kiện test để kiểm tra thông báo',
      date: now,
      time: testTime.toTimeString().slice(0, 5),
      type: 'medication'
    }

    onAddEvent(testEvent)
    toast.success(`🧪 Đã thêm test event - sẽ thông báo sau 10 giây`)
  }

  const isEventDue = (event: CalendarEvent) => {
    const now = new Date()
    const eventDate = event.date.toDateString()
    const todayDate = now.toDateString()
    
    if (eventDate === todayDate) {
      const [eventHour, eventMinute] = event.time.split(':').map(Number)
      const eventTime = eventHour * 60 + eventMinute
      const currentTime = now.getHours() * 60 + now.getMinutes()
      
      return Math.abs(eventTime - currentTime) <= 1 // Within 1 minute
    }
    return false
  }

  // Get time description for display
  const getTimeDescription = (time: string) => {
    const hour = parseInt(time.split(':')[0])
    if (hour >= 5 && hour < 9) return '🌅 Sáng sớm'
    if (hour >= 9 && hour < 12) return '☀️ Buổi sáng'
    if (hour >= 12 && hour < 14) return '🌞 Buổi trưa'
    if (hour >= 14 && hour < 18) return '☀️ Buổi chiều'
    if (hour >= 18 && hour < 21) return '🌅 Buổi tối'
    if (hour >= 21 || hour < 5) return '🌙 Ban đêm'
    return ''
  }

  return (
    <PageWrapper title="Lịch Sức Khỏe" onBackToMenu={onBackToMenu}>
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Today's Summary với Live Data */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <CalendarDays className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Hôm nay</p>
                  <p className="text-2xl font-medium">{getTodayEvents().length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Clock className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Hoàn thành</p>
                  <p className="text-2xl font-medium">{events.filter(e => e.completed).length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Bell className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Sắp tới</p>
                  <p className="text-2xl font-medium">{getUpcomingEvents().length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <TestTube className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Test</p>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={addQuickTestEvent}
                    className="mt-1 text-xs"
                  >
                    Thêm Test Event
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Calendar & Add Event */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-blue-600" />
                Lịch
              </CardTitle>
              <CardDescription>Chọn ngày để xem lịch trình</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center mb-4">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  locale={vi}
                  className="rounded-md border"
                />
              </div>
              
              {!isAddingEvent ? (
                <Button 
                  onClick={() => setIsAddingEvent(true)} 
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Thêm sự kiện
                </Button>
              ) : (
                <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
                  {/* Event Title */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Tên sự kiện</label>
                    <Input
                      value={newEvent.title}
                      onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                      placeholder="Ví dụ: Uống thuốc huyết áp"
                      className="text-base"
                    />
                  </div>
                  
                  {/* Event Type */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Loại sự kiện</label>
                    <Select 
                      value={newEvent.type} 
                      onValueChange={(value: 'medication' | 'appointment' | 'exercise' | 'other') => 
                        setNewEvent({...newEvent, type: value})
                      }
                    >
                      <SelectTrigger className="text-base">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="medication">💊 Thuốc</SelectItem>
                        <SelectItem value="appointment">🏥 Hẹn khám</SelectItem>
                        <SelectItem value="exercise">🏃 Tập luyện</SelectItem>
                        <SelectItem value="other">📅 Khác</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Description */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Ghi chú (tùy chọn)</label>
                    <Textarea
                      value={newEvent.description}
                      onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                      placeholder="Ví dụ: Losartan 50mg - 1 viên"
                      rows={2}
                      className="text-base"
                    />
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button onClick={handleAddEvent} className="flex-1" disabled={!newEvent.title || !newEvent.time}>
                      Thêm
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setIsAddingEvent(false)
                        setNewEvent({ title: '', description: '', time: '', type: 'other' })
                      }}
                      className="flex-1"
                    >
                      Hủy
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Senior-Friendly Time Picker */}
          {isAddingEvent && (
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  Chọn thời gian
                </CardTitle>
                <CardDescription>Chọn khung giờ phù hợp</CardDescription>
              </CardHeader>
              <CardContent>
                <SeniorTimePicker
                  value={newEvent.time}
                  onChange={(time) => setNewEvent({...newEvent, time})}
                  activityType={newEvent.type}
                />
              </CardContent>
            </Card>
          )}

          {/* Events for Selected Date */}
          <Card className={isAddingEvent ? "lg:col-span-2 xl:col-span-1" : "lg:col-span-1"}>
            <CardHeader>
              <CardTitle>
                {selectedDate?.toLocaleDateString('vi-VN', { 
                  weekday: 'long', 
                  day: 'numeric', 
                  month: 'long' 
                })}
              </CardTitle>
              <CardDescription>
                Lịch trình trong ngày này ({selectedDate && getEventsForDate(selectedDate).length} sự kiện)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {selectedDate && getEventsForDate(selectedDate).map((event) => {
                  const EventIcon = eventTypes[event.type].icon
                  const isDue = isEventDue(event)
                  
                  return (
                    <div 
                      key={event.id} 
                      className={`p-4 border rounded-lg transition-colors ${
                        isDue ? 'bg-red-50 border-red-200 animate-pulse' : 
                        event.completed ? 'bg-green-50 border-green-200' : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <EventIcon className={`w-5 h-5 mt-1 flex-shrink-0 ${
                          isDue ? 'text-red-600' : 
                          event.completed ? 'text-green-600' : 'text-muted-foreground'
                        }`} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-2">
                            <p className={`font-medium ${
                              event.completed ? 'line-through text-gray-500' : ''
                            }`}>
                              {event.title}
                            </p>
                            <Badge className={eventTypes[event.type].color} variant="secondary">
                              {eventTypes[event.type].label}
                            </Badge>
                            {isDue && (
                              <Badge className="bg-red-100 text-red-700 border-red-200">
                                <Bell className="w-3 h-3 mr-1" />
                                Đến giờ
                              </Badge>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium text-blue-600">{event.time}</span>
                            <span className="text-sm text-muted-foreground">
                              {getTimeDescription(event.time)}
                            </span>
                          </div>
                          
                          {event.description && (
                            <p className="text-sm text-muted-foreground mb-2">{event.description}</p>
                          )}
                          
                          {event.snoozedUntil && (
                            <p className="text-xs text-orange-600">
                              ⏰ Đã hoãn đến {event.snoozedUntil.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-col gap-1">
                          <Button
                            size="sm"
                            variant={event.completed ? "default" : "outline"}
                            onClick={() => handleCompleteEvent(event.id)}
                            className="flex-shrink-0"
                          >
                            {event.completed ? "✓" : "○"}
                          </Button>
                          {onDeleteEvent && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => onDeleteEvent(event.id)}
                              className="flex-shrink-0 text-red-600 hover:bg-red-50"
                            >
                              🗑️
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
                
                {selectedDate && getEventsForDate(selectedDate).length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <CalendarDays className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-sm">Không có sự kiện nào trong ngày này</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          {!isAddingEvent && (
            <Card className="lg:col-span-2 xl:col-span-1">
              <CardHeader>
                <CardTitle>Sự kiện sắp tới</CardTitle>
                <CardDescription>Events gần nhất có thông báo</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {getUpcomingEvents().map((event) => {
                    const EventIcon = eventTypes[event.type].icon
                    const isToday = event.date.toDateString() === new Date().toDateString()
                    const isDue = isEventDue(event)
                    
                    return (
                      <div 
                        key={event.id} 
                        className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                          isDue ? 'bg-red-50 border border-red-200' : 'hover:bg-gray-50'
                        }`}
                      >
                        <EventIcon className={`w-5 h-5 ${
                          isDue ? 'text-red-600' : 'text-muted-foreground'
                        }`} />
                        <div className="flex-1">
                          <p className={`font-medium ${isDue ? 'text-red-800' : ''}`}>
                            {event.title}
                          </p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{isToday ? 'Hôm nay' : event.date.toLocaleDateString('vi-VN')}</span>
                            <span>•</span>
                            <span className="font-medium">{event.time}</span>
                            <span>{getTimeDescription(event.time)}</span>
                          </div>
                        </div>
                        {isDue && (
                          <Bell className="w-4 h-4 text-red-500 animate-pulse" />
                        )}
                        {event.completed && (
                          <span className="text-green-600">✓</span>
                        )}
                      </div>
                    )
                  })}
                  
                  {getUpcomingEvents().length === 0 && (
                    <div className="text-center py-4 text-muted-foreground">
                      <p className="text-sm">Không có sự kiện sắp tới</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </PageWrapper>
  )
}