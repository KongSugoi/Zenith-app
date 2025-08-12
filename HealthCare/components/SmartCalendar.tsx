'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Calendar } from './ui/calendar'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { CalendarDays, Plus, Pill, Activity, Stethoscope, Bell, Clock} from 'lucide-react'
import { vi } from 'date-fns/locale'
import { PageWrapper } from './PageWrapper'
import { toast } from 'sonner'

interface CalendarEvent {
  id: string
  title: string
  description: string
  date: Date
  time: string
  type: 'medication' | 'appointment' | 'exercise' | 'other'
  completed?: boolean
  snoozedUntil?: Date
}

interface SmartCalendarProps {
  onBackToMenu?: () => void
}

export function SmartCalendar({ onBackToMenu }: SmartCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    time: ''
  })
  const [isAddingEvent, setIsAddingEvent] = useState(false)

  const eventTypes = {
    medication: { icon: Pill, label: 'Thuốc', color: 'bg-blue-100 text-blue-800 border-blue-200' },
    appointment: { icon: Stethoscope, label: 'Hẹn khám', color: 'bg-red-100 text-red-800 border-red-200' },
    exercise: { icon: Activity, label: 'Tập luyện', color: 'bg-green-100 text-green-800 border-green-200' },
    other: { icon: CalendarDays, label: 'Khác', color: 'bg-gray-100 text-gray-800 border-gray-200' }
  }

  // Initialize events with some scheduled for today and near future for testing
  const initializeEvents = useCallback(() => {
    const now = new Date()
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000)
    
    const initialEvents: CalendarEvent[] = [
      {
        id: '1',
        title: 'Uống thuốc huyết áp',
        description: 'Losartan 50mg - 1 viên',
        date: now,
        time: '08:00',
        type: 'medication'
      },
      {
        id: '2',
        title: 'Tập thể dục buổi chiều',
        description: 'Đi bộ 30 phút trong công viên',
        date: now,
        time: '16:00',
        type: 'exercise'
      },
      {
        id: '3',
        title: 'Khám định kỳ tim mạch',
        description: 'Bác sĩ Nguyễn Văn C - Bệnh viện Tim Mạch',
        date: tomorrow,
        time: '14:00',
        type: 'appointment'
      },
      {
        id: '4',
        title: 'Uống thuốc tiểu đường',
        description: 'Metformin 500mg - 2 viên',
        date: now,
        time: '19:30',
        type: 'medication'
      }
    ]

    setEvents(initialEvents)
  }, [])

  useEffect(() => {
    initializeEvents()
  }, [initializeEvents])

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
      type: 'other'
    }

    setEvents(prev => [...prev, event])
    setNewEvent({ title: '', description: '', time: '' })
    setIsAddingEvent(false)
    toast.success('✅ Đã thêm sự kiện mới!')
  }

  const handleCompleteEvent = (eventId: string) => {
    setEvents(prev => prev.map(event => 
      event.id === eventId ? { ...event, completed: !event.completed } : event
    ))
    
    const event = events.find(e => e.id === eventId)
    if (event) {
      toast.success(event.completed ? '↩️ Đã bỏ đánh dấu hoàn thành' : '✅ Đã đánh dấu hoàn thành')
    }
  }

  // Add quick test event function
  // const addQuickTestEvent = () => {
  //   const now = new Date()
  //   const testTime = new Date(now.getTime() + 10000) // 10 seconds from now
    
  //   const testEvent: CalendarEvent = {
  //     id: `test-${Date.now()}`,
  //     title: 'Test Nhắc Nhở',
  //     description: 'Đây là sự kiện test để kiểm tra thông báo',
  //     date: now,
  //     time: testTime.toTimeString().slice(0, 5),
  //     type: 'medication'
  //   }

  //   setEvents(prev => [...prev, testEvent])
  //   toast.success(`🧪 Đã thêm test event - sẽ thông báo sau 10 giây`)
  // }

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

  return (
    <PageWrapper title="Lịch Sức Khỏe" onBackToMenu={onBackToMenu}>
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Today's Summary với Notification Status */}
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

          {/* <Card>
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
          </Card> */}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Calendar */}
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
                <div className="space-y-3 p-3 border rounded-lg bg-gray-50">
                  <Input
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                    placeholder="Tiêu đề sự kiện"
                  />
                  
                  <Textarea
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                    placeholder="Mô tả (tùy chọn)"
                    rows={2}
                  />
                  
                  <Input
                    type="time"
                    value={newEvent.time}
                    onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                  />
                  
                  <div className="flex gap-2">
                    <Button onClick={handleAddEvent} className="flex-1">
                      Thêm
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setIsAddingEvent(false)
                        setNewEvent({ title: '', description: '', time: '' })
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

          {/* Events for Selected Date */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>
                {selectedDate?.toLocaleDateString('vi-VN', { 
                  weekday: 'long', 
                  day: 'numeric', 
                  month: 'long' 
                })}
              </CardTitle>
              <CardDescription>Lịch trình trong ngày này</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {selectedDate && getEventsForDate(selectedDate).map((event) => {
                  const EventIcon = eventTypes[event.type].icon
                  const isDue = isEventDue(event)
                  
                  return (
                    <div 
                      key={event.id} 
                      className={`p-3 border rounded-lg transition-colors ${
                        isDue ? 'bg-red-50 border-red-200 animate-pulse' : 
                        event.completed ? 'bg-green-50 border-green-200' : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <EventIcon className={`w-4 h-4 mt-1 flex-shrink-0 ${
                          isDue ? 'text-red-600' : 
                          event.completed ? 'text-green-600' : 'text-muted-foreground'
                        }`} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <p className={`text-sm font-medium ${
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
                          <p className="text-xs text-muted-foreground mb-1">{event.time}</p>
                          {event.description && (
                            <p className="text-xs text-muted-foreground">{event.description}</p>
                          )}
                          {event.snoozedUntil && (
                            <p className="text-xs text-orange-600 mt-1">
                              ⏰ Đã hoãn đến {event.snoozedUntil.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          )}
                        </div>
                        <Button
                          size="sm"
                          variant={event.completed ? "default" : "outline"}
                          onClick={() => handleCompleteEvent(event.id)}
                          className="flex-shrink-0"
                        >
                          {event.completed ? "✓" : "○"}
                        </Button>
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
                      className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                        isDue ? 'bg-red-50 border border-red-200' : 'hover:bg-gray-50'
                      }`}
                    >
                      <EventIcon className={`w-4 h-4 ${
                        isDue ? 'text-red-600' : 'text-muted-foreground'
                      }`} />
                      <div className="flex-1">
                        <p className={`text-sm ${isDue ? 'font-medium text-red-800' : ''}`}>
                          {event.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {isToday ? 'Hôm nay' : event.date.toLocaleDateString('vi-VN')} - {event.time}
                        </p>
                      </div>
                      {isDue && (
                        <Bell className="w-3 h-3 text-red-500 animate-pulse" />
                      )}
                      {event.completed && (
                        <span className="text-green-600 text-xs">✓</span>
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
        </div>
      </div>
    </PageWrapper>
  )
}