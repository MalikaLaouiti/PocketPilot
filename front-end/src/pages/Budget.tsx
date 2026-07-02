import React from 'react'
import { VStack, Grid, Box, Text, HStack, Badge, useColorMode, Spinner, Center } from '@chakra-ui/react'
import { DashboardLayout } from '../layouts/DashboardLayout'
import { StatCard } from '../components/StatCard'
import { BudgetAllocationCard } from '../components/BudgetAllocationCard'
import { useBudgets } from '../hooks/useBudgets'
import { useAnalyse } from '../hooks/useAnalyse'
import { useCompteActif } from '../context/CompteContext'
import { STATUT_BUDGET_CONFIG } from '../types/budgetEnums'
import type { Budget } from '../types/budget'

const MOIS_LABELS = [
  '', 'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
]

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'TND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)

export const BudgetPage: React.FC = () => {
  const { colorMode } = useColorMode()
  const { compte } = useCompteActif()

  if (!compte) {
    return (
      <DashboardLayout pageTitle="Budget">
        <Text>Aucun compte trouvé</Text>
      </DashboardLayout>
    )
  }

  const { data: budgets, isLoading, error } = useBudgets(compte.idCompte)
  const { data: analyses } = useAnalyse(compte.idCompte) // historique réel, pour comparaison

  const sortedBudgets = React.useMemo(() => {
    if (!budgets) return []
    return [...budgets].sort((a, b) =>
      a.annee !== b.annee ? a.annee - b.annee : a.mois - b.mois
    )
  }, [budgets])

  // Le budget "à venir" = le plus récent (mois prochain projeté)
  const current: Budget | undefined = sortedBudgets[sortedBudgets.length - 1]

  // Dernière analyse réelle disponible (mois écoulé) pour comparer les allocations
  const derniereAnalyse = React.useMemo(() => {
    if (!analyses || analyses.length === 0) return undefined
    return [...analyses].sort((a, b) =>
      a.annee !== b.annee ? b.annee - a.annee : b.mois - a.mois
    )[0]
  }, [analyses])

  if (isLoading) {
    return (
      <DashboardLayout pageTitle="Budget">
        <Center h="400px"><Spinner size="xl" color="blue.500" thickness="3px" /></Center>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout pageTitle="Budget">
        <Box p={8} textAlign="center">
          <Text color="red.500">Erreur lors du chargement des données</Text>
          <Text fontSize="sm" color="gray.500">{(error as Error).message}</Text>
        </Box>
      </DashboardLayout>
    )
  }

  if (!current) {
    return (
      <DashboardLayout pageTitle="Budget">
        <Box p={8} textAlign="center">
          <Text color="gray.500">Aucun budget prévisionnel disponible</Text>
        </Box>
      </DashboardLayout>
    )
  }

  const statutConfig = STATUT_BUDGET_CONFIG[current.statut]
  const epargnePrevuePct = current.revenuPrevu > 0
    ? (current.epargnePrevue / current.revenuPrevu) * 100
    : 0

  return (
    <DashboardLayout pageTitle="Budget">
      <VStack spacing="8" align="stretch">
        {/* Header */}
        <Box>
          <HStack justify="space-between" align="flex-start" flexWrap="wrap">
            <Box>
              <Text fontSize="2xl" fontWeight="700" color={colorMode === 'dark' ? 'gray.100' : 'gray.900'} mb="2" letterSpacing="-0.5px">
                Budget prévisionnel
              </Text>
              <Text fontSize="sm" color={colorMode === 'dark' ? 'gray.500' : 'gray.600'} fontWeight="500">
                {MOIS_LABELS[current.mois]} {current.annee} · Projection basée sur vos habitudes récentes
              </Text>
            </Box>
            <Badge colorScheme={statutConfig.colorScheme} fontSize="0.8rem" px="3" py="1" borderRadius="md">
              {statutConfig.label}
            </Badge>
          </HStack>
        </Box>

        {/* Résumé de la projection */}
        <Grid templateColumns={{ base: '1fr', md: '1fr 1fr', lg: '1fr 1fr 1fr' }} gap="6">
          <StatCard
            title="Revenu prévu"
            value={formatCurrency(current.revenuPrevu)}
            icon="💵"
            trend={derniereAnalyse ? `vs ${formatCurrency(derniereAnalyse.revenuTotal)} réel` : '—'}
            trendColor="red"
          />
          <StatCard
            title="Dépense prévue"
            value={formatCurrency(current.depensePrevue)}
            icon="📊"
            trend={derniereAnalyse ? `vs ${formatCurrency(derniereAnalyse.depenseTotale)} réel` : '—'}
            trendColor="orange"
          />
          <StatCard
            title="Épargne prévue"
            value={formatCurrency(current.epargnePrevue)}
            icon="🎯"
            trend={`${epargnePrevuePct.toFixed(0)}% du revenu`}
            trendColor="green"
          />
        </Grid>

        {/* Allocation par catégorie */}
        <Box>
          <Text fontSize="lg" fontWeight="700" mb="1" color={colorMode === 'dark' ? 'gray.100' : 'gray.900'} letterSpacing="-0.3px">
            Allocation par catégorie
          </Text>
          <Text fontSize="sm" color="gray.500" mb="6">
            Répartition proposée pour le mois prochain
          </Text>
          <Grid templateColumns={{ base: '1fr', md: '1fr 1fr', lg: '1fr 1fr 1fr' }} gap="6">
            {current.lignesBudget.map(ligne => (
              <BudgetAllocationCard
                key={ligne.idLigne}
                categorie={ligne.categorie}
                montantPrevu={ligne.montantPrevu}
                pourcentageSalaire={ligne.pourcentageSalaire}
                // Pas de données par catégorie dans AnalyseMensuelle actuellement —
                // à remplacer par un vrai total par catégorie/mois si l'API l'expose
                montantMoisPrecedent={undefined}
              />
            ))}
          </Grid>
        </Box>
      </VStack>
    </DashboardLayout>
  )
}