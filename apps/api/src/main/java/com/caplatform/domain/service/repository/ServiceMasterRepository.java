package com.caplatform.domain.service.repository;

import com.caplatform.domain.service.entity.ServiceMaster;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * ServiceMaster Repository Interface
 */
@Repository
public interface ServiceMasterRepository extends JpaRepository<ServiceMaster, String> {
    List<ServiceMaster> findByCategory(String category);
    
    List<ServiceMaster> findByDepartmentId(String departmentId);
    
    List<ServiceMaster> findByIsActiveTrue();
    
    Optional<ServiceMaster> findByName(String name);
}
