import { extendTheme } from '@chakra-ui/react'

const theme = extendTheme({
  colors: {
    brand: {
      50: '#f5f1fa',
      100: '#e8ddf3',
      200: '#d5c3e8',
      300: '#b8a0d4',
      400: '#9477c5',
      500: '#756ab6',
      600: '#6a5fa8',
      700: '#5c5494',
      800: '#4e4980',
      900: '#3d3860',
    },
    secondary: {
      50: '#faf6fd',
      100: '#f2e8f8',
      200: '#e6d3f1',
      300: '#d4b3e6',
      400: '#bb8dd8',
      500: '#ac87c5',
      600: '#9e76b3',
      700: '#8b639d',
      800: '#785088',
      900: '#603d70',
    },
    accent: {
      50: '#ffe5f1',
      100: '#ffc9dd',
      200: '#ffadce',
      300: '#ff9acd',
      400: '#e0aed0',
      500: '#d989bb',
      600: '#c96fa6',
      700: '#b85491',
      800: '#a03d7d',
      900: '#8a2c6a',
    },
    success: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e',
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#145231',
    },
  },
  fonts: {
    body: "'Inter', sans-serif",
    heading: "'Inter', sans-serif",
  },
  styles: {
    global: (props: any) => ({
      body: {
        bg: props.colorMode === 'dark' ? '#0f0d17' : '#f8f7fb',
        color: props.colorMode === 'dark' ? '#e8e8e8' : '#1a1a2e',
        transition: 'background-color 0.3s ease',
      },
      html: {
        scrollBehavior: 'smooth',
      },
    }),
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: '600',
        fontSize: '0.95rem',
        transition: 'all 0.3s ease',
      },
      variants: {
        solid: (props: any) => ({
          bg: props.colorMode === 'dark' ? 'brand.600' : 'brand.500',
          color: 'white',
          _hover: {
            bg: props.colorMode === 'dark' ? 'brand.700' : 'brand.600',
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 16px rgba(117, 106, 182, 0.3)',
          },
          _active: {
            bg: props.colorMode === 'dark' ? 'brand.800' : 'brand.700',
            transform: 'translateY(0)',
          },
        }),
      },
      defaultProps: {
        colorScheme: 'brand',
      },
    },
    Card: {
      baseStyle: (props: any) => ({
        padding: '6',
        borderRadius: '14px',
        boxShadow: props.colorMode === 'dark' 
          ? '0 2px 8px rgba(0, 0, 0, 0.3)'
          : '0 2px 8px rgba(0, 0, 0, 0.06)',
        border: '1px solid',
        borderColor: props.colorMode === 'dark' ? '#2a2540' : '#e8e4f1',
        bg: props.colorMode === 'dark' ? '#1a1828' : '#ffffff',
        transition: 'all 0.3s ease',
      }),
    },
    Input: {
      baseStyle: {
        fontSize: '0.95rem',
      },
    },
  },
})

export default theme
