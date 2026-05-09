package com.caplatform.application.service.dto;

import com.caplatform.domain.service.entity.ServiceMaster;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTOs for Service operations
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateServiceRequest {
    private String name;
    private String category;
    private ServiceMaster.ServiceFrequency frequency;
    private String departmentId;
    private String dueDateRule;
    private String checklistTemplate;
}

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ServiceResponse {
    private String id;
    private String name;
    private String category;
    private String frequency;
    private String departmentId;
    private String dueDateRule;
}

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SubscribeClientToServiceRequest {
    private String clientId;
    private String serviceId;
    private String notes;
}
