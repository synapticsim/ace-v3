import { createAsyncThunk, createSlice, Middleware, PayloadAction } from '@reduxjs/toolkit';
import { Platform, platform as getPlatform } from '@tauri-apps/api/os';
import { getVersion } from '@tauri-apps/api/app';
import { AceProject } from '../../types';
import { ThemeConfig, fallbackThemeConfig } from './ui/uitheme';

const THEME_LOCAL_STORAGE_KEY = 'ace_ui_theme';

export interface RecentProject {
    name: string;
    path: string;
    timestamp: string;
}

interface ConfigState {
    platform?: Platform;
    version?: string;
    recentProjects?: RecentProject[];
    theme?: ThemeConfig;
}

const configSlice = createSlice({
    name: 'config',
    initialState: {
        theme: JSON.parse(localStorage.getItem(THEME_LOCAL_STORAGE_KEY)!) as ThemeConfig,
    } as ConfigState,
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
        setTheme: (state, action: PayloadAction<ThemeConfig>) => {
            state.theme = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(initConfig.fulfilled, (state, action) => action.payload);
    },
});

const LOCAL_STORAGE_KEY = 'ace_recent_projects';

export const { pushRecentProject, setTheme } = configSlice.actions;
export const configReducer = configSlice.reducer;

export const localStorageMiddleware: Middleware = (store) => (next) => (action) => {
    next(action);

    const { recentProjects, theme } = store.getState().config;
    if (recentProjects !== undefined) {
        localStorage.setItem(
            LOCAL_STORAGE_KEY,
            JSON.stringify(recentProjects),
        );
    }

    if (theme !== undefined) {
        localStorage.setItem(
            THEME_LOCAL_STORAGE_KEY,
            JSON.stringify(theme),
        );
    }
};

export const logger: Middleware = (store) => (next) => (action) => {
    console.group(action.type);
    console.info('dispatching', action);
    const result = next(action);
    console.log('next state', store.getState());
    console.groupEnd();
    return result;
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

        const storedTheme = localStorage.getItem(THEME_LOCAL_STORAGE_KEY);
        const theme = storedTheme !== null ? JSON.parse(storedTheme) as ThemeConfig : fallbackThemeConfig;

        return { platform, version, recentProjects, theme };
    },
);
