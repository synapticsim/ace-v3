import React, { useCallback } from 'react';
import { FiTrash } from 'react-icons/fi';
import { ContextMenu, ContextMenuProps } from './index';
import { useWorkspaceDispatch } from '../../redux/workspace';
import { removeElement } from '../../redux/workspace/projectSlice';
import { Element } from '../../types';

interface ElementMenuProps extends Omit<ContextMenuProps, 'children'> {
    element: Element;
}

export const ElementMenu: React.FC<ElementMenuProps> = ({ element, ...props }) => {
    const dispatch = useWorkspaceDispatch();

    const remove = useCallback(() => {
        dispatch(removeElement({ uuid: element.uuid }));
    }, [element, dispatch]);

    return (
        <ContextMenu {...props}>
            <div className="px-4 py-3 bg-theme-bg border-b-2 border-b-theme-workspace-pd font-medium">
                {element.name}
            </div>
            <button
                className="flex items-center gap-2 text-left px-3 py-2 pointer-events-auto"
                onMouseDown={remove}
            >
                <FiTrash size={18} />
                Delete
            </button>
        </ContextMenu>
    );
};
