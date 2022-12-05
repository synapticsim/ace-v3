import { createSlice, Middleware, PayloadAction } from '@reduxjs/toolkit'
import { platform } from '@tauri-apps/api/os'

interface ConfigState {
    baseUrl?: string;
}

const configSlice = createSlice({
    name: 'config',
    initialState: {} as ConfigState,
    reducers: {
        setBaseUrl(state, action: PayloadAction<string>) {
            state.baseUrl = action.payload;
        }
    }
})

export const { setBaseUrl } = configSlice.actions;
export const configReducer = configSlice.reducer;

export const initializeConfigMiddleware: Middleware = (store) => (next) => {
    platform()
        .then((platform) => {
            if (platform === 'win32') {
                store.dispatch(setBaseUrl('https://ace.localhost'));
            } else {
                store.dispatch(setBaseUrl('ace://localhost'));
            }
        });

    return (action) => next(action);
}
