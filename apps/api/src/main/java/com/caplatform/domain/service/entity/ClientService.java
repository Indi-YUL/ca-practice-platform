package com.caplatform.domain.service.entity;

import com.caplatform.domain.shared.Entity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

/**
 * ClientService entity - Represents active service subscription
 */
@Entity
@Table(name = "client_services", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"client_id", "service_id"})
})
@Getter
@Setter
public class ClientService extends Entity {
    
    @Column(nullable = false)
    private String clientId;

    @Column(nullable = false)
    private String serviceId;

    @Column(nullable = false)
    private boolean isActive = true;

    @Column(columnDefinition = "TEXT")
    private String notes;

    protected ClientService() {
        super();
    }

    public ClientService(String clientId, String serviceId) {
        super();
        this.clientId = clientId;
        this.serviceId = serviceId;
        this.isActive = true;
    }
}
