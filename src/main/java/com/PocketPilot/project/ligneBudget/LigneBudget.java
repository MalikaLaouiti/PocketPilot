package com.PocketPilot.project.ligneBudget;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

import com.PocketPilot.project.budget.Budget;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Table(name = "ligne_budget")
@Data
public class LigneBudget {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "idligne")
    private UUID idLigne;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CategorieDepense categorie;

    @Column(nullable = false, precision = 15, scale = 3)
    private BigDecimal montantPrevu;

    @Column(precision = 15, scale = 3)
    private BigDecimal montantDepense;

    private BigDecimal  pourcentageSalaire;

    private BigDecimal  pourcentageDepense;

    private BigDecimal  alerteSeuil;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idbudget", nullable = false)
    @JsonBackReference   
    private Budget budget;
}

