package com.caplatform.domain.service.repository;

import com.caplatform.domain.service.entity.ClientService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * ClientService Repository Interface
 */
@Repository
public interface ClientServiceRepository extends JpaRepository<ClientService, String> {
    List<ClientService> findByClientId(String clientId);
    
    List<ClientService> findByServiceId(String serviceId);
    
    Optional<ClientService> findByClientIdAndServiceId(String clientId, String serviceId);
}
