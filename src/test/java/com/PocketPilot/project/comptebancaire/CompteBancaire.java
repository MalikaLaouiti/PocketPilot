package com.PocketPilot.project.comptebancaire;

import java.math.BigDecimal;
import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.*;
import lombok.Data;
import java.util.UUID;


@Entity
@Table(name = "comptebancaire")
@Data
public class CompteBancaire {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "idcompte")
    private UUID idCompte;

    @Column(name = "idclient")
    private UUID idClient;

    @Column(length = 20, unique = true)
    private String rib;

    @Column(length = 24, unique = true)
    private String iban;

    @Column(name = "typecompte", length = 20)
    private String typeCompte;

    @Column(name = "soldeactuel", precision = 15, scale = 3)
    private BigDecimal soldeActuel;

    @Column(length = 3)
    private String devise = "TND";

    @Column(name = "dateouverture")
    private LocalDate dateOuverture;

    @Column(length = 20)
    private String statut;

    @Column(name = "plafondretraitjournalier", precision = 10, scale = 3)
    private BigDecimal plafondRetraitJournalier;
}
