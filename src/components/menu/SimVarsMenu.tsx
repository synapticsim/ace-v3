import React, { memo, useCallback, useState } from 'react';
import { FiChevronLeft, FiChevronRight, FiSliders, FiX } from 'react-icons/fi';
import { RiPushpin2Line, RiSettings2Line } from 'react-icons/ri';
import classNames from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import { Dropdown, Input, NumberInput, SliderInput } from '../Input';
import { Menu } from './index';
import { useWorkspaceDispatch, useWorkspaceSelector, WorkspaceState } from '../../redux/workspace';
import { formatKey, setControl, setSimVar, togglePin } from '../../redux/workspace/simVarSlice';
import { Control, ControlType, SimVar } from '../../types';

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

    const onChange = useCallback((value: number | string) => dispatch(setSimVar({
        id,
        value,
    })), [dispatch, simVar]);

    const onControlChange = useCallback((value: Control) => dispatch(setControl({
        control: value,
        key: varKey,
    })), [dispatch, varKey]);

    const [editOpen, setEditOpen] = useState(false);

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
                        {simVar.index > 0 && <span className="text-amethyst-400">:{simVar.index}</span>}
                    </h6>
                </button>
                <button className="mr-0.5" onClick={() => dispatch(togglePin({ key: formatKey(simVar) }))}>
                    <RiPushpin2Line
                        size={20}
                        className={classNames({
                            'text-amethyst-400': simVar.pinned,
                            'text-silver-700': !simVar.pinned,
                        })}
                    />
                </button>
            </div>
            <div
                className={classNames(
                    'pl-3 pr-1 overflow-hidden duration-300 ease-out',
                    { 'max-h-0': collapsed, 'max-h-20': !collapsed },
                )}
            >
                <AnimatePresence>
                    {editOpen
                        && (
                            <motion.div
                                initial={{ clipPath: 'inset(0 100% 0 0)' }}
                                animate={{ clipPath: 'inset(0)' }}
                                exit={{ clipPath: 'inset(0 100% 0 0)' }}
                                className="absolute left-[calc(100%+10px)] bg-silver-800 shadow-2xl rounded-2xl z-30 p-3 flex flex-col gap-3 whitespace-nowrap"
                            >
                                <div className="flex flex-row gap-3 justify-between items-center">
                                    <span>Edit {simVar.name}</span>
                                    <button onClick={() => setEditOpen(false)}>
                                        <FiX size={30} className="text-silver-400" />
                                    </button>
                                </div>
                                <Dropdown
                                    value={simVar.control.type}
                                    onChange={(value) => {
                                        switch (value) {
                                            case ControlType.Slider:
                                                onControlChange({ type: ControlType.Slider, min: 0, max: 250 });
                                                break;
                                            case ControlType.Numeric:
                                                onControlChange({ type: ControlType.Numeric });
                                                break;
                                            case ControlType.Text:
                                                onControlChange({ type: ControlType.Text });
                                                break;
                                        }
                                    }}
                                >
                                    <option>{ControlType.Slider}</option>
                                    <option>{ControlType.Numeric}</option>
                                    <option>{ControlType.Text}</option>
                                </Dropdown>

                                {simVar.control.type === ControlType.Slider ? (
                                    <>
                                        <div className="flex flex-row gap-3">
                                            <span>Min: </span>
                                            <NumberInput
                                                value={simVar.control.min}
                                                onChange={((max: number) => (value) => onControlChange({ type: ControlType.Slider, max, min: value }))(simVar.control.max)}
                                            />
                                        </div>
                                        <div className="flex flex-row gap-3">
                                            <span>Max: </span>
                                            <NumberInput
                                                value={simVar.control.max}
                                                onChange={((min: number) => (value) => onControlChange({ type: ControlType.Slider, max: value, min }))(simVar.control.min)}
                                            />
                                        </div>
                                    </>
                                ) : null}
                            </motion.div>
                        )}
                </AnimatePresence>
                <div className="py-3 flex flex-row gap-3 items-center">
                    {simVar.control.type === ControlType.Slider ? (
                        <>
                            <NumberInput
                                value={simVar.value}
                                onChange={onChange}
                                className="w-24"
                            />
                            <SliderInput
                                min={simVar.control.min}
                                max={simVar.control.max}
                                value={((value: number | string) => {
                                    if (typeof value === 'string') {
                                        onChange(0.0);
                                        return 0;
                                    }
                                    return value;
                                })(simVar.value)}
                                onChange={onChange}
                            />
                        </>
                    ) : simVar.control.type === ControlType.Numeric ? (
                        <NumberInput
                            value={simVar.value}
                            onChange={onChange}
                        />
                    ) : (
                        <Input
                            value={simVar.value}
                            onChange={(e) => onChange(e.target.value)}
                        />
                    )}
                    <button onClick={() => setEditOpen((v) => !v)}>
                        <RiSettings2Line
                            size={20}
                            className={classNames({ 'text-amethyst-400': editOpen, 'text-silver-700': !editOpen })}
                        />
                    </button>
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
                className="w-full px-6 py-3 bg-silver-700/50 border-t-2 border-t-silver-700 flex items-center justify-between shadow-sm"
                onClick={() => setCollapsed(!collapsed)}
            >
                <h5>{title}</h5>
                <FiChevronLeft
                    size={30}
                    className={classNames(
                        'text-silver-500 duration-200',
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
                title={<><big className="text-amethyst-400">A</big> Vars</>}
                filter={(v) => v.name.toLowerCase().includes(filter.toLowerCase()) && v.type === 'A'}
            />
            <CollapsibleSimVarSection
                title={<><big className="text-amethyst-400">L</big> Vars</>}
                filter={(v) => v.name.toLowerCase().includes(filter.toLowerCase()) && v.type === 'L'}
            />
        </Menu>
    );
};
