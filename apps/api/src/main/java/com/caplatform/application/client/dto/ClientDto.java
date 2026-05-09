package com.caplatform.application.client.dto;

import com.caplatform.domain.client.entity.Client;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTOs for Client operations
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateClientRequest {
    private String name;
    private Client.ClientLegalType legalType;
    private String officeId;
    private String pan;
    private String gstin;
    private String groupId;
}

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ClientResponse {
    private String id;
    private String name;
    private String legalType;
    private String officeId;
    private String groupId;
    private boolean isActive;
}

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SearchClientsRequest {
    private String query;
    private String officeId;
    private String legalType;
    private String groupId;
}
