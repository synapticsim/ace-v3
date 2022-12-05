import { ReactElement } from 'react';
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface ContextMenuState {
    active?: ReactElement;
}

const contextMenuSlice = createSlice({
    name: 'contextMenu',
    initialState: {} as ContextMenuState,
    reducers: {
        setMenu(state, action: PayloadAction<ReactElement>) {
            state.active = action.payload;
        },
        clearMenu(state) {
            state.active = undefined;
        }
    }
});

export const { setMenu, clearMenu } = contextMenuSlice.actions;
export const contextMenuReducer = contextMenuSlice.reducer;
