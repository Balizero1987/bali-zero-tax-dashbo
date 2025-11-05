import type {
  AuthResponse,
  Company,
  CompaniesResponse,
  CreateCompanyRequest,
  UpdateCompanyRequest,
  DashboardStats,
} from './types'

const MOCK_TOKEN = 'mock_jwt_token_12345'
const MOCK_USER = {
  id: 'user_001',
  email: 'angel@balizero.com',
  name: 'Angel',
  role: 'consultant',
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const mockApi = {
  auth: {
    login: async (email: string, password: string): Promise<AuthResponse> => {
      await delay(500)
      
      if (email === 'angel@balizero.com' && password === 'demo123') {
        return {
          token: MOCK_TOKEN,
          user: MOCK_USER,
        }
      }
      
      throw new Error('Invalid credentials')
    },
  },

  companies: {
    list: async (params?: {
      status?: string
      page?: number
      limit?: number
      search?: string
    }): Promise<CompaniesResponse> => {
      await delay(300)
      
      const companies = await window.spark.kv.get<Company[]>('mock_companies') || []
      
      let filtered = companies
      
      if (params?.status && params.status !== 'active') {
        filtered = filtered.filter(c => c.status === params.status)
      }
      
      if (params?.search) {
        const search = params.search.toLowerCase()
        filtered = filtered.filter(c =>
          c.company_name.toLowerCase().includes(search) ||
          c.email.toLowerCase().includes(search) ||
          c.npwp?.includes(search)
        )
      }
      
      return {
        companies: filtered,
        total: filtered.length,
        page: params?.page || 1,
        limit: params?.limit || 20,
      }
    },

    get: async (id: string): Promise<Company> => {
      await delay(300)
      
      const companies = await window.spark.kv.get<Company[]>('mock_companies') || []
      const company = companies.find(c => c.id === id)
      
      if (!company) {
        throw new Error('Company not found')
      }
      
      return company
    },

    create: async (data: CreateCompanyRequest): Promise<Company> => {
      await delay(500)
      
      const companies = await window.spark.kv.get<Company[]>('mock_companies') || []
      
      const newCompany: Company = {
        id: `comp_${Date.now()}`,
        ...data,
        status: 'pending',
        assigned_consultant: 'Angel',
        jurnal_connected: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      
      const updatedCompanies = [...companies, newCompany]
      await window.spark.kv.set('mock_companies', updatedCompanies)
      
      const stats = await window.spark.kv.get<DashboardStats>('mock_stats')
      if (stats) {
        await window.spark.kv.set('mock_stats', {
          ...stats,
          total_clients: stats.total_clients + 1,
        })
      }
      
      return newCompany
    },

    update: async (id: string, data: UpdateCompanyRequest): Promise<Company> => {
      await delay(500)
      
      const companies = await window.spark.kv.get<Company[]>('mock_companies') || []
      const index = companies.findIndex(c => c.id === id)
      
      if (index === -1) {
        throw new Error('Company not found')
      }
      
      const updatedCompany: Company = {
        ...companies[index],
        ...data,
        updated_at: new Date().toISOString(),
      }
      
      const updatedCompanies = [...companies]
      updatedCompanies[index] = updatedCompany
      
      await window.spark.kv.set('mock_companies', updatedCompanies)
      
      return updatedCompany
    },

    delete: async (id: string): Promise<void> => {
      await delay(500)
      
      const companies = await window.spark.kv.get<Company[]>('mock_companies') || []
      const filtered = companies.filter(c => c.id !== id)
      
      await window.spark.kv.set('mock_companies', filtered)
    },

    stats: async (): Promise<DashboardStats> => {
      await delay(300)
      
      const stats = await window.spark.kv.get<DashboardStats>('mock_stats')
      
      if (!stats) {
        return {
          total_clients: 0,
          pending_reports: 0,
          upcoming_payments: 0,
          this_month_tax: 0,
        }
      }
      
      return stats
    },
  },
}
