import { DiscountResult, PricingContext, PricingStrategy } from '../type/types'

// 쿠폰 할인 전략: 정액(AMOUNT) 또는 정률(RATE) 쿠폰을 적용한다.
export class CouponDiscountStrategy implements PricingStrategy {
    apply(ctx: PricingContext): DiscountResult | null {
        const { coupon, basePrice, quantity } = ctx
        if (!coupon) return null

        // 주문 금액(부가세/배송비 제외 가정)
        const subtotal = basePrice * quantity
        let amount = 0
        let label = '쿠폰 할인'

        if (coupon.type === 'AMOUNT') {
            // 정액: 쿠폰 값만큼 고정 차감
            amount = Math.max(0, Math.floor(coupon.value))
            label = `쿠폰 정액 ${amount.toLocaleString()}원 할인`
        } else if (coupon.type === 'RATE') {
            // 정률: 소계 * 비율
            amount = Math.floor(subtotal * (coupon.value / 100))
            label = `쿠폰 정률 ${coupon.value}% 할인`
        }

        // 할인 금액이 0원 이하면 null 반환
        return amount > 0 ? { label, amount, meta: { coupon } } : null
    }
}
