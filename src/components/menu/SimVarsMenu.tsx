import React, { useMemo, useState } from 'react';
import { FiChevronLeft, FiChevronRight, FiSliders } from 'react-icons/fi';
import { RiPushpin2Line } from 'react-icons/ri';
import classNames from 'classnames';
import { Input } from '../Input';
import { ProjectState, useProjectDispatch, useProjectSelector } from '../../redux';
import { SimVar, togglePin } from '../../redux/simVarSlice';
import { Menu } from './index';

interface SimVarSliderProps {
    simVar: SimVar;
}

const SimVarSlider: React.FC<SimVarSliderProps> = ({ simVar }) => {
    const dispatch = useProjectDispatch();

    return (
        <h6 className="font-mono flex items-center gap-1">
            <button onClick={() => dispatch(togglePin(`${simVar.type}:${simVar.name}`))}>
                <RiPushpin2Line
                    size={20}
                    className={classNames({ 'text-yellow-400': simVar.pinned, 'text-midnight-700': !simVar.pinned })}
                />
            </button>
            <FiChevronRight size={24} />
            {simVar.name}
        </h6>
    );
};

interface SimVarSectionProps {
    simVars: SimVar[];
}

const SimVarSection: React.FC<SimVarSectionProps> = ({ simVars }) => (
    <div
        className={classNames(
            'px-6 py-5 max-h-80 flex flex-col gap-2 overflow-y-scroll',
            'scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-midnight-700/25',
        )}
    >
        {simVars.map((simVar) => <SimVarSlider key={simVar.key} simVar={simVar} />)}
    </div>
);

interface CollapsibleSimVarSectionProps extends SimVarSectionProps {
    title: React.ReactNode;
}

const CollapsibleSimVarSection: React.FC<CollapsibleSimVarSectionProps> = ({ title, simVars }) => {
    const [collapsed, setCollapsed] = useState<boolean>(false);

    if (simVars.length === 0) return null;

    return (
        <>
            <button
                className="w-full px-6 py-3 bg-midnight-700/50 flex items-center justify-between shadow-sm"
                onClick={() => setCollapsed(!collapsed)}
            >
                <h5>{title}</h5>
                <FiChevronLeft
                    size={30}
                    className={classNames(
                        'text-midnight-500 duration-200',
                        { 'rotate-0': collapsed, '-rotate-90': !collapsed },
                    )}
                />
            </button>
            <div
                className={classNames(
                    'overflow-hidden duration-300 ease-out',
                    { 'max-h-0': collapsed, 'max-h-80': !collapsed },
                )}
            >
                <SimVarSection simVars={simVars} />
            </div>
        </>
    );
};

interface SimVarsMenuProps {
    show?: boolean;
    onClick?: () => void;
    onExit?: () => void;
}

export const SimVarsMenu: React.FC<SimVarsMenuProps> = ({ ...props }) => {
    const [filter, setFilter] = useState<string>('');

    const simVars = useProjectSelector(
        (state: ProjectState) => Object.values(state.simVars).sort((a, b) => (a.name > b.name ? 1 : -1)),
    );

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
            <SimVarSection simVars={filtered.filter((v) => v.pinned)} />
            <CollapsibleSimVarSection
                title={<><big className="text-yellow-400">A</big> Vars</>}
                simVars={filtered.filter((v) => v.type === 'A')}
            />
            <CollapsibleSimVarSection
                title={<><big className="text-yellow-400">L</big> Vars</>}
                simVars={filtered.filter((v) => v.type === 'L')}
            />
        </Menu>
    );
};
