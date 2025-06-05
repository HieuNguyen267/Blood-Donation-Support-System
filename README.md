# Blood Donation Support System

Hệ thống hỗ trợ hiến máu với frontend React và backend SpringBoot.

## Cấu trúc Project

```
Blood-Donation-Support-System/
├── React/
│   └── blood-donation-frontend/    # React Frontend
├── SpringBoot/                     # SpringBoot Backend
└── README.md
```

## Yêu cầu hệ thống

- **Java 17+** (cho SpringBoot)
- **Node.js 16+** và **npm** (cho React)
- **MySQL** (cho database)
- **Maven** (cho SpringBoot)

## Cài đặt và chạy

### 1. Backend (SpringBoot)

```bash
# Di chuyển vào thư mục SpringBoot
cd SpringBoot

# Chạy application
mvn spring-boot:run
```

Backend sẽ chạy trên: `http://localhost:8080`

**API Endpoints:**
- `GET /api/test` - Test kết nối
- `GET /api/health` - Health check

### 2. Frontend (React)

```bash
# Di chuyển vào thư mục React
cd React/blood-donation-frontend

# Cài đặt dependencies (chỉ cần chạy lần đầu)
npm install

# Chạy development server
npm start
```

Frontend sẽ chạy trên: `http://localhost:3000`

### 3. Database (MySQL)

1. Cài đặt MySQL Server
2. Tạo database (SpringBoot sẽ tự động tạo nếu chưa có):
   ```sql
   CREATE DATABASE blood_donation_db;
   ```
3. Cập nhật thông tin kết nối database trong `SpringBoot/src/main/resources/application.properties`:
   ```properties
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   ```

## Test kết nối Frontend - Backend

1. Chạy backend trước (port 8080)
2. Chạy frontend (port 3000)
3. Mở browser và truy cập `http://localhost:3000`
4. Kiểm tra trạng thái kết nối trên giao diện

## Cấu hình CORS

Backend đã được cấu hình CORS để cho phép kết nối từ frontend:
- Allowed Origins: `http://localhost:3000`
- Allowed Methods: `GET, POST, PUT, DELETE, OPTIONS`
- Allowed Headers: `*`

## Cấu trúc API

### Backend Structure
```
SpringBoot/
├── src/main/java/com/blooddonation/backend/
│   ├── BloodDonationBackendApplication.java
│   ├── config/
│   │   └── CorsConfig.java
│   └── controller/
│       └── TestController.java
└── src/main/resources/
    └── application.properties
```

### Frontend Structure
```
React/blood-donation-frontend/
├── src/
│   ├── App.js
│   └── services/
│       └── api.js
└── package.json
```

## Troubleshooting

### Backend không chạy được:
- Kiểm tra Java version: `java -version`
- Kiểm tra Maven: `mvn -version`
- Kiểm tra MySQL có đang chạy không

### Frontend không kết nối được Backend:
- Đảm bảo backend đã chạy trên port 8080
- Kiểm tra console browser để xem lỗi CORS
- Kiểm tra network tab trong DevTools

### Database connection error:
- Kiểm tra MySQL service đang chạy
- Kiểm tra username/password trong application.properties
- Kiểm tra database đã được tạo chưa

## Phát triển tiếp

Có thể thêm các tính năng:
- Authentication/Authorization
- User management
- Blood donation records
- Hospital management
- Notification system 