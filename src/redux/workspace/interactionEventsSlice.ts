import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const interactionEventsSlice = createSlice({
    name: 'contextMenu',
    initialState: {
        foundEvents: [] as string[],
    },
    reducers: {
        addEvent(state, action: PayloadAction<string>) {
            if (!state.foundEvents.includes(action.payload)) {
                state.foundEvents.push(action.payload);
            }
        },
    },
});

export const { addEvent } = interactionEventsSlice.actions;
export const interactionEventsReducer = interactionEventsSlice.reducer;
