// 회원 등급
export type MemberTier = 'NEW' | 'SILVER' | 'GOLD' | 'VIP'
// 마켓 구분
export type Market = 'KR' | 'GLOBAL'

// 할인 계산에 필요한 입력값
export interface PricingContext {
    basePrice: number // 단가
    quantity: number // 수량
    memberTier?: MemberTier // 회원 등급
    coupon?: { type: 'AMOUNT' | 'RATE'; value: number; code?: string } // 쿠폰
    market?: Market // 마켓 구분
    now?: Date // 현재 시간 (계절할인 등에서 사용 가능)
}

// 단일 할인 결과
export interface DiscountResult {
    label: string // 설명 (예: "신규회원 5% 할인")
    amount: number // 할인 금액 (양수)
    meta?: Record<string, any> // 추가 데이터 (쿠폰 코드 등)
    group?: string // 배타 그룹 (membership, coupon, bulk 등)
}

// 최종 합산 결과
export interface PricingResult {
    subtotal: number // 총액 (할인 전)
    discounts: DiscountResult[] // 적용된 할인 라인
    total: number // 최종 결제 금액
}

// 전략 인터페이스
export interface PricingStrategy {
    apply(ctx: PricingContext): DiscountResult | null // 적용 가능하면 DiscountResult, 아니면 null
}

// 엔진 옵션
export interface PricingEngineOptions {
    maxDiscountRate?: number // 총 할인 상한 (예: 0.3 = 30%)
    onlyBestOne?: boolean // true면 가장 큰 할인 하나만
    exclusiveGroups?: string[] // 같은 그룹에서 하나만 허용
    roundingFix?: boolean // 상한 분배 시 반올림 보정
}
