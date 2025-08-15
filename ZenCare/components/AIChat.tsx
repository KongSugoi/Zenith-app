'use client'

import { useState, useRef, ReactNode} from 'react'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'
import { Avatar, AvatarFallback } from './ui/avatar'
import { Input } from './ui/input'
import { 
  Activity, Calendar, Heart, BookOpen, 
  Mic, MicOff, Type, Send, LogOut, Settings, User 
} from "lucide-react"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "./ui/dropdown-menu"

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

  const CHAT_API = import.meta.env.VITE_CHAT_URL;
  const TRANSCRIBE_API = import.meta.env.VITE_TRANSCRIBE_URL;
  const SYNTHESIZE_API = import.meta.env.VITE_SYNTHESIZE_URL;

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
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  function audioBufferToWav(buffer: AudioBuffer, opt?: { float32?: boolean }) {
    const numChannels = buffer.numberOfChannels;
    const sampleRate = buffer.sampleRate;
    const format = opt && opt.float32 ? 3 : 1; // 3 = IEEE float, 1 = PCM
    const bitDepth = format === 3 ? 32 : 16;

    let result;
    if (numChannels === 2) {
      result = interleave(buffer.getChannelData(0), buffer.getChannelData(1));
    } else {
      result = buffer.getChannelData(0);
    }

    return encodeWAV(result, format, sampleRate, numChannels, bitDepth);
  }

  function interleave(left: Float32Array, right: Float32Array) {
    const length = left.length + right.length;
    const result = new Float32Array(length);

    let index = 0;
    let inputIndex = 0;

    while (index < length) {
      result[index++] = left[inputIndex];
      result[index++] = right[inputIndex];
      inputIndex++;
    }
    return result;
  }

  function encodeWAV(samples: Float32Array, format: number, sampleRate: number, numChannels: number, bitDepth: number) {
    const bytesPerSample = bitDepth / 8;
    const blockAlign = numChannels * bytesPerSample;

    const buffer = new ArrayBuffer(44 + samples.length * bytesPerSample);
    const view = new DataView(buffer);

    /* RIFF identifier */
    writeString(view, 0, 'RIFF');
    /* file length */
    view.setUint32(4, 36 + samples.length * bytesPerSample, true);
    /* RIFF type */
    writeString(view, 8, 'WAVE');
    /* format chunk identifier */
    writeString(view, 12, 'fmt ');
    /* format chunk length */
    view.setUint32(16, 16, true);
    /* sample format (raw) */
    view.setUint16(20, format, true);
    /* channel count */
    view.setUint16(22, numChannels, true);
    /* sample rate */
    view.setUint32(24, sampleRate, true);
    /* byte rate (sample rate * block align) */
    view.setUint32(28, sampleRate * blockAlign, true);
    /* block align (channel count * bytes per sample) */
    view.setUint16(32, blockAlign, true);
    /* bits per sample */
    view.setUint16(34, bitDepth, true);
    /* data chunk identifier */
    writeString(view, 36, 'data');
    /* data chunk length */
    view.setUint32(40, samples.length * bytesPerSample, true);
    
    if (format === 1) { // PCM
      floatTo16BitPCM(view, 44, samples);
    } else {
      writeFloat32(view, 44, samples);
    }

    return buffer;
  }

  function writeString(view: DataView, offset: number, string: string) {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  }

  function floatTo16BitPCM(view: DataView, offset: number, input: Float32Array) {
    for (let i = 0; i < input.length; i++, offset += 2) {
      let s = Math.max(-1, Math.min(1, input[i]));
      view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    }
  }

  function writeFloat32(view: DataView, offset: number, input: Float32Array) {
    for (let i = 0; i < input.length; i++, offset += 4) {
      view.setFloat32(offset, input[i], true);
    }
  }

  const convertWebMtoWav = async (webmBlob: Blob) => {
    const arrayBuffer = await webmBlob.arrayBuffer();
    const audioBuffer = await new AudioContext().decodeAudioData(arrayBuffer);

    const wavBuffer = audioBufferToWav(audioBuffer); // cần hàm encode WAV
    return new Blob([wavBuffer], { type: 'audio/wav' });
  };

  function getWelcomeMessage(): string {
    return `Cháu chào bác ạ! Cháu là một trợ lý AI, không có tên riêng đâu ạ. Bác có thể gọi cháu là "trợ lý" hoặc "bạn đồng hành" cũng được ạ.\n\nCháu ở đây để giúp đỡ bác mọi việc, từ trả lời câu hỏi, trò chuyện, cho đến hỗ trợ những công việc nhỏ nhặt khác. Nếu có gì cần cháu giúp, bác cứ nói nhé. Cháu luôn sẵn lòng ạ.`
  }

  const transcribeAudio = async (audioBlob: Blob) => {
    const formData = new FormData()
    formData.append("file", audioBlob, "audio.wav")

    try {
      const res = await fetch(TRANSCRIBE_API, {   
        method: "POST",
        body: formData
      })

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      const data = await res.json()

      return data.text || ""
    } catch (err) {
      console.error("Transcribe error:", err)
      return ""
    }
  }

  const synthesizeSpeech = async (text: string) => {
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
    } catch (err) {
      console.error("Synthesize error:", err)
    }
  }

  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data)
        }
      }

      mediaRecorder.onstop = async () => {
        const webmBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        const wavBlob = await convertWebMtoWav(webmBlob)
        const text = await transcribeAudio(wavBlob)
        if (text) {
          setInputText(text)
          await handleSendMessage(text)
        }
      }

      mediaRecorderRef.current = mediaRecorder
      mediaRecorder.start()
      setIsListening(true)
    } catch (err) {
      console.error("Microphone error:", err)
    }
  }

  const stopListening = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop()
      setIsListening(false)
    }
  }

  const getAIResponse = async (prompt: string): Promise<ChatResponse> => {
    try {
      const response = await fetch(CHAT_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'user',
              content: prompt,
            }
          ]
        })
      })
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
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

    const AIMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: 'ai',
      content: AIResponse.reply,
      timestamp: new Date(),
      isUser: false,
      text: AIResponse.reply,
    }

    setMessages(prev => [...prev, AIMessage])
    await synthesizeSpeech(AIResponse.reply)
  }

  const getGreeting = () => "Xin chào"
  const formatDate = (date: Date) => date.toLocaleDateString("vi-VN")
  const formatTime = (date: Date) => date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })

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
