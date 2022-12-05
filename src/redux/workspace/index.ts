import { createContext } from 'react';
import { createDispatchHook, createSelectorHook, ReactReduxContextValue } from 'react-redux';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { simVarsReducer, writeSimVarConfigMiddleware } from './simVarSlice';
import { contextMenuReducer } from './contextMenuSlice';

const workspaceReducer = combineReducers({
    simVars: simVarsReducer,
    contextMenu: contextMenuReducer,
});

export const workspaceStore = configureStore({
    reducer: workspaceReducer,
    middleware: [writeSimVarConfigMiddleware],
});

export type WorkspaceState = ReturnType<typeof workspaceStore.getState>;

export const WorkspaceStoreContext = createContext({} as ReactReduxContextValue<WorkspaceState>);

export const useWorkspaceDispatch = createDispatchHook(WorkspaceStoreContext);
export const useWorkspaceSelector = createSelectorHook(WorkspaceStoreContext);
