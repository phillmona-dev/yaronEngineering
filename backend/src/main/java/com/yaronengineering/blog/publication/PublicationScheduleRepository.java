package com.yaronengineering.blog.publication;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface PublicationScheduleRepository extends JpaRepository<PublicationSchedule, UUID> {
    List<PublicationSchedule> findByArticleIdAndStatus(UUID articleId, PublicationSchedule.Status status);
}
