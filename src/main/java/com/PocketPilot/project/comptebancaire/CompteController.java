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

    @GetMapping("/{idcompte}")
    public CompteBancaire getCompte(@PathVariable("idcompte") UUID id) {
        return compteService.getCompteById(id);
    }

    @GetMapping("/byClient/{idclient}")
    public CompteBancaire getCompteByClientId(@PathVariable("idclient") UUID idClient) {
        return compteService.getCompteByClientId(idClient);
    }

    @PostMapping
    public CompteBancaire createCompte(@RequestBody CompteBancaire compte) {
        return compteService.createCompte(compte);
    }

    @DeleteMapping("/{idcompte}")
    public void deleteCompte(@PathVariable("idcompte") UUID id) {
        compteService.deleteCompte(id);
    }
    
}