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
import com.blooddonation.backend.dto.common.MatchingBloodDTO;
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

@RestController
@RequestMapping("/donor")
public class DonorController {
    private static final Logger logger = LoggerFactory.getLogger(DonorController.class);
    private final DonorService donorService;
    private final BloodGroupRepository bloodGroupRepository;
    private final AccountRepository accountRepository;
    private final DonationRegisterService donationRegisterService;
    private final PreDonationSurveyService preDonationSurveyService;

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
        if (donor.getBloodGroup() != null) {
            dto.setBloodGroup(donor.getBloodGroup().getAboType() + donor.getBloodGroup().getRhFactor());
        } else {
            dto.setBloodGroup(null);
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
            // Xóa luôn khảo sát sức khỏe liên quan
            preDonationSurveyService.deleteSurveysByDonorId(donor.getDonorId());
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

    @DeleteMapping("/survey/delete-by-register/{registerId}")
    public ResponseEntity<?> deleteSurveyByRegister(@PathVariable Integer registerId) {
        preDonationSurveyService.deleteSurveysByDonorId(registerId);
        return ResponseEntity.ok("Đã xóa khảo sát sức khỏe liên quan");
    }
}