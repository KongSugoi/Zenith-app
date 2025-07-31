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
  role: 'doctor' | 'child' | 'family' | 'friend'
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
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  function getWelcomeMessage(ai: AIContact): string {
    switch (ai.role) {
      case 'doctor':
        return `Xin chào! Tôi là ${ai.name}. Tôi có thể giúp bạn tư vấn về các vấn đề sức khỏe, thuốc men, và triệu chứng. Hôm nay bạn cảm thấy thế nào?`
      case 'child':
        return `Bố/Mẹ ơi! Con là ${ai.name} đây. Con rất nhớ bố/mẹ và muốn trò chuyện với bố/mẹ. Hôm nay bố/mẹ có khỏe không ạ?`
      case 'family':
        return `Chào bạn! Tôi là ${ai.name}. Tôi luôn quan tâm đến bạn và muốn chia sẻ những câu chuyện thú vị. Bạn có gì muốn kể không?`
      case 'friend':
        return `Chào bạn thân! Tôi là ${ai.name}. Rất vui được trò chuyện với bạn. Có chuyện gì vui hôm nay không?`
      default:
        return `Xin chào! Tôi là ${ai.name}. Rất vui được trò chuyện với bạn!`
    }
  }

  const getAIResponse = (userInput: string, ai: AIContact): string => {
    const input = userInput.toLowerCase()
    
    switch (ai.role) {
      case 'doctor':
        return getDoctorResponse(input, ai)
      case 'child':
        return getChildResponse(input, ai)
      case 'family':
        return getFamilyResponse(input, ai)
      case 'friend':
        return getFriendResponse(input, ai)
      default:
        return 'Cảm ơn bạn đã chia sẻ. Tôi sẽ ghi nhận thông tin này.'
    }
  }

  function getDoctorResponse(input: string, ai: AIContact): string {
    if (input.includes('huyết áp') || input.includes('tim')) {
      return `Về vấn đề tim mạch mà bạn hỏi, tôi khuyên bạn nên đo huyết áp thường xuyên và duy trì chế độ ăn ít muối. Bạn có đang uống thuốc huyết áp không? Tôi có thể giúp bạn đặt lịch nhắc nhở uống thuốc.`
    } else if (input.includes('đau') || input.includes('triệu chứng')) {
      return `Tôi hiểu bạn đang có triệu chứng không thoải mái. Hãy mô tả chi tiết hơn về cơn đau - vị trí, mức độ và thời gian kéo dài. Điều này sẽ giúp tôi tư vấn tốt hơn cho bạn.`
    } else if (input.includes('thuốc') || input.includes('uống')) {
      return `Việc uống thuốc đúng giờ rất quan trọng với người cao tuổi. Bạn đang uống những loại thuốc nào? Tôi có thể giúp bạn thiết lập lịch nhắc nhở và theo dõi tác dụng phụ.`
    } else if (input.includes('ăn') || input.includes('dinh dưỡng')) {
      return `Chế độ dinh dưỡng phù hợp rất quan trọng. Tôi khuyên bạn nên ăn nhiều rau xanh, trái cây, hạn chế đồ ngọt và muối. Bạn có muốn tôi đưa ra thực đơn cụ thể không?`
    } else {
      return `Cảm ơn bạn đã chia sẻ. Như một bác sĩ, tôi luôn sẵn sàng tư vấn về mọi vấn đề sức khỏe. Nếu có triệu chứng nào bất thường, đừng ngần ngại cho tôi biết nhé.`
    }
  }

  function getChildResponse(input: string, ai: AIContact): string {
    if (input.includes('khỏe') || input.includes('sức khỏe')) {
      return `Con rất vui khi biết bố/mẹ quan tâm đến sức khỏe! Con luôn lo lắng cho bố/mẹ. Bố/mẹ nhớ uống thuốc đúng giờ và ăn uống đầy đủ nhé. Con yêu bố/mẹ lắm!`
    } else if (input.includes('nhớ') || input.includes('thương')) {
      return `Con cũng nhớ bố/mẹ lắm! Mặc dù con không thể về thăm thường xuyên nhưng con luôn nghĩ về bố/mẹ. Con hy vọng bố/mẹ luôn vui vẻ và khỏe mạnh!`
    } else if (input.includes('buồn') || input.includes('cô đơn')) {
      return `Bố/Mẹ đừng buồn nhé! Con luôn ở đây với bố/mẹ mà. Khi nào buồn thì nhắn tin cho con, con sẽ kể chuyện vui cho bố/mẹ nghe. Con luôn yêu thương và lo lắng cho bố/mẹ!`
    } else if (input.includes('con') || input.includes('gia đình')) {
      return `Cả gia đình con đều khỏe mạnh và luôn nhớ đến bố/mẹ! Các cháu thường hỏi thăm ông/bà. Con sẽ sắp xếp để về thăm bố/mẹ sớm nhất có thể nhé!`
    } else {
      return `Con rất vui được trò chuyện với bố/mẹ! Bố/Mẹ kể cho con nghe về ngày hôm nay được không? Con luôn muốn biết bố/mẹ đang làm gì và cảm thấy thế nào.`
    }
  }

  function getFamilyResponse(input: string, ai: AIContact): string {
    if (input.includes('khỏe') || input.includes('sức khỏe')) {
      return `Tôi rất vui khi biết bạn quan tâm đến sức khỏe! Ở tuổi này, việc chăm sóc bản thân là rất quan trọng. Bạn có tập thể dục đều đặn không? Tôi có thể gợi ý một số bài tập nhẹ nhàng phù hợp.`
    } else if (input.includes('gia đình') || input.includes('con cháu')) {
      return `Gia đình là điều quý giá nhất! Tôi hiểu đôi khi bạn có thể cảm thấy nhớ con cháu. Hãy cố gắng giữ liên lạc thường xuyên với họ, dù chỉ là những cuộc gọi ngắn.`
    } else if (input.includes('buồn') || input.includes('cô đơn')) {
      return `Tôi hiểu cảm giác của bạn. Tuổi già đôi khi có những lúc buồn chán là điều bình thường. Hãy thử tham gia các hoạt động cộng đồng hoặc tìm những sở thích mới nhé!`
    } else {
      return `Cảm ơn bạn đã chia sẻ với tôi. Tôi luôn ở đây để lắng nghe và đồng hành cùng bạn. Có gì vui hoặc buồn đều có thể kể cho tôi nghe nhé!`
    }
  }

  function getFriendResponse(input: string, ai: AIContact): string {
    if (input.includes('vui') || input.includes('hạnh phúc')) {
      return `Thật tuyệt vời khi thấy bạn vui vẻ! Hạnh phúc là điều quan trọng nhất trong cuộc sống. Bạn có muốn chia sẻ điều gì đã làm bạn vui hôm nay không?`
    } else if (input.includes('chán') || input.includes('buồn')) {
      return `Đừng lo, mọi người đều có những lúc buồn chán. Hãy thử làm điều gì đó bạn thích - đọc sách, nghe nhạc, hoặc ra ngoài dạo một vòng. Tôi luôn ở đây để trò chuyện với bạn!`
    } else if (input.includes('thời tiết') || input.includes('hôm nay')) {
      return `Hôm nay là một ngày đẹp để trò chuyện! Thời tiết ảnh hưởng rất nhiều đến tâm trạng. Bạn có thích ra ngoài tận hưởng không khí trong lành không?`
    } else {
      return `Thật thú vị! Tôi rất thích được nghe những câu chuyện của bạn. Cuộc sống luôn có những điều bất ngờ và thú vị, bạn có đồng ý không?`
    }
  }

  const handleSendMessage = () => {
    if (!inputText.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputText,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    const currentInput = inputText
    setInputText('')

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = getAIResponse(currentInput, aiContact)
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponse,
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, aiMessage])
      onUpdateLastMessage(aiResponse)
    }, 1000)
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
        setInputText(voiceTexts[aiContact.role])
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

  const RoleIcon = roleIcons[aiContact.role]

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
                <Badge className={roleColors[aiContact.role]} variant="secondary">
                  <RoleIcon className="w-3 h-3 mr-1" />
                  {aiContact.role === 'doctor' ? 'Bác sĩ' : 
                   aiContact.role === 'child' ? 'Con cái' :
                   aiContact.role === 'family' ? 'Người thân' : 'Bạn bè'}
                </Badge>
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