import React, { useMemo, useState } from 'react';
import { FiChevronDown, FiChevronLeft, FiChevronRight, FiSliders } from 'react-icons/fi';
import { Input, SliderInput } from '../Input';
import { ProjectState, useProjectDispatch, useProjectSelector } from '../../redux';
import { setSimVar, SimVar } from '../../redux/simVarSlice';
import { Menu } from './index';
import classNames from 'classnames'

interface SimVarSliderProps {
    name: string;
    unit: string;
}

interface SimVarSectionProps {
    type: string;
    simVars: SimVar[];
}

export const SimVarSection: React.FC<SimVarSectionProps> = ({ type, simVars }) => {
    const [collapsed, setCollapsed] = useState<boolean>(false);

    const filtered = useMemo(() => simVars.filter((v) => v.type === type), [type, simVars]);

    if (filtered.length === 0) return null;

    return (
        <>
            <div className="px-6 py-3 bg-midnight-700/50 flex items-center justify-between">
                <h5>
                    <big className="text-yellow-400">{type}</big> Vars
                </h5>
                <button onClick={() => setCollapsed(!collapsed)}>
                    <FiChevronLeft
                        size={30}
                        className={classNames(
                            'text-midnight-500 duration-200',
                            { 'rotate-0': collapsed, '-rotate-90': !collapsed },
                        )}
                    />
                </button>
            </div>
            <div
                className={classNames(
                    'overflow-hidden duration-300 ease-out',
                    { 'max-h-0': collapsed, 'max-h-80': !collapsed },
                )}
            >
                <div className="px-6 py-5 max-h-80 flex flex-col gap-2 overflow-y-scroll">
                    {filtered
                        .sort((a, b) => (a.name > b.name ? 1 : -1))
                        .map(({ name }) => (
                            <h6 key={name} className="font-mono flex gap-2">
                                <FiChevronRight size={24} />
                                {name}
                            </h6>
                        ))}
                </div>
            </div>
        </>
    );
}

interface SimVarsMenuProps {
    show?: boolean;
    onClick?: () => void;
    onExit?: () => void;
}

export const SimVarsMenu: React.FC<SimVarsMenuProps> = ({ ...props }) => {
    const [filter, setFilter] = useState<string>('');

    const simVars = useProjectSelector((state: ProjectState) => Object.values(state.simVars));

    const filtered = useMemo(
        () => simVars.filter((v) => v.name.toLowerCase().includes(filter.toLowerCase())),
        [simVars, filter],
    );

    return (
        <Menu title="SimVars" icon={<FiSliders size={25} />} {...props}>
            <div className="px-6 py-5">
                <Input
                    label=""
                    placeholder="Filter Variables"
                    onChange={(e) => setFilter(e.target.value)}
                />
            </div>
            <SimVarSection type="A" simVars={filtered} />
            <SimVarSection type="L" simVars={filtered} />
        </Menu>
    );
};
