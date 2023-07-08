import React, { useCallback } from 'react';
import { FiLayout } from 'react-icons/fi';
import { HiRefresh } from 'react-icons/hi';
import { invoke } from '@tauri-apps/api/tauri';
import { useWorkspaceDispatch, useWorkspaceSelector, WorkspaceState } from '../../redux/workspace';
import { Menu } from './index';
import { InstrumentConfig } from '../../types';
import { setInstruments } from '../../redux/workspace/projectSlice';

interface ElementsMenuProps {
    show?: boolean;
    onClick?: () => void;
    onExit?: () => void;
}

export const ElementsMenu: React.FC<ElementsMenuProps> = ({ ...props }) => {
    const instruments = useWorkspaceSelector((state: WorkspaceState) => state.project.instruments);
    const dispatch = useWorkspaceDispatch();

    const refreshInstruments = useCallback(() => {
        invoke<InstrumentConfig[]>('load_instruments')
            .then((instruments) => dispatch(setInstruments({ instruments })))
            .catch(console.error);
    }, [dispatch]);

    return (
        <Menu title="Elements" icon={<FiLayout size={25} />} {...props}>
            <div className="px-6 py-5">
                <div className="flex justify-between items-center mb-4">
                    <h3>Instruments</h3>
                    <button onClick={refreshInstruments}>
                        <HiRefresh className="cursor-pointer active:text-silver-500" size={25} />
                    </button>
                </div>
                <div className="flex flex-col gap-3 mb-8">
                    {instruments.map((instrument) => (
                        <div className="flex items-center px-5 py-2 rounded-xl bg-silver-900/50">
                            <span>{instrument.name}</span>
                            <span className="ml-auto text-silver-400">{instrument.dimensions.width}x{instrument.dimensions.height}</span>
                        </div>
                    ))}
                </div>
                <h3 className="mb-4">Utilities</h3>
                <div className="flex flex-col gap-3">
                    <div className="flex items-center px-5 py-2 rounded-xl bg-silver-900/50">Button</div>
                    <div className="flex items-center px-5 py-2 rounded-xl bg-silver-900/50">WebView</div>
                </div>
            </div>
        </Menu>
    );
};
