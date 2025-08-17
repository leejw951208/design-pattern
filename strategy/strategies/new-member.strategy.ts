import { DiscountResult, PricingContext, PricingStrategy } from '../type/types'

// 신규회원(IRON 등급) 한정 정률 할인 전략
export class NewMemberDiscountStrategy implements PricingStrategy {
    // 기본 10% 할인. 필요 시 생성자 인자로 조정 가능
    constructor(private readonly rate = 0.1) {}

    apply(ctx: PricingContext): DiscountResult | null {
        // 신규회원이 아니면 적용 불가
        if (ctx.memberTier !== 'NEW') return null

        // 소계 * 할인율
        const subtotal = ctx.basePrice * ctx.quantity
        const amount = Math.floor(subtotal * this.rate)

        // 할인 금액이 0원 이하면 null 반환
        return amount > 0 ? { label: `신규회원 ${Math.floor(this.rate * 100)}% 할인`, amount } : null
    }
}
