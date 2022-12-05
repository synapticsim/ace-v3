import { createContext } from 'react';
import { createDispatchHook, createSelectorHook, ReactReduxContextValue } from 'react-redux';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { configReducer, initializeConfigMiddleware } from './configSlice';
import { projectReducer } from './projectSlice';

const globalReducer = combineReducers({
    config: configReducer,
    project: projectReducer,
});

export const globalStore = configureStore({
    reducer: globalReducer,
    middleware: [initializeConfigMiddleware],
});

export type GlobalState = ReturnType<typeof globalStore.getState>;

export const GlobalStoreContext = createContext({} as ReactReduxContextValue<GlobalState>);

export const useGlobalDispatch = createDispatchHook(GlobalStoreContext);
export const useGlobalSelector = createSelectorHook(GlobalStoreContext);
