import React from 'react'
import { Flex, VStack, Text, useColorMode } from '@chakra-ui/react'
import { motion } from 'framer-motion'

interface PageLoaderProps {
  message?: string
  variant?: 'spinner' | 'dots' | 'bars'
  fullScreen?: boolean
}

export const PageLoader: React.FC<PageLoaderProps> = ({
  message = 'Chargement...',
  variant = 'spinner',
  fullScreen = false,
}) => {
  const { colorMode } = useColorMode()

  const SpinnerVariant = () => (
    <motion.div
      style={{
        width: 48,
        height: 48,
        border: '3px solid',
        borderColor: colorMode === 'dark' ? '#2a2540' : '#e8e4f1',
        borderTopColor: '#756AB6',
        borderRadius: '50%',
      }}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, linear: true }}
    />
  )

  const DotsVariant = () => (
    <Flex gap="2">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          style={{
            width: 12,
            height: 12,
            borderRadius: '50%',
            backgroundColor: '#756AB6',
          }}
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{
            duration: 1.4,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}
    </Flex>
  )

  const BarsVariant = () => (
    <Flex gap="1">
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          style={{
            width: 4,
            height: 32,
            borderRadius: '2px',
            backgroundColor: '#756AB6',
          }}
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            delay: i * 0.15,
          }}
        />
      ))}
    </Flex>
  )

  const renderVariant = () => {
    switch (variant) {
      case 'dots':
        return <DotsVariant />
      case 'bars':
        return <BarsVariant />
      case 'spinner':
      default:
        return <SpinnerVariant />
    }
  }

  if (fullScreen) {
    return (
      <Flex
        position="fixed"
        top="0"
        left="0"
        right="0"
        bottom="0"
        bg={colorMode === 'dark' ? '#0f0d17' : '#f8f7fb'}
        align="center"
        justify="center"
        zIndex="50"
        css={{ position: 'fixed' }}
      >
        <VStack spacing="6">
          {renderVariant()}
          <Text
            color={colorMode === 'dark' ? 'gray.400' : 'gray.600'}
            fontWeight="500"
            fontSize="sm"
          >
            {message}
          </Text>
        </VStack>
      </Flex>
    )
  }

  return (
    <VStack
      spacing="6"
      p="12"
      align="center"
      justify="center"
      minH="400px"
      bg={colorMode === 'dark' ? '#0f0d17' : '#f8f7fb'}
      borderRadius="14px"
    >
      {renderVariant()}
      <Text
        color={colorMode === 'dark' ? 'gray.400' : 'gray.600'}
        fontWeight="500"
        fontSize="sm"
      >
        {message}
      </Text>
    </VStack>
  )
}
