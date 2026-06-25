package com.PocketPilot.project.analyse;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

import com.PocketPilot.project.comptebancaire.CompteBancaire;

import jakarta.persistence.*;
import lombok.Data;


@Entity 
@Table(name = "analysemensuelle",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uk_analyse_compte_mois_annee",
            columnNames = {"idcompte", "mois", "annee"}  //no analyse for the same person and the same month and year=>no duplication
        )
    }
)
@Data
public class AnalyseMensuelle {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "idanalyse")
    private UUID idAnalyse;

    @ManyToOne
    @JoinColumn(name = "idcompte")
    private CompteBancaire compte;

    private Integer mois;

    private Integer annee;

    @Column(name = "revenu_total", precision = 15, scale = 3)
    private BigDecimal revenuTotal;

    @Column(name = "depense_totale", precision = 15, scale = 3)
    private BigDecimal depenseTotale;

    @Column(name = "epargne_totale", precision = 15, scale = 3)
    private BigDecimal epargneTotale;

    @Column(name = "taux_epargne", precision = 5, scale = 2)
    private BigDecimal tauxEpargne;

    @Column(name = "date_generation")
    private LocalDateTime dateGeneration;

    @Column(name = "periode_analyse")
    private Integer periodeAnalyse;
}
