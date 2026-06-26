package com.PocketPilot.project.ligneBudget;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

import com.PocketPilot.project.budget.Budget;

@Entity
@Table(name = "ligne_budget")
@Data
public class LigneBudget {

    @Id
    @GeneratedValue
    @Column(name = "idligne")
    private UUID idLigne;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CategorieDepense categorie;

    @Column(nullable = false, precision = 15, scale = 3)
    private BigDecimal montantPrevu;

    @Column(precision = 15, scale = 3)
    private BigDecimal montantDepense;

    private Double pourcentageSalaire;

    private Double pourcentageDepense;

    private Double alerteSeuil;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idbudget", nullable = false)
    private Budget budget;
}

