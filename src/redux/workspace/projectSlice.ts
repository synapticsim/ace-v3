import { createSlice, Middleware, PayloadAction } from '@reduxjs/toolkit';
import { Element, InstrumentConfig, ProjectConfig } from '../../types';
import { invoke } from '@tauri-apps/api/tauri'

export function clampElementPosition(x: number, y: number): [number, number] {
    let newX = Math.round(x / 20) * 20;
    let newY = Math.round(y / 20) * 20;
    newX = Math.max(0, Math.min(8000, newX));
    newY = Math.max(0, Math.min(5000, newY));

    return [newX, newY];
}

interface ProjectState {
    active?: ProjectConfig;
    instruments: InstrumentConfig[];
    interactable?: boolean;
}

const projectSlice = createSlice({
    name: 'project',
    initialState: { instruments: [] } as ProjectState,
    reducers: {
        setActive(state, action: PayloadAction<{ project: ProjectConfig }>) {
            state.active = action.payload.project;
        },
        setInstruments(state, action: PayloadAction<{ instruments: InstrumentConfig[] }>) {
            state.instruments = action.payload.instruments;
        },
        setInteractable(state, action: PayloadAction<{ interactable: boolean }>) {
            state.interactable = action.payload.interactable;
        },
        addElement(state, action: PayloadAction<Element>) {
            if (state.active) {
                state.active.elements.push(action.payload);
            }
        },
        removeElement(state, action: PayloadAction<{ uuid: string }>) {
            if (state.active) {
                state.active.elements = state.active.elements.filter((element) => element.uuid !== action.payload.uuid);
            }
        },
        updateElementPosition(state, action: PayloadAction<{ uuid: string, dx: number, dy: number }>) {
            if (state.active) {
                const { uuid, dx, dy } = action.payload;
                const element = state.active.elements.find((i) => i.uuid === uuid);

                if (element !== undefined) {
                    const [newX, newY] = clampElementPosition(element.x + dx, element.y + dy);
                    element.x = newX;
                    element.y = newY;
                }
            }
        },
    },
});

export const { setActive, setInstruments, setInteractable, addElement, removeElement, updateElementPosition } = projectSlice.actions;
export const projectReducer = projectSlice.reducer;

export const updateElementsMiddleware: Middleware = (store) => (next) => (action) => {
    next(action);

    const newConfig = store.getState().project.active;
    if (newConfig !== undefined && (
        action.type === 'project/addElement'
        || action.type === 'project/removeElement'
        || action.type === 'project/updateElementPosition'
    )) {
        invoke('update_project', { newConfig }).catch(console.error)
    }
};
