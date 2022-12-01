import { projectStore } from '../redux';
import { parseSimVarName, setSimVar } from '../redux/simVarSlice';

export namespace SimVar {
    export function GetSimVarValue(name: string, unit: string): any {
        const parsedName = parseSimVarName(name);
        const defaultValue = unit === 'string' ? '' : 0;

        if (parsedName) {
            const state = projectStore.getState();

            if (parsedName.key in state.simVars) {
                return state.simVars[parsedName.key].value;
            }

            projectStore.dispatch(setSimVar({
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
            projectStore.dispatch(setSimVar({
                key: parsedName.key,
                unit,
                value,
            }));
        }

        return 0;
    }
}
