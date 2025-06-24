package com.blooddonation.backend.service;

import com.blooddonation.backend.dto.StaffDTO;
import com.blooddonation.backend.entity.Staff;
import com.blooddonation.backend.repository.StaffRepository;
import com.blooddonation.backend.repository.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class StaffService {

    @Autowired
    private StaffRepository staffRepository;

    @Autowired
    private AccountRepository accountRepository;

    public List<StaffDTO> getAllStaff() {
        return staffRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Optional<StaffDTO> getStaffById(Integer id) {
        return staffRepository.findById(id)
                .map(this::convertToDTO);
    }

    public List<StaffDTO> getStaffByAccountId(Integer accountId) {
        return staffRepository.findByAccountAccountId(accountId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public StaffDTO createStaff(StaffDTO staffDTO) {
        Staff staff = convertToEntity(staffDTO);
        staff.setCreatedAt(LocalDateTime.now());
        staff.setUpdatedAt(LocalDateTime.now());
        
        Staff savedStaff = staffRepository.save(staff);
        return convertToDTO(savedStaff);
    }

    public StaffDTO updateStaff(Integer id, StaffDTO staffDTO) {
        Optional<Staff> existingStaff = staffRepository.findById(id);
        if (existingStaff.isPresent()) {
            Staff staff = existingStaff.get();
            updateEntityFromDTO(staff, staffDTO);
            staff.setUpdatedAt(LocalDateTime.now());
            
            Staff savedStaff = staffRepository.save(staff);
            return convertToDTO(savedStaff);
        }
        return null;
    }

    public boolean deleteStaff(Integer id) {
        if (staffRepository.existsById(id)) {
            staffRepository.deleteById(id);
            return true;
        }
        return false;
    }

    private StaffDTO convertToDTO(Staff staff) {
        StaffDTO dto = new StaffDTO();
        dto.setStaffId(staff.getStaffId());
        if (staff.getAccount() != null) {
            dto.setAccountId(staff.getAccount().getAccountId());
        }
        dto.setFullName(staff.getFullName());
        dto.setDateOfBirth(staff.getDateOfBirth());
        dto.setGender(staff.getGender());
        dto.setAddress(staff.getAddress());
        dto.setPhone(staff.getPhone());
        dto.setEmail(staff.getEmail());
        dto.setCreatedAt(staff.getCreatedAt());
        dto.setUpdatedAt(staff.getUpdatedAt());
        return dto;
    }

    private Staff convertToEntity(StaffDTO dto) {
        Staff staff = new Staff();
        updateEntityFromDTO(staff, dto);
        return staff;
    }

    private void updateEntityFromDTO(Staff staff, StaffDTO dto) {
        if (dto.getAccountId() != null) {
            accountRepository.findById(dto.getAccountId())
                    .ifPresent(staff::setAccount);
        }
        if (dto.getFullName() != null) {
            staff.setFullName(dto.getFullName());
        }
        if (dto.getDateOfBirth() != null) {
            staff.setDateOfBirth(dto.getDateOfBirth());
        }
        if (dto.getGender() != null) {
            staff.setGender(dto.getGender());
        }
        if (dto.getAddress() != null) {
            staff.setAddress(dto.getAddress());
        }
        if (dto.getPhone() != null) {
            staff.setPhone(dto.getPhone());
        }
        if (dto.getEmail() != null) {
            staff.setEmail(dto.getEmail());
        }
    }
} 