import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string | number): string {
  const d = new Date(date)
  return d.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export function formatTime(date: Date | string | number): string {
  const d = new Date(date)
  return d.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

export function formatDateTime(date: Date | string | number): string {
  return `${formatDate(date)} ${formatTime(date)}`
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout)
    }
    
    timeout = setTimeout(() => {
      func(...args)
    }, wait)
  }
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

export function isEmpty(value: any): boolean {
  if (value == null) return true
  if (typeof value === 'string' || Array.isArray(value)) return value.length === 0
  if (typeof value === 'object') return Object.keys(value).length === 0
  return false
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

export function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + '...'
}

// Health-specific utilities
export function calculateBMI(weight: number, height: number): number {
  return Number((weight / ((height / 100) ** 2)).toFixed(1))
}

export function getBMICategory(bmi: number): string {
  if (bmi < 18.5) return 'Thiếu cân'
  if (bmi < 25) return 'Bình thường'
  if (bmi < 30) return 'Thừa cân'
  return 'Béo phì'
}

export function getBloodPressureCategory(systolic: number, diastolic: number): string {
  if (systolic < 120 && diastolic < 80) return 'Bình thường'
  if (systolic < 130 && diastolic < 80) return 'Huyết áp cao giai đoạn 1'
  if (systolic < 140 || diastolic < 90) return 'Huyết áp cao giai đoạn 1'
  if (systolic < 180 || diastolic < 120) return 'Huyết áp cao giai đoạn 2'
  return 'Khủng hoảng huyết áp'
}

export function getHeartRateZone(heartRate: number, age: number): string {
  const maxHR = 220 - age
  const percentage = (heartRate / maxHR) * 100
  
  if (percentage < 50) return 'Nghỉ ngơi'
  if (percentage < 60) return 'Khởi động'
  if (percentage < 70) return 'Đốt mỡ'
  if (percentage < 80) return 'Aerobic'
  if (percentage < 90) return 'Anaerobic'
  return 'Tối đa'
}