export class BaseInstrument {
    protected constructor() {}
    public connectedCallback(): void {}
    public Update(): void {}
}

export function registerInstrument(id: string, Instrument: new() => BaseInstrument) {
    const instance = new Instrument();

    instance.connectedCallback();
    window.setInterval(() => instance.Update(), 50);
}
