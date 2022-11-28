import { projectStore } from '../redux';
import { parseSimVarName, setSimVar } from '../redux/simVarSlice';

export namespace SimVar {
    export function GetSimVarValue(name: string, unit: string): any {
        const state = projectStore.getState();
        const parsedName = parseSimVarName(name);
        const defaultValue = unit === 'string' ? '' : 0;

        if (parsedName) {
            if (parsedName.key in state.simVars) {
                return state.simVars[parsedName.key].value;
            }

            projectStore.dispatch(setSimVar({ name, unit, value: defaultValue }));
        }

        return defaultValue;
    }

    export function SetSimVarValue(name: string, unit: string, value: string | number): any {
        projectStore.dispatch(setSimVar({ name, unit, value }));
        return value;
    }
}
