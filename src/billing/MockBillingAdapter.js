import { DEFAULT_PLAN } from '@/lib/constants'

// In v1 everyone gets the default plan. No checkout exists.
export const MockBillingAdapter = {
  name: 'mock',
  canCheckout: false,
  getPlanId() {
    return DEFAULT_PLAN
  },
}