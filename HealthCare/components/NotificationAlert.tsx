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
}

export function NotificationAlert({ events, onConfirm }: NotificationAlertProps) {

  const SYNTHESIZE_API = import.meta.env.VITE_SYNTHESIZE_URL;

  const [isPlaying, setIsPlaying] = useState(true)
  const audioContextRef = useRef<AudioContext | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const createSimpleAlarmSound = () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
      }
      
      const audioContext = audioContextRef.current
      const now = audioContext.currentTime

      const createBeep = (startTime: number, frequency: number, duration: number) => {
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()
        
        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)
        
        oscillator.type = 'sine'
        oscillator.frequency.setValueAtTime(frequency, startTime)
        
        gainNode.gain.setValueAtTime(0, startTime)
        gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.01)
        gainNode.gain.linearRampToValueAtTime(0, startTime + duration)
        
        oscillator.start(startTime)
        oscillator.stop(startTime + duration)
      }

      createBeep(now + 0.1, 1000, 0.15)
      createBeep(now + 0.35, 1000, 0.15)  
      createBeep(now + 0.6, 1000, 0.15)

      if ('vibrate' in navigator) {
        navigator.vibrate([200, 100, 200, 100, 200])
      }

    } catch (error) {
      console.error('Error creating alarm sound:', error)
    }
  }

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

  useEffect(() => {
    if (isPlaying) {
      // Lấy sự kiện chính
      const mainEvent = events[0]
      const speakText = mainEvent?.title
        ? `${mainEvent.title}. ${mainEvent.description || ''}. Vào lúc ${mainEvent.time}`
        : ''

      // 📢 Đọc thông báo bằng TTS
      if (speakText) {
        speakNotification(speakText)
      }

      // Phát âm báo động
      createSimpleAlarmSound()
      
      // Lặp lại âm thanh
      intervalRef.current = setInterval(() => {
        createSimpleAlarmSound()
      }, 2000)
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (audioContextRef.current) {
        audioContextRef.current.close()
        audioContextRef.current = null
      }
    }
  }, [isPlaying])

  const handleConfirm = () => {
    setIsPlaying(false)
    if (intervalRef.current) clearInterval(intervalRef.current)
    if (audioContextRef.current) {
      audioContextRef.current.close()
      audioContextRef.current = null
    }
    onConfirm()
  }

  const mainEvent = events[0]
  const hasMultiple = events.length > 1

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="w-full max-w-sm mx-auto"
        >
          <div className="bg-white rounded-2xl shadow-2xl border-2 border-red-300 overflow-hidden">
            <div className="bg-red-500 px-4 py-2 flex items-center justify-center">
              <div className="flex items-center gap-2 text-white">
                <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                <span className="font-medium">NHẮC NHỞ</span>
                <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
              </div>
            </div>

            <div className="p-6 text-center">
              <div className="mb-4">
                <p className="text-lg text-gray-900 leading-tight">
                  {mainEvent?.title}
                  {hasMultiple && ` (+${events.length - 1} khác)`}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {mainEvent?.time}
                </p>
              </div>

              <Button
                onClick={handleConfirm}
                size="lg"
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-4 text-lg rounded-xl shadow-lg"
              >
                DỪNG
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
