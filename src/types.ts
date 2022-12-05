export interface ProjectConfig {
    name: string;
    paths: {
        instruments: string;
        bundles: string;
        html_ui: string;
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

export interface SimVarMap {
    [key: string]: SimVar;
}
