package com.blooddonation.backend.controller;

import com.blooddonation.backend.entity.Donor;
import com.blooddonation.backend.service.DonorService;
import com.blooddonation.backend.repository.BloodGroupRepository;
import com.blooddonation.backend.entity.BloodGroup;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.blooddonation.backend.dto.DonorDTO;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/donors")
public class DonorController {
    private final DonorService donorService;
    private final BloodGroupRepository bloodGroupRepository;
    private final com.blooddonation.backend.repository.AccountRepository accountRepository;

    public DonorController(DonorService donorService, BloodGroupRepository bloodGroupRepository, com.blooddonation.backend.repository.AccountRepository accountRepository) {
        this.donorService = donorService;
        this.bloodGroupRepository = bloodGroupRepository;
        this.accountRepository = accountRepository;
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
        DonorDTO dto = new DonorDTO();
        dto.setFullName(donor.getFullName());
        dto.setDateOfBirth(donor.getDateOfBirth() != null ? donor.getDateOfBirth().toString() : null);
        dto.setGender(donor.getGender());
        dto.setAddress(donor.getAddress());
        dto.setPhone(donor.getPhone());
        dto.setEmail(donor.getEmail());
        dto.setJob(donor.getJob());
        if (donor.getBloodGroup() != null) {
            dto.setBloodGroup(donor.getBloodGroup().getAboType() + donor.getBloodGroup().getRhFactor());
        } else {
            dto.setBloodGroup(null);
        }
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
            // Lấy account từ repository
            com.blooddonation.backend.entity.Account account = accountRepository.findByEmail(email)
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
        // Thêm các trường khác nếu cần

        return donorService.saveDonor(existing);
    }
}