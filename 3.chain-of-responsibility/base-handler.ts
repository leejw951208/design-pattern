import { ChainContext, Handler } from './types'

// 공통 핸들러: 템플릿 메서드로 처리 후 다음 핸들러로 위임
export abstract class AbstractHandler implements Handler<ChainContext> {
    protected next?: Handler<ChainContext>

    // 다음 핸들러 연결(유창 인터페이스)
    setNext(next: Handler<ChainContext>): Handler<ChainContext> {
        this.next = next
        return next
    }

    // 처리 → 중단 조건 검사 → 다음으로 위임
    handle(ctx: ChainContext): ChainContext {
        const updated = this.process(ctx)
        if (this.shouldStop(updated)) return updated
        return this.next ? this.next.handle(updated) : updated
    }

    // 구체 핸들러가 구현할 처리 로직
    protected abstract process(ctx: ChainContext): ChainContext

    // true면 체인 중단
    protected shouldStop(ctx: ChainContext): boolean {
        return false
    }
}
