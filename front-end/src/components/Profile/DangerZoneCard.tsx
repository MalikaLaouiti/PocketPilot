import React from 'react'
import { VStack, Box, Text, HStack, Button } from '@chakra-ui/react'
import { useColorMode } from '@chakra-ui/react'

export const DangerZoneCard: React.FC = () => {
  const { colorMode } = useColorMode()

  return (
    <Box
      bg={colorMode === 'dark' ? '#1a1828' : '#ffffff'}
      p="8"
      borderRadius="14px"
      boxShadow={colorMode === 'dark' 
        ? '0 2px 8px rgba(0, 0, 0, 0.3)'
        : '0 2px 8px rgba(0, 0, 0, 0.06)'}
      border="1px solid"
      borderColor="accent.500"
    >
      <VStack align="stretch" spacing="4">
        <Text 
          fontSize="lg" 
          fontWeight="700"
          color="accent.500"
          letterSpacing="-0.3px"
        >
          Zone dangereuse
        </Text>

        <Text fontSize="sm" color={colorMode === 'dark' ? 'gray.500' : 'gray.600'} fontWeight="500">
          Ces actions sont irréversibles. Veuillez être prudent.
        </Text>

        <HStack spacing="3">
          <Button
            variant="outline"
            colorScheme="orange"
            fontWeight="600"
            borderRadius="10px"
            fontSize="sm"
          >
            Réinitialiser le mot de passe
          </Button>
          <Button
            variant="outline"
            colorScheme="accent"
            fontWeight="600"
            borderRadius="10px"
            fontSize="sm"
          >
            Supprimer le compte
          </Button>
        </HStack>
      </VStack>
    </Box>
  )
}