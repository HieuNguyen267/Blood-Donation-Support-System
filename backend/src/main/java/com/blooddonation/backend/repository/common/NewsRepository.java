package com.blooddonation.backend.repository.common;

import com.blooddonation.backend.entity.common.News;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NewsRepository extends JpaRepository<News, Integer> {
} 