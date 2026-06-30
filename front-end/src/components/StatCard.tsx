import React from 'react'
import { Box, Text, VStack, HStack, useColorMode } from '@chakra-ui/react'

interface StatCardProps {
  title: string
  value: string
  icon?: React.ReactNode
  bgColor?: string
  trend?: string
  trendColor?: 'green' | 'red' | 'orange'
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  bgColor,
  trend,
  trendColor = 'green',
}) => {
  const { colorMode } = useColorMode()

  return (
    <Box
      bg={bgColor || (colorMode === 'dark' ? '#1a1828' : '#ffffff')}
      p="6"
      borderRadius="14px"
      boxShadow={colorMode === 'dark' 
        ? '0 2px 8px rgba(0, 0, 0, 0.3)'
        : '0 2px 8px rgba(0, 0, 0, 0.06)'}
      border="1px solid"
      borderColor={colorMode === 'dark' ? '#2a2540' : '#e8e4f1'}
      transition="all 0.3s ease"
      _hover={{
        transform: 'translateY(-4px)',
        boxShadow: colorMode === 'dark' 
          ? '0 8px 16px rgba(117, 106, 182, 0.2)'
          : '0 8px 16px rgba(117, 106, 182, 0.15)',
      }}
    >
      <VStack align="flex-start" spacing="3" h="full">
        <HStack justify="space-between" w="full">
          {icon && (
            <Box 
              fontSize="2xl"
              p="3"
              borderRadius="10px"
              bg={colorMode === 'dark' ? 'brand.900' : 'brand.50'}
            >
              {icon}
            </Box>
          )}
          {trend && (
            <Text 
              fontSize="xs" 
              fontWeight="600"
              color={`${trendColor}.500`}
              bg={colorMode === 'dark' 
                ? `${trendColor}.900` 
                : `${trendColor}.50`}
              px="2"
              py="1"
              borderRadius="6px"
            >
              {trend}
            </Text>
          )}
        </HStack>
        <Text 
          fontSize="sm" 
          fontWeight="500"
          color={colorMode === 'dark' ? 'gray.400' : 'gray.600'}
          letterSpacing="0.5px"
        >
          {title}
        </Text>
        <Text 
          fontSize="2.5xl" 
          fontWeight="bold" 
          color="brand.500"
          letterSpacing="-0.5px"
        >
          {value}
        </Text>
      </VStack>
    </Box>
  )
}
