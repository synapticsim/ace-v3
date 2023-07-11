import React, { memo, useCallback, useState } from 'react';
import { FiChevronLeft, FiChevronRight, FiSliders } from 'react-icons/fi';
import { RiPushpin2Line } from 'react-icons/ri';
import classNames from 'classnames';
import { Input, SliderInput } from '../Input';
import { Menu } from './index';
import { useWorkspaceDispatch, useWorkspaceSelector, WorkspaceState } from '../../redux/workspace';
import { formatKey, setSimVar, togglePin } from '../../redux/workspace/simVarSlice';
import { SimVar } from '../../types';

interface SimVarSliderProps {
    varKey: string;
}

const SimVarSlider: React.FC<SimVarSliderProps> = memo(({ varKey }) => {
    const [id, simVar] = useWorkspaceSelector((state: WorkspaceState): [number, SimVar] => {
        const id = state.simVars.ids[varKey];
        return [id, state.simVars.vars[id]];
    });
    const dispatch = useWorkspaceDispatch();

    const [collapsed, setCollapsed] = useState<boolean>(true);

    const onChange = useCallback((value: number | number[]) => dispatch(setSimVar({
        id,
        value: value as number,
    })), [dispatch, simVar]);

    return (
        <div>
            <div className="flex items-center justify-between gap-1">
                <button className="flex items-center gap-1" onClick={() => setCollapsed(!collapsed)}>
                    <FiChevronRight
                        size={24}
                        className={classNames(
                            'duration-200',
                            { 'rotate-0': collapsed, 'rotate-90': !collapsed },
                        )}
                    />
                    <h6 className="font-mono text-left">
                        {simVar.name}
                        {simVar.index > 0 && <span className="text-theme-primary">:{simVar.index}</span>}
                    </h6>
                </button>
                <button className="mr-0.5" onClick={() => dispatch(togglePin({ key: formatKey(simVar) }))}>
                    <RiPushpin2Line
                        size={20}
                        className={classNames({
                            'text-theme-primary': simVar.pinned,
                            'text-theme-pd': !simVar.pinned,
                        })}
                    />
                </button>
            </div>
            <div
                className={classNames(
                    'px-3 overflow-hidden duration-300 ease-out',
                    { 'max-h-0': collapsed, 'max-h-20': !collapsed },
                )}
            >
                <div className="py-3">
                    <SliderInput
                        min={0}
                        max={250}
                        value={simVar.value as number}
                        onChange={onChange}
                    />
                </div>
            </div>
        </div>
    );
});

interface SimVarSectionProps {
    filter: (v: SimVar) => boolean;
}

const SimVarSection: React.FC<SimVarSectionProps> = ({ filter }) => {
    const simVars = useWorkspaceSelector(
        (state: WorkspaceState) => state.simVars.vars.filter(filter),
    );

    return (
        <div
            className={classNames(
                'px-6 py-5 max-h-80 flex flex-col gap-2 overflow-y-scroll',
                'scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-silver-700/25',
            )}
        >
            {simVars.map((v) => {
                const varKey = formatKey(v);
                return <SimVarSlider key={varKey} varKey={varKey} />;
            })}
        </div>
    );
};

interface CollapsibleSimVarSectionProps extends SimVarSectionProps {
    title: React.ReactNode;
}

const CollapsibleSimVarSection: React.FC<CollapsibleSimVarSectionProps> = ({ title, filter }) => {
    const [collapsed, setCollapsed] = useState<boolean>(true);

    return (
        <>
            <button
                className="w-full px-6 py-3 bg-theme-workspace-pd flex items-center justify-between shadow-sm"
                onClick={() => setCollapsed(!collapsed)}
            >
                <h5>{title}</h5>
                <FiChevronLeft
                    size={30}
                    className={classNames(
                        'text-theme-workspace-pd duration-200',
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
                <SimVarSection filter={filter} />
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

    return (
        <Menu title="SimVars" icon={<FiSliders size={25} />} {...props}>
            <div className="px-6 py-5">
                <Input
                    label=""
                    placeholder="Filter Variables"
                    onChange={(e) => setFilter(e.target.value)}
                />
            </div>
            <SimVarSection filter={(v) => v.pinned ?? false} />
            <CollapsibleSimVarSection
                title={<><big className="text-theme-primary">A</big> Vars</>}
                filter={(v) => v.name.toLowerCase().includes(filter.toLowerCase()) && v.type === 'A'}
            />
            <CollapsibleSimVarSection
                title={<><big className="text-theme-primary">L</big> Vars</>}
                filter={(v) => v.name.toLowerCase().includes(filter.toLowerCase()) && v.type === 'L'}
            />
        </Menu>
    );
};
