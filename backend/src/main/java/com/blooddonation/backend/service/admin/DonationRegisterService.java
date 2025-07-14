package com.blooddonation.backend.service.admin;

import com.blooddonation.backend.dto.admin.DonationRegisterDTO;
import com.blooddonation.backend.dto.admin.DonationManagementDTO;
import com.blooddonation.backend.entity.admin.DonationRegister;
import com.blooddonation.backend.entity.donor.Donor;
import com.blooddonation.backend.entity.common.Event;
import com.blooddonation.backend.entity.admin.Staff;
import com.blooddonation.backend.repository.admin.DonationRegisterRepository;
import com.blooddonation.backend.repository.donor.DonorRepository;
import com.blooddonation.backend.repository.common.EventRepository;
import com.blooddonation.backend.repository.admin.StaffRepository;
import com.blooddonation.backend.repository.admin.BloodCheckRepository;
import com.blooddonation.backend.entity.admin.BloodCheck;
import com.blooddonation.backend.repository.donor.PreDonationSurveyRepository;
import com.blooddonation.backend.repository.common.TimeEventRepository;
import com.blooddonation.backend.entity.common.TimeEvent;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import jakarta.persistence.EntityNotFoundException;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.blooddonation.backend.service.donor.PreDonationSurveyService;
import com.blooddonation.backend.dto.donor.PreDonationSurveyDTO;
import com.blooddonation.backend.entity.donor.PreDonationSurvey;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class DonationRegisterService {

    @Autowired
    private DonationRegisterRepository donationRegisterRepository;

    @Autowired
    private DonorRepository donorRepository;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private StaffRepository staffRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private PreDonationSurveyService preDonationSurveyService;

    @Autowired
    private BloodCheckRepository bloodCheckRepository;

    @Autowired
    private PreDonationSurveyRepository surveyRepository;

    @Autowired
    private TimeEventRepository timeEventRepository;

    // DONATION MANAGEMENT METHODS - Phương thức mới cho trang quản lý đơn hiến
    
    /**
     * Lấy tất cả đơn hiến để hiển thị trong trang quản lý
     * Chỉ lấy status: pending, confirmed, cancelled
     */
    public List<DonationManagementDTO> getAllForManagement() {
        return donationRegisterRepository.findAllForManagement();
    }

    /**
     * Lấy đơn hiến theo status để hiển thị trong trang quản lý
     */
    public List<DonationManagementDTO> getByStatusForManagement(String status) {
        // Validate status
        if (!List.of("pending", "confirmed", "cancelled").contains(status.toLowerCase())) {
            throw new IllegalArgumentException("Invalid status. Must be: pending, confirmed, cancelled");
        }
        return donationRegisterRepository.findByStatusForManagement(status.toLowerCase());
    }

    /**
     * Lấy đơn hiến theo nhóm máu để hiển thị trong trang quản lý
     */
    public List<DonationManagementDTO> getByBloodGroupForManagement(String bloodGroup) {
        // Parse blood group (e.g., "A+" -> aboType="A", rhFactor="positive")
        String aboType;
        String rhFactor;
        
        if (bloodGroup.endsWith("+")) {
            aboType = bloodGroup.substring(0, bloodGroup.length() - 1);
            rhFactor = "positive";
        } else if (bloodGroup.endsWith("-")) {
            aboType = bloodGroup.substring(0, bloodGroup.length() - 1);
            rhFactor = "negative";
        } else {
            // Special cases like "Rh NULL", "Bombay"
            aboType = bloodGroup;
            rhFactor = "null";
        }
        
        return donationRegisterRepository.findByBloodGroupForManagement(aboType, rhFactor);
    }

    /**
     * Search đơn hiến theo tên người hiến để hiển thị trong trang quản lý
     */
    public List<DonationManagementDTO> searchByDonorNameForManagement(String searchTerm) {
        if (searchTerm == null || searchTerm.trim().isEmpty()) {
            return getAllForManagement();
        }
        return donationRegisterRepository.findByDonorNameForManagement(searchTerm.trim());
    }

    /**
     * Cập nhật status của đơn hiến (để admin approve/reject)
     */
    public DonationManagementDTO updateDonationStatus(Integer registerId, String newStatus) {
        // Validate status
        if (!List.of("pending", "confirmed", "Not meeting health requirements").contains(newStatus)) {
            throw new IllegalArgumentException("Invalid status. Must be: pending, confirmed, Not meeting health requirements");
        }

        DonationRegister register = donationRegisterRepository.findById(registerId)
            .orElseThrow(() -> new EntityNotFoundException("Donation register not found with id: " + registerId));

        if ("confirmed".equals(newStatus)) {
            register.setStatus("confirmed");
            register.setDonationStatus("processing");
        } else if ("Not meeting health requirements".equals(newStatus)) {
            register.setStatus("Not meeting health requirements");
            register.setDonationStatus("");
        } else {
            register.setStatus(newStatus.toLowerCase());
            register.setDonationStatus("");
        }
        register.setUpdatedAt(LocalDateTime.now());
        DonationRegister updatedRegister = donationRegisterRepository.save(register);
        // Return updated DTO
        return new DonationManagementDTO(
            updatedRegister.getRegisterId(),
            updatedRegister.getDonor().getFullName(),
            updatedRegister.getAppointmentDate(),
            updatedRegister.getStatus(),
            updatedRegister.getDonationStatus(), // truyền thêm donationStatus
            updatedRegister.getDonor().getBloodGroup().getAboType() + 
            (updatedRegister.getDonor().getBloodGroup().getRhFactor().equals("positive") ? "+" : 
             updatedRegister.getDonor().getBloodGroup().getRhFactor().equals("negative") ? "-" : "")
        );
    }

    // DONATION PROCESS MANAGEMENT METHODS
    public List<DonationManagementDTO> getAllForProcessManagement() {
        return donationRegisterRepository.findAllForProcessManagement();
    }
    public List<DonationManagementDTO> getByStatusForProcessManagement(String donationStatus) {
        return donationRegisterRepository.findByStatusForProcessManagement(donationStatus);
    }
    public List<DonationManagementDTO> getByBloodGroupForProcessManagement(String bloodGroup) {
        String aboType;
        String rhFactor;
        if (bloodGroup.endsWith("+")) {
            aboType = bloodGroup.substring(0, bloodGroup.length() - 1);
            rhFactor = "positive";
        } else if (bloodGroup.endsWith("-")) {
            aboType = bloodGroup.substring(0, bloodGroup.length() - 1);
            rhFactor = "negative";
        } else {
            aboType = bloodGroup;
            rhFactor = "null";
        }
        return donationRegisterRepository.findByBloodGroupForProcessManagement(aboType, rhFactor);
    }
    public List<DonationManagementDTO> searchByDonorNameForProcessManagement(String searchTerm) {
        if (searchTerm == null || searchTerm.trim().isEmpty()) {
            return getAllForProcessManagement();
        }
        return donationRegisterRepository.findByDonorNameForProcessManagement(searchTerm.trim());
    }

    // DONATION PROCESS SPECIFIC METHODS - Phương thức cho trang chi tiết quá trình hiến

    /**
     * Cập nhật kết quả kiểm tra sức khỏe
     */
    public DonationRegisterDTO updateHealthCheckResult(Integer registerId, String healthCheckResult) {
        DonationRegister register = donationRegisterRepository.findById(registerId)
            .orElseThrow(() -> new EntityNotFoundException("Donation register not found with id: " + registerId));

        register.setHealthCheckResult(healthCheckResult);
        register.setUpdatedAt(LocalDateTime.now());
        
        DonationRegister updatedRegister = donationRegisterRepository.save(register);
        return convertToDTO(updatedRegister);
    }

    /**
     * Cập nhật số lượng máu hiến
     */
    public DonationRegisterDTO updateBloodQuantity(Integer registerId, Integer quantity) {
        DonationRegister register = donationRegisterRepository.findById(registerId)
            .orElseThrow(() -> new EntityNotFoundException("Donation register not found with id: " + registerId));

        register.setQuantityMl(quantity);
        register.setUpdatedAt(LocalDateTime.now());
        
        DonationRegister updatedRegister = donationRegisterRepository.save(register);
        return convertToDTO(updatedRegister);
    }

    /**
     * Cập nhật trạng thái quá trình hiến (processing, deferred, completed)
     */
    public DonationRegisterDTO updateDonationProcessStatus(Integer registerId, String donationStatus, String incidentDescription, Integer staffId) {
        DonationRegister register = donationRegisterRepository.findById(registerId)
            .orElseThrow(() -> new EntityNotFoundException("Donation register not found with id: " + registerId));

        // Validate donation status
        if (!List.of("processing", "deferred", "completed").contains(donationStatus)) {
            throw new IllegalArgumentException("Invalid donation status. Must be: processing, deferred, completed");
        }

        // Lấy staff từ context đăng nhập và luôn set staff cho donation_register
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        Staff staff = staffRepository.findByAccountEmail(email);
        if (staff != null) {
            register.setStaff(staff);
        }

        register.setDonationStatus(donationStatus);
        // Nếu gặp sự cố, lưu mô tả vào staff notes
        if ("deferred".equals(donationStatus) && incidentDescription != null && !incidentDescription.trim().isEmpty()) {
            String existingNotes = register.getStaffNotes() != null ? register.getStaffNotes() : "";
            String incidentNote = "Sự cố: " + incidentDescription.trim();
            register.setStaffNotes(existingNotes.isEmpty() ? incidentNote : existingNotes + "\n" + incidentNote);
        }
        register.setUpdatedAt(LocalDateTime.now());
        DonationRegister updatedRegister = donationRegisterRepository.save(register);

        // Nếu status là "completed", tạo bản ghi blood_check (KHÔNG set staff_id)
        if ("completed".equals(donationStatus)) {
            System.out.println("DEBUG: Creating blood_check record for registerId=" + registerId);
            BloodCheck bloodCheck = new BloodCheck();
            bloodCheck.setRegister(updatedRegister);
            bloodCheck.setDonor(updatedRegister.getDonor());
            bloodCheck.setStaff(null); // KHÔNG set staff_id
            bloodCheck.setStatus("pending");
            bloodCheck.setNotes(null);
            try {
                System.out.println("DEBUG: About to save blood_check record");
                BloodCheck savedBloodCheck = bloodCheckRepository.save(bloodCheck);
                System.out.println("DEBUG: Saved blood_check with ID: " + savedBloodCheck.getBloodCheckId());
            } catch (Exception e) {
                System.out.println("DEBUG: Error saving blood_check: " + e.getMessage());
                System.out.println("DEBUG: Skipping blood_check creation due to database constraint");
            }
        } else {
            System.out.println("DEBUG: Not creating blood_check - donationStatus=" + donationStatus);
        }
        return convertToDTO(updatedRegister);
    }

    /**
     * Lấy staff ID từ account ID
     */
    public Integer getStaffIdFromAccountId(Integer accountId) {
        if (accountId == null) {
            throw new IllegalArgumentException("Account ID is required");
        }
        
        List<Staff> staffList = staffRepository.findByAccountAccountId(accountId);
        if (staffList.isEmpty()) {
            throw new EntityNotFoundException("Staff not found for account ID: " + accountId);
        }
        
        return staffList.get(0).getStaffId();
    }

    // EXISTING METHODS - Các phương thức hiện tại

    public DonationRegisterDTO createDonationRegister(DonationRegisterDTO dto) {
        // Validate donor
        Donor donor = donorRepository.findById(dto.getDonorId())
            .orElseThrow(() -> new EntityNotFoundException("Donor not found with id: " + dto.getDonorId()));

        // Validate event if provided
        Event event = null;
        if (dto.getEventId() != null) {
            event = eventRepository.findById(dto.getEventId())
                .orElseThrow(() -> new EntityNotFoundException("Event not found with id: " + dto.getEventId()));
        }

        // Validate staff if provided
        Staff staff = null;
        if (dto.getStaffId() != null) {
            staff = staffRepository.findById(dto.getStaffId())
                .orElseThrow(() -> new EntityNotFoundException("Staff not found with id: " + dto.getStaffId()));
        }

        // Validate pre-donation survey if provided
        PreDonationSurvey preDonationSurvey = null;
        if (dto.getPreDonationSurvey() != null && dto.getPreDonationSurvey().getSurveyId() != null) {
            preDonationSurvey = surveyRepository.findById(dto.getPreDonationSurvey().getSurveyId())
                .orElseThrow(() -> new EntityNotFoundException("Pre-donation survey not found with id: " + dto.getPreDonationSurvey().getSurveyId()));
        }

        // Validate timeId if provided
        TimeEvent timeEvent = null;
        if (dto.getTimeId() != null) {
            timeEvent = timeEventRepository.findById(dto.getTimeId())
                .orElseThrow(() -> new EntityNotFoundException("Time event not found with id: " + dto.getTimeId()));
        }

        // Create new register
        DonationRegister register = new DonationRegister();
        register.setDonor(donor);
        register.setEvent(event);
        register.setStaff(staff);
        register.setPreDonationSurvey(preDonationSurvey);
        register.setAppointmentDate(dto.getAppointmentDate());
        register.setHealthCheckResult(dto.getHealthCheckResult());
        register.setQuantityMl(dto.getQuantity());
        register.setWeightKg(dto.getWeightKg()); // Thêm trường weightKg
        register.setDonationStatus(dto.getDonationStatus() != null ? dto.getDonationStatus() : "registered");
        register.setStatus(dto.getStatus() != null ? dto.getStatus() : "pending");
        register.setStaffNotes(dto.getStaffNotes());
        register.setTimeEvent(timeEvent); // Set timeEvent

        DonationRegister savedRegister = donationRegisterRepository.save(register);
        return convertToDTO(savedRegister);
    }

    public DonationRegisterDTO updateDonationRegister(Integer id, DonationRegisterDTO dto) {
        DonationRegister existingRegister = donationRegisterRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Donation register not found with id: " + id));

        // Update donor if provided
        if (dto.getDonorId() != null) {
            Donor donor = donorRepository.findById(dto.getDonorId())
                .orElseThrow(() -> new EntityNotFoundException("Donor not found with id: " + dto.getDonorId()));
            existingRegister.setDonor(donor);
        }

        // Update event if provided
        if (dto.getEventId() != null) {
            Event event = eventRepository.findById(dto.getEventId())
                .orElseThrow(() -> new EntityNotFoundException("Event not found with id: " + dto.getEventId()));
            existingRegister.setEvent(event);
        }

        // Update timeEvent if provided
        if (dto.getTimeId() != null) {
            TimeEvent timeEvent = timeEventRepository.findById(dto.getTimeId())
                .orElseThrow(() -> new EntityNotFoundException("Time event not found with id: " + dto.getTimeId()));
            existingRegister.setTimeEvent(timeEvent);
        }

        // Update staff if provided
        if (dto.getStaffId() != null) {
            Staff staff = staffRepository.findById(dto.getStaffId())
                .orElseThrow(() -> new EntityNotFoundException("Staff not found with id: " + dto.getStaffId()));
            existingRegister.setStaff(staff);
        }

        // Update other fields
        if (dto.getAppointmentDate() != null) {
            existingRegister.setAppointmentDate(dto.getAppointmentDate());
        }
        if (dto.getHealthCheckResult() != null) {
            existingRegister.setHealthCheckResult(dto.getHealthCheckResult());
        }
        if (dto.getQuantity() != null) {
            existingRegister.setQuantityMl(dto.getQuantity());
        }
        if (dto.getWeightKg() != null) {
            existingRegister.setWeightKg(dto.getWeightKg());
        }
        if (dto.getDonationStatus() != null) {
            existingRegister.setDonationStatus(dto.getDonationStatus());
        }
        if (dto.getStatus() != null) {
            existingRegister.setStatus(dto.getStatus());
        }
        if (dto.getStaffNotes() != null) {
            existingRegister.setStaffNotes(dto.getStaffNotes());
        }

        existingRegister.setUpdatedAt(LocalDateTime.now());
        
        DonationRegister updatedRegister = donationRegisterRepository.save(existingRegister);
        return convertToDTO(updatedRegister);
    }

    @Transactional
    public void deleteDonationRegister(Integer id) {
        DonationRegister register = donationRegisterRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Donation register not found with id: " + id));
        if (register.getPreDonationSurvey() != null) {
            Integer surveyId = register.getPreDonationSurvey().getSurveyId();
            preDonationSurveyService.deleteSurveyById(surveyId);
        }
        donationRegisterRepository.deleteById(id);
    }

    public DonationRegisterDTO getDonationRegister(Integer id) {
        DonationRegister register = donationRegisterRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Donation register not found with id: " + id));
        DonationRegisterDTO dto = convertToDTO(register);
        // KHÔNG gọi lại preDonationSurveyService.getLatestSurvey nữa
        return dto;
    }

    public List<DonationRegisterDTO> getAllDonationRegisters() {
        return donationRegisterRepository.findAll().stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }

    public List<DonationRegisterDTO> getDonationRegistersByDonor(Integer donorId) {
        return donationRegisterRepository.findByDonorDonorId(donorId).stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }

    public List<DonationRegisterDTO> getDonationRegistersByEvent(Integer eventId) {
        return donationRegisterRepository.findByEventEventId(eventId).stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }

    public List<DonationRegisterDTO> getDonationRegistersByStaff(Integer staffId) {
        return donationRegisterRepository.findByStaffStaffId(staffId).stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }

    public DonationRegisterDTO getDonationRegisterFullInfo(Integer id) {
        DonationRegister register = donationRegisterRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Donation register not found with id: " + id));
        DonationRegisterDTO dto = convertToDTO(register);
        // Bổ sung thông tin donor
        Donor donor = register.getDonor();
        if (donor != null) {
            dto.setDonorName(donor.getFullName());
            dto.setBloodGroup(donor.getBloodGroup() != null ? donor.getBloodGroup().getAboType() + donor.getBloodGroup().getRhFactor() : null);
            dto.setPhone(donor.getPhone());
            dto.setEmail(donor.getEmail());
            dto.setAddress(donor.getAddress());
        }
        // Bổ sung thông tin event nếu có
        if (register.getEvent() != null) {
            dto.setEventName(register.getEvent().getEventName());
            dto.setEventLocation(null);
        }
        // KHÔNG gọi lại preDonationSurveyService.getLatestSurvey nữa
        return dto;
    }

    private DonationRegisterDTO convertToDTO(DonationRegister register) {
        DonationRegisterDTO dto = modelMapper.map(register, DonationRegisterDTO.class);
        dto.setDonorId(register.getDonor().getDonorId());
        dto.setEventId(register.getEvent() != null ? register.getEvent().getEventId() : null);
        dto.setTimeId(register.getTimeEvent() != null ? register.getTimeEvent().getTimeEventId() : null);
        dto.setStaffId(register.getStaff() != null ? register.getStaff().getStaffId() : null);
        dto.setQuantity(register.getQuantityMl());
        dto.setQuantityMl(register.getQuantityMl()); // Map quantityMl cho frontend
        dto.setWeightKg(register.getWeightKg()); // Map weightKg cho frontend
        dto.setStaffNotes(register.getStaffNotes());
        // Set bloodGroup cho DTO
        if (register.getDonor() != null && register.getDonor().getBloodGroup() != null) {
            String abo = register.getDonor().getBloodGroup().getAboType();
            String rh = register.getDonor().getBloodGroup().getRhFactor();
            String bloodGroup = abo + ("positive".equals(rh) ? "+" : "negative".equals(rh) ? "-" : "");
            dto.setBloodGroup(bloodGroup);
        } else {
            dto.setBloodGroup("-");
        }
        // Set timeSlot với thông tin thời gian từ timeEvent trực tiếp
        if (register.getTimeEvent() != null) {
            String formattedDate = register.getAppointmentDate().format(java.time.format.DateTimeFormatter.ofPattern("dd/MM/yyyy"));
            String startTime = register.getTimeEvent().getStartTime().format(java.time.format.DateTimeFormatter.ofPattern("HH:mm"));
            String endTime = register.getTimeEvent().getEndTime().format(java.time.format.DateTimeFormatter.ofPattern("HH:mm"));
            dto.setTimeSlot(formattedDate + ", " + startTime + " - " + endTime);
        } else if (register.getAppointmentDate() != null) {
            dto.setTimeSlot(register.getAppointmentDate().format(java.time.format.DateTimeFormatter.ofPattern("dd/MM/yyyy")));
        } else {
            dto.setTimeSlot("");
        }
        // Map PreDonationSurvey thủ công, kiểm tra null
        if (register.getPreDonationSurvey() != null) {
            PreDonationSurvey survey = register.getPreDonationSurvey();
            PreDonationSurveyDTO surveyDTO = new PreDonationSurveyDTO();
            surveyDTO.setSurveyId(survey.getSurveyId());
            surveyDTO.setDonorId(survey.getDonor().getDonorId());
            surveyDTO.setHasFluFeverCough(survey.getHasFluFeverCough());
            surveyDTO.setHasSoreThroat(survey.getHasSoreThroat());
            surveyDTO.setHasDiarrheaDigestiveIssues(survey.getHasDiarrheaDigestiveIssues());
            surveyDTO.setHasHeadacheDizzinessFatigue(survey.getHasHeadacheDizzinessFatigue());
            surveyDTO.setHasAllergicReactions(survey.getHasAllergicReactions());
            surveyDTO.setHasInfectionOpenWounds(survey.getHasInfectionOpenWounds());
            surveyDTO.setUsesAntibioticsMedication(survey.getUsesAntibioticsMedication());
            surveyDTO.setHasInfectiousDiseaseHistory(survey.getHasInfectiousDiseaseHistory());
            surveyDTO.setHasHypertensionHeartDisease(survey.getHasHypertensionHeartDisease());
            surveyDTO.setHasDiabetesChronicDiseases(survey.getHasDiabetesChronicDiseases());
            surveyDTO.setAdditionalNotes(survey.getAdditionalNotes());
            surveyDTO.setCreatedAt(survey.getCreatedAt());
            surveyDTO.setUpdatedAt(survey.getUpdatedAt());
            dto.setPreDonationSurvey(surveyDTO);
        }
        return dto;
    }
} 