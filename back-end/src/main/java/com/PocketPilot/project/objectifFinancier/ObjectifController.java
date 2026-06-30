package com.PocketPilot.project.objectifFinancier;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.PocketPilot.project.ligneBudget.CategorieDepense;
import com.PocketPilot.project.planObjectif.PlanObjectif;
import com.PocketPilot.project.planObjectif.PlanService;
import com.PocketPilot.project.propositionReduction.PropositionReduction;
import com.PocketPilot.project.propositionReduction.PropositionRepository;
import com.PocketPilot.project.propositionReduction.ResumeProposition;

import java.util.List;
import java.util.UUID;

/**
 * OBJECTIFS
 * POST /api/objectifs → Créer un objectif
 * GET /api/objectifs?idCompte=xxx → Lister les objectifs d'un compte
 * GET /api/objectifs?idCompte=xxx&statut=xxx → Filtrer par statut
 * GET /api/objectifs/{id} → Consulter un objectif
 * PUT /api/objectifs/{id} → Modifier un objectif
 * DELETE /api/objectifs/{id} → Supprimer un objectif
 *
 * PLAN
 * POST /api/objectifs/{id}/plan → Générer le plan d'épargne
 * GET /api/objectifs/{id}/plan → Consulter le plan
 *
 * PROPOSITIONS
 * GET /api/objectifs/{id}/plan/propositions → Toutes les propositions
 * GET /api/objectifs/{id}/plan/propositions?categorie=LOISIR → Filtrer par
 * catégorie
 * GET /api/objectifs/{id}/plan/propositions/resume → Résumé global du gain
 */

@RestController
@RequestMapping("/api/objectifs")
@RequiredArgsConstructor
public class ObjectifController {

    private final ObjectifService objectifService;
    private final PlanService planObjectifService;
    private final PropositionRepository propositionReductionRepository;

    @PostMapping
    public ResponseEntity<ObjectifFinancier> creerObjectif(
            @RequestBody @Valid ObjectifFinancier objectif,
            @RequestParam UUID idCompte) {
        ObjectifFinancier cree = objectifService.creerObjectif(objectif, idCompte);
        return ResponseEntity.status(HttpStatus.CREATED).body(cree);
    }

    @GetMapping
    public ResponseEntity<List<ObjectifFinancier>> listerObjectifs(
            @RequestParam UUID idCompte,
            @RequestParam(required = false) StatutObjectif statut) {
        List<ObjectifFinancier> objectifs = (statut != null)
                ? objectifService.listerObjectifsParStatut(idCompte, statut)
                : objectifService.listerObjectifsParCompte(idCompte);
        return ResponseEntity.ok(objectifs);
    }

    @GetMapping("/{idObjectif}")
    public ResponseEntity<ObjectifFinancier> getObjectif(@PathVariable UUID idObjectif) {
        return ResponseEntity.ok(objectifService.getObjectifById(idObjectif));
    }

    @PutMapping("/{idObjectif}")
    public ResponseEntity<ObjectifFinancier> mettreAJourObjectif(
            @PathVariable UUID idObjectif,
            @RequestBody @Valid ObjectifFinancier objectif) {
        return ResponseEntity.ok(objectifService.mettreAJourObjectif(idObjectif, objectif));
    }

    @DeleteMapping("/{idObjectif}")
    public ResponseEntity<Void> supprimerObjectif(@PathVariable UUID idObjectif) {
        objectifService.supprimerObjectif(idObjectif);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{idObjectif}/plan")
    public ResponseEntity<PlanObjectif> genererPlan(@PathVariable UUID idObjectif) {
        PlanObjectif plan = planObjectifService.genererPlan(idObjectif);
        return ResponseEntity.status(HttpStatus.CREATED).body(plan);
    }

    @GetMapping("/{idObjectif}/plan")
    public ResponseEntity<PlanObjectif> getPlan(@PathVariable UUID idObjectif) {
        return ResponseEntity.ok(planObjectifService.getPlanParObjectif(idObjectif));
    }

    @GetMapping("/{idObjectif}/plan/propositions")
    public ResponseEntity<List<PropositionReduction>> getPropositions(
            @PathVariable UUID idObjectif,
            @RequestParam(required = false) CategorieDepense categorie) {

        PlanObjectif plan = planObjectifService.getPlanParObjectif(idObjectif);

        List<PropositionReduction> propositions;

        if (categorie != null) {
            propositions = propositionReductionRepository
                    .findByPlanObjectif_IdPlanAndCategorie(plan.getIdPlan(), categorie);
        } else {
            propositions = propositionReductionRepository
                    .findByPlanObjectif_IdPlan(plan.getIdPlan());
        }

        return ResponseEntity.ok(propositions);
    }

    @GetMapping("/{idObjectif}/plan/propositions/resume")
    public ResponseEntity<ResumeProposition> getResumePropositions(@PathVariable UUID idObjectif) {

        PlanObjectif plan = planObjectifService.getPlanParObjectif(idObjectif);

        List<PropositionReduction> propositions = plan.getPropositionsReduction();

        ResumeProposition resume = ResumeProposition.builder()
                .nombreCategoriesConcernees(propositions.size())
                .gainMensuelTotal(plan.getReductionMensuelleTotale())
                .epargneMensuelleNecessaire(plan.getEpargneMensuelleNecessaire())
                .objectifAtteignable(plan.getObjectifAtteignable())
                .nombreMoisNecessaires(plan.getNombreMoisNecessaires())
                .commentaire(plan.getCommentaire())
                .propositions(propositions)
                .build();

        return ResponseEntity.ok(resume);
    }

}