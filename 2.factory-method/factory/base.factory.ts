import { PricingContext, PricingStrategy } from '../type/types'

export abstract class DiscountStrategyFactory {
    abstract createStrategies(ctx: PricingContext): PricingStrategy[]
}
