import React from 'react'
import { VStack, HStack, Box, Text, Avatar, Badge, Button } from '@chakra-ui/react'
import { useColorMode } from '@chakra-ui/react'

interface ProfileHeaderProps {
  firstName: string
  lastName: string
  email: string
  isEditing: boolean
  onEditToggle: () => void
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  firstName,
  lastName,
  email,
  isEditing,
  onEditToggle,
}) => {
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
      borderColor={colorMode === 'dark' ? '#2a2540' : '#e8e4f1'}
    >
      <VStack spacing="6" align="stretch">
        <HStack spacing="6" align="flex-start" justify="space-between">
          <HStack spacing="4" align="flex-start" flex="1">
            <Avatar
              size="2xl"
              name={`${firstName} ${lastName}`}
              src={`https://api.dicebear.com/7.x/initials/svg?seed=${firstName}${lastName}`}
            />
            <VStack align="flex-start" spacing="2">
              <Text 
                fontSize="xl" 
                fontWeight="700"
                color={colorMode === 'dark' ? 'gray.100' : 'gray.900'}
                letterSpacing="-0.3px"
              >
                {firstName} {lastName}
              </Text>
              <Text 
                fontSize="sm" 
                color={colorMode === 'dark' ? 'gray.500' : 'gray.600'}
                fontWeight="500"
              >
                {email}
              </Text>
              <HStack spacing="2">
                <Badge colorScheme="brand" fontSize="xs" fontWeight="700">
                  Utilisateur vérifié
                </Badge>
                <Badge colorScheme="success" fontSize="xs" fontWeight="700">
                  Compte actif
                </Badge>
              </HStack>
            </VStack>
          </HStack>
          <Button
            colorScheme="brand"
            variant={isEditing ? 'outline' : 'solid'}
            onClick={onEditToggle}
            fontWeight="600"
            borderRadius="10px"
            fontSize="sm"
          >
            {isEditing ? 'Enregistrer' : 'Modifier'}
          </Button>
        </HStack>
      </VStack>
    </Box>
  )
}