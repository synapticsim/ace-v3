import { SimVar } from './SimVar';
import { Coherent } from './Coherent';
import { GetStoredData, SetStoredData } from './StoredData';
import { BaseInstrument, registerInstrument } from './BaseInstrument'

interface InstrumentContentWindow extends Window {
    ACE_ENGINE_HANDLE: boolean;

    SimVar: typeof SimVar;
    Coherent: typeof Coherent;
    BaseInstrument: typeof BaseInstrument;
    GetStoredData: typeof GetStoredData;
    SetStoredData: typeof SetStoredData;

    registerInstrument: typeof registerInstrument;
}

export function installShims(window: Window): void {
    const instrument = window as InstrumentContentWindow;

    instrument.ACE_ENGINE_HANDLE = true;

    instrument.SimVar = SimVar;
    instrument.Coherent = Coherent;
    instrument.BaseInstrument = BaseInstrument;
    instrument.GetStoredData = GetStoredData;
    instrument.SetStoredData = SetStoredData;

    instrument.registerInstrument = registerInstrument;
}
