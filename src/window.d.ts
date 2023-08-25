import { aceFetch } from './shims/fetch';
import { SimVar, simvar } from './shims/SimVar';
import { Coherent } from './shims/Coherent';
import { GetStoredData, SetStoredData } from './shims/StoredData';
import { Avionics, BaseInstrument, GameState, LaunchFlowEvent, registerInstrument, RunwayDesignator } from './shims/MsfsSdk';

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
    }
}
