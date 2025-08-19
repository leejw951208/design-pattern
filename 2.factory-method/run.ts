import { PricingEngine } from './engine/pricing-engine'
import { createStrategiesByMarket } from './factory/selector'
import { PricingContext, PricingEngineOptions } from './type/types'

const engineOpts: PricingEngineOptions = {
    maxDiscountRate: 0.3, // 총 할인 30% 상한
    exclusiveGroups: ['membership'], // 신규 vs 등급 중 하나만
    roundingFix: true
}

// A) 한국: NEW + 쿠폰(10%) + 대량구매
const ctxKR: PricingContext = {
    basePrice: 12000,
    quantity: 12,
    memberTier: 'NEW',
    coupon: { type: 'RATE', value: 10 },
    market: 'KR'
}
const engineKR = new PricingEngine(createStrategiesByMarket(ctxKR), engineOpts)
console.log('🇰🇷 KR =>', engineKR.calculate(ctxKR))

// B) 글로벌: GOLD + 쿠폰(15%) + 대량구매
const ctxGL: PricingContext = {
    basePrice: 20000,
    quantity: 15,
    memberTier: 'GOLD',
    coupon: { type: 'RATE', value: 15 },
    market: 'GLOBAL'
}
const engineGL = new PricingEngine(createStrategiesByMarket(ctxGL), engineOpts)
console.log('🌍 GLOBAL =>', engineGL.calculate(ctxGL))
