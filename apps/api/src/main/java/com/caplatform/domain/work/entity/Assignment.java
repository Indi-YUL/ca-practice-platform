package com.caplatform.domain.work.entity;

import com.caplatform.domain.shared.Entity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

/**
 * Assignment entity - Work item for client-service-period
 */
@Entity
@Table(name = "assignments")
@Getter
@Setter
public class Assignment extends Entity {
    
    @Column(nullable = false)
    private String clientId;

    @Column(nullable = false)
    private String serviceId;

    @Column(nullable = false)
    private String assignedToUserId;

    @Column
    private String reviewerUserId;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private AssignmentStatus status = AssignmentStatus.DRAFT;

    @Column(nullable = false)
    private LocalDate dueDate;

    @Column
    private LocalDate completedDate;

    @Column(columnDefinition = "TEXT")
    private String notes;

    protected Assignment() {
        super();
    }

    public Assignment(String clientId, String serviceId, String assignedToUserId, LocalDate dueDate) {
        super();
        this.clientId = clientId;
        this.serviceId = serviceId;
        this.assignedToUserId = assignedToUserId;
        this.dueDate = dueDate;
        this.status = AssignmentStatus.DRAFT;
    }

    public boolean isOverdue() {
        if (status == AssignmentStatus.COMPLETED || status == AssignmentStatus.CANCELLED) {
            return false;
        }
        return LocalDate.now().isAfter(dueDate);
    }

    public boolean canTransitionTo(AssignmentStatus newStatus) {
        return switch (this.status) {
            case DRAFT -> newStatus == AssignmentStatus.ASSIGNED || newStatus == AssignmentStatus.CANCELLED;
            case ASSIGNED -> newStatus == AssignmentStatus.IN_PROGRESS || newStatus == AssignmentStatus.ON_HOLD || newStatus == AssignmentStatus.CANCELLED;
            case IN_PROGRESS -> newStatus == AssignmentStatus.REVIEW || newStatus == AssignmentStatus.ON_HOLD || newStatus == AssignmentStatus.CANCELLED;
            case REVIEW -> newStatus == AssignmentStatus.COMPLETED || newStatus == AssignmentStatus.IN_PROGRESS || newStatus == AssignmentStatus.ON_HOLD;
            case COMPLETED, CANCELLED -> false;
            case ON_HOLD -> newStatus == AssignmentStatus.ASSIGNED || newStatus == AssignmentStatus.IN_PROGRESS || newStatus == AssignmentStatus.CANCELLED;
        };
    }

    public void transitionTo(AssignmentStatus newStatus) {
        if (!canTransitionTo(newStatus)) {
            throw new IllegalStateException("Cannot transition from " + status + " to " + newStatus);
        }
        this.status = newStatus;
        if (newStatus == AssignmentStatus.COMPLETED) {
            this.completedDate = LocalDate.now();
        }
    }

    public enum AssignmentStatus {
        DRAFT,
        ASSIGNED,
        IN_PROGRESS,
        REVIEW,
        COMPLETED,
        ON_HOLD,
        CANCELLED
    }
}
