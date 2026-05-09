package com.caplatform.domain.work.entity;

import com.caplatform.domain.shared.Entity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

/**
 * Task entity - Checklist item within an assignment
 */
@Entity
@Table(name = "tasks")
@Getter
@Setter
public class Task extends Entity {
    
    @Column(nullable = false)
    private String assignmentId;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private TaskStatus status = TaskStatus.PENDING;

    @Column(nullable = false)
    private Integer orderIndex;

    @Column
    private String assignedToUserId;

    protected Task() {
        super();
    }

    public Task(String assignmentId, String title, Integer orderIndex) {
        super();
        this.assignmentId = assignmentId;
        this.title = title;
        this.orderIndex = orderIndex;
        this.status = TaskStatus.PENDING;
    }

    public void markAsCompleted() {
        this.status = TaskStatus.COMPLETED;
    }

    public void markAsInProgress() {
        this.status = TaskStatus.IN_PROGRESS;
    }

    public void markAsBlocked() {
        this.status = TaskStatus.BLOCKED;
    }

    public enum TaskStatus {
        PENDING,
        IN_PROGRESS,
        COMPLETED,
        BLOCKED
    }
}
