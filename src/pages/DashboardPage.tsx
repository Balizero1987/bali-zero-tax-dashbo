import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { StatCard } from '@/components/StatCard'
import { ClientCard } from '@/components/ClientCard'
import { BaliZeroLogo } from '@/components/BaliZeroLogo'
import { MagnifyingGlass, Plus, SignOut, User, FunnelSimple } from '@phosphor-icons/react'
import { api } from '@/lib/api'
import { toast } from 'sonner'
import type { Company, DashboardStats, User as UserType } from '@/lib/types'

interface DashboardPageProps {
  onLogout: () => void
  onCreateClient: () => void
  onViewProfile: (companyId: string) => void
}

export function DashboardPage({ onLogout, onCreateClient, onViewProfile }: DashboardPageProps) {
  const [companies, setCompanies] = useState<Company[]>([])
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [user, setUser] = useState<UserType | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const userStr = localStorage.getItem('tax_user')
    if (userStr) {
      setUser(JSON.parse(userStr))
    }
    loadData()
  }, [])

  const loadData = async () => {
    setIsLoading(true)
    try {
      const [companiesData, statsData] = await Promise.all([
        api.companies.list({ status: 'active', limit: 20 }),
        api.companies.stats().catch(() => null),
      ])
      setCompanies(companiesData.companies)
      setStats(statsData)
    } catch (error) {
      toast.error('Failed to load data')
    } finally {
      setIsLoading(false)
    }
  }

  const filteredCompanies = companies.filter(company =>
    company.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    company.npwp?.includes(searchQuery) ||
    company.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <BaliZeroLogo />
          
          <div className="flex items-center gap-4">
            {user && (
              <div className="flex items-center gap-3 text-sm">
                <div className="text-right">
                  <div className="font-medium">{user.name}</div>
                  <div className="text-muted-foreground text-xs">{user.email}</div>
                </div>
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
              </div>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={onLogout}
            >
              <SignOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              label="Total Clients"
              value={stats.total_clients}
              change={`${stats.total_clients} active`}
            />
            <StatCard
              label="Pending Reports"
              value={stats.pending_reports}
            />
            <StatCard
              label="Upcoming Payments"
              value={stats.upcoming_payments}
            />
            <StatCard
              label="This Month Tax"
              value={formatCurrency(stats.this_month_tax)}
            />
          </div>
        )}

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Clients</h2>
            <Button
              onClick={onCreateClient}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Client
            </Button>
          </div>

          <div className="flex gap-3 mb-6">
            <div className="flex-1 relative">
              <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, NPWP, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <FunnelSimple className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>

          {isLoading ? (
            <div className="text-center py-12 text-muted-foreground">
              Loading clients...
            </div>
          ) : filteredCompanies.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                {searchQuery ? 'No clients found matching your search' : 'No clients yet'}
              </p>
              {!searchQuery && (
                <Button onClick={onCreateClient}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create your first client
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCompanies.map((company) => (
                <ClientCard
                  key={company.id}
                  company={company}
                  onCalculateTax={() => toast.info('Tax calculation coming soon')}
                  onViewProfile={() => onViewProfile(company.id)}
                  onViewDocuments={() => toast.info('Documents view coming soon')}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
