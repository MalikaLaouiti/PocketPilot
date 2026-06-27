package com.PocketPilot.project.budget;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import com.PocketPilot.project.comptebancaire.CompteBancaire;
import com.PocketPilot.project.ligneBudget.LigneBudget;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Table(
    name = "budget",
    uniqueConstraints = @UniqueConstraint(columnNames = {"mois", "annee"})
)
@Data
@Builder
public class Budget {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "idbudget")
    private UUID idBudget;
    
    @OneToOne
    @JoinColumn(name = "idcompte")
    private CompteBancaire compte;

    @Column(nullable = false)
    private Integer mois;

    @Column(nullable = false)
    private Integer annee;

    @Column(precision = 15, scale = 3)
    private BigDecimal revenuPrevu;

    @Column(precision = 15, scale = 3)
    private BigDecimal depensePrevue;

    @Column(precision = 15, scale = 3)
    private BigDecimal epargnePrevue;

    @Column(precision = 15, scale = 3)
    private BigDecimal tauxDepense;

    @Column(nullable = false)
    private LocalDateTime dateGeneration;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatutBudget statut;

    @OneToMany(mappedBy = "budget",cascade = CascadeType.ALL,orphanRemoval = true)
    @JsonManagedReference
    @Builder.Default
    private List<LigneBudget> lignesBudget = new ArrayList<>();

    public void addLigne(LigneBudget ligne) {
        ligne.setBudget(this);
        this.lignesBudget.add(ligne);
    }

    public void recalculerTotaux() {
        this.depensePrevue = lignesBudget.stream()
                .map(LigneBudget::getMontantPrevu)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
 
        this.epargnePrevue = (revenuPrevu != null)
                ? revenuPrevu.subtract(depensePrevue)
                : BigDecimal.ZERO;
 
        if (revenuPrevu != null && revenuPrevu.compareTo(BigDecimal.ZERO) > 0) {
            this.tauxDepense = depensePrevue
                    .divide(revenuPrevu, 4, java.math.RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100));
        } else {
            this.tauxDepense = BigDecimal.ZERO;
        }
    }
}

enum StatutBudget {
    PREVU,
    VALIDE,
    EN_COURS,
    CLOTURE
}    
