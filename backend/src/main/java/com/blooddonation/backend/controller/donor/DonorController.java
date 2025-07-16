package com.blooddonation.backend.controller.donor;
import com.blooddonation.backend.entity.donor.Donor;
import com.blooddonation.backend.dto.donor.DonorDTO;
import com.blooddonation.backend.service.donor.DonorService;
import com.blooddonation.backend.repository.donor.DonorRepository;
import com.blooddonation.backend.repository.admin.BloodGroupRepository;
import com.blooddonation.backend.entity.admin.BloodGroup;
import com.blooddonation.backend.repository.common.AccountRepository;
import com.blooddonation.backend.entity.common.Account;
import com.blooddonation.backend.dto.admin.DonationRegisterDTO;
import com.blooddonation.backend.service.admin.DonationRegisterService;
import com.blooddonation.backend.entity.common.MatchingBlood;
import com.blooddonation.backend.repository.common.MatchingBloodRepository;
import com.blooddonation.backend.entity.admin.MedicalFacility;
import com.blooddonation.backend.repository.admin.MedicalFacilityRepository;
import com.blooddonation.backend.entity.admin.BloodRequest;
import com.blooddonation.backend.repository.admin.BloodRequestRepository;
import com.blooddonation.backend.entity.admin.Certificate;
import com.blooddonation.backend.repository.admin.CertificateRepository;
import com.blooddonation.backend.entity.admin.Staff;
import com.blooddonation.backend.repository.admin.StaffRepository;
import com.blooddonation.backend.entity.common.Account;
import com.blooddonation.backend.entity.common.MatchingBlood;
import com.blooddonation.backend.repository.admin.MedicalFacilityRepository;
import com.blooddonation.backend.entity.admin.MedicalFacility;
import org.springframework.transaction.annotation.Transactional;

import com.blooddonation.backend.service.donor.PreDonationSurveyService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import jakarta.persistence.EntityNotFoundException;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import com.blooddonation.backend.dto.donor.PreDonationSurveyDTO;
import java.time.format.DateTimeFormatter;

@RestController
@RequestMapping("/donor")
public class DonorController {
    private static final Logger logger = LoggerFactory.getLogger(DonorController.class);
    private final DonorService donorService;
    private final BloodGroupRepository bloodGroupRepository;
    private final AccountRepository accountRepository;
    private final DonationRegisterService donationRegisterService;
    private final PreDonationSurveyService preDonationSurveyService;
    @Autowired
    private MatchingBloodRepository matchingBloodRepository;
    @Autowired
    private MedicalFacilityRepository medicalFacilityRepository;
    @Autowired
    private BloodRequestRepository bloodRequestRepository;
    @Autowired
    private CertificateRepository certificateRepository;
    @Autowired
    private StaffRepository staffRepository;

    public DonorController(DonorService donorService, BloodGroupRepository bloodGroupRepository, AccountRepository accountRepository, DonationRegisterService donationRegisterService, PreDonationSurveyService preDonationSurveyService) {
        this.donorService = donorService;
        this.bloodGroupRepository = bloodGroupRepository;
        this.accountRepository = accountRepository;
        this.donationRegisterService = donationRegisterService;
        this.preDonationSurveyService = preDonationSurveyService;
    }

    @GetMapping
    public List<Donor> getAllDonors() {
        return donorService.getAllDonors();
    }

    @GetMapping("/{id}")
    public Donor getDonorById(@PathVariable Integer id) {
        return donorService.getDonorById(id);
    }

    @PostMapping
    public Donor createDonor(@RequestBody Donor donor) {
        return donorService.saveDonor(donor);
    }

    @DeleteMapping("/{id}")
    public void deleteDonor(@PathVariable Integer id) {
        donorService.deleteDonor(id);
    }

    @GetMapping("/email/{email}")
    public Donor getDonorByEmail(@PathVariable String email) {
        return donorService.getDonorByEmail(email);
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(Authentication authentication) {
        String email = authentication.getName();
        Donor donor = donorService.getDonorByEmail(email);
        if (donor == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", "Donor profile not found", "message", "Please complete your profile information"));
        }
        logger.info("Donor weight from database: {}", donor.getWeight());
        DonorDTO dto = new DonorDTO();
        dto.setDonorId(donor.getDonorId());
        dto.setFullName(donor.getFullName());
        dto.setDateOfBirth(donor.getDateOfBirth() != null ? donor.getDateOfBirth().toString() : null);
        dto.setGender(donor.getGender());
        dto.setAddress(donor.getAddress());
        dto.setPhone(donor.getPhone());
        dto.setEmail(donor.getEmail());
        dto.setJob(donor.getJob());
        dto.setWeight(donor.getWeight());
        dto.setLastDonationDate(donor.getLastDonationDate() != null ? donor.getLastDonationDate().toString() : null);
        dto.setIsEligible(donor.getIsEligible());
        dto.setAvailableFrom(donor.getAvailableFrom() != null ? donor.getAvailableFrom().toString() : null);
        dto.setAvailableUntil(donor.getAvailableUntil() != null ? donor.getAvailableUntil().toString() : null);
        
        if (donor.getBloodGroup() != null) {
            dto.setBloodGroup(donor.getBloodGroup().getAboType() + donor.getBloodGroup().getRhFactor());
            dto.setAboType(donor.getBloodGroup().getAboType());
            dto.setRhFactor(donor.getBloodGroup().getRhFactor());
        } else {
            dto.setBloodGroup(null);
            dto.setAboType(null);
            dto.setRhFactor(null);
        }
        logger.info("DonorDTO after mapping: {}", dto);
        return ResponseEntity.ok(dto);
    }

    @PutMapping("/profile")
    public Donor updateProfile(Authentication authentication, @RequestBody Map<String, Object> body) {
        String email = authentication.getName();
        Donor existing = donorService.getDonorByEmail(email);
        if (existing == null) {
            // Tạo mới donor nếu chưa có
            existing = new Donor();
            existing.setEmail(email);
          
            Account account = accountRepository.findByEmail(email)
                .orElseThrow(() -> new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.NOT_FOUND, "Account not found"));
            existing.setAccount(account);
        }

        // Tách bloodGroup
        String bloodGroupStr = (String) body.get("bloodGroup");
        if (bloodGroupStr != null && !bloodGroupStr.isEmpty()) {
            String aboType = bloodGroupStr.replaceAll("[+-]", "");
            String rhFactor = bloodGroupStr.endsWith("+") ? "+" : "-";
            Optional<BloodGroup> bgOpt = bloodGroupRepository.findByAboTypeAndRhFactor(aboType, rhFactor);
            BloodGroup bloodGroup = bgOpt.orElseGet(() -> {
                BloodGroup bg = new BloodGroup();
                bg.setAboType(aboType);
                bg.setRhFactor(rhFactor);
                return bloodGroupRepository.save(bg);
            });
            existing.setBloodGroup(bloodGroup);
        }

        // Cập nhật các trường khác
        if (body.get("fullName") != null) existing.setFullName((String) body.get("fullName"));
        if (body.get("dateOfBirth") != null) existing.setDateOfBirth(java.time.LocalDate.parse((String) body.get("dateOfBirth")));
        if (body.get("gender") != null) existing.setGender((String) body.get("gender"));
        if (body.get("address") != null) existing.setAddress((String) body.get("address"));
        if (body.get("phone") != null) existing.setPhone((String) body.get("phone"));
        if (body.get("email") != null) existing.setEmail((String) body.get("email"));
        if (body.get("job") != null) existing.setJob((String) body.get("job"));
        if (body.get("weight") != null) {
            try {
                existing.setWeight(new BigDecimal(body.get("weight").toString()));
            } catch (NumberFormatException e) {
                logger.warn("Invalid weight format: {}", body.get("weight"));
            }
        }
        // Bổ sung cập nhật các trường sẵn sàng hiến máu
        if (body.containsKey("availableFrom")) {
            if (body.get("availableFrom") == null) existing.setAvailableFrom(null);
            else existing.setAvailableFrom(java.time.LocalDate.parse((String) body.get("availableFrom")));
        }
        if (body.containsKey("availableUntil")) {
            if (body.get("availableUntil") == null) existing.setAvailableUntil(null);
            else existing.setAvailableUntil(java.time.LocalDate.parse((String) body.get("availableUntil")));
        }
        if (body.get("isEligible") != null) existing.setIsEligible(Boolean.parseBoolean(body.get("isEligible").toString()));
        if (body.get("note") != null) existing.setNote((String) body.get("note"));
        // Thêm các trường khác nếu cần

        return donorService.saveDonor(existing);
    }

    // API đăng ký hiến máu cho donor
    @PostMapping("/register-donation")
    public ResponseEntity<?> registerDonation(@RequestBody DonationRegisterDTO dto) {
        DonationRegisterDTO created = donationRegisterService.createDonationRegister(dto);
        return ResponseEntity.ok(created);
    }

    @DeleteMapping("/register-donation/{registerId}")
    public ResponseEntity<?> deleteOwnDonationRegister(
            @PathVariable Integer registerId,
            Authentication authentication) {
        logger.info("[DELETE] Nhận request xóa đơn đăng ký: registerId={}", registerId);
        String email = authentication.getName();
        logger.info("[DELETE] Email xác thực: {}", email);
        Donor donor = donorService.getDonorByEmail(email);
        if (donor == null) {
            logger.warn("[DELETE] Không tìm thấy donor với email: {}", email);
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Donor not found");
        }
        // Kiểm tra quyền và tồn tại trước khi xóa
        DonationRegisterDTO register;
        try {
            register = donationRegisterService.getDonationRegister(registerId);
        } catch (EntityNotFoundException e) {
            logger.warn("[DELETE] Đơn không tồn tại hoặc đã bị xóa: registerId={}", registerId);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Đơn đã bị xóa hoặc không tồn tại");
        }
        if (!register.getDonorId().equals(donor.getDonorId())) {
            logger.warn("[DELETE] Donor không có quyền xóa đơn: donorId={}, registerDonorId={}", donor.getDonorId(), register.getDonorId());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Bạn không có quyền xóa đơn này");
        }
        try {
            logger.info("[DELETE] Bắt đầu xóa đơn: registerId={}", registerId);
            donationRegisterService.deleteDonationRegister(registerId);
            logger.info("[DELETE] Đã xóa thành công đơn: registerId={}", registerId);
        } catch (Exception ex) {
            logger.error("[DELETE] Lỗi khi xóa đơn: registerId={}, lỗi: {}", registerId, ex.getMessage(), ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi khi xóa đơn: " + ex.getMessage());
        }
        return ResponseEntity.ok().body("Xóa thành công");
    }

    @GetMapping("/donation-history")
    public List<DonationRegisterDTO> getDonationHistory(Authentication authentication) {
        String email = authentication.getName();
        Donor donor = donorService.getDonorByEmail(email);
        if (donor == null) return List.of();
        return donationRegisterService.getDonationRegistersByDonor(donor.getDonorId());
    }

    @GetMapping("/donation-detail/{id}")
    public ResponseEntity<?> getDonationDetail(@PathVariable Integer id, Authentication authentication) {
        String email = authentication.getName();
        System.out.println("DEBUG - Email từ token: " + email);

        Donor donor = donorService.getDonorByEmail(email);
        if (donor == null) {
            System.out.println("DEBUG - Không tìm thấy donor với email: " + email);
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Donor not found");
        }
        System.out.println("DEBUG - donorId từ token: " + donor.getDonorId());

        DonationRegisterDTO register;
        try {
            register = donationRegisterService.getDonationRegister(id);
        } catch (EntityNotFoundException e) {
            System.out.println("DEBUG - Không tìm thấy lịch hẹn id: " + id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy lịch hẹn");
        }
        System.out.println("DEBUG - donorId của lịch hẹn: " + register.getDonorId());

        if (!register.getDonorId().equals(donor.getDonorId())) {
            System.out.println("DEBUG - Không trùng donorId, trả về 403");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Bạn không có quyền xem lịch hẹn này");
        }

        System.out.println("DEBUG - Trả về chi tiết lịch hẹn cho donorId: " + donor.getDonorId());
        return ResponseEntity.ok(register);
    }

    @GetMapping("/donation-registration-info")
    public ResponseEntity<?> getDonationRegistrationInfo(Authentication authentication) {
        String email = authentication.getName();
        Donor donor = donorService.getDonorByEmail(email);
        if (donor == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Donor not found");
        }

        // Lấy đơn đăng ký hiến máu mới nhất của donor
        List<DonationRegisterDTO> registers = donationRegisterService.getDonationRegistersByDonor(donor.getDonorId());
        
        // Lọc ra đơn chưa hoàn thành (donation_status != "completed")
        DonationRegisterDTO latestRegister = registers.stream()
            .filter(register -> !"completed".equals(register.getDonationStatus()))
            .findFirst()
            .orElse(null);

        // Lấy khảo sát sức khỏe mới nhất
        PreDonationSurveyDTO latestSurvey = preDonationSurveyService.getLatestSurvey(donor.getDonorId());

        Map<String, Object> response = new java.util.HashMap<>();
        response.put("donor", donor);
        response.put("latestRegister", latestRegister);
        response.put("latestSurvey", latestSurvey);

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/survey/delete-by-register/{registerId}")
    public ResponseEntity<?> deleteSurveyByRegister(@PathVariable Integer registerId) {
        preDonationSurveyService.deleteSurveysByDonorId(registerId);
        return ResponseEntity.ok("Đã xóa khảo sát sức khỏe liên quan");
    }

    @GetMapping("/eligible")
    public List<Map<String, Object>> getEligibleDonors() {
        List<Donor> donors = donorService.getEligibleDonors();
        return donors.stream().map(d -> {
            Map<String, Object> map = new java.util.HashMap<>();
            map.put("donor_id", d.getDonorId());
            map.put("full_name", d.getFullName());
            map.put("date_of_birth", d.getDateOfBirth());
            map.put("phone", d.getPhone());
            map.put("address", d.getAddress());
            map.put("available_from", d.getAvailableFrom());
            map.put("available_until", d.getAvailableUntil());
            map.put("abo_type", d.getBloodGroup() != null ? d.getBloodGroup().getAboType() : null);
            map.put("rh_factor", d.getBloodGroup() != null ? d.getBloodGroup().getRhFactor() : null);
            return map;
        }).collect(java.util.stream.Collectors.toList());
    }

    // API cập nhật status phản hồi của donor cho matching_blood
    @PutMapping("/emergency-request/{requestId}/response")
    @PreAuthorize("hasRole('DONOR')")
    public ResponseEntity<?> updateMatchingBloodStatus(@PathVariable Integer requestId, @RequestBody Map<String, Object> body, Authentication authentication) {
        String email = authentication.getName();
        Donor donor = donorService.getDonorByEmail(email);
        final Integer donorId = (donor != null) ? donor.getDonorId() : null;
        if (donorId == null) {
            return ResponseEntity.status(403).body(Map.of("error", "Không xác định được donor"));
        }
        String status = (String) body.get("status");
        if (status == null || (!status.equals("contact_successful") && !status.equals("rejected"))) {
            return ResponseEntity.badRequest().body(Map.of("error", "Trạng thái không hợp lệ"));
        }
        MatchingBlood matching = matchingBloodRepository.findByRequestId(requestId).stream()
            .filter(mb -> mb.getDonorId().equals(donorId))
            .findFirst().orElse(null);
        if (matching == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Không tìm thấy matching cho donor này"));
        }
        if (matching.getStatus() == null || !matching.getStatus().equals("contacting")) {
            return ResponseEntity.badRequest().body(Map.of("error", "Không thể cập nhật trạng thái cho matching này (trạng thái hiện tại: " + (matching.getStatus() == null ? "null" : matching.getStatus()) + ")"));
        }
        matching.setStatus(status);
        matching.setResponseTime(java.time.LocalDateTime.now());
        matchingBloodRepository.save(matching);
        return ResponseEntity.ok(Map.of("message", "Cập nhật trạng thái thành công"));
    }

    // API lấy lịch sử matching blood của donor
    @GetMapping("/matching-history")
    public ResponseEntity<?> getMatchingHistory(Authentication authentication) {
        String email = authentication.getName();
        Donor donor = donorService.getDonorByEmail(email);
        if (donor == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Donor not found");
        }

        List<MatchingBlood> matchingList = matchingBloodRepository.findByDonorId(donor.getDonorId());
        
        List<Map<String, Object>> result = matchingList.stream().map(matching -> {
            Map<String, Object> item = new java.util.HashMap<>();
            item.put("matchingId", matching.getMatchingId());
            item.put("status", matching.getStatus());
            item.put("arrivalTime", matching.getArrivalTime());
            item.put("quantityMl", matching.getQuantityMl());
            item.put("notes", matching.getNotes());
            item.put("createdAt", matching.getCreatedAt());
            
            // Lấy thông tin facility
            Optional<MedicalFacility> facilityOpt = medicalFacilityRepository.findById(matching.getFacilityId().longValue());
            if (facilityOpt.isPresent()) {
                MedicalFacility facility = facilityOpt.get();
                item.put("address", facility.getAddress());
                item.put("facilityName", facility.getFacilityName());
            } else {
                item.put("address", "Không xác định");
                item.put("facilityName", "Không xác định");
            }
            
            return item;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(result);
    }

    // API lấy chi tiết matching blood của donor
    @GetMapping("/matching-detail/{matchingId}")
    public ResponseEntity<?> getMatchingDetail(@PathVariable Integer matchingId, Authentication authentication) {
        String email = authentication.getName();
        Donor donor = donorService.getDonorByEmail(email);
        if (donor == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Donor not found");
        }

        Optional<MatchingBlood> matchingOpt = matchingBloodRepository.findById(matchingId);
        if (!matchingOpt.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy lịch hẹn");
        }

        MatchingBlood matching = matchingOpt.get();
        
        // Kiểm tra quyền xem
        if (!matching.getDonorId().equals(donor.getDonorId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Bạn không có quyền xem lịch hẹn này");
        }

        Map<String, Object> result = new java.util.HashMap<>();
        result.put("matchingId", matching.getMatchingId());
        result.put("status", matching.getStatus());
        result.put("arrivalTime", matching.getArrivalTime());
        result.put("quantityMl", matching.getQuantityMl());
        result.put("notes", matching.getNotes());
        result.put("createdAt", matching.getCreatedAt());
        result.put("responseTime", matching.getResponseTime());
        result.put("notificationSentAt", matching.getNotificationSentAt());
        
        // Lấy thông tin facility
        Optional<MedicalFacility> facilityOpt = medicalFacilityRepository.findById(matching.getFacilityId().longValue());
        if (facilityOpt.isPresent()) {
            MedicalFacility facility = facilityOpt.get();
            result.put("address", facility.getAddress());
            result.put("facilityName", facility.getFacilityName());
            result.put("phone", facility.getPhone());
            result.put("email", facility.getEmail());
        } else {
            result.put("address", "Không xác định");
            result.put("facilityName", "Không xác định");
            result.put("phone", "Không xác định");
            result.put("email", "Không xác định");
        }

        // Lấy thông tin blood request nếu cần
        Optional<BloodRequest> requestOpt = bloodRequestRepository.findById(matching.getRequestId());
        if (requestOpt.isPresent()) {
            BloodRequest request = requestOpt.get();
            result.put("bloodGroup", request.getBloodGroup() != null ? 
                request.getBloodGroup().getAboType() + request.getBloodGroup().getRhFactor() : null);
            result.put("quantityRequested", request.getQuantityRequested());
            result.put("isEmergency", request.getIsEmergency());
            result.put("patientInfo", request.getPatientInfo());
        }

        return ResponseEntity.ok(result);
    }

    // API lấy danh sách chứng nhận của donor hiện tại
    @GetMapping("/certificates")
    public ResponseEntity<?> getCertificates(Authentication authentication) {
        String email = authentication.getName();
        Donor donor = donorService.getDonorByEmail(email);
        if (donor == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Donor not found");
        }
        List<Certificate> certs = certificateRepository.findByDonorDonorId(donor.getDonorId());
        List<Map<String, Object>> result = certs.stream().map(cert -> {
            Map<String, Object> item = new java.util.HashMap<>();
            item.put("certificateId", cert.getCertificateId());
            item.put("certificateNumber", cert.getCertificateNumber());
            item.put("issuedDate", cert.getIssuedDate());
            item.put("notes", cert.getNotes());
            item.put("bloodVolume", cert.getBloodVolume());
            item.put("matchingId", cert.getMatching() != null ? cert.getMatching().getMatchingId() : null);
            item.put("registerId", cert.getRegister() != null ? cert.getRegister().getRegisterId() : null);
            item.put("donationDate", cert.getDonationDate());
            item.put("createdAt", cert.getCreatedAt());
            item.put("donorName", donor.getFullName());
            item.put("dateOfBirth", donor.getDateOfBirth());
            item.put("address", donor.getAddress());
            // Địa chỉ: luôn là "Chứng nhận Hiến Máu Tình Nguyện"
            item.put("addressDisplay", "Chứng nhận Hiến Máu Tình Nguyện");
            return item;
        }).toList();
        return ResponseEntity.ok(result);
    }

    // API lấy chi tiết chứng nhận
    @GetMapping("/certificate-detail/{certificateId}")
    @Transactional(readOnly = true)
    public ResponseEntity<?> getCertificateDetail(@PathVariable Integer certificateId, Authentication authentication) {
        String email = authentication.getName();
        Donor donor = donorService.getDonorByEmail(email);
        if (donor == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Donor not found");
        }
        Certificate cert = certificateRepository.findById(certificateId).orElse(null);
        if (cert == null || !cert.getDonor().getDonorId().equals(donor.getDonorId())) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Certificate not found or not yours");
        }
        Map<String, Object> result = new java.util.HashMap<>();
        result.put("certificateId", cert.getCertificateId());
        result.put("certificateNumber", cert.getCertificateNumber());
        result.put("issuedDate", cert.getIssuedDate());
        result.put("notes", cert.getNotes());
        result.put("bloodVolume", cert.getBloodVolume());
        result.put("donationDate", cert.getDonationDate());
        result.put("createdAt", cert.getCreatedAt());
        result.put("donorName", donor.getFullName());
        result.put("dateOfBirth", donor.getDateOfBirth());
        result.put("address", donor.getAddress());
        // Địa chỉ hiển thị
        result.put("addressDisplay", "Chứng nhận Hiến Máu Tình Nguyện");
        // Tên bệnh viện
        String facilityName = "Trung tâm Hiến Máu Tình Nguyện";
        if (cert.getMatching() != null) {
            MatchingBlood matching = cert.getMatching();
            if (matching.getFacilityId() != null) {
                MedicalFacility facility = medicalFacilityRepository.findById(matching.getFacilityId().longValue()).orElse(null);
                if (facility != null) facilityName = facility.getFacilityName();
            }
        }
        result.put("facilityName", facilityName);
        // Staff cấp bởi
        Staff staff = cert.getIssuedByStaff();
        String staffRole = "";
        String staffName = staff.getFullName();
        if (staff.getAccount() != null) {
            String role = staff.getAccount().getRole();
            if ("admin".equals(role)) staffRole = "Quản lí";
            else if ("staff".equals(role)) staffRole = "Nhân viên";
            else staffRole = role;
        }
        result.put("issuedByRole", staffRole);
        result.put("issuedByName", staffName);
        result.put("certificateNumber", cert.getCertificateNumber());
        return ResponseEntity.ok(result);
    }
}