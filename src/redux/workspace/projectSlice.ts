import { createSlice, Middleware, PayloadAction } from '@reduxjs/toolkit';
import { InstrumentConfig, ProjectConfig } from '../../types';
import { invoke } from '@tauri-apps/api/tauri'

interface ProjectState {
    active?: ProjectConfig;
    instruments: InstrumentConfig[];
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
        updateElementPosition(state, action: PayloadAction<{ uuid: string, dx: number, dy: number }>) {
            if (state.active) {
                const { uuid, dx, dy } = action.payload;
                const element = state.active.elements.find((i) => i.uuid === uuid);

                if (element !== undefined) {
                    const newX = Math.round((element.x + dx) / 20) * 20;
                    const newY = Math.round((element.y + dy) / 20) * 20;
                    element.x = Math.max(0, Math.min(8000, newX));
                    element.y = Math.max(0, Math.min(5000, newY));
                }
            }
        },
    },
});

export const { setActive, setInstruments, updateElementPosition } = projectSlice.actions;
export const projectReducer = projectSlice.reducer;

export const updateElementsMiddleware: Middleware = (store) => (next) => (action) => {
    next(action);

    const newConfig = store.getState().project.active;
    if (newConfig !== undefined && action.type === 'project/updateElementPosition') {
        invoke('update_project', { newConfig }).catch(console.error)
    }
};
