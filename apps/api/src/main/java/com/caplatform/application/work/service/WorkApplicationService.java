package com.caplatform.application.work.service;

import com.caplatform.domain.work.entity.Assignment;
import com.caplatform.domain.work.entity.Task;
import com.caplatform.domain.work.repository.AssignmentRepository;
import com.caplatform.domain.work.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * Work Application Service
 * Implements use cases for assignment and task management
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class WorkApplicationService {
    
    private final AssignmentRepository assignmentRepository;
    private final TaskRepository taskRepository;

    public Assignment createAssignment(String clientId, String serviceId, 
                                      String assignedToUserId, LocalDate dueDate) {
        Assignment assignment = new Assignment(clientId, serviceId, assignedToUserId, dueDate);
        Assignment savedAssignment = assignmentRepository.save(assignment);
        log.info("Assignment created with ID: {} for client: {}", savedAssignment.getId(), clientId);
        return savedAssignment;
    }

    public Optional<Assignment> findAssignment(String id) {
        return assignmentRepository.findById(id);
    }

    public List<Assignment> findByAssignee(String userId) {
        return assignmentRepository.findByAssignedToUserId(userId);
    }

    public List<Assignment> findByReviewer(String userId) {
        return assignmentRepository.findByReviewerUserId(userId);
    }

    public List<Assignment> findByClient(String clientId) {
        return assignmentRepository.findByClientId(clientId);
    }

    public List<Assignment> findOverdue() {
        return assignmentRepository.findOverdueAssignments(LocalDate.now());
    }

    public void updateAssignmentStatus(String assignmentId, Assignment.AssignmentStatus newStatus) {
        assignmentRepository.findById(assignmentId).ifPresent(assignment -> {
            assignment.transitionTo(newStatus);
            assignmentRepository.save(assignment);
            log.info("Assignment {} status updated to {}", assignmentId, newStatus);
        });
    }

    public Task createTask(String assignmentId, String title, Integer orderIndex) {
        Task task = new Task(assignmentId, title, orderIndex);
        Task savedTask = taskRepository.save(task);
        log.info("Task created with ID: {} for assignment: {}", savedTask.getId(), assignmentId);
        return savedTask;
    }

    public Optional<Task> findTask(String id) {
        return taskRepository.findById(id);
    }

    public List<Task> findTasksByAssignment(String assignmentId) {
        return taskRepository.findByAssignmentId(assignmentId);
    }

    public void markTaskAsCompleted(String taskId) {
        taskRepository.findById(taskId).ifPresent(task -> {
            task.markAsCompleted();
            taskRepository.save(task);
            log.info("Task {} marked as completed", taskId);
        });
    }
}
