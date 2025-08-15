'use client'

import { useState } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Textarea } from './ui/textarea'
import { Badge } from './ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { BookOpen, Plus } from 'lucide-react'
import { PageWrapper } from './PageWrapper'

interface JournalEntry {
  id: string
  date: Date
  mood: 'excellent' | 'good' | 'average' | 'poor' | 'bad'
  notes: string
}

interface HealthJournalProps {
  onBackToMenu?: () => void;
}

export function HealthJournal({ onBackToMenu }: HealthJournalProps) {
  const [entries, setEntries] = useState<JournalEntry[]>([
    {
      id: '1',
      date: new Date('2024-01-26'),
      mood: 'good',
      notes: 'Hôm nay cảm thấy khá tốt, chỉ hơi đau đầu vào buổi chiều. Có thể do thức khuya hôm qua.'
    },
    {
      id: '2',
      date: new Date('2024-01-25'),
      mood: 'excellent',
      notes: 'Ngày tuyệt vời! Không có triệu chứng gì bất thường. Ngủ ngon và ăn uống đầy đủ.'
    },
    {
      id: '3',
      date: new Date('2024-01-24'),
      mood: 'average',
      notes: 'Cảm thấy hơi mệt mỏi và khó ngủ. Có thể do căng thẳng từ cuộc họp gia đình.'
    }
  ])

  const [newEntry, setNewEntry] = useState({
    mood: '',
    notes: ''
  })
  const [isAddingEntry, setIsAddingEntry] = useState(false)

  const moodColors = {
    excellent: 'bg-green-100 text-green-800',
    good: 'bg-blue-100 text-blue-800',
    average: 'bg-yellow-100 text-yellow-800',
    poor: 'bg-orange-100 text-orange-800',
    bad: 'bg-red-100 text-red-800'
  }

  const moodLabels = {
    excellent: 'Tuyệt vời',
    good: 'Tốt',
    average: 'Bình thường',
    poor: 'Kém',
    bad: 'Tệ'
  }

  const handleAddEntry = () => {
    if (!newEntry.mood || !newEntry.notes.trim()) {
      alert('Vui lòng điền đầy đủ thông tin')
      return
    }

    const entry: JournalEntry = {
      id: Date.now().toString(),
      date: new Date(),
      mood: newEntry.mood as JournalEntry['mood'],
      notes: newEntry.notes
    }

    setEntries(prev => [entry, ...prev])
    setNewEntry({ mood: '', notes: '' })
    setIsAddingEntry(false)
  }

  return (
    <PageWrapper title="Nhật Ký" onBackToMenu={onBackToMenu}>
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-purple-600" />
              Nhật ký 
            </CardTitle>
            <CardDescription>
              Hôm nay bác muốn chia sẻ điều gì ạ?
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Add New Entry */}
            {!isAddingEntry ? (
              <Button 
                onClick={() => setIsAddingEntry(true)} 
                className="w-full mb-6"
              >
                <Plus className="w-4 h-4 mr-2" />
                Thêm nhật ký hôm nay
              </Button>
            ) : (
              <div className="space-y-4 mb-6 p-4 border rounded-lg bg-gray-50">
                <h3 className="font-medium">Ghi chép hôm nay</h3>
                
                <div>
                  <label className="text-sm mb-2 block font-medium">Tâm trạng của bạn hôm nay</label>
                  <Select value={newEntry.mood} onValueChange={(value) => setNewEntry({...newEntry, mood: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn tâm trạng" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="excellent">😊 Tuyệt vời</SelectItem>
                      <SelectItem value="good">🙂 Tốt</SelectItem>
                      <SelectItem value="average">😐 Bình thường</SelectItem>
                      <SelectItem value="poor">🙁 Kém</SelectItem>
                      <SelectItem value="bad">😞 Tệ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm mb-2 block font-medium">Ghi chú về sức khỏe</label>
                  <Textarea
                    value={newEntry.notes}
                    onChange={(e) => setNewEntry({...newEntry, notes: e.target.value})}
                    placeholder="Mô tả cảm nhận, triệu chứng, hoạt động hoặc bất kỳ điều gì đáng chú ý về sức khỏe hôm nay..."
                    rows={4}
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button onClick={handleAddEntry} className="flex-1">
                    Lưu nhật ký
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setIsAddingEntry(false)
                      setNewEntry({ mood: '', notes: '' })
                    }}
                    className="flex-1"
                  >
                    Hủy
                  </Button>
                </div>
              </div>
            )}

            {/* Journal Entries */}
            <div className="space-y-4">
              <h3 className="font-medium">Nhật ký gần đây</h3>
              
              {entries.map((entry) => (
                <Card key={entry.id} className="border-l-4 border-l-purple-200">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          {entry.date.toLocaleDateString('vi-VN', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </p>
                      </div>
                      <Badge className={moodColors[entry.mood]}>
                        {moodLabels[entry.mood]}
                      </Badge>
                    </div>
                    
                    <p className="text-sm leading-relaxed">{entry.notes}</p>
                  </CardContent>
                </Card>
              ))}
              
              {entries.length === 0 && (
                <div className="text-center py-8">
                  <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Chưa có nhật ký nào. Hãy thêm nhật ký đầu tiên!
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  )
}