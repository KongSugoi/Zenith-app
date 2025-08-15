'use client'

import { useEffect, useRef, useState } from 'react'
import { Button } from './ui/button'
import { motion, AnimatePresence } from 'framer-motion'

interface NotificationEvent {
  id: string
  title: string
  description: string
  time: string
  type: 'medication' | 'appointment' | 'exercise' | 'other'
  date: Date
}

interface NotificationAlertProps {
  events: NotificationEvent[]
  onConfirm: () => void
  type?: 'calendar' | 'health'
}

export function NotificationAlert({ events, onConfirm, type = 'calendar' }: NotificationAlertProps) {

  const SYNTHESIZE_API = import.meta.env.VITE_SYNTHESIZE_URL;

  const [isPlaying, setIsPlaying] = useState(true)
  const audioContextRef = useRef<AudioContext | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const createNotificationSound = () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
      }
      
      const audioContext = audioContextRef.current
      const now = audioContext.currentTime

      const createBeep = (startTime: number, frequency: number, duration: number, volume: number = 0.3) => {
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()
        
        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)
        
        oscillator.type = 'sine'
        oscillator.frequency.setValueAtTime(frequency, startTime)
        
        gainNode.gain.setValueAtTime(0, startTime)
        gainNode.gain.linearRampToValueAtTime(volume, startTime + 0.01)
        gainNode.gain.linearRampToValueAtTime(0, startTime + duration)
        
        oscillator.start(startTime)
        oscillator.stop(startTime + duration)
      }

      if (type === 'health') {
        // More urgent sound for health alerts: Higher pitch, more frequent
        createBeep(now + 0.1, 1200, 0.2, 0.4)  // First beep - higher pitch
        createBeep(now + 0.4, 1200, 0.2, 0.4)  // Second beep
        createBeep(now + 0.7, 1400, 0.25, 0.5) // Third beep - even higher
      } else {
        // Gentler sound for calendar events
        createBeep(now + 0.1, 800, 0.15)   // First beep
        createBeep(now + 0.35, 800, 0.15)  // Second beep  
        createBeep(now + 0.6, 800, 0.15)   // Third beep
      }

      // Add vibration for mobile
      if ('vibrate' in navigator) {
        const vibrationPattern = type === 'health' 
          ? [300, 100, 300, 100, 300] // More intense for health
          : [200, 100, 200, 100, 200] // Gentler for calendar
        navigator.vibrate(vibrationPattern)
      }

    } catch (error) {
      console.error('Error creating notification sound:', error)
    }
  }

  useEffect(() => {
    if (isPlaying) {
      // Play immediately
      createNotificationSound()

      const speakText = hasMultiple ? `Bạn có ${events.length} thông báo mới` : `Bạn có một thông báo mới: ${mainEvent.title}`
      speakNotification(speakText)
      // Different repeat intervals based on type
      const repeatInterval = type === 'health' ? 1500 : 2000 // Health alerts repeat faster
      
      intervalRef.current = setInterval(() => {
        createNotificationSound()
      }, repeatInterval)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      if (audioContextRef.current) {
        audioContextRef.current.close()
        audioContextRef.current = null
      }
    }
  }, [isPlaying, type])

  const handleConfirm = () => {
    setIsPlaying(false)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    if (audioContextRef.current) {
      audioContextRef.current.close()
      audioContextRef.current = null
    }
    onConfirm()
  }

  // Get the most important event to display (first one)
  const mainEvent = events[0]
  const hasMultiple = events.length > 1

  // Different styling based on notification type
  const getNotificationStyle = () => {
    if (type === 'health') {
      return {
        headerBg: 'bg-red-600',
        headerText: 'text-white',
        borderColor: 'border-red-300',
        buttonColor: 'bg-red-600 hover:bg-red-700',
        icon: '🚨',
        title: 'CẢNH BÁO SỨC KHỎE'
      }
    } else {
      return {
        headerBg: 'bg-blue-500',
        headerText: 'text-white', 
        borderColor: 'border-blue-300',
        buttonColor: 'bg-blue-600 hover:bg-blue-700',
        icon: '⏰',
        title: 'NHẮC NHỞ'
      }
    }
  }

  const style = getNotificationStyle()

  // ✅ Hàm đọc nội dung thông báo
  const speakNotification = async (text: string) => {
    try {
      const res = await fetch(SYNTHESIZE_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: text,
          voice: "sage",
          format: "mp3"
        })
      })
      
      const audioBlob = await res.blob()
      const audioUrl = URL.createObjectURL(audioBlob)
      const audio = new Audio(audioUrl)
      audio.play()

    } catch (error) {
      console.error('TTS error:', error)
    }
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="w-full max-w-sm mx-auto"
        >
          <div className={`bg-white rounded-2xl shadow-2xl border-2 ${style.borderColor} overflow-hidden`}>
            {/* Header with notification type */}
            <div className={`${style.headerBg} px-4 py-3 flex items-center justify-center`}>
              <div className={`flex items-center gap-2 ${style.headerText}`}>
                <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                <span className="font-medium text-sm">{style.icon} {style.title}</span>
                <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 text-center">
              <div className="mb-4">
                <p className="text-lg text-gray-900 leading-tight font-medium">
                  {mainEvent?.title}
                  {hasMultiple && ` (+${events.length - 1} khác)`}
                </p>
                {mainEvent?.time && (
                  <p className="text-sm text-gray-600 mt-1">
                    {mainEvent.time}
                  </p>
                )}
                {type === 'health' && mainEvent?.description && (
                  <p className="text-sm text-gray-700 mt-2 leading-relaxed">
                    {mainEvent.description}
                  </p>
                )}
              </div>

              {/* Single confirmation button */}
              <Button
                onClick={handleConfirm}
                size="lg"
                className={`w-full ${style.buttonColor} text-white font-semibold py-4 text-lg rounded-xl shadow-lg transition-all hover:scale-105`}
              >
                {type === 'health' ? 'XÁC NHẬN' : 'DỪNG'}
              </Button>

              {/* Additional info for health alerts */}
              {type === 'health' && (
                <p className="text-xs text-gray-500 mt-3">
                  Vui lòng tham khảo ý kiến bác sĩ nếu cần thiết
                </p>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
