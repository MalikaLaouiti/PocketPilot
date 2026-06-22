package com.PocketPilot.project.comptebancaire;

import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;

@Service
public class CompteService {
    private final CompteRepository compteRepository;

    public CompteService(CompteRepository compteRepository) {
        this.compteRepository = compteRepository;
    }

    public List<CompteBancaire> getAllComptes() {
        return compteRepository.findAll();
    }

    public CompteBancaire getCompteById(UUID id) {
        return compteRepository.findById(id)
                .orElseThrow();
    }

    public CompteBancaire createCompte(CompteBancaire compte) {
        return compteRepository.save(compte);
    }

    public void deleteCompte(UUID id) {
        compteRepository.deleteById(id);
    }
}
