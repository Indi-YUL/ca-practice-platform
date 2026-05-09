package com.caplatform.ui.controller;

import com.caplatform.application.work.dto.*;
import com.caplatform.application.work.service.WorkApplicationService;
import com.caplatform.domain.work.entity.Assignment;
import com.caplatform.domain.work.entity.Task;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Assignment/Work REST Controller - Work bounded context
 */
@RestController
@RequestMapping("/api/assignments")
@RequiredArgsConstructor
public class AssignmentController {
    
    private final WorkApplicationService workApplicationService;

    @PostMapping
    @PreAuthorize("hasRole('PARTNER') or hasRole('MANAGER')")
    public ResponseEntity<AssignmentResponse> createAssignment(@RequestBody CreateAssignmentRequest request) {
        Assignment assignment = workApplicationService.createAssignment(
                request.getClientId(),
                request.getServiceId(),
                request.getAssignedToUserId(),
                request.getDueDate()
        );
        
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(mapToResponse(assignment));
    }

    @GetMapping("/{id}")
    public ResponseEntity<AssignmentResponse> getAssignment(@PathVariable String id) {
        return workApplicationService.findAssignment(id)
                .map(assignment -> ResponseEntity.ok(mapToResponse(assignment)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<AssignmentResponse>> getAssignments(
            @RequestParam(required = false) String assigneeId,
            @RequestParam(required = false) String clientId) {
        
        List<Assignment> assignments;
        if (assigneeId != null) {
            assignments = workApplicationService.findByAssignee(assigneeId);
        } else if (clientId != null) {
            assignments = workApplicationService.findByClient(clientId);
        } else {
            assignments = List.of();
        }
        
        List<AssignmentResponse> responses = assignments.stream()
                .map(this::mapToResponse)
                .toList();
        
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/overdue")
    public ResponseEntity<List<AssignmentResponse>> getOverdueAssignments() {
        List<Assignment> assignments = workApplicationService.findOverdue();
        List<AssignmentResponse> responses = assignments.stream()
                .map(this::mapToResponse)
                .toList();
        
        return ResponseEntity.ok(responses);
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('MANAGER') or hasRole('PARTNER')")
    public ResponseEntity<AssignmentResponse> updateAssignmentStatus(
            @PathVariable String id,
            @RequestBody UpdateAssignmentStatusRequest request) {
        
        workApplicationService.updateAssignmentStatus(id, request.getNewStatus());
        
        return workApplicationService.findAssignment(id)
                .map(assignment -> ResponseEntity.ok(mapToResponse(assignment)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/tasks")
    public ResponseEntity<TaskResponse> createTask(
            @PathVariable String id,
            @RequestBody CreateTaskRequest request) {
        
        Task task = workApplicationService.createTask(
                id,
                request.getTitle(),
                request.getOrderIndex()
        );
        
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(mapTaskToResponse(task));
    }

    @GetMapping("/{id}/tasks")
    public ResponseEntity<List<TaskResponse>> getAssignmentTasks(@PathVariable String id) {
        List<Task> tasks = workApplicationService.findTasksByAssignment(id);
        List<TaskResponse> responses = tasks.stream()
                .map(this::mapTaskToResponse)
                .toList();
        
        return ResponseEntity.ok(responses);
    }

    @PatchMapping("/tasks/{taskId}/complete")
    public ResponseEntity<TaskResponse> completeTask(@PathVariable String taskId) {
        workApplicationService.markTaskAsCompleted(taskId);
        
        return workApplicationService.findTask(taskId)
                .map(task -> ResponseEntity.ok(mapTaskToResponse(task)))
                .orElse(ResponseEntity.notFound().build());
    }

    private AssignmentResponse mapToResponse(Assignment assignment) {
        return new AssignmentResponse(
                assignment.getId(),
                assignment.getClientId(),
                assignment.getServiceId(),
                assignment.getAssignedToUserId(),
                assignment.getStatus().toString(),
                assignment.getDueDate(),
                assignment.isOverdue()
        );
    }

    private TaskResponse mapTaskToResponse(Task task) {
        return new TaskResponse(
                task.getId(),
                task.getAssignmentId(),
                task.getTitle(),
                task.getStatus().toString(),
                task.getOrderIndex()
        );
    }
}
