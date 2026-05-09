package com.caplatform.domain.identity.entity;

import com.caplatform.domain.shared.Entity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

/**
 * Role entity - RBAC management
 */
@Entity
@Table(name = "roles")
@Getter
@Setter
public class Role extends Entity {
    
    @Column(nullable = false, unique = true)
    private String name;

    @Column
    private String description;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "role_permissions", joinColumns = @JoinColumn(name = "role_id"))
    @Column(name = "permission")
    private Set<String> permissions = new HashSet<>();

    protected Role() {
        super();
    }

    public Role(String name, String description) {
        super();
        this.name = name;
        this.description = description;
    }

    public void addPermission(String permission) {
        this.permissions.add(permission);
    }

    public void removePermission(String permission) {
        this.permissions.remove(permission);
    }

    public boolean hasPermission(String permission) {
        return this.permissions.contains(permission);
    }
}
