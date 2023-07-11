import { SimVar, simvar } from './SimVar';
import { Coherent } from './Coherent';
import { GetStoredData, SetStoredData } from './StoredData';
import { Avionics, BaseInstrument, GameState, LaunchFlowEvent, registerInstrument, RunwayDesignator } from './MsfsSdk';
import { aceFetch } from './fetch';

interface InstrumentContentWindow extends Window {
    ACE_ENGINE_HANDLE: boolean;

    fetch: typeof aceFetch;

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

export function installShims(window: Window): void {
    const instrument = window as InstrumentContentWindow;

    instrument.ACE_ENGINE_HANDLE = true;

    instrument.fetch = aceFetch;

    instrument.SimVar = SimVar;
    instrument.Coherent = Coherent;
    instrument.GetStoredData = GetStoredData;
    instrument.SetStoredData = SetStoredData;

    instrument.simvar = simvar;
    instrument.BaseInstrument = BaseInstrument;
    instrument.registerInstrument = registerInstrument;
    instrument.RunwayDesignator = RunwayDesignator;
    instrument.GameState = GameState;
    instrument.Avionics = Avionics;
    instrument.LaunchFlowEvent = LaunchFlowEvent;
}
