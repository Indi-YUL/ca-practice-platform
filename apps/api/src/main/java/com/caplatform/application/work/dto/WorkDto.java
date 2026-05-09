package com.caplatform.application.work.dto;

import com.caplatform.domain.work.entity.Assignment;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/**
 * DTOs for Work/Assignment operations
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateAssignmentRequest {
    private String clientId;
    private String serviceId;
    private String assignedToUserId;
    private String reviewerUserId;
    private LocalDate dueDate;
    private String notes;
}

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AssignmentResponse {
    private String id;
    private String clientId;
    private String serviceId;
    private String assignedToUserId;
    private String status;
    private LocalDate dueDate;
    private boolean isOverdue;
}

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateAssignmentStatusRequest {
    private String assignmentId;
    private Assignment.AssignmentStatus newStatus;
    private String remarks;
}

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateTaskRequest {
    private String assignmentId;
    private String title;
    private String description;
    private Integer orderIndex;
}

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TaskResponse {
    private String id;
    private String assignmentId;
    private String title;
    private String status;
    private Integer orderIndex;
}
