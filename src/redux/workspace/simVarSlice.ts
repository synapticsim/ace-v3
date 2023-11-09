import { createSlice, Middleware, PayloadAction } from '@reduxjs/toolkit';
import { invoke } from '@tauri-apps/api/tauri';
import { Control, ControlType, SimVar, SimVarType } from '../../types';

export function parseSimVarName(name: string): {
    type: SimVarType;
    name: string;
    index: number;
    key: string;
} | undefined {
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

export function formatKey(v: SimVar): string {
    return `${v.type}:${v.name}:${v.index}`;
}

const simVarSlice = createSlice({
    name: 'simVars',
    initialState: {
        ids: {} as { [key: string]: number },
        vars: [] as SimVar[],
    },
    reducers: {
        newSimVar(state, action: PayloadAction<{ name: string, unit: string, value: string | number }>) {
            const { name, unit, value } = action.payload;

            const parsedName = parseSimVarName(name);
            if (parsedName === undefined) {
                throw new Error(`Invalid SimVar name: ${name}`);
            }

            if (!(parsedName.key in state.ids)) {
                state.ids[parsedName.key] = state.vars.push({
                    ...parsedName,
                    unit,
                    value,
                    control: unit === 'string' ? { type: ControlType.Text } : { type: ControlType.Slider, min: 0, max: 250 },
                }) - 1;
            }
        },
        setSimVar(state, action: PayloadAction<{ id: number, value: string | number }>) {
            const { id, value } = action.payload;

            if (state.vars[id] === undefined) {
                throw new Error(`Attempted to set non-existent SimVar with id ${id}`);
            }

            state.vars[id].value = value;
        },
        togglePin(state, action: PayloadAction<{ key: string }>) {
            const { key } = action.payload;

            if (key in state.ids) {
                const id = state.ids[key];
                state.vars[id].pinned = !state.vars[id].pinned;
            }
        },
        setControl(state, action: PayloadAction<{ key: string, control: Control }>) {
            const { key, control } = action.payload;

            if (key in state.ids) {
                const id = state.ids[key];
                state.vars[id].control = control;
            }
        },
    },
});

export const {
    newSimVar,
    setSimVar,
    togglePin,
    setControl,
} = simVarSlice.actions;
export const simVarsReducer = simVarSlice.reducer;

export const writeSimVarConfigMiddleware: Middleware = (store) => (next) => (action) => {
    next(action);

    // Ensure we don't write the initial, empty state to the filesystem
    if (store.getState().simVars.vars.length > 0) {
        invoke('save_simvars', { simvars: store.getState().simVars.vars }).catch(console.error);
    }
};
