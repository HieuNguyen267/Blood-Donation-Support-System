package com.blooddonation.backend.controller;

import com.blooddonation.backend.entity.Donor;
import com.blooddonation.backend.service.DonorService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/donors")
public class DonorController {
    private final DonorService donorService;

    public DonorController(DonorService donorService) {
        this.donorService = donorService;
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
} 