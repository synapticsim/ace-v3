import React from 'react';
import { FiPlus } from 'react-icons/fi';
import { ContextMenu, ContextMenuProps } from './index';
import { useWorkspaceSelector, WorkspaceState } from '../../redux/workspace'

export const CanvasMenu: React.FC<Omit<ContextMenuProps, 'children'>> = (props) => {
    const instruments = useWorkspaceSelector((state: WorkspaceState) => state.project.instruments);

    return (
        <ContextMenu {...props}>
            <div className="px-4 py-3 bg-midnight-700/50 border-b-2 border-b-midnight-700 font-medium">
                Instruments
            </div>
            {instruments.map(({ name }) => (
                <button key={name} className="flex items-center gap-2 text-left px-3 py-2">
                    <FiPlus size={18} />
                    {name}
                </button>
            ))}
        </ContextMenu>
    );
};
