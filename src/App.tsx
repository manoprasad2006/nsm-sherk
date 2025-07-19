import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { Landing } from './pages/Landing'
import Giveaways from './pages/Giveaways'
import { Token } from './pages/Token'
import { Auth } from './pages/Auth'
import { StakeForm } from './pages/StakeForm'
import { Dashboard } from './pages/Dashboard'
import { Admin } from './pages/Admin'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/giveaways" element={<Giveaways />} />
            <Route path="/token" element={<Token />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/stake-form" element={<StakeForm />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App