import { PricingStrategy } from '../type/types'

export class StrategyRegistry {
    private registry = new Map<string, PricingStrategy>()

    register(key: string, strategy: PricingStrategy) {
        if (this.registry.has(key)) {
            throw new Error(`Duplicate strategy key: ${key}`)
        }
        this.registry.set(key, strategy)
    }

    get(key: string): PricingStrategy {
        const s = this.registry.get(key)
        if (!s) throw new Error(`Strategy not found: ${key}`)
        return s
    }

    list(): string[] {
        return [...this.registry.keys()]
    }
}
