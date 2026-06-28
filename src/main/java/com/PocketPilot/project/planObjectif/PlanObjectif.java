package com.PocketPilot.project.planObjectif;

import com.PocketPilot.project.budget.*;
import com.PocketPilot.project.objectifFinancier.ObjectifFinancier;
import com.PocketPilot.project.propositionReduction.PropositionReduction;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;


@Entity
@Table(name = "plan_objectif")
@Data
@Builder
public class PlanObjectif {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id_plan", updatable = false, nullable = false)
    private UUID idPlan;

    @Column(nullable = false, precision = 15, scale = 3)
    private BigDecimal epargneMensuelleNecessaire;

    @Column(nullable = false, precision = 15, scale = 3)
    private BigDecimal reductionMensuelleTotale;

    @Column(nullable = false)
    private Boolean objectifAtteignable;

    private Integer nombreMoisNecessaires;

    @Column(nullable = false)
    private LocalDateTime dateGeneration;

    @Column(columnDefinition = "TEXT")
    private String commentaire;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_objectif", nullable = false)
    @JsonIgnore
    private ObjectifFinancier objectifFinancier;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_budget", nullable = false)
    @JsonIgnore
    private Budget budgetPrevisionnel;

    @OneToMany(mappedBy = "plan_objectif", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PropositionReduction> propositionsReduction;
}
