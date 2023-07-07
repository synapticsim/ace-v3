import { createAsyncThunk, createSlice, Middleware, PayloadAction } from '@reduxjs/toolkit';
import { Platform, platform as getPlatform } from '@tauri-apps/api/os';
import { getVersion } from '@tauri-apps/api/app';
import { AceProject } from '../../types';

export interface RecentProject {
    name: string;
    path: string;
    timestamp: string;
}

interface ConfigState {
    platform?: Platform;
    version?: string;
    recentProjects?: RecentProject[];
}

const configSlice = createSlice({
    name: 'config',
    initialState: {} as ConfigState,
    reducers: {
        pushRecentProject(state, action: PayloadAction<AceProject>) {
            if (state.recentProjects === undefined) return;

            const project = action.payload;
            state.recentProjects = state.recentProjects.filter((recent) => recent.path !== project.path);
            state.recentProjects.unshift({
                name: project.config.name,
                path: project.path,
                timestamp: new Date().toISOString(),
            });
        },
    },
    extraReducers: (builder) => {
        builder.addCase(initConfig.fulfilled, (state, action) => action.payload);
    },
});

export const { pushRecentProject } = configSlice.actions;
export const configReducer = configSlice.reducer;

const LOCAL_STORAGE_KEY = 'ace_recent_projects';

export const localStorageMiddleware: Middleware = (store) => (next) => (action) => {
    next(action);

    const { recentProjects } = store.getState().config;
    if (recentProjects !== undefined) {
        localStorage.setItem(
            LOCAL_STORAGE_KEY,
            JSON.stringify(recentProjects),
        );
    }
};

export const initConfig = createAsyncThunk(
    'config/initialize',
    async () => {
        const platform = await getPlatform();
        const version = await getVersion();

        const local = localStorage.getItem(LOCAL_STORAGE_KEY);
        const recentProjects = local === null
            ? []
            : JSON.parse(local) as RecentProject[];

        return { platform, version, recentProjects };
    },
);
