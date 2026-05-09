package com.caplatform.domain.client.repository;

import com.caplatform.domain.client.entity.ClientIdentifier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * ClientIdentifier Repository Interface
 */
@Repository
public interface ClientIdentifierRepository extends JpaRepository<ClientIdentifier, String> {
    List<ClientIdentifier> findByClientId(String clientId);
    
    Optional<ClientIdentifier> findByTypeAndValue(
        ClientIdentifier.IdentifierType type, 
        String value
    );
}
