import React from 'react'
import { VStack, Grid, Box, Text, useColorMode } from '@chakra-ui/react'
import { DashboardLayout } from '../layouts/DashboardLayout'
import { ProgressCard } from '../components/ProgressCard'
import { StatCard } from '../components/StatCard'

export const Budget: React.FC = () => {
  const { colorMode } = useColorMode()

  return (
    <DashboardLayout pageTitle="Budget">
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
            Gestion du budget
          </Text>
          <Text 
            fontSize="sm" 
            color={colorMode === 'dark' ? 'gray.500' : 'gray.600'}
            fontWeight="500"
          >
            Suivez vos dépenses et optimisez votre allocation budgétaire
          </Text>
        </Box>

        {/* Budget Summary */}
        <Grid
          templateColumns={{ base: '1fr', md: '1fr 1fr' }}
          gap="6"
        >
          <StatCard 
            title="Budget total" 
            value="12 000 €" 
            icon="📊"
            trend="2 mois"
            trendColor="orange"
          />
          <StatCard 
            title="Budget restant" 
            value="3 800 €" 
            icon="✅"
            trend="32%"
            trendColor="green"
          />
        </Grid>

        {/* Budget Categories */}
        <Box>
          <Text 
            fontSize="lg" 
            fontWeight="700" 
            mb="6" 
            color={colorMode === 'dark' ? 'gray.100' : 'gray.900'}
            letterSpacing="-0.3px"
          >
            Répartition par catégorie
          </Text>
          <Grid
            templateColumns={{ base: '1fr', md: '1fr 1fr' }}
            gap="6"
          >
            <ProgressCard
              title="Alimentation & Restaurants"
              category="800 € alloués"
              planned="800 €"
              spent="650 €"
              percentage={81}
            />
            <ProgressCard
              title="Transport"
              category="400 € alloués"
              planned="400 €"
              spent="280 €"
              percentage={70}
            />
            <ProgressCard
              title="Divertissement"
              category="300 € alloués"
              planned="300 €"
              spent="245 €"
              percentage={82}
            />
            <ProgressCard
              title="Shopping"
              category="500 € alloués"
              planned="500 €"
              spent="350 €"
              percentage={70}
            />
            <ProgressCard
              title="Santé & Forme"
              category="200 € alloués"
              planned="200 €"
              spent="180 €"
              percentage={90}
            />
            <ProgressCard
              title="Factures & Services"
              category="1 500 € alloués"
              planned="1 500 €"
              spent="1 450 €"
              percentage={97}
            />
          </Grid>
        </Box>
      </VStack>
    </DashboardLayout>
  )
}
