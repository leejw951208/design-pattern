import { AbstractHandler } from './base-handler'
import { ChainContext, DiscountResult } from './types'

// 회원 등급별 정률 할인
export class TierDiscountHandler extends AbstractHandler {
    protected process(ctx: ChainContext): ChainContext {
        const logs = [...(ctx.logs || []), 'TierDiscountHandler']
        if (!ctx.subtotal) return { ...ctx, logs }

        const rateMap: Record<string, number> = {
            NEW: 0.05,
            SILVER: 0.07,
            GOLD: 0.1,
            VIP: 0.15
        }
        const rate = ctx.memberTier ? rateMap[ctx.memberTier] ?? 0 : 0
        if (rate <= 0) return { ...ctx, logs }

        const amount = Math.floor(ctx.subtotal * rate)
        const discount: DiscountResult = { label: `회원등급 ${ctx.memberTier} 할인`, amount }
        const discounts = [...(ctx.discounts || []), discount]
        return { ...ctx, discounts, logs }
    }
}

// 대량 구매 시 정률 할인
export class BulkDiscountHandler extends AbstractHandler {
    constructor(private readonly threshold: number = 10, private readonly rate: number = 0.05) {
        super()
    }

    protected process(ctx: ChainContext): ChainContext {
        const logs = [...(ctx.logs || []), 'BulkDiscountHandler']
        if (!ctx.subtotal) return { ...ctx, logs }
        if (ctx.quantity < this.threshold) return { ...ctx, logs }
        const amount = Math.floor(ctx.subtotal * this.rate)
        const discount: DiscountResult = { label: `대량구매 ${this.threshold}+개`, amount }
        const discounts = [...(ctx.discounts || []), discount]
        return { ...ctx, discounts, logs }
    }
}

// 쿠폰 정액/정률 할인
export class CouponDiscountHandler extends AbstractHandler {
    protected process(ctx: ChainContext): ChainContext {
        const logs = [...(ctx.logs || []), 'CouponDiscountHandler']
        if (!ctx.subtotal || !ctx.coupon) return { ...ctx, logs }
        const { type, value } = ctx.coupon
        let amount = 0
        if (type === 'AMOUNT') amount = value
        else if (type === 'RATE') amount = Math.floor(ctx.subtotal * (value / 100))
        if (amount <= 0) return { ...ctx, logs }
        const discount: DiscountResult = { label: '쿠폰 할인', amount, meta: { code: ctx.coupon.code } }
        const discounts = [...(ctx.discounts || []), discount]
        return { ...ctx, discounts, logs }
    }
}

// 총할인 상한 적용 및 최종 합계 계산
export class CapAndTotalizeHandler extends AbstractHandler {
    protected process(ctx: ChainContext): ChainContext {
        const logs = [...(ctx.logs || []), 'CapAndTotalizeHandler']
        const subtotal = ctx.subtotal ?? 0
        const discounts = ctx.discounts || []
        const raw = discounts.reduce((s, d) => s + d.amount, 0)
        const cap = typeof ctx.maxDiscountRate === 'number' ? Math.floor(subtotal * ctx.maxDiscountRate) : Infinity
        const totalDiscount = Math.min(raw, cap)
        const total = Math.max(0, subtotal - totalDiscount)
        return { ...ctx, total, logs }
    }
}
