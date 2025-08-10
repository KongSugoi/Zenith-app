'use client'

import { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card'
import { Badge } from './ui/badge'
import { Calendar } from './ui/calendar'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { CalendarDays, Plus, Bell, Pill, Activity, Stethoscope } from 'lucide-react'
import { vi } from 'date-fns/locale'
import { PageWrapper } from './PageWrapper'
import { LocalNotifications } from '@capacitor/local-notifications' // Thêm import

export interface CalendarEvent {
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
  eventData?: { time: string; message: string };
}

export function SmartCalendar({ onBackToMenu, eventData }: SmartCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [isAddingEvent, setIsAddingEvent] = useState(false);
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
  const [_isDialogOpen, setIsDialogOpen] = useState(false)

  const eventTypes = {
    medication: { icon: Pill, label: 'Uống thuốc', color: 'bg-blue-100 text-blue-800' },
    appointment: { icon: Stethoscope, label: 'Cuộc hẹn', color: 'bg-red-100 text-red-800' },
    exercise: { icon: Activity, label: 'Tập thể dục', color: 'bg-green-100 text-green-800' },
    measurement: { icon: Bell, label: 'Đo chỉ số', color: 'bg-purple-100 text-purple-800' },
    other: { icon: CalendarDays, label: 'Khác', color: 'bg-gray-100 text-gray-800' }
  }

  // const recurringOptions = {
  //   none: 'Không lặp lại',
  //   daily: 'Hàng ngày',
  //   weekly: 'Hàng tuần',
  //   monthly: 'Hàng tháng'
  // }

  // Hàm đặt thông báo từ danh sách sự kiện (dùng âm hệ thống)
  const scheduleEventNotifications = async (eventsList: CalendarEvent[]) => {
    const perm = await LocalNotifications.requestPermissions();
    if (perm.display !== 'granted') return;

    await LocalNotifications.cancel({ notifications: [] });

    const notifications = eventsList.map((event, index) => {
      const [hours, minutes] = event.time.split(':').map(Number);
      const eventDateTime = new Date(event.date);
      eventDateTime.setHours(hours, minutes, 0, 0);

      const remindTime = new Date(eventDateTime.getTime() - event.reminder * 60 * 1000);

      return {
        title: event.title,
        body: event.description || '',
        id: index + 1,
        schedule: { at: remindTime },
        smallIcon: 'ic_stat_icon' // không có sound → dùng âm mặc định hệ thống
      };
    });

    await LocalNotifications.schedule({ notifications });
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => 
      event.date.toDateString() === date.toDateString()
    ).sort((a, b) => a.time.localeCompare(b.time))
  }

  const getTodayEvents = () => {
    const today = new Date()
    return getEventsForDate(today)
  }

  // const getUpcomingEvents = () => {
  //   const now = new Date()
  //   const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    
  //   return events
  //     .filter(event => event.date >= today)
  //     .sort((a, b) => {
  //       if (a.date.getTime() === b.date.getTime()) {
  //         return a.time.localeCompare(b.time)
  //       }
  //       return a.date.getTime() - b.date.getTime()
  //     })
  //     .slice(0, 5)
  // }

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

    const updatedEvents = [...events, event]
    setEvents(updatedEvents)
    setNewEvent({ title: '', description: '', time: '', type: 'other', recurring: 'none', reminder: 15 })
    setIsDialogOpen(false)

    scheduleEventNotifications(updatedEvents)
  }

  const handleCompleteEvent = (eventId: string) => {
    const updatedEvents = events.map(event => 
      event.id === eventId ? { ...event, completed: !event.completed } : event
    )
    setEvents(updatedEvents)
    scheduleEventNotifications(updatedEvents)
  }

  useEffect(() => {
    if (eventData) {
      const { time, message } = eventData;
      let type: CalendarEvent['type'] = 'other';
      const messageLower = message.toLowerCase();
      if (messageLower.includes('uống thuốc') || messageLower.includes('thuốc')) {
        type = 'medication';
      } else if (messageLower.includes('khám') || messageLower.includes('bác sĩ')) {
        type = 'appointment';
      } else if (messageLower.includes('tập') || messageLower.includes('thể dục')) {
        type = 'exercise';
      } else if (messageLower.includes('đo') || messageLower.includes('huyết áp') || messageLower.includes('chỉ số')) {
        type = 'measurement';
      }

      const event: CalendarEvent = {
        id: Date.now().toString(),
        title: message,
        description: '',
        date: selectedDate || new Date(),
        time,
        type,
        recurring: 'none',
        reminder: 15
      };

      const updatedEvents = [...events, event];
      setEvents(updatedEvents);
      scheduleEventNotifications(updatedEvents);
    }
  }, [eventData, selectedDate]);

  // Khi mở app, đăng ký lại thông báo
  useEffect(() => {
    scheduleEventNotifications(events);
  }, []);

  return (
    <PageWrapper title="Lịch Thông Minh" onBackToMenu={onBackToMenu}>
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Today's Summary */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <CalendarDays className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Lịch trình hôm nay</p>
                <p className="text-2xl font-medium">{getTodayEvents().length} sự kiện</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Calendar */}
          <Card>
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
                        setNewEvent({ title: '', description: '', time: '', type: 'other', recurring: 'none', reminder: 15 })
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
          <Card>
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
                  return (
                    <div key={event.id} className="p-3 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-start gap-3">
                        <EventIcon className="w-4 h-4 mt-1 text-muted-foreground flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <p className="text-sm font-medium">{event.title}</p>
                            <Badge className={eventTypes[event.type].color} variant="secondary">
                              {eventTypes[event.type].label}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mb-1">{event.time}</p>
                          {event.description && (
                            <p className="text-xs text-muted-foreground">{event.description}</p>
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
        </div>
      </div>
    </PageWrapper>
  )
}
