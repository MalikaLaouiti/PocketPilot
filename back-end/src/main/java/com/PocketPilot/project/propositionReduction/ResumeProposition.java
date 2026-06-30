package com.PocketPilot.project.propositionReduction;

import java.util.List;

@lombok.Data
@lombok.Builder
@lombok.NoArgsConstructor
@lombok.AllArgsConstructor
public class ResumeProposition {
    private int nombreCategoriesConcernees;
    private java.math.BigDecimal gainMensuelTotal;
    private java.math.BigDecimal epargneMensuelleNecessaire;
    private Boolean objectifAtteignable;
    private Integer nombreMoisNecessaires;
    private String commentaire;
    private List<PropositionReduction> propositions;
}
