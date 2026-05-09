package com.caplatform.domain.client.entity;

import com.caplatform.domain.shared.Entity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

/**
 * Client entity - Part of Client bounded context
 */
@Entity
@Table(name = "clients")
@Getter
@Setter
public class Client extends Entity {
    
    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private ClientLegalType legalType;

    @Column(nullable = false)
    private String officeId;

    @Column
    private String groupId;

    @Column(nullable = false)
    private boolean isActive = true;

    protected Client() {
        super();
    }

    public Client(String name, ClientLegalType legalType, String officeId) {
        super();
        this.name = name;
        this.legalType = legalType;
        this.officeId = officeId;
        this.isActive = true;
    }

    public void assignToGroup(String groupId) {
        this.groupId = groupId;
    }

    public void removeFromGroup() {
        this.groupId = null;
    }

    public enum ClientLegalType {
        INDIVIDUAL,
        PARTNERSHIP,
        COMPANY,
        LLP
    }
}
