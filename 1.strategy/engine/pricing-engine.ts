import { PricingContext, PricingResult, PricingStrategy, DiscountResult } from '../type/types'

// PricingEngine: 여러 할인 전략을 조합하여 최종 결제 금액을 계산한다.
// - 전략은 개별적으로 적용 가능 여부와 할인 금액을 반환한다.
// - 옵션으로 최대 할인 상한(%), 단일 최댓값 전략 적용 등을 제어한다.

export class PricingEngine {
    constructor(
        private readonly strategies: PricingStrategy[],
        private readonly options?: {
            maxDiscountRate?: number // 예: 총 할인 상한 30% (0.3)
            onlyBestOne?: boolean // true면 가장 큰 할인 하나만 적용
            exclusiveGroups?: string[]
        }
    ) {}

    calculate(ctx: PricingContext): PricingResult {
        // 1) 소계 계산: 단가 * 수량
        const subtotal = ctx.basePrice * ctx.quantity
        // 2) 모든 전략 실행 → 0원 초과인 유효 할인만 수집 (Null 안전: 타입 가드로 DiscountResult[] 확보)
        const applied: DiscountResult[] = this.strategies.map((s) => s.apply(ctx)).filter((r): r is DiscountResult => !!r && r.amount > 0)

        // 3) 옵션: 가장 큰 할인 하나만 남기기
        let selected = applied
        if (this.options?.onlyBestOne && applied.length > 0) {
            // 가장 큰 할인만 선별(정렬로 최댓값 선택)
            const best = [...applied].sort((a, b) => b.amount - a.amount)[0]!
            selected = [best]
        }

        // 4) 총 할인 상한(옵션): 선택된 할인들의 합을 계산하고 상한액을 구한다
        const totalRaw = selected.reduce((sum, d) => sum + d.amount, 0)
        // 상한액: 옵션이 주어지면 floor(소계 * 상한율), 아니면 무한대(상한 없음)
        const maxByRate = typeof this.options?.maxDiscountRate === 'number' ? Math.floor(subtotal * this.options.maxDiscountRate) : Infinity
        const totalDiscount = Math.min(totalRaw, maxByRate)

        // 5) 상한으로 잘려나간 경우, 각 항목의 비중(개별/총합)에 따라 금액을 재분배한다
        //    주의: Math.floor로 인해 총합이 소폭 줄 수 있다(잔여 보정 없음)
        const discounts =
            totalRaw > 0 && totalDiscount < totalRaw
                ? selected.map((d) => ({
                      ...d,
                      amount: Math.floor((d.amount / totalRaw) * totalDiscount)
                  }))
                : selected

        // 6) 최종 결제 금액: 소계 - 총할인, 음수는 0으로 방지
        const total = Math.max(0, subtotal - discounts.reduce((s, d) => s + d.amount, 0))

        return { subtotal, discounts, total }
    }
}
