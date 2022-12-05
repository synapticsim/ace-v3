import { createSlice, Middleware, PayloadAction } from '@reduxjs/toolkit';
import { invoke } from '@tauri-apps/api/tauri';
import { SimVarMap, SimVarType } from '../../types';

export function parseSimVarName(name: string): { type: SimVarType, name: string, index: number, key: string } | undefined {
    const match = name.match(/^(?:(?<type>[AEL]):)?(?<name>[^:]+)(?::(?<index>\d))?$/i);
    if (match) {
        const groups = match.groups as { type?: SimVarType, name?: string, index?: string };
        return {
            type: groups.type ?? 'A',
            name: groups.name ?? '',
            index: groups.index ? parseInt(groups.index) : 0,
            key: `${groups.type ?? 'A'}:${groups.name ?? ''}:${groups.index ?? 0}`,
        };
    }
    return undefined;
}

const simVarSlice = createSlice({
    name: 'simVars',
    initialState: {} as SimVarMap,
    reducers: {
        setSimVar(state, action: PayloadAction<{ key: string, unit: string, value: string | number }>) {
            const { key, unit, value } = action.payload;

            if (key in state) {
                state[key].unit = unit;
                state[key].value = value;
            } else {
                const parsedName = parseSimVarName(key);
                if (parsedName) {
                    state[key] = { ...parsedName, unit, value };
                }
            }
        },
        initializeSimVars(state, action: PayloadAction<{ simVars: SimVarMap }>) {
            for (const [key, value] of Object.entries(action.payload.simVars)) {
                state[key] = value;
            }
        },
        togglePin(state, action: PayloadAction<{ key: string }>) {
            const { key } = action.payload;

            if (key in state) {
                state[key].pinned = !state[key].pinned;
            }
        },
    },
});

export const { setSimVar, initializeSimVars, togglePin } = simVarSlice.actions;
export const simVarsReducer = simVarSlice.reducer;

export const writeSimVarConfigMiddleware: Middleware = (store) => (next) => (action) => {
    next(action);

    // Ensure we don't write the initial, empty state to the filesystem
    if (Object.keys(store.getState().simVars).length > 0) {
        invoke('save_simvars', { simvars: store.getState().simVars }).catch(console.error);
    }
};
