import { globalStore } from '../redux/global';

export function aceFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
    const baseUrl = globalStore.getState().config.platform === 'win32'
        ? 'https://ace.localhost'
        : 'ace://localhost';

    if (typeof input === 'string' && input.startsWith('/')) {
        return fetch(`${baseUrl}${input}`, init);
    }
    return fetch(input, init);
}
