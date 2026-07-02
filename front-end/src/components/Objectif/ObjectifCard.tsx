import React, { useRef } from 'react'
import { 
  AlertDialog, 
  AlertDialogBody, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogContent, 
  AlertDialogOverlay, 
  Box, 
  VStack, 
  HStack, 
  Text, 
  Badge, 
  Progress, 
  Button, 
  useColorMode, 
  IconButton, 
  useDisclosure 
} from '@chakra-ui/react'
import { DeleteIcon } from '@chakra-ui/icons'
import { FiAlertCircle } from 'react-icons/fi'
import { PRIORITE_CONFIG, STATUT_OBJECTIF_CONFIG } from '../../types/constants/objectifEnums'
import type { ObjectifFinancier } from '../../types/constants/objectifFinancier'
import { useCompteActif } from '../../context/CompteContext'
import { useGenererPlan } from '../../hooks/mutations/useObjectifMutations'

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('fr-FR', {
    style: 'currency', currency: 'TND', minimumFractionDigits: 0, maximumFractionDigits: 0,
  }).format(amount)

const moisRestants = (dateCible: string): number => {
  const cible = new Date(dateCible)
  const now = new Date()
  const diff = (cible.getFullYear() - now.getFullYear()) * 12 + (cible.getMonth() - now.getMonth())
  return Math.max(diff, 0)
}

interface ObjectifCardProps {
  objectif: ObjectifFinancier
  onVoirPlan: () => void
  onSupprimer: () => void
  isDeleting?: boolean
  idObjectif: string | null
}

export const ObjectifCard: React.FC<ObjectifCardProps> = ({ 
  objectif, 
  onVoirPlan, 
  onSupprimer, 
  isDeleting, 
  idObjectif 
}) => {
  const { colorMode } = useColorMode()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = useRef<HTMLButtonElement>(null)
  
  const priorite = PRIORITE_CONFIG[objectif.priorite]
  const statut = STATUT_OBJECTIF_CONFIG[objectif.statut]
  const progress = objectif.tauxProgression != null
    ? Math.min(Math.round(objectif.tauxProgression), 100)
    : Math.min(Math.round((objectif.montantAccumule / objectif.montantCible) * 100), 100)
  const restant = moisRestants(objectif.dateCible)
  const hasPlan = !!objectif.planObjectif
  const { compte } = useCompteActif()
  const { mutate: generer, isPending } = useGenererPlan(compte?.idCompte ?? '')

  const handleDelete = () => {
    onSupprimer()
    onClose()
  }

  return (
    <>
      <Box
        position="relative"
        overflow="hidden"
        bg={colorMode === 'dark' ? '#1a1828' : '#ffffff'}
        p="6"
        borderRadius="14px"
        boxShadow={colorMode === 'dark' ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.06)'}
        border="1px solid"
        borderColor={colorMode === 'dark' ? '#2a2540' : '#e8e4f1'}
        display="flex"
        flexDirection="column"
        transition="all 0.3s ease"
        _hover={{
          transform: 'translateY(-4px)',
          boxShadow: colorMode === 'dark' ? '0 8px 16px rgba(117,106,182,0.2)' : '0 8px 16px rgba(117,106,182,0.15)',
        }}
      >
        <Box position="absolute" top="0" left="0" right="0" h="3px" bg={`${priorite.colorScheme}.400`} />

        <IconButton
          aria-label="Supprimer l'objectif"
          icon={<DeleteIcon />}
          size="xs"
          variant="ghost"
          colorScheme="red"
          position="absolute"
          top="4"
          right="4"
          isLoading={isDeleting}
          onClick={onOpen}
        />

        <VStack align="flex-start" spacing="4" flex="1">
          <VStack align="flex-start" spacing="1" pr="8">
            <Text fontSize="md" fontWeight="700" color={colorMode === 'dark' ? 'gray.100' : 'gray.900'} letterSpacing="-0.3px">
              {objectif.titre}
            </Text>
            {objectif.description && (
              <Text fontSize="xs" color="gray.500" noOfLines={1}>{objectif.description}</Text>
            )}
          </VStack>

          <HStack spacing="2" flexWrap="wrap">
            <Badge colorScheme={priorite.colorScheme} fontSize="0.65rem" borderRadius="6px">{priorite.label}</Badge>
            <Badge colorScheme={statut.colorScheme} variant="subtle" fontSize="0.65rem" borderRadius="6px">{statut.label}</Badge>
            {objectif.statut !== 'ATTEINT' && (
              <Badge colorScheme={restant <= 2 ? 'red' : 'gray'} variant="outline" fontSize="0.65rem" borderRadius="6px">
                {restant > 0 ? `${restant} mois restants` : 'Échéance dépassée'}
              </Badge>
            )}
          </HStack>

          <VStack align="flex-start" spacing="3" w="full">
            <HStack justify="space-between" w="full" fontSize="sm" fontWeight="500">
              <Text color={colorMode === 'dark' ? 'gray.500' : 'gray.600'}>
                {formatCurrency(objectif.montantAccumule)} / {formatCurrency(objectif.montantCible)}
              </Text>
              <Text fontWeight="700" color="brand.500" fontSize="sm">{progress}%</Text>
            </HStack>
            <Progress value={progress} w="full" colorScheme={objectif.statut === 'ATTEINT' ? 'green' : 'brand'} borderRadius="full" h="2.5" />
          </VStack>

          {hasPlan && objectif.planObjectif && (
            <HStack w="full" justify="space-between" fontSize="xs" bg={colorMode === 'dark' ? 'whiteAlpha.50' : 'gray.50'} p="2" borderRadius="8px">
              <Text color="gray.500">Épargne mensuelle requise</Text>
              <Text fontWeight="700">{formatCurrency(objectif.planObjectif.epargneMensuelleNecessaire)}</Text>
            </HStack>
          )}
        </VStack>

        <Button
          mt="6"
          colorScheme="brand"
          variant={hasPlan ? 'solid' : 'outline'}
          size="sm"
          w="full"
          onClick={() => {
            if (hasPlan) {
              onVoirPlan()
            } else if (idObjectif) {
              generer(idObjectif)
            }
          }}
          fontWeight="600"
          borderRadius="10px"
          isLoading={isPending}
          loadingText={hasPlan ? "Chargement..." : "Génération en cours..."}
          isDisabled={isPending || (!hasPlan && !idObjectif)}
        >
          {hasPlan ? 'Voir le plan' : 'Générer un plan'}
        </Button>
      </Box>

      {/* Alert Dialog pour la confirmation de suppression */}
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent
            bg={colorMode === 'dark' ? '#1a1828' : '#ffffff'}
            borderRadius="16px"
            boxShadow={colorMode === 'dark' 
              ? '0 20px 60px rgba(0,0,0,0.5)' 
              : '0 20px 60px rgba(0,0,0,0.15)'}
            p="4"
            maxW="420px"
            border="1px solid"
            borderColor={colorMode === 'dark' ? '#2a2540' : '#e8e4f1'}
          >
            <AlertDialogHeader p="0" pb="4">
              <VStack spacing="3" align="center">
                <Box
                  bg={colorMode === 'dark' ? 'rgba(254, 202, 202, 0.1)' : 'rgba(254, 202, 202, 0.15)'}
                  p="3"
                  borderRadius="full"
                  display="inline-flex"
                >
                  <FiAlertCircle size="24" color="#FC8181" />
                </Box>
                <Text
                  fontSize="lg"
                  fontWeight="700"
                  color={colorMode === 'dark' ? 'gray.100' : 'gray.900'}
                  textAlign="center"
                >
                  Supprimer cet objectif ?
                </Text>
              </VStack>
            </AlertDialogHeader>

            <AlertDialogBody p="0" pb="6">
              <Text
                color={colorMode === 'dark' ? 'gray.400' : 'gray.600'}
                textAlign="center"
                fontSize="sm"
              >
                Êtes-vous sûr de vouloir supprimer l'objectif{' '}
                <Text as="span" fontWeight="600" color={colorMode === 'dark' ? 'gray.100' : 'gray.900'}>
                  "{objectif.titre}"
                </Text>
                ? Cette action est irréversible et toutes les données associées seront définitivement supprimées.
              </Text>
            </AlertDialogBody>

            <AlertDialogFooter p="0" display="flex" gap="3" flexDirection="column">
              <Button
                ref={cancelRef}
                onClick={onClose}
                variant="outline"
                colorScheme="brand"
                borderRadius="10px"
                w="full"
                size="md"
                fontWeight="600"
                _hover={{
                  bg: colorMode === 'dark' ? 'rgba(255,255,255,0.05)' : 'gray.50',
                }}
              >
                Annuler
              </Button>
              <Button
                colorScheme="red"
                borderRadius="10px"
                w="full"
                size="md"
                fontWeight="600"
                onClick={handleDelete}
                isLoading={isDeleting}
                loadingText="Suppression..."
                leftIcon={<DeleteIcon />}
                _hover={{
                  transform: 'scale(1.02)',
                }}
                transition="all 0.2s"
              >
                Supprimer définitivement
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}