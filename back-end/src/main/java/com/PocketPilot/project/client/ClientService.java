package com.PocketPilot.project.client;

import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;

@Service
public class ClientService {
    private final ClientRepository clientRepository;

    public ClientService(ClientRepository clientRepository) {
        this.clientRepository = clientRepository;
    }

    public List<Client> getAllClients() {
        return clientRepository.findAll();
    }

    public Client getClientById(UUID id) {
        return clientRepository.findById(id)
                .orElseThrow();
    }

    public Client createClient(Client client) {
        return clientRepository.save(client);
    }

    public void deleteClient(UUID id) {
        clientRepository.deleteById(id);
    }

    public Client updateClient(UUID id, Client updatedClient) {
        return clientRepository.findById(id)
                .map(client -> {
                    client.setNom(updatedClient.getNom()!=null ? updatedClient.getNom() : client.getNom());
                    client.setPrenom(updatedClient.getPrenom()!=null ? updatedClient.getPrenom() : client.getPrenom());
                    client.setAdresse(updatedClient.getAdresse()!=null ? updatedClient.getAdresse() : client.getAdresse());
                    client.setEmail(updatedClient.getEmail()!=null ? updatedClient.getEmail() : client.getEmail());
                    client.setTelephone(updatedClient.getTelephone()!=null ? updatedClient.getTelephone() : client.getTelephone());
                    return clientRepository.save(client);
                })
                .orElseThrow();
    }
}
