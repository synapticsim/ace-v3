import { SimVar, simvar } from './SimVar';
import { Coherent } from './Coherent';
import { GetStoredData, SetStoredData } from './StoredData';
import { Avionics, BaseInstrument, GameState, LaunchFlowEvent, registerInstrument, RunwayDesignator } from './MsfsSdk';
import { aceFetch } from './fetch';
import { workspaceStore } from '../redux/workspace';
import { addEvent } from '../redux/workspace/interactionEventsSlice';

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

    window.handleInteractionEventRegister = (key: string) => {
        workspaceStore.dispatch(addEvent(key));
    };
}
