package com.PocketPilot.project.objectifFinancier;

import com.PocketPilot.project.comptebancaire.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.UUID;


@Service
@RequiredArgsConstructor
@Transactional
public class ObjectifService {

    private final ObjectifRepository objectifRepository;
    private final CompteRepository compteRepository;

    
    public ObjectifFinancier creerObjectif(ObjectifFinancier objectif, UUID idCompte) {
        CompteBancaire compte = compteRepository.findById(idCompte)
                .orElseThrow(() -> new RuntimeException("Compte introuvable : " + idCompte));

        objectif.setCompte(compte);
        objectif.setStatut(StatutObjectif.EN_ATTENTE);
        objectif.setMontantAccumule(BigDecimal.ZERO);
        objectif.setTauxProgression(BigDecimal.ZERO);

        return objectifRepository.save(objectif);
    }


    @Transactional(readOnly = true)
    public List<ObjectifFinancier> listerObjectifsParCompte(UUID idCompte) {
        return objectifRepository.findByCompte_IdCompte(idCompte);
    }

     
    @Transactional(readOnly = true)
    public List<ObjectifFinancier> listerObjectifsParStatut(UUID idCompte, StatutObjectif statut) {
        return objectifRepository.findByCompte_IdCompteAndStatut(idCompte, statut);
    }

     
    @Transactional(readOnly = true)
    public ObjectifFinancier getObjectifById(UUID idObjectif) {
        return objectifRepository.findById(idObjectif)
                .orElseThrow();
    }
     
    public ObjectifFinancier mettreAJourObjectif(UUID idObjectif, ObjectifFinancier objectifMisAJour) {
        ObjectifFinancier existant = getObjectifById(idObjectif);

        existant.setTitre(objectifMisAJour.getTitre());
        existant.setDescription(objectifMisAJour.getDescription());
        existant.setMontantCible(objectifMisAJour.getMontantCible());
        existant.setDateCible(objectifMisAJour.getDateCible());
        existant.setPriorite(objectifMisAJour.getPriorite());
        existant.setMontantAccumule(objectifMisAJour.getMontantAccumule() != null ? objectifMisAJour.getMontantAccumule() : existant.getMontantAccumule());
        existant.setStatut(objectifMisAJour.getStatut() != null ? objectifMisAJour.getStatut() : existant.getStatut());

        recalculerTauxProgression(existant);

        return objectifRepository.save(existant);
    }

     
    public void supprimerObjectif(UUID idObjectif) {
        ObjectifFinancier objectif = getObjectifById(idObjectif);
        objectifRepository.delete(objectif);
    }

    private void recalculerTauxProgression(ObjectifFinancier objectif) {
        if (objectif.getMontantCible().compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal taux = objectif.getMontantAccumule()
                    .multiply(new BigDecimal("100"))
                    .divide(objectif.getMontantCible(), 2, RoundingMode.HALF_UP);
            objectif.setTauxProgression(taux);
        }
    }
}
