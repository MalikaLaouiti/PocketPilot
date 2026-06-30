import React from 'react'
import {
  VStack,
  Grid,
  Box,
  Text,
  HStack,
  useColorMode,
} from '@chakra-ui/react'
import { ChevronDownIcon } from '@chakra-ui/icons'
import { DashboardLayout } from '../layouts/DashboardLayout'
import { StatCard } from '../components/StatCard'

interface TimelineStep {
  title: string
  description: string
  icon: string
}

const timelineSteps: TimelineStep[] = [
  {
    title: 'Budget actuel',
    description: 'Votre budget mensuel actuel et vos habitudes de dépenses',
    icon: '💵',
  },
  {
    title: 'Optimisation',
    description: 'Domaines où vous pouvez réduire les dépenses inutiles',
    icon: '⚙️',
  },
  {
    title: 'Augmentation de l\'épargne',
    description: 'Augmentation attendue de votre épargne mensuelle',
    icon: '📈',
  },
  {
    title: 'Objectif atteint',
    description: 'Votre objectif financier est maintenant à portée',
    icon: '🎯',
  },
]

export const ObjectivePlan: React.FC = () => {
  const { colorMode } = useColorMode()

  return (
    <DashboardLayout pageTitle="Planification financière">
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
            Plan financier personnalisé
          </Text>
          <Text 
            fontSize="sm" 
            color={colorMode === 'dark' ? 'gray.500' : 'gray.600'}
            fontWeight="500"
          >
            Découvrez comment atteindre vos objectifs d&apos;épargne
          </Text>
        </Box>

        {/* Objective Summary */}
        <Grid
          templateColumns={{ base: '1fr', md: '1fr 1fr 1fr' }}
          gap="6"
        >
          <StatCard 
            title="Montant cible" 
            value="10 000 €" 
            icon="🎯"
            trend="3/10"
            trendColor="orange"
          />
          <StatCard 
            title="Épargne actuelle" 
            value="7 200 €" 
            icon="💰"
            trend="72%"
            trendColor="green"
          />
          <StatCard 
            title="Délai" 
            value="8 mois" 
            icon="⏱️"
            trend="8 mois"
            trendColor="orange"
          />
        </Grid>

        {/* Recommendations */}
        <Box>
          <Text 
            fontSize="lg" 
            fontWeight="700" 
            mb="6" 
            color={colorMode === 'dark' ? 'gray.100' : 'gray.900'}
            letterSpacing="-0.3px"
          >
            Recommandations personnalisées
          </Text>
          <Grid
            templateColumns={{ base: '1fr', md: '1fr 1fr', lg: '1fr 1fr 1fr' }}
            gap="6"
          >
            <Box
              bg={colorMode === 'dark' ? '#1a1828' : '#ffffff'}
              p="6"
              borderRadius="14px"
              boxShadow={colorMode === 'dark' 
                ? '0 2px 8px rgba(0, 0, 0, 0.3)'
                : '0 2px 8px rgba(0, 0, 0, 0.06)'}
              border="1px solid"
              borderColor={colorMode === 'dark' ? '#2a2540' : '#e8e4f1'}
              transition="all 0.3s ease"
              _hover={{
                transform: 'translateY(-2px)',
                boxShadow: colorMode === 'dark' 
                  ? '0 6px 12px rgba(0, 0, 0, 0.4)'
                  : '0 6px 12px rgba(117, 106, 182, 0.1)',
              }}
            >
              <VStack align="flex-start" spacing="3">
                <Text fontSize="3xl">🛍️</Text>
                <Text fontWeight="700" color={colorMode === 'dark' ? 'gray.100' : 'gray.900'}>
                  Réduire le shopping
                </Text>
                <Text fontSize="sm" color={colorMode === 'dark' ? 'gray.400' : 'gray.600'} fontWeight="500">
                  Réduisez vos dépenses de shopping discrétionnaires de 20% pour économiser 100 €/mois
                </Text>
              </VStack>
            </Box>

            <Box
              bg={colorMode === 'dark' ? '#1a1828' : '#ffffff'}
              p="6"
              borderRadius="14px"
              boxShadow={colorMode === 'dark' 
                ? '0 2px 8px rgba(0, 0, 0, 0.3)'
                : '0 2px 8px rgba(0, 0, 0, 0.06)'}
              border="1px solid"
              borderColor={colorMode === 'dark' ? '#2a2540' : '#e8e4f1'}
              transition="all 0.3s ease"
              _hover={{
                transform: 'translateY(-2px)',
                boxShadow: colorMode === 'dark' 
                  ? '0 6px 12px rgba(0, 0, 0, 0.4)'
                  : '0 6px 12px rgba(117, 106, 182, 0.1)',
              }}
            >
              <VStack align="flex-start" spacing="3">
                <Text fontSize="3xl">🎬</Text>
                <Text fontWeight="700" color={colorMode === 'dark' ? 'gray.100' : 'gray.900'}>
                  Réduire les divertissements
                </Text>
                <Text fontSize="sm" color={colorMode === 'dark' ? 'gray.400' : 'gray.600'} fontWeight="500">
                  Limitez les loisirs et les repas au restaurant pour économiser 80 €/mois
                </Text>
              </VStack>
            </Box>

            <Box
              bg={colorMode === 'dark' ? '#1a1828' : '#ffffff'}
              p="6"
              borderRadius="14px"
              boxShadow={colorMode === 'dark' 
                ? '0 2px 8px rgba(0, 0, 0, 0.3)'
                : '0 2px 8px rgba(0, 0, 0, 0.06)'}
              border="1px solid"
              borderColor={colorMode === 'dark' ? '#2a2540' : '#e8e4f1'}
              transition="all 0.3s ease"
              _hover={{
                transform: 'translateY(-2px)',
                boxShadow: colorMode === 'dark' 
                  ? '0 6px 12px rgba(0, 0, 0, 0.4)'
                  : '0 6px 12px rgba(117, 106, 182, 0.1)',
              }}
            >
              <VStack align="flex-start" spacing="3">
                <Text fontSize="3xl">📊</Text>
                <Text fontWeight="700" color={colorMode === 'dark' ? 'gray.100' : 'gray.900'}>
                  Augmenter l&apos;épargne
                </Text>
                <Text fontSize="sm" color={colorMode === 'dark' ? 'gray.400' : 'gray.600'} fontWeight="500">
                  Allouez 180 € supplémentaires par mois pour atteindre votre objectif plus rapidement
                </Text>
              </VStack>
            </Box>
          </Grid>
        </Box>

        {/* Timeline */}
        <Box>
          <Text 
            fontSize="lg" 
            fontWeight="700" 
            mb="6" 
            color={colorMode === 'dark' ? 'gray.100' : 'gray.900'}
            letterSpacing="-0.3px"
          >
            Chronologie de votre épargne
          </Text>
          <VStack spacing="4" align="stretch">
            {timelineSteps.map((step, index) => (
              <React.Fragment key={index}>
                <Box
                  bg={colorMode === 'dark' ? '#1a1828' : '#ffffff'}
                  p="6"
                  borderRadius="14px"
                  boxShadow={colorMode === 'dark' 
                    ? '0 2px 8px rgba(0, 0, 0, 0.3)'
                    : '0 2px 8px rgba(0, 0, 0, 0.06)'}
                  border="1px solid"
                  borderColor={colorMode === 'dark' ? '#2a2540' : '#e8e4f1'}
                  transition="all 0.3s ease"
                  _hover={{
                    borderColor: 'brand.500',
                    boxShadow: colorMode === 'dark' 
                      ? '0 4px 12px rgba(117, 106, 182, 0.2)'
                      : '0 4px 12px rgba(117, 106, 182, 0.15)',
                  }}
                >
                  <HStack spacing="4" align="flex-start">
                    <Box
                      w="12"
                      h="12"
                      borderRadius="full"
                      background="linear-gradient(135deg, #756ab6 0%, #ac87c5 100%)"
                      color="white"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      fontSize="xl"
                      flexShrink={0}
                      boxShadow="0 4px 12px rgba(117, 106, 182, 0.3)"
                    >
                      {step.icon}
                    </Box>
                    <VStack align="flex-start" spacing="2" flex="1">
                      <Text 
                        fontWeight="700" 
                        color={colorMode === 'dark' ? 'gray.100' : 'gray.900'}
                        letterSpacing="-0.3px"
                      >
                        {step.title}
                      </Text>
                      <Text fontSize="sm" color={colorMode === 'dark' ? 'gray.500' : 'gray.600'} fontWeight="500">
                        {step.description}
                      </Text>
                    </VStack>
                  </HStack>
                </Box>

                {index < timelineSteps.length - 1 && (
                  <HStack justify="center" py="2">
                    <ChevronDownIcon 
                      color="brand.400" 
                      boxSize="5"
                      opacity="0.6"
                    />
                  </HStack>
                )}
              </React.Fragment>
            ))}
          </VStack>
        </Box>
      </VStack>
    </DashboardLayout>
  )
}
