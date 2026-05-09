package com.caplatform.ui.controller;

import com.caplatform.application.service.dto.ServiceResponse;
import com.caplatform.application.service.dto.CreateServiceRequest;
import com.caplatform.application.service.dto.SubscribeClientToServiceRequest;
import com.caplatform.application.service.service.ServiceApplicationService;
import com.caplatform.domain.service.entity.ServiceMaster;
import com.caplatform.domain.service.entity.ClientService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Service REST Controller - Service bounded context
 */
@RestController
@RequestMapping("/api/services")
@RequiredArgsConstructor
public class ServiceController {
    
    private final ServiceApplicationService serviceApplicationService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ServiceResponse> createService(@RequestBody CreateServiceRequest request) {
        ServiceMaster service = serviceApplicationService.createService(
                request.getName(),
                request.getCategory(),
                request.getFrequency(),
                request.getDepartmentId(),
                request.getDueDateRule()
        );
        
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(mapToResponse(service));
    }

    @GetMapping
    public ResponseEntity<List<ServiceResponse>> getAllServices(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String departmentId) {
        
        List<ServiceMaster> services;
        if (category != null) {
            services = serviceApplicationService.findByCategory(category);
        } else if (departmentId != null) {
            services = serviceApplicationService.findByDepartment(departmentId);
        } else {
            services = serviceApplicationService.findAllActive();
        }
        
        List<ServiceResponse> responses = services.stream()
                .map(this::mapToResponse)
                .toList();
        
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ServiceResponse> getService(@PathVariable String id) {
        return serviceApplicationService.findService(id)
                .map(service -> ResponseEntity.ok(mapToResponse(service)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{serviceId}/subscribe")
    @PreAuthorize("hasRole('PARTNER') or hasRole('MANAGER')")
    public ResponseEntity<Void> subscribeClientToService(
            @PathVariable String serviceId,
            @RequestBody SubscribeClientToServiceRequest request) {
        
        serviceApplicationService.subscribeClientToService(
                request.getClientId(),
                serviceId
        );
        
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @GetMapping("/client/{clientId}")
    public ResponseEntity<List<ServiceResponse>> getClientServices(@PathVariable String clientId) {
        List<ClientService> clientServices = serviceApplicationService.findClientServices(clientId);
        
        List<ServiceResponse> responses = clientServices.stream()
                .map(cs -> serviceApplicationService.findService(cs.getServiceId()))
                .filter(java.util.Optional::isPresent)
                .map(java.util.Optional::get)
                .map(this::mapToResponse)
                .toList();
        
        return ResponseEntity.ok(responses);
    }

    private ServiceResponse mapToResponse(ServiceMaster service) {
        return new ServiceResponse(
                service.getId(),
                service.getName(),
                service.getCategory(),
                service.getFrequency().toString(),
                service.getDepartmentId(),
                service.getDueDateRule()
        );
    }
}
