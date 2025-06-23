package com.blooddonation.backend.service;

import com.blooddonation.backend.dto.EventDTO;
import com.blooddonation.backend.entity.Event;
import com.blooddonation.backend.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class EventService {
    private final EventRepository eventRepository;
    private final ModelMapper modelMapper;

    public EventService(EventRepository eventRepository, ModelMapper modelMapper) {
        this.eventRepository = eventRepository;
        this.modelMapper = modelMapper;
    }

    public List<EventDTO> getAllEvents() {
        return eventRepository.findAll().stream()
                .map(event -> modelMapper.map(event, EventDTO.class))
                .collect(Collectors.toList());
    }

    public Optional<EventDTO> getEventById(Integer id) {
        return eventRepository.findById(id)
                .map(event -> modelMapper.map(event, EventDTO.class));
    }

    @Transactional
    public EventDTO createEvent(EventDTO eventDTO) {
        Event event = modelMapper.map(eventDTO, Event.class);
        event.setCreatedAt(LocalDateTime.now());
        event.setUpdatedAt(LocalDateTime.now());
        event.setRegisteredDonors(0);
        event.setActualDonors(0);
        event.setCollectedBloodUnits(0);
        event.setStatus("planned");
        
        Event savedEvent = eventRepository.save(event);
        return modelMapper.map(savedEvent, EventDTO.class);
    }

    @Transactional
    public Optional<EventDTO> updateEvent(Integer id, EventDTO eventDTO) {
        return eventRepository.findById(id)
                .map(existingEvent -> {
                    modelMapper.map(eventDTO, existingEvent);
                    existingEvent.setUpdatedAt(LocalDateTime.now());
                    return modelMapper.map(eventRepository.save(existingEvent), EventDTO.class);
                });
    }

    @Transactional
    public void deleteEvent(Integer id) {
        eventRepository.deleteById(id);
    }

    public List<EventDTO> getUpcomingEvents() {
        return eventRepository.findByStartDateAfter(LocalDateTime.now().toLocalDate())
                .stream()
                .map(event -> modelMapper.map(event, EventDTO.class))
                .collect(Collectors.toList());
    }

    public List<EventDTO> getActiveEvents() {
        return eventRepository.findByStatus("active")
                .stream()
                .map(event -> modelMapper.map(event, EventDTO.class))
                .collect(Collectors.toList());
    }

    @Transactional
    public Optional<EventDTO> updateEventStatus(Integer id, String status) {
        return eventRepository.findById(id)
                .map(event -> {
                    event.setStatus(status);
                    event.setUpdatedAt(LocalDateTime.now());
                    return modelMapper.map(eventRepository.save(event), EventDTO.class);
                });
    }
} 