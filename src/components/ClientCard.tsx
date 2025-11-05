import { Button } from '@/components/ui/button'
import { Badge } from '@/components/StatusBadge'
import { Calculator, User, FileText } from '@phosphor-icons/react'
import type { Company } from '@/lib/types'
import { cn } from '@/lib/utils'

interface ClientCardProps {
  company: Company
  onCalculateTax: () => void
  onViewProfile: () => void
  onViewDocuments: () => void
  className?: string
}

export function ClientCard({
  company,
  onCalculateTax,
  onViewProfile,
  onViewDocuments,
  className,
}: ClientCardProps) {
  return (
    <div className={cn(
      'bg-card border border-border rounded-lg p-6 hover:shadow-sm transition-shadow',
      className
    )}>
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-semibold text-foreground">{company.company_name}</h3>
        <Badge status={company.status}>
          {company.status.charAt(0).toUpperCase() + company.status.slice(1)}
        </Badge>
      </div>

      <div className="text-sm text-muted-foreground space-y-1 mb-4">
        {company.npwp && (
          <div className="font-mono">NPWP: {company.npwp}</div>
        )}
        {company.kbli_code && (
          <div>KBLI: {company.kbli_code}</div>
        )}
        <div>Entity: {company.legal_entity_type}</div>
      </div>

      <div className="text-xs text-muted-foreground mb-4 space-y-1">
        {company.last_report && (
          <div>Last Report: {new Date(company.last_report).toLocaleDateString()}</div>
        )}
        {company.next_payment && (
          <div>Next Payment: {new Date(company.next_payment).toLocaleDateString()}</div>
        )}
      </div>

      <div className="flex gap-2">
        <Button 
          onClick={onCalculateTax}
          className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
          size="sm"
        >
          <Calculator className="w-4 h-4 mr-1" />
          Calculate Tax
        </Button>
        <Button
          onClick={onViewProfile}
          variant="outline"
          size="sm"
        >
          <User className="w-4 h-4" />
        </Button>
        <Button
          onClick={onViewDocuments}
          variant="outline"
          size="sm"
        >
          <FileText className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
