import type { CalculatorEngine } from "@/features/tools/engine"

export interface ReceiptInput {
  amount: number
}

export interface ReceiptResult {
  isValid: boolean
}

export const receiptEngine: CalculatorEngine<ReceiptInput, ReceiptResult> = (input) => {
  return {
    isValid: input.amount > 0 && !isNaN(input.amount)
  }
}

export default { family: "calculator" as const, run: receiptEngine }
