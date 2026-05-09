package com.caplatform.ui.controller;

import com.caplatform.application.client.dto.ClientResponse;
import com.caplatform.application.client.dto.CreateClientRequest;
import com.caplatform.application.client.dto.SearchClientsRequest;
import com.caplatform.application.client.service.ClientApplicationService;
import com.caplatform.domain.client.entity.Client;
import com.caplatform.domain.client.entity.ClientIdentifier;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Client REST Controller - Client bounded context
 */
@RestController
@RequestMapping("/api/clients")
@RequiredArgsConstructor
public class ClientController {
    
    private final ClientApplicationService clientApplicationService;

    @PostMapping
    @PreAuthorize("hasRole('PARTNER') or hasRole('MANAGER')")
    public ResponseEntity<ClientResponse> createClient(@RequestBody CreateClientRequest request) {
        Client client = clientApplicationService.createClient(
                request.getName(),
                request.getLegalType(),
                request.getOfficeId()
        );
        
        if (request.getPan() != null) {
            clientApplicationService.addIdentifier(client.getId(), 
                    ClientIdentifier.IdentifierType.PAN, request.getPan());
        }
        if (request.getGstin() != null) {
            clientApplicationService.addIdentifier(client.getId(),
                    ClientIdentifier.IdentifierType.GSTIN, request.getGstin());
        }
        
        if (request.getGroupId() != null) {
            client.assignToGroup(request.getGroupId());
            clientApplicationService.updateClient(client);
        }
        
        return ResponseEntity.status(HttpStatus.CREATED).body(mapToResponse(client));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClientResponse> getClientById(@PathVariable String id) {
        return clientApplicationService.findById(id)
                .map(client -> ResponseEntity.ok(mapToResponse(client)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<ClientResponse>> getClientsByOffice(
            @RequestParam(required = false) String officeId) {
        List<Client> clients = officeId != null ? 
                clientApplicationService.findByOffice(officeId) :
                List.of();
        
        List<ClientResponse> responses = clients.stream()
                .map(this::mapToResponse)
                .toList();
        
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/search")
    public ResponseEntity<List<ClientResponse>> searchClients(@RequestBody SearchClientsRequest request) {
        List<Client> clients = clientApplicationService.search(request.getQuery());
        List<ClientResponse> responses = clients.stream()
                .map(this::mapToResponse)
                .toList();
        
        return ResponseEntity.ok(responses);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('PARTNER') or hasRole('MANAGER')")
    public ResponseEntity<ClientResponse> updateClient(@PathVariable String id, 
                                                       @RequestBody Client client) {
        return clientApplicationService.findById(id)
                .map(existingClient -> {
                    client.setId(id);
                    Client updated = clientApplicationService.updateClient(client);
                    return ResponseEntity.ok(mapToResponse(updated));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('PARTNER')")
    public ResponseEntity<Void> deactivateClient(@PathVariable String id) {
        clientApplicationService.deactivateClient(id);
        return ResponseEntity.noContent().build();
    }

    private ClientResponse mapToResponse(Client client) {
        return new ClientResponse(
                client.getId(),
                client.getName(),
                client.getLegalType().toString(),
                client.getOfficeId(),
                client.getGroupId(),
                client.isActive()
        );
    }
}
