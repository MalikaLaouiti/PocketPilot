package com.PocketPilot.project.budget;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

public interface BudgetRepository extends JpaRepository<Budget, UUID> {

    Optional<Budget> findByCompte_IdCompteAndMoisAndAnnee(UUID idCompte, int mois, int annee);
    boolean existsByCompte_IdCompteAndMoisAndAnnee(UUID idCompte, int mois, int annee);
}
