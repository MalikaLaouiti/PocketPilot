import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Box } from '@chakra-ui/react'
import { Dashboard } from './pages/Dashboard'
import { Transactions } from './pages/Transactions'
import { Analysis } from './pages/Analysis'
import { Budget } from './pages/Budget'
import { Objectives } from './pages/Objectives'
import { ObjectivePlan } from './pages/ObjectivePlan'
import { Profile } from './pages/Profile'

const App: React.FC = () => {
  return (
    <Router>
      <Box>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/analysis" element={<Analysis />} />
          <Route path="/budget" element={<Budget />} />
          <Route path="/objectives" element={<Objectives />} />
          <Route path="/objectives/plan" element={<ObjectivePlan />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Box>
    </Router>
  )
}

export default App
