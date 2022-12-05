import { workspaceStore } from '../redux/workspace';
import { parseSimVarName, setSimVar } from '../redux/workspace/simVarSlice';

export namespace SimVar {
    export function GetSimVarValue(name: string, unit: string): any {
        const parsedName = parseSimVarName(name);
        const defaultValue = unit === 'string' ? '' : 0;

        if (parsedName) {
            const state = workspaceStore.getState();

            if (parsedName.key in state.simVars) {
                return state.simVars[parsedName.key].value;
            }

            workspaceStore.dispatch(setSimVar({
                key: parsedName.key,
                unit,
                value: defaultValue,
            }));
        }

        return defaultValue;
    }

    export function SetSimVarValue(name: string, unit: string, value: string | number): any {
        const parsedName = parseSimVarName(name);

        if (parsedName) {
            workspaceStore.dispatch(setSimVar({
                key: parsedName.key,
                unit,
                value,
            }));
        }

        return 0;
    }
}
