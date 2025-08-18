import { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'

interface AuthFormProps {
  onLogin: (email: string, password: string) => void
  onRegister: (email: string, password: string, name: string) => void
}

export function AuthForm({ onLogin, onRegister }: AuthFormProps) {
  const [loginData, setLoginData] = useState({ email: '', password: '' })

  const [registerData, setRegisterData] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    confirmPassword: '' 
  })

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(loginData.email, loginData.password);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (registerData.password !== registerData.confirmPassword) {
      alert('Mật khẩu xác nhận không khớp');
      return;
    }
    onRegister(registerData.email, registerData.password, registerData.name);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex flex-col justify-center py-6 px-4">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
          <img 
            src="/logo.png" 
            alt="App Logo" 
            className="w-10 h-10 object-contain"
          />
        </div>
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">An</h1>
        <p className="text-lg text-gray-600 max-w-sm mx-auto">
          Ứng dụng sức khỏe thông minh dành riêng cho người cao tuổi
        </p>
      </div>

      {/* Auth Card */}
      <Card className="w-full max-w-md mx-auto shadow-lg border-0">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-xl text-gray-900">Chào mừng bạn!</CardTitle>
          <CardDescription className="text-base text-gray-600">
            Đăng nhập hoặc tạo tài khoản để bắt đầu
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 h-12 mb-6">
              <TabsTrigger value="login" className="text-base py-2">Đăng nhập</TabsTrigger>
              <TabsTrigger value="register" className="text-base py-2">Đăng ký</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLoginSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="login-email" className="text-base">Email của bạn</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="example@email.com"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    className="h-12 text-base rounded-xl border-2 focus:border-blue-400"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password" className="text-base">Mật khẩu</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="Nhập mật khẩu"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    className="h-12 text-base rounded-xl border-2 focus:border-blue-400"
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full h-12 text-base bg-blue-600 hover:bg-blue-700 rounded-xl font-medium"
                >
                  Đăng nhập ngay
                </Button>
                <div className="text-center">
                  <button 
                    type="button" 
                    className="text-blue-600 hover:text-blue-800 text-sm underline"
                  >
                    Quên mật khẩu?
                  </button>
                </div>
              </form>
            </TabsContent>
            
            <TabsContent value="register">
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-name" className="text-base">Họ và tên</Label>
                  <Input
                    id="register-name"
                    type="text"
                    placeholder="Ví dụ: Nguyễn Văn A"
                    value={registerData.name}
                    onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                    className="h-12 text-base rounded-xl border-2 focus:border-green-400"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-email" className="text-base">Email</Label>
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="example@email.com"
                    value={registerData.email}
                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                    className="h-12 text-base rounded-xl border-2 focus:border-green-400"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-password" className="text-base">Mật khẩu</Label>
                  <Input
                    id="register-password"
                    type="password"
                    placeholder="Tối thiểu 6 ký tự"
                    value={registerData.password}
                    onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                    className="h-12 text-base rounded-xl border-2 focus:border-green-400"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password" className="text-base">Xác nhận mật khẩu</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="Nhập lại mật khẩu"
                    value={registerData.confirmPassword}
                    onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                    className="h-12 text-base rounded-xl border-2 focus:border-green-400"
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full h-12 text-base bg-green-600 hover:bg-green-700 rounded-xl font-medium mt-6"
                >
                  Tạo tài khoản
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="text-center mt-8 text-xs text-gray-500 max-w-md mx-auto">
        <p>Bằng việc đăng ký, bạn đồng ý với các điều khoản sử dụng và chính sách bảo mật của chúng tôi.</p>
      </div>
    </div>
  )
}