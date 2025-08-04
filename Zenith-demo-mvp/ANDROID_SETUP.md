# Hướng dẫn chạy ứng dụng ZenCare App trong Android Studio

## Yêu cầu hệ thống

### 1. Cài đặt Node.js và npm
- Tải và cài đặt Node.js (phiên bản 16 trở lên): https://nodejs.org/
- Kiểm tra cài đặt:
```bash
node --version
npm --version
```

### 2. Cài đặt Android Studio
- Tải Android Studio: https://developer.android.com/studio
- Cài đặt Android SDK (API level 28 trở lên)
- Cài đặt Android SDK Build Tools
- Thiết lập biến môi trường ANDROID_HOME

### 3. Cài đặt Java JDK
- Cài đặt JDK 11 hoặc 17
- Thiết lập biến môi trường JAVA_HOME

## Các bước thực hiện

### Bước 1: Cài đặt dependencies
```bash
# Cài đặt các package cần thiết
npm install

# Cài đặt Capacitor CLI globally
npm install -g @capacitor/cli
```

### Bước 2: Build ứng dụng web
```bash
# Build ứng dụng React cho production
npm run build
```

### Bước 3: Khởi tạo Capacitor
```bash
# Khởi tạo Capacitor (chỉ làm lần đầu)
npx cap init "ZenCare" "com.zencare.senior"

# Thêm platform Android
npx cap add android
```

### Bước 4: Sync và mở Android Studio
```bash
# Sync các file với Android project
npx cap sync android

# Mở project trong Android Studio
npx cap open android
```

### Bước 5: Chạy trên thiết bị/emulator

#### Từ Android Studio:
1. Kết nối thiết bị Android hoặc khởi động emulator
2. Nhấn nút "Run" (hoặc Shift+F10)

#### Từ command line:
```bash
# Chạy với live reload (development)
npx cap run android --livereload --external

# Build và chạy (production)
npm run android:build
```

## Scripts hữu ích

### Development
```bash
# Chạy web app trong browser
npm run dev

# Chạy Android app với live reload
npm run android:dev
```

### Production
```bash
# Build và deploy lên Android
npm run android:build

# Chỉ sync files (sau khi có thay đổi code)
npm run android:sync
```

## Cấu trúc thư mục sau khi setup

```
health-app/
├── android/                 # Android native project
│   ├── app/
│   ├── build.gradle
│   └── ...
├── dist/                    # Build output của React app
├── src/                     # Source code React
├── capacitor.config.ts      # Cấu hình Capacitor
├── package.json
└── vite.config.ts
```

## Troubleshooting

### Lỗi thường gặp:

1. **"ANDROID_HOME not set"**
   - Thiết lập biến môi trường ANDROID_HOME trỏ đến Android SDK

2. **"Build failed"**
   - Kiểm tra Java version (cần JDK 11 hoặc 17)
   - Clean và rebuild project

3. **"Live reload không hoạt động"**
   - Kiểm tra firewall
   - Đảm bảo thiết bị và máy tính cùng mạng WiFi

### Commands debug:
```bash
# Kiểm tra Capacitor doctor
npx cap doctor

# Clean build
cd android && ./gradlew clean && cd ..

# Rebuild everything
npm run build && npx cap sync android
```

## Tính năng Native

Ứng dụng sẽ có các tính năng native sau khi chạy trên Android:

- ✅ Status bar tùy chỉnh
- ✅ Splash screen
- ✅ Hardware back button
- ✅ Keyboard handling
- ✅ Device vibration (cho notifications)
- ✅ Network status detection
- ✅ Local storage/preferences
- ✅ Camera access (nếu cần)
- ✅ Audio recording (cho voice chat)

## Performance Tips

1. **Tối ưu hóa bundle size**: Sử dụng code splitting
2. **Lazy loading**: Load components khi cần
3. **Image optimization**: Sử dụng WebP format
4. **Caching**: Implement service worker
5. **Memory management**: Cleanup listeners và timers

## Next Steps

Sau khi ứng dụng chạy thành công:

1. **Thêm icons và splash screens tùy chỉnh**
2. **Cấu hình signing keys cho release build**
3. **Optimize performance cho mobile**
4. **Test trên các thiết bị khác nhau**
5. **Prepare cho Google Play Store**

---

**Lưu ý**: Đây là hybrid app sử dụng WebView, hiệu suất có thể không bằng native app hoàn toàn nhưng sẽ giữ được 100% UI/UX hiện tại và dễ maintain.
```

<figma type="work">
Tôi sẽ tạo thêm file TypeScript config để đảm bảo type checking hoạt động tốt.