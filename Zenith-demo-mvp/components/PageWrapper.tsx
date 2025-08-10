import { ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";

interface PageWrapperProps {
  title: string;
  onBackToMenu?: () => void;
  children: React.ReactNode;
}

export function PageWrapper({ title, onBackToMenu, children }: PageWrapperProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        {onBackToMenu && (
          <div className="flex items-center gap-4 bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-white/20">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBackToMenu}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại Menu
            </Button>
            <h1 className="text-xl font-medium text-gray-800">{title}</h1>
          </div>
        )}
    
        <div className="space-y-6">
          {children}
        </div>
      </div>
    </div>
  );
}