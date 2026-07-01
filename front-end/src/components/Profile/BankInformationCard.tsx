import React from 'react'
import { VStack, Box, Text, Grid, FormControl, FormLabel, Input } from '@chakra-ui/react'
import { useColorMode } from '@chakra-ui/react'


interface BankInformationCardProps {
  compte: {
    rib: string
    iban: string
    typeCompte: string
    soldeActuel: number
    devise: string
    dateOuverture: string
    statut: string
    plafondRetraitJournalier: number
  }
}

export const BankInformationCard: React.FC<BankInformationCardProps> = ({ compte }) => {
  const { colorMode } = useColorMode()

  const getCardBg = () => colorMode === 'dark' ? '#1a1828' : '#ffffff'
  const getCardBorder = () => colorMode === 'dark' ? '#2a2540' : '#e8e4f1'
  const getCardShadow = () => colorMode === 'dark' 
    ? '0 2px 8px rgba(0, 0, 0, 0.3)'
    : '0 2px 8px rgba(0, 0, 0, 0.06)'

//   const getStatusColor = (statut: string) => {
//     switch(statut?.toLowerCase()) {
//       case 'actif': return 'success'
//       case 'suspendu': return 'warning'
//       case 'fermé': return 'error'
//       default: return 'gray'
//     }
//   }

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
          Informations bancaires
        </Text>

        <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap="6">
          <FormControl>
            <FormLabel fontSize="sm" fontWeight="600" mb="2">
              RIB
            </FormLabel>
            <Input
              value={compte.rib || ''}
              isReadOnly
              fontSize="sm"
              fontWeight="500"
              borderRadius="10px"
              borderColor={colorMode === 'dark' ? '#2a2540' : '#e8e4f1'}
              bg={colorMode === 'dark' ? '#0f0d17' : '#f8f7fb'}
              fontFamily="monospace"
            />
          </FormControl>

          <FormControl>
            <FormLabel fontSize="sm" fontWeight="600" mb="2">
              IBAN
            </FormLabel>
            <Input
              value={compte.iban || ''}
              isReadOnly
              fontSize="sm"
              fontWeight="500"
              borderRadius="10px"
              borderColor={colorMode === 'dark' ? '#2a2540' : '#e8e4f1'}
              bg={colorMode === 'dark' ? '#0f0d17' : '#f8f7fb'}
              fontFamily="monospace"
            />
          </FormControl>

          <FormControl>
            <FormLabel fontSize="sm" fontWeight="600" mb="2">
              Type de compte
            </FormLabel>
            <Input
              value={compte.typeCompte || ''}
              isReadOnly
              fontSize="sm"
              fontWeight="500"
              borderRadius="10px"
              borderColor={colorMode === 'dark' ? '#2a2540' : '#e8e4f1'}
              bg={colorMode === 'dark' ? '#0f0d17' : '#f8f7fb'}
            />
          </FormControl>

          <FormControl>
            <FormLabel fontSize="sm" fontWeight="600" mb="2">
              Solde actuel
            </FormLabel>
            <Input
              value={`${compte.soldeActuel?.toFixed(2) || '0.00'} ${compte.devise || 'TND'} `}
              isReadOnly
              fontSize="sm"
              fontWeight="600"
              borderRadius="10px"
              borderColor={colorMode === 'dark' ? '#2a2540' : '#e8e4f1'}
              bg={colorMode === 'dark' ? '#0f0d17' : '#f8f7fb'}
              color="brand.500"
            />
          </FormControl>

          <FormControl>
            <FormLabel fontSize="sm" fontWeight="600" mb="2">
              Date d'ouverture
            </FormLabel>
            <Input
              value={new Date(compte.dateOuverture).toLocaleDateString() || ''}
              isReadOnly
              fontSize="sm"
              fontWeight="500"
              borderRadius="10px"
              borderColor={colorMode === 'dark' ? '#2a2540' : '#e8e4f1'}
              bg={colorMode === 'dark' ? '#0f0d17' : '#f8f7fb'}
            />
          </FormControl>

          <FormControl>
            <FormLabel fontSize="sm" fontWeight="600" mb="2">
              Statut
            </FormLabel>
            <Input
              value={compte.statut || ''}
              isReadOnly
              fontSize="sm"
              fontWeight="500"
              borderRadius="10px"
              borderColor={colorMode === 'dark' ? '#2a2540' : '#e8e4f1'}
              bg={colorMode === 'dark' ? '#0f0d17' : '#f8f7fb'}
            />
          </FormControl>

          <FormControl>
            <FormLabel fontSize="sm" fontWeight="600" mb="2">
              Plafond retrait journalier
            </FormLabel>
            <Input
              value={`${compte.plafondRetraitJournalier?.toFixed(2) || '0.00'} ${compte.devise || 'TND'}`}
              isReadOnly
              fontSize="sm"
              fontWeight="500"
              borderRadius="10px"
              borderColor={colorMode === 'dark' ? '#2a2540' : '#e8e4f1'}
              bg={colorMode === 'dark' ? '#0f0d17' : '#f8f7fb'}
            />
          </FormControl>
        </Grid>
      </VStack>
    </Box>
  )
}