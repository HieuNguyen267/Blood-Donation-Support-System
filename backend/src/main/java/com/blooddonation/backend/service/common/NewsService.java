package com.blooddonation.backend.service.common;

import com.blooddonation.backend.dto.common.NewsDTO;
import java.util.List;

public interface NewsService {
    List<NewsDTO> getAllNews();
    NewsDTO createNews(NewsDTO newsDTO);
    NewsDTO updateNews(Integer id, NewsDTO newsDTO);
} 