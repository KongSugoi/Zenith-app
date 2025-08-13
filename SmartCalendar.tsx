'use client'

import { useState } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Calendar } from './ui/calendar'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { CalendarDays, Plus, Bell, Clock, Pill, Activity, Stethoscope } from 'lucide-react'
import { vi } from 'date-fns/locale'
import { PageWrapper } from './PageWrapper'

interface CalendarEvent {
  id: string
  title: string
  description: string
  date: Date
  time: string
  type: 'medication' | 'appointment' | 'exercise' | 'measurement' | 'other'
  recurring: 'none' | 'daily' | 'weekly' | 'monthly'
  reminder: number // minutes before
  completed?: boolean
}

interface SmartCalendarProps {
  onBackToMenu?: () => void;
}

export function SmartCalendar({ onBackToMenu }: SmartCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: '1',
      title: 'Uống thuốc huyết áp',
      description: 'Losartan 50mg',
      date: new Date(),
      time: '08:00',
      type: 'medication',
      recurring: 'daily',
      reminder: 15
    },
    {
      id: '2',
      title: 'Đo huyết áp',
      description: 'Đo huyết áp buổi sáng',
      date: new Date(),
      time: '08:30',
      type: 'measurement',
      recurring: 'daily',
      reminder: 10
    },
    {
      id: '3',
      title: 'Tập thể dục',
      description: 'Đi bộ 30 phút trong công viên',
      date: new Date(),
      time: '16:00',
      type: 'exercise',
      recurring: 'daily',
      reminder: 30
    },
    {
      id: '4',
      title: 'Khám định kỳ',
      description: 'Khám tim mạch tại bệnh viện',
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      time: '14:00',
      type: 'appointment',
      recurring: 'none',
      reminder: 60
    }
  ])

  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    time: '',
    type: 'other',
    recurring: 'none',
    reminder: 15
  })
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const eventTypes = {
    medication: { icon: Pill, label: 'Uống thuốc', color: 'bg-blue-100 text-blue-800' },
    appointment: { icon: Stethoscope, label: 'Cuộc hẹn', color: 'bg-red-100 text-red-800' },
    exercise: { icon: Activity, label: 'Tập thể dục', color: 'bg-green-100 text-green-800' },
    measurement: { icon: Bell, label: 'Đo chỉ số', color: 'bg-purple-100 text-purple-800' },
    other: { icon: CalendarDays, label: 'Khác', color: 'bg-gray-100 text-gray-800' }
  }

  const recurringOptions = {
    none: 'Không lặp lại',
    daily: 'Hàng ngày',
    weekly: 'Hàng tuần',
    monthly: 'Hàng tháng'
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
      alert('Vui lòng điền đầy đủ thông tin')
      return
    }

    const event: CalendarEvent = {
      id: Date.now().toString(),
      title: newEvent.title,
      description: newEvent.description,
      date: selectedDate,
      time: newEvent.time,
      type: newEvent.type as CalendarEvent['type'],
      recurring: newEvent.recurring as CalendarEvent['recurring'],
      reminder: newEvent.reminder
    }

    setEvents(prev => [...prev, event])
    setNewEvent({ title: '', description: '', time: '', type: 'other', recurring: 'none', reminder: 15 })
    setIsDialogOpen(false)
  }

  const handleCompleteEvent = (eventId: string) => {
    setEvents(prev => prev.map(event => 
      event.id === eventId ? { ...event, completed: !event.completed } : event
    ))
  }

  return (
    <PageWrapper title="Lịch Thông Minh" onBackToMenu={onBackToMenu}>
      <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Bell className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Hôm nay</p>
                <p className="text-2xl">{getTodayEvents().length}</p>
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
                <p className="text-sm text-muted-foreground">Đã hoàn thành</p>
                <p className="text-2xl">{events.filter(e => e.completed).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <CalendarDays className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Sắp tới</p>
                <p className="text-2xl">{getUpcomingEvents().length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-blue-600" />
              Lịch thông minh
            </CardTitle>
            <CardDescription>Quản lý lịch trình sức khỏe và nhắc nhở</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="w-full flex justify-center">
                <div className="w-full max-w-xs sm:max-w-sm lg:max-w-full">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    locale={vi}
                    className="rounded-md border w-full mx-auto"
                  />
                </div>
              </div>
              
              <div className="w-full">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
                  <h3 className="text-lg truncate">
                    {selectedDate?.toLocaleDateString('vi-VN', { 
                      weekday: 'long', 
                      day: 'numeric', 
                      month: 'long' 
                    })}
                  </h3>
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm" className="flex-shrink-0">
                        <Plus className="w-4 h-4 mr-2" />
                        Thêm
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Thêm sự kiện mới</DialogTitle>
                        <DialogDescription>
                          Tạo nhắc nhở hoặc lịch trình sức khỏe
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm mb-2 block">Tiêu đề</label>
                          <Input
                            value={newEvent.title}
                            onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                            placeholder="Nhập tiêu đề sự kiện"
                          />
                        </div>
                        
                        <div>
                          <label className="text-sm mb-2 block">Mô tả</label>
                          <Textarea
                            value={newEvent.description}
                            onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                            placeholder="Mô tả chi tiết"
                            rows={2}
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm mb-2 block">Thời gian</label>
                            <Input
                              type="time"
                              value={newEvent.time}
                              onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                            />
                          </div>
                          
                          <div>
                            <label className="text-sm mb-2 block">Loại</label>
                            <Select value={newEvent.type} onValueChange={(value) => setNewEvent({...newEvent, type: value})}>
                              <SelectTrigger>
                                <SelectValue placeholder="Chọn loại" />
                              </SelectTrigger>
                              <SelectContent>
                                {Object.entries(eventTypes).map(([key, type]) => (
                                  <SelectItem key={key} value={key}>
                                    {type.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm mb-2 block">Lặp lại</label>
                            <Select value={newEvent.recurring} onValueChange={(value) => setNewEvent({...newEvent, recurring: value})}>
                              <SelectTrigger>
                                <SelectValue placeholder="Chọn tần suất" />
                              </SelectTrigger>
                              <SelectContent>
                                {Object.entries(recurringOptions).map(([key, label]) => (
                                  <SelectItem key={key} value={key}>
                                    {label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div>
                            <label className="text-sm mb-2 block">Nhắc trước (phút)</label>
                            <Select value={newEvent.reminder.toString()} onValueChange={(value) => setNewEvent({...newEvent, reminder: parseInt(value)})}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="5">5 phút</SelectItem>
                                <SelectItem value="10">10 phút</SelectItem>
                                <SelectItem value="15">15 phút</SelectItem>
                                <SelectItem value="30">30 phút</SelectItem>
                                <SelectItem value="60">1 giờ</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <Button onClick={handleAddEvent} className="w-full">
                          Thêm sự kiện
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {selectedDate && getEventsForDate(selectedDate).map((event) => {
                    const EventIcon = eventTypes[event.type].icon
                    return (
                      <div key={event.id} className="p-3 border rounded-lg hover:bg-gray-50">
                        <div className="flex items-start gap-3">
                          <EventIcon className="w-4 h-4 mt-1 text-muted-foreground flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="text-sm truncate">{event.title}</p>
                              <Badge className={eventTypes[event.type].color} variant="secondary">
                                {eventTypes[event.type].label}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">{event.time}</p>
                            {event.description && (
                              <p className="text-xs text-muted-foreground mt-1 break-words">{event.description}</p>
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
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <CardTitle>Sự kiện sắp tới</CardTitle>
            <CardDescription>5 sự kiện gần nhất</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {getUpcomingEvents().map((event) => {
                const EventIcon = eventTypes[event.type].icon
                const isToday = event.date.toDateString() === new Date().toDateString()
                
                return (
                  <div key={event.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                    <EventIcon className="w-4 h-4 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-sm">{event.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {isToday ? 'Hôm nay' : event.date.toLocaleDateString('vi-VN')} - {event.time}
                      </p>
                    </div>
                    {event.reminder > 0 && (
                      <Bell className="w-3 h-3 text-orange-500" />
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