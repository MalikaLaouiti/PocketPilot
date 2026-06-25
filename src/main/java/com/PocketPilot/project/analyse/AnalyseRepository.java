package com.PocketPilot.project.analyse;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface AnalyseRepository extends JpaRepository<AnalyseMensuelle, UUID> {

        List<AnalyseMensuelle> findByCompte_IdCompte(UUID idCompte);

        // Fenêtre glissante : les 3 dernières analyses pour la prévision
        List<AnalyseMensuelle> findTop3ByCompte_IdCompteOrderByAnneeDescMoisDesc(UUID idCompte);
}