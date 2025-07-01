package com.blooddonation.backend.service.admin;

import com.blooddonation.backend.dto.admin.DonationRegisterDTO;
import com.blooddonation.backend.entity.admin.DonationRegister;
import com.blooddonation.backend.entity.donor.Donor;
import com.blooddonation.backend.entity.common.Event;
import com.blooddonation.backend.entity.admin.Staff;
import com.blooddonation.backend.repository.admin.DonationRegisterRepository;
import com.blooddonation.backend.repository.donor.DonorRepository;
import com.blooddonation.backend.repository.common.EventRepository;
import com.blooddonation.backend.repository.admin.StaffRepository;
import jakarta.persistence.EntityNotFoundException;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

        // Create new register
        DonationRegister register = new DonationRegister();
        register.setDonor(donor);
        register.setEvent(event);
        register.setStaff(staff);
        register.setAppointmentDate(dto.getAppointmentDate());
        register.setPreDonationSurvey(dto.getPreDonationSurvey());
        register.setHealthCheckResult(dto.getHealthCheckResult());
        register.setQuantity(dto.getQuantity());
        register.setDonationStatus(dto.getDonationStatus() != null ? dto.getDonationStatus() : "registered");
        register.setStatus(dto.getStatus() != null ? dto.getStatus() : "scheduled");
        register.setStaffNotes(dto.getStaffNotes());
        register.setCreatedAt(LocalDateTime.now());
        register.setUpdatedAt(LocalDateTime.now());

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
        if (dto.getPreDonationSurvey() != null) {
            existingRegister.setPreDonationSurvey(dto.getPreDonationSurvey());
        }
        if (dto.getHealthCheckResult() != null) {
            existingRegister.setHealthCheckResult(dto.getHealthCheckResult());
        }
        if (dto.getQuantity() != null) {
            existingRegister.setQuantity(dto.getQuantity());
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

    public void deleteDonationRegister(Integer id) {
        if (!donationRegisterRepository.existsById(id)) {
            throw new EntityNotFoundException("Donation register not found with id: " + id);
        }
        donationRegisterRepository.deleteById(id);
    }

    public DonationRegisterDTO getDonationRegister(Integer id) {
        DonationRegister register = donationRegisterRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Donation register not found with id: " + id));
        return convertToDTO(register);
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
        return dto;
    }

    private DonationRegisterDTO convertToDTO(DonationRegister register) {
        DonationRegisterDTO dto = new DonationRegisterDTO();
        dto.setRegisterId(register.getRegisterId());
        dto.setDonorId(register.getDonor().getDonorId());
        if (register.getEvent() != null) {
            dto.setEventId(register.getEvent().getEventId());
        }
        if (register.getStaff() != null) {
            dto.setStaffId(register.getStaff().getStaffId());
        }
        dto.setAppointmentDate(register.getAppointmentDate());
        dto.setPreDonationSurvey(register.getPreDonationSurvey());
        dto.setHealthCheckResult(register.getHealthCheckResult());
        dto.setQuantity(register.getQuantity());
        dto.setDonationStatus(register.getDonationStatus());
        dto.setStatus(register.getStatus());
        dto.setStaffNotes(register.getStaffNotes());
        dto.setCreatedAt(register.getCreatedAt());
        dto.setUpdatedAt(register.getUpdatedAt());

        // Bổ sung thông tin người hiến
        Donor donor = register.getDonor();
        if (donor != null) {
            dto.setDonorName(donor.getFullName());
            dto.setBloodGroup(donor.getBloodGroup() != null ? donor.getBloodGroup().getAboType() + donor.getBloodGroup().getRhFactor() : null);
            dto.setPhone(donor.getPhone());
            dto.setEmail(donor.getEmail());
            dto.setAddress(donor.getAddress());
        }
        return dto;
    }
} 