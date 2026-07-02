import React from 'react'
import {
  Grid,
  VStack,
  HStack,
  Box,
  Text,
  useColorMode,
  Spinner,
  Center,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
} from '@chakra-ui/react'
import { DashboardLayout } from '../layouts/DashboardLayout'
import { StatCard } from '../components/StatCard'
import { useTransactionsByCompte } from '../hooks/useTransactions'
import { useAnalyse } from '../hooks/useAnalyse'
import { useCompteActif } from '../context/CompteContext'
import type { AnalyseMensuelle } from '../types/analyseMensuelle'
import { CategoryExpenseChart } from '../components/CategoryExpenseChart'

const MOIS_LABELS = [
  '', 'Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun',
  'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc',
]

export const Analysis: React.FC = () => {
  const { colorMode } = useColorMode()
  const { compte } = useCompteActif()

  if (!compte) {
    return (
      <DashboardLayout pageTitle="Mon profil">
        <Text>Aucun compte trouvé</Text>
      </DashboardLayout>
    )
  }

  const { data: analyses, isLoading, error } = useAnalyse(compte.idCompte)
  const { data: transactions } = useTransactionsByCompte(compte.idCompte)
  // Tri chronologique croissant (utile partout : graphiques + comparaison)
  const sortedAsc = React.useMemo(() => {
    if (!analyses) return []
    return [...analyses].sort((a, b) =>
      a.annee !== b.annee ? a.annee - b.annee : a.mois - b.mois
    )
  }, [analyses])

  const latest = sortedAsc[sortedAsc.length - 1]
  const previous = sortedAsc[sortedAsc.length - 2]

  // Format currency
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'TND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)

  const formatPercent = (value: number) => `${value.toFixed(1)}%`

  const calculateTrend = (current: number, previousVal: number) => {
    if (!previousVal) return '+0%'
    const change = ((current - previousVal) / Math.abs(previousVal)) * 100
    return `${change > 0 ? '+' : ''}${change.toFixed(1)}%`
  }

  // Stats agrégées (cumul de la période chargée)
  const stats = React.useMemo(() => {
    if (!analyses || analyses.length === 0) {
      return { totalBalance: 0, averageMonthlyExpense: 0, ytdSavings: 0, totalRevenue: 0, totalExpense: 0 }
    }
    const totalRevenue = analyses.reduce((sum, a) => sum + a.revenuTotal, 0)
    const totalExpense = analyses.reduce((sum, a) => sum + a.depenseTotale, 0)
    const totalSavings = analyses.reduce((sum, a) => sum + a.epargneTotale, 0)
    return {
      totalBalance: latest?.compte?.soldeActuel ?? 0,
      averageMonthlyExpense: totalExpense / analyses.length,
      ytdSavings: totalSavings,
      totalRevenue,
      totalExpense,
    }
  }, [analyses, latest])

  // Les 3 derniers mois consécutifs disponibles pour la comparaison
  const comparisonMonths: AnalyseMensuelle[] = sortedAsc.slice(-3)

  if (isLoading) {
    return (
      <DashboardLayout pageTitle="Analyse financière">
        <Center h="400px">
          <Spinner size="xl" color="blue.500" thickness="3px" />
        </Center>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout pageTitle="Analyse financière">
        <Box p={8} textAlign="center">
          <Text color="red.500">Erreur lors du chargement des données</Text>
          <Text fontSize="sm" color="gray.500">{(error as Error).message}</Text>
        </Box>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout pageTitle="Analyse financière">
      <VStack spacing="8" align="stretch">
        {/* Header */}
        <Box>
          <Text fontSize="2xl" fontWeight="700" color={colorMode === 'dark' ? 'gray.100' : 'gray.900'} mb="2" letterSpacing="-0.5px">
            Analyse détaillée
          </Text>
          <Text fontSize="sm" color={colorMode === 'dark' ? 'gray.500' : 'gray.600'} fontWeight="500">
            {analyses && analyses.length > 0
              ? `Analyse basée sur ${analyses.length} mois de données`
              : 'Aucune donnée disponible'}
          </Text>
        </Box>

        {/* Statistics Cards */}
        <Grid templateColumns={{ base: '1fr', md: '1fr 1fr', lg: '1fr 1fr 1fr' }} gap="6">
          <StatCard
            title="Solde total"
            value={formatCurrency(stats.totalBalance)}
            icon="💰"
            trend={latest && previous ? calculateTrend(latest.epargneTotale, previous.epargneTotale) : '+0%'}
            trendColor={stats.totalBalance >= 0 ? 'green' : 'red'}
          />
          <StatCard
            title="Dépense moyenne mensuelle"
            value={formatCurrency(stats.averageMonthlyExpense)}
            icon="📉"
            trend={latest && previous ? calculateTrend(latest.depenseTotale, previous.depenseTotale) : '+0%'}
            trendColor={latest && previous && latest.depenseTotale <= previous.depenseTotale ? 'green' : 'orange'}
          />
          <StatCard
            title="Taux d'épargne actuel"
            value={latest ? formatPercent(latest.tauxEpargne) : '0%'}
            icon="🎯"
            trend={latest && previous ? calculateTrend(latest.tauxEpargne, previous.tauxEpargne) : '+0%'}
            trendColor={latest && latest.tauxEpargne >= 0 ? 'green' : 'red'}
          />
        </Grid>

        {/* Comparaison sur 3 mois consécutifs */}
        {comparisonMonths.length > 0 && (
          <Box
            bg={colorMode === 'dark' ? 'gray.800' : 'white'}
            borderRadius="xl"
            p="6"
            borderWidth="1px"
            borderColor={colorMode === 'dark' ? 'gray.700' : 'gray.200'}
          >
            <Text fontSize="lg" fontWeight="600" mb="4">
              Comparaison sur {comparisonMonths.length} mois consécutifs
            </Text>
            <Box overflowX="auto">
              <Table size="sm" variant="simple">
                <Thead>
                  <Tr>
                    <Th>Métrique</Th>
                    {comparisonMonths.map(a => (
                      <Th key={a.idAnalyse} isNumeric>
                        {MOIS_LABELS[a.mois]} {a.annee}
                      </Th>
                    ))}
                  </Tr>
                </Thead>
                <Tbody>
                  <ComparisonRow
                    label="Revenu total"
                    months={comparisonMonths}
                    getValue={a => a.revenuTotal}
                    format={formatCurrency}
                  />
                  <ComparisonRow
                    label="Dépense totale"
                    months={comparisonMonths}
                    getValue={a => a.depenseTotale}
                    format={formatCurrency}
                    lowerIsBetter
                  />
                  <ComparisonRow
                    label="Épargne totale"
                    months={comparisonMonths}
                    getValue={a => a.epargneTotale}
                    format={formatCurrency}
                  />
                  <ComparisonRow
                    label="Taux d'épargne"
                    months={comparisonMonths}
                    getValue={a => a.tauxEpargne}
                    format={formatPercent}
                  />
                </Tbody>
              </Table>
            </Box>
          </Box>
        )}

        <Box width="100%" overflowX="auto">
          <CategoryExpenseChart transactions={transactions || []} />
        </Box>

      </VStack>
    </DashboardLayout>
  )
}

// --- Ligne de comparaison réutilisable ---
interface ComparisonRowProps {
  label: string
  months: AnalyseMensuelle[]
  getValue: (a: AnalyseMensuelle) => number
  format: (v: number) => string
  lowerIsBetter?: boolean
}

const ComparisonRow: React.FC<ComparisonRowProps> = ({ label, months, getValue, format, lowerIsBetter }) => {
  return (
    <Tr>
      <Td fontWeight="500">{label}</Td>
      {months.map((a, idx) => {
        const value = getValue(a)
        const prevValue = idx > 0 ? getValue(months[idx - 1]) : null
        const delta = prevValue !== null && prevValue !== 0 ? ((value - prevValue) / Math.abs(prevValue)) * 100 : null
        const isGood = delta === null ? true : lowerIsBetter ? delta <= 0 : delta >= 0

        return (
          <Td key={a.idAnalyse} isNumeric>
            <HStack justify="flex-end" spacing="2">
              <Text>{format(value)}</Text>
              {delta !== null && (
                <Badge colorScheme={isGood ? 'green' : 'red'} fontSize="0.65rem">
                  {delta > 0 ? '▲' : delta < 0 ? '▼' : '–'} {Math.abs(delta).toFixed(1)}%
                </Badge>
              )}
            </HStack>
          </Td>
        )
      })}
    </Tr>
  )
}