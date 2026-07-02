import React from 'react'
import {
  Grid, VStack, Box, Text, HStack, Badge, Button, Progress,
  useColorMode, Spinner, Center,
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import {
  ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts'
import { DashboardLayout } from '../layouts/DashboardLayout'
import { StatCard } from '../components/StatCard'
import { ScoreSanteCard } from '../components/ScoreSanteCard'
import { useCompteActif } from '../context/CompteContext'
import { useAnalyse } from '../hooks/useAnalyse'
import { useBudgets } from '../hooks/useBudgets'
import { useObjectifs } from '../hooks/useObjectifs'
import { useTransactionsByCompte } from '../hooks/useTransactions'
import { useScoreSante } from '../hooks/useScoreSante'
import { PRIORITE_CONFIG, STATUT_OBJECTIF_CONFIG } from '../types/constants/objectifEnums'

const MOIS_LABELS = ['', 'Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc']
const PIE_COLORS = ['#3182CE', '#E53E3E', '#38A169', '#D69E2E', '#805AD5', '#DD6B20', '#319795', '#D53F8C']

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('fr-FR', {
    style: 'currency', currency: 'TND', minimumFractionDigits: 0, maximumFractionDigits: 0,
  }).format(amount)

export const Dashboard: React.FC = () => {
  const { colorMode } = useColorMode()
  const { compte } = useCompteActif()
  const navigate = useNavigate()

  const idCompte = compte?.idCompte ?? ''
  const { data: analyses, isLoading: loadingAnalyses } = useAnalyse(idCompte)
  const { data: budgets, isLoading: loadingBudgets } = useBudgets(idCompte)
  const { data: objectifs, isLoading: loadingObjectifs } = useObjectifs(idCompte)
  const { data: transactions } = useTransactionsByCompte(idCompte)
  const { data: score, isLoading: loadingScore } = useScoreSante(idCompte)

  const sortedAnalyses = React.useMemo(() => {
    if (!analyses) return []
    return [...analyses].sort((a, b) => a.annee !== b.annee ? a.annee - b.annee : a.mois - b.mois)
  }, [analyses])

  const latest = sortedAnalyses[sortedAnalyses.length - 1]
  const previous = sortedAnalyses[sortedAnalyses.length - 2]

  const currentBudget = React.useMemo(() => {
    if (!budgets) return undefined
    return [...budgets].sort((a, b) => a.annee !== b.annee ? b.annee - a.annee : b.mois - a.mois)[0]
  }, [budgets])

  const trend = (current: number, prev: number) => {
    if (!prev) return '+0%'
    const change = ((current - prev) / Math.abs(prev)) * 100
    return `${change > 0 ? '+' : ''}${change.toFixed(1)}%`
  }

  const lineData = sortedAnalyses.map(a => ({
    month: `${MOIS_LABELS[a.mois]} ${a.annee}`,
    revenu: a.revenuTotal,
    depense: a.depenseTotale,
  }))

  const pieData = React.useMemo(() => {
    if (!transactions) return []
    const depenses = transactions.filter(t => t.typeTransaction === 'DEPENSE')
    const total = depenses.reduce((s, t) => s + Math.abs(t.montant), 0)
    const byCat = depenses.reduce<Record<string, number>>((acc, t) => {
      const cat = t.categorie || 'Autre'
      acc[cat] = (acc[cat] || 0) + Math.abs(t.montant)
      return acc
    }, {})
    return Object.entries(byCat)
      .map(([name, value]) => ({ name, value, percent: total > 0 ? (value / total) * 100 : 0 }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6)
  }, [transactions])

  const budgetUtilisation = currentBudget && currentBudget.depensePrevue > 0
    ? Math.round((currentBudget.lignesBudget.reduce((s, l) => s + (l.montantDepense || 0), 0) / currentBudget.depensePrevue) * 100)
    : null

  // Objectifs les plus urgents / prioritaires
  const objectifsAffiches = React.useMemo(() => {
    if (!objectifs) return []
    return [...objectifs]
      .filter(o => o.statut !== 'ATTEINT' && o.statut !== 'ABANDONNE')
      .sort((a, b) => {
        const order: Record<string, number> = { URGENTE: 0, ELEVEE: 1, NORMALE: 2, FAIBLE: 3 }
        return order[a.priorite] - order[b.priorite]
      })
      .slice(0, 3)
  }, [objectifs])

  if (!compte) {
    return (
      <DashboardLayout pageTitle="Tableau de bord">
        <Text>Aucun compte trouvé</Text>
      </DashboardLayout>
    )
  }

  const isLoading = loadingAnalyses || loadingBudgets || loadingObjectifs || loadingScore

  if (isLoading) {
    return (
      <DashboardLayout pageTitle="Tableau de bord">
        <Center h="400px"><Spinner size="xl" color="brand.500" thickness="3px" /></Center>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout pageTitle="Tableau de bord">
      <VStack spacing="8" align="stretch">
        {/* Welcome Header */}
        <Box>
          <Text fontSize="2xl" fontWeight="700" color={colorMode === 'dark' ? 'gray.100' : 'gray.900'} mb="1" letterSpacing="-0.5px">
            Bienvenue, {compte?.client.prenom} {compte?.client.nom}!
          </Text>
          <Text fontSize="sm" color={colorMode === 'dark' ? 'gray.500' : 'gray.600'} fontWeight="500">
            Voici un aperçu de vos finances
          </Text>
        </Box>

        {/* Score santé + Stats */}
        <Grid templateColumns={{ base: '1fr', lg: '1.2fr 1fr' }} gap="6">
          {score && <ScoreSanteCard score={score} />}

          <Grid templateColumns="1fr 1fr" gap="4">
            <StatCard
              title="Revenu"
              value={latest ? formatCurrency(latest.revenuTotal) : '—'}
              icon="💵"
              trend={latest && previous ? trend(latest.revenuTotal, previous.revenuTotal) : '+0%'}
              trendColor="green"
            />
            <StatCard
              title="Dépenses"
              value={latest ? formatCurrency(latest.depenseTotale) : '—'}
              icon="💳"
              trend={latest && previous ? trend(latest.depenseTotale, previous.depenseTotale) : '+0%'}
              trendColor={latest && previous && latest.depenseTotale <= previous.depenseTotale ? 'green' : 'orange'}
            />
            <StatCard
              title="Solde"
              value={latest ? formatCurrency(latest.compte?.soldeActuel ?? 0) : '—'}
              icon="🏦"
              trend={latest ? `${latest.tauxEpargne.toFixed(1)}% épargné` : '—'}
              trendColor="green"
            />
            <StatCard
              title="Budget utilisé"
              value={budgetUtilisation != null ? `${budgetUtilisation}%` : '—'}
              icon="📊"
              trend={budgetUtilisation != null ? (budgetUtilisation <= 90 ? 'Bon' : 'Attention') : '—'}
              trendColor={budgetUtilisation != null && budgetUtilisation <= 90 ? 'green' : 'red'}
            />
          </Grid>
        </Grid>

        {/* Alerte dépassement budget */}
        {budgetUtilisation != null && budgetUtilisation > 100 && (
          <Box bg="red.50" _dark={{ bg: 'red.900' }} borderLeft="4px solid" borderColor="red.400" p="4" borderRadius="10px">
            <HStack justify="space-between">
              <Text fontSize="sm" color="red.600" _dark={{ color: 'red.200' }}>
                ⚠️ Vous avez dépassé votre budget prévu de {budgetUtilisation - 100}% ce mois-ci.
              </Text>
              <Button size="xs" colorScheme="red" variant="outline" onClick={() => navigate('/budget')}>
                Voir le budget
              </Button>
            </HStack>
          </Box>
        )}

        {/* Charts */}
        <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap="6">
          <Box bg={colorMode === 'dark' ? '#1a1828' : 'white'} borderRadius="16px" p="6" border="1px solid" borderColor={colorMode === 'dark' ? '#2a2540' : '#e8e4f1'}>
            <Text fontWeight="700" mb="4">Tendance revenus / dépenses</Text>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="month" fontSize={11} />
                <YAxis fontSize={11} />
                <Tooltip formatter={(v: string | number | readonly (string | number)[] | undefined) => typeof v === 'number' ? formatCurrency(v) : ''} />
                <Line type="monotone" dataKey="revenu" name="Revenu" stroke="#38A169" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="depense" name="Dépense" stroke="#E53E3E" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </Box>

          <Box bg={colorMode === 'dark' ? '#1a1828' : 'white'} borderRadius="16px" p="6" border="1px solid" borderColor={colorMode === 'dark' ? '#2a2540' : '#e8e4f1'}>
            <Text fontWeight="700" mb="4">Répartition des dépenses</Text>
            {pieData.length === 0 ? (
              <Center h="240px"><Text color="gray.500" fontSize="sm">Aucune dépense enregistrée</Text></Center>
            ) : (
              <HStack align="center" spacing="4">
                <Box w="55%" h="240px">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={85} paddingAngle={2}>
                        {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                      </Pie>
                      <Tooltip formatter={(v: string | number | readonly (string | number)[] | undefined) => typeof v === 'number' ? formatCurrency(v) : ''} />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
                <VStack align="stretch" flex="1" spacing="1.5">
                  {pieData.map((d, i) => (
                    <HStack key={d.name} justify="space-between" fontSize="xs">
                      <HStack spacing="1.5">
                        <Box w="8px" h="8px" borderRadius="full" bg={PIE_COLORS[i % PIE_COLORS.length]} />
                        <Text noOfLines={1}>{d.name}</Text>
                      </HStack>
                      <Text fontWeight="700">{d.percent.toFixed(0)}%</Text>
                    </HStack>
                  ))}
                </VStack>
              </HStack>
            )}
          </Box>
        </Grid>

        {/* Objectifs prioritaires */}
        <Box>
          <HStack justify="space-between" mb="4">
            <Text fontWeight="700" fontSize="lg" color={colorMode === 'dark' ? 'gray.100' : 'gray.900'}>
              Objectifs prioritaires
            </Text>
            <Button size="sm" variant="ghost" colorScheme="brand" onClick={() => navigate('/objectives')}>
              Voir tout →
            </Button>
          </HStack>

          {objectifsAffiches.length === 0 ? (
            <Box bg={colorMode === 'dark' ? '#1a1828' : 'white'} p="6" borderRadius="14px" border="1px solid" borderColor={colorMode === 'dark' ? '#2a2540' : '#e8e4f1'} textAlign="center">
              <Text color="gray.500" fontSize="sm">Aucun objectif en cours. Créez-en un pour démarrer.</Text>
            </Box>
          ) : (
            <Grid templateColumns={{ base: '1fr', md: '1fr 1fr', lg: '1fr 1fr 1fr' }} gap="4">
              {objectifsAffiches.map(obj => {
                const priorite = PRIORITE_CONFIG[obj.priorite]
                const statut = STATUT_OBJECTIF_CONFIG[obj.statut]
                const progress = obj.tauxProgression != null
                  ? Math.min(Math.round(obj.tauxProgression), 100)
                  : Math.min(Math.round((obj.montantAccumule / obj.montantCible) * 100), 100)

                return (
                  <Box
                    key={obj.idObjectif}
                    bg={colorMode === 'dark' ? '#1a1828' : 'white'}
                    p="5"
                    borderRadius="14px"
                    border="1px solid"
                    borderColor={colorMode === 'dark' ? '#2a2540' : '#e8e4f1'}
                    cursor="pointer"
                    transition="all 0.2s ease"
                    _hover={{ transform: 'translateY(-2px)', borderColor: 'brand.400' }}
                    onClick={() => navigate('/objectifs')}
                  >
                    <HStack justify="space-between" mb="2">
                      <Text fontWeight="600" fontSize="sm" noOfLines={1}>{obj.titre}</Text>
                      <Badge colorScheme={priorite.colorScheme} fontSize="0.6rem">{priorite.label}</Badge>
                    </HStack>
                    <Badge colorScheme={statut.colorScheme} variant="subtle" fontSize="0.6rem" mb="3">{statut.label}</Badge>
                    <HStack justify="space-between" fontSize="xs" mb="1">
                      <Text color="gray.500">{formatCurrency(obj.montantAccumule)} / {formatCurrency(obj.montantCible)}</Text>
                      <Text fontWeight="700" color="brand.500">{progress}%</Text>
                    </HStack>
                    <Progress value={progress} colorScheme="brand" borderRadius="full" h="2" />
                  </Box>
                )
              })}
            </Grid>
          )}
        </Box>
      </VStack>
    </DashboardLayout>
  )
}