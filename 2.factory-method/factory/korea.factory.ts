import { BulkPurchaseDiscountStrategy } from '../strategies/bulk.strategy'
import { CouponDiscountStrategy } from '../strategies/coupon.strategy'
import { NewMemberDiscountStrategy } from '../strategies/new-member.strategy'
import { PricingContext, PricingStrategy } from '../type/types'
import { DiscountStrategyFactory } from './base.factory'

export class KoreaDiscountFactory extends DiscountStrategyFactory {
    createStrategies(ctx: PricingContext): PricingStrategy[] {
        return [new NewMemberDiscountStrategy(0.05), new CouponDiscountStrategy(), new BulkPurchaseDiscountStrategy(10, 100)]
    }
}
