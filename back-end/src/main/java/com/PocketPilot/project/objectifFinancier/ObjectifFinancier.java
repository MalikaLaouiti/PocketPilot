package com.PocketPilot.project.objectifFinancier;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.PocketPilot.project.comptebancaire.CompteBancaire;
import com.PocketPilot.project.planObjectif.PlanObjectif;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;


@Entity
@Table(name = "objectif_financier")
@AllArgsConstructor
@Data
@Builder
public class ObjectifFinancier {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id_objectif", updatable = false, nullable = false)
    private UUID idObjectif;

    @Column(nullable = false)
    private String titre;

    private String description;

    @Column(nullable = false, precision = 15, scale = 3)
    private BigDecimal montantCible;

    @Builder.Default
    @Column(nullable = false, precision = 15, scale = 3)
    private BigDecimal montantAccumule = BigDecimal.ZERO;

    @Column(nullable = false)
    private LocalDate dateCible;

    private LocalDate dateAtteinte;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    @Column(nullable = false)
    private StatutObjectif statut = StatutObjectif.EN_ATTENTE;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    @Column(nullable = false)
    private NiveauPriorite priorite = NiveauPriorite.NORMALE;

    @Column(precision = 5, scale = 2)
    private BigDecimal tauxProgression;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_compte", nullable = false)
    @JsonIgnore
    private CompteBancaire compte;

    @OneToOne(mappedBy = "objectifFinancier", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private PlanObjectif planObjectif;

    public ObjectifFinancier() {
    }

}

enum StatutObjectif {
    EN_ATTENTE,
    EN_COURS,
    ATTEINT,
    ABANDONNE
}

enum NiveauPriorite {
    FAIBLE,
    NORMALE,
    ELEVEE,
    URGENTE
}