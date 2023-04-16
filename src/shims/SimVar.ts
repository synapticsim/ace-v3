import { workspaceStore } from '../redux/workspace';
import { newSimVar, parseSimVarName, setSimVar } from '../redux/workspace/simVarSlice';

/**
 * Handles calls to SimVar without msfs-sdk.
 */
export namespace SimVar {
    export function GetRegisteredId(name: string, unit: string): number {
        const state = workspaceStore.getState();
        const parsedName = parseSimVarName(name);

        if (parsedName === undefined) {
            throw new Error(`Invalid SimVar name ${name}`);
        }

        if (!(parsedName.key in state.simVars.ids)) {
            const defaultValue = unit === 'string' ? '' : 0;
            workspaceStore.dispatch(newSimVar({ name, unit, value: defaultValue }));
        }

        return state.simVars.ids[parsedName.key];
    }

    export function GetSimVarValue(name: string, unit: string): any {
        const id = GetRegisteredId(name, unit);
        return workspaceStore.getState().simVars.vars[id].value;
    }

    export function SetSimVarValue(name: string, unit: string, value: string | number): any {
        const id = GetRegisteredId(name, unit);
        workspaceStore.dispatch(setSimVar({ id, value }));
        return value;
    }
}

/**
 Handles calls to SimVar with msfs-sdk.
 */
export namespace simvar {
    export function getValueReg(registeredId: number) {
        const state = workspaceStore.getState();
        return state.simVars.vars[registeredId].value;
    }

    export function getValueReg_String(registeredId: number) {
        return getValueReg(registeredId);
    }
    export function getValue_LatLongAlt(registeredId: number) {
        return getValueReg(registeredId);
    }
    export function getValue_LatLongAltPBH(registeredId: number) {
        return getValueReg(registeredId);
    }
    export function getValue_PBH(registeredId: number) {
        return getValueReg(registeredId);
    }
    export function getValue_PID_STRUCT(registeredId: number) {
        return getValueReg(registeredId);
    }
    export function getValue_XYZ(registeredId: number) {
        return getValueReg(registeredId);
    }

    export function setValueReg(registeredId: number, value: any) {
        workspaceStore.dispatch(setSimVar({ id: registeredId, value }));
        return value;
    }

    export function setValueReg_String(registeredId: number, value: any) {
        return setValueReg(registeredId, value);
    }
    export function setValueReg_Bool(registeredId: number, value: any) {
        return setValueReg(registeredId, value);
    }
    export function setValueReg_Number(registeredId: number, value: any) {
        return setValueReg(registeredId, value);
    }
    export function setValue_LatLongAlt(registeredId: number, value: any) {
        return setValueReg(registeredId, value);
    }
    export function setValue_LatLongAltPBH(registeredId: number, value: any) {
        return setValueReg(registeredId, value);
    }
    export function setValue_PBH(registeredId: number, value: any) {
        return setValueReg(registeredId, value);
    }
    export function setValue_PID_STRUCT(registeredId: number, value: any) {
        return setValueReg(registeredId, value);
    }
    export function setValue_XYZ(registeredId: number, value: any) {
        return setValueReg(registeredId, value);
    }
}
