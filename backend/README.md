# Blood Donation Support System - Backend

## Tổng Quan
Hệ thống hỗ trợ hiến máu với các chức năng xác thực qua email và SMS cho việc đăng ký và quên mật khẩu.

## Công Nghệ Sử Dụng
- **Spring Boot 3.2.3**
- **Java 21**
- **Spring Security + JWT**
- **Spring Data JPA**
- **MySQL 8.0**
- **Lombok**
- **ModelMapper**
- **Spring Mail**
- **Swagger/OpenAPI**

## Cài Đặt và Chạy

### Yêu Cầu Hệ Thống
- Java 21+
- Maven 3.6+
- MySQL 8.0+

### Cấu Hình Database
1. Tạo database MySQL:
```sql
CREATE DATABASE blood_donation_db;
```

2. Cấu hình trong `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/blood_donation_db?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=your_password
```

### Cấu Hình Email (Tùy Chọn)
Để sử dụng chức năng gửi email, cấu hình SMTP:
```properties
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=swp391.donateblood@gmail.com
spring.mail.password=your-app-specific-password
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
```

### Chạy Ứng Dụng
```bash
# Từ thư mục backend
mvn clean compile
mvn spring-boot:run
```

Ứng dụng sẽ chạy tại: `http://localhost:8080/api`

## API Endpoints

### Authentication APIs

#### 1. Gửi Mã Xác Thực Cho Đăng Ký
```http
POST /api/auth/send-verification
Content-Type: application/json

{
    "emailOrPhone": "user@example.com",
    "type": "email"
}
```

#### 2. Xác Thực Mã Code
```http
POST /api/auth/verify-code
Content-Type: application/json

{
    "emailOrPhone": "user@example.com",
    "verificationCode": "123456",
    "type": "email"
}
```

#### 3. Hoàn Tất Đăng Ký
```http
POST /api/auth/complete-registration
Content-Type: application/json

{
    "emailOrPhone": "user@example.com",
    "verificationCode": "123456",
    "firstName": "John",
    "lastName": "Doe",
    "email": "user@example.com",
    "password": "password123",
    "confirmPassword": "password123",
    "phoneNumber": "0123456789",
    "bloodType": "O_POS",
    "address": "123 Main St",
    "dateOfBirth": "1990-01-01",
    "gender": "MALE",
    "type": "email"
}
```

#### 4. Gửi Mã Reset Password
```http
POST /api/auth/send-password-reset
Content-Type: application/json

{
    "emailOrPhone": "user@example.com",
    "type": "email"
}
```

#### 5. Xác Thực Mã Reset Password
```http
POST /api/auth/verify-password-reset
Content-Type: application/json

{
    "emailOrPhone": "user@example.com",
    "verificationCode": "123456",
    "type": "email"
}
```

#### 6. Reset Password
```http
POST /api/auth/reset-password
Content-Type: application/json

{
    "email": "user@example.com",
    "verificationCode": "123456",
    "newPassword": "newpassword123",
    "confirmPassword": "newpassword123"
}
```

#### 7. Đăng Nhập
```http
POST /api/auth/signin
Content-Type: application/json

{
    "email": "user@example.com",
    "password": "password123"
}
```

### User Management APIs

#### Lấy Tất Cả Users
```http
GET /api/users
Authorization: Bearer YOUR_JWT_TOKEN
```

#### Lấy User Theo ID
```http
GET /api/users/{id}
Authorization: Bearer YOUR_JWT_TOKEN
```

#### Tạo User Mới (Admin)
```http
POST /api/users
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phoneNumber": "0123456789",
    "bloodType": "O_POS",
    "address": "123 Main St",
    "dateOfBirth": "1990-01-01",
    "gender": "MALE"
}
```

## Luồng Sử Dụng

### Đăng Ký Mới
1. Gọi `POST /api/auth/send-verification` với email/số điện thoại
2. Người dùng nhập mã xác thực từ email/SMS
3. Gọi `POST /api/auth/verify-code` để xác thực mã
4. Gọi `POST /api/auth/complete-registration` với thông tin đầy đủ
5. Hệ thống tự động đăng nhập và trả về JWT token

### Quên Mật Khẩu
1. Gọi `POST /api/auth/send-password-reset` với email/số điện thoại
2. Người dùng nhập mã xác thực từ email/SMS
3. Gọi `POST /api/auth/verify-password-reset` để xác thực mã
4. Gọi `POST /api/auth/reset-password` với mật khẩu mới

## Các Giá Trị Enum

### BloodTypeEnum
- `A_POS` - A+
- `A_NEG` - A-
- `B_POS` - B+
- `B_NEG` - B-
- `AB_POS` - AB+
- `AB_NEG` - AB-
- `O_POS` - O+
- `O_NEG` - O-

### Gender
- `MALE`
- `FEMALE`
- `OTHER`

## Testing

### Sử Dụng File Test
File `test_api_examples.http` chứa các ví dụ API calls có thể sử dụng với:
- IntelliJ IDEA HTTP Client
- VS Code REST Client
- Postman

### Swagger UI
Truy cập: `http://localhost:8080/api/swagger-ui.html`

### API Documentation
Truy cập: `http://localhost:8080/api/api-docs`

## Lưu Ý

- **Mã xác thực**: Có hiệu lực trong 10 phút
- **SMS Service**: Hiện tại chỉ log, cần tích hợp với SMS provider thực tế
- **Email Service**: Cần cấu hình SMTP để hoạt động
- **Bảo mật**: JWT token có hiệu lực 24 giờ
- **Database**: Tự động tạo schema khi chạy lần đầu

## Cấu Trúc Project

```
src/main/java/com/blooddonation/
├── controller/          # REST Controllers
├── service/            # Business Logic
├── repository/         # Data Access Layer
├── entity/            # JPA Entities
├── dto/               # Data Transfer Objects
├── security/          # Security Configuration
└── config/            # Application Configuration
```

## Troubleshooting

### Lỗi Database Connection
- Kiểm tra MySQL service đang chạy
- Kiểm tra thông tin kết nối trong `application.properties`

### Lỗi Email
- Kiểm tra cấu hình SMTP
- Với Gmail, sử dụng App Password thay vì mật khẩu thường

### Lỗi JWT
- Kiểm tra `jwt.secret` trong `application.properties`
- Đảm bảo secret key đủ dài (ít nhất 32 ký tự) 