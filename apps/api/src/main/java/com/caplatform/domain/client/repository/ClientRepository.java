package com.caplatform.domain.client.repository;

import com.caplatform.domain.client.entity.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Client Repository Interface
 */
@Repository
public interface ClientRepository extends JpaRepository<Client, String> {
    Optional<Client> findByName(String name);
    
    List<Client> findByOfficeId(String officeId);
    
    List<Client> findByGroupId(String groupId);
    
    List<Client> findByIsActiveTrue();

    @Query("SELECT c FROM Client c WHERE LOWER(c.name) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Client> searchByName(@Param("query") String query);
}
