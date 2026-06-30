import React from 'react'
import { Grid, VStack, Box, Text, useColorMode } from '@chakra-ui/react'
import { DashboardLayout } from '../layouts/DashboardLayout'
import { StatCard } from '../components/StatCard'
import { ChartPlaceholder } from '../components/ChartPlaceholder'

export const Dashboard: React.FC = () => {
  const { colorMode } = useColorMode()

  return (
    <DashboardLayout pageTitle="Tableau de bord">
      <VStack spacing="8" align="stretch">
        {/* Welcome Header */}
        <Box>
          <Text 
            fontSize="2xl" 
            fontWeight="700" 
            color={colorMode === 'dark' ? 'gray.100' : 'gray.900'}
            mb="1"
            letterSpacing="-0.5px"
          >
            Bienvenue, utilisateur
          </Text>
          <Text 
            fontSize="sm" 
            color={colorMode === 'dark' ? 'gray.500' : 'gray.600'}
            fontWeight="500"
          >
            Voici un aperçu de vos finances
          </Text>
        </Box>

        {/* Stats Grid */}
        <Grid
          templateColumns={{ base: '1fr', md: '1fr 1fr', lg: '1fr 1fr 1fr 1fr' }}
          gap="6"
        >
          <StatCard 
            title="Revenu mensuel" 
            value="12 500 €" 
            icon="💵"
            trend="+12%"
            trendColor="green"
          />
          <StatCard 
            title="Dépenses mensuelles" 
            value="8 200 €" 
            icon="💳"
            trend="+5%"
            trendColor="orange"
          />
          <StatCard 
            title="Épargne" 
            value="4 300 €" 
            icon="🏦"
            trend="+8%"
            trendColor="green"
          />
          <StatCard 
            title="Utilisation budget" 
            value="65%" 
            icon="📊"
            trend="Bon"
            trendColor="green"
          />
        </Grid>

        {/* Charts Grid */}
        <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap="6">
          <ChartPlaceholder title="Tendance des revenus" type="line" height="400px" />
          <ChartPlaceholder title="Répartition des dépenses" type="pie" height="400px" />
        </Grid>

        {/* Additional Insights */}
        <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap="6">
          <ChartPlaceholder title="Comparaison revenus/dépenses" type="bar" height="350px" />
          <ChartPlaceholder title="Performance du budget" type="line" height="350px" />
        </Grid>
      </VStack>
    </DashboardLayout>
  )
}
