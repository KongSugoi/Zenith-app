'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { NotificationAlert } from './NotificationAlert'
import { toast } from 'sonner'

interface CalendarEvent {
  id: string
  title: string
  description: string
  date: Date
  time: string
  type: 'medication' | 'appointment' | 'exercise' | 'other'
  completed?: boolean
}

interface NotificationManagerProps {
  children: React.ReactNode
}

export function NotificationManager({ children }: NotificationManagerProps) {
  const [activeNotifications, setActiveNotifications] = useState<CalendarEvent[]>([])
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Simplified mock events với short titles
  const initializeMockEvents = useCallback(() => {
    const now = new Date()
    const testEvents: CalendarEvent[] = [
      {
        id: '1',
        title: 'Uống thuốc huyết áp',
        description: 'Losartan 50mg',
        date: now,
        time: new Date(now.getTime() + 10000).toTimeString().slice(0, 5), // 10 seconds
        type: 'medication'
      },
      {
        id: '2',
        title: 'Đo huyết áp',
        description: 'Đo và ghi chép',
        date: now,
        time: new Date(now.getTime() + 30000).toTimeString().slice(0, 5), // 30 seconds
        type: 'other'
      },
      {
        id: '3',
        title: 'Tập thể dục',
        description: 'Đi bộ 20 phút',
        date: now,
        time: new Date(now.getTime() + 60000).toTimeString().slice(0, 5), // 1 minute
        type: 'exercise'
      },
      {
        id: '4',
        title: 'Uống thuốc tiểu đường',
        description: 'Metformin 500mg',
        date: now,
        time: '08:00',
        type: 'medication'
      },
      {
        id: '5',
        title: 'Khám tim mạch',
        description: 'Bác sĩ tim mạch',
        date: new Date(now.getTime() + 24 * 60 * 60 * 1000),
        time: '14:00',
        type: 'appointment'
      }
    ]

    setEvents(testEvents)
    console.log('Simplified mock events initialized:', testEvents)
  }, [])

  // Check if it's time for any events
  const checkEventTimes = useCallback(() => {
    const now = new Date()
    const currentDate = now.toDateString()

    const dueEvents = events.filter(event => {
      if (event.completed) return false

      const eventDate = event.date.toDateString()
      if (eventDate === currentDate) {
        const [eventHour, eventMinute] = event.time.split(':').map(Number)
        const eventTimeMs = eventHour * 60 * 60 * 1000 + eventMinute * 60 * 1000
        
        const currentHour = now.getHours()
        const currentMinute = now.getMinutes()
        const currentTimeMs = currentHour * 60 * 60 * 1000 + currentMinute * 60 * 1000
        
        const timeDiff = Math.abs(eventTimeMs - currentTimeMs)
        return timeDiff <= 60000 // 1 minute tolerance
      }

      return false
    })

    if (dueEvents.length > 0) {
      const newEvents = dueEvents.filter(event => 
        !activeNotifications.some(active => active.id === event.id)
      )

      if (newEvents.length > 0) {
        console.log('New due events found:', newEvents)
        setActiveNotifications(prev => [...prev, ...newEvents])
        
        // Simple toast
        toast.info(`⏰ ${newEvents.length} nhắc nhở cần thực hiện`)
      }
    }
  }, [events, activeNotifications])

  useEffect(() => {
    initializeMockEvents()
  }, [initializeMockEvents])

  useEffect(() => {
    if (events.length > 0) {
      checkEventTimes()
      
      checkIntervalRef.current = setInterval(() => {
        checkEventTimes()
      }, 10000)

      console.log('Notification checking started')
    }

    return () => {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current)
      }
    }
  }, [events, checkEventTimes])

  const handleConfirmNotification = useCallback(() => {
    // Mark all active events as completed
    const eventIds = activeNotifications.map(event => event.id)
    setEvents(prev => prev.map(event => 
      eventIds.includes(event.id) ? { ...event, completed: true } : event
    ))
    
    setActiveNotifications([])
    toast.success('✅ Đã xác nhận')
  }, [activeNotifications])

  // Testing functions
  const addTestEvent = useCallback((offsetSeconds: number = 5) => {
    const now = new Date()
    const testEvent: CalendarEvent = {
      id: `test-${Date.now()}`,
      title: 'Test nhắc nhở',
      description: 'Test',
      date: now,
      time: new Date(now.getTime() + offsetSeconds * 1000).toTimeString().slice(0, 5),
      type: 'other'
    }
    
    setEvents(prev => [...prev, testEvent])
    toast.info(`🧪 Test event sau ${offsetSeconds}s`)
  }, [])

  useEffect(() => {
    (window as any).addTestEvent = addTestEvent;
    (window as any).triggerTestNotification = () => {
      const testEvent: CalendarEvent = {
        id: `immediate-test-${Date.now()}`,
        title: 'Test ngay lập tức',
        description: 'Test immediate',
        date: new Date(),
        time: new Date().toTimeString().slice(0, 5),
        type: 'medication'
      }
      setActiveNotifications([testEvent])
    }
    return () => {
      delete (window as any).addTestEvent;
      delete (window as any).triggerTestNotification;
    }
  }, [addTestEvent])

  return (
    <>
      {children}
      
      {/* Show minimalist notification when active */}
      {activeNotifications.length > 0 && (
        <NotificationAlert
          events={activeNotifications}
          onConfirm={handleConfirmNotification}
        />
      )}
    </>
  )
}