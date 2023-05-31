import { invoke } from '@tauri-apps/api/tauri';
import { createSlice, Middleware, PayloadAction } from '@reduxjs/toolkit';
import { Element, InstrumentConfig, AceProject } from '../../types';
import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../../pages/Workspace';

export function clampElementPosition(x: number, y: number, width: number, height: number): [number, number] {
    let newX = Math.round(x / 20) * 20;
    let newY = Math.round(y / 20) * 20;
    newX = Math.max(0, Math.min(CANVAS_WIDTH - width, newX));
    newY = Math.max(0, Math.min(CANVAS_HEIGHT - height, newY));

    return [newX, newY];
}

interface ProjectState {
    active?: AceProject;
    instruments: InstrumentConfig[];
}

const projectSlice = createSlice({
    name: 'project',
    initialState: { instruments: [] } as ProjectState,
    reducers: {
        setActive(state, action: PayloadAction<{ project: AceProject }>) {
            state.active = action.payload.project;
        },
        setInstruments(state, action: PayloadAction<{ instruments: InstrumentConfig[] }>) {
            state.instruments = action.payload.instruments;
        },
        addElement(state, action: PayloadAction<Element>) {
            if (state.active) {
                state.active.config.elements.push(action.payload);
            }
        },
        removeElement(state, action: PayloadAction<{ uuid: string }>) {
            if (state.active) {
                state.active.config.elements = state.active.config.elements.filter((element) => element.uuid !== action.payload.uuid);
            }
        },
        updateElementPosition(state, action: PayloadAction<{ uuid: string, dx: number, dy: number }>) {
            if (state.active) {
                const { uuid, dx, dy } = action.payload;
                const element = state.active.config.elements.find((i) => i.uuid === uuid);

                if (element !== undefined) {
                    const [newX, newY] = clampElementPosition(
                        element.x + dx,
                        element.y + dy,
                        element.width,
                        element.height,
                    );
                    element.x = newX;
                    element.y = newY;
                }
            }
        },
    },
});

export const { setActive, setInstruments, addElement, removeElement, updateElementPosition } = projectSlice.actions;
export const projectReducer = projectSlice.reducer;

export const updateElementsMiddleware: Middleware = (store) => (next) => (action) => {
    next(action);

    const project = store.getState().project.active;
    if (project !== undefined && (
        action.type === 'project/addElement'
        || action.type === 'project/removeElement'
        || action.type === 'project/updateElementPosition'
    )) {
        invoke('update_project', { newConfig: project.config }).catch(console.error)
    }
};
