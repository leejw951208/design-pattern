// 체인에서 사용할 도메인 타입들

export type MemberTier = 'NEW' | 'SILVER' | 'GOLD' | 'VIP'
export type Market = 'KR' | 'GLOBAL'

export interface Coupon {
    type: 'AMOUNT' | 'RATE'
    value: number
    code?: string
}

export interface DiscountResult {
    label: string
    amount: number
    meta?: Record<string, any>
}

// 체인을 통과하며 점진적으로 채워지는 컨텍스트
export interface ChainContext {
    basePrice: number
    quantity: number
    memberTier?: MemberTier
    coupon?: Coupon
    market?: Market
    stock?: number
    now?: Date

    // 계산 중간값들 (핸들러 간 전달)
    subtotal?: number
    discounts: DiscountResult[]
    total?: number

    // 제어/추적용
    discountApplied?: boolean // 첫 적용 후 추가 핸들러 중단 용도(CoR 특성)
    maxDiscountRate?: number // 총 할인 상한 (예: 0.3)
    logs: string[]
}

export interface Handler<T = ChainContext> {
    setNext(next: Handler<T>): Handler<T>
    handle(ctx: T): T
}
