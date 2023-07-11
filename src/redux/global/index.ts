import { createContext } from 'react';
import { createDispatchHook, createSelectorHook, ReactReduxContextValue } from 'react-redux';
import { AnyAction, combineReducers, configureStore, ThunkDispatch } from '@reduxjs/toolkit';
import { localStorageMiddleware, configReducer } from './configSlice';

const globalReducer = combineReducers({
    config: configReducer,
});

export const globalStore = configureStore({
    reducer: globalReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(localStorageMiddleware),
});

export type GlobalState = ReturnType<typeof globalStore.getState>;
export type GlobalDispatch = ThunkDispatch<GlobalState, {}, AnyAction>;

export const GlobalStoreContext = createContext({} as ReactReduxContextValue<GlobalState>);

export const useGlobalDispatch = createDispatchHook(GlobalStoreContext);
export const useGlobalSelector = createSelectorHook(GlobalStoreContext);
