export interface IHandler<T, R> {
    handle(request: T): Promise<R>;
}

export class Mediator {
    private handlers = new Map<string, IHandler<any, any>>();

    public register<T, R>(key: string, handler: IHandler<T, R>) {
        this.handlers.set(key, handler);
    }

    public async send<T, R>(key: string, payload: T): Promise<R> {
        const handler = this.handlers.get(key);
        if (!handler) {
            throw new Error(`No handler registered for ${key}`);
        }
        return handler.handle(payload);
    }
}

export const mediator = new Mediator();