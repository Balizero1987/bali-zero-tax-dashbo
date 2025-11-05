import { useState, useEffect } from 'react'
import { Toaster } from 'sonner'
import { LoginPage } from './pages/LoginPage'
import { DashboardPage } from './pages/DashboardPage'
import { NewClientForm } from './pages/NewClientForm'
import { CompanyProfilePage } from './pages/CompanyProfilePage'

type Screen = 
  | { type: 'login' }
  | { type: 'dashboard' }
  | { type: 'new-client' }
  | { type: 'company-profile'; companyId: string }

function App() {
  const [screen, setScreen] = useState<Screen>({ type: 'login' })

  useEffect(() => {
    const token = localStorage.getItem('tax_token')
    if (token) {
      setScreen({ type: 'dashboard' })
    } else {
      setScreen({ type: 'login' })
    }
  }, [])

  const handleLoginSuccess = () => {
    setScreen({ type: 'dashboard' })
  }

  const handleLogout = () => {
    localStorage.removeItem('tax_token')
    localStorage.removeItem('tax_user')
    setScreen({ type: 'login' })
  }

  const handleCreateClient = () => {
    setScreen({ type: 'new-client' })
  }

  const handleCloseNewClient = () => {
    setScreen({ type: 'dashboard' })
  }

  const handleNewClientSuccess = () => {
    setScreen({ type: 'dashboard' })
  }

  const handleViewProfile = (companyId: string) => {
    setScreen({ type: 'company-profile', companyId })
  }

  const handleBackToDashboard = () => {
    setScreen({ type: 'dashboard' })
  }

  return (
    <>
      {screen.type === 'login' && (
        <LoginPage onLoginSuccess={handleLoginSuccess} />
      )}
      
      {screen.type === 'dashboard' && (
        <DashboardPage
          onLogout={handleLogout}
          onCreateClient={handleCreateClient}
          onViewProfile={handleViewProfile}
        />
      )}
      
      {screen.type === 'new-client' && (
        <>
          <DashboardPage
            onLogout={handleLogout}
            onCreateClient={handleCreateClient}
            onViewProfile={handleViewProfile}
          />
          <NewClientForm
            onClose={handleCloseNewClient}
            onSuccess={handleNewClientSuccess}
          />
        </>
      )}
      
      {screen.type === 'company-profile' && (
        <CompanyProfilePage
          companyId={screen.companyId}
          onBack={handleBackToDashboard}
        />
      )}
      
      <Toaster position="top-right" />
    </>
  )
}

export default App