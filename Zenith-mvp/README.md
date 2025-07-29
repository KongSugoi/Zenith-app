# Ứng dụng Sức khỏe React Native

Ứng dụng sức khỏe toàn diện dành cho người cao tuổi được phát triển bằng React Native.

## Tính năng chính

- 🔐 **Đăng nhập/Đăng ký**: Xác thực người dùng an toàn
- 📊 **Dashboard**: Tổng quan sức khỏe với biểu đồ và thống kê
- ❤️ **Theo dõi sức khỏe**: Đo nhịp tim, huyết áp, bước chân
- 🤖 **AI Chat**: Trợ lý AI với nhiều nhân vật (bác sĩ, y tá, gia đình)
- 📔 **Nhật ký sức khỏe**: Ghi chép tâm trạng và triệu chứng hàng ngày
- 📅 **Lịch thông minh**: Nhắc nhở uống thuốc và hẹn khám
- 👤 **Profile người dùng**: Quản lý thông tin cá nhân và cài đặt

## Yêu cầu hệ thống

- Node.js >= 16
- React Native CLI
- Android Studio (cho Android)
- Xcode (cho iOS)
- Java Development Kit (JDK) 11

## Cài đặt

### 1. Clone repository

```bash
git clone [repository-url]
cd react-native
```

### 2. Cài đặt dependencies

```bash
npm install
```

### 3. Cài đặt pods (iOS only)

```bash
cd ios
pod install
cd ..
```

### 4. Cấu hình Android

Đảm bảo Android SDK và Android Studio đã được cài đặt đúng cách.

### 5. Chạy ứng dụng

**Android:**
```bash
npm run android
```

**iOS:**
```bash
npm run ios
```

## Cấu trúc thư mục

```
react-native/
├── App.tsx                    # Component chính
├── package.json              # Dependencies
├── screens/                  # Các màn hình
│   ├── AuthScreen.tsx        # Màn hình đăng nhập/đăng ký
│   ├── DashboardScreen.tsx   # Màn hình tổng quan
│   ├── HealthDataScreen.tsx  # Màn hình dữ liệu sức khỏe
│   ├── AIContactsScreen.tsx  # Danh sách liên hệ AI
│   ├── AIChatScreen.tsx      # Màn hình chat với AI
│   ├── HealthJournalScreen.tsx # Nhật ký sức khỏe
│   ├── SmartCalendarScreen.tsx # Lịch thông minh
│   └── UserProfileScreen.tsx # Hồ sơ người dùng
└── README.md                 # Tài liệu này
```

## Thư viện chính được sử dụng

- **React Navigation**: Điều hướng giữa các màn hình
- **React Native Vector Icons**: Biểu tượng
- **React Native Chart Kit**: Biểu đồ và đồ thị
- **React Native Calendars**: Lịch
- **AsyncStorage**: Lưu trữ dữ liệu local
- **React Native Safe Area Context**: Xử lý safe area

## Tính năng chi tiết

### 1. Xác thực người dùng
- Đăng nhập với email/mật khẩu
- Đăng ký tài khoản mới
- Lưu trữ thông tin đăng nhập local

### 2. Dashboard
- Hiển thị thông tin sức khỏe tổng quan
- Biểu đồ nhịp tim theo thời gian
- Thống kê bước chân, giấc ngủ
- Nhắc nhở trong ngày

### 3. Dữ liệu sức khỏe
- Biểu đồ nhịp tim, huyết áp, bước chân
- Theo dõi giấc ngủ
- Tính năng đo nhịp tim
- Lịch sử các lần đo

### 4. AI Chat
- Danh sách liên hệ AI đa dạng
- Chat với bác sĩ AI, y tá
- Thêm liên hệ gia đình custom
- Gợi ý câu hỏi thông minh

### 5. Nhật ký sức khỏe
- Ghi chép tâm trạng hàng ngày
- Theo dõi triệu chứng
- Ghi chú thuốc men và hoạt động
- Thống kê xu hướng

### 6. Lịch thông minh
- Hiển thị lịch tháng
- Thêm nhắc nhở uống thuốc
- Hẹn khám bác sĩ
- Nhắc nhở tập thể dục

### 7. Profile người dùng
- Thông tin cá nhân
- Cài đặt thông báo
- Thống kê sử dụng
- Đăng xuất an toàn

## Tùy chỉnh

### Thay đổi màu sắc chủ đạo
Chỉnh sửa các giá trị màu trong file styles:
```javascript
// Màu chính
const PRIMARY_COLOR = '#1e40af';
const SUCCESS_COLOR = '#10b981';
const ERROR_COLOR = '#ef4444';
```

### Thêm tính năng mới
1. Tạo screen mới trong thư mục `screens/`
2. Thêm vào navigation trong `App.tsx`
3. Cập nhật các dependency cần thiết

## Troubleshooting

### Lỗi Metro bundler
```bash
npx react-native start --reset-cache
```

### Lỗi build Android
```bash
cd android
./gradlew clean
cd ..
npm run android
```

### Lỗi pods iOS
```bash
cd ios
pod deintegrate
pod install
cd ..
```

## Đóng góp

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/new-feature`)
3. Commit changes (`git commit -am 'Add new feature'`)
4. Push to branch (`git push origin feature/new-feature`)
5. Tạo Pull Request

## License

MIT License - xem file LICENSE để biết thêm chi tiết.

## Liên hệ

- Email: support@healthapp.com
- Website: https://healthapp.com

## Changelog

### v1.0.0
- Phát hành đầu tiên
- Đầy đủ tính năng cơ bản
- Hỗ trợ Android và iOS