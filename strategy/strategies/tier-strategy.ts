import { DiscountResult, MemberTier, PricingContext, PricingStrategy } from '../type/types'

// 등급별 할인 전략: 회원 등급에 따라 정률 할인
const TIER_RATE: Record<MemberTier, number> = {
    NEW: 0,
    IRON: 0.01,
    BRONZE: 0.02,
    SILVER: 0.05,
    GOLD: 0.07,
    PLATINUM: 0.1
}

export class TierDiscountStrategy implements PricingStrategy {
    apply(ctx: PricingContext): DiscountResult | null {
        // 등급 정보가 없으면 적용 불가
        if (!ctx.memberTier) return null

        const rate = TIER_RATE[ctx.memberTier] ?? 0
        if (rate <= 0) return null

        // 소계 * 등급 할인율
        const subtotal = ctx.basePrice * ctx.quantity
        const amount = Math.floor(subtotal * rate)

        // 할인 금액이 0원 이하면 null 반환
        return amount > 0 ? { label: `등급(${ctx.memberTier}) ${Math.floor(rate * 100)}% 할인`, amount, meta: { rate } } : null
    }
}
