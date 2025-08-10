# 🏥 Health App - Ứng dụng Sức Khỏe Người Cao Tuổi

Ứng dụng sức khỏe thông minh được thiết kế đặc biệt dành cho người cao tuổi, tích hợp AI chatbot, theo dõi sức khỏe realtime và giao diện thân thiện.

## ✨ Tính năng chính

- 🔐 **Đăng nhập/Đăng ký** - Xác thực người dùng an toàn
- 🤖 **AI Chatbot với Voice** - Trợ lý AI hỗ trợ bằng giọng nói
- 📞 **Danh bạ AI** - Quản lý nhiều AI persona (gia đình, bác sĩ)
- ❤️ **Theo dõi nhịp tim** - Biểu đồ realtime và lịch sử
- 📊 **Dashboard sức khỏe** - Tổng quan toàn diện
- 📝 **Nhật ký sức khỏe** - Ghi chép hàng ngày
- 📅 **Lịch thông minh** - Nhắc nhở thuốc và khám bệnh
- 👤 **Hồ sơ người dùng** - Quản lý thông tin cá nhân

## 🚀 Công nghệ sử dụng

- **Frontend Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui + Radix UI
- **Charts**: Recharts
- **Icons**: Lucide React
- **Notifications**: Sonner
- **Forms**: React Hook Form
- **Animation**: Motion/React (Framer Motion)

## 📦 Cài đặt và chạy

### Yêu cầu hệ thống
- Node.js 18+ 
- npm hoặc yarn
- Modern browser hỗ trợ ES2020+

### Cài đặt dependencies
```bash
# Clone repository
git clone <repository-url>
cd health-app-senior

# Cài đặt packages
npm install

# Hoặc dùng yarn
yarn install
```

### Chạy development server
```bash
# Chạy dev server
npm run dev

# Hoặc
yarn dev
```

Ứng dụng sẽ chạy tại `http://localhost:3000`

### Build production
```bash
# Build cho production
npm run build

# Preview build
npm run preview
```

### Kiểm tra code quality
```bash
# Lint code
npm run lint

# Type checking
npm run type-check
```

## 📁 Cấu trúc project

```
health-app-senior/
├── src/
│   └── main.tsx              # Entry point React
├── components/               # React components
│   ├── ui/                   # shadcn/ui components
│   └── figma/               # Figma utilities
├── styles/
│   └── globals.css          # Global styles & Tailwind
├── lib/
│   └── utils.ts             # Utility functions
├── react-native/            # React Native version
├── public/                  # Static assets
├── index.html               # HTML template
├── vite.config.ts           # Vite configuration
├── tsconfig.json            # TypeScript config
└── package.json             # Dependencies
```

## 🔧 Scripts có sẵn

- `npm run dev` - Chạy development server
- `npm run build` - Build production
- `npm run preview` - Preview production build
- `npm run lint` - Lint code với ESLint
- `npm run type-check` - Kiểm tra TypeScript

## 🎨 Hệ thống thiết kế

### Color Palette
- **Primary**: `#030213` (Dark blue)
- **Secondary**: Light gray variants
- **Accent**: Custom accent colors
- **Charts**: 5 color chart palette

### Typography
- **Base font size**: 14px
- **Font weights**: Normal (400), Medium (500)
- **Responsive scaling** cho ultra-wide displays

### Responsive Design
- **Mobile-first approach**
- **Ultra-wide display support** (2340×1080)
- **Bottom tab navigation** cho mobile
- **Flexible grid system**

## 🏥 Tính năng sức khỏe

### Monitoring
- Theo dõi nhịp tim realtime
- Biểu đồ xu hướng sức khỏe
- BMI calculator
- Blood pressure tracking

### AI Assistant
- Voice-enabled chatbot
- Multiple AI personas
- Health consultation
- Medication reminders

### Data Management
- Health journal entries
- Medical appointment calendar
- User profile management
- Data export capabilities

## 🌐 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Netlify
```bash
# Build
npm run build

# Deploy dist/ folder to Netlify
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## 🔐 Environment Variables

Tạo file `.env.local`:
```env
# API Configuration
VITE_API_URL=your_api_endpoint
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key

# Feature Flags
VITE_ENABLE_VOICE_CHAT=true
VITE_ENABLE_ANALYTICS=false
```

## 🤝 Contributing

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Tạo Pull Request

## 📄 License

MIT License - xem file [LICENSE](LICENSE) để biết thêm chi tiết.

## 🆘 Support

Nếu gặp vấn đề, vui lòng:
1. Kiểm tra [Issues](../../issues) có sẵn
2. Tạo issue mới với template phù hợp
3. Liên hệ team development

## 🔮 Roadmap

- [ ] Tích hợp Supabase backend
- [ ] Push notifications
- [ ] Offline mode support
- [ ] Advanced analytics
- [ ] Multi-language support
- [ ] Wearable device integration
- [ ] Telemedicine features
- [ ] Family sharing

---

**Được phát triển với ❤️ cho cộng đồng người cao tuổi Việt Nam**