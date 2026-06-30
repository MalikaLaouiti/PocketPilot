package com.PocketPilot.project.ligneBudget;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

public interface LigneRepository extends JpaRepository<LigneBudget, UUID> {
   List<LigneBudget> findByBudget_IdBudget(UUID idBudget);
 
    Optional<LigneBudget> findByBudget_IdBudgetAndCategorie(UUID idBudget, CategorieDepense categorie);
}
