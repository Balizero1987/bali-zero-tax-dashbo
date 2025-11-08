import type {
  AuthResponse,
  Company,
  CompaniesResponse,
  CreateCompanyRequest,
  UpdateCompanyRequest,
  DashboardStats,
} from './types'

import { taxCalculator } from './taxCalculator'

const MOCK_TOKEN = 'mock_jwt_token_12345'

const MOCK_USER = {
  id: 'user_001',
  email: 'angel@balizero.com',
  name: 'Angel',
  role: 'consultant' as const,
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const mockApi = {
  auth: {
    login: async (email: string, password: string): Promise<AuthResponse> => {
      await delay(500)
      
      if (email === 'angel@balizero.com' && password === 'demo') {
        return {
          success: true,
          token: MOCK_TOKEN,
          user: MOCK_USER,
        }
      }
      
      throw new Error('Invalid credentials')
    },
    
    logout: async (): Promise<void> => {
      await delay(300)
    },
  },

  companies: {
    list: async (): Promise<CompaniesResponse> => {
      await delay(400)
      
      const companies = await window.spark.kv.get<Company[]>('mock_companies')
      
      if (!companies || companies.length === 0) {
        const initialCompanies: Company[] = [
          {
            id: 'comp_001',
            name: 'PT Bali Digital Solutions',
            legal_entity_type: 'PT',
            npwp: '01.234.567.8-901.000',
            status: 'active',
            next_payment: new Date(2025, 10, 15).toISOString(),
            created_at: new Date(2024, 0, 15).toISOString(),
          },
          {
            id: 'comp_002',
            name: 'CV Nusantara Teknologi',
            legal_entity_type: 'CV',
            npwp: '02.345.678.9-012.000',
            status: 'pending',
            created_at: new Date(2024, 2, 20).toISOString(),
          },
          {
            id: 'comp_003',
            name: 'PT Maju Bersama Indonesia',
            legal_entity_type: 'PT',
            npwp: '03.456.789.0-123.000',
            status: 'active',
            next_payment: new Date(2025, 10, 20).toISOString(),
            created_at: new Date(2023, 11, 1).toISOString(),
          },
        ]
        
        await window.spark.kv.set('mock_companies', initialCompanies)
        
        return {
          companies: initialCompanies,
          total: initialCompanies.length,
        }
      }
      
      return {
        companies,
        total: companies.length,
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
        status: 'active',
        created_at: new Date().toISOString(),
      }
      
      const updatedCompanies = [...companies, newCompany]
      await window.spark.kv.set('mock_companies', updatedCompanies)
      
      return newCompany
    },

    update: async (id: string, data: UpdateCompanyRequest): Promise<Company> => {
      await delay(400)
      
      const companies = await window.spark.kv.get<Company[]>('mock_companies') || []
      const index = companies.findIndex(c => c.id === id)
      
      if (index === -1) {
        throw new Error('Company not found')
      }
      
      const updatedCompany = {
        ...companies[index],
        ...data,
      }
      
      companies[index] = updatedCompany
      await window.spark.kv.set('mock_companies', companies)
      
      return updatedCompany
    },

    delete: async (id: string): Promise<void> => {
      await delay(400)
      
      const companies = await window.spark.kv.get<Company[]>('mock_companies') || []
      const filtered = companies.filter(c => c.id !== id)
      
      await window.spark.kv.set('mock_companies', filtered)
    },
  },

  stats: async (): Promise<DashboardStats> => {
    await delay(300)
    
    const companies = await window.spark.kv.get<Company[]>('mock_companies') || []
    
    const monthlyTax = companies.reduce((sum, company) => {
      const estimatedMonthlyRevenue = 50_000_000
      const taxResult = taxCalculator.calculateCorporateTax(
        company.legal_entity_type,
        estimatedMonthlyRevenue * 12
      )
      return sum + (taxResult.totalTax / 12)
    }, 0)
    
    return {
      total_clients: companies.length,
      pending_reports: companies.filter(c => c.status === 'pending').length,
      upcoming_payments: companies.filter(c => c.next_payment).length,
      this_month_tax: Math.round(monthlyTax),
    }
  },
}
