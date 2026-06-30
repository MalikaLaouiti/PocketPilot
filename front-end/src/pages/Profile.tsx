import React, { useState } from 'react'
import {
  VStack,
  HStack,
  Grid,
  Box,
  Text,
  Button,
  Input,
  FormControl,
  FormLabel,
  Avatar,
  Divider,
  useColorMode,
  Badge,
  Switch,
  Select,
  Textarea,
} from '@chakra-ui/react'
import { DashboardLayout } from '../layouts/DashboardLayout'

export const Profile: React.FC = () => {
  const { colorMode } = useColorMode()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    firstName: 'Jean',
    lastName: 'Dupont',
    email: 'jean.dupont@example.com',
    phone: '+33 6 12 34 56 78',
    country: 'France',
    currency: 'EUR',
    language: 'FR',
    bio: 'Passionate about personal finance management',
    notifications: true,
    twoFactor: false,
    newsletter: true,
  })

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSave = () => {
    setIsEditing(false)
  }

  const getCardBg = () => colorMode === 'dark' ? '#1a1828' : '#ffffff'
  const getCardBorder = () => colorMode === 'dark' ? '#2a2540' : '#e8e4f1'
  const getCardShadow = () => colorMode === 'dark' 
    ? '0 2px 8px rgba(0, 0, 0, 0.3)'
    : '0 2px 8px rgba(0, 0, 0, 0.06)'

  return (
    <DashboardLayout pageTitle="Mon profil">
      <VStack spacing="8" align="stretch" maxW="4xl">
        {/* Header */}
        <Box>
          <Text 
            fontSize="2xl" 
            fontWeight="700" 
            color={colorMode === 'dark' ? 'gray.100' : 'gray.900'}
            mb="2"
            letterSpacing="-0.5px"
          >
            Profil utilisateur
          </Text>
          <Text 
            fontSize="sm" 
            color={colorMode === 'dark' ? 'gray.500' : 'gray.600'}
            fontWeight="500"
          >
            Gérez vos informations personnelles et vos préférences
          </Text>
        </Box>

        {/* Profile Header Card */}
        <Box
          bg={getCardBg()}
          p="8"
          borderRadius="14px"
          boxShadow={getCardShadow()}
          border="1px solid"
          borderColor={getCardBorder()}
        >
          <VStack spacing="6" align="stretch">
            <HStack spacing="6" align="flex-start" justify="space-between">
              <HStack spacing="4" align="flex-start" flex="1">
                <Avatar
                  size="2xl"
                  name={`${formData.firstName} ${formData.lastName}`}
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=User"
                />
                <VStack align="flex-start" spacing="2">
                  <Text 
                    fontSize="xl" 
                    fontWeight="700"
                    color={colorMode === 'dark' ? 'gray.100' : 'gray.900'}
                    letterSpacing="-0.3px"
                  >
                    {formData.firstName} {formData.lastName}
                  </Text>
                  <Text 
                    fontSize="sm" 
                    color={colorMode === 'dark' ? 'gray.500' : 'gray.600'}
                    fontWeight="500"
                  >
                    {formData.email}
                  </Text>
                  <HStack spacing="2">
                    <Badge colorScheme="brand" fontSize="xs" fontWeight="700">
                      Utilisateur vérifiée
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
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                fontWeight="600"
                borderRadius="10px"
                fontSize="sm"
              >
                {isEditing ? 'Enregistrer' : 'Modifier'}
              </Button>
            </HStack>
          </VStack>
        </Box>

        {/* Personal Information */}
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
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
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
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
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
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
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
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
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
                  Pays
                </FormLabel>
                <Input
                  value={formData.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
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
                  Devise préférée
                </FormLabel>
                <Select
                  value={formData.currency}
                  onChange={(e) => handleInputChange('currency', e.target.value)}
                  isDisabled={!isEditing}
                  fontSize="sm"
                  fontWeight="500"
                  borderRadius="10px"
                  borderColor={colorMode === 'dark' ? '#2a2540' : '#e8e4f1'}
                  bg={!isEditing ? (colorMode === 'dark' ? '#0f0d17' : '#f8f7fb') : undefined}
                  _focus={{
                    borderColor: 'brand.500',
                    boxShadow: '0 0 0 3px rgba(117, 106, 182, 0.1)',
                  }}
                >
                  <option value="EUR">EUR - Euro</option>
                  <option value="USD">USD - Dollar</option>
                  <option value="GBP">GBP - Livre sterling</option>
                  <option value="CHF">CHF - Franc suisse</option>
                </Select>
              </FormControl>
            </Grid>

            <FormControl>
              <FormLabel fontSize="sm" fontWeight="600" mb="2">
                Biographie
              </FormLabel>
              <Textarea
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                isReadOnly={!isEditing}
                fontSize="sm"
                fontWeight="500"
                borderRadius="10px"
                borderColor={colorMode === 'dark' ? '#2a2540' : '#e8e4f1'}
                bg={!isEditing ? (colorMode === 'dark' ? '#0f0d17' : '#f8f7fb') : undefined}
                minH="100px"
                _focus={{
                  borderColor: 'brand.500',
                  boxShadow: '0 0 0 3px rgba(117, 106, 182, 0.1)',
                }}
              />
            </FormControl>
          </VStack>
        </Box>

        {/* Preferences */}
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

            <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap="6">
              <FormControl display="flex" alignItems="center" justifyContent="space-between">
                <FormLabel fontSize="sm" fontWeight="600" mb="0">
                  Langue
                </FormLabel>
                <Select
                  value={formData.language}
                  onChange={(e) => handleInputChange('language', e.target.value)}
                  maxW="120px"
                  fontSize="sm"
                  fontWeight="500"
                  borderRadius="10px"
                  borderColor={colorMode === 'dark' ? '#2a2540' : '#e8e4f1'}
                >
                  <option value="FR">Français</option>
                  <option value="EN">English</option>
                  <option value="DE">Deutsch</option>
                  <option value="ES">Español</option>
                </Select>
              </FormControl>
            </Grid>

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
                  isChecked={formData.notifications}
                  onChange={(e) => handleInputChange('notifications', e.target.checked)}
                  colorScheme="brand"
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
                  isChecked={formData.twoFactor}
                  onChange={(e) => handleInputChange('twoFactor', e.target.checked)}
                  colorScheme="brand"
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
                  isChecked={formData.newsletter}
                  onChange={(e) => handleInputChange('newsletter', e.target.checked)}
                  colorScheme="brand"
                />
              </HStack>
            </VStack>
          </VStack>
        </Box>

        {/* Danger Zone */}
        <Box
          bg={colorMode === 'dark' ? '#1a1828' : '#ffffff'}
          p="8"
          borderRadius="14px"
          boxShadow={getCardShadow()}
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
      </VStack>
    </DashboardLayout>
  )
}
