'use client'

import { useState} from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Avatar, AvatarFallback } from './ui/avatar'
import { Mic, MicOff, Send, Volume2 } from 'lucide-react'
import { Input } from './ui/input'
import { ScrollArea } from './ui/scroll-area'

interface Message {
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp: Date
  isVoice?: boolean
}

export function VoiceChatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Xin chào! Tôi là trợ lý AI của bạn. Tôi có thể giúp bạn theo dõi sức khỏe, đặt lịch nhắc nhở, và trả lời các câu hỏi về y tế. Bạn có thể nói chuyện với tôi bằng giọng nói hoặc gõ tin nhắn.',
      timestamp: new Date(),
    }
  ])
  const [inputText, setInputText] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [isListening, setIsListening] = useState(false)

  const handleSendMessage = () => {
    if (!inputText.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputText,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInputText('')

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = getAIResponse(inputText)
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponse,
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, aiMessage])
    }, 1000)
  }

  const getAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase()
    
    if (input.includes('huyết áp') || input.includes('huyeết áp')) {
      return 'Huyết áp bình thường của người trưởng thành là dưới 120/80 mmHg. Bạn nên đo huyết áp thường xuyên và ghi lại kết quả. Có muốn tôi nhắc bạn đo huyết áp không?'
    } else if (input.includes('thuốc') || input.includes('uống thuốc')) {
      return 'Việc uống thuốc đúng giờ rất quan trọng. Tôi có thể giúp bạn đặt lịch nhắc nhở uống thuốc. Bạn đang uống thuốc gì và vào giờ nào?'
    } else if (input.includes('đau') || input.includes('đau đầu')) {
      return 'Tôi hiểu bạn đang cảm thấy không khỏe. Nếu cơn đau kéo dài hoặc nghiêm trọng, bạn nên liên hệ với bác sĩ. Tôi có thể ghi lại triệu chứng này vào nhật ký sức khỏe của bạn.'
    } else if (input.includes('tập thể dục') || input.includes('vận động')) {
      return 'Tập thể dục nhẹ nhàng hàng ngày rất tốt cho sức khỏe. Tôi khuyên bạn nên đi bộ 30 phút mỗi ngày. Bạn có muốn tôi đặt lịch nhắc nhở tập thể dục không?'
    } else {
      return 'Cảm ơn bạn đã chia sẻ. Tôi sẽ ghi nhận thông tin này. Còn điều gì khác tôi có thể giúp bạn không?'
    }
  }

  const handleVoiceRecord = () => {
    if (!isRecording) {
      setIsRecording(true)
      setIsListening(true)
      // Simulate voice recording
      setTimeout(() => {
        setIsRecording(false)
        setIsListening(false)
        // Simulate voice to text
        const voiceText = "Tôi cảm thấy hơi đau đầu từ sáng nay"
        setInputText(voiceText)
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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mic className="w-5 h-5 text-green-600" />
            Trợ lý AI giọng nói
          </CardTitle>
          <CardDescription>
            Trò chuyện với AI bằng giọng nói hoặc tin nhắn văn bản
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Chat Messages */}
          <ScrollArea className="h-96 mb-4 border rounded-lg p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.type === 'ai' && (
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-blue-100 text-blue-600">AI</AvatarFallback>
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
                      <AvatarFallback className="bg-green-100 text-green-600">U</AvatarFallback>
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
              placeholder="Nhập tin nhắn hoặc sử dụng mic để nói..."
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

          {/* Voice Instructions */}
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>Mẹo:</strong> Bạn có thể hỏi về huyết áp, thuốc men, triệu chứng sức khỏe, 
              hoặc yêu cầu đặt lịch nhắc nhở. AI sẽ trả lời bằng văn bản và có thể phát âm thanh.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}