import { SimVar } from './SimVar';
import { Coherent } from './Coherent';
import { GetStoredData, SetStoredData } from './StoredData';

interface InstrumentContentWindow extends Window {
    ACE_ENGINE_HANDLE: boolean;

    SimVar: typeof SimVar;
    Coherent: typeof Coherent;
    GetStoredData: typeof GetStoredData;
    SetStoredData: typeof SetStoredData;
}

export function installShims(window: Window): void {
    const instrument = window as InstrumentContentWindow;

    instrument.ACE_ENGINE_HANDLE = true;

    instrument.SimVar = SimVar;
    instrument.Coherent = Coherent;
    instrument.GetStoredData = GetStoredData;
    instrument.SetStoredData = SetStoredData;
}
