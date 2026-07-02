import React from 'react'
import { Box, HStack, VStack, Text, CircularProgress, CircularProgressLabel, Badge, useColorMode, Grid } from '@chakra-ui/react'
import { NIVEAU_SCORE_CONFIG } from '../types/constants/scoreEnums'
import type { ScoreSante } from '../types/scoreSante'

interface ScoreSanteCardProps {
  score: ScoreSante
}

const MOIS_LABELS = ['', 'Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc']

export const ScoreSanteCard: React.FC<ScoreSanteCardProps> = ({ score }) => {
  const { colorMode } = useColorMode()
  const config = NIVEAU_SCORE_CONFIG[score.niveau]
 console.log('ScoreSanteCard - score:', score)
  const sousIndicateurs = [
    { label: 'Épargne', value: score.tauxCapaciteEpargne },
    { label: 'Progression Objectifs', value: score.tauxProgressionObjectifs, inverse: true },
    { label: 'Respect budget', value: score.tauxDisciplineBudgetaire },
    { label: 'Stabilité revenu', value: score.tauxRegulariteRevenus }
  ]

  return (
    <Box
      position="relative"
      overflow="hidden"
      bg={colorMode === 'dark' ? '#1a1828' : '#ffffff'}
      p="6"
      borderRadius="16px"
      boxShadow={colorMode === 'dark' ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.06)'}
      border="1px solid"
      borderColor={colorMode === 'dark' ? '#2a2540' : '#e8e4f1'}
    >
      <Box
        position="absolute"
        top="-40%"
        right="-10%"
        w="220px"
        h="220px"
        borderRadius="full"
        bg={`${config.colorScheme}.400`}
        opacity="0.08"
        filter="blur(10px)"
      />

      <Grid templateColumns={{ base: '1fr', md: 'auto 1fr' }} gap="6" alignItems="center">
        <VStack spacing="2">
          <CircularProgress
            value={score.scoreGlobal}
            size="140px"
            thickness="10px"
            color={`${config.colorScheme}.400`}
            trackColor={colorMode === 'dark' ? 'whiteAlpha.100' : 'gray.100'}
            capIsRound
          >
            <CircularProgressLabel>
              <Text fontSize="2xl" fontWeight="800">{score.scoreGlobal}</Text>
              <Text fontSize="0.65rem" color="gray.500">/100</Text>
            </CircularProgressLabel>
          </CircularProgress>
          <Badge colorScheme={config.colorScheme} px="3" py="1" borderRadius="8px" fontSize="0.75rem">
            {config.label}
          </Badge>
        </VStack>

        <VStack align="stretch" spacing="4">
          <HStack justify="space-between">
            <Text fontWeight="700" fontSize="lg" color={colorMode === 'dark' ? 'gray.100' : 'gray.900'}>
              Score de santé financière
            </Text>
            <Text fontSize="xs" color="gray.500">
              {MOIS_LABELS[score.mois]} {score.annee}
            </Text>
          </HStack>

          <Grid templateColumns="repeat(2, 1fr)" gap="3">
            {sousIndicateurs.map((ind) => {
              const pct = Math.round(ind.value * 100)
              const good = ind.inverse ? pct <= 30 : pct >= 60
              return (
                <Box key={ind.label} bg={colorMode === 'dark' ? 'whiteAlpha.50' : 'gray.50'} p="3" borderRadius="10px">
                  <HStack justify="space-between" mb="1">
                    <Text fontSize="xs" color="gray.500">{ind.label}</Text>
                    <Text fontSize="xs" fontWeight="700" color={good ? 'green.500' : 'orange.500'}>{pct}%</Text>
                  </HStack>
                  <Box w="full" h="4px" bg={colorMode === 'dark' ? 'whiteAlpha.200' : 'gray.200'} borderRadius="full" overflow="hidden">
                    <Box h="full" w={`${pct}%`} bg={good ? 'green.400' : 'orange.400'} />
                  </Box>
                </Box>
              )
            })}
          </Grid>
        </VStack>
      </Grid>
    </Box>
  )
}