package com.blooddonation.backend.controller.admin;

import com.blooddonation.backend.dto.common.MatchingBloodDTO;
import com.blooddonation.backend.entity.common.MatchingBlood;
import com.blooddonation.backend.repository.common.MatchingBloodRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/admin/matching")
@CrossOrigin(origins = "*")
public class MatchingBloodController {
    @Autowired
    private MatchingBloodRepository matchingBloodRepository;

    @GetMapping
    public List<MatchingBloodDTO> getAllMatchings() {
        List<MatchingBlood> matchings = matchingBloodRepository.findAll();
        return matchings.stream().map(MatchingBloodDTO::fromEntity).collect(Collectors.toList());
    }

    @PostMapping
    public MatchingBloodDTO createMatching(@RequestBody MatchingBloodDTO dto) {
        MatchingBlood entity = dto.toEntity();
        MatchingBlood saved = matchingBloodRepository.save(entity);
        return MatchingBloodDTO.fromEntity(saved);
    }
} 