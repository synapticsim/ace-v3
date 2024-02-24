import { aceFetch } from './shims/fetch';
import { SimVar, simvar } from './shims/SimVar';
import { Coherent } from './shims/Coherent';
import { GetStoredData, SetStoredData } from './shims/StoredData';
import { Avionics, BaseInstrument, GameState, LaunchFlowEvent, registerInstrument, RunwayDesignator } from './shims/MsfsSdk';

type CustomEventMap = {
    [key in 'triggerInteractionEvent']: CustomEvent<string>;
};

declare global {
    interface Window {
        aceFetch: typeof aceFetch;

        SimVar: typeof SimVar;
        Coherent: typeof Coherent;
        GetStoredData: typeof GetStoredData;
        SetStoredData: typeof SetStoredData;

        simvar: typeof simvar;
        BaseInstrument: typeof BaseInstrument;
        registerInstrument: typeof registerInstrument;
        RunwayDesignator: typeof RunwayDesignator;
        GameState: typeof GameState;
        Avionics: typeof Avionics;
        LaunchFlowEvent: typeof LaunchFlowEvent;

        registerInteractionEventRegister: (document: Document) => void;

        addEventListener<K extends keyof CustomEventMap>(type: K, listener: (this: Document, ev: CustomEventMap[K]) => void): void;
        removeEventListener<K extends keyof CustomEventMap>(type: K, listener: (this: Document, ev: CustomEventMap[K]) => void): void;
        dispatchEvent<K extends keyof CustomEventMap>(ev: CustomEventMap[K]): void;
    }
}
