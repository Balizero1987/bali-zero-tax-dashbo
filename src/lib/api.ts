import type {
  AuthResponse,
  Company,
  CompaniesResponse,
  CreateCompanyRequest,
  UpdateCompanyRequest,
  DashboardStats,
} from './types'
import { mockApi } from './mockApi'

const USE_MOCK_API = true

const API_BASE = import.meta.env.PROD
  ? 'https://nuzantara-backend.fly.dev/api/tax'
  : 'http://localhost:8080/api/tax'

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
    this.name = 'ApiError'
  }
}

const getAuthHeaders = () => {
  const token = localStorage.getItem('tax_token')
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  }
}

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options?.headers,
    },
  })

  if (response.status === 401) {
    localStorage.removeItem('tax_token')
    window.location.href = '/login'
    throw new ApiError(401, 'Unauthorized')
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }))
    throw new ApiError(response.status, error.message || 'Request failed')
  }

  return response.json()
}

export const api = USE_MOCK_API ? mockApi : {
  auth: {
    login: async (email: string, password: string): Promise<AuthResponse> => {
      return fetchApi<AuthResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      })
    },
  },

  companies: {
    list: async (params?: {
      status?: string
      page?: number
      limit?: number
      search?: string
    }): Promise<CompaniesResponse> => {
      const searchParams = new URLSearchParams()
      if (params?.status) searchParams.append('status', params.status)
      if (params?.page) searchParams.append('page', params.page.toString())
      if (params?.limit) searchParams.append('limit', params.limit.toString())
      if (params?.search) searchParams.append('search', params.search)
      
      const query = searchParams.toString()
      return fetchApi<CompaniesResponse>(`/companies${query ? `?${query}` : ''}`)
    },

    get: async (id: string): Promise<Company> => {
      return fetchApi<Company>(`/companies/${id}`)
    },

    create: async (data: CreateCompanyRequest): Promise<Company> => {
      return fetchApi<Company>('/companies', {
        method: 'POST',
        body: JSON.stringify(data),
      })
    },

    update: async (id: string, data: UpdateCompanyRequest): Promise<Company> => {
      return fetchApi<Company>(`/companies/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      })
    },

    delete: async (id: string): Promise<void> => {
      return fetchApi<void>(`/companies/${id}`, {
        method: 'DELETE',
      })
    },

    stats: async (): Promise<DashboardStats> => {
      return fetchApi<DashboardStats>('/companies/stats')
    },
  },
}
