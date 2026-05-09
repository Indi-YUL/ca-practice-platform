package com.caplatform.application.service.service;

import com.caplatform.domain.service.entity.ServiceMaster;
import com.caplatform.domain.service.entity.ClientService;
import com.caplatform.domain.service.repository.ServiceMasterRepository;
import com.caplatform.domain.service.repository.ClientServiceRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Service Application Service
 * Implements use cases for service management
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class ServiceApplicationService {
    
    private final ServiceMasterRepository serviceMasterRepository;
    private final ClientServiceRepository clientServiceRepository;

    public ServiceMaster createService(String name, String category, 
                                       ServiceMaster.ServiceFrequency frequency,
                                       String departmentId, String dueDateRule) {
        ServiceMaster service = new ServiceMaster(name, category, frequency, departmentId, dueDateRule);
        ServiceMaster savedService = serviceMasterRepository.save(service);
        log.info("Service created: {} with ID: {}", name, savedService.getId());
        return savedService;
    }

    public Optional<ServiceMaster> findService(String id) {
        return serviceMasterRepository.findById(id);
    }

    public List<ServiceMaster> findAllActive() {
        return serviceMasterRepository.findByIsActiveTrue();
    }

    public List<ServiceMaster> findByCategory(String category) {
        return serviceMasterRepository.findByCategory(category);
    }

    public List<ServiceMaster> findByDepartment(String departmentId) {
        return serviceMasterRepository.findByDepartmentId(departmentId);
    }

    public ClientService subscribeClientToService(String clientId, String serviceId) {
        Optional<ClientService> existing = clientServiceRepository.findByClientIdAndServiceId(clientId, serviceId);
        if (existing.isPresent()) {
            return existing.get();
        }
        
        ClientService subscription = new ClientService(clientId, serviceId);
        ClientService saved = clientServiceRepository.save(subscription);
        log.info("Client {} subscribed to service {}", clientId, serviceId);
        return saved;
    }

    public List<ClientService> findClientServices(String clientId) {
        return clientServiceRepository.findByClientId(clientId);
    }

    public void unsubscribeClientFromService(String clientServiceId) {
        clientServiceRepository.deleteById(clientServiceId);
        log.info("Client unsubscribed from service: {}", clientServiceId);
    }
}
