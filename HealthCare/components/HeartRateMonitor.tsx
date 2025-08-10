import { useState, useEffect } from "react";
import { Heart, ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";

interface HeartRateMonitorProps {
  onBackToMenu: () => void;
}

interface HeartRateData {
  time: string;
  bpm: number;
}

export function HeartRateMonitor({ onBackToMenu }: HeartRateMonitorProps) {
  const [currentBpm, setCurrentBpm] = useState(75);
  const [heartRateData, setHeartRateData] = useState<HeartRateData[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(true);

  // Generate mock heart rate data
  useEffect(() => {
    const generateInitialData = () => {
      const data: HeartRateData[] = [];
      const now = new Date();
      
      for (let i = 29; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 2000);
        const bpm = 70 + Math.random() * 20; // Random BPM between 70-90
        data.push({
          time: time.toLocaleTimeString('vi-VN', { 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit' 
          }),
          bpm: Math.round(bpm)
        });
      }
      return data;
    };

    setHeartRateData(generateInitialData());
  }, []);

  // Simulate real-time heart rate monitoring
  useEffect(() => {
    if (!isMonitoring) return;

    const interval = setInterval(() => {
      const newBpm = 70 + Math.random() * 20; // Random BPM between 70-90
      const roundedBpm = Math.round(newBpm);
      setCurrentBpm(roundedBpm);

      setHeartRateData(prev => {
        const now = new Date();
        const newData = [...prev.slice(1), {
          time: now.toLocaleTimeString('vi-VN', { 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit' 
          }),
          bpm: roundedBpm
        }];
        return newData;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [isMonitoring]);

  const getHeartRateStatus = (bpm: number) => {
    if (bpm < 60) return { status: "Thấp", color: "text-blue-600", bgColor: "bg-blue-50" };
    if (bpm > 100) return { status: "Cao", color: "text-red-600", bgColor: "bg-red-50" };
    return { status: "Bình thường", color: "text-green-600", bgColor: "bg-green-50" };
  };

  const heartRateStatus = getHeartRateStatus(currentBpm);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-sm border border-white/20">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBackToMenu}
              className="hover:bg-white/50"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl lg:text-3xl font-medium text-gray-800">
                Theo dõi Nhịp Tim
              </h1>
              <p className="text-gray-600">
                Giám sát nhịp tim theo thời gian thực
              </p>
            </div>
          </div>
          
          <Button
            onClick={() => setIsMonitoring(!isMonitoring)}
            className={`${isMonitoring ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white`}
          >
            {isMonitoring ? 'Dừng' : 'Bắt đầu'}
          </Button>
        </div>

        {/* Current Heart Rate - Large Display */}
        <Card className="bg-white/90 backdrop-blur-sm border-2 border-red-200">
          <CardContent className="p-8 sm:p-12">
            <div className="text-center space-y-6">
              
              {/* Animated Heart Icon */}
              <div className="relative flex justify-center">
                <div className={`${isMonitoring ? 'animate-pulse' : ''} p-6 rounded-full bg-red-100`}>
                  <Heart 
                    className={`h-16 w-16 sm:h-24 sm:w-24 text-red-500 ${isMonitoring ? 'fill-red-500' : ''}`} 
                  />
                </div>
              </div>

              {/* BPM Display */}
              <div className="space-y-2">
                <div className="text-6xl sm:text-8xl font-light text-gray-800">
                  {currentBpm}
                </div>
                <div className="text-xl sm:text-2xl text-gray-600">
                  BPM
                </div>
              </div>

              {/* Status */}
              <div className={`inline-flex items-center px-6 py-3 rounded-full ${heartRateStatus.bgColor}`}>
                <span className={`text-lg font-medium ${heartRateStatus.color}`}>
                  {heartRateStatus.status}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Heart Rate Chart */}
        <Card className="bg-white/90 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-800">
                Biểu đồ Nhịp Tim (30 giây gần nhất)
              </h3>
              
              <div className="h-64 sm:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={heartRateData}>
                    <XAxis 
                      dataKey="time" 
                      tick={{ fontSize: 12 }}
                      interval="preserveStartEnd"
                    />
                    <YAxis 
                      domain={[50, 120]}
                      tick={{ fontSize: 12 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="bpm" 
                      stroke="#ef4444" 
                      strokeWidth={3}
                      dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: '#ef4444', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card className="bg-white/90 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-medium text-gray-800">72</div>
              <div className="text-sm text-gray-600">TB Hôm nay</div>
            </CardContent>
          </Card>
          <Card className="bg-white/90 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-medium text-gray-800">68</div>
              <div className="text-sm text-gray-600">Thấp nhất</div>
            </CardContent>
          </Card>
          <Card className="bg-white/90 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-medium text-gray-800">95</div>
              <div className="text-sm text-gray-600">Cao nhất</div>
            </CardContent>
          </Card>
          <Card className="bg-white/90 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-medium text-gray-800">8h</div>
              <div className="text-sm text-gray-600">Theo dõi</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}