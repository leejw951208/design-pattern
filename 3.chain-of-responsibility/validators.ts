import { AbstractHandler } from './base-handler'
import { ChainContext } from './types'

// 금액/수량 기본 검증 및 소계 계산
export class InputValidator extends AbstractHandler {
    protected process(ctx: ChainContext): ChainContext {
        const logs = [...(ctx.logs || []), 'InputValidator']
        if (ctx.basePrice <= 0 || ctx.quantity <= 0) {
            return { ...ctx, subtotal: 0, discounts: [], total: 0, logs }
        }
        const subtotal = ctx.basePrice * ctx.quantity
        return { ...ctx, subtotal, logs }
    }
}

// 회원 관련 기본 검증(확장 포인트)
export class MemberValidator extends AbstractHandler {
    protected process(ctx: ChainContext): ChainContext {
        const logs = [...(ctx.logs || []), 'MemberValidator']
        // 별도 제약 없음. 존재만 확인
        return { ...ctx, logs }
    }
}

// 쿠폰 형식/값 검증(부적합하면 쿠폰 제거)
export class CouponValidator extends AbstractHandler {
    protected process(ctx: ChainContext): ChainContext {
        const logs = [...(ctx.logs || []), 'CouponValidator']
        if (!ctx.coupon) return { ...ctx, logs }
        const { type, value } = ctx.coupon
        const invalid = (type === 'AMOUNT' && value <= 0) || (type === 'RATE' && (value <= 0 || value >= 100))
        if (invalid) {
            const { coupon, ...rest } = ctx
            return { ...rest, logs }
        }
        return { ...ctx, logs }
    }
}

// 재고 검증(부족하면 금액 0 처리로 단락 효과)
export class StockValidator extends AbstractHandler {
    protected process(ctx: ChainContext): ChainContext {
        const logs = [...(ctx.logs || []), 'StockValidator']
        if (typeof ctx.stock === 'number' && ctx.quantity > ctx.stock) {
            return { ...ctx, subtotal: 0, discounts: [], total: 0, logs }
        }
        return { ...ctx, logs }
    }
}
