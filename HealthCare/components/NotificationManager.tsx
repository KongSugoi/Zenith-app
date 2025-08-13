'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { NotificationAlert } from './NotificationAlert'
import { toast } from 'sonner'

export interface CalendarEvent {
  id: string
  title: string
  description: string
  date: Date
  time: string
  type: 'medication' | 'appointment' | 'exercise' | 'other'
  completed?: boolean
  snoozedUntil?: Date
}

interface NotificationManagerProps {
  children: React.ReactNode
  events: CalendarEvent[]
  onUpdateEvent: (eventId: string, updates: Partial<CalendarEvent>) => void
}

export function NotificationManager({ children, events, onUpdateEvent }: NotificationManagerProps) {
  const [activeNotifications, setActiveNotifications] = useState<CalendarEvent[]>([])
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null)

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
        
        // Simple toast notification
        const eventTitles = newEvents.map(e => e.title).join(', ')
        toast.info(`⏰ ${newEvents.length} nhắc nhở: ${eventTitles}`)
      }
    }
  }, [events, activeNotifications])

  // Start checking for due events
  useEffect(() => {
    if (events.length > 0) {
      // Initial check
      checkEventTimes()
      
      // Set up interval to check every 10 seconds
      checkIntervalRef.current = setInterval(() => {
        checkEventTimes()
      }, 10000)

      console.log('Notification checking started with', events.length, 'events')
    }

    return () => {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current)
      }
    }
  }, [events, checkEventTimes])

  // Handle notification confirmation
  const handleConfirmNotification = useCallback(() => {
    // Mark all active events as completed
    activeNotifications.forEach(event => {
      onUpdateEvent(event.id, { completed: true })
    })
    
    setActiveNotifications([])
    toast.success(`✅ Đã xác nhận ${activeNotifications.length} nhắc nhở`)
  }, [activeNotifications, onUpdateEvent])

  // Testing functions for development
  const addTestEvent = useCallback((offsetSeconds: number = 5) => {
    const now = new Date()
    const testEvent: CalendarEvent = {
      id: `test-notification-${Date.now()}`,
      title: 'Test nhắc nhở ngay',
      description: 'Test notification',
      date: now,
      time: new Date(now.getTime() + offsetSeconds * 1000).toTimeString().slice(0, 5),
      type: 'other'
    }
    
    // This would need to be handled by parent component in real implementation
    console.log('Would add test event:', testEvent)
    toast.info(`🧪 Test notification sau ${offsetSeconds}s (cần add qua SmartCalendar)`)
  }, [])

  const triggerTestNotification = useCallback(() => {
    const testEvent: CalendarEvent = {
      id: `immediate-test-${Date.now()}`,
      title: 'Test ngay lập tức',
      description: 'Test immediate notification',
      date: new Date(),
      time: new Date().toTimeString().slice(0, 5),
      type: 'medication'
    }
    setActiveNotifications([testEvent])
  }, [])

  // Expose test functions to window for debug panel
  useEffect(() => {
    (window as any).addTestEvent = addTestEvent;
    (window as any).triggerTestNotification = triggerTestNotification;
    return () => {
      delete (window as any).addTestEvent;
      delete (window as any).triggerTestNotification;
    }
  }, [addTestEvent, triggerTestNotification])

  // Debug logging
  useEffect(() => {
    console.log('NotificationManager: Events updated', {
      totalEvents: events.length,
      pendingEvents: events.filter(e => !e.completed).length,
      todayEvents: events.filter(e => e.date.toDateString() === new Date().toDateString()).length,
      activeNotifications: activeNotifications.length
    })
  }, [events, activeNotifications])

  return (
    <>
      {children}
      
      {/* Show notification alert when active */}
      {activeNotifications.length > 0 && (
        <NotificationAlert
          events={activeNotifications}
          onConfirm={handleConfirmNotification}
        />
      )}
    </>
  )
}