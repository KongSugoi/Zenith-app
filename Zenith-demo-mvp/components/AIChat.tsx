'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Avatar, AvatarFallback } from './ui/avatar'
import { Badge } from './ui/badge'
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
  const [isRecording, setIsRecording] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const roleIcons = {
    doctor: Stethoscope,
    child: Baby,
    family: Heart,
    friend: User
  }

  const roleColors = {
    doctor: 'bg-red-100 text-red-800',
    child: 'bg-pink-100 text-pink-800',
    family: 'bg-blue-100 text-blue-800',
    friend: 'bg-green-100 text-green-800'
  }

  useEffect(() => {
    // Scroll to bottom when new messages are added
    if (scrollAreaRef.current) {
      // scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  function getWelcomeMessage(ai: AIContact): string {
    return `Chào bạn ạ! Mình là một trợ lý AI, không có tên riêng đâu ạ. Bạn có thể gọi mình là \"trợ lý\" hoặc \"bạn đồng hành\" cũng được ạ.\n\nMình ở đây để giúp đỡ bạn mọi việc, từ trả lời câu hỏi, trò chuyện, cho đến hỗ trợ những công việc nhỏ nhặt khác. Nếu có gì cần mình giúp, bạn cứ nói nhé. Mình luôn sẵn lòng ạ.`
  }

  const getAIResponse = async (prompt: string): Promise<string> => {
    try {
      const response = await fetch("/chat", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt })
      })
      const data = await response.json()
      return data.reply || 'Tôi không hiểu câu hỏi của bạn. Bạn có thể nói rõ hơn không?'
    } catch (error) {
      console.error('Lỗi gọi AI API:', error)
      return 'Đã xảy ra lỗi khi kết nối với AI. Vui lòng thử lại sau.'
    }
  }

  const handleSendMessage = async () => {
    if (!inputText.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputText,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    const prompt = inputText
    setInputText('')

    const AIResponse = await getAIResponse(prompt)
    const AIMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: 'ai',
      content: AIResponse,
      timestamp: new Date(),
    }

    // setMessages(prev => [...prev, AIMessage])
    setMessages(prev => {
      const newMessages = [...prev, AIMessage]
      console.log('📩 Tất cả tin nhắn sau phản hồi AI:', newMessages)
      return newMessages
    })
    onUpdateLastMessage(AIResponse)
  }

  const handleVoiceRecord = () => {
    if (!isRecording) {
      setIsRecording(true)
      setIsListening(true)
      // Simulate voice recording
      setTimeout(() => {
        setIsRecording(false)
        setIsListening(false)
        // Simulate voice to text based on AI role
        const voiceTexts = {
          doctor: "Gần đây tôi hay bị đau đầu",
          child: "Con nhớ bố mẹ lắm",
          family: "Hôm nay tôi cảm thấy hơi buồn",
          friend: "Thời tiết hôm nay đẹp quá"
        }
        setInputText("Chức năng hiện chưa sẵn sàng!")
      }, 3000)
    } else {
      setIsRecording(false)
      setIsListening(false)
    }
  }

  const handlePlayVoice = (message: Message) => {
    // Simulate text to speech
    alert(`Đang phát âm thanh: "${message.content}"`)
  }

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
          <ScrollArea ref={scrollAreaRef} className="h-96 mb-4 border rounded-lg p-4">
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
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      {message.type === 'ai' && (
                        <Button
                          onClick={() => handlePlayVoice(message)}
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
                        minute: '2-digit' 
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
          </ScrollArea>

          {/* Voice Recording Status */}
          {isListening && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-green-700">Đang nghe... Hãy nói điều bạn muốn</span>
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="flex gap-2">
            <Input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Nhắn tin với ${aiContact.name}...`}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1"
            />
            <Button
              onClick={handleVoiceRecord}
              variant={isRecording ? "destructive" : "outline"}
              size="icon"
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </Button>
            <Button onClick={handleSendMessage} disabled={!inputText.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </div>

          {/* AI Personality Info */}
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