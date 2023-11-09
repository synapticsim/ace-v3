import { createContext } from 'react';
import { createDispatchHook, createSelectorHook, ReactReduxContextValue } from 'react-redux';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { simVarsReducer, writeSimVarConfigMiddleware } from './simVarSlice';
import { contextMenuReducer } from './contextMenuSlice';
import { projectReducer, updateElementsMiddleware } from './projectSlice';
import { interactionEventsReducer } from './interactionEventsSlice';

const workspaceReducer = combineReducers({
    simVars: simVarsReducer,
    contextMenu: contextMenuReducer,
    project: projectReducer,
    interactionEvents: interactionEventsReducer,
});

export const workspaceStore = configureStore({
    reducer: workspaceReducer,
    middleware: [writeSimVarConfigMiddleware, updateElementsMiddleware],
});

export type WorkspaceState = ReturnType<typeof workspaceStore.getState>;

export const WorkspaceStoreContext = createContext({} as ReactReduxContextValue<WorkspaceState>);

export const useWorkspaceDispatch = createDispatchHook(WorkspaceStoreContext);
export const useWorkspaceSelector = createSelectorHook(WorkspaceStoreContext);
