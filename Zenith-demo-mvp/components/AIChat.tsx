'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Avatar, AvatarFallback } from './ui/avatar'
import { Textarea } from './ui/textarea'
import { Input } from './ui/input'
import { ScrollArea } from './ui/scroll-area'
import { ArrowLeft, Mic, MicOff, Send, Volume2, Heart, Baby, User, Stethoscope } from 'lucide-react'

interface AIContact {
  id: string
  name: string
  avatar?: string
  personality: string
  description: string
  isDefault: boolean
  lastMessage?: string
  lastActive?: Date
  messageCount: number
}

interface Message {
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp: Date
  isVoice?: boolean
}

interface AIChatProps {
  aiContact: AIContact
  onBack: () => void
  onUpdateLastMessage: (message: string) => void
}

export function AIChat({ aiContact, onBack, onUpdateLastMessage }: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: getWelcomeMessage(aiContact),
      timestamp: new Date(),
    }
  ])
  const [inputText, setInputText] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [microphonePermission, setMicrophonePermission] = useState<'granted' | 'denied' | 'pending'>('pending')
  const [speechError, setSpeechError] = useState<string | null>(null)
  const [interimTranscript, setInterimTranscript] = useState('')
  const [finalTranscript, setFinalTranscript] = useState('')
  
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
            // Tự gửi tin nhắn khi nhận diện xong
            handleSendMessage(text)

            // Phải xác nhận trước khi gửi
            // setInputText(text)
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

  function getWelcomeMessage(ai: AIContact): string {
    return `Chào bạn ạ! Mình là một trợ lý AI, không có tên riêng đâu ạ. Bạn có thể gọi mình là "trợ lý" hoặc "bạn đồng hành" cũng được ạ.\n\nMình ở đây để giúp đỡ bạn mọi việc, từ trả lời câu hỏi, trò chuyện, cho đến hỗ trợ những công việc nhỏ nhặt khác. Nếu có gì cần mình giúp, bạn cứ nói nhé. Mình luôn sẵn lòng ạ.`
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

  const getAIResponse = async (prompt: string): Promise<string> => {
    try {
      const response = await fetch("/chat", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      })
      const data = await response.json()
      return data.reply || 'Tôi không hiểu câu hỏi của bạn. Bạn có thể nói rõ hơn không?'
    } catch (error) {
      console.error('Lỗi gọi AI API:', error)
      return 'Đã xảy ra lỗi khi kết nối với AI. Vui lòng thử lại sau.'
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
    }

    setMessages(prev => [...prev, userMessage])
    setInputText('')

    const AIResponse = await getAIResponse(content)
    const AIMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: 'ai',
      content: AIResponse,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, AIMessage])
    onUpdateLastMessage(AIResponse)
  }
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])
  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4" />
            </Button>

            <Avatar className="w-12 h-12">
              <AvatarFallback className="text-xl">
                {aiContact.avatar || '🤖'}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex items-center gap-2">
                <CardTitle className="text-lg">{aiContact.name}</CardTitle>
              </div>
              <CardDescription>{aiContact.description}</CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Chat Interface */}
      <Card>
        <CardContent className="p-4">
          {/* Chat Messages */}
          <div ref={scrollAreaRef} className="h-96 mb-4 border rounded-lg p-4 space-y-4 overflow-y-auto">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.type === 'ai' && (
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="text-sm">
                        {aiContact.avatar || '🤖'}
                      </AvatarFallback>
                    </Avatar>
                  )}

                  <div className={`max-w-xs lg:max-w-md ${message.type === 'user' ? 'order-first' : ''}`}>
                    <div
                        className={`rounded-lg px-4 py-2 ${
                          message.type === 'user'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                      <p className="text-sm">{message.content}</p>
                      {message.type === 'ai' && (
                        <Button
                          onClick={() => speakText(message.content)}
                          variant="ghost"
                          size="sm"
                          className="mt-2 h-6 p-1 text-xs"
                        >
                          <Volume2 className="w-3 h-3" />
                          Phát âm
                        </Button>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {message.timestamp.toLocaleTimeString('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>

                  {message.type === 'user' && (
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-green-100 text-green-600 text-sm">
                        Bạn
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Voice Listening Status */}
          {isListening && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-green-700">Đang nghe... Hãy nói điều bạn muốn</span>
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="flex flex-col items-center gap-4 mt-4">
            {/* Mic Button */}
            <Button
              onClick={() => (isListening ? stopListening() : startListening())}
              className="w-18 h-18 rounded-full shadow-lg"
              variant={isListening ? "destructive" : "outline"}
            >
              {isListening ? <MicOff className="w-24 h-24" /> : <Mic className="w-24 h-24" />}
            </Button>
            <span className="text-xs text-muted-foreground">
              {isListening ? 'Đang nghe...' : 'Nhấn để bắt đầu nói'}
            </span>

            {/* Text Input and Send */}
            <div className="flex w-full gap-2">
              <Input
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`Nhắn tin với ${aiContact.name}...`}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1"
              />
              <Button onClick={() => handleSendMessage()} disabled={!inputText.trim()}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* AI Personality */}
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>Tính cách:</strong> {aiContact.personality}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}