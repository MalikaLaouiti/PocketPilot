package com.PocketPilot.project.score;


import com.PocketPilot.project.comptebancaire.CompteBancaire;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(
    name = "score_financier",
    uniqueConstraints = @UniqueConstraint(
        columnNames = {"id_compte", "mois", "annee"},
        name = "uk_score_compte_mois_annee"
    )
)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ScoreFinancier {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id_score", updatable = false, nullable = false)
    private UUID idScore;

    @Column(nullable = false)
    private Integer mois;

    @Column(nullable = false)
    private Integer annee;

    @Column(nullable = false)
    private Integer scoreGlobal;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NiveauScore niveau;

    @Column(nullable = false)
    private Double tauxDisciplineBudgetaire;

    @Column(nullable = false)
    private Double tauxCapaciteEpargne;

    @Column(nullable = false)
    private Double tauxProgressionObjectifs;

    @Column(nullable = false)
    private Double tauxRegulariteRevenus;

    @Column(nullable = false)
    private LocalDateTime dateCalcul;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_compte", nullable = false)
    @JsonIgnore
    private CompteBancaire compte;
}

enum NiveauScore {
    CRITIQUE,      // 0  - 20
    FAIBLE,        // 21 - 40
    MOYEN,         // 41 - 60
    BON,           // 61 - 80
    EXCELLENT      // 81 - 100
}