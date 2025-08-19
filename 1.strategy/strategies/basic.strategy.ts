import { DiscountResult, PricingContext, PricingStrategy } from '../type/types'
// 기본(할인 없음) 전략: 어떤 조건에서도 할인 미적용을 표현하기 위해 null을 반환한다.

export class NoDiscountStrategy implements PricingStrategy {
    /**
     * 할인 미적용을 의미하는 null 반환
     */
    apply(ctx: PricingContext): DiscountResult | null {
        return null
    }
}
