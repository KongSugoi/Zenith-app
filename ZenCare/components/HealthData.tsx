'use client'

import { useState } from 'react'
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Progress } from './ui/progress'
import { Alert, AlertDescription } from './ui/alert'
import { Bluetooth, Plus, TrendingDown, TrendingUp, Heart, Droplet, Thermometer, FileText, Download, AlertTriangle, CheckCircle } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { PageWrapper } from './PageWrapper'
import { toast } from 'sonner'

interface HeartRateReading {
  id: string;
  timestamp: Date;
  rate: number;
  source: 'manual' | 'device' | 'auto';
}

interface HealthAlert {
  id: string;
  type: 'heart_rate_high' | 'heart_rate_low' | 'calendar_event';
  title: string;
  description: string;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high';
  acknowledged?: boolean;
}

interface HealthDataProps {
  heartRateReadings: HeartRateReading[];
  onAddHeartRateReading: (reading: Omit<HeartRateReading, 'id'>) => void;
  healthAlerts: HealthAlert[];
  onAcknowledgeAlert: (alertId: string) => void;
  onBackToMenu?: () => void;
}

// Import jsPDF dynamically to avoid SSR issues
const importJsPDF = async () => {
  const jsPDF = (await import('jspdf')).default;
  return jsPDF;
};

export function HealthData({ 
  heartRateReadings, 
  onAddHeartRateReading,
  healthAlerts,
  onAcknowledgeAlert,
  onBackToMenu 
}: HealthDataProps) {
  const [connectedDevices, _setConnectedDevices] = useState([
    { id: 'heart-monitor', name: 'Đồng hồ thông minh Samsung', status: 'connected', lastSync: '5 phút trước' },
    { id: 'fitness-band', name: 'Vòng đeo tay Xiaomi', status: 'connected', lastSync: '10 phút trước' },
  ])

  // Process heart rate data for charts
  const getHeartRateData = () => {
    const sortedReadings = [...heartRateReadings].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    const last7Days = sortedReadings.slice(-7);
    
    return last7Days.map((reading, _index) => ({
      date: reading.timestamp.toLocaleDateString('vi-VN').slice(0, 5),
      rate: reading.rate,
      time: reading.timestamp.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    }));
  };

  // Get daily heart rate pattern (mock data for demo)
  const dailyHeartRateData = [
    { time: '00:00', rate: 65 },
    { time: '04:00', rate: 58 },
    { time: '08:00', rate: 72 },
    { time: '12:00', rate: 78 },
    { time: '16:00', rate: 85 },
    { time: '20:00', rate: 74 },
    { time: '24:00', rate: 68 },
  ];

  // Calculate health metrics
  const currentHeartRate = heartRateReadings.length > 0 
    ? heartRateReadings.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0].rate 
    : 72;
  
  const avgHeartRate = heartRateReadings.length > 0 
    ? Math.round(heartRateReadings.reduce((sum, reading) => sum + reading.rate, 0) / heartRateReadings.length)
    : 70;
  
  const restingHeartRate = Math.min(...heartRateReadings.map(r => r.rate), 59);
  const maxHeartRate = Math.max(...heartRateReadings.map(r => r.rate), 98);
  const currentTemp = 36.5;
  const currentO2 = 98;

  const getHeartRateStatus = (rate: number) => {
    if (rate < 60) return { status: 'Chậm', color: 'text-blue-600', bgColor: 'bg-blue-50' }
    if (rate > 100) return { status: 'Nhanh', color: 'text-red-600', bgColor: 'bg-red-50' }
    return { status: 'Bình thường', color: 'text-green-600', bgColor: 'bg-green-50' }
  };

  const handleConnectDevice = () => {
    toast.info('🔍 Đang tìm kiếm thiết bị theo dõi nhịp tim...');
  };

  const handleManualEntry = () => {
    const heartRate = prompt('Nhập nhịp tim hiện tại (bpm):');
    if (heartRate) {
      const rate = parseInt(heartRate);
      if (rate >= 30 && rate <= 200) {
        onAddHeartRateReading({
          timestamp: new Date(),
          rate: rate,
          source: 'manual'
        });
      } else {
        toast.error('❌ Nhịp tim không hợp lệ. Vui lòng nhập từ 30-200 bpm.');
      }
    }
  };

  // Generate comprehensive health report data
  const generateHealthReportData = () => {
    const reportDate = new Date().toLocaleDateString('vi-VN');
    const userName = "Nguyen Van An"; // Mock user name - using ASCII for better PDF compatibility
    
    return {
      user: {
        name: userName,
        email: "nguyen.van.an@email.com",
        age: 65,
        reportDate: reportDate
      },
      heartRateStats: {
        current: currentHeartRate,
        average: avgHeartRate,
        resting: restingHeartRate,
        maximum: maxHeartRate,
        totalReadings: heartRateReadings.length,
        normalReadings: heartRateReadings.filter(r => r.rate >= 60 && r.rate <= 100).length,
        abnormalReadings: heartRateReadings.filter(r => r.rate < 60 || r.rate > 100).length
      },
      healthAlerts: {
        total: healthAlerts.length,
        unacknowledged: healthAlerts.filter(a => !a.acknowledged).length,
        highSeverity: healthAlerts.filter(a => a.severity === 'high').length,
        recent: healthAlerts.slice(-5)
      },
      recentReadings: heartRateReadings.slice(-15) // More readings for comprehensive report
    };
  };

  // Export health data as PDF with improved Vietnamese support
  const handleExportPDF = async () => {
    try {
      const jsPDF = await importJsPDF();
      const doc = new jsPDF();
      const data = generateHealthReportData();

      doc.setFont('Times New Roman', 'normal');

      let yPos = 30;
      const leftMargin = 20;
      const pageHeight = 280;
      
      // Helper function to check if new page is needed
      const checkPageBreak = (height: number = 10) => {
        if (yPos + height > pageHeight) {
          doc.addPage();
          yPos = 20;
          return true;
        }
        return false;
      };
      
      // Helper function to add text with automatic wrapping
      const addText = (text: string, fontSize: number = 12, fontStyle: string = 'normal') => {
        doc.setFontSize(fontSize);
        doc.setFont('helvetica', fontStyle);
        
        // Simple text wrapping for long lines
        const maxWidth = 170;
        const lines = doc.splitTextToSize(text, maxWidth);
        
        for (let i = 0; i < lines.length; i++) {
          checkPageBreak(8);
          doc.text(lines[i], leftMargin, yPos);
          yPos += 8;
        }
        yPos += 2; // Extra spacing
      };

      // Title
      addText('HEALTH REPORT', 18, 'bold');
      yPos += 5;

      // Date and user info section
      addText('USER INFORMATION', 14, 'bold');
      addText(`Report Date: ${data.user.reportDate}`);
      addText(`User Name: ${data.user.name}`);
      addText(`Email: ${data.user.email}`);
      addText(`Age: ${data.user.age}`);
      yPos += 10;

      // Heart Rate Statistics
      checkPageBreak(50);
      addText('HEART RATE STATISTICS', 14, 'bold');
      addText(`Current heart rate: ${data.heartRateStats.current} bpm`);
      addText(`Average heart rate: ${data.heartRateStats.average} bpm`);
      addText(`Resting heart rate: ${data.heartRateStats.resting} bpm`);
      addText(`Maximum heart rate: ${data.heartRateStats.maximum} bpm`);
      addText(`Total measurements: ${data.heartRateStats.totalReadings}`);
      addText(`Normal results (60-100 bpm): ${data.heartRateStats.normalReadings}`);
      addText(`Abnormal results: ${data.heartRateStats.abnormalReadings}`);
      yPos += 10;

      // Recent Readings
      checkPageBreak(40);
      addText('RECENT MEASUREMENTS', 14, 'bold');

      if (data.recentReadings.length > 0) {
        data.recentReadings.forEach((reading, index) => {
          checkPageBreak(8);
          const timeStr = reading.timestamp.toLocaleString('en-US');
          const sourceStr = reading.source === 'manual' ? 'Manual' : 
                            reading.source === 'device' ? 'Device' : 'Automatic';
          const statusStr = reading.rate < 60 ? ' (LOW)' : 
                            reading.rate > 100 ? ' (HIGH)' : ' (NORMAL)';
          
          addText(`${index + 1}. ${timeStr}: ${reading.rate} bpm (${sourceStr})${statusStr}`, 10);
        });
      } else {
        addText('No heart rate data available.', 10);
      }
      yPos += 10;

      // Footer
      checkPageBreak(30);
      doc.setFontSize(8);
      doc.text('This report was automatically generated by the ZenCare AI application', leftMargin, yPos);
      doc.text('and is for reference purposes only. Please consult a', leftMargin, yPos + 8);
      doc.text('specialist physician for accurate medical advice.', leftMargin, yPos + 16);
      yPos += 20;

      doc.text(`ZenCare AI - Intelligent Health Care Application`, leftMargin, yPos);
      doc.text(`Report Date: ${data.user.reportDate}`, leftMargin, yPos + 8);

      
      // Generate filename with current date
      const fileName = `BaoCaoSucKhoe_${data.user.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
      const pdfBase64 = doc.output('datauristring');
      // Save the PDF
      // doc.save(fileName);

      try {
        await Filesystem.writeFile({
          path: fileName,
          data: pdfBase64,
          directory: Directory.Documents
        });
        toast.success(`✅ Đã lưu báo cáo PDF vào thư mục Documents: ${fileName}`);
      } catch (err) {
        console.error('Error saving PDF to Documents:', err);
        toast.error('❌ Lỗi khi lưu PDF vào thư mục Documents.');
      }
      
      toast.success('✅ Đã xuất báo cáo sức khỏe PDF thành công!');
    } catch (error) {
      console.error('Error exporting PDF:', error);
      toast.error('❌ Lỗi khi xuất PDF. Vui lòng thử lại.');
    }
  };

  // Export raw data as JSON
  const handleExportData = () => {
    try {
      const exportData = {
        exportDate: new Date().toISOString(),
        heartRateReadings: heartRateReadings,
        healthAlerts: healthAlerts,
        summary: generateHealthReportData(),
        version: "2.0"
      };
      
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
        type: 'application/json;charset=utf-8' 
      });
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      const fileName = `DuLieuSucKhoe_${new Date().toISOString().split('T')[0]}.json`;
      link.download = fileName;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      window.URL.revokeObjectURL(url);
      
      toast.success('✅ Đã xuất dữ liệu thành công!');
    } catch (error) {
      console.error('Error exporting data:', error);
      toast.error('❌ Lỗi khi xuất dữ liệu. Vui lòng thử lại.');
    }
  };

  const heartRateStatus = getHeartRateStatus(currentHeartRate);
  const chartData = getHeartRateData();

  return (
    <PageWrapper title="Dữ Liệu Sức Khỏe" onBackToMenu={onBackToMenu}>
      <div className="space-y-6">
        
        {/* Health Alerts */}
        {healthAlerts.filter(alert => !alert.acknowledged).length > 0 && (
          <Card className="border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-800">
                <AlertTriangle className="w-5 h-5" />
                Cảnh báo sức khỏe ({healthAlerts.filter(alert => !alert.acknowledged).length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {healthAlerts
                  .filter(alert => !alert.acknowledged)
                  .slice(0, 3)
                  .map((alert) => (
                    <Alert key={alert.id} className={`border-l-4 ${
                      alert.severity === 'high' ? 'border-l-red-500 bg-red-50' :
                      alert.severity === 'medium' ? 'border-l-orange-500 bg-orange-50' :
                      'border-l-yellow-500 bg-yellow-50'
                    }`}>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium">{alert.title}</p>
                            <p className="text-sm mt-1">{alert.description}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {alert.timestamp.toLocaleString('vi-VN')}
                            </p>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onAcknowledgeAlert(alert.id)}
                            className="ml-4"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Xác nhận
                          </Button>
                        </div>
                      </AlertDescription>
                    </Alert>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Device Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bluetooth className="w-5 h-5 text-blue-600" />
              Thiết bị theo dõi nhịp tim
            </CardTitle>
            <CardDescription>Quản lý các thiết bị đo nhịp tim</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {connectedDevices.map((device) => (
                <div key={device.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      device.status === 'connected' ? 'bg-green-500' : 'bg-red-500'
                    }`}></div>
                    <div>
                      <p className="text-sm">{device.name}</p>
                      <p className="text-xs text-muted-foreground">Đồng bộ: {device.lastSync}</p>
                    </div>
                  </div>
                  <Badge variant={device.status === 'connected' ? 'default' : 'secondary'}>
                    {device.status === 'connected' ? 'Đã kết nối' : 'Mất kết nối'}
                  </Badge>
                </div>
              ))}
            </div>
            
            <div className="flex gap-2 mt-4">
              <Button onClick={handleConnectDevice} variant="outline" className="flex-1">
                <Bluetooth className="w-4 h-4 mr-2" />
                Kết nối thiết bị
              </Button>
              <Button onClick={handleManualEntry} variant="outline" className="flex-1">
                <Plus className="w-4 h-4 mr-2" />
                Nhập thủ công
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Current Health Metrics - Focus on Heart Rate */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Heart className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Nhịp tim hiện tại</p>
                  <div className="flex items-center gap-1">
                    <p className="text-lg font-medium text-red-600">{currentHeartRate}</p>
                    <span className="text-xs text-muted-foreground">bpm</span>
                  </div>
                  <Badge className={`${heartRateStatus.color} ${heartRateStatus.bgColor} text-xs`} variant="secondary">
                    {heartRateStatus.status}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Heart className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Nhịp nghỉ</p>
                  <div className="flex items-center gap-1">
                    <p className="text-lg font-medium text-blue-600">{restingHeartRate}</p>
                    <span className="text-xs text-muted-foreground">bpm</span>
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingDown className="w-3 h-3 text-green-600" />
                    <span className="text-xs text-green-600">Tốt</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Heart className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Nhịp tối đa</p>
                  <div className="flex items-center gap-1">
                    <p className="text-lg font-medium text-orange-600">{maxHeartRate}</p>
                    <span className="text-xs text-muted-foreground">bpm</span>
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className="w-3 h-3 text-orange-600" />
                    <span className="text-xs text-orange-600">Gần đây</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Heart className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Trung bình</p>
                  <div className="flex items-center gap-1">
                    <p className="text-lg font-medium text-purple-600">{avgHeartRate}</p>
                    <span className="text-xs text-muted-foreground">bpm</span>
                  </div>
                  <span className="text-xs text-gray-600">{heartRateReadings.length} lần đo</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Heart Rate Trends */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-600" />
                Xu hướng nhịp tim gần đây
              </CardTitle>
              <CardDescription>Theo dõi nhịp tim từ {heartRateReadings.length} lần đo</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[40, 120]} />
                    <Tooltip 
                      formatter={(value) => [`${value} bpm`, 'Nhịp tim']}
                      labelFormatter={(label) => `Ngày: ${label}`}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="rate" 
                      stroke="#ef4444" 
                      strokeWidth={2}
                      dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                      name="Nhịp tim"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Hiện tại</p>
                  <p className="text-xl text-red-600">{currentHeartRate} bpm</p>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Trung bình</p>
                  <p className="text-xl text-blue-600">{avgHeartRate} bpm</p>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Cao nhất</p>
                  <p className="text-xl text-orange-600">{maxHeartRate} bpm</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Daily Heart Rate Pattern */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-600" />
                Nhịp tim trong ngày
              </CardTitle>
              <CardDescription>Mẫu nhịp tim theo giờ (dữ liệu mẫu)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dailyHeartRateData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis domain={[50, 90]} />
                    <Tooltip 
                      formatter={(value) => [`${value} bpm`, 'Nhịp tim']}
                      labelFormatter={(label) => `Thời gian: ${label}`}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="rate" 
                      stroke="#ef4444" 
                      strokeWidth={3}
                      dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                      name="Nhịp tim"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              {/* Heart Rate Zones */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Vùng nhịp tim hôm nay</h4>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span>Nghỉ ngơi (50-60%)</span>
                    <span>45 phút</span>
                  </div>
                  <Progress value={75} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span>Đốt mỡ (60-70%)</span>
                    <span>32 phút</span>
                  </div>
                  <Progress value={53} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span>Aerobic (70-80%)</span>
                    <span>18 phút</span>
                  </div>
                  <Progress value={30} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span>Anaerobic (80-90%)</span>
                    <span>5 phút</span>
                  </div>
                  <Progress value={8} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Data Export Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-600" />
              Quản lý dữ liệu sức khỏe
            </CardTitle>
            <CardDescription>Xuất báo cáo và sao lưu dữ liệu với định dạng tiếng Việt</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                className="h-16 flex flex-col items-center justify-center gap-2" 
                onClick={handleExportPDF}
              >
                <FileText className="w-6 h-6 text-red-600" />
                <div className="text-center">
                  <div className="font-medium">Xuất báo cáo PDF</div>
                  <div className="text-xs text-muted-foreground">Báo cáo sức khỏe định dạng tiếng Việt</div>
                </div>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-16 flex flex-col items-center justify-center gap-2" 
                onClick={handleExportData}
              >
                <Download className="w-6 h-6 text-blue-600" />
                <div className="text-center">
                  <div className="font-medium">Sao lưu dữ liệu</div>
                  <div className="text-xs text-muted-foreground">Tệp JSON với dữ liệu chi tiết</div>
                </div>
              </Button>
            </div>
            
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="text-center">
                  <div className="font-medium text-blue-600">{heartRateReadings.length}</div>
                  <div className="text-muted-foreground">Lần đo tim</div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-green-600">{healthAlerts.filter(a => a.acknowledged).length}</div>
                  <div className="text-muted-foreground">Cảnh báo đã xử lý</div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-orange-600">{healthAlerts.filter(a => !a.acknowledged).length}</div>
                  <div className="text-muted-foreground">Cảnh báo chưa xử lý</div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-purple-600">{heartRateReadings.filter(r => r.source === 'manual').length}</div>
                  <div className="text-muted-foreground">Nhập thủ công</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Health Metrics */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <div className="p-3 bg-orange-100 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                  <Thermometer className="w-8 h-8 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-medium text-orange-600">{currentTemp}°C</p>
                  <p className="text-sm text-muted-foreground">Nhiệt độ cơ thể</p>
                  <Badge variant="secondary" className="text-xs mt-2">Bình thường</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <div className="p-3 bg-cyan-100 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                  <Droplet className="w-8 h-8 text-cyan-600" />
                </div>
                <div>
                  <p className="text-2xl font-medium text-cyan-600">{currentO2}%</p>
                  <p className="text-sm text-muted-foreground">SpO2</p>
                  <Badge variant="secondary" className="text-xs mt-2 bg-green-100 text-green-700">Tốt</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Health Insights */}
        <Card>
          <CardHeader>
            <CardTitle>Nhận xét sức khỏe</CardTitle>
            <CardDescription>Phân tích dựa trên dữ liệu nhịp tim của bạn</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <Heart className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-green-800 font-medium">Nhịp tim nghỉ tuyệt vời</p>
                    <p className="text-xs text-green-700 mt-1">
                      Nhịp tim nghỉ {restingHeartRate} bpm của bạn nằm trong mức tối ưu cho độ tuổi. 
                      Điều này cho thấy hệ tim mạch rất khỏe mạnh và thể lực tốt.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-blue-800 font-medium">Xu hướng ổn định tích cực</p>
                    <p className="text-xs text-blue-700 mt-1">
                      Nhịp tim của bạn có xu hướng ổn định với {heartRateReadings.length} lần đo. 
                      Hãy duy trì lối sống hiện tại và theo dõi thường xuyên.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  )
}