import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter,
  FormControl, FormLabel, Input, Textarea, NumberInput, NumberInputField, Select,
  VStack, Button, useToast,
} from '@chakra-ui/react'
import { useCreerObjectif } from '../../hooks/mutations/useObjectifMutations' 
import { useCompteActif } from '../../context/CompteContext'
import { PRIORITE_CONFIG } from '../../types/constants/objectifEnums'
import type { NiveauPriorite } from '../../types/constants/enums'
import { useState } from 'react'

interface CreateObjectifModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CreateObjectifModal({ isOpen, onClose }: CreateObjectifModalProps) {
  const { compte } = useCompteActif()
  const toast = useToast()
  const { mutate: creer, isPending } = useCreerObjectif(compte?.idCompte ?? '')

  const [titre, setTitre] = useState('')
  const [description, setDescription] = useState('')
  const [montantCible, setMontantCible] = useState('')
  const [dateCible, setDateCible] = useState('')
  const [priorite, setPriorite] = useState<NiveauPriorite>('NORMALE')

  const isValid = titre.trim().length > 0 && Number(montantCible) > 0 && !!dateCible

  const resetForm = () => {
    setTitre(''); setDescription(''); setMontantCible(''); setDateCible(''); setPriorite('NORMALE')
  }

  const handleSubmit = () => {
    if (!isValid) return
    creer(
      { titre, description: description , montantCible: Number(montantCible), dateCible, priorite },
      {
        onSuccess: () => {
          toast({ title: 'Objectif créé', status: 'success', duration: 3000 })
          resetForm()
          onClose()
        },
        onError: () => {
          toast({ title: 'Erreur lors de la création', status: 'error', duration: 3000 })
        },
      }
    )
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent borderRadius="16px">
        <ModalHeader>Nouvel objectif financier</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing="4" align="stretch">
            <FormControl isRequired>
              <FormLabel fontSize="sm">Titre</FormLabel>
              <Input value={titre} onChange={e => setTitre(e.target.value)} placeholder="Ex: Fonds d'urgence" />
            </FormControl>

            <FormControl>
              <FormLabel fontSize="sm">Description</FormLabel>
              <Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Optionnel" rows={3} />
            </FormControl>

            <FormControl isRequired>
              <FormLabel fontSize="sm">Montant cible (TND)</FormLabel>
              <NumberInput min={1} value={montantCible} onChange={val => setMontantCible(val)}>
                <NumberInputField placeholder="10000" />
              </NumberInput>
            </FormControl>

            <FormControl isRequired>
              <FormLabel fontSize="sm">Date cible</FormLabel>
              <Input type="date" value={dateCible} onChange={e => setDateCible(e.target.value)} />
            </FormControl>

            <FormControl isRequired>
              <FormLabel fontSize="sm">Priorité</FormLabel>
              <Select value={priorite} onChange={e => setPriorite(e.target.value as NiveauPriorite)}>
                {Object.entries(PRIORITE_CONFIG).map(([key, cfg]) => (
                  <option key={key} value={key}>{cfg.label}</option>
                ))}
              </Select>
            </FormControl>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr="3" onClick={onClose}>Annuler</Button>
          <Button colorScheme="brand" onClick={handleSubmit} isLoading={isPending} isDisabled={!isValid} borderRadius="10px">
            Créer l&apos;objectif
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}