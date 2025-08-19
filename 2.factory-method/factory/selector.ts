import { Market, PricingContext } from '../type/types'
import { DiscountStrategyFactory } from './base.factory'
import { GlobalDiscountFactory } from './global.factory'
import { KoreaDiscountFactory } from './korea.factory'

export function selectFactory(market: Market): DiscountStrategyFactory {
    switch (market) {
        case 'KR':
            return new KoreaDiscountFactory()
        case 'GLOBAL':
            return new GlobalDiscountFactory()
    }
}

/** 편의 함수: 컨텍스트의 market으로 전략 배열 생성 */
export function createStrategiesByMarket(ctx: PricingContext) {
    return selectFactory(ctx.market ?? 'GLOBAL').createStrategies(ctx)
}
