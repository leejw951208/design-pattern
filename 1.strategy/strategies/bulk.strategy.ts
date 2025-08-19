import { DiscountResult, PricingContext, PricingStrategy } from '../type/types'

// 대량구매 할인 전략
export class BulkPurchaseDiscountStrategy implements PricingStrategy {
    // 기준 수량(minQty) 이상 구매 시, 아이템당 amountOffPerItem만큼 정액 할인
    constructor(private readonly minQty = 10, private readonly amountOffPerItem = 100) {}
    // 예: 10개 이상 구매 시, 개당 100원 할인

    apply(ctx: PricingContext): DiscountResult | null {
        // 임계 수량 미만이면 적용 불가
        if (ctx.quantity < this.minQty) return null

        // 전체 할인액 = 수량 * 개당 할인액
        const amount = ctx.quantity * this.amountOffPerItem

        // 할인 금액이 0원 이하면 null 반환
        return amount > 0
            ? {
                  label: `대량구매 ${this.minQty}개↑ 개당 ${this.amountOffPerItem}원 할인`,
                  amount,
                  meta: { minQty: this.minQty, amountOffPerItem: this.amountOffPerItem }
              }
            : null
    }
}
