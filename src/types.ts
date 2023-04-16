export type ElementType = 'Instrument';

export interface Element {
    uuid: string;
    name: string;
    element: ElementType;
    width: number;
    height: number;
    x: number;
    y: number;
}

export interface ProjectConfig {
    name: string;
    paths: {
        instruments: string;
        bundles: string;
        html_ui: string;
    };
    elements: Element[];
}

export interface InstrumentConfig {
    index: string;
    isInteractive: boolean;
    name: string;
    dimensions: {
        width: number;
        height: number;
    };
}

export type SimVarType = 'A' | 'E' | 'L';

export interface SimVar {
    type: SimVarType;
    name: string;
    index: number;
    unit: string;
    value: string | number;
    pinned?: boolean;
}
