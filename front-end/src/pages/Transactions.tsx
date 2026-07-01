import React, { useState } from 'react'
import {
  VStack,
  HStack,
  Input,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Box,
  Text,
  useColorMode,
  InputGroup,
  InputLeftElement
} from '@chakra-ui/react'
import { SearchIcon } from '@chakra-ui/icons'
import { DashboardLayout } from '../layouts/DashboardLayout'
import { useTransactionsByCompte } from '../hooks/useTransactions'
import { LoadingSkeleton } from '../components/LoadingSkeleton'


export const Transactions: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const { colorMode } = useColorMode()
  const { data, isLoading, isError, error } = useTransactionsByCompte('547d84b0-6537-4b85-951d-f6b111acc9e5')
  console.log({ data, isLoading, isError, error })
  
  if (isLoading) {
    return (
      <DashboardLayout pageTitle="Transactions">
        <LoadingSkeleton count={4} type="table"/>
      </DashboardLayout>
    )
  }
  if (!data || isError){
    return  (
      <DashboardLayout pageTitle="Transactions"> 
        <Text color="red.500">Erreur de chargement des transactions</Text>
      </DashboardLayout>)
  }
  const filteredTransactions = data.filter((t) =>
    t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.categorie.toLowerCase().includes(searchTerm.toLowerCase())
  )
  return (
    <DashboardLayout pageTitle="Transactions">
      
      <VStack spacing="6" align="stretch">
        {/* Header */}
        <Box>
          <Text 
            fontSize="2xl" 
            fontWeight="700" 
            color={colorMode === 'dark' ? 'gray.100' : 'gray.900'}
            mb="2"
            letterSpacing="-0.5px"
          >
            Historique des transactions
          </Text>
          <Text 
            fontSize="sm" 
            color={colorMode === 'dark' ? 'gray.500' : 'gray.600'}
            fontWeight="500"
          >
            Consultez toutes vos transactions récentes
          </Text>
        </Box>

        {/* Filters and Actions */}
        <HStack spacing="4" justify="space-between" flexWrap={{ base: 'wrap', md: 'nowrap' }}>
          <InputGroup maxW={{ base: 'full', md: '350px' }}>
            <InputLeftElement pointerEvents="none">
              <SearchIcon color="brand.400" />
            </InputLeftElement>
            <Input
              placeholder="Rechercher une transaction..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              fontSize="sm"
              fontWeight="500"
              borderRadius="10px"
              borderColor={colorMode === 'dark' ? '#2a2540' : '#e8e4f1'}
              _focus={{
                borderColor: 'brand.500',
                boxShadow: '0 0 0 3px rgba(117, 106, 182, 0.1)',
              }}
            />
          </InputGroup>

          <HStack spacing="2" w={{ base: 'full', md: 'auto' }}>
            <Button 
              variant="outline" 
              flex={{ base: 1, md: 'auto' }}
              fontSize="sm"
              fontWeight="600"
              borderColor={colorMode === 'dark' ? '#2a2540' : '#e8e4f1'}
              borderRadius="10px"
              color="brand.500"
            >
              Filtrer
            </Button>
          </HStack>
        </HStack>

        {/* Transactions Table */}
        <Box
          overflowX="auto"
          bg={colorMode === 'dark' ? '#1a1828' : '#ffffff'}
          borderRadius="14px"
          boxShadow={colorMode === 'dark' 
            ? '0 2px 8px rgba(0, 0, 0, 0.3)'
            : '0 2px 8px rgba(0, 0, 0, 0.06)'}
          border="1px"
          borderColor={colorMode === 'dark' ? '#2a2540' : '#e8e4f1'}
          overflow="hidden"
        >
          <Table variant="simple">
            <Thead
              bg={colorMode === 'dark' ? '#0f0d17' : '#f8f7fb'}
              borderBottom="1px"
              borderBottomColor={colorMode === 'dark' ? '#2a2540' : '#e8e4f1'}
            >
              <Tr>
                <Th 
                  fontSize="xs"
                  fontWeight="700"
                  color={colorMode === 'dark' ? 'gray.400' : 'gray.700'}
                  letterSpacing="0.5px"
                  px="6"
                  py="4"
                  textTransform="uppercase"
                >
                  Date
                </Th>
                <Th 
                  fontSize="xs"
                  fontWeight="700"
                  color={colorMode === 'dark' ? 'gray.400' : 'gray.700'}
                  letterSpacing="0.5px"
                  px="6"
                  py="4"
                  textTransform="uppercase"
                >
                  Description
                </Th>
                <Th 
                  fontSize="xs"
                  fontWeight="700"
                  color={colorMode === 'dark' ? 'gray.400' : 'gray.700'}
                  letterSpacing="0.5px"
                  px="6"
                  py="4"
                  textTransform="uppercase"
                >
                  Catégorie
                </Th>
                <Th 
                  isNumeric
                  fontSize="xs"
                  fontWeight="700"
                  color={colorMode === 'dark' ? 'gray.400' : 'gray.700'}
                  letterSpacing="0.5px"
                  px="6"
                  py="4"
                  textTransform="uppercase"
                >
                  Montant
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredTransactions.map((transaction) => (
                <Tr
                  key={transaction.idTransaction}
                  borderBottom="1px"
                  borderBottomColor={colorMode === 'dark' ? '#2a2540' : '#e8e4f1'}
                  _hover={{
                    bg: colorMode === 'dark' ? '#1a1828' : '#f8f7fb',
                    transition: 'background-color 0.2s ease',
                  }}
                  _last={{ borderBottom: 'none' }}
                >
                  <Td fontSize="sm" fontWeight="500" px="6" py="4" color={colorMode === 'dark' ? 'gray.300' : 'gray.700'}>
                    {new Date(transaction.dateTransaction).toLocaleString('fr-FR', {weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit'})}
                  </Td>
                  <Td fontSize="sm" fontWeight="600" px="6" py="4" color={colorMode === 'dark' ? 'gray.100' : 'gray.900'}>
                    {transaction.description}
                  </Td>
                  <Td 
                    fontSize="sm" 
                    fontWeight="500"
                    px="6" 
                    py="4"
                    color={colorMode === 'dark' ? 'gray.500' : 'gray.600'}
                  >
                    <Box
                      px="2"
                      py="1"
                      borderRadius="6px"
                      bg={colorMode === 'dark' ? '#2a2540' : '#f5f1fa'}
                      display="inline-block"
                    >
                      {transaction.categorie}
                    </Box>
                  </Td>
                  <Td
                    isNumeric
                    fontWeight="700"
                    fontSize="sm"
                    px="6"
                    py="4"
                    color={transaction.typeTransaction === 'REVENU' ? 'success.500' : 'accent.500'}
                  >
                    {transaction.montant} TND
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </VStack>
    </DashboardLayout>
  )
}
