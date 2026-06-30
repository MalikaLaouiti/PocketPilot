import React from 'react'
import { Grid, VStack, Box, Text, useColorMode } from '@chakra-ui/react'
import { DashboardLayout } from '../layouts/DashboardLayout'
import { StatCard } from '../components/StatCard'
import { ChartPlaceholder } from '../components/ChartPlaceholder'

export const Analysis: React.FC = () => {
  const { colorMode } = useColorMode()

  return (
    <DashboardLayout pageTitle="Analyse financière">
      <VStack spacing="8" align="stretch">
        {/* Header */}
        <Box>
          <Text 
            fontSize="2xl" 
            fontWeight="700" 
            color={colorMode === 'dark' ? 'gray.100' : 'gray.900'}
            mb="2"
            letterSpacing="-0.5px"
          >
            Analyse détaillée
          </Text>
          <Text 
            fontSize="sm" 
            color={colorMode === 'dark' ? 'gray.500' : 'gray.600'}
            fontWeight="500"
          >
            Analysez vos dépenses et vos revenus en profondeur
          </Text>
        </Box>

        {/* Statistics Cards */}
        <Grid
          templateColumns={{ base: '1fr', md: '1fr 1fr', lg: '1fr 1fr 1fr' }}
          gap="6"
        >
          <StatCard 
            title="Solde total" 
            value="28 450 €" 
            icon="💰"
            trend="+15%"
            trendColor="green"
          />
          <StatCard 
            title="Dépense moyenne mensuelle" 
            value="8 200 €" 
            icon="📉"
            trend="+3%"
            trendColor="orange"
          />
          <StatCard 
            title="Épargne YTD" 
            value="14 500 €" 
            icon="🎯"
            trend="+22%"
            trendColor="green"
          />
        </Grid>

        {/* Charts */}
        <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap="6">
          <ChartPlaceholder
            title="Tendance des dépenses mensuelles"
            type="line"
            height="400px"
          />
          <ChartPlaceholder
            title="Répartition par catégorie"
            type="pie"
            height="400px"
          />
        </Grid>

        {/* Additional Analysis */}
        <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap="6">
          <ChartPlaceholder
            title="Revenus vs dépenses"
            type="bar"
            height="350px"
          />
          <ChartPlaceholder
            title="Performance du budget"
            type="line"
            height="350px"
          />
        </Grid>
      </VStack>
    </DashboardLayout>
  )
}
