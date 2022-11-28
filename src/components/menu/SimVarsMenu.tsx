import React from 'react';
import { FiChevronDown, FiChevronRight, FiSliders } from 'react-icons/fi';
import { Input, SliderInput } from '../Input';
import { ProjectState, useProjectDispatch, useProjectSelector } from '../../redux';
import { setSimVar, SimVar } from '../../redux/simVarSlice';
import { Menu } from './index';

interface SimVarSliderProps {
    name: string;
    unit: string;
}

interface SimVarSectionProps {
    type: string;
    simVars: SimVar[];
}

export const SimVarSection: React.FC<SimVarSectionProps> = ({ type, simVars }) => (
    <>
        <div className="px-6 py-3 bg-midnight-700/50 flex items-center justify-between">
            <h5>
                <big className="text-yellow-400">{type}</big> Vars
            </h5>
            <FiChevronDown size={30} className="text-midnight-500" />
        </div>
        <div className="px-6 py-5">
            <div className="flex flex-col gap-2 max-h-96 overflow-hidden">
                {simVars.filter((v) => v.type === type).map(({ name }) => (
                    <h6 className="font-mono flex gap-2">
                        <FiChevronRight size={24} />
                        {name}
                    </h6>
                ))}
            </div>
        </div>
    </>
);

interface SimVarsMenuProps {
    show?: boolean;
    onClick?: () => void;
    onExit?: () => void;
}

export const SimVarsMenu: React.FC<SimVarsMenuProps> = ({ ...props }) => {
    const simVars = useProjectSelector((state: ProjectState) => Object.values(state.simVars));

    return (
        <Menu title="SimVars" icon={<FiSliders size={25} />} {...props}>
            <div className="px-6 py-5">
                <Input
                    label=""
                    placeholder="Filter Variables"
                />
            </div>
            <SimVarSection type="A" simVars={simVars} />
            <SimVarSection type="L" simVars={simVars} />
        </Menu>
    );
};
