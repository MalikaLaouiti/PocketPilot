package com.PocketPilot.project.objectifFinancier;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ObjectifRepository extends JpaRepository<ObjectifFinancier, UUID> {
   
    List<ObjectifFinancier> findByCompte_IdCompte(UUID idCompte);

    List<ObjectifFinancier> findByCompte_IdCompteAndStatut(UUID idCompte, StatutObjectif statut);

    boolean existsByTitreAndCompte_IdCompte(String titre, UUID idCompte);
}