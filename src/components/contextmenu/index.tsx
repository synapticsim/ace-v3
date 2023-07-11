import React, { useCallback, useEffect, useRef } from 'react';
import { useWorkspaceDispatch } from '../../redux/workspace';
import { clearMenu } from '../../redux/workspace/contextMenuSlice';

export interface ContextMenuProps {
    x: number;
    y: number;
    children?: React.ReactNode;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, children }) => {
    const menuRef = useRef<HTMLDivElement>(null);
    const dispatch = useWorkspaceDispatch();

    const blur = useCallback(() => dispatch(clearMenu()), [dispatch]);

    useEffect(() => {
        const menu = menuRef.current;

        menu?.focus();
        menu?.addEventListener('blur', blur);
        return () => menu?.removeEventListener('blur', blur);
    }, [menuRef, blur]);

    return (
        <div
            tabIndex={-1}
            ref={menuRef}
            style={{ left: x, top: y }}
            className="absolute pointer-events-auto flex flex-col outline-0 bg-theme-background rounded-lg overflow-hidden shadow-2xl text-sm"
        >
            {children}
        </div>
    );
};
