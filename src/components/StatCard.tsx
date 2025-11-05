import { cn } from '@/lib/utils'

interface StatCardProps {
  label: string
  value: string | number
  change?: string
  className?: string
}

export function StatCard({ label, value, change, className }: StatCardProps) {
  return (
    <div className={cn(
      'bg-card border border-border rounded-lg p-6',
      className
    )}>
      <div className="text-sm text-muted-foreground mb-2">{label}</div>
      <div className="text-3xl font-semibold text-foreground mb-1">{value}</div>
      {change && (
        <div className="text-xs text-success flex items-center gap-1">
          <span>↗</span>
          <span>{change}</span>
        </div>
      )}
    </div>
  )
}
