package com.caplatform.domain.work.repository;

import com.caplatform.domain.work.entity.Assignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

/**
 * Assignment Repository Interface
 */
@Repository
public interface AssignmentRepository extends JpaRepository<Assignment, String> {
    List<Assignment> findByAssignedToUserId(String userId);
    
    List<Assignment> findByReviewerUserId(String userId);
    
    List<Assignment> findByClientId(String clientId);
    
    List<Assignment> findByStatus(Assignment.AssignmentStatus status);
    
    @Query("SELECT a FROM Assignment a WHERE a.status != 'COMPLETED' AND a.status != 'CANCELLED' AND a.dueDate < :today")
    List<Assignment> findOverdueAssignments(@Param("today") LocalDate today);
}
