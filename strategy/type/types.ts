export type MemberTier = 'NEW' | 'IRON' | 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM'

export interface PricingContext {
    basePrice: number // 단품 가격
    quantity: number // 구매 수량
    memberTier?: MemberTier
    coupon?: {
        type: 'AMOUNT' | 'RATE' // 정액 / 정률
        value: number // 5, 10(%) ...
    }
    now?: Date // 시즌/기간 할인 등에 사용 (선택)
}

export interface DiscountResult {
    label: string // "신규회원 5% 할인" 등
    amount: number // 할인 금액(양수): 3,000원 할인 → 3000
    meta?: Record<string, any>
}

export interface PricingResult {
    subtotal: number // 원가 * 수량
    discounts: DiscountResult[] // 적용된 각 할인
    total: number // 최종 결제 금액 (0원 미만 방지)
}

export interface PricingStrategy {
    /** 적용 가능하면 할인 금액을 반환, 아니면 0 */
    apply(ctx: PricingContext): DiscountResult | null
}
