'use client'

import { useState, useRef, useEffect, ReactNode } from 'react'
import { Button } from './ui/button'
import { Card, CardContent} from './ui/card'
import { Avatar, AvatarFallback } from './ui/avatar'
import { Input } from './ui/input'
import { 
  Activity, Calendar, Heart, BookOpen, 
  Mic, MicOff, Type, Send, LogOut, Settings, User 
} from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "./ui/dropdown-menu";

// interface AIContact {
//   id: string
//   name: string
//   avatar?: string
//   personality: string
//   description: string
//   isDefault: boolean
//   lastMessage?: string
//   lastActive?: Date
//   messageCount: number
// }

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

export function AIChat({user, onNavigate}: AIChatProps) {
  
  const currentTime = new Date();
  // const defaultAIContact: AIContact = {
  //   id: 'default',
  //   name: 'Trợ lý AI',
  //   avatar: '🤖',
  //   personality: 'Tận tâm, kiên nhẫn và thân thiện',
  //   description: 'Trợ lý AI cho người cao tuổi',
  //   isDefault: true,
  //   messageCount: 0
  // }

  // // const currentAIContact = defaultAIContact

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: getWelcomeMessage(),
      timestamp: new Date(),
      isUser: true,
      text: getWelcomeMessage(),
    }
  ])
  const [inputText, setInputText] = useState('')
  const [showTextInput, setShowTextInput] = useState(false);
  const [isListening, setIsListening] = useState(false)
  const [_isSpeaking, setIsSpeaking] = useState(false)
  const [microphonePermission, setMicrophonePermission] = useState<'granted' | 'denied' | 'pending'>('pending')
  const [_speechError, setSpeechError] = useState<string | null>(null)
  const [_interimTranscript, setInterimTranscript] = useState('')
  const [_finalTranscript, setFinalTranscript] = useState('')

  const recognitionRef = useRef<any>(null)
  const speechSynthesisRef = useRef<SpeechSynthesis | null>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      speechSynthesisRef.current = window.speechSynthesis
    }
  }, [])

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
    }
  }, [messages])
  
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  useEffect(() => {
    let latestFinalTranscript = ''

    const initializeSpeechRecognition = async () => {
      try {
        if (typeof window === 'undefined' || !('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
          setSpeechError('Trình duyệt không hỗ trợ nhận diện giọng nói')
          return
        }

        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
          stream.getTracks().forEach(track => track.stop())
          setMicrophonePermission('granted')
          setSpeechError(null)
        } catch {
          setMicrophonePermission('denied')
          setSpeechError('Không có quyền truy cập microphone. Vui lòng cấp quyền trong cài đặt trình duyệt.')
          return
        }

        const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
        recognitionRef.current = new SpeechRecognition()
        recognitionRef.current.continuous = true
        recognitionRef.current.interimResults = true
        recognitionRef.current.lang = 'vi-VN'

        recognitionRef.current.onresult = (event: any) => {
          let interim = ''
          let final = ''
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript
            if (event.results[i].isFinal) {
              final += transcript
            } else {
              interim += transcript
            }
          }
          latestFinalTranscript += final
          setInterimTranscript(interim)
          setFinalTranscript(latestFinalTranscript)
        }

        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error)
          setIsListening(false)
          switch (event.error) {
            case 'not-allowed':
              setSpeechError('Không có quyền truy cập microphone. Vui lòng cấp quyền và thử lại.')
              setMicrophonePermission('denied')
              break
            case 'no-speech':
              setSpeechError('Không phát hiện giọng nói. Vui lòng thử lại.')
              break
            case 'audio-capture':
              setSpeechError('Không thể truy cập microphone. Kiểm tra kết nối microphone.')
              break
            case 'network':
              setSpeechError('Lỗi mạng. Kiểm tra kết nối internet.')
              break
            default:
              setSpeechError('Lỗi nhận diện giọng nói. Vui lòng thử lại.')
          }
        }

        recognitionRef.current.onend = () => {
          setIsListening(false)
          const text = latestFinalTranscript.trim()
          if (text) {
            setInputText(text)
            handleSendMessage(text)
          }
          latestFinalTranscript = ''
          setFinalTranscript('')
          setInterimTranscript('')
        }

      } catch (error) {
        console.error('Error initializing speech recognition:', error)
        setSpeechError('Không thể khởi tạo nhận diện giọng nói')
      }
    }

    initializeSpeechRecognition()

    return () => {
      if (recognitionRef.current) recognitionRef.current.stop()
    }
  }, [])

  function getWelcomeMessage(): string {
    return `Cháu chào bác ạ! Cháu là một trợ lý AI, không có tên riêng đâu ạ. Bác có thể gọi cháu là "trợ lý" hoặc "bạn đồng hành" cũng được ạ.\n\nCháu ở đây để giúp đỡ bác mọi việc, từ trả lời câu hỏi, trò chuyện, cho đến hỗ trợ những công việc nhỏ nhặt khác. Nếu có gì cần cháu giúp, bác cứ nói nhé. Cháu luôn sẵn lòng ạ.`
  }

  const startListening = () => {
    if (microphonePermission === 'denied') {
      setSpeechError('Vui lòng cấp quyền microphone trong cài đặt trình duyệt và tải lại trang')
      return
    }

    if (recognitionRef.current && !isListening) {
      try {
        setIsListening(true)
        setSpeechError(null)
        setFinalTranscript('')
        setInterimTranscript('')
        recognitionRef.current.start()
      } catch (error) {
        console.error('Error starting speech recognition:', error)
        setIsListening(false)
        setSpeechError('Không thể bắt đầu nhận diện giọng nói')
      }
    }
  }

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    }
  }

  const speakText = (text: string) => {
    if (speechSynthesisRef.current && text) {
      speechSynthesisRef.current.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'vi-VN'
      utterance.rate = 0.9
      utterance.pitch = 1
      utterance.volume = 0.8
      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = () => setIsSpeaking(false)
      speechSynthesisRef.current.speak(utterance)
    }
  }

  const getAIResponse = async (prompt: string): Promise<ChatResponse> => {
    try {
      const response = await fetch("/chat", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      })
      const data: ChatResponse = await response.json()
      return data || 'Tôi không hiểu câu hỏi của bạn. Bạn có thể nói rõ hơn không?'
    } catch (error) {
      console.error('Lỗi gọi AI API:', error)
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
    const AIMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: 'ai',
      content: AIResponse.reply,
      timestamp: new Date(),
      isUser: false,
      text: AIResponse.reply,
    }
    speakText(AIResponse.reply)

    // if (AIResponse.command) {
    //     executeCommand(AIResponse.command)
    // }
    
    setMessages(prev => [...prev, AIMessage])
  }

  const getGreeting = () => "Xin chào";
  const formatDate = (date: Date) => date.toLocaleDateString("vi-VN");
  const formatTime = (date: Date) => date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-indigo-100 p-3 sm:p-4">
      <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 shadow-sm border border-white/20">
          <div className="space-y-0.5 sm:space-y-1">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-medium text-gray-800">
              ZenCare AI
            </h1>
            <p className="text-base sm:text-lg text-gray-600">
              {getGreeting()}, {user.name}
            </p>
            <p className="text-xs sm:text-sm text-gray-500">
              {formatDate(currentTime)} • {formatTime(currentTime)}
            </p>
          </div>
          
          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="relative h-12 w-12 sm:h-16 sm:w-16 rounded-full hover:bg-white/50 transition-colors"
              >
                <Avatar className="h-10 w-10 sm:h-14 sm:w-14 border-2 border-white shadow-md">
                 
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm sm:text-lg">
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuItem 
                onClick={() => onNavigate('profile')}
                className="cursor-pointer"
              >
                <User className="mr-2 h-4 w-4" />
                <span>Hồ sơ của tôi</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onNavigate('settings')}
                className="cursor-pointer"
              >
                <Settings className="mr-2 h-4 w-4" />
                <span>Cài đặt</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={user.onLogout}
                className="cursor-pointer text-red-600 focus:text-red-600"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Đăng xuất</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Quick Action Buttons */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full">
          <Button 
            onClick={() => onNavigate("heart-rate")}
            className="h-40 sm:h-44 lg:h-48 flex flex-col items-center justify-center space-y-3 sm:space-y-4 bg-white hover:bg-red-50 border-2 border-red-400 text-red-600 font-semibold shadow-md transition-all duration-200 hover:scale-105"
          >
            <Activity className="h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16" />
            <span className="text-lg sm:text-xl lg:text-2xl font-semibold">Nhịp Tim</span>
          </Button>

          <Button 
            onClick={() => onNavigate("calendar")}
            className="h-40 sm:h-44 lg:h-48 flex flex-col items-center justify-center space-y-3 sm:space-y-4 bg-white hover:bg-green-50 border-2 border-green-400 text-green-600 font-semibold shadow-md transition-all duration-200 hover:scale-105"
          >
            <Calendar className="h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16" />
            <span className="text-lg sm:text-xl lg:text-2xl font-semibold">Lịch</span>
          </Button>

          <Button 
            onClick={() => onNavigate("health-data")}
            className="h-40 sm:h-44 lg:h-48 flex flex-col items-center justify-center space-y-3 sm:space-y-4 bg-white hover:bg-blue-50 border-2 border-blue-400 text-blue-600 font-semibold shadow-md transition-all duration-200 hover:scale-105"
          >
            <Heart className="h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16" />
            <span className="text-lg sm:text-xl lg:text-2xl font-semibold">Sức Khỏe</span>
          </Button>

          <Button 
            onClick={() => onNavigate("health-journal")}
            className="h-40 sm:h-44 lg:h-48 flex flex-col items-center justify-center space-y-3 sm:space-y-4 bg-white hover:bg-purple-50 border-2 border-purple-400 text-purple-600 font-semibold shadow-md transition-all duration-200 hover:scale-105"
          >
            <BookOpen className="h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16" />
            <span className="text-lg sm:text-xl lg:text-2xl font-semibold">Nhật Ký</span>
          </Button>
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
                className={`h-32 w-32 rounded-full text-white shadow-xl ${
                  isListening ? 'bg-red-500 animate-pulse' : 'bg-blue-500 hover:bg-blue-600'
                }`}
              >
                {isListening ? <MicOff className="h-12 w-12" /> : <Mic className="h-12 w-12" />}
              </Button>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex space-x-2"
              >
                <Input
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Nhập yêu cầu..."
                  className="flex-1"
                />
                <Button type="submit" disabled={!inputText.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}