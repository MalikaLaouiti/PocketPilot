package com.PocketPilot.project.analyse;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface AnalyseRepository extends JpaRepository<AnalyseMensuelle, UUID> {

    Optional<AnalyseMensuelle> findByCompte_IdCompteAndMoisAndAnnee(
            UUID idCompte, int mois, int annee);

    // Fenêtre glissante : les 3 dernières analyses pour la prévision
    List<AnalyseMensuelle> findTop3ByCompte_IdCompteOrderByAnneeDescMoisDesc(
            UUID idCompte);
}