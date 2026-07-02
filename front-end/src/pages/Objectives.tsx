import React, { useState } from 'react'
import { Grid, VStack, Box, Text, Button, HStack, useColorMode, useDisclosure, Spinner, Center, useToast } from '@chakra-ui/react'
import { DashboardLayout } from '../layouts/DashboardLayout'
import { ObjectifCard } from '../components/Objectif/ObjectifCard'
import { PlanModal } from '../components/Objectif/PlanModal'
import { CreateObjectifModal } from '../components/Objectif/CreateObjectifModal'
import { useObjectifs} from '../hooks/useObjectifs'
import { useCompteActif } from '../context/CompteContext'
import { useDeleteObjectif } from '../hooks/mutations/useObjectifMutations'

export const Objectives: React.FC = () => {
  const { colorMode } = useColorMode()
  const { compte } = useCompteActif()
  const toast = useToast()

  const { data: objectifs, isLoading, error } = useObjectifs(compte?.idCompte ?? '')
  const { mutate: supprimer, isPending: isDeleting, variables: deletingId } = useDeleteObjectif(compte?.idCompte ?? '')

  const planModal = useDisclosure()
  const createModal = useDisclosure()
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const handleVoirPlan = (id: string) => {
    setSelectedId(id)
    planModal.onOpen()
  }

  const handleSupprimer = (id: string) => {
    supprimer(id, {
      onSuccess: () => toast({ title: 'Objectif supprimé', status: 'success', duration: 2500 }),
      onError: () => toast({ title: 'Erreur lors de la suppression', status: 'error', duration: 2500 }),
    })
  }

  if (!compte) {
    return (
      <DashboardLayout pageTitle="Objectifs financiers">
        <Text>Aucun compte trouvé</Text>
      </DashboardLayout>
    )
  }

  if (isLoading) {
    return (
      <DashboardLayout pageTitle="Objectifs financiers">
        <Center h="400px"><Spinner size="xl" color="brand.500" thickness="3px" /></Center>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout pageTitle="Objectifs financiers">
        <Box p={8} textAlign="center">
          <Text color="red.500">Erreur lors du chargement des données</Text>
        </Box>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout pageTitle="Objectifs financiers">
      <VStack spacing="8" align="stretch">
        <HStack justify="space-between" align="flex-start" flexWrap="wrap">
          <Box>
            <Text fontSize="2xl" fontWeight="700" color={colorMode === 'dark' ? 'gray.100' : 'gray.900'} mb="2" letterSpacing="-0.5px">
              Vos objectifs financiers
            </Text>
            <Text fontSize="sm" color={colorMode === 'dark' ? 'gray.500' : 'gray.600'} fontWeight="500">
              Suivez votre progression vers vos objectifs d&apos;épargne
            </Text>
          </Box>
          <Button colorScheme="brand" borderRadius="10px" fontWeight="600" onClick={createModal.onOpen}>
            + Nouvel objectif
          </Button>
        </HStack>

        {(!objectifs || objectifs.length === 0) ? (
          <Box
            bg={colorMode === 'dark' ? '#1a1828' : '#ffffff'}
            p="10" borderRadius="14px" border="1px solid"
            borderColor={colorMode === 'dark' ? '#2a2540' : '#e8e4f1'}
            textAlign="center"
          >
            <Text fontSize="3xl" mb="2">🎯</Text>
            <Text color="gray.500">Vous n&apos;avez pas encore d&apos;objectif. Créez-en un pour démarrer votre plan.</Text>
          </Box>
        ) : (
          <Grid templateColumns={{ base: '1fr', md: '1fr 1fr', lg: '1fr 1fr 1fr' }} gap="6">
            {objectifs.map((objectif) => (
              <ObjectifCard
                key={objectif.idObjectif}
                objectif={objectif}
                onVoirPlan={() => handleVoirPlan(objectif.idObjectif)}
                onSupprimer={() => handleSupprimer(objectif.idObjectif)}
                isDeleting={isDeleting && deletingId === objectif.idObjectif}
                idObjectif={objectif.idObjectif}
              />
            ))}
          </Grid>
        )}
      </VStack>

      <PlanModal isOpen={planModal.isOpen} onClose={planModal.onClose} idObjectif={selectedId} />
      <CreateObjectifModal isOpen={createModal.isOpen} onClose={createModal.onClose} />
    </DashboardLayout>
  )
}