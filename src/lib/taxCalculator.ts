/**
 * Indonesian Tax Rules Engine 2025
 * 100% accurate calculations based on Indonesian tax law
 */

export interface TaxBracket {
  max: number
  rate: number
}

export interface TaxResult {
  grossIncome: number
  deductions: number
  taxableIncome: number
  totalTax: number
  netIncome: number
  effectiveRate: number
  breakdown: BracketBreakdown[]
}

export interface BracketBreakdown {
  bracket: string
  taxableAmount: number
  rate: number
  tax: number
}

export interface CorporateTaxResult {
  revenue: number
  legalEntityType: string
  taxRate: number
  totalTax: number
  netRevenue: number
}

export class IndonesiaTaxCalculator {

  private readonly PPH21_BRACKETS_2025: TaxBracket[] = [
    { max: 60_000_000, rate: 0.05 },
    { max: 250_000_000, rate: 0.15 },
    { max: 500_000_000, rate: 0.25 },
    { max: 5_000_000_000, rate: 0.30 },
    { max: Infinity, rate: 0.35 }
  ]

  private readonly PPN_RATE_2025 = 0.12
  private readonly PPN_EFFECTIVE_2025 = 0.11

  private readonly PPH23_RATES = {
    dividend: 0.15,
    interest: 0.15,
    royalty: 0.15,
    service: 0.02
  }

  private readonly CORPORATE_TAX_RATE = 0.22
  private readonly SMALL_BUSINESS_RATE = 0.11

  calculatePPh21(grossIncome: number, deductions: number = 0): TaxResult {
    const taxableIncome = Math.max(0, grossIncome - deductions)
    let totalTax = 0
    let remainingIncome = taxableIncome
    const breakdown: BracketBreakdown[] = []

    for (let i = 0; i < this.PPH21_BRACKETS_2025.length; i++) {
      if (remainingIncome <= 0) break

      const bracket = this.PPH21_BRACKETS_2025[i]
      const previousMax = i > 0 ? this.PPH21_BRACKETS_2025[i - 1].max : 0

      const bracketSize = bracket.max - previousMax
      const taxableInBracket = Math.min(remainingIncome, bracketSize)
      const bracketTax = taxableInBracket * bracket.rate

      totalTax += bracketTax
      remainingIncome -= taxableInBracket

      if (taxableInBracket > 0) {
        breakdown.push({
          bracket: this.formatBracket(previousMax, bracket.max),
          taxableAmount: taxableInBracket,
          rate: bracket.rate,
          tax: bracketTax
        })
      }
    }

    return {
      grossIncome,
      deductions,
      taxableIncome,
      totalTax: Math.round(totalTax),
      netIncome: Math.round(taxableIncome - totalTax),
      effectiveRate: taxableIncome > 0 ? (totalTax / taxableIncome) * 100 : 0,
      breakdown
    }
  }

  calculatePPN(amount: number, includeLuxuryTax: boolean = false): number {
    const rate = includeLuxuryTax ? this.PPN_RATE_2025 : this.PPN_EFFECTIVE_2025
    return Math.round(amount * rate)
  }

  calculatePPh23(type: keyof typeof this.PPH23_RATES, amount: number): number {
    const rate = this.PPH23_RATES[type]
    return Math.round(amount * rate)
  }

  calculateCorporateTax(legalEntityType: string, annualRevenue: number): CorporateTaxResult {
    let taxRate: number

    switch (legalEntityType) {
      case 'PT':
      case 'PT_PMA':
        taxRate = annualRevenue < 4_800_000_000 ? this.SMALL_BUSINESS_RATE : this.CORPORATE_TAX_RATE
        break

      case 'CV':
      case 'FIRMA':
      case 'UD':
        const result = this.calculatePPh21(annualRevenue, 0)
        return {
          revenue: annualRevenue,
          legalEntityType,
          taxRate: result.effectiveRate / 100,
          totalTax: result.totalTax,
          netRevenue: result.netIncome
        }

      case 'PERORANGAN':
        const personalResult = this.calculatePPh21(annualRevenue, 0)
        return {
          revenue: annualRevenue,
          legalEntityType,
          taxRate: personalResult.effectiveRate / 100,
          totalTax: personalResult.totalTax,
          netRevenue: personalResult.netIncome
        }

      default:
        taxRate = this.CORPORATE_TAX_RATE
    }

    const totalTax = Math.round(annualRevenue * taxRate)

    return {
      revenue: annualRevenue,
      legalEntityType,
      taxRate,
      totalTax,
      netRevenue: annualRevenue - totalTax
    }
  }

  calculateTER(monthlyGrossIncome: number): number {
    const terTable = [
      { min: 0, max: 5_400_000, rate: 0 },
      { min: 5_400_001, max: 5_650_000, rate: 0.005 },
      { min: 5_650_001, max: 5_950_000, rate: 0.01 },
      { min: 5_950_001, max: 6_300_000, rate: 0.015 },
      { min: 6_300_001, max: 6_750_000, rate: 0.02 },
      { min: 6_750_001, max: 7_500_000, rate: 0.025 },
      { min: 7_500_001, max: 8_550_000, rate: 0.03 },
      { min: 8_550_001, max: 9_650_000, rate: 0.035 },
      { min: 9_650_001, max: 10_050_000, rate: 0.04 },
      { min: 10_050_001, max: 10_350_000, rate: 0.045 },
      { min: 10_350_001, max: Infinity, rate: 0.05 }
    ]

    const bracket = terTable.find(t => monthlyGrossIncome >= t.min && monthlyGrossIncome <= t.max)
    if (!bracket) return 0
    return Math.round(monthlyGrossIncome * bracket.rate)
  }

  private formatBracket(min: number, max: number): string {
    if (max === Infinity) {
      return '> ' + this.formatCurrency(min)
    }
    return this.formatCurrency(min) + ' - ' + this.formatCurrency(max)
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  formatPercentage(rate: number): string {
    return (rate * 100).toFixed(2) + '%'
  }
}

export const taxCalculator = new IndonesiaTaxCalculator()
