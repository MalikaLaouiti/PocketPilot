import React from 'react'
import { VStack, Box, Text, Grid, FormControl, FormLabel, Input } from '@chakra-ui/react'
import { useColorMode } from '@chakra-ui/react'

interface PersonalInformationCardProps {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  profession: string
  isEditing: boolean
  onInputChange: (field: string, value: string) => void
}

export const PersonalInformationCard: React.FC<PersonalInformationCardProps> = ({
  firstName,
  lastName,
  email,
  phone,
  address,
  profession,
  isEditing,
  onInputChange,
}) => {
  const { colorMode } = useColorMode()

  const getCardBg = () => colorMode === 'dark' ? '#1a1828' : '#ffffff'
  const getCardBorder = () => colorMode === 'dark' ? '#2a2540' : '#e8e4f1'
  const getCardShadow = () => colorMode === 'dark' 
    ? '0 2px 8px rgba(0, 0, 0, 0.3)'
    : '0 2px 8px rgba(0, 0, 0, 0.06)'

  return (
    <Box
      bg={getCardBg()}
      p="8"
      borderRadius="14px"
      boxShadow={getCardShadow()}
      border="1px solid"
      borderColor={getCardBorder()}
    >
      <VStack align="stretch" spacing="6">
        <Text 
          fontSize="lg" 
          fontWeight="700"
          color={colorMode === 'dark' ? 'gray.100' : 'gray.900'}
          letterSpacing="-0.3px"
        >
          Informations personnelles
        </Text>

        <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap="6">
          <FormControl>
            <FormLabel fontSize="sm" fontWeight="600" mb="2">
              Prénom
            </FormLabel>
            <Input
              value={firstName}
              onChange={(e) => onInputChange('firstName', e.target.value)}
              isReadOnly={!isEditing}
              fontSize="sm"
              fontWeight="500"
              borderRadius="10px"
              borderColor={colorMode === 'dark' ? '#2a2540' : '#e8e4f1'}
              bg={!isEditing ? (colorMode === 'dark' ? '#0f0d17' : '#f8f7fb') : undefined}
              _focus={{
                borderColor: 'brand.500',
                boxShadow: '0 0 0 3px rgba(117, 106, 182, 0.1)',
              }}
            />
          </FormControl>

          <FormControl>
            <FormLabel fontSize="sm" fontWeight="600" mb="2">
              Nom
            </FormLabel>
            <Input
              value={lastName}
              onChange={(e) => onInputChange('lastName', e.target.value)}
              isReadOnly={!isEditing}
              fontSize="sm"
              fontWeight="500"
              borderRadius="10px"
              borderColor={colorMode === 'dark' ? '#2a2540' : '#e8e4f1'}
              bg={!isEditing ? (colorMode === 'dark' ? '#0f0d17' : '#f8f7fb') : undefined}
              _focus={{
                borderColor: 'brand.500',
                boxShadow: '0 0 0 3px rgba(117, 106, 182, 0.1)',
              }}
            />
          </FormControl>

          <FormControl>
            <FormLabel fontSize="sm" fontWeight="600" mb="2">
              Email
            </FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => onInputChange('email', e.target.value)}
              isReadOnly={!isEditing}
              fontSize="sm"
              fontWeight="500"
              borderRadius="10px"
              borderColor={colorMode === 'dark' ? '#2a2540' : '#e8e4f1'}
              bg={!isEditing ? (colorMode === 'dark' ? '#0f0d17' : '#f8f7fb') : undefined}
              _focus={{
                borderColor: 'brand.500',
                boxShadow: '0 0 0 3px rgba(117, 106, 182, 0.1)',
              }}
            />
          </FormControl>

          <FormControl>
            <FormLabel fontSize="sm" fontWeight="600" mb="2">
              Téléphone
            </FormLabel>
            <Input
              value={phone}
              onChange={(e) => onInputChange('phone', e.target.value)}
              isReadOnly={!isEditing}
              fontSize="sm"
              fontWeight="500"
              borderRadius="10px"
              borderColor={colorMode === 'dark' ? '#2a2540' : '#e8e4f1'}
              bg={!isEditing ? (colorMode === 'dark' ? '#0f0d17' : '#f8f7fb') : undefined}
              _focus={{
                borderColor: 'brand.500',
                boxShadow: '0 0 0 3px rgba(117, 106, 182, 0.1)',
              }}
            />
          </FormControl>

          <FormControl>
            <FormLabel fontSize="sm" fontWeight="600" mb="2">
              Adresse
            </FormLabel>
            <Input
              value={address}
              onChange={(e) => onInputChange('address', e.target.value)}
              isReadOnly={!isEditing}
              fontSize="sm"
              fontWeight="500"
              borderRadius="10px"
              borderColor={colorMode === 'dark' ? '#2a2540' : '#e8e4f1'}
              bg={!isEditing ? (colorMode === 'dark' ? '#0f0d17' : '#f8f7fb') : undefined}
              _focus={{
                borderColor: 'brand.500',
                boxShadow: '0 0 0 3px rgba(117, 106, 182, 0.1)',
              }}
            />
          </FormControl>

          <FormControl>
            <FormLabel fontSize="sm" fontWeight="600" mb="2">
              Profession
            </FormLabel>
            <Input
              value={profession}
              onChange={(e) => onInputChange('profession', e.target.value)}
              isReadOnly={!isEditing}
              fontSize="sm"
              fontWeight="500"
              borderRadius="10px"
              borderColor={colorMode === 'dark' ? '#2a2540' : '#e8e4f1'}
              bg={!isEditing ? (colorMode === 'dark' ? '#0f0d17' : '#f8f7fb') : undefined}
              _focus={{
                borderColor: 'brand.500',
                boxShadow: '0 0 0 3px rgba(117, 106, 182, 0.1)',
              }}
            />
          </FormControl>
        </Grid>
      </VStack>
    </Box>
  )
}