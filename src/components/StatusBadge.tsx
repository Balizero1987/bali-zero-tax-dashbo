import { cn } from '@/lib/utils'
import type { CompanyStatus } from '@/lib/types'

interface BadgeProps {
  status: CompanyStatus
  children: React.ReactNode
  className?: string
}

const statusStyles: Record<CompanyStatus, string> = {
  active: 'bg-success/10 text-success border-success/20',
  pending: 'bg-warning/10 text-warning-foreground border-warning/20',
  inactive: 'bg-muted text-muted-foreground border-border',
  overdue: 'bg-destructive/10 text-destructive border-destructive/20',
}

export function Badge({ status, children, className }: BadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium border',
      statusStyles[status],
      className
    )}>
      {children}
    </span>
  )
}
