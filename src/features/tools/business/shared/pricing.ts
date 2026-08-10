/**
 * Shared pricing math for all Business calculator tools.
 *
 * KEY DEFINITIONS (often confused):
 *   Margin  = profit / sellingPrice × 100   ← percentage of selling price
 *   Markup  = profit / costPrice × 100      ← percentage of cost price
 *
 * All monetary values are rounded to 2 decimal places (paisa-exact).
 * No browser, React or DOM dependencies — pure functions only.
 */

const r2 = (v: number): number => Math.round(v * 100) / 100

// ── Profit / Margin / Markup ──────────────────────────────────────────────────

export interface ProfitOptions {
  shippingCost?: number
  adCost?: number
  gatewayFeePct?: number
}

export interface ProfitResult {
  costPrice: number
  sellingPrice: number
  shippingCost: number
  adCost: number
  gatewayFeePct: number
  gatewayFeeAmount: number
  totalExpenses: number
  
  // Gross Profit (before extra operational expenses)
  grossProfit: number
  grossMargin: number
  grossMarkup: number

  // Net Profit (after shipping, ads, gateway fees)
  netProfit: number
  netMargin: number
  netMarkup: number

  // Backward compatibility fields
  profit: number
  margin: number
  markup: number

  // Revenue Breakdown Percentages
  productCostPct: number
  shippingPct: number
  adCostPct: number
  gatewayPct: number
  netProfitPct: number
}

export function calculateProfit(
  costPrice: number,
  sellingPrice: number,
  options: ProfitOptions = {},
): ProfitResult {
  const shippingCost = options.shippingCost || 0
  const adCost = options.adCost || 0
  const gatewayFeePct = options.gatewayFeePct || 0

  const grossProfit = r2(sellingPrice - costPrice)
  const grossMargin = sellingPrice > 0 ? r2((grossProfit / sellingPrice) * 100) : 0
  const grossMarkup = costPrice > 0 ? r2((grossProfit / costPrice) * 100) : 0

  const gatewayFeeAmount = r2((sellingPrice * gatewayFeePct) / 100)
  const totalExpenses = r2(costPrice + shippingCost + adCost + gatewayFeeAmount)
  const netProfit = r2(sellingPrice - totalExpenses)
  const netMargin = sellingPrice > 0 ? r2((netProfit / sellingPrice) * 100) : 0
  const netMarkup = totalExpenses > 0 ? r2((netProfit / totalExpenses) * 100) : 0

  const productCostPct = sellingPrice > 0 ? r2((costPrice / sellingPrice) * 100) : 0
  const shippingPct = sellingPrice > 0 ? r2((shippingCost / sellingPrice) * 100) : 0
  const adCostPct = sellingPrice > 0 ? r2((adCost / sellingPrice) * 100) : 0
  const gatewayPct = sellingPrice > 0 ? r2((gatewayFeeAmount / sellingPrice) * 100) : 0
  const netProfitPct = sellingPrice > 0 ? r2((netProfit / sellingPrice) * 100) : 0

  return {
    costPrice,
    sellingPrice,
    shippingCost,
    adCost,
    gatewayFeePct,
    gatewayFeeAmount,
    totalExpenses,
    grossProfit,
    grossMargin,
    grossMarkup,
    netProfit,
    netMargin,
    netMarkup,
    profit: netProfit,
    margin: netMargin,
    markup: netMarkup,
    productCostPct,
    shippingPct,
    adCostPct,
    gatewayPct,
    netProfitPct,
  }
}

// ── Discount ─────────────────────────────────────────────────────────────────

export interface DiscountResult {
  originalPrice: number
  discountPct: number
  savings: number      // originalPrice × discountPct / 100
  finalPrice: number   // originalPrice − savings
}

export function calculateDiscount(originalPrice: number, discountPct: number): DiscountResult {
  const savings = r2((originalPrice * discountPct) / 100)
  const finalPrice = r2(originalPrice - savings)
  return { originalPrice, discountPct, savings, finalPrice }
}

// ── Markup (forward + reverse) ────────────────────────────────────────────────

/**
 * Forward: given cost + markup% → selling price.
 *   sellPrice = cost × (1 + markup / 100)
 */
export function sellingPriceFromMarkup(costPrice: number, markupPct: number): number {
  return r2(costPrice * (1 + markupPct / 100))
}

/**
 * Reverse: given cost + selling price → markup%.
 *   markup = (sell − cost) / cost × 100
 */
export function markupFromPrices(costPrice: number, sellingPrice: number): number {
  if (costPrice <= 0) return 0
  return r2(((sellingPrice - costPrice) / costPrice) * 100)
}

// ── Break-Even ───────────────────────────────────────────────────────────────

export interface BreakEvenResult {
  fixedCosts: number
  variableCostPerUnit: number
  sellingPricePerUnit: number
  contributionPerUnit: number  // sellingPrice − variableCost
  breakEvenUnits: number       // fixedCosts / contributionPerUnit  (Infinity if contribution ≤ 0)
  breakEvenRevenue: number     // breakEvenUnits × sellingPricePerUnit
  isValid: boolean             // false when sellingPrice ≤ variableCost
}

export function calculateBreakEven(
  fixedCosts: number,
  variableCostPerUnit: number,
  sellingPricePerUnit: number,
): BreakEvenResult {
  const contributionPerUnit = r2(sellingPricePerUnit - variableCostPerUnit)
  const isValid = contributionPerUnit > 0
  const breakEvenUnits = isValid ? Math.ceil(fixedCosts / contributionPerUnit) : Infinity
  const breakEvenRevenue = isValid && Number.isFinite(breakEvenUnits)
    ? r2(breakEvenUnits * sellingPricePerUnit)
    : Infinity
  return {
    fixedCosts,
    variableCostPerUnit,
    sellingPricePerUnit,
    contributionPerUnit,
    breakEvenUnits,
    breakEvenRevenue,
    isValid,
  }
}

// ── Commission ───────────────────────────────────────────────────────────────

export interface CommissionResult {
  saleAmount: number
  commissionPct: number
  commission: number             // saleAmount × commissionPct / 100
  amountAfterCommission: number  // saleAmount − commission
}

export function calculateCommission(saleAmount: number, commissionPct: number): CommissionResult {
  const commission = r2((saleAmount * commissionPct) / 100)
  const amountAfterCommission = r2(saleAmount - commission)
  return { saleAmount, commissionPct, commission, amountAfterCommission }
}

// ── Salary Hike ──────────────────────────────────────────────────────────────

export type SalaryMode = "monthly" | "annual"

export interface SalaryHikeResult {
  currentSalary: number
  hikePct: number
  mode: SalaryMode
  increase: number           // currentSalary × hikePct / 100
  newSalary: number          // currentSalary + increase  (in the same unit as input)
  newMonthlySalary: number   // always monthly
  newAnnualSalary: number    // always annual (CTC)
  monthlyIncrease: number
  annualIncrease: number
}

export function calculateSalaryHike(
  currentSalary: number,
  hikePct: number,
  mode: SalaryMode,
): SalaryHikeResult {
  const increase = r2((currentSalary * hikePct) / 100)
  const newSalary = r2(currentSalary + increase)
  const monthlyIncrease = mode === "annual" ? r2(increase / 12) : increase
  const annualIncrease = mode === "monthly" ? r2(increase * 12) : increase
  const newMonthlySalary = mode === "annual" ? r2(newSalary / 12) : newSalary
  const newAnnualSalary = mode === "monthly" ? r2(newSalary * 12) : newSalary
  return {
    currentSalary,
    hikePct,
    mode,
    increase,
    newSalary,
    newMonthlySalary,
    newAnnualSalary,
    monthlyIncrease,
    annualIncrease,
  }
}
