package com.caplatform.domain.work.repository;

import com.caplatform.domain.work.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Task Repository Interface
 */
@Repository
public interface TaskRepository extends JpaRepository<Task, String> {
    List<Task> findByAssignmentId(String assignmentId);
    
    List<Task> findByAssignedToUserId(String userId);
}
