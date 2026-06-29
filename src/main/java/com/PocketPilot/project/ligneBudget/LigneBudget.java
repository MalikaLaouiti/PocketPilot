package com.PocketPilot.project.ligneBudget;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.UUID;

import com.PocketPilot.project.budget.Budget;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Table(name = "ligne_budget")
@Data
@Builder
@AllArgsConstructor
public class LigneBudget {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id_ligne")
    private UUID idLigne;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CategorieDepense categorie;
 
    @Column(precision = 15, scale = 3, nullable = false)
    private BigDecimal montantPrevu;
 
    @Column(precision = 15, scale = 3)
    private BigDecimal montantDepense;
 
    @Column(precision = 5, scale = 2)
    private BigDecimal pourcentageSalaire;
 
    @Column(precision = 5, scale = 2)
    private BigDecimal pourcentageDepense;
 
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_budget", nullable = false)
    @JsonBackReference   
    private Budget budget;

    public LigneBudget() {}
 
    public void calculerPourcentageSalaire(BigDecimal revenuPrevu) {
        if (revenuPrevu != null && revenuPrevu.compareTo(BigDecimal.ZERO) > 0) {
            this.pourcentageSalaire = montantPrevu
                    .divide(revenuPrevu, 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100))
                    .setScale(2, RoundingMode.HALF_UP);
        } else {
            this.pourcentageSalaire = BigDecimal.ZERO;
        }
    }
 
    public void calculerPourcentageDepense(BigDecimal totalDepensesPrevues) {
        if (totalDepensesPrevues != null && totalDepensesPrevues.compareTo(BigDecimal.ZERO) > 0) {
            this.pourcentageDepense = montantPrevu
                    .divide(totalDepensesPrevues, 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100))
                    .setScale(2, RoundingMode.HALF_UP);
        } else {
            this.pourcentageDepense = BigDecimal.ZERO;
        }
    }

}

