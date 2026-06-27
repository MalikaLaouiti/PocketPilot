package com.PocketPilot.project.budget;

import jakarta.persistence.*;
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
@Table(name = "budget")
@Data
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

    @Column(nullable = false, precision = 15, scale = 3)
    private BigDecimal revenuMensuel;

    @Column(precision = 15, scale = 3)
    private BigDecimal depenseTotale;

    @Column(precision = 15, scale = 3)
    private BigDecimal epargneReelle;

    private Double tauxDepense;

    @Column(nullable = false)
    private LocalDateTime dateCreation;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatutBudget statut;

    @OneToMany(mappedBy = "budget",cascade = CascadeType.ALL,orphanRemoval = true)
    @JsonManagedReference
    private List<LigneBudget> lignesBudget = new ArrayList<>();
}

enum StatutBudget {
    GENERE,    
    CONSULTE,  
    EXPIRE     
}