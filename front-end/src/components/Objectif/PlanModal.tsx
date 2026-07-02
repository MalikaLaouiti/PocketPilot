import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter,
  Spinner, Center, VStack, HStack, Box, Text, Badge, Grid, Button, useColorMode,
} from '@chakra-ui/react'
import { CATEGORIE_CONFIG } from '../../types/budgetEnums'
import { usePlanObjectif } from '../../hooks/usePlanObjectif'
import { useGenererPlan } from '../../hooks/mutations/useObjectifMutations' 
import { useCompteActif } from '../../context/CompteContext'

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('fr-FR', {
    style: 'currency', currency: 'TND', minimumFractionDigits: 0, maximumFractionDigits: 0,
  }).format(amount)

interface PlanModalProps {
  isOpen: boolean
  onClose: () => void
  idObjectif: string | null
}

export function PlanModal({ isOpen, onClose, idObjectif }: PlanModalProps) {
  const { colorMode } = useColorMode()
  const { compte } = useCompteActif()
  const { data: plan, isLoading, isError } = usePlanObjectif(idObjectif ?? '')
  const { mutate: generer, isPending } = useGenererPlan(compte?.idCompte ?? '')

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent bg={colorMode === 'dark' ? '#15121f' : 'white'} borderRadius="16px">
        <ModalHeader>Plan d&apos;épargne</ModalHeader>
        <ModalCloseButton />

        {isLoading ? (
          <ModalBody>
            <Center py="10"><Spinner size="lg" color="brand.500" /></Center>
          </ModalBody>
        ) : isError || !plan ? (
          <ModalBody>
            <VStack py="10" spacing="4">
              <Text fontSize="3xl">🧮</Text>
              <Text color="gray.500" textAlign="center">
                Aucun plan n&apos;a encore été généré pour cet objectif.
              </Text>
            </VStack>
          </ModalBody>
        ) : (
          <>
            <ModalBody>
              <VStack align="stretch" spacing="6">
                {plan.commentaire && (
                  <Box
                    bg={colorMode === 'dark' ? 'whiteAlpha.50' : 'brand.50'}
                    borderLeft="4px solid"
                    borderColor="brand.400"
                    p="3"
                    borderRadius="8px"
                  >
                    <Text fontSize="sm" fontStyle="italic">💬 {plan.commentaire}</Text>
                  </Box>
                )}

                <HStack justify="space-between">
                  <Badge
                    colorScheme={plan.objectifAtteignable ? 'green' : 'red'}
                    px="3" py="1" borderRadius="8px" fontSize="0.75rem"
                  >
                    {plan.objectifAtteignable ? '✓ Objectif atteignable' : '⚠ Objectif difficile'}
                  </Badge>
                  <Text fontSize="xs" color="gray.500">
                    Généré le {new Date(plan.dateGeneration).toLocaleDateString('fr-FR')}
                  </Text>
                </HStack>

                {/* Métriques */}
                <Grid templateColumns="repeat(3, 1fr)" gap="3">
                  <Box bg={colorMode === 'dark' ? 'whiteAlpha.50' : 'gray.50'} p="3" borderRadius="10px">
                    <Text fontSize="xs" color="gray.500" mb="1">Épargne mensuelle</Text>
                    <Text fontWeight="700" fontSize="sm">{formatCurrency(plan.epargneMensuelleNecessaire)}</Text>
                  </Box>
                  <Box bg={colorMode === 'dark' ? 'whiteAlpha.50' : 'gray.50'} p="3" borderRadius="10px">
                    <Text fontSize="xs" color="gray.500" mb="1">Réduction totale</Text>
                    <Text fontWeight="700" fontSize="sm">{formatCurrency(plan.reductionMensuelleTotale)}</Text>
                  </Box>
                  <Box bg={colorMode === 'dark' ? 'whiteAlpha.50' : 'gray.50'} p="3" borderRadius="10px">
                    <Text fontSize="xs" color="gray.500" mb="1">Délai estimé</Text>
                    <Text fontWeight="700" fontSize="sm">
                      {plan.nombreMoisNecessaires ? `${plan.nombreMoisNecessaires} mois` : '—'}
                    </Text>
                  </Box>
                </Grid>

                {/* Propositions de réduction */}
                <Box>
                  <Text fontWeight="700" fontSize="sm" mb="3">Propositions de réduction</Text>
                  <VStack align="stretch" spacing="2">
                    {plan.propositionsReduction.length === 0 && (
                      <Text fontSize="sm" color="gray.500">Aucune réduction proposée.</Text>
                    )}
                    {plan.propositionsReduction.map((prop) => {
                      const config = CATEGORIE_CONFIG[prop.categorie]
                      return (
                        <HStack
                          key={prop.id}
                          justify="space-between"
                          p="3"
                          borderRadius="10px"
                          border="1px solid"
                          borderColor={colorMode === 'dark' ? '#2a2540' : '#e8e4f1'}
                        >
                          <HStack spacing="3">
                            <Text fontSize="lg">{config.icon}</Text>
                            <VStack align="flex-start" spacing="0">
                              <Text fontSize="sm" fontWeight="600">{config.label}</Text>
                              <HStack fontSize="xs" spacing="2">
                                <Text color="gray.500" textDecoration="line-through">{formatCurrency(prop.montantActuel)}</Text>
                                <Text color="green.500" fontWeight="600">→ {formatCurrency(prop.montantPropose)}</Text>
                              </HStack>
                            </VStack>
                          </HStack>
                          <VStack align="flex-end" spacing="0">
                            <Badge colorScheme={config.colorScheme} fontSize="0.65rem">-{prop.pourcentageReduction.toFixed(0)}%</Badge>
                            <Text fontSize="xs" color="green.500" fontWeight="600">-{formatCurrency(prop.reduction)}</Text>
                          </VStack>
                        </HStack>
                      )
                    })}
                  </VStack>
                </Box>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr="3" onClick={onClose}>Fermer</Button>
              <Button
                colorScheme="brand"
                onClick={() => idObjectif && generer(idObjectif)}
                isLoading={isPending}
                borderRadius="10px"
              >
                Régénérer le plan
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}