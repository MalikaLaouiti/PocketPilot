package com.PocketPilot.project.comptebancaire;

import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/comptes")
public class CompteController {
    private final CompteService compteService;

    public CompteController(CompteService compteService) {
        this.compteService = compteService;
    }

    @GetMapping
    public List<CompteBancaire> getAllComptes() {
        return compteService.getAllComptes();
    }

    @GetMapping("/{id_compte}")
    public CompteBancaire getCompte(@PathVariable("id_compte") UUID id) {
        return compteService.getCompteById(id);
    }

    @GetMapping("/byClient/{id_client}")
    public CompteBancaire getCompteByClientId(@PathVariable("id_client") UUID idClient) {
        return compteService.getCompteByClientId(idClient);
    }

    @PostMapping
    public CompteBancaire createCompte(@RequestBody CompteBancaire compte) {
        return compteService.createCompte(compte);
    }

    @DeleteMapping("/{id_compte}")
    public void deleteCompte(@PathVariable("id_compte") UUID id) {
        compteService.deleteCompte(id);
    }
    
}