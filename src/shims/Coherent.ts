export namespace Coherent {
    export function trigger(name: string, ...data: any[]) {
        return null;
    }
    export function on(name: string, callback: (...data: any[]) => void): { clear: () => void } {
        return { clear: () => null };
    }

    export function call(name: string, ...args: any[]): Promise<any> {
        return Promise.resolve();
    }
}
