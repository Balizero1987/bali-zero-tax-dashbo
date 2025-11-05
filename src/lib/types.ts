export interface User {
  id: string
  email: string
  name: string
  role: string
}

export interface AuthResponse {
  token: string
  user: User
}

export interface Company {
  id: string
  company_name: string
  legal_entity_type: LegalEntityType
  email: string
  phone?: string
  npwp?: string
  kbli_code?: string
  status: CompanyStatus
  assigned_consultant?: string
  jurnal_connected: boolean
  documents_folder_url?: string
  notes?: string
  last_report?: string
  next_payment?: string
  created_at: string
  updated_at: string
}

export type LegalEntityType = 'PT' | 'PT_PMA' | 'CV' | 'FIRMA' | 'UD' | 'PERORANGAN'

export type CompanyStatus = 'active' | 'pending' | 'inactive' | 'overdue'

export interface DashboardStats {
  total_clients: number
  pending_reports: number
  upcoming_payments: number
  this_month_tax: number
}

export interface CreateCompanyRequest {
  company_name: string
  legal_entity_type: LegalEntityType
  email: string
  phone?: string
  npwp?: string
  kbli_code?: string
  documents_folder_url?: string
  notes?: string
}

export interface UpdateCompanyRequest extends Partial<CreateCompanyRequest> {
  status?: CompanyStatus
  assigned_consultant?: string
  jurnal_connected?: boolean
}

export interface CompaniesResponse {
  companies: Company[]
  total: number
  page: number
  limit: number
}
