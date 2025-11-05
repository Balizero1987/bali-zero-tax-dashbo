import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/StatusBadge'
import { BaliZeroLogo } from '@/components/BaliZeroLogo'
import { ArrowLeft, Link as LinkIcon } from '@phosphor-icons/react'
import { api } from '@/lib/api'
import { toast } from 'sonner'
import type { Company } from '@/lib/types'

interface CompanyProfilePageProps {
  companyId: string
  onBack: () => void
}

export function CompanyProfilePage({ companyId, onBack }: CompanyProfilePageProps) {
  const [company, setCompany] = useState<Company | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadCompany()
  }, [companyId])

  const loadCompany = async () => {
    setIsLoading(true)
    try {
      const data = await api.companies.get(companyId)
      setCompany(data)
    } catch (error) {
      toast.error('Failed to load company details')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSync = () => {
    toast.info('Jurnal.id sync coming soon')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (!company) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Company not found</p>
          <Button onClick={onBack}>Back to Dashboard</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <BaliZeroLogo />
          <Button variant="outline" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-card border border-border rounded-lg p-6 mb-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-semibold mb-2">{company.company_name}</h1>
              <div className="flex items-center gap-2">
                <Badge status={company.status}>
                  {company.status.charAt(0).toUpperCase() + company.status.slice(1)}
                </Badge>
                <span className="text-sm text-muted-foreground">{company.legal_entity_type}</span>
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="info" className="space-y-6">
          <TabsList>
            <TabsTrigger value="info">Info</TabsTrigger>
            <TabsTrigger value="financials">Financials</TabsTrigger>
            <TabsTrigger value="tax">Tax</TabsTrigger>
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="space-y-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Company Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Company Name</Label>
                  <div className="text-foreground">{company.company_name}</div>
                </div>

                <div className="space-y-2">
                  <Label>Legal Entity Type</Label>
                  <div className="text-foreground">{company.legal_entity_type}</div>
                </div>

                <div className="space-y-2">
                  <Label>Email</Label>
                  <div className="text-foreground">{company.email}</div>
                </div>

                <div className="space-y-2">
                  <Label>Phone</Label>
                  <div className="text-foreground">{company.phone || '-'}</div>
                </div>

                <div className="space-y-2">
                  <Label>NPWP</Label>
                  <div className="text-foreground font-mono">{company.npwp || '-'}</div>
                </div>

                <div className="space-y-2">
                  <Label>KBLI Code</Label>
                  <div className="text-foreground font-mono">{company.kbli_code || '-'}</div>
                </div>

                <div className="space-y-2">
                  <Label>Assigned Consultant</Label>
                  <div className="text-foreground">{company.assigned_consultant || 'Not assigned'}</div>
                </div>

                <div className="space-y-2">
                  <Label>Jurnal.id Connection</Label>
                  <div className="flex items-center gap-2">
                    <Badge status={company.jurnal_connected ? 'active' : 'inactive'}>
                      {company.jurnal_connected ? 'Connected' : 'Not Connected'}
                    </Badge>
                    {!company.jurnal_connected && (
                      <Button size="sm" variant="outline" onClick={handleSync}>
                        <LinkIcon className="w-4 h-4 mr-2" />
                        Connect
                      </Button>
                    )}
                  </div>
                </div>

                {company.documents_folder_url && (
                  <div className="space-y-2 md:col-span-2">
                    <Label>Documents Folder</Label>
                    <a
                      href={company.documents_folder_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline flex items-center gap-1"
                    >
                      <LinkIcon className="w-4 h-4" />
                      Open Documents
                    </a>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Internal Notes</h2>
              <Textarea
                value={company.notes || ''}
                placeholder="Add internal notes about this client..."
                rows={6}
                disabled
              />
            </div>
          </TabsContent>

          <TabsContent value="financials">
            <div className="bg-card border border-border rounded-lg p-6">
              <p className="text-muted-foreground text-center py-12">
                Financial data coming soon
              </p>
            </div>
          </TabsContent>

          <TabsContent value="tax">
            <div className="bg-card border border-border rounded-lg p-6">
              <p className="text-muted-foreground text-center py-12">
                Tax calculations coming soon
              </p>
            </div>
          </TabsContent>

          <TabsContent value="invoices">
            <div className="bg-card border border-border rounded-lg p-6">
              <p className="text-muted-foreground text-center py-12">
                Invoices coming soon
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
