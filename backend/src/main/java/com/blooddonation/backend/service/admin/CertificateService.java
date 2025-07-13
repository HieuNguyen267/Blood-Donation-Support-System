package com.blooddonation.backend.service.admin;

import com.blooddonation.backend.dto.admin.CertificateDTO;
import com.blooddonation.backend.entity.admin.Certificate;
import com.blooddonation.backend.entity.admin.Staff;
import com.blooddonation.backend.entity.admin.DonationRegister;
import com.blooddonation.backend.entity.common.MatchingBlood;
import com.blooddonation.backend.entity.donor.Donor;
import com.blooddonation.backend.repository.admin.CertificateRepository;
import com.blooddonation.backend.repository.admin.StaffRepository;
import com.blooddonation.backend.repository.common.MatchingBloodRepository;
import com.blooddonation.backend.repository.donor.DonorRepository;
import com.blooddonation.backend.repository.admin.DonationRegisterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class CertificateService {

    @Autowired
    private CertificateRepository certificateRepository;

    @Autowired
    private DonorRepository donorRepository;

    @Autowired
    private StaffRepository staffRepository;

    @Autowired
    private MatchingBloodRepository matchingBloodRepository;

    @Autowired
    private DonationRegisterRepository donationRegisterRepository;

    /**
     * Tạo certificate number tự động theo format Hxxx Mxxx Txxx Nxxx
     */
    private String generateCertificateNumber() {
        LocalDate today = LocalDate.now();
        String dateStr = today.format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        
        // Đếm số certificate đã tạo hôm nay
        Long todayCount = certificateRepository.countCertificatesIssuedToday();
        int sequence = todayCount.intValue() + 1;
        
        return String.format("H%s M%03d T%03d N%03d", 
            dateStr.substring(2, 8), // Lấy 6 số cuối của năm và tháng
            today.getDayOfMonth(),
            sequence,
            sequence);
    }

    /**
     * Tạo certificate từ matching
     */
    public CertificateDTO createCertificateFromMatching(Integer matchingId, Integer staffId, String notes) {
        // Kiểm tra đã có certificate cho matching này chưa
        if (!certificateRepository.findByMatchingMatchingId(matchingId).isEmpty()) {
            throw new RuntimeException("Đã cấp chứng nhận cho matching này!");
        }
        MatchingBlood matching = matchingBloodRepository.findById(matchingId)
            .orElseThrow(() -> new RuntimeException("Matching not found"));

        Donor donor = donorRepository.findById(matching.getDonorId())
            .orElseThrow(() -> new RuntimeException("Donor not found"));

        Staff staff = staffRepository.findById(staffId)
            .orElseThrow(() -> new RuntimeException("Staff not found"));

        Certificate certificate = new Certificate();
        certificate.setDonor(donor);
        certificate.setMatching(matching);
        certificate.setCertificateNumber(generateCertificateNumber());
        certificate.setDonationDate(matching.getNotificationSentAt().toLocalDate());
        certificate.setBloodVolume(matching.getQuantityMl());
        certificate.setIssuedDate(LocalDate.now());
        certificate.setIssuedByStaff(staff);
        certificate.setNotes(notes);

        Certificate savedCertificate = certificateRepository.save(certificate);
        return convertToDTO(savedCertificate);
    }

    /**
     * Tạo certificate từ donation register
     */
    public CertificateDTO createCertificateFromRegister(Integer registerId, Integer staffId, String notes) {
        // Kiểm tra đã có certificate cho register này chưa
        if (!certificateRepository.findByRegisterRegisterId(registerId).isEmpty()) {
            throw new RuntimeException("Đã cấp chứng nhận cho quá trình hiến này!");
        }
        var registerOpt = donationRegisterRepository.findById(registerId);
        if (registerOpt.isEmpty()) throw new RuntimeException("Không tìm thấy quá trình hiến máu");
        var register = registerOpt.get();
        var donor = register.getDonor();
        var staff = staffRepository.findById(staffId).orElseThrow(() -> new RuntimeException("Staff not found"));
        Certificate certificate = new Certificate();
        certificate.setDonor(donor);
        certificate.setRegister(register);
        certificate.setCertificateNumber(generateCertificateNumber());
        certificate.setDonationDate(register.getAppointmentDate());
        certificate.setBloodVolume(register.getQuantityMl());
        certificate.setIssuedDate(java.time.LocalDate.now());
        certificate.setIssuedByStaff(staff);
        certificate.setNotes(notes);
        Certificate savedCertificate = certificateRepository.save(certificate);
        return convertToDTO(savedCertificate);
    }

    /**
     * Lấy tất cả certificates
     */
    public List<CertificateDTO> getAllCertificates() {
        return certificateRepository.findAll().stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }

    /**
     * Tìm certificate theo ID
     */
    public CertificateDTO getCertificateById(Integer certificateId) {
        Certificate certificate = certificateRepository.findById(certificateId)
            .orElseThrow(() -> new RuntimeException("Certificate not found"));
        return convertToDTO(certificate);
    }

    /**
     * Tìm certificate theo certificate number
     */
    public CertificateDTO getCertificateByNumber(String certificateNumber) {
        Certificate certificate = certificateRepository.findByCertificateNumber(certificateNumber)
            .orElseThrow(() -> new RuntimeException("Certificate not found"));
        return convertToDTO(certificate);
    }

    /**
     * Tìm certificates theo donor ID
     */
    public List<CertificateDTO> getCertificatesByDonorId(Integer donorId) {
        return certificateRepository.findByDonorDonorId(donorId).stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }

    /**
     * Tìm certificates theo matching ID
     */
    public List<CertificateDTO> getCertificatesByMatchingId(Integer matchingId) {
        return certificateRepository.findByMatchingMatchingId(matchingId).stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }

    /**
     * Tìm certificates theo register ID
     */
    public List<CertificateDTO> getCertificatesByRegisterId(Integer registerId) {
        return certificateRepository.findByRegisterRegisterId(registerId).stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }

    /**
     * Search certificates
     */
    public List<CertificateDTO> searchCertificates(String searchTerm) {
        return certificateRepository.searchByCertificateNumberOrDonorName(searchTerm).stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }

    /**
     * Convert entity to DTO
     */
    private CertificateDTO convertToDTO(Certificate certificate) {
        CertificateDTO dto = new CertificateDTO();
        dto.setCertificateId(certificate.getCertificateId());
        dto.setDonorId(certificate.getDonor().getDonorId());
        dto.setDonorName(certificate.getDonor().getFullName());
        
        if (certificate.getRegister() != null) {
            dto.setRegisterId(certificate.getRegister().getRegisterId());
        }
        
        if (certificate.getMatching() != null) {
            dto.setMatchingId(certificate.getMatching().getMatchingId());
        }
        
        dto.setCertificateNumber(certificate.getCertificateNumber());
        dto.setDonationDate(certificate.getDonationDate());
        dto.setBloodVolume(certificate.getBloodVolume());
        dto.setIssuedDate(certificate.getIssuedDate());
        dto.setIssuedByStaffId(certificate.getIssuedByStaff().getStaffId());
        dto.setIssuedByStaffName(certificate.getIssuedByStaff().getFullName());
        dto.setNotes(certificate.getNotes());
        dto.setCreatedAt(certificate.getCreatedAt());
        dto.setUpdatedAt(certificate.getUpdatedAt());
        
        return dto;
    }
} 