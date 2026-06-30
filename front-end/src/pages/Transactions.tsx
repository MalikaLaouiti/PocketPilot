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
  InputLeftElement,
} from '@chakra-ui/react'
import { SearchIcon } from '@chakra-ui/icons'
import { DashboardLayout } from '../layouts/DashboardLayout'

interface Transaction {
  id: string
  date: string
  description: string
  category: string
  amount: string
  type: 'income' | 'expense'
}

const mockTransactions: Transaction[] = [
  {
    id: '1',
    date: '2024-06-28',
    description: 'Salary Deposit',
    category: 'Income',
    amount: '+$5,000',
    type: 'income',
  },
  {
    id: '2',
    date: '2024-06-28',
    description: 'Grocery Store',
    category: 'Food',
    amount: '-$85.50',
    type: 'expense',
  },
  {
    id: '3',
    date: '2024-06-27',
    description: 'Gas Station',
    category: 'Transportation',
    amount: '-$45.00',
    type: 'expense',
  },
  {
    id: '4',
    date: '2024-06-27',
    description: 'Restaurant',
    category: 'Dining',
    amount: '-$62.30',
    type: 'expense',
  },
  {
    id: '5',
    date: '2024-06-26',
    description: 'Netflix Subscription',
    category: 'Entertainment',
    amount: '-$15.99',
    type: 'expense',
  },
  {
    id: '6',
    date: '2024-06-26',
    description: 'Freelance Payment',
    category: 'Income',
    amount: '+$800',
    type: 'income',
  },
  {
    id: '7',
    date: '2024-06-25',
    description: 'Gym Membership',
    category: 'Health',
    amount: '-$60',
    type: 'expense',
  },
  {
    id: '8',
    date: '2024-06-25',
    description: 'Online Shopping',
    category: 'Shopping',
    amount: '-$120.75',
    type: 'expense',
  },
]

export const Transactions: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const { colorMode } = useColorMode()

  const filteredTransactions = mockTransactions.filter((t) =>
    t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.category.toLowerCase().includes(searchTerm.toLowerCase())
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
            <Button 
              colorScheme="brand" 
              flex={{ base: 1, md: 'auto' }}
              fontSize="sm"
              fontWeight="600"
              borderRadius="10px"
            >
              Nouvelle transaction
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
              {filteredTransactions.map((transaction, index) => (
                <Tr
                  key={transaction.id}
                  borderBottom="1px"
                  borderBottomColor={colorMode === 'dark' ? '#2a2540' : '#e8e4f1'}
                  _hover={{
                    bg: colorMode === 'dark' ? '#1a1828' : '#f8f7fb',
                    transition: 'background-color 0.2s ease',
                  }}
                  _last={{ borderBottom: 'none' }}
                >
                  <Td fontSize="sm" fontWeight="500" px="6" py="4" color={colorMode === 'dark' ? 'gray.300' : 'gray.700'}>
                    {transaction.date}
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
                      {transaction.category}
                    </Box>
                  </Td>
                  <Td
                    isNumeric
                    fontWeight="700"
                    fontSize="sm"
                    px="6"
                    py="4"
                    color={transaction.type === 'income' ? 'success.500' : 'accent.500'}
                  >
                    {transaction.amount}
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
