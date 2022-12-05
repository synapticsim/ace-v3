import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProjectConfig } from '../../types';

interface ProjectState {
    active?: ProjectConfig;
    instruments: string[];
}

const projectSlice = createSlice({
    name: 'project',
    initialState: { instruments: [] } as ProjectState,
    reducers: {
        setActive(state, action: PayloadAction<{ project: ProjectConfig }>) {
            state.active = action.payload.project;
        },
        setInstruments(state, action: PayloadAction<{ instruments: string[] }>) {
            state.instruments = action.payload.instruments;
        },
    }
});

export const { setActive, setInstruments } = projectSlice.actions;
export const projectReducer = projectSlice.reducer;
