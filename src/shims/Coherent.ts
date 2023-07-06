import { simvar } from './SimVar'

export namespace Coherent {
    export function trigger(name: string, ...data: any[]) {
        console.log('Coherent.trigger', name, data);
        return null;
    }

    export function on(name: string, callback: (...data: any[]) => void): { clear: () => void } {
        console.log('Coherent.on', name, callback);
        return { clear: () => null };
    }

    export function call(name: string, ...args: any[]): Promise<any> {
        console.log('Coherent.call', name, args);
        switch (name) {
            case 'setValueReg_String':
                return simvar.setValueReg_String(args[0], args[1]);
            case 'setValueReg_Bool':
                return simvar.setValueReg_Bool(args[0], args[1]);
            case 'setValueReg_Number':
                return simvar.setValueReg_Number(args[0], args[1]);
            case 'setValue_LatLongAlt':
                return simvar.setValue_LatLongAlt(args[0], args[1]);
            case 'setValue_LatLongAltPBH':
                return simvar.setValue_LatLongAltPBH(args[0], args[1]);
            case 'setValue_PBH':
                return simvar.setValue_PBH(args[0], args[1]);
            case 'setValue_PID_STRUCT':
                return simvar.setValue_PID_STRUCT(args[0], args[1]);
            case 'setValue_XYZ':
                return simvar.setValue_XYZ(args[0], args[1]);
        }
        return Promise.reject(`Unsupported Coherent call: ${name}`);
    }
}
