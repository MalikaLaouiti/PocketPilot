import React from 'react'
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { Box, Text, VStack, HStack, useColorMode } from '@chakra-ui/react'
import type { Transaction } from '../types/transaction'

interface CategoryExpenseChartProps {
  transactions: Transaction[]
}

const COLORS = [
  '#3182CE', '#E53E3E', '#38A169', '#D69E2E', '#805AD5',
  '#DD6B20', '#319795', '#D53F8C', '#718096', '#00B5D8',
]

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'TND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)

export const CategoryExpenseChart: React.FC<CategoryExpenseChartProps> = ({ transactions }) => {
  const { colorMode } = useColorMode()

  const { data, total } = React.useMemo(() => {
    const depenses = transactions.filter(t => t.typeTransaction === 'DEPENSE')
    const total = depenses.reduce((sum, t) => sum + Math.abs(t.montant), 0)

    const byCategorie = depenses.reduce<Record<string, number>>((acc, t) => {
      const cat = t.categorie || 'Autre'
      acc[cat] = (acc[cat] || 0) + Math.abs(t.montant)
      return acc
    }, {})

    const data = Object.entries(byCategorie)
      .map(([categorie, montant]) => ({
        name: categorie,
        value: montant,
        percent: total > 0 ? (montant / total) * 100 : 0,
      }))
      .sort((a, b) => b.value - a.value)

    return { data, total }
  }, [transactions])

  if (data.length === 0) {
    return (
      <Box
        bg={colorMode === 'dark' ? 'gray.800' : 'white'}
        borderRadius="xl"
        p="6"
        borderWidth="1px"
        borderColor={colorMode === 'dark' ? 'gray.700' : 'gray.200'}
        textAlign="center"
      >
        <Text color="gray.500">Aucune dépense à afficher</Text>
      </Box>
    )
  }

  return (
    <Box
      bg={colorMode === 'dark' ? 'gray.800' : 'white'}
      borderRadius="xl"
      p="6"
      borderWidth="1px"
      borderColor={colorMode === 'dark' ? 'gray.700' : 'gray.200'}
    >
      <Text fontSize="lg" fontWeight="600" mb="1">
        Répartition des dépenses par catégorie
      </Text>
      <Text fontSize="sm" color="gray.500" mb="4">
        Total : {formatCurrency(total)}
      </Text>

      <HStack align="center" spacing="6" flexWrap="wrap">
        <Box flex="1" minW="260px" h="300px">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                label={({ percent }) => `${percent?.toFixed(0)}%`}
                labelLine={false}
              >
                {data.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(
                  value: number | string | readonly (string | number)[] | undefined,
                  name: string | number | undefined,
                ) => {
                  const numericValue = Array.isArray(value) ? Number(value[0] ?? 0) : Number(value ?? 0)
                  return [formatCurrency(numericValue), String(name ?? '')]
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Box>

        {/* Légende détaillée avec pourcentages */}
        <VStack align="stretch" flex="1" minW="220px" spacing="2">
          {data.map((entry, index) => (
            <HStack key={entry.name} justify="space-between">
              <HStack spacing="2">
                <Box w="10px" h="10px" borderRadius="full" bg={COLORS[index % COLORS.length]} />
                <Text fontSize="sm" noOfLines={1}>{entry.name}</Text>
              </HStack>
              <HStack spacing="3">
                <Text fontSize="sm" color="gray.500">{formatCurrency(entry.value)}</Text>
                <Text fontSize="sm" fontWeight="600" minW="45px" textAlign="right">
                  {entry.percent.toFixed(1)}%
                </Text>
              </HStack>
            </HStack>
          ))}
        </VStack>
      </HStack>
    </Box>
  )
}