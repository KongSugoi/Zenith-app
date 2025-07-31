'use client'

import { useState } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Badge } from './ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { MessageCircle, Plus, Settings, Heart, Baby, User, Stethoscope, Edit } from 'lucide-react'
import { AIChat } from './AIChat'

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

export function AIContacts() {
  const [selectedAI, setSelectedAI] = useState<AIContact | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingAI, setEditingAI] = useState<AIContact | null>(null)

  const [aiContacts, setAiContacts] = useState<AIContact[]>([
    {
      id: 'doctor',
      name: 'Bác sĩ Minh',
      role: 'doctor',
      avatar: '👨‍⚕️',
      personality: 'Chuyên nghiệp, tận tâm, kiến thức y tế sâu rộng',
      description: 'Bác sĩ tim mạch với 20 năm kinh nghiệm, luôn sẵn sàng tư vấn về sức khỏe',
      isDefault: true,
      lastMessage: 'Hãy nhớ uống thuốc đúng giờ nhé!',
      lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000),
      messageCount: 45
    },
    {
      id: 'daughter',
      name: 'Lan',
      role: 'child',
      avatar: '👩',
      personality: 'Quan tâm, yêu thương, hiểu biết về công nghệ',
      description: 'Con gái yêu của bạn, luôn quan tâm đến sức khỏe và cuộc sống hàng ngày',
      isDefault: true,
      lastMessage: 'Bố/mẹ hôm nay thế nào? Con nhớ lắm!',
      lastActive: new Date(Date.now() - 30 * 60 * 1000),
      messageCount: 128
    },
    {
      id: 'son',
      name: 'Hùng',
      role: 'child',
      avatar: '👨',
      personality: 'Vui vẻ, năng động, hay kể chuyện',
      description: 'Con trai của bạn, luôn chia sẻ những câu chuyện thú vị và động viên tinh thần',
      isDefault: true,
      lastMessage: 'Hôm nay con có tin vui muốn chia sẻ với bố/mẹ!',
      lastActive: new Date(Date.now() - 45 * 60 * 1000),
      messageCount: 95
    }
  ])

  const [newAI, setNewAI] = useState({
    name: '',
    role: 'family' as AIContact['role'],
    avatar: '',
    personality: '',
    description: ''
  })

  const roleLabels = {
    doctor: 'Bác sĩ',
    child: 'Con cái',
    family: 'Người thân',
    friend: 'Bạn bè'
  }

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

  const handleAddAI = () => {
    if (!newAI.name || !newAI.personality || !newAI.description) {
      alert('Vui lòng điền đầy đủ thông tin')
      return
    }

    const aiContact: AIContact = {
      id: Date.now().toString(),
      name: newAI.name,
      role: newAI.role,
      avatar: newAI.avatar || '🤖',
      personality: newAI.personality,
      description: newAI.description,
      isDefault: false,
      messageCount: 0
    }

    setAiContacts(prev => [...prev, aiContact])
    setNewAI({ name: '', role: 'family', avatar: '', personality: '', description: '' })
    setIsAddDialogOpen(false)
  }

  const handleEditAI = (ai: AIContact) => {
    setEditingAI(ai)
    setNewAI({
      name: ai.name,
      role: ai.role,
      avatar: ai.avatar || '',
      personality: ai.personality,
      description: ai.description
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdateAI = () => {
    if (!editingAI || !newAI.name || !newAI.personality || !newAI.description) {
      alert('Vui lòng điền đầy đủ thông tin')
      return
    }

    setAiContacts(prev => prev.map(ai => 
      ai.id === editingAI.id 
        ? { 
            ...ai, 
            name: newAI.name,
            role: newAI.role,
            avatar: newAI.avatar || ai.avatar,
            personality: newAI.personality,
            description: newAI.description
          }
        : ai
    ))
    
    setNewAI({ name: '', role: 'family', avatar: '', personality: '', description: '' })
    setIsEditDialogOpen(false)
    setEditingAI(null)
  }

  const handleDeleteAI = (id: string) => {
    if (aiContacts.find(ai => ai.id === id)?.isDefault) {
      alert('Không thể xóa AI mặc định')
      return
    }
    
    if (confirm('Bạn có chắc muốn xóa AI này?')) {
      setAiContacts(prev => prev.filter(ai => ai.id !== id))
      if (selectedAI?.id === id) {
        setSelectedAI(null)
      }
    }
  }

  if (selectedAI) {
    return (
      <AIChat 
        aiContact={selectedAI} 
        onBack={() => setSelectedAI(null)}
        onUpdateLastMessage={(message) => {
          setAiContacts(prev => prev.map(ai => 
            ai.id === selectedAI.id 
              ? { ...ai, lastMessage: message, lastActive: new Date(), messageCount: ai.messageCount + 1 }
              : ai
          ))
        }}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-blue-600" />
                Danh bạ AI
              </CardTitle>
              <CardDescription>
                Trò chuyện với các AI như người thân, con cái hoặc bác sĩ
              </CardDescription>
            </div>
            
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Thêm AI mới
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Thêm AI mới</DialogTitle>
                  <DialogDescription>
                    Tạo một AI mới với tính cách và vai trò riêng
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="ai-name">Tên AI</Label>
                    <Input
                      id="ai-name"
                      value={newAI.name}
                      onChange={(e) => setNewAI({...newAI, name: e.target.value})}
                      placeholder="Ví dụ: Cô Mai, Anh Tuấn..."
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="ai-role">Vai trò</Label>
                    <Select value={newAI.role} onValueChange={(value: AIContact['role']) => setNewAI({...newAI, role: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="family">Người thân</SelectItem>
                        <SelectItem value="child">Con cái</SelectItem>
                        <SelectItem value="friend">Bạn bè</SelectItem>
                        <SelectItem value="doctor">Bác sĩ</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="ai-avatar">Avatar (emoji)</Label>
                    <Input
                      id="ai-avatar"
                      value={newAI.avatar}
                      onChange={(e) => setNewAI({...newAI, avatar: e.target.value})}
                      placeholder="😊 👩 👨 👵 👴 🧑‍⚕️..."
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="ai-personality">Tính cách</Label>
                    <Input
                      id="ai-personality"
                      value={newAI.personality}
                      onChange={(e) => setNewAI({...newAI, personality: e.target.value})}
                      placeholder="Ví dụ: Vui vẻ, quan tâm, hiểu biết..."
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="ai-description">Mô tả</Label>
                    <Textarea
                      id="ai-description"
                      value={newAI.description}
                      onChange={(e) => setNewAI({...newAI, description: e.target.value})}
                      placeholder="Mô tả chi tiết về AI này..."
                      rows={3}
                    />
                  </div>
                  
                  <Button onClick={handleAddAI} className="w-full">
                    Tạo AI
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
      </Card>

      {/* AI Contacts Grid - Ultra-wide optimized */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
        {aiContacts.map((ai) => {
          const RoleIcon = roleIcons[ai.role]
          return (
            <Card key={ai.id} className="hover:shadow-md transition-shadow cursor-pointer group">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="text-xl">
                        {ai.avatar || '🤖'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-base">{ai.name}</h3>
                      <Badge className={roleColors[ai.role]} variant="secondary">
                        <RoleIcon className="w-3 h-3 mr-1" />
                        {roleLabels[ai.role]}
                      </Badge>
                    </div>
                  </div>
                  
                  {!ai.isDefault && (
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleEditAI(ai)
                        }}
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteAI(ai.id)
                        }}
                      >
                        ×
                      </Button>
                    </div>
                  )}
                </div>
                
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {ai.description}
                </p>
                
                {ai.lastMessage && (
                  <div className="mb-3 p-2 bg-gray-50 rounded text-xs">
                    <p className="text-muted-foreground">Tin nhắn cuối:</p>
                    <p className="text-gray-900 mt-1">"{ai.lastMessage}"</p>
                  </div>
                )}
                
                <div className="flex justify-between items-center">
                  <div className="text-xs text-muted-foreground">
                    {ai.lastActive && (
                      <span>Hoạt động: {ai.lastActive.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {ai.messageCount} tin nhắn
                  </div>
                </div>
                
                <Button 
                  onClick={() => setSelectedAI(ai)}
                  className="w-full mt-3"
                  variant="outline"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Trò chuyện
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Edit AI Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chỉnh sửa AI</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin và tính cách của AI
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-ai-name">Tên AI</Label>
              <Input
                id="edit-ai-name"
                value={newAI.name}
                onChange={(e) => setNewAI({...newAI, name: e.target.value})}
                placeholder="Ví dụ: Cô Mai, Anh Tuấn..."
              />
            </div>
            
            <div>
              <Label htmlFor="edit-ai-role">Vai trò</Label>
              <Select value={newAI.role} onValueChange={(value: AIContact['role']) => setNewAI({...newAI, role: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="family">Người thân</SelectItem>
                  <SelectItem value="child">Con cái</SelectItem>
                  <SelectItem value="friend">Bạn bè</SelectItem>
                  <SelectItem value="doctor">Bác sĩ</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="edit-ai-avatar">Avatar (emoji)</Label>
              <Input
                id="edit-ai-avatar"
                value={newAI.avatar}
                onChange={(e) => setNewAI({...newAI, avatar: e.target.value})}
                placeholder="😊 👩 👨 👵 👴 🧑‍⚕️..."
              />
            </div>
            
            <div>
              <Label htmlFor="edit-ai-personality">Tính cách</Label>
              <Input
                id="edit-ai-personality"
                value={newAI.personality}
                onChange={(e) => setNewAI({...newAI, personality: e.target.value})}
                placeholder="Ví dụ: Vui vẻ, quan tâm, hiểu biết..."
              />
            </div>
            
            <div>
              <Label htmlFor="edit-ai-description">Mô tả</Label>
              <Textarea
                id="edit-ai-description"
                value={newAI.description}
                onChange={(e) => setNewAI({...newAI, description: e.target.value})}
                placeholder="Mô tả chi tiết về AI này..."
                rows={3}
              />
            </div>
            
            <Button onClick={handleUpdateAI} className="w-full">
              Cập nhật AI
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Usage Guide - Ultra-wide layout */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Hướng dẫn sử dụng</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-4 gap-4 text-sm">
            <div className="p-3 bg-red-50 rounded-lg">
              <strong className="text-red-700">Bác sĩ Minh:</strong>
              <p className="text-red-600 mt-1">Tư vấn về sức khỏe, thuốc men, triệu chứng bệnh</p>
            </div>
            <div className="p-3 bg-pink-50 rounded-lg">
              <strong className="text-pink-700">Con cái (Lan, Hùng):</strong>
              <p className="text-pink-600 mt-1">Trò chuyện thân mật, chia sẻ cuộc sống hàng ngày</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <strong className="text-blue-700">Thêm AI mới:</strong>
              <p className="text-blue-600 mt-1">Tạo AI với tính cách và vai trò riêng theo ý muốn</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <strong className="text-green-700">Mẹo:</strong>
              <p className="text-green-600 mt-1">Mỗi AI sẽ có cách trò chuyện và phản hồi khác nhau dựa trên vai trò</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}