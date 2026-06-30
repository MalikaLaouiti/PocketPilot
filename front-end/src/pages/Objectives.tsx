import React from 'react'
import {
  Grid,
  VStack,
  Box,
  Text,
  Button,
  HStack,
  Badge,
  Progress,
  useColorMode,
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { DashboardLayout } from '../layouts/DashboardLayout'

interface Objective {
  id: string
  title: string
  targetAmount: string
  currentAmount: string
  percentage: number
  priority: 'high' | 'medium' | 'low'
}

const mockObjectives: Objective[] = [
  {
    id: '1',
    title: 'Emergency Fund',
    targetAmount: '$10,000',
    currentAmount: '$7,200',
    percentage: 72,
    priority: 'high',
  },
  {
    id: '2',
    title: 'Vacation',
    targetAmount: '$5,000',
    currentAmount: '$2,850',
    percentage: 57,
    priority: 'medium',
  },
  {
    id: '3',
    title: 'Home Renovation',
    targetAmount: '$20,000',
    currentAmount: '$8,400',
    percentage: 42,
    priority: 'medium',
  },
  {
    id: '4',
    title: 'Car Down Payment',
    targetAmount: '$15,000',
    currentAmount: '$5,100',
    percentage: 34,
    priority: 'high',
  },
  {
    id: '5',
    title: 'Education Fund',
    targetAmount: '$30,000',
    currentAmount: '$12,000',
    percentage: 40,
    priority: 'low',
  },
  {
    id: '6',
    title: 'Retirement Savings',
    targetAmount: '$100,000',
    currentAmount: '$45,300',
    percentage: 45,
    priority: 'high',
  },
]

export const Objectives: React.FC = () => {
  const navigate = useNavigate()
  const { colorMode } = useColorMode()

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'accent'
      case 'medium':
        return 'orange'
      case 'low':
        return 'brand'
      default:
        return 'gray'
    }
  }

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'Prioritaire'
      case 'medium':
        return 'Moyen'
      case 'low':
        return 'Faible'
      default:
        return priority
    }
  }

  return (
    <DashboardLayout pageTitle="Objectifs financiers">
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
            Vos objectifs financiers
          </Text>
          <Text 
            fontSize="sm" 
            color={colorMode === 'dark' ? 'gray.500' : 'gray.600'}
            fontWeight="500"
          >
            Suivez votre progression vers vos objectifs d&apos;épargne
          </Text>
        </Box>

        <Grid
          templateColumns={{ base: '1fr', md: '1fr 1fr', lg: '1fr 1fr 1fr' }}
          gap="6"
        >
          {mockObjectives.map((objective) => (
            <Box
              key={objective.id}
              bg={colorMode === 'dark' ? '#1a1828' : '#ffffff'}
              p="6"
              borderRadius="14px"
              boxShadow={colorMode === 'dark' 
                ? '0 2px 8px rgba(0, 0, 0, 0.3)'
                : '0 2px 8px rgba(0, 0, 0, 0.06)'}
              border="1px solid"
              borderColor={colorMode === 'dark' ? '#2a2540' : '#e8e4f1'}
              display="flex"
              flexDirection="column"
              transition="all 0.3s ease"
              _hover={{
                transform: 'translateY(-4px)',
                boxShadow: colorMode === 'dark' 
                  ? '0 8px 16px rgba(117, 106, 182, 0.2)'
                  : '0 8px 16px rgba(117, 106, 182, 0.15)',
              }}
            >
              <VStack align="flex-start" spacing="4" flex="1">
                <HStack justify="space-between" w="full">
                  <Text 
                    fontSize="md" 
                    fontWeight="700" 
                    color={colorMode === 'dark' ? 'gray.100' : 'gray.900'}
                    letterSpacing="-0.3px"
                  >
                    {objective.title}
                  </Text>
                  <Badge
                    colorScheme={getPriorityColor(objective.priority)}
                    fontSize="xs"
                    fontWeight="700"
                    px="2"
                    py="1"
                    borderRadius="6px"
                    textTransform="none"
                  >
                    {getPriorityLabel(objective.priority)}
                  </Badge>
                </HStack>

                <VStack align="flex-start" spacing="3" w="full">
                  <HStack justify="space-between" w="full" fontSize="sm" fontWeight="500">
                    <Text color={colorMode === 'dark' ? 'gray.500' : 'gray.600'}>
                      {objective.currentAmount} / {objective.targetAmount}
                    </Text>
                    <Text 
                      fontWeight="700" 
                      color="brand.500"
                      fontSize="sm"
                    >
                      {objective.percentage}%
                    </Text>
                  </HStack>
                  <Progress
                    value={objective.percentage}
                    w="full"
                    colorScheme="brand"
                    borderRadius="full"
                    h="2.5"
                  />
                </VStack>
              </VStack>

              <Button
                mt="6"
                colorScheme="brand"
                variant="solid"
                size="sm"
                w="full"
                onClick={() => navigate(`/objectives/plan`)}
                fontWeight="600"
                borderRadius="10px"
                transition="all 0.3s ease"
              >
                Voir le plan
              </Button>
            </Box>
          ))}
        </Grid>
      </VStack>
    </DashboardLayout>
  )
}
