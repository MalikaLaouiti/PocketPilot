package com.PocketPilot.project.score;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ScoreRepository extends JpaRepository<ScoreFinancier, UUID> {

    List<ScoreFinancier> findByCompte_IdCompteOrderByAnneeDescMoisDesc(UUID idCompte);
    Optional<ScoreFinancier> findByCompte_IdCompteAndMoisAndAnnee(UUID idCompte, Integer mois, Integer annee);
    Optional<ScoreFinancier> findTopByCompte_IdCompteOrderByAnneeDescMoisDesc(UUID idCompte);
    @Query("""
        SELECT s FROM ScoreFinancier s
        WHERE s.compte.idCompte = :idCompte
        ORDER BY s.annee DESC, s.mois DESC
        LIMIT :limite
    """)
    List<ScoreFinancier> findDerniersScores(
            @Param("idCompte") UUID idCompte,
            @Param("limite") int limite);
    List<ScoreFinancier> findByCompte_IdCompteAndAnneeOrderByMoisAsc(UUID idCompte, Integer annee);
    boolean existsByCompte_IdCompteAndMoisAndAnnee(UUID idCompte, Integer mois, Integer annee);
    List<ScoreFinancier> findByNiveauAndMoisAndAnnee(NiveauScore niveau, Integer mois, Integer annee);
}