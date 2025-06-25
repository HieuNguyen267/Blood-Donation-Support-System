# Blood Donation Support System

Hệ thống hỗ trợ hiến máu nhân đạo với giao diện web hiện đại và backend API mạnh mẽ.

## Tính năng chính

### Frontend (React + Vite)
- 🎨 Giao diện người dùng hiện đại với Ant Design
- 🔐 Hệ thống xác thực JWT
- 📱 Responsive design
- 🚀 Tối ưu hiệu suất với Vite
- 📊 Dashboard thống kê
- 📅 Quản lý lịch hẹn hiến máu
- 🏥 Yêu cầu máu khẩn cấp
- 👤 Quản lý hồ sơ người dùng

### Backend (Spring Boot)
- 🔒 Bảo mật với Spring Security + JWT
- 📧 Gửi email xác thực
- 📱 Gửi SMS thông báo
- 🗄️ Database MySQL
- 📊 Analytics và báo cáo
- 🔄 RESTful API
- 📝 Swagger documentation

## Cài đặt và chạy

### Yêu cầu hệ thống
- Node.js 18+ 
- Java 17+
- MySQL 8.0+
- Maven 3.6+

### 1. Cài đặt Backend

```bash
cd backend

# Cấu hình database trong application.properties
# Thay đổi username, password MySQL theo máy của bạn

# Chạy ứng dụng Spring Boot
mvn spring-boot:run
```

Backend sẽ chạy tại: http://localhost:8080

### 2. Cài đặt Frontend

```bash
# Cài đặt dependencies
npm install

# Chạy ứng dụng development
npm run dev
```

Frontend sẽ chạy tại: http://localhost:3000

### 3. Truy cập ứng dụng

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **H2 Console**: http://localhost:8080/h2-console

## Cấu hình

### Database
Cập nhật thông tin database trong `backend/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/blood_donation_system
spring.datasource.username=your_username
spring.datasource.password=your_password
```

### Email (Gmail)
Cập nhật thông tin email trong `application.properties`:

```properties
spring.mail.username=your_email@gmail.com
spring.mail.password=your_app_password
```

### SMS (Twilio)
Cập nhật thông tin SMS trong `application.properties`:

```properties
twilio.account_sid=your_account_sid
twilio.auth_token=your_auth_token
twilio.phone_number=your_twilio_number
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/signup` - Đăng ký
- `POST /api/auth/forgot-password` - Quên mật khẩu
- `POST /api/auth/reset-password` - Đặt lại mật khẩu
- `POST /api/auth/verify-code` - Xác thực OTP

### Donor Management
- `GET /api/donors/profile` - Lấy thông tin hồ sơ
- `PUT /api/donors/profile` - Cập nhật hồ sơ
- `POST /api/donation-register` - Đăng ký hiến máu
- `GET /api/donation-register/history` - Lịch sử hiến máu

### Blood Management
- `GET /api/blood-stock` - Thông tin kho máu
- `POST /api/blood-requests` - Tạo yêu cầu máu
- `GET /api/blood-requests` - Danh sách yêu cầu máu

### Analytics
- `GET /api/analytics/dashboard` - Thống kê tổng quan
- `GET /api/analytics/donations` - Thống kê hiến máu

## Cấu trúc dự án

```
Blood-Donation-Support-System/
├── backend/                 # Spring Boot Backend
│   ├── src/main/java/
│   │   └── com/blooddonation/backend/
│   │       ├── controller/  # REST Controllers
│   │       ├── service/     # Business Logic
│   │       ├── repository/  # Data Access
│   │       ├── entity/      # JPA Entities
│   │       ├── dto/         # Data Transfer Objects
│   │       ├── security/    # Security Configuration
│   │       └── config/      # Application Config
│   └── src/main/resources/
│       └── application.properties
├── src/                     # React Frontend
│   ├── components/          # Reusable Components
│   ├── Pages/              # Page Components
│   ├── services/           # API Services
│   └── assets/             # Static Assets
├── public/                 # Public Assets
├── package.json
└── vite.config.js
```

## Tính năng bảo mật

- 🔐 JWT Authentication
- 🔒 Password Encryption (BCrypt)
- 🛡️ CORS Configuration
- 📧 Email Verification
- 📱 SMS Verification
- 🚫 Rate Limiting
- 🔍 Input Validation

## Đóng góp

1. Fork dự án
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

## License

Dự án này được phát hành dưới MIT License.

## Hỗ trợ

Nếu bạn gặp vấn đề, vui lòng tạo issue trên GitHub hoặc liên hệ team phát triển.
