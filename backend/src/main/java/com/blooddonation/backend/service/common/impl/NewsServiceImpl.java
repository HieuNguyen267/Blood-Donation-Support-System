package com.blooddonation.backend.service.common.impl;

import com.blooddonation.backend.dto.common.NewsDTO;
import com.blooddonation.backend.entity.common.News;
import com.blooddonation.backend.repository.common.NewsRepository;
import com.blooddonation.backend.service.common.NewsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class NewsServiceImpl implements NewsService {
    @Autowired
    private NewsRepository newsRepository;

    @Override
    public List<NewsDTO> getAllNews() {
        List<News> newsList = newsRepository.findAll();
        return newsList.stream().map(this::toDto).collect(Collectors.toList());
    }

    @Override
    public NewsDTO createNews(NewsDTO newsDTO) {
        News news = new News();
        news.setTitle(newsDTO.getTitle());
        news.setBrief(newsDTO.getBrief());
        news.setContent(newsDTO.getContent());
        news.setImageUrl(newsDTO.getImageUrl());
        news.setAuthorName(newsDTO.getAuthorName());
        news.setStaffId(newsDTO.getStaffId());
        news.setStatus(newsDTO.getStatus());
        news.setCreatedAt(java.time.LocalDateTime.now());
        news.setUpdatedAt(java.time.LocalDateTime.now());
        News saved = newsRepository.save(news);
        return toDto(saved);
    }

    @Override
    public NewsDTO updateNews(Integer id, NewsDTO newsDTO) {
        News news = newsRepository.findById(id).orElseThrow();
        news.setTitle(newsDTO.getTitle());
        news.setBrief(newsDTO.getBrief());
        news.setContent(newsDTO.getContent());
        news.setImageUrl(newsDTO.getImageUrl());
        news.setAuthorName(newsDTO.getAuthorName());
        news.setStaffId(newsDTO.getStaffId());
        news.setStatus(newsDTO.getStatus());
        news.setUpdatedAt(java.time.LocalDateTime.now());
        News saved = newsRepository.save(news);
        return toDto(saved);
    }

    private NewsDTO toDto(News news) {
        NewsDTO dto = new NewsDTO();
        dto.setNewsId(news.getNewsId());
        dto.setTitle(news.getTitle());
        dto.setBrief(news.getBrief());
        dto.setContent(news.getContent());
        dto.setImageUrl(news.getImageUrl());
        dto.setCreatedAt(news.getCreatedAt());
        dto.setUpdatedAt(news.getUpdatedAt());
        dto.setAuthorName(news.getAuthorName());
        dto.setStaffId(news.getStaffId());
        dto.setStatus(news.getStatus());
        return dto;
    }
} 