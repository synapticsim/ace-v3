import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { InstrumentConfig, ProjectConfig } from '../../types';

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
                    element.x = Math.round((element.x + dx) / 20) * 20;
                    element.y = Math.round((element.y + dy) / 20) * 20;
                }
            }
        },
    },
});

export const { setActive, setInstruments, updateElementPosition } = projectSlice.actions;
export const projectReducer = projectSlice.reducer;
