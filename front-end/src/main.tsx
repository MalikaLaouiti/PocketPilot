import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ChakraProvider } from '@chakra-ui/react'
import App from './App'
import theme from './theme'
import './styles/fonts.css'
import { CompteProvider } from './context/CompteContext'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <CompteProvider>
          <App />
          <ReactQueryDevtools initialIsOpen={false} />
        </CompteProvider>
      </QueryClientProvider>
    </ChakraProvider>
  </React.StrictMode>,
)
