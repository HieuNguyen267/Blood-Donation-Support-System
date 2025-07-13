package com.blooddonation.backend.service.common.impl;

import com.blooddonation.backend.dto.common.TimeEventDTO;
import com.blooddonation.backend.entity.common.TimeEvent;
import com.blooddonation.backend.repository.common.TimeEventRepository;
import com.blooddonation.backend.service.common.TimeEventService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TimeEventServiceImpl implements TimeEventService {

    @Autowired
    private TimeEventRepository timeEventRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public List<TimeEventDTO> getAllTimeEvents() {
        return timeEventRepository.findAll().stream()
                .map(timeEvent -> modelMapper.map(timeEvent, TimeEventDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public Optional<TimeEventDTO> getTimeEventById(Integer id) {
        return timeEventRepository.findById(id)
                .map(timeEvent -> modelMapper.map(timeEvent, TimeEventDTO.class));
    }
} 