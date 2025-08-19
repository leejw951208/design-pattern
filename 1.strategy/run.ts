import { StrategyRegistry } from './registry/strategy-registry'
import { CouponDiscountStrategy } from './strategies/coupon.strategy'
import { NewMemberDiscountStrategy } from './strategies/new-member.strategy'
import { TierDiscountStrategy } from './strategies/tier-strategy'
import { BulkPurchaseDiscountStrategy } from './strategies/bulk.strategy'
import { PricingEngine } from './engine/pricing-engine'
import { PricingContext } from './type/types'

// 1) 전략 등록
const registry = new StrategyRegistry()
registry.register('coupon', new CouponDiscountStrategy())
registry.register('newMember', new NewMemberDiscountStrategy(0.1))
registry.register('tier', new TierDiscountStrategy())
registry.register('bulk', new BulkPurchaseDiscountStrategy(10, 100))

// 2) 전략 조합: 상황에 따라 동적으로 구성 가능
const strategies = ['newMember', 'tier', 'coupon', 'bulk'].map((k) => registry.get(k))

// 3) 엔진 생성: 상한 30%, 가장 큰 하나만 적용하지 않음(=중첩 허용)
const engine = new PricingEngine(strategies, {
    maxDiscountRate: 0.3,
    onlyBestOne: false
})

// 4) 입력 컨텍스트
const ctx: PricingContext = {
    basePrice: 12000,
    quantity: 12,
    memberTier: 'GOLD',
    coupon: { type: 'RATE', value: 10 }
}

// 5) 계산
const result = engine.calculate(ctx)

console.log('Subtotal:', result.subtotal.toLocaleString(), '원')
console.log('Discounts:')
for (const d of result.discounts) {
    console.log('-', d.label, `(-${d.amount.toLocaleString()}원)`)
}
console.log('Total:', result.total.toLocaleString(), '원')
