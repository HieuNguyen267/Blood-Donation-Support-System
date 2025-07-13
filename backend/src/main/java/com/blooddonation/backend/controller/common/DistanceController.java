package com.blooddonation.backend.controller.common;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import java.util.Map;
import java.util.HashMap;
import java.util.concurrent.ConcurrentHashMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.text.Normalizer;
import java.util.regex.Pattern;

@RestController
public class DistanceController {
    private static final Logger logger = LoggerFactory.getLogger(DistanceController.class);
    
    // Cache for Vietnamese districts, provinces, and cities with coordinates
    private static final Map<String, double[]> DISTRICT_COORDINATES = new ConcurrentHashMap<>();
    
    static {
        // Ho Chi Minh City Districts
        DISTRICT_COORDINATES.put("Quận 1", new double[]{10.7629, 106.7078});
        DISTRICT_COORDINATES.put("Quận 2", new double[]{10.7872, 106.7498});
        DISTRICT_COORDINATES.put("Quận 3", new double[]{10.7829, 106.6889});
        DISTRICT_COORDINATES.put("Quận 4", new double[]{10.7666, 106.7050});
        DISTRICT_COORDINATES.put("Quận 5", new double[]{10.7544, 106.6624});
        DISTRICT_COORDINATES.put("Quận 6", new double[]{10.7465, 106.6350});
        DISTRICT_COORDINATES.put("Quận 7", new double[]{10.7323, 106.7274});
        DISTRICT_COORDINATES.put("Quận 8", new double[]{10.7243, 106.6286});
        DISTRICT_COORDINATES.put("Quận 9", new double[]{10.8428, 106.8281});
        DISTRICT_COORDINATES.put("Quận 10", new double[]{10.7679, 106.6669});
        DISTRICT_COORDINATES.put("Quận 11", new double[]{10.7639, 106.6434});
        DISTRICT_COORDINATES.put("Quận 12", new double[]{10.8633, 106.6544});
        DISTRICT_COORDINATES.put("Quận Tân Bình", new double[]{10.8011, 106.6528});
        DISTRICT_COORDINATES.put("Quận Bình Tân", new double[]{10.7655, 106.6031});
        DISTRICT_COORDINATES.put("Quận Tân Phú", new double[]{10.7902, 106.6281});
        DISTRICT_COORDINATES.put("Quận Phú Nhuận", new double[]{10.7944, 106.6789});
        DISTRICT_COORDINATES.put("Quận Gò Vấp", new double[]{10.8385, 106.6650});
        DISTRICT_COORDINATES.put("Quận Bình Thạnh", new double[]{10.8106, 106.6983});
        DISTRICT_COORDINATES.put("Quận Thủ Đức", new double[]{10.8497, 106.7870});
        DISTRICT_COORDINATES.put("Quận Củ Chi", new double[]{11.0065, 106.5142});
        DISTRICT_COORDINATES.put("Quận Hóc Môn", new double[]{10.8845, 106.5952});
        DISTRICT_COORDINATES.put("Quận Bình Chánh", new double[]{10.6876, 106.5933});
        DISTRICT_COORDINATES.put("Quận Nhà Bè", new double[]{10.6969, 106.7471});
        DISTRICT_COORDINATES.put("Quận Cần Giờ", new double[]{10.5089, 106.8638});
        
        // Hanoi Districts
        DISTRICT_COORDINATES.put("Quận Ba Đình", new double[]{21.0354, 105.8342});
        DISTRICT_COORDINATES.put("Quận Hoàn Kiếm", new double[]{21.0278, 105.8512});
        DISTRICT_COORDINATES.put("Quận Hai Bà Trưng", new double[]{21.0122, 105.8441});
        DISTRICT_COORDINATES.put("Quận Đống Đa", new double[]{21.0191, 105.8235});
        DISTRICT_COORDINATES.put("Quận Tây Hồ", new double[]{21.0478, 105.8189});
        DISTRICT_COORDINATES.put("Quận Cầu Giấy", new double[]{21.0367, 105.8016});
        DISTRICT_COORDINATES.put("Quận Thanh Xuân", new double[]{21.0027, 105.8016});
        DISTRICT_COORDINATES.put("Quận Hoàng Mai", new double[]{20.9768, 105.8441});
        DISTRICT_COORDINATES.put("Quận Long Biên", new double[]{21.0478, 105.8833});
        DISTRICT_COORDINATES.put("Quận Nam Từ Liêm", new double[]{21.0027, 105.7667});
        DISTRICT_COORDINATES.put("Quận Bắc Từ Liêm", new double[]{21.0478, 105.7667});
        DISTRICT_COORDINATES.put("Quận Hà Đông", new double[]{20.9768, 105.7667});
        DISTRICT_COORDINATES.put("Quận Sơn Tây", new double[]{21.1025, 105.5018});
        DISTRICT_COORDINATES.put("Quận Ba Vì", new double[]{21.1975, 105.4233});
        DISTRICT_COORDINATES.put("Quận Phúc Thọ", new double[]{21.1025, 105.5667});
        DISTRICT_COORDINATES.put("Quận Đan Phượng", new double[]{21.1025, 105.6667});
        DISTRICT_COORDINATES.put("Quận Hoài Đức", new double[]{21.0027, 105.6667});
        DISTRICT_COORDINATES.put("Quận Quốc Oai", new double[]{20.9768, 105.6667});
        DISTRICT_COORDINATES.put("Quận Thạch Thất", new double[]{21.0027, 105.5667});
        DISTRICT_COORDINATES.put("Quận Chương Mỹ", new double[]{20.9768, 105.5667});
        DISTRICT_COORDINATES.put("Quận Thanh Oai", new double[]{20.9768, 105.7667});
        DISTRICT_COORDINATES.put("Quận Thường Tín", new double[]{20.9768, 105.8667});
        DISTRICT_COORDINATES.put("Quận Phú Xuyên", new double[]{20.9768, 105.9667});
        DISTRICT_COORDINATES.put("Quận Ứng Hòa", new double[]{20.9768, 105.7667});
        DISTRICT_COORDINATES.put("Quận Mỹ Đức", new double[]{20.9768, 105.6667});
        
        // Da Nang Districts
        DISTRICT_COORDINATES.put("Quận Hải Châu", new double[]{16.0544, 108.2022});
        DISTRICT_COORDINATES.put("Quận Thanh Khê", new double[]{16.0722, 108.2022});
        DISTRICT_COORDINATES.put("Quận Sơn Trà", new double[]{16.0544, 108.2422});
        DISTRICT_COORDINATES.put("Quận Ngũ Hành Sơn", new double[]{16.0544, 108.2622});
        DISTRICT_COORDINATES.put("Quận Liên Chiểu", new double[]{16.0722, 108.1822});
        DISTRICT_COORDINATES.put("Quận Cẩm Lệ", new double[]{16.0544, 108.1822});
        DISTRICT_COORDINATES.put("Quận Hòa Vang", new double[]{16.0722, 108.1622});
        DISTRICT_COORDINATES.put("Quận Hoàng Sa", new double[]{16.8321, 112.3333});
        
        // Hai Phong Districts
        DISTRICT_COORDINATES.put("Quận Hồng Bàng", new double[]{20.8561, 106.6822});
        DISTRICT_COORDINATES.put("Quận Ngô Quyền", new double[]{20.8561, 106.7022});
        DISTRICT_COORDINATES.put("Quận Lê Chân", new double[]{20.8561, 106.6622});
        DISTRICT_COORDINATES.put("Quận Hải An", new double[]{20.8561, 106.7222});
        DISTRICT_COORDINATES.put("Quận Kiến An", new double[]{20.8561, 106.6422});
        DISTRICT_COORDINATES.put("Quận Đồ Sơn", new double[]{20.7261, 106.7622});
        DISTRICT_COORDINATES.put("Quận Dương Kinh", new double[]{20.8561, 106.7422});
        DISTRICT_COORDINATES.put("Quận Thủy Nguyên", new double[]{20.9561, 106.6822});
        DISTRICT_COORDINATES.put("Quận An Dương", new double[]{20.8561, 106.6222});
        DISTRICT_COORDINATES.put("Quận An Lão", new double[]{20.8561, 106.6022});
        DISTRICT_COORDINATES.put("Quận Kiến Thụy", new double[]{20.8561, 106.6422});
        DISTRICT_COORDINATES.put("Quận Tiên Lãng", new double[]{20.8561, 106.5822});
        DISTRICT_COORDINATES.put("Quận Vĩnh Bảo", new double[]{20.8561, 106.5622});
        DISTRICT_COORDINATES.put("Quận Cát Hải", new double[]{20.8561, 106.8022});
        DISTRICT_COORDINATES.put("Quận Bạch Long Vĩ", new double[]{20.8561, 107.7222});
        
        // Can Tho Districts
        DISTRICT_COORDINATES.put("Quận Ninh Kiều", new double[]{10.0452, 105.7469});
        DISTRICT_COORDINATES.put("Quận Bình Thủy", new double[]{10.0652, 105.7469});
        DISTRICT_COORDINATES.put("Quận Cái Răng", new double[]{10.0252, 105.7469});
        DISTRICT_COORDINATES.put("Quận Ô Môn", new double[]{10.0852, 105.7469});
        DISTRICT_COORDINATES.put("Quận Thốt Nốt", new double[]{10.1052, 105.7469});
        DISTRICT_COORDINATES.put("Quận Vĩnh Thạnh", new double[]{10.1252, 105.7469});
        DISTRICT_COORDINATES.put("Quận Cờ Đỏ", new double[]{10.1452, 105.7469});
        DISTRICT_COORDINATES.put("Quận Phong Điền", new double[]{10.1652, 105.7469});
        DISTRICT_COORDINATES.put("Quận Thới Lai", new double[]{10.1852, 105.7469});
        
        // Major Provinces and Cities
        DISTRICT_COORDINATES.put("TP.HCM", new double[]{10.7629, 106.7078});
        DISTRICT_COORDINATES.put("TP HCM", new double[]{10.7629, 106.7078});
        DISTRICT_COORDINATES.put("Thành phố Hồ Chí Minh", new double[]{10.7629, 106.7078});
        DISTRICT_COORDINATES.put("Thanh pho Ho Chi Minh", new double[]{10.7629, 106.7078});
        
        DISTRICT_COORDINATES.put("TP.Hà Nội", new double[]{21.0278, 105.8342});
        DISTRICT_COORDINATES.put("TP Ha Noi", new double[]{21.0278, 105.8342});
        DISTRICT_COORDINATES.put("Thành phố Hà Nội", new double[]{21.0278, 105.8342});
        DISTRICT_COORDINATES.put("Thanh pho Ha Noi", new double[]{21.0278, 105.8342});
        
        DISTRICT_COORDINATES.put("TP.Đà Nẵng", new double[]{16.0544, 108.2022});
        DISTRICT_COORDINATES.put("TP Da Nang", new double[]{16.0544, 108.2022});
        DISTRICT_COORDINATES.put("Thành phố Đà Nẵng", new double[]{16.0544, 108.2022});
        DISTRICT_COORDINATES.put("Thanh pho Da Nang", new double[]{16.0544, 108.2022});
        
        DISTRICT_COORDINATES.put("TP.Hải Phòng", new double[]{20.8561, 106.6822});
        DISTRICT_COORDINATES.put("TP Hai Phong", new double[]{20.8561, 106.6822});
        DISTRICT_COORDINATES.put("Thành phố Hải Phòng", new double[]{20.8561, 106.6822});
        DISTRICT_COORDINATES.put("Thanh pho Hai Phong", new double[]{20.8561, 106.6822});
        
        DISTRICT_COORDINATES.put("TP.Cần Thơ", new double[]{10.0452, 105.7469});
        DISTRICT_COORDINATES.put("TP Can Tho", new double[]{10.0452, 105.7469});
        DISTRICT_COORDINATES.put("Thành phố Cần Thơ", new double[]{10.0452, 105.7469});
        DISTRICT_COORDINATES.put("Thanh pho Can Tho", new double[]{10.0452, 105.7469});
        
        // Major Provinces
        DISTRICT_COORDINATES.put("Tỉnh An Giang", new double[]{10.5216, 105.1258});
        DISTRICT_COORDINATES.put("Tinh An Giang", new double[]{10.5216, 105.1258});
        
        DISTRICT_COORDINATES.put("Tỉnh Bà Rịa - Vũng Tàu", new double[]{10.5411, 107.2422});
        DISTRICT_COORDINATES.put("Tinh Ba Ria - Vung Tau", new double[]{10.5411, 107.2422});
        
        DISTRICT_COORDINATES.put("Tỉnh Bắc Giang", new double[]{21.2731, 106.1946});
        DISTRICT_COORDINATES.put("Tinh Bac Giang", new double[]{21.2731, 106.1946});
        
        DISTRICT_COORDINATES.put("Tỉnh Bắc Kạn", new double[]{22.1473, 105.8342});
        DISTRICT_COORDINATES.put("Tinh Bac Kan", new double[]{22.1473, 105.8342});
        
        DISTRICT_COORDINATES.put("Tỉnh Bạc Liêu", new double[]{9.2945, 105.7216});
        DISTRICT_COORDINATES.put("Tinh Bac Lieu", new double[]{9.2945, 105.7216});
        
        DISTRICT_COORDINATES.put("Tỉnh Bắc Ninh", new double[]{21.1861, 106.0763});
        DISTRICT_COORDINATES.put("Tinh Bac Ninh", new double[]{21.1861, 106.0763});
        
        DISTRICT_COORDINATES.put("Tỉnh Bến Tre", new double[]{10.2333, 106.3833});
        DISTRICT_COORDINATES.put("Tinh Ben Tre", new double[]{10.2333, 106.3833});
        
        DISTRICT_COORDINATES.put("Tỉnh Bình Định", new double[]{14.1667, 108.9028});
        DISTRICT_COORDINATES.put("Tinh Binh Dinh", new double[]{14.1667, 108.9028});
        
        DISTRICT_COORDINATES.put("Tỉnh Bình Dương", new double[]{11.1664, 106.6631});
        DISTRICT_COORDINATES.put("Tinh Binh Duong", new double[]{11.1664, 106.6631});
        
        DISTRICT_COORDINATES.put("Tỉnh Bình Phước", new double[]{11.6471, 106.6050});
        DISTRICT_COORDINATES.put("Tinh Binh Phuoc", new double[]{11.6471, 106.6050});
        
        DISTRICT_COORDINATES.put("Tỉnh Bình Thuận", new double[]{10.9289, 108.1022});
        DISTRICT_COORDINATES.put("Tinh Binh Thuan", new double[]{10.9289, 108.1022});
        
        DISTRICT_COORDINATES.put("Tỉnh Cà Mau", new double[]{9.1527, 105.1967});
        DISTRICT_COORDINATES.put("Tinh Ca Mau", new double[]{9.1527, 105.1967});
        
        DISTRICT_COORDINATES.put("Tỉnh Cao Bằng", new double[]{22.6667, 106.2500});
        DISTRICT_COORDINATES.put("Tinh Cao Bang", new double[]{22.6667, 106.2500});
        
        DISTRICT_COORDINATES.put("Tỉnh Đắk Lắk", new double[]{12.6667, 108.2333});
        DISTRICT_COORDINATES.put("Tinh Dak Lak", new double[]{12.6667, 108.2333});
        
        DISTRICT_COORDINATES.put("Tỉnh Đắk Nông", new double[]{12.0000, 107.7000});
        DISTRICT_COORDINATES.put("Tinh Dak Nong", new double[]{12.0000, 107.7000});
        
        DISTRICT_COORDINATES.put("Tỉnh Điện Biên", new double[]{21.3833, 103.0167});
        DISTRICT_COORDINATES.put("Tinh Dien Bien", new double[]{21.3833, 103.0167});
        
        DISTRICT_COORDINATES.put("Tỉnh Đồng Nai", new double[]{10.9574, 106.8426});
        DISTRICT_COORDINATES.put("Tinh Dong Nai", new double[]{10.9574, 106.8426});
        
        DISTRICT_COORDINATES.put("Tỉnh Đồng Tháp", new double[]{10.4933, 105.6882});
        DISTRICT_COORDINATES.put("Tinh Dong Thap", new double[]{10.4933, 105.6882});
        
        DISTRICT_COORDINATES.put("Tỉnh Gia Lai", new double[]{13.9833, 108.0000});
        DISTRICT_COORDINATES.put("Tinh Gia Lai", new double[]{13.9833, 108.0000});
        
        DISTRICT_COORDINATES.put("Tỉnh Hà Giang", new double[]{22.8233, 104.9789});
        DISTRICT_COORDINATES.put("Tinh Ha Giang", new double[]{22.8233, 104.9789});
        
        DISTRICT_COORDINATES.put("Tỉnh Hà Nam", new double[]{20.5833, 105.9222});
        DISTRICT_COORDINATES.put("Tinh Ha Nam", new double[]{20.5833, 105.9222});
        
        DISTRICT_COORDINATES.put("Tỉnh Hà Tĩnh", new double[]{18.3333, 105.9000});
        DISTRICT_COORDINATES.put("Tinh Ha Tinh", new double[]{18.3333, 105.9000});
        
        DISTRICT_COORDINATES.put("Tỉnh Hải Dương", new double[]{20.9373, 106.3344});
        DISTRICT_COORDINATES.put("Tinh Hai Duong", new double[]{20.9373, 106.3344});
        
        DISTRICT_COORDINATES.put("Tỉnh Hậu Giang", new double[]{9.7579, 105.6413});
        DISTRICT_COORDINATES.put("Tinh Hau Giang", new double[]{9.7579, 105.6413});
        
        DISTRICT_COORDINATES.put("Tỉnh Hòa Bình", new double[]{20.8133, 105.3383});
        DISTRICT_COORDINATES.put("Tinh Hoa Binh", new double[]{20.8133, 105.3383});
        
        DISTRICT_COORDINATES.put("Tỉnh Hưng Yên", new double[]{20.8525, 106.0169});
        DISTRICT_COORDINATES.put("Tinh Hung Yen", new double[]{20.8525, 106.0169});
        
        DISTRICT_COORDINATES.put("Tỉnh Khánh Hòa", new double[]{12.2500, 109.0000});
        DISTRICT_COORDINATES.put("Tinh Khanh Hoa", new double[]{12.2500, 109.0000});
        
        DISTRICT_COORDINATES.put("Tỉnh Kiên Giang", new double[]{10.0000, 105.0917});
        DISTRICT_COORDINATES.put("Tinh Kien Giang", new double[]{10.0000, 105.0917});
        
        DISTRICT_COORDINATES.put("Tỉnh Kon Tum", new double[]{14.3500, 108.0000});
        DISTRICT_COORDINATES.put("Tinh Kon Tum", new double[]{14.3500, 108.0000});
        
        DISTRICT_COORDINATES.put("Tỉnh Lai Châu", new double[]{22.3964, 103.4703});
        DISTRICT_COORDINATES.put("Tinh Lai Chau", new double[]{22.3964, 103.4703});
        
        DISTRICT_COORDINATES.put("Tỉnh Lâm Đồng", new double[]{11.9465, 108.4419});
        DISTRICT_COORDINATES.put("Tinh Lam Dong", new double[]{11.9465, 108.4419});
        
        DISTRICT_COORDINATES.put("Tỉnh Lạng Sơn", new double[]{21.8478, 106.7570});
        DISTRICT_COORDINATES.put("Tinh Lang Son", new double[]{21.8478, 106.7570});
        
        DISTRICT_COORDINATES.put("Tỉnh Lào Cai", new double[]{22.4833, 103.9500});
        DISTRICT_COORDINATES.put("Tinh Lao Cai", new double[]{22.4833, 103.9500});
        
        DISTRICT_COORDINATES.put("Tỉnh Long An", new double[]{10.5337, 106.4054});
        DISTRICT_COORDINATES.put("Tinh Long An", new double[]{10.5337, 106.4054});
        
        DISTRICT_COORDINATES.put("Tỉnh Nam Định", new double[]{20.4333, 106.1622});
        DISTRICT_COORDINATES.put("Tinh Nam Dinh", new double[]{20.4333, 106.1622});
        
        DISTRICT_COORDINATES.put("Tỉnh Nghệ An", new double[]{19.3333, 104.6833});
        DISTRICT_COORDINATES.put("Tinh Nghe An", new double[]{19.3333, 104.6833});
        
        DISTRICT_COORDINATES.put("Tỉnh Ninh Bình", new double[]{20.2506, 105.9744});
        DISTRICT_COORDINATES.put("Tinh Ninh Binh", new double[]{20.2506, 105.9744});
        
        DISTRICT_COORDINATES.put("Tỉnh Ninh Thuận", new double[]{11.7500, 108.8333});
        DISTRICT_COORDINATES.put("Tinh Ninh Thuan", new double[]{11.7500, 108.8333});
        
        DISTRICT_COORDINATES.put("Tỉnh Phú Thọ", new double[]{21.2683, 105.2389});
        DISTRICT_COORDINATES.put("Tinh Phu Tho", new double[]{21.2683, 105.2389});
        
        DISTRICT_COORDINATES.put("Tỉnh Phú Yên", new double[]{13.1667, 109.0000});
        DISTRICT_COORDINATES.put("Tinh Phu Yen", new double[]{13.1667, 109.0000});
        
        DISTRICT_COORDINATES.put("Tỉnh Quảng Bình", new double[]{17.4683, 106.6222});
        DISTRICT_COORDINATES.put("Tinh Quang Binh", new double[]{17.4683, 106.6222});
        
        DISTRICT_COORDINATES.put("Tỉnh Quảng Nam", new double[]{15.5833, 108.1667});
        DISTRICT_COORDINATES.put("Tinh Quang Nam", new double[]{15.5833, 108.1667});
        
        DISTRICT_COORDINATES.put("Tỉnh Quảng Ngãi", new double[]{15.1167, 108.8000});
        DISTRICT_COORDINATES.put("Tinh Quang Ngai", new double[]{15.1167, 108.8000});
        
        DISTRICT_COORDINATES.put("Tỉnh Quảng Ninh", new double[]{21.0063, 107.2925});
        DISTRICT_COORDINATES.put("Tinh Quang Ninh", new double[]{21.0063, 107.2925});
        
        DISTRICT_COORDINATES.put("Tỉnh Quảng Trị", new double[]{16.7500, 107.0000});
        DISTRICT_COORDINATES.put("Tinh Quang Tri", new double[]{16.7500, 107.0000});
        
        DISTRICT_COORDINATES.put("Tỉnh Sóc Trăng", new double[]{9.6033, 105.9800});
        DISTRICT_COORDINATES.put("Tinh Soc Trang", new double[]{9.6033, 105.9800});
        
        DISTRICT_COORDINATES.put("Tỉnh Sơn La", new double[]{21.1027, 103.7284});
        DISTRICT_COORDINATES.put("Tinh Son La", new double[]{21.1027, 103.7284});
        
        DISTRICT_COORDINATES.put("Tỉnh Tây Ninh", new double[]{11.3333, 106.1000});
        DISTRICT_COORDINATES.put("Tinh Tay Ninh", new double[]{11.3333, 106.1000});
        
        DISTRICT_COORDINATES.put("Tỉnh Thái Bình", new double[]{20.4500, 106.3400});
        DISTRICT_COORDINATES.put("Tinh Thai Binh", new double[]{20.4500, 106.3400});
        
        DISTRICT_COORDINATES.put("Tỉnh Thái Nguyên", new double[]{21.6000, 105.8250});
        DISTRICT_COORDINATES.put("Tinh Thai Nguyen", new double[]{21.6000, 105.8250});
        
        DISTRICT_COORDINATES.put("Tỉnh Thanh Hóa", new double[]{19.8000, 105.7667});
        DISTRICT_COORDINATES.put("Tinh Thanh Hoa", new double[]{19.8000, 105.7667});
        
        DISTRICT_COORDINATES.put("Tỉnh Thừa Thiên Huế", new double[]{16.4637, 107.5909});
        DISTRICT_COORDINATES.put("Tinh Thua Thien Hue", new double[]{16.4637, 107.5909});
        
        DISTRICT_COORDINATES.put("Tỉnh Tiền Giang", new double[]{10.4493, 106.3420});
        DISTRICT_COORDINATES.put("Tinh Tien Giang", new double[]{10.4493, 106.3420});
        
        DISTRICT_COORDINATES.put("Tỉnh Trà Vinh", new double[]{9.9513, 106.3345});
        DISTRICT_COORDINATES.put("Tinh Tra Vinh", new double[]{9.9513, 106.3345});
        
        DISTRICT_COORDINATES.put("Tỉnh Tuyên Quang", new double[]{21.8233, 105.2189});
        DISTRICT_COORDINATES.put("Tinh Tuyen Quang", new double[]{21.8233, 105.2189});
        
        DISTRICT_COORDINATES.put("Tỉnh Vĩnh Long", new double[]{10.2537, 105.9722});
        DISTRICT_COORDINATES.put("Tinh Vinh Long", new double[]{10.2537, 105.9722});
        
        DISTRICT_COORDINATES.put("Tỉnh Vĩnh Phúc", new double[]{21.3609, 105.5474});
        DISTRICT_COORDINATES.put("Tinh Vinh Phuc", new double[]{21.3609, 105.5474});
        
        DISTRICT_COORDINATES.put("Tỉnh Yên Bái", new double[]{21.7000, 104.8667});
        DISTRICT_COORDINATES.put("Tinh Yen Bai", new double[]{21.7000, 104.8667});
        
        // Add no-accent versions for all districts
        DISTRICT_COORDINATES.put("Quan 1", new double[]{10.7629, 106.7078});
        DISTRICT_COORDINATES.put("Quan 2", new double[]{10.7872, 106.7498});
        DISTRICT_COORDINATES.put("Quan 3", new double[]{10.7829, 106.6889});
        DISTRICT_COORDINATES.put("Quan 4", new double[]{10.7666, 106.7050});
        DISTRICT_COORDINATES.put("Quan 5", new double[]{10.7544, 106.6624});
        DISTRICT_COORDINATES.put("Quan 6", new double[]{10.7465, 106.6350});
        DISTRICT_COORDINATES.put("Quan 7", new double[]{10.7323, 106.7274});
        DISTRICT_COORDINATES.put("Quan 8", new double[]{10.7243, 106.6286});
        DISTRICT_COORDINATES.put("Quan 9", new double[]{10.8428, 106.8281});
        DISTRICT_COORDINATES.put("Quan 10", new double[]{10.7679, 106.6669});
        DISTRICT_COORDINATES.put("Quan 11", new double[]{10.7639, 106.6434});
        DISTRICT_COORDINATES.put("Quan 12", new double[]{10.8633, 106.6544});
        DISTRICT_COORDINATES.put("Quan Tan Binh", new double[]{10.8011, 106.6528});
        DISTRICT_COORDINATES.put("Quan Binh Tan", new double[]{10.7655, 106.6031});
        DISTRICT_COORDINATES.put("Quan Tan Phu", new double[]{10.7902, 106.6281});
        DISTRICT_COORDINATES.put("Quan Phu Nhuan", new double[]{10.7944, 106.6789});
        DISTRICT_COORDINATES.put("Quan Go Vap", new double[]{10.8385, 106.6650});
        DISTRICT_COORDINATES.put("Quan Binh Thanh", new double[]{10.8106, 106.6983});
        DISTRICT_COORDINATES.put("Quan Thu Duc", new double[]{10.8497, 106.7870});
        DISTRICT_COORDINATES.put("Quan Cu Chi", new double[]{11.0065, 106.5142});
        DISTRICT_COORDINATES.put("Quan Hoc Mon", new double[]{10.8845, 106.5952});
        DISTRICT_COORDINATES.put("Quan Binh Chanh", new double[]{10.6876, 106.5933});
        DISTRICT_COORDINATES.put("Quan Nha Be", new double[]{10.6969, 106.7471});
        DISTRICT_COORDINATES.put("Quan Can Gio", new double[]{10.5089, 106.8638});
        
        // Add TP Thủ Đức variations
        DISTRICT_COORDINATES.put("TP Thủ Đức", new double[]{10.8497, 106.7870});
        DISTRICT_COORDINATES.put("TP Thu Duc", new double[]{10.8497, 106.7870});
        DISTRICT_COORDINATES.put("Thành phố Thủ Đức", new double[]{10.8497, 106.7870});
        DISTRICT_COORDINATES.put("Thanh pho Thu Duc", new double[]{10.8497, 106.7870});
        
        // Common addresses with specific coordinates
        DISTRICT_COORDINATES.put("12 Đường Trần Hưng Đạo, Quận 5, TP.HCM", new double[]{10.7544, 106.6624});
        DISTRICT_COORDINATES.put("20 Đường Đỗ Xuân Hợp, TP Thủ Đức, TP.HCM", new double[]{10.8497, 106.7870});
        DISTRICT_COORDINATES.put("56 Đường Lê Văn Sỹ, Quận 3, TP.HCM", new double[]{10.7829, 106.6889});
        DISTRICT_COORDINATES.put("78 Đường Cộng Hòa, Quận Tân Bình, TP.HCM", new double[]{10.8011, 106.6528});
        DISTRICT_COORDINATES.put("90 Đường Hoàng Văn Thụ, Quận Phú Nhuận, TP.HCM", new double[]{10.7944, 106.6789});
        DISTRICT_COORDINATES.put("34 Đường Nguyễn Văn Cừ, Quận 1, TP.HCM", new double[]{10.7629, 106.7078});
        DISTRICT_COORDINATES.put("201B Nguyễn Chí Thanh, Phường 12, Quận 5, TP.HCM", new double[]{10.7544, 106.6624});
    }

    @GetMapping("/api/common/distance")
    public ResponseEntity<?> getDistance(
            @RequestParam String origin,
            @RequestParam String destination) {
        logger.info("Calculating straight-line distance from '{}' to '{}'", origin, destination);
        try {
            // Get coordinates for origin
            double[] originCoords = getCoordinates(origin);
            if (originCoords == null) {
                return ResponseEntity.badRequest().body(Map.of(
                    "error", "Không tìm được tọa độ người hiến máu",
                    "address", origin,
                    "suggestion", "Vui lòng kiểm tra lại địa chỉ hoặc sử dụng địa chỉ đầy đủ hơn"
                ));
            }

            // Get coordinates for destination
            double[] destCoords = getCoordinates(destination);
            if (destCoords == null) {
                return ResponseEntity.badRequest().body(Map.of(
                    "error", "Không tìm được tọa độ bệnh viện",
                    "address", destination,
                    "suggestion", "Vui lòng kiểm tra lại địa chỉ bệnh viện hoặc sử dụng tên đầy đủ"
                ));
            }

            // Calculate straight-line distance using Haversine formula
            double distanceKm = calculateHaversineDistance(originCoords[0], originCoords[1], destCoords[0], destCoords[1]);
            String formattedDistance = String.format("%.1f km", distanceKm);
            
            logger.info("Distance calculated: {} km", distanceKm);
            return ResponseEntity.ok(Map.of(
                "text", formattedDistance,
                "distance_km", distanceKm,
                "origin_coords", originCoords,
                "dest_coords", destCoords,
                "method", "straight_line"
            ));
        } catch (Exception e) {
            logger.error("Error calculating distance", e);
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Lỗi hệ thống",
                "suggestion", "Vui lòng thử lại sau"
            ));
        }
    }

    private double[] getCoordinates(String address) {
        try {
            String cleanAddress = normalizeAddress(address);
            logger.debug("Looking up coordinates for: {}", cleanAddress);
            
            // First try exact match
            double[] coords = DISTRICT_COORDINATES.get(cleanAddress);
            if (coords != null) {
                logger.debug("Found exact match coordinates: {}, {}", coords[0], coords[1]);
                return coords;
            }
            
            // Try with accent-removed version
            String noAccentAddress = removeVietnameseAccents(cleanAddress);
            coords = DISTRICT_COORDINATES.get(noAccentAddress);
            if (coords != null) {
                logger.debug("Found no-accent match coordinates: {}, {}", coords[0], coords[1]);
                return coords;
            }
            
            // Try to extract district from address
            String district = extractDistrict(cleanAddress);
            if (district != null) {
                coords = DISTRICT_COORDINATES.get(district);
                if (coords != null) {
                    logger.debug("Found district coordinates: {}, {}", coords[0], coords[1]);
                    return coords;
                }
                
                // Try district without accents
                String noAccentDistrict = removeVietnameseAccents(district);
                coords = DISTRICT_COORDINATES.get(noAccentDistrict);
                if (coords != null) {
                    logger.debug("Found no-accent district coordinates: {}, {}", coords[0], coords[1]);
                    return coords;
                }
            }
            
            logger.warn("No coordinates found for: {}", address);
            return null;
        } catch (Exception e) {
            logger.error("Error getting coordinates for address: {}", address, e);
            return null;
        }
    }
    
    private double calculateHaversineDistance(double lat1, double lon1, double lat2, double lon2) {
        final double R = 6371; // Earth's radius in kilometers
        
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        
        return R * c;
    }

    private String normalizeAddress(String address) {
        if (address == null || address.trim().isEmpty()) {
            return "";
        }
        String normalized = address.trim()
            .replaceAll("\\s+", " ")
            .replace("Đường", "Đường")
            .replace("Quận", "Quận")
            .replace("Phường", "Phường")
            .replace("TP.HCM", "TP.HCM")
            .replace("TP. HCM", "TP.HCM")
            .replace("TP HCM", "TP.HCM")
            .replace("Thành phố Hồ Chí Minh", "TP.HCM")
            .replace("Ho Chi Minh City", "TP.HCM");
        if (!normalized.contains("Vietnam") && !normalized.contains("Việt Nam")) {
            normalized += ", Vietnam";
        }
        return normalized;
    }
    
    private String removeVietnameseAccents(String text) {
        if (text == null) return "";
        
        // Normalize Unicode characters
        String normalized = Normalizer.normalize(text, Normalizer.Form.NFD);
        
        // Remove diacritical marks
        String noAccents = Pattern.compile("\\p{InCombiningDiacriticalMarks}+").matcher(normalized).replaceAll("");
        
        // Replace Vietnamese characters with ASCII equivalents
        return noAccents
            .replace("Đ", "D")
            .replace("đ", "d")
            .replace("Ă", "A")
            .replace("ă", "a")
            .replace("Â", "A")
            .replace("â", "a")
            .replace("Ê", "E")
            .replace("ê", "e")
            .replace("Ô", "O")
            .replace("ô", "o")
            .replace("Ơ", "O")
            .replace("ơ", "o")
            .replace("Ư", "U")
            .replace("ư", "u")
            .replace("Ỳ", "Y")
            .replace("ỳ", "y")
            .replace("Ỵ", "Y")
            .replace("ỵ", "y")
            .replace("Ỷ", "Y")
            .replace("ỷ", "y")
            .replace("Ỹ", "Y")
            .replace("ỹ", "y");
    }
    
    private String extractDistrict(String address) {
        // Extract district information from address
        if (address.contains("Quận")) {
            int quanIndex = address.indexOf("Quận");
            int commaIndex = address.indexOf(",", quanIndex);
            if (commaIndex > quanIndex) {
                return address.substring(quanIndex, commaIndex);
            } else {
                return address.substring(quanIndex);
            }
        } else if (address.contains("TP Thủ Đức") || address.contains("TP Thu Duc")) {
            return "TP Thủ Đức";
        } else if (address.contains("TP.HCM") || address.contains("TP HCM")) {
            return "TP.HCM";
        }
        return null;
    }
} 