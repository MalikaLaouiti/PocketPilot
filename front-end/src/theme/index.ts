import { extendTheme } from '@chakra-ui/react'

const theme = extendTheme({
  colors: {
    brand: {
      50: '#EEF1FF',
      100: '#D8E0FF',
      200: '#BCCAFF',
      300: '#93ABFF',
      400: '#6887FF',
      500: '#4BA5ED', // Light Blue
      600: '#3D93DD',
      700: '#2F7DC5',
      800: '#2465A1',
      900: '#16176F', // Dark Blue
    },

    secondary: {
      50: '#F5F8FF',
      100: '#E8F1FD',
      200: '#D6E6FB',
      300: '#B8D6F7',
      400: '#8CC1F2',
      500: '#4BA5ED',
      600: '#3A8FD8',
      700: '#2C77BC',
      800: '#225F97',
      900: '#16176F',
    },

    accent: {
      50: '#F5F8FF',
      100: '#EAF2FF',
      200: '#D7E8FF',
      300: '#BDD9FF',
      400: '#8FC2FF',
      500: '#4BA5ED',
      600: '#3690E2',
      700: '#2B77BF',
      800: '#215D98',
      900: '#16176F',
    },

    success: {
      50: '#F0FDF4',
      100: '#DCFCE7',
      200: '#BBF7D0',
      300: '#86EFAC',
      400: '#4ADE80',
      500: '#22C55E',
      600: '#16A34A',
      700: '#15803D',
      800: '#166534',
      900: '#145231',
    },
  },

  fonts: {
  heading: "'Gilroy', 'Inter', 'Poppins', sans-serif",
  body: "'Gilroy', 'Inter', 'Poppins', sans-serif",
},

  styles: {
    global: (props: any) => ({
      body: {
        bg: props.colorMode === 'dark' ? '#0E1038' : '#F8FAFD',
        color: props.colorMode === 'dark' ? '#FFFFFF' : '#16176F',
      },
    }),
  },
})

export default theme