'use client'

import { useState } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Textarea } from './ui/textarea'
import { Badge } from './ui/badge'
import { Calendar } from './ui/calendar'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { BookOpen, Plus, Search, Filter } from 'lucide-react'
import { Input } from './ui/input'
import { PageWrapper } from './PageWrapper'

interface JournalEntry {
  id: string
  date: Date
  mood: 'excellent' | 'good' | 'average' | 'poor' | 'bad'
  symptoms: string[]
  notes: string
  medications: string[]
  activities: string[]
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
      symptoms: ['Đau đầu nhẹ'],
      notes: 'Hôm nay cảm thấy khá tốt, chỉ hơi đau đầu vào buổi chiều. Có thể do thức khuya hôm qua.',
      medications: ['Thuốc huyết áp', 'Vitamin D'],
      activities: ['Đi bộ 30 phút', 'Yoga']
    },
    {
      id: '2',
      date: new Date('2024-01-25'),
      mood: 'excellent',
      symptoms: [],
      notes: 'Ngày tuyệt vời! Không có triệu chứng gì bất thường. Ngủ ngon và ăn uống đầy đủ.',
      medications: ['Thuốc huyết áp'],
      activities: ['Đi bộ 45 phút', 'Tập thể dục nhẹ']
    },
    {
      id: '3',
      date: new Date('2024-01-24'),
      mood: 'average',
      symptoms: ['Mệt mỏi', 'Khó ngủ'],
      notes: 'Cảm thấy hơi mệt mỏi và khó ngủ. Có thể do căng thẳng từ cuộc họp gia đình.',
      medications: ['Thuốc huyết áp', 'Thuốc ngủ'],
      activities: ['Đi bộ 20 phút']
    }
  ])

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [newEntry, setNewEntry] = useState({
    mood: '',
    symptoms: '',
    notes: '',
    medications: '',
    activities: ''
  })
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterMood, setFilterMood] = useState('all')

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
    if (!selectedDate || !newEntry.mood || !newEntry.notes) {
      alert('Vui lòng điền đầy đủ thông tin')
      return
    }

    const entry: JournalEntry = {
      id: Date.now().toString(),
      date: selectedDate,
      mood: newEntry.mood as JournalEntry['mood'],
      symptoms: newEntry.symptoms.split(',').map(s => s.trim()).filter(s => s),
      notes: newEntry.notes,
      medications: newEntry.medications.split(',').map(s => s.trim()).filter(s => s),
      activities: newEntry.activities.split(',').map(s => s.trim()).filter(s => s)
    }

    setEntries(prev => [entry, ...prev])
    setNewEntry({ mood: '', symptoms: '', notes: '', medications: '', activities: '' })
    setIsDialogOpen(false)
  }

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = entry.notes.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.symptoms.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesMood = !filterMood || filterMood === 'all' || entry.mood === filterMood
    return matchesSearch && matchesMood
  })

  return (
    <PageWrapper title="Nhật Ký Sức Khỏe" onBackToMenu={onBackToMenu}>
      <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-purple-600" />
            Nhật ký sức khỏe
          </CardTitle>
          <CardDescription>
            Ghi lại triệu chứng, cảm nhận và hoạt động hàng ngày
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Add Entry Button */}
          <div className="flex gap-4 mb-6">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Thêm nhật ký mới
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Thêm nhật ký sức khỏe</DialogTitle>
                  <DialogDescription>
                    Ghi lại tình trạng sức khỏe và cảm nhận của bạn hôm nay
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      className="rounded-md border"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm mb-2 block">Tâm trạng</label>
                    <Select value={newEntry.mood} onValueChange={(value) => setNewEntry({...newEntry, mood: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn tâm trạng" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="excellent">Tuyệt vời</SelectItem>
                        <SelectItem value="good">Tốt</SelectItem>
                        <SelectItem value="average">Bình thường</SelectItem>
                        <SelectItem value="poor">Kém</SelectItem>
                        <SelectItem value="bad">Tệ</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm mb-2 block">Triệu chứng (phân cách bằng dấu phẩy)</label>
                    <Input
                      value={newEntry.symptoms}
                      onChange={(e) => setNewEntry({...newEntry, symptoms: e.target.value})}
                      placeholder="Đau đầu, mệt mỏi, khó ngủ..."
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm mb-2 block">Ghi chú</label>
                    <Textarea
                      value={newEntry.notes}
                      onChange={(e) => setNewEntry({...newEntry, notes: e.target.value})}
                      placeholder="Mô tả cảm nhận, hoạt động và những điều đáng chú ý..."
                      rows={3}
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm mb-2 block">Thuốc đã uống (phân cách bằng dấu phẩy)</label>
                    <Input
                      value={newEntry.medications}
                      onChange={(e) => setNewEntry({...newEntry, medications: e.target.value})}
                      placeholder="Thuốc huyết áp, Vitamin D..."
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm mb-2 block">Hoạt động (phân cách bằng dấu phẩy)</label>
                    <Input
                      value={newEntry.activities}
                      onChange={(e) => setNewEntry({...newEntry, activities: e.target.value})}
                      placeholder="Đi bộ, yoga, tập thể dục..."
                    />
                  </div>
                  
                  <Button onClick={handleAddEntry} className="w-full">
                    Lưu nhật ký
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Search and Filter */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm trong nhật ký..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterMood} onValueChange={setFilterMood}>
              <SelectTrigger className="w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Lọc theo tâm trạng" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="excellent">Tuyệt vời</SelectItem>
                <SelectItem value="good">Tốt</SelectItem>
                <SelectItem value="average">Bình thường</SelectItem>
                <SelectItem value="poor">Kém</SelectItem>
                <SelectItem value="bad">Tệ</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Journal Entries */}
          <div className="space-y-4">
            {filteredEntries.map((entry) => (
              <Card key={entry.id}>
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
                  
                  <p className="text-sm mb-3">{entry.notes}</p>
                  
                  {entry.symptoms.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs text-muted-foreground mb-1">Triệu chứng:</p>
                      <div className="flex flex-wrap gap-1">
                        {entry.symptoms.map((symptom, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {symptom}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {entry.medications.length > 0 && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Thuốc đã uống:</p>
                        <div className="flex flex-wrap gap-1">
                          {entry.medications.map((med, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {med}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {entry.activities.length > 0 && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Hoạt động:</p>
                        <div className="flex flex-wrap gap-1">
                          {entry.activities.map((activity, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {activity}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {filteredEntries.length === 0 && (
            <div className="text-center py-8">
              <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {searchTerm || filterMood ? 'Không tìm thấy nhật ký nào' : 'Chưa có nhật ký nào. Hãy thêm nhật ký đầu tiên!'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      </div>
    </PageWrapper>
  )
}