package com.caplatform.domain.client.entity;

import com.caplatform.domain.shared.Entity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

/**
 * ClientIdentifier entity - Unique identifiers like PAN, GSTIN
 */
@Entity
@Table(name = "client_identifiers", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"client_id", "identifier_type", "identifier_value"})
})
@Getter
@Setter
public class ClientIdentifier extends Entity {
    
    @Column(nullable = false)
    private String clientId;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private IdentifierType type;

    @Column(nullable = false)
    private String value;

    protected ClientIdentifier() {
        super();
    }

    public ClientIdentifier(String clientId, IdentifierType type, String value) {
        super();
        this.clientId = clientId;
        this.type = type;
        this.value = value;
    }

    public enum IdentifierType {
        PAN,
        GSTIN,
        AADHAAR,
        DIN,
        CIN
    }
}
