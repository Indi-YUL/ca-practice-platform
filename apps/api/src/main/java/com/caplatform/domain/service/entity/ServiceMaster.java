package com.caplatform.domain.service.entity;

import com.caplatform.domain.shared.Entity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

/**
 * ServiceMaster entity - Part of Service bounded context
 */
@Entity
@Table(name = "service_masters")
@Getter
@Setter
public class ServiceMaster extends Entity {
    
    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String category;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private ServiceFrequency frequency;

    @Column(nullable = false)
    private String departmentId;

    @Column(nullable = false)
    private String dueDateRule;

    @Column(nullable = false)
    private boolean isActive = true;

    @Column(columnDefinition = "TEXT")
    private String checklistTemplate;

    protected ServiceMaster() {
        super();
    }

    public ServiceMaster(String name, String category, ServiceFrequency frequency, 
                         String departmentId, String dueDateRule) {
        super();
        this.name = name;
        this.category = category;
        this.frequency = frequency;
        this.departmentId = departmentId;
        this.dueDateRule = dueDateRule;
        this.isActive = true;
    }

    public enum ServiceFrequency {
        MONTHLY,
        QUARTERLY,
        ANNUAL,
        ONE_TIME
    }
}
