package com.caplatform.application.client.service;

import com.caplatform.domain.client.entity.Client;
import com.caplatform.domain.client.entity.ClientIdentifier;
import com.caplatform.domain.client.repository.ClientRepository;
import com.caplatform.domain.client.repository.ClientIdentifierRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Client Application Service
 * Implements use cases for client management
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class ClientApplicationService {
    
    private final ClientRepository clientRepository;
    private final ClientIdentifierRepository identifierRepository;

    public Client createClient(String name, Client.ClientLegalType legalType, String officeId) {
        Client client = new Client(name, legalType, officeId);
        Client savedClient = clientRepository.save(client);
        log.info("Client created: {} with ID: {}", name, savedClient.getId());
        return savedClient;
    }

    public void addIdentifier(String clientId, ClientIdentifier.IdentifierType type, String value) {
        ClientIdentifier identifier = new ClientIdentifier(clientId, type, value);
        identifierRepository.save(identifier);
        log.info("Identifier added for client: {} with type: {}", clientId, type);
    }

    public Optional<Client> findById(String id) {
        return clientRepository.findById(id);
    }

    public List<Client> findByOffice(String officeId) {
        return clientRepository.findByOfficeId(officeId);
    }

    public List<Client> search(String query) {
        return clientRepository.searchByName(query);
    }

    public Client updateClient(Client client) {
        return clientRepository.save(client);
    }

    public void deactivateClient(String clientId) {
        clientRepository.findById(clientId).ifPresent(client -> {
            client.setIsActive(false);
            clientRepository.save(client);
            log.info("Client deactivated: {}", clientId);
        });
    }
}
