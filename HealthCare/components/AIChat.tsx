'use client'

import { useState, ReactNode } from 'react'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'
import { Avatar, AvatarFallback } from './ui/avatar'
import { Input } from './ui/input'
import { 
  Activity, Calendar, Heart, BookOpen, 
  Mic, MicOff, Type, Send, LogOut, Settings, User 
} from "lucide-react"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "./ui/dropdown-menu"
import { SpeechRecognition } from '@capacitor-community/speech-recognition'
import { TextToSpeech } from '@capacitor-community/text-to-speech'

interface Message {
  isUser: boolean
  text: ReactNode
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp: Date
  isVoice?: boolean
}

interface ChatResponse {
  reply: string
  command?: string
}

interface AIChatProps {
  user: {
    id: string
    name: string
    avatar?: string
    onLogout: () => void
  }
  onNavigate: (page: string) => void
}

export function AIChat({ user, onNavigate }: AIChatProps) {
  const currentTime = new Date()
  const [_messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: getWelcomeMessage(),
      timestamp: new Date(),
      isUser: false,
      text: getWelcomeMessage(),
    }
  ])
  const [inputText, setInputText] = useState('')
  const [showTextInput, setShowTextInput] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [_isSpeaking, setIsSpeaking] = useState(false)

  function getWelcomeMessage(): string {
    return `Cháu chào bác ạ! Cháu là một trợ lý AI, không có tên riêng đâu ạ. Bác có thể gọi cháu là "trợ lý" hoặc "bạn đồng hành" cũng được ạ.\n\nCháu ở đây để giúp đỡ bác mọi việc, từ trả lời câu hỏi, trò chuyện, cho đến hỗ trợ những công việc nhỏ nhặt khác. Nếu có gì cần cháu giúp, bác cứ nói nhé. Cháu luôn sẵn lòng ạ.`
  }

  const startListening = async () => {
    const perm = await SpeechRecognition.checkPermissions()
    if (perm.speechRecognition !== 'granted') {
      await SpeechRecognition.requestPermissions()
    }

    await SpeechRecognition.removeAllListeners()

    SpeechRecognition.addListener('partialResults', (data: any) => {
      if (data.matches && data.matches.length > 0) {
        setInputText(data.matches[0])
        // If you want to treat the first match as final, you can trigger send here:
        // setIsListening(false)
        // setInputText('')
        // handleSendMessage(data.matches[0])
      }
    })

    // Remove the 'result' event listener as it's not supported by the plugin.

    setIsListening(true)
    await SpeechRecognition.start({
      language: 'vi-VN',
      maxResults: 1,
      prompt: 'Hãy nói gì đó...',
      partialResults: true,
      popup: false
    })
  }

  const stopListening = async () => {
    await SpeechRecognition.stop()
    setIsListening(false)
  }

  // ✅ Text to speech
  const speakText = async (text: string) => {
    if (!text) return
    setIsSpeaking(true)
    try {
      await TextToSpeech.speak({
        text,
        lang: 'vi-VN',
        rate: 1.0,
        pitch: 1.0,
        volume: 1.0,
        category: 'playback',
      })
    } catch (err) {
      console.error('TTS error:', err)
    }
    setIsSpeaking(false)
  }

  // ✅ Call AI backend
  const getAIResponse = async (prompt: string): Promise<ChatResponse> => {
    try {
      const response = await fetch("/chat", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      })
      return await response.json()
    } catch (error) {
      console.error('AI API error:', error)
      return { reply: 'Đã xảy ra lỗi khi kết nối với AI. Vui lòng thử lại sau.' }
    }
  }

  const handleSendMessage = async (messageContent?: string) => {
    const content = messageContent || inputText.trim()
    if (!content) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date(),
      isUser: true,
      text: content,
    }

    setMessages(prev => [...prev, userMessage])
    setInputText('')

    const AIResponse = await getAIResponse(content)

    // debug:
    addLog(`📩 AI: ${JSON.stringify(AIResponse)}`);

    const AIMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: 'ai',
      content: AIResponse.reply,
      timestamp: new Date(),
      isUser: false,
      text: AIResponse.reply,
    }

    setMessages(prev => [...prev, AIMessage])
    await speakText(AIResponse.reply)
  }

  const getGreeting = () => "Xin chào"
  const formatDate = (date: Date) => date.toLocaleDateString("vi-VN")
  const formatTime = (date: Date) => date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })

  // For debug:
  const [debugLogs, setDebugLogs] = useState<string[]>([]);

  const addLog = (msg: string) => {
    setDebugLogs(prev => [...prev, `${new Date().toLocaleTimeString()} - ${msg}`]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-indigo-100 p-3 sm:p-4">
      <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-white/20">
          <div>
            <h1 className="text-2xl font-medium text-gray-800">ZenCare AI</h1>
            <p className="text-lg text-gray-600">{getGreeting()}, {user.name}</p>
            <p className="text-sm text-gray-500">{formatDate(currentTime)} • {formatTime(currentTime)}</p>
          </div>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-12 w-12 rounded-full">
                <Avatar className="h-10 w-10 border-2 border-white shadow-md">
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onNavigate('profile')}>
                <User className="mr-2 h-4 w-4" /> Hồ sơ của tôi
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onNavigate('settings')}>
                <Settings className="mr-2 h-4 w-4" /> Cài đặt
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={user.onLogout} className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" /> Đăng xuất
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Quick Action Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <Button onClick={() => onNavigate("heart-rate")} className="h-40 flex flex-col justify-center bg-white border-2 border-red-400 text-red-600">
            <Activity className="h-12 w-12" /> Nhịp Tim
          </Button>
          <Button onClick={() => onNavigate("calendar")} className="h-40 flex flex-col justify-center bg-white border-2 border-green-400 text-green-600">
            <Calendar className="h-12 w-12" /> Lịch
          </Button>
          <Button onClick={() => onNavigate("health-data")} className="h-40 flex flex-col justify-center bg-white border-2 border-blue-400 text-blue-600">
            <Heart className="h-12 w-12" /> Sức Khỏe
          </Button>
          <Button onClick={() => onNavigate("health-journal")} className="h-40 flex flex-col justify-center bg-white border-2 border-purple-400 text-purple-600">
            <BookOpen className="h-12 w-12" /> Nhật Ký
          </Button>
        </div>

        {/* Debug Panel */}
        <div className="fixed bottom-0 left-0 right-0 bg-black text-green-400 text-xs p-2 max-h-40 overflow-y-auto">
          <div className="flex justify-between items-center mb-1">
            <span className="font-bold">Debug Console</span>
            <button 
              className="text-red-400 text-xs underline"
              onClick={() => setDebugLogs([])}
            >
              Xóa log
            </button>
          </div>
          {debugLogs.map((log, idx) => (
            <div key={idx}>{log}</div>
          ))}
        </div>

        {/* Voice/Text Input */}
        <Card className="bg-white border-2 border-blue-300 shadow-md">
          <CardContent className="p-4 text-center space-y-4">
            <div className="flex justify-center space-x-2">
              <Button variant={!showTextInput ? "default" : "outline"} onClick={() => setShowTextInput(false)}>
                <Mic className="h-4 w-4 mr-2" /> Giọng nói
              </Button>
              <Button variant={showTextInput ? "default" : "outline"} onClick={() => setShowTextInput(true)}>
                <Type className="h-4 w-4 mr-2" /> Văn bản
              </Button>
            </div>

            {!showTextInput ? (
              <Button
                size="lg"
                onClick={isListening ? stopListening : startListening}
                className={`h-32 w-32 rounded-full text-white ${isListening ? 'bg-red-500 animate-pulse' : 'bg-blue-500 hover:bg-blue-600'}`}
              >
                {isListening ? <MicOff className="h-12 w-12" /> : <Mic className="h-12 w-12" />}
              </Button>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSendMessage()
                }}
                className="flex space-x-2"
              >
                <Input value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder="Nhập yêu cầu..." className="flex-1" />
                <Button type="submit" disabled={!inputText.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
