package com.PocketPilot.project.comptebancaire;

import java.math.BigDecimal;
import java.time.LocalDate;

import jakarta.persistence.*;
import lombok.Data;
import java.util.UUID;

import com.PocketPilot.project.client.Client;


@Entity
@Table(name = "compte_bancaire")
@Data
public class CompteBancaire {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id_compte")
    private UUID idCompte;

    @OneToOne
    @JoinColumn(name = "id_client")
    private Client client;

    @Column(length = 20, unique = true)
    private String rib;

    @Column(length = 24, unique = true)
    private String iban;

    @Column(name = "type_compte", length = 20)
    private String typeCompte;

    @Column(name = "solde_actuel", precision = 15, scale = 3)
    private BigDecimal soldeActuel;

    @Column(length = 3)
    private String devise = "TND";

    @Column(name = "date_ouverture")
    private LocalDate dateOuverture;

    @Column(length = 20)
    private String statut;

    @Column(name = "plafond_retrait_journalier", precision = 10, scale = 3)
    private BigDecimal plafondRetraitJournalier;
}
