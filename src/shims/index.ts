import { SimVar, simvar } from './SimVar';
import { Coherent } from './Coherent';
import { GetStoredData, SetStoredData } from './StoredData';
import { Avionics, BaseInstrument, GameState, LaunchFlowEvent, registerInstrument, RunwayDesignator } from './MsfsSdk';
import { aceFetch } from './fetch';

export function installShims(): void {
    // JS built-ins shims
    window.aceFetch = aceFetch;

    // MSFS global shims
    window.SimVar = SimVar;
    window.Coherent = Coherent;
    window.GetStoredData = GetStoredData;
    window.SetStoredData = SetStoredData;

    // MSFS Avionics Framework global shims
    window.simvar = simvar;
    window.BaseInstrument = BaseInstrument;
    window.registerInstrument = registerInstrument;
    window.RunwayDesignator = RunwayDesignator;
    window.GameState = GameState;
    window.Avionics = Avionics;
    window.LaunchFlowEvent = LaunchFlowEvent;
}
