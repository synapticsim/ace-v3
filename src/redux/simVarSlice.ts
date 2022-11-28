import { createSlice, Middleware, PayloadAction } from '@reduxjs/toolkit';

export function parseSimVarName(name: string): { type: 'A' | 'L', name: string, key: string } | undefined {
    const match = name.match(/^(?:(?<type>[AL]):)?(?<name>.*)$/i);
    if (match) {
        const groups = match.groups as { type?: 'A' | 'L', name?: string };
        return {
            type: groups.type ?? 'A',
            name: groups.name ?? '',
            key: `${groups.type ?? 'A'}:${groups.name ?? ''}`,
        };
    }
    return undefined;
}

export interface SimVar {
    type: 'A' | 'L';
    name: string;
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
                if (name in state) {
                    state[parsedName.key].unit = unit;
                    state[parsedName.key].value = value;
                } else {
                    state[parsedName.key] = { ...parsedName, unit, value };
                }
            }
        },
    },
});

export const { setSimVar } = simVarSlice.actions;
export const simVarsReducer = simVarSlice.reducer;
export type SimVarState = ReturnType<typeof simVarSlice.reducer>;

export const loadSimVarConfigMiddleware: Middleware = (store) => (next) => {
    // TODO: Load simVar file from config
    return (action) => next(action);
};
