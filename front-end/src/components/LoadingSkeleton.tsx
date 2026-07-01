import React from 'react'
import { Box, Skeleton, VStack, HStack, useColorMode } from '@chakra-ui/react'

interface LoadingSkeletonProps {
  count?: number
  type?: 'card' | 'chart' | 'table' | 'list'
}

const SkeletonCard: React.FC = () => {
  const { colorMode } = useColorMode()

  return (
    <Box
      bg={colorMode === 'dark' ? '#1a1828' : '#ffffff'}
      p="6"
      borderRadius="14px"
      border="1px solid"
      borderColor={colorMode === 'dark' ? '#2a2540' : '#e8e4f1'}
    >
      <VStack spacing="3" align="stretch">
        <HStack spacing="3">
          <Skeleton
            height="12"
            width="12"
            borderRadius="10px"
            startColor={colorMode === 'dark' ? '#2a2540' : '#e8e4f1'}
            endColor={colorMode === 'dark' ? '#3a3850' : '#f0edf7'}
          />
          <Skeleton
            height="6"
            width="100px"
            startColor={colorMode === 'dark' ? '#2a2540' : '#e8e4f1'}
            endColor={colorMode === 'dark' ? '#3a3850' : '#f0edf7'}
          />
        </HStack>
        <Skeleton
          height="8"
          startColor={colorMode === 'dark' ? '#2a2540' : '#e8e4f1'}
          endColor={colorMode === 'dark' ? '#3a3850' : '#f0edf7'}
        />
        <Skeleton
          height="6"
          width="80%"
          startColor={colorMode === 'dark' ? '#2a2540' : '#e8e4f1'}
          endColor={colorMode === 'dark' ? '#3a3850' : '#f0edf7'}
        />
      </VStack>
    </Box>
  )
}

const SkeletonChart: React.FC = () => {
  const { colorMode } = useColorMode()

  return (
    <Box
      bg={colorMode === 'dark' ? '#1a1828' : '#ffffff'}
      p="6"
      borderRadius="14px"
      border="1px solid"
      borderColor={colorMode === 'dark' ? '#2a2540' : '#e8e4f1'}
    >
      <VStack spacing="4" align="stretch">
        <Skeleton
          height="6"
          width="150px"
          startColor={colorMode === 'dark' ? '#2a2540' : '#e8e4f1'}
          endColor={colorMode === 'dark' ? '#3a3850' : '#f0edf7'}
        />
        <Box h="300px">
          <VStack spacing="2" h="full" justify="flex-end">
            {[...Array(4)].map((_, i) => (
              <Skeleton
                key={i}
                height={`${20 + i * 15}px`}
                width="100%"
                startColor={colorMode === 'dark' ? '#2a2540' : '#e8e4f1'}
                endColor={colorMode === 'dark' ? '#3a3850' : '#f0edf7'}
              />
            ))}
          </VStack>
        </Box>
      </VStack>
    </Box>
  )
}

const SkeletonTable: React.FC = () => {
  const { colorMode } = useColorMode()

  return (
    <Box
      bg={colorMode === 'dark' ? '#1a1828' : '#ffffff'}
      borderRadius="14px"
      border="1px solid"
      borderColor={colorMode === 'dark' ? '#2a2540' : '#e8e4f1'}
      overflow="hidden"
    >
      <VStack spacing="0" align="stretch">
        {/* Header */}
        <HStack
          p="6"
          borderBottom="1px"
          borderColor={colorMode === 'dark' ? '#2a2540' : '#e8e4f1'}
          spacing="4"
        >
          {[...Array(4)].map((_, i) => (
            <Skeleton
              key={i}
              height="5"
              flex="1"
              startColor={colorMode === 'dark' ? '#2a2540' : '#e8e4f1'}
              endColor={colorMode === 'dark' ? '#3a3850' : '#f0edf7'}
            />
          ))}
        </HStack>
        {/* Rows */}
        {[...Array(5)].map((_, rowIdx) => (
          <HStack
            key={rowIdx}
            p="6"
            borderBottom={rowIdx < 4 ? '1px' : 'none'}
            borderColor={colorMode === 'dark' ? '#2a2540' : '#e8e4f1'}
            spacing="4"
          >
            {[...Array(4)].map((_, colIdx) => (
              <Skeleton
                key={colIdx}
                height="4"
                flex="1"
                startColor={colorMode === 'dark' ? '#2a2540' : '#e8e4f1'}
                endColor={colorMode === 'dark' ? '#3a3850' : '#f0edf7'}
              />
            ))}
          </HStack>
        ))}
      </VStack>
    </Box>
  )
}

const SkeletonList: React.FC = () => {
  const { colorMode } = useColorMode()

  return (
    <VStack spacing="4" align="stretch">
      {[...Array(3)].map((_, i) => (
        <Box
          key={i}
          bg={colorMode === 'dark' ? '#1a1828' : '#ffffff'}
          p="5"
          borderRadius="14px"
          border="1px solid"
          borderColor={colorMode === 'dark' ? '#2a2540' : '#e8e4f1'}
        >
          <VStack spacing="3" align="stretch">
            <Skeleton
              height="5"
              width="60%"
              startColor={colorMode === 'dark' ? '#2a2540' : '#e8e4f1'}
              endColor={colorMode === 'dark' ? '#3a3850' : '#f0edf7'}
            />
            <Skeleton
              height="4"
              width="100%"
              startColor={colorMode === 'dark' ? '#2a2540' : '#e8e4f1'}
              endColor={colorMode === 'dark' ? '#3a3850' : '#f0edf7'}
            />
            <Skeleton
              height="4"
              width="90%"
              startColor={colorMode === 'dark' ? '#2a2540' : '#e8e4f1'}
              endColor={colorMode === 'dark' ? '#3a3850' : '#f0edf7'}
            />
          </VStack>
        </Box>
      ))}
    </VStack>
  )
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  count = 1,
  type = 'card',
}) => {
  const renderSkeleton = () => {
    switch (type) {
      case 'chart':
        return <SkeletonChart />
      case 'table':
        return <SkeletonTable />
      case 'list':
        return <SkeletonList />
      case 'card':
      default:
        return (
          <Box>
            {[...Array(count)].map((_, i) => (
              <Box key={i} mb={i < count - 1 ? '4' : '0'}>
                <SkeletonCard />
              </Box>
            ))}
          </Box>
        )
    }
  }

  return renderSkeleton()
}
