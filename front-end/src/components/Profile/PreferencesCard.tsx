import React from 'react'
import { VStack, Box, Text, HStack, Divider, Switch, Select } from '@chakra-ui/react'
import { useColorMode } from '@chakra-ui/react'

interface PreferencesCardProps {
  language: string
  notifications: boolean
  twoFactor: boolean
  newsletter: boolean
  isEditing?: boolean
  onInputChange: (field: string, value: string | boolean) => void
}

export const PreferencesCard: React.FC<PreferencesCardProps> = ({
  language,
  notifications,
  twoFactor,
  newsletter,
  isEditing = true,
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
          Préférences
        </Text>

        <HStack spacing="6" justify="space-between">
          <Text fontSize="sm" fontWeight="600">
            Langue
          </Text>
          <Select
            value={language}
            onChange={(e) => onInputChange('language', e.target.value)}
            maxW="120px"
            fontSize="sm"
            fontWeight="500"
            borderRadius="10px"
            borderColor={colorMode === 'dark' ? '#2a2540' : '#e8e4f1'}
            isDisabled={!isEditing}
          >
            <option value="FR">Français</option>
            <option value="EN">English</option>
            <option value="DE">Deutsch</option>
            <option value="ES">Español</option>
          </Select>
        </HStack>

        <Divider borderColor={colorMode === 'dark' ? '#2a2540' : '#e8e4f1'} />

        <VStack align="stretch" spacing="4">
          <HStack justify="space-between">
            <VStack align="flex-start" spacing="1">
              <Text fontSize="sm" fontWeight="600" color={colorMode === 'dark' ? 'gray.100' : 'gray.900'}>
                Notifications par email
              </Text>
              <Text fontSize="xs" color={colorMode === 'dark' ? 'gray.500' : 'gray.600'}>
                Recevez les mises à jour importantes
              </Text>
            </VStack>
            <Switch
              isChecked={notifications}
              onChange={(e) => onInputChange('notifications', e.target.checked)}
              colorScheme="brand"
              isDisabled={!isEditing}
            />
          </HStack>

          <HStack justify="space-between">
            <VStack align="flex-start" spacing="1">
              <Text fontSize="sm" fontWeight="600" color={colorMode === 'dark' ? 'gray.100' : 'gray.900'}>
                Authentification à deux facteurs
              </Text>
              <Text fontSize="xs" color={colorMode === 'dark' ? 'gray.500' : 'gray.600'}>
                Sécurité renforcée de votre compte
              </Text>
            </VStack>
            <Switch
              isChecked={twoFactor}
              onChange={(e) => onInputChange('twoFactor', e.target.checked)}
              colorScheme="brand"
              isDisabled={!isEditing}
            />
          </HStack>

          <HStack justify="space-between">
            <VStack align="flex-start" spacing="1">
              <Text fontSize="sm" fontWeight="600" color={colorMode === 'dark' ? 'gray.100' : 'gray.900'}>
                Newsletter
              </Text>
              <Text fontSize="xs" color={colorMode === 'dark' ? 'gray.500' : 'gray.600'}>
                Conseils financiers et actualités
              </Text>
            </VStack>
            <Switch
              isChecked={newsletter}
              onChange={(e) => onInputChange('newsletter', e.target.checked)}
              colorScheme="brand"
              isDisabled={!isEditing}
            />
          </HStack>
        </VStack>
      </VStack>
    </Box>
  )
}