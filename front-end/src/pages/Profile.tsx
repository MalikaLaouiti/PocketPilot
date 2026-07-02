import React, { useState, useEffect } from 'react'
import { VStack, Box, Text } from '@chakra-ui/react'
import { useColorMode } from '@chakra-ui/react'
import { useCompteActif } from '../context/CompteContext'
import { DashboardLayout } from '../layouts/DashboardLayout'
import { DangerZoneCard } from '../components/Profile/DangerZoneCard'
import { BankInformationCard } from '../components/Profile/BankInformationCard'
import { PersonalInformationCard } from '../components/Profile/PersonalInformationCard'
import { ProfileHeader } from '../components/Profile/ProfileHeader'
import { useUpdateClient } from '../hooks/mutations/useClientMutation'
export const Profile: React.FC = () => {
  const { colorMode } = useColorMode()
  const { compte, isLoading } = useCompteActif()
  const [isEditing, setIsEditing] = useState(false)

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    profession: '',
    language: 'FR',
    notifications: true,
    twoFactor: false,
    newsletter: true,
  })

  useEffect(() => {
    if (compte?.client) {
      setFormData(prev => ({
        ...prev,
        firstName: compte.client.prenom || '',
        lastName: compte.client.nom || '',
        email: compte.client.email || '',
        phone: compte.client.telephone || '',
        address: compte.client.adresse || '',
        profession: compte.client.profession || '',
      }))
    }
  }, [compte])

  // ✅ Hook appelé inconditionnellement, à chaque render, avant tout `return`
  const { mutate: updateClient, isPending: isUpdating } = useUpdateClient(
    compte?.client.idClient ?? ''   // idClient vide tant que compte n'est pas chargé
  )

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleEditToggle = () => {
    if (!isEditing) {
      setIsEditing(true)
      return
    }

    updateClient(
      {
        nom: formData.lastName,
        prenom: formData.firstName,
        email: formData.email,
        telephone: formData.phone,
        adresse: formData.address,
        profession: formData.profession,
      },
      {
        onSuccess: () => setIsEditing(false),
        onError: (error) => console.error(error),
      }
    )
  }

  // ✅ Les `return` conditionnels arrivent APRÈS tous les hooks
  if (isLoading) {
    return (
      <DashboardLayout pageTitle="Mon profil">
        <Text>Chargement du profil...</Text>
      </DashboardLayout>
    )
  }

  if (!compte) {
    return (
      <DashboardLayout pageTitle="Mon profil">
        <Text>Aucun compte trouvé</Text>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout pageTitle="Mon profil">
      <VStack spacing="8" align="stretch" maxW="4xl">
        <Box>
          <Text fontSize="2xl" fontWeight="700" color={colorMode === 'dark' ? 'gray.100' : 'gray.900'} mb="2" letterSpacing="-0.5px">
            Profil utilisateur
          </Text>
          <Text fontSize="sm" color={colorMode === 'dark' ? 'gray.500' : 'gray.600'} fontWeight="500">
            Gérez vos informations personnelles et vos préférences
          </Text>
        </Box>

        <ProfileHeader
          firstName={formData.firstName}
          lastName={formData.lastName}
          email={formData.email}
          isEditing={isUpdating || isEditing}
          onEditToggle={handleEditToggle}
        />

        <PersonalInformationCard
          firstName={formData.firstName}
          lastName={formData.lastName}
          email={formData.email}
          phone={formData.phone}
          address={formData.address}
          profession={formData.profession}
          isEditing={isEditing}
          onInputChange={handleInputChange}
        />

        <BankInformationCard
          compte={{
            rib: compte.rib,
            iban: compte.iban,
            typeCompte: compte.typeCompte,
            soldeActuel: compte.soldeActuel,
            devise: compte.devise,
            dateOuverture: compte.dateOuverture,
            statut: compte.statut,
            plafondRetraitJournalier: compte.plafondRetraitJournalier,
          }}
        />

        <DangerZoneCard />
      </VStack>
    </DashboardLayout>
  )
}