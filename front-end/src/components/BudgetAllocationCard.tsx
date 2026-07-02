import React from 'react'
import { Box, HStack, VStack, Text, Badge, useColorMode } from '@chakra-ui/react'
import type { CategorieDepense } from '../types/enums'
import { CATEGORIE_CONFIG } from '../types/budgetEnums'

interface BudgetAllocationCardProps {
  categorie: CategorieDepense
  montantPrevu: number
  pourcentageSalaire: number | null
  montantMoisPrecedent?: number   
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'TND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)

export const BudgetAllocationCard: React.FC<BudgetAllocationCardProps> = ({
  categorie,
  montantPrevu,
  pourcentageSalaire,
  montantMoisPrecedent,
}) => {
  const { colorMode } = useColorMode()
  const config = CATEGORIE_CONFIG[categorie]

  const ecart = montantMoisPrecedent != null ? montantPrevu - montantMoisPrecedent : null
  const ecartPct = ecart != null && montantMoisPrecedent ? (ecart / montantMoisPrecedent) * 100 : null

  return (
    <Box
      bg={colorMode === 'dark' ? 'gray.800' : 'white'}
      borderRadius="xl"
      p="5"
      borderWidth="1px"
      borderColor={colorMode === 'dark' ? 'gray.700' : 'gray.200'}
    >
      <HStack justify="space-between" mb="3">
        <HStack spacing="3">
          <Text fontSize="xl">{config.icon}</Text>
          <Text fontWeight="600" fontSize="sm">{config.label}</Text>
        </HStack>
        {pourcentageSalaire != null && (
          <Badge colorScheme={config.colorScheme} fontSize="0.65rem">
            {pourcentageSalaire.toFixed(0)}% du salaire
          </Badge>
        )}
      </HStack>

      <Text fontSize="2xl" fontWeight="700" mb="1">
        {formatCurrency(montantPrevu)}
      </Text>
      <Text fontSize="xs" color="gray.500" mb="3">
        Montant alloué pour le mois prochain
      </Text>

      {ecart != null && ecartPct != null && (
        <VStack align="stretch" spacing="1" pt="3" borderTopWidth="1px" borderColor={colorMode === 'dark' ? 'gray.700' : 'gray.100'}>
          <HStack justify="space-between">
            <Text fontSize="xs" color="gray.500">Mois précédent (réel)</Text>
            <Text fontSize="xs" color="gray.500">{formatCurrency(montantMoisPrecedent!)}</Text>
          </HStack>
          <HStack justify="space-between">
            <Text fontSize="xs" fontWeight="500">Ajustement</Text>
            <Badge colorScheme={ecart <= 0 ? 'green' : 'orange'} fontSize="0.65rem">
              {ecart > 0 ? '+' : ''}{formatCurrency(ecart)} ({ecartPct > 0 ? '+' : ''}{ecartPct.toFixed(0)}%)
            </Badge>
          </HStack>
        </VStack>
      )}
    </Box>
  )
}