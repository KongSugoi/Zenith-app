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
  snoozedUntil?: Date
}

interface HealthAlert {
  id: string;
  type: 'heart_rate_high' | 'heart_rate_low' | 'calendar_event';
  title: string;
  description: string;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high';
  acknowledged?: boolean;
}

interface NotificationManagerProps {
  children: React.ReactNode
  events: CalendarEvent[]
  onUpdateEvent: (eventId: string, updates: Partial<CalendarEvent>) => void
  healthAlerts?: HealthAlert[]
  onAcknowledgeAlert?: (alertId: string) => void
}

export function NotificationManager({ 
  children, 
  events, 
  onUpdateEvent,
  healthAlerts = [],
  onAcknowledgeAlert
}: NotificationManagerProps) {
  const [activeCalendarNotifications, setActiveCalendarNotifications] = useState<CalendarEvent[]>([])
  const [activeHealthAlerts, setActiveHealthAlerts] = useState<HealthAlert[]>([])
  const [currentNotificationType, setCurrentNotificationType] = useState<'calendar' | 'health' | null>(null)
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const prevHealthAlertsRef = useRef<HealthAlert[]>([])

  // Check if it's time for any calendar events
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
        !activeCalendarNotifications.some(active => active.id === event.id)
      )

      if (newEvents.length > 0) {
        console.log('New due calendar events found:', newEvents)
        setActiveCalendarNotifications(prev => [...prev, ...newEvents])
        
        if (currentNotificationType === null || currentNotificationType === 'calendar') {
          setCurrentNotificationType('calendar')
        }
        
        // Toast notification for calendar events
        const eventTitles = newEvents.map(e => e.title).join(', ')
        toast.info(`⏰ ${newEvents.length} nhắc nhở lịch: ${eventTitles}`)
      }
    }
  }, [events, activeCalendarNotifications, currentNotificationType])

  // Watch for new health alerts and trigger immediate notifications
  useEffect(() => {
    const prevAlerts = prevHealthAlertsRef.current
    const newAlerts = healthAlerts.filter(alert => 
      !alert.acknowledged && 
      !prevAlerts.some(prev => prev.id === alert.id) &&
      !activeHealthAlerts.some(active => active.id === alert.id)
    )

    if (newAlerts.length > 0) {
      console.log('New health alerts detected:', newAlerts)
      setActiveHealthAlerts(prev => [...prev, ...newAlerts])
      
      // Health alerts take immediate priority
      setCurrentNotificationType('health')
      
      // No additional toast here since App.tsx already shows one
      console.log('Health alert notification triggered')
    }

    // Update the ref for next comparison
    prevHealthAlertsRef.current = healthAlerts
  }, [healthAlerts, activeHealthAlerts])

  // Start checking for calendar events
  useEffect(() => {
    if (events.length > 0) {
      // Initial check
      checkEventTimes()
      
      // Set up interval to check every 10 seconds for calendar events
      checkIntervalRef.current = setInterval(() => {
        checkEventTimes()
      }, 10000)

      console.log('Calendar notification checking started with', events.length, 'events')
    }

    return () => {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current)
      }
    }
  }, [events, checkEventTimes])

  // Handle calendar notification confirmation
  const handleConfirmCalendarNotification = useCallback(() => {
    // Mark all active calendar events as completed
    activeCalendarNotifications.forEach(event => {
      onUpdateEvent(event.id, { completed: true })
    })
    
    setActiveCalendarNotifications([])
    
    // Check if there are health alerts to show next
    if (activeHealthAlerts.length > 0) {
      setCurrentNotificationType('health')
    } else {
      setCurrentNotificationType(null)
    }
    
    toast.success(`✅ Đã xác nhận ${activeCalendarNotifications.length} nhắc nhở lịch`)
  }, [activeCalendarNotifications, onUpdateEvent, activeHealthAlerts])

  // Handle health alert confirmation
  const handleConfirmHealthAlert = useCallback(() => {
    // Acknowledge all active health alerts
    if (onAcknowledgeAlert) {
      activeHealthAlerts.forEach(alert => {
        onAcknowledgeAlert(alert.id)
      })
    }
    
    setActiveHealthAlerts([])
    
    // Check if there are calendar notifications to show next
    if (activeCalendarNotifications.length > 0) {
      setCurrentNotificationType('calendar')
    } else {
      setCurrentNotificationType(null)
    }
    
    toast.success(`✅ Đã xác nhận ${activeHealthAlerts.length} cảnh báo sức khỏe`)
  }, [activeHealthAlerts, onAcknowledgeAlert, activeCalendarNotifications])

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
    
    console.log('Would add test event:', testEvent)
    toast.info(`🧪 Test calendar notification sau ${offsetSeconds}s`)
  }, [])

  const triggerTestNotification = useCallback(() => {
    const testEvent: CalendarEvent = {
      id: `immediate-test-${Date.now()}`,
      title: 'Test lịch ngay lập tức',
      description: 'Test immediate calendar notification',
      date: new Date(),
      time: new Date().toTimeString().slice(0, 5),
      type: 'medication'
    }
    setActiveCalendarNotifications([testEvent])
    setCurrentNotificationType('calendar')
  }, [])

  const triggerTestHealthAlert = useCallback(() => {
    const testAlert: HealthAlert = {
      id: `test-health-${Date.now()}`,
      type: Math.random() > 0.5 ? 'heart_rate_high' : 'heart_rate_low',
      title: Math.random() > 0.5 ? 'Test Nhịp tim cao' : 'Test Nhịp tim thấp',
      description: 'Đây là cảnh báo test cho hệ thống nhịp tim',
      timestamp: new Date(),
      severity: 'high'
    }
    setActiveHealthAlerts([testAlert])
    setCurrentNotificationType('health')
    toast.warning(`⚠️ Test Health Alert: ${testAlert.title}`)
  }, [])

  // Expose test functions to window for debug panel
  useEffect(() => {
    (window as any).addTestEvent = addTestEvent;
    (window as any).triggerTestNotification = triggerTestNotification;
    (window as any).triggerTestHealthAlert = triggerTestHealthAlert;
    return () => {
      delete (window as any).addTestEvent;
      delete (window as any).triggerTestNotification;
      delete (window as any).triggerTestHealthAlert;
    }
  }, [addTestEvent, triggerTestNotification, triggerTestHealthAlert])

  // Debug logging
  useEffect(() => {
    console.log('NotificationManager: State updated', {
      totalEvents: events.length,
      pendingEvents: events.filter(e => !e.completed).length,
      todayEvents: events.filter(e => e.date.toDateString() === new Date().toDateString()).length,
      activeCalendarNotifications: activeCalendarNotifications.length,
      totalHealthAlerts: healthAlerts.length,
      unacknowledgedHealthAlerts: healthAlerts.filter(a => !a.acknowledged).length,
      activeHealthAlerts: activeHealthAlerts.length,
      currentNotificationType
    })
  }, [events, activeCalendarNotifications, healthAlerts, activeHealthAlerts, currentNotificationType])

  // Determine what to show - health alerts have priority
  const showHealthNotification = currentNotificationType === 'health' && activeHealthAlerts.length > 0
  const showCalendarNotification = currentNotificationType === 'calendar' && activeCalendarNotifications.length > 0 && !showHealthNotification

  return (
    <>
      {children}
      
      {/* Show health alert notification - PRIORITY */}
      {showHealthNotification && (
        <NotificationAlert
          events={activeHealthAlerts.map(alert => ({
            id: alert.id,
            title: alert.title,
            description: alert.description,
            time: alert.timestamp.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
            type: 'other' as const,
            date: alert.timestamp
          }))}
          onConfirm={handleConfirmHealthAlert}
        />
      )}

      {/* Show calendar notification alert */}
      {showCalendarNotification && (
        <NotificationAlert
          events={activeCalendarNotifications}
          onConfirm={handleConfirmCalendarNotification}
        />
      )}
    </>
  )
}