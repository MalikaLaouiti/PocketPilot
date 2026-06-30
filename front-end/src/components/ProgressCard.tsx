import React from 'react'
import { Box, Text, VStack, Progress, HStack, useColorMode } from '@chakra-ui/react'

interface ProgressCardProps {
  title: string
  planned: string
  spent: string
  percentage: number
  category?: string
}

export const ProgressCard: React.FC<ProgressCardProps> = ({
  title,
  planned,
  spent,
  percentage,
  category,
}) => {
  const { colorMode } = useColorMode()
  
  const getProgressColor = (percent: number) => {
    if (percent >= 95) return 'red'
    if (percent >= 80) return 'orange'
    return 'brand'
  }

  return (
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
      <VStack align="flex-start" spacing="4">
        <HStack justify="space-between" w="full">
          <VStack align="flex-start" spacing="1">
            <Text 
              fontSize="sm" 
              fontWeight="600" 
              color={colorMode === 'dark' ? 'gray.100' : 'gray.900'}
            >
              {title}
            </Text>
            {category && (
              <Text 
                fontSize="xs" 
                fontWeight="500"
                color={colorMode === 'dark' ? 'gray.500' : 'gray.500'}
                letterSpacing="0.3px"
              >
                {category}
              </Text>
            )}
          </VStack>
          <Box
            fontSize="sm" 
            fontWeight="700" 
            color={`${getProgressColor(percentage)}.500`}
            bg={colorMode === 'dark' 
              ? `${getProgressColor(percentage)}.900` 
              : `${getProgressColor(percentage)}.50`}
            px="2.5"
            py="1"
            borderRadius="8px"
            textAlign="center"
          >
            {percentage}%
          </Box>
        </HStack>

        <Box w="full">
          <Progress
            value={percentage}
            w="full"
            colorScheme={getProgressColor(percentage)}
            borderRadius="full"
            h="2.5"
            hasStripe={percentage > 80}
            isAnimated={percentage > 80}
          />
        </Box>

        <HStack justify="space-between" w="full" fontSize="xs" fontWeight="500">
          <Text color={colorMode === 'dark' ? 'gray.500' : 'gray.600'}>
            Prévu: {planned}
          </Text>
          <Text color={colorMode === 'dark' ? 'gray.400' : 'gray.700'}>
            Dépensé: {spent}
          </Text>
        </HStack>
      </VStack>
    </Box>
  )
}
