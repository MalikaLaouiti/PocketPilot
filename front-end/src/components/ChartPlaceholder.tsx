import React from 'react'
import { Box, Text, VStack, useColorMode } from '@chakra-ui/react'

interface ChartPlaceholderProps {
  title: string
  type: 'line' | 'pie' | 'bar'
  height?: string
}

export const ChartPlaceholder: React.FC<ChartPlaceholderProps> = ({
  title,
  type,
  height = '300px',
}) => {
  const { colorMode } = useColorMode()

  const getPlaceholderBg = () => {
    switch (type) {
      case 'line':
        return colorMode === 'dark' ? '#2a2540' : '#e8ddf3'
      case 'pie':
        return colorMode === 'dark' ? '#2a2540' : '#f2e8f8'
      case 'bar':
        return colorMode === 'dark' ? '#2a2540' : '#dff7f0'
      default:
        return colorMode === 'dark' ? '#2a2540' : '#f5f1fa'
    }
  }

  const getChartIcon = () => {
    switch (type) {
      case 'line':
        return '📈'
      case 'pie':
        return '🥧'
      case 'bar':
        return '📊'
      default:
        return '📊'
    }
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
      h={height}
      display="flex"
      flexDirection="column"
      transition="all 0.3s ease"
    >
      <Text 
        fontSize="sm" 
        fontWeight="700" 
        mb="4" 
        color={colorMode === 'dark' ? 'gray.100' : 'gray.900'}
        letterSpacing="-0.3px"
      >
        {title}
      </Text>

      <VStack
        flex="1"
        justify="center"
        align="center"
        bg={getPlaceholderBg()}
        borderRadius="10px"
        spacing="2"
        border="1px dashed"
        borderColor={colorMode === 'dark' ? '#3a3850' : '#d5c3e8'}
      >
        <Text fontSize="3xl">
          {getChartIcon()}
        </Text>
        <Text 
          fontSize="sm" 
          fontWeight="600"
          color={colorMode === 'dark' ? 'brand.300' : 'brand.600'}
        >
          Graphique {type}
        </Text>
        <Text 
          fontSize="xs" 
          color={colorMode === 'dark' ? 'gray.500' : 'gray.600'}
          fontWeight="500"
        >
          Données en cours de chargement...
        </Text>
      </VStack>
    </Box>
  )
}
