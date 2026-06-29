package com.PocketPilot.project.budget;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

public interface BudgetRepository extends JpaRepository<Budget, UUID> {
    List<Budget> findByCompte_IdCompte(UUID idCompte);
 
    Optional<Budget> findByCompte_IdCompteAndMoisAndAnnee(UUID idCompte, int mois, int annee);
 
    boolean existsByCompte_IdCompteAndMoisAndAnnee(UUID idCompte, int mois, int annee);
 
    List<Budget> findByCompte_IdCompteOrderByAnneeDescMoisDesc(UUID idCompte);

    Optional<Budget> findTopByCompte_IdCompteOrderByDateGenerationDesc(UUID idCompte);
}
