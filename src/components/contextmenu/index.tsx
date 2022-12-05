import React from 'react'

interface ContextMenuProps {
    x: number;
    y: number;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({ x, y }) => (
    <div className="absolute bg-midnight-700" style={{ left: x, top: y }}>
        Hello
    </div>
);
