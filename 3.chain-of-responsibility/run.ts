import { InputValidator, MemberValidator, CouponValidator, StockValidator } from './validators'
import { TierDiscountHandler, BulkDiscountHandler, CouponDiscountHandler, CapAndTotalizeHandler } from './pricing-handlers'
import { ChainContext } from './types'

// 체인 구성:
// [입력검증] → [회원검증] → [쿠폰검증] → [재고검증] → [등급할인] → [대량할인] → [쿠폰할인] → [상한/합계]

// 핸들러 인스턴스 준비
const input = new InputValidator()
const member = new MemberValidator()
const couponV = new CouponValidator()
const stock = new StockValidator()
const tier = new TierDiscountHandler()
const bulk = new BulkDiscountHandler(10, 0.08)
const coupon = new CouponDiscountHandler()
const cap = new CapAndTotalizeHandler()

// 체인 연결(왼쪽→오른쪽 순서로 처리됨)
input.setNext(member).setNext(couponV).setNext(stock).setNext(tier).setNext(bulk).setNext(coupon).setNext(cap)

// 시나리오별 입력
const scenarios: ChainContext[] = [
    {
        basePrice: 20000,
        quantity: 12,
        memberTier: 'GOLD',
        coupon: { type: 'RATE', value: 10, code: 'TENOFF' },
        market: 'KR',
        stock: 50,
        maxDiscountRate: 0.3,
        discounts: [],
        logs: []
    },
    {
        basePrice: 15000,
        quantity: 3,
        memberTier: 'NEW',
        coupon: { type: 'AMOUNT', value: 2000 },
        market: 'GLOBAL',
        stock: 2, // 재고부족 → 0 처리
        maxDiscountRate: 0.25,
        discounts: [],
        logs: []
    },
    {
        basePrice: 10000,
        quantity: 1,
        memberTier: 'SILVER',
        market: 'KR',
        discounts: [],
        logs: []
    }
]

for (const s of scenarios) {
    const result = input.handle(s)
    // 간단 출력
    // eslint-disable-next-line no-console
    console.log({
        subtotal: result.subtotal,
        discounts: result.discounts,
        total: result.total,
        logs: result.logs
    })
}
