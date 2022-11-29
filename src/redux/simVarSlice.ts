import { createSlice, Middleware, PayloadAction } from '@reduxjs/toolkit';

type SimVarType = 'A' | 'E' | 'L';

export function parseSimVarName(name: string): { type: SimVarType, name: string, index: number, key: string } | undefined {
    const match = name.match(/^(?:(?<type>[AEL]):)?(?<name>[^:]+)(?::(?<index>\d))?$/i);
    if (match) {
        const groups = match.groups as { type?: SimVarType, name?: string, index?: number };
        return {
            type: groups.type ?? 'A',
            name: groups.name ?? '',
            index: groups.index ?? 0,
            key: `${groups.type ?? 'A'}:${groups.name ?? ''}:${groups.index ?? 0}`,
        };
    }
    return undefined;
}

export interface SimVar {
    type: SimVarType;
    key: string;
    name: string;
    index: number;
    unit: string;
    value: string | number;
    pinned?: boolean;
}

const simVarSlice = createSlice({
    name: 'simVars',
    initialState: {} as { [key: string]: SimVar },
    reducers: {
        setSimVar(state, action: PayloadAction<{ name: string, unit: string, value: string | number }>) {
            const { name, unit, value } = action.payload;

            const parsedName = parseSimVarName(name);

            if (parsedName) {
                if (parsedName.key in state) {
                    state[parsedName.key].unit = unit;
                    state[parsedName.key].value = value;
                } else {
                    state[parsedName.key] = { ...parsedName, unit, value };
                }
            }
        },
        togglePin(state, action: PayloadAction<string>) {
            const parsedName = parseSimVarName(action.payload);

            if (parsedName) {
                if (parsedName.key in state) {
                    state[parsedName.key].pinned = !state[parsedName.key].pinned;
                }
            }
        },
    },
});

export const { setSimVar, togglePin } = simVarSlice.actions;
export const simVarsReducer = simVarSlice.reducer;
export type SimVarState = ReturnType<typeof simVarSlice.reducer>;

export const loadSimVarConfigMiddleware: Middleware = (store) => (next) => {
    // TODO: Load simVar file from config
    return (action) => next(action);
};
