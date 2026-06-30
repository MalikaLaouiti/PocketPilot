import React, { useState } from 'react'
import {
  Box,
  Flex,
  VStack,
  HStack,
  Text,
  Button,
  useColorMode,
  Drawer,
  DrawerBody,
  DrawerOverlay,
  DrawerContent,
  useDisclosure,
  IconButton,
  Avatar,
  Image ,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react'
import { MoonIcon, SunIcon, HamburgerIcon, BellIcon } from '@chakra-ui/icons'
import { Link, useLocation } from 'react-router-dom'

interface NavItem {
  label: string
  path: string
  frenchLabel: string
}

const navItems: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard', frenchLabel: 'Tableau de bord' },
  { label: 'Transactions', path: '/transactions', frenchLabel: 'Transactions' },
  { label: 'Analysis', path: '/analysis', frenchLabel: 'Analyse' },
  { label: 'Budget', path: '/budget', frenchLabel: 'Budget' },
  { label: 'Objectives', path: '/objectives', frenchLabel: 'Objectifs' },
]

interface DashboardLayoutProps {
  pageTitle: string
  children: React.ReactNode
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  pageTitle,
  children,
}) => {
  const { colorMode, toggleColorMode } = useColorMode()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  const Sidebar = () => (
    <VStack
      bg={colorMode === 'dark' ? '#1a1828' : '#ffffff'}
      h="full"
      p="6"
      spacing="8"
      borderRight="1px"
      borderRightColor={colorMode === 'dark' ? '#2a2540' : '#e8e4f1'}
      align="stretch"
    >
      <Box pb="4" borderBottom="1px" borderBottomColor={colorMode === 'dark' ? '#2a2540' : '#e8e4f1'}>
        
          <Image
            src="\logo-bankerise-01.png"
            alt="PocketPilot icon"
            boxSize="85px"
          />
          <Text
            fontSize="2xl"
            fontWeight="bold"
            background="linear-gradient(135deg, #756ab6 0%, #ac87c5 100%)"
            backgroundClip="text"
            color="transparent"
          >
            PocketPilot
          </Text>
        
      </Box>

      <VStack spacing="2" align="stretch" flex="1">
        {navItems.map((item) => (
          <Link key={item.path} to={item.path} style={{ textDecoration: 'none' }}>
            <Button
              w="full"
              variant={isActive(item.path) ? 'solid' : 'ghost'}
              colorScheme={isActive(item.path) ? 'brand' : 'gray'}
              justifyContent="flex-start"
              fontSize="sm"
              fontWeight="600"
              borderRadius="10px"
              transition="all 0.3s ease"
              bg={isActive(item.path)
                ? 'brand.500'
                : colorMode === 'dark' ? 'transparent' : 'transparent'}
              color={isActive(item.path)
                ? 'white'
                : colorMode === 'dark' ? 'gray.400' : 'gray.700'}
              _hover={{
                bg: isActive(item.path)
                  ? 'brand.600'
                  : colorMode === 'dark' ? '#2a2540' : '#f5f1fa',
                color: isActive(item.path) ? 'white' : 'brand.600',
              }}
            >
              {item.frenchLabel}
            </Button>
          </Link>
        ))}
      </VStack>
    </VStack>
  )

  return (
    <Flex h="100vh" bg={colorMode === 'dark' ? 'gray.900' : 'gray.50'}>
      {/* Desktop Sidebar */}
      <Box
        display={{ base: 'none', lg: 'block' }}
        w="250px"
        overflowY="auto"
      >
        <Sidebar />
      </Box>

      {/* Mobile Sidebar */}
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent bg={colorMode === 'dark' ? 'gray.800' : 'white'}>
          <DrawerBody p="0">
            <Sidebar />
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Main Content */}
      <Flex direction="column" flex="1" overflowY="auto">
        {/* Navbar */}
        <Flex
          bg={colorMode === 'dark' ? '#1a1828' : '#ffffff'}
          borderBottom="1px"
          borderBottomColor={colorMode === 'dark' ? '#2a2540' : '#e8e4f1'}
          p="4"
          align="center"
          justify="space-between"
          sticky
          top="0"
          zIndex="10"
          transition="all 0.3s ease"
        >
          <HStack spacing="4" flex="1">
            <IconButton
              display={{ base: 'flex', lg: 'none' }}
              icon={<HamburgerIcon />}
              aria-label="Ouvrir le menu"
              onClick={onOpen}
              variant="ghost"
              _hover={{ bg: colorMode === 'dark' ? '#2a2540' : '#f5f1fa' }}
            />
            <Text
              fontSize="lg"
              fontWeight="700"
              color={colorMode === 'dark' ? 'gray.100' : 'gray.900'}
              letterSpacing="-0.5px"
            >
              {pageTitle}
            </Text>
          </HStack>

          <HStack spacing="3">
            <IconButton
              icon={<BellIcon />}
              aria-label="Notifications"
              variant="ghost"
              position="relative"
              _hover={{ bg: colorMode === 'dark' ? '#2a2540' : '#f5f1fa' }}
            >
              <Box
                position="absolute"
                top="1"
                right="1"
                w="2"
                h="2"
                bg="accent.500"
                borderRadius="full"
                boxShadow="0 0 8px rgba(224, 174, 208, 0.6)"
              />
            </IconButton>

            <IconButton
              icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
              aria-label="Activer le thème"
              onClick={toggleColorMode}
              variant="ghost"
              _hover={{ bg: colorMode === 'dark' ? '#2a2540' : '#f5f1fa' }}
            />

            <Menu>
              <MenuButton>
                <Avatar
                  size="sm"
                  name="User"
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=User"
                  cursor="pointer"
                  transition="transform 0.3s ease"
                  _hover={{ transform: 'scale(1.05)' }}
                />
              </MenuButton>
              <MenuList
                bg={colorMode === 'dark' ? '#1a1828' : '#ffffff'}
                borderColor={colorMode === 'dark' ? '#2a2540' : '#e8e4f1'}
              >
                <Link to="/profile" style={{ textDecoration: 'none' }}>
                  <MenuItem fontSize="sm" fontWeight="500">Profil</MenuItem>
                </Link>
                <MenuItem fontSize="sm" fontWeight="500">Paramètres</MenuItem>
                <MenuItem fontSize="sm" fontWeight="500">Déconnexion</MenuItem>
              </MenuList>
            </Menu>
          </HStack>
        </Flex>

        {/* Page Content */}
        <Box
          p={{ base: '4', lg: '8' }}
          flex="1"
          overflowY="auto"
          bg={colorMode === 'dark' ? '#0f0d17' : '#f8f7fb'}
        >
          {children}
        </Box>
      </Flex>
    </Flex>
  )
}
