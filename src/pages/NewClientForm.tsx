import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { api } from '@/lib/api'
import { toast } from 'sonner'
import { X } from '@phosphor-icons/react'
import type { LegalEntityType, CreateCompanyRequest } from '@/lib/types'

interface NewClientFormProps {
  onClose: () => void
  onSuccess: () => void
}

const legalEntityTypes: { value: LegalEntityType; label: string }[] = [
  { value: 'PT', label: 'PT - Perseroan Terbatas' },
  { value: 'PT_PMA', label: 'PT PMA - Foreign Investment' },
  { value: 'CV', label: 'CV - Commanditaire Vennootschap' },
  { value: 'FIRMA', label: 'Firma' },
  { value: 'UD', label: 'UD - Usaha Dagang' },
  { value: 'PERORANGAN', label: 'Perorangan' },
]

export function NewClientForm({ onClose, onSuccess }: NewClientFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<CreateCompanyRequest>({
    company_name: '',
    legal_entity_type: 'PT',
    email: '',
    phone: '',
    npwp: '',
    kbli_code: '',
    documents_folder_url: '',
    notes: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.company_name || !formData.email) {
      toast.error('Please fill in all required fields')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address')
      return
    }

    if (formData.npwp && formData.npwp.length > 0) {
      const npwpRegex = /^\d{2}\.\d{3}\.\d{3}\.\d{1}-\d{3}\.\d{3}$/
      if (!npwpRegex.test(formData.npwp)) {
        toast.error('NPWP format should be: XX.XXX.XXX.X-XXX.XXX')
        return
      }
    }

    if (formData.kbli_code && formData.kbli_code.length > 0 && formData.kbli_code.length !== 5) {
      toast.error('KBLI code must be 5 digits')
      return
    }

    setIsSubmitting(true)
    try {
      await api.companies.create(formData)
      toast.success('Client created successfully')
      onSuccess()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create client')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
      <div className="bg-card border border-border rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">New Client</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="company_name">
                Company Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="company_name"
                value={formData.company_name}
                onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                placeholder="PT Example Indonesia"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="legal_entity_type">
                Legal Entity Type <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.legal_entity_type}
                onValueChange={(value) => setFormData({ ...formData, legal_entity_type: value as LegalEntityType })}
              >
                <SelectTrigger id="legal_entity_type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {legalEntityTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">
                Email <span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="contact@example.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+62 812 3456 7890"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="npwp">NPWP</Label>
              <Input
                id="npwp"
                value={formData.npwp}
                onChange={(e) => setFormData({ ...formData, npwp: e.target.value })}
                placeholder="12.345.678.9-012.345"
                className="font-mono"
              />
              <p className="text-xs text-muted-foreground">Format: XX.XXX.XXX.X-XXX.XXX</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="kbli_code">KBLI Code</Label>
              <Input
                id="kbli_code"
                value={formData.kbli_code}
                onChange={(e) => setFormData({ ...formData, kbli_code: e.target.value })}
                placeholder="62010"
                maxLength={5}
                className="font-mono"
              />
              <p className="text-xs text-muted-foreground">5 digits</p>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="documents_folder_url">Documents Folder URL</Label>
              <Input
                id="documents_folder_url"
                type="url"
                value={formData.documents_folder_url}
                onChange={(e) => setFormData({ ...formData, documents_folder_url: e.target.value })}
                placeholder="https://drive.google.com/..."
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="notes">Internal Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Add any internal notes about this client..."
                rows={4}
              />
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-6 border-t border-border">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create Client'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
