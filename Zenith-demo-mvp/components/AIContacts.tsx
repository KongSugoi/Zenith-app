// 'use client'

// import { useState } from 'react'
// import { Button } from './ui/button'
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
// import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
// import { Badge } from './ui/badge'
// import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
// import { Input } from './ui/input'
// import { Label } from './ui/label'
// import { Textarea } from './ui/textarea'
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
// import { MessageCircle, Plus, Settings, Heart, Baby, User, Stethoscope, Edit } from 'lucide-react'
// import { AIChat } from './AIChat'

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

// export function AIContacts() {
//   const [selectedAI, setSelectedAI] = useState<AIContact | null>(null)
//   const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
//   const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
//   const [editingAI, setEditingAI] = useState<AIContact | null>(null)

//   const [aiContacts, setAiContacts] = useState<AIContact[]>([
//     {
//       id: 'default',
//       name: 'Trợ lý AI',
//       avatar: '🤖',
//       personality: 'Thân thiện, hỗ trợ tận tình',
//       description: 'Tôi là trợ lý ảo luôn sẵn sàng trò chuyện cùng bạn.',
//       isDefault: true,
//       lastMessage: 'Hãy nhớ uống thuốc đúng giờ nhé!',
//       lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000),
//       messageCount: 45
//     }
//   ])

//   const [newAI, setNewAI] = useState({
//     name: '',
//     avatar: '',
//     personality: '',
//     description: ''
//   })

//   const roleColors = {
//     doctor: 'bg-red-100 text-red-800',
//     child: 'bg-pink-100 text-pink-800',
//     family: 'bg-blue-100 text-blue-800',
//     friend: 'bg-green-100 text-green-800'
//   }

//   const handleAddAI = () => {
//     if (!newAI.name || !newAI.personality || !newAI.description) {
//       alert('Vui lòng điền đầy đủ thông tin')
//       return
//     }

//     const aiContact: AIContact = {
//       id: Date.now().toString(),
//       name: newAI.name,
//       avatar: newAI.avatar || '🤖',
//       personality: newAI.personality,
//       description: newAI.description,
//       isDefault: false,
//       messageCount: 0
//     }

//     setAiContacts(prev => [...prev, aiContact])
//     setNewAI({ name: '', avatar: '', personality: '', description: '' })
//     setIsAddDialogOpen(false)
//   }

//   const handleEditAI = (ai: AIContact) => {
//     setEditingAI(ai)
//     setNewAI({
//       name: ai.name,
//       avatar: ai.avatar || '',
//       personality: ai.personality,
//       description: ai.description
//     })
//     setIsEditDialogOpen(true)
//   }

//   const handleUpdateAI = () => {
//     if (!editingAI || !newAI.name || !newAI.personality || !newAI.description) {
//       alert('Vui lòng điền đầy đủ thông tin')
//       return
//     }

//     setAiContacts(prev => prev.map(ai => 
//       ai.id === editingAI.id 
//         ? { 
//             ...ai, 
//             name: newAI.name,
//             avatar: newAI.avatar || ai.avatar,
//             personality: newAI.personality,
//             description: newAI.description
//           }
//         : ai
//     ))
    
//     setNewAI({ name: '', avatar: '', personality: '', description: '' })
//     setIsEditDialogOpen(false)
//     setEditingAI(null)
//   }

//   const handleDeleteAI = (id: string) => {
//     if (aiContacts.find(ai => ai.id === id)?.isDefault) {
//       alert('Không thể xóa AI mặc định')
//       return
//     }
    
//     if (confirm('Bạn có chắc muốn xóa AI này?')) {
//       setAiContacts(prev => prev.filter(ai => ai.id !== id))
//       if (selectedAI?.id === id) {
//         setSelectedAI(null)
//       }
//     }
//   }

//   if (selectedAI) {
//     return (
//       <AIChat 
//         aiContact={selectedAI} 
//         onBack={() => setSelectedAI(null)}
//         onUpdateLastMessage={(message) => {
//           setAiContacts(prev => prev.map(ai => 
//             ai.id === selectedAI.id 
//               ? { ...ai, lastMessage: message, lastActive: new Date(), messageCount: ai.messageCount + 1 }
//               : ai
//           ))
//         }}
//       />
//     )
//   }

//   return (
//     <AIChat
//       aiContact={aiContacts[0]} 
//       onBack={() => setSelectedAI(null)}
//       onUpdateLastMessage={(message) => {
//         setAiContacts(prev => prev.map(ai => 
//           ai.id === aiContacts[0].id 
//             ? { ...ai, lastMessage: message, lastActive: new Date(), messageCount: ai.messageCount + 1 }
//             : ai
//         ))
//       }}
//     />
//   )
// }

import React, { useEffect } from 'react'
import { AIChat } from './AIChat'

export interface AIContact {
  id: string
  name: string
  avatar: string
  personality: string
  description: string
  isDefault: boolean
  messageCount: number
}

export function AIContacts(): JSX.Element {
  const aiContact: AIContact = {
    id: 'default',
    name: 'Trợ lý AI',
    avatar: '🤖',
    personality: 'Thân thiện, hỗ trợ tận tình',
    description: 'Tôi là trợ lý ảo luôn sẵn sàng trò chuyện cùng bạn.',
    isDefault: true,
    messageCount: 0
  }

  const handleBack = () => {
    window.history.back()
  }

  const handleUpdateLastMessage = (msg: string) => {
    console.log('Cập nhật tin nhắn mới nhất:', msg)
  }

  return (
    <AIChat
      aiContact={aiContact}
      onBack={handleBack}
      onUpdateLastMessage={handleUpdateLastMessage}
    />
  )
}
