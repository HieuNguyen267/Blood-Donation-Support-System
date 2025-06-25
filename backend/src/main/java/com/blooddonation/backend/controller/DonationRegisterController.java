package com.blooddonation.backend.controller;

import com.blooddonation.backend.dto.DonationRegisterDTO;
import com.blooddonation.backend.service.DonationRegisterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/donation-registers")
public class DonationRegisterController {

    @Autowired
    private DonationRegisterService donationRegisterService;

    @PostMapping
    public ResponseEntity<DonationRegisterDTO> createDonationRegister(@RequestBody DonationRegisterDTO dto) {
        return ResponseEntity.ok(donationRegisterService.createDonationRegister(dto));
    }

    @PostMapping("/registerdonate")
    public ResponseEntity<DonationRegisterDTO> createAppointment(@RequestBody DonationRegisterDTO dto) {
        DonationRegisterDTO created = donationRegisterService.createDonationRegister(dto);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<DonationRegisterDTO> updateDonationRegister(
            @PathVariable Integer id,
            @RequestBody DonationRegisterDTO dto) {
        return ResponseEntity.ok(donationRegisterService.updateDonationRegister(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDonationRegister(@PathVariable Integer id) {
        donationRegisterService.deleteDonationRegister(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<DonationRegisterDTO> getDonationRegister(@PathVariable Integer id) {
        return ResponseEntity.ok(donationRegisterService.getDonationRegister(id));
    }

    @GetMapping
    public ResponseEntity<List<DonationRegisterDTO>> getAllDonationRegisters() {
        return ResponseEntity.ok(donationRegisterService.getAllDonationRegisters());
    }

    @GetMapping("/donor/{donorId}")
    public ResponseEntity<List<DonationRegisterDTO>> getDonationRegistersByDonor(@PathVariable Integer donorId) {
        return ResponseEntity.ok(donationRegisterService.getDonationRegistersByDonor(donorId));
    }

    @GetMapping("/event/{eventId}")
    public ResponseEntity<List<DonationRegisterDTO>> getDonationRegistersByEvent(@PathVariable Integer eventId) {
        return ResponseEntity.ok(donationRegisterService.getDonationRegistersByEvent(eventId));
    }

    @GetMapping("/staff/{staffId}")
    public ResponseEntity<List<DonationRegisterDTO>> getDonationRegistersByStaff(@PathVariable Integer staffId) {
        return ResponseEntity.ok(donationRegisterService.getDonationRegistersByStaff(staffId));
    }
} 