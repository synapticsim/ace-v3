import { createContext } from 'react';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { createDispatchHook, createSelectorHook, ReactReduxContextValue } from 'react-redux';
import { loadSimVarConfigMiddleware, simVarsReducer } from './simVarSlice';

const projectReducer = combineReducers({
    simVars: simVarsReducer,
});

export const projectStore = configureStore({
    reducer: projectReducer,
    middleware: [loadSimVarConfigMiddleware],
});

export type ProjectState = ReturnType<typeof projectStore.getState>;

export const ProjectStoreContext = createContext({} as ReactReduxContextValue<ProjectState>);

export const useProjectDispatch = createDispatchHook(ProjectStoreContext);
export const useProjectSelector = createSelectorHook(ProjectStoreContext);
