import { BulkPurchaseDiscountStrategy } from '../strategies/bulk.strategy'
import { CouponDiscountStrategy } from '../strategies/coupon.strategy'
import { TierDiscountStrategy } from '../strategies/tier.strategy'
import { PricingContext, PricingStrategy } from '../type/types'
import { DiscountStrategyFactory } from './base.factory'

/** 글로벌 마켓 규칙(예시): 등급 + 쿠폰 + 대량구매 (신규 미적용) */
export class GlobalDiscountFactory extends DiscountStrategyFactory {
    createStrategies(ctx: PricingContext): PricingStrategy[] {
        return [new TierDiscountStrategy(), new CouponDiscountStrategy(), new BulkPurchaseDiscountStrategy(10, 150)]
    }
}
