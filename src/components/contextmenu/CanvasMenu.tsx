import React, { useCallback } from 'react';
import { FiPlus } from 'react-icons/fi';
import { v4 } from 'uuid';
import { ContextMenu, ContextMenuProps } from './index';
import { useWorkspaceDispatch, useWorkspaceSelector, WorkspaceState } from '../../redux/workspace'
import { addElement, clampElementPosition } from '../../redux/workspace/projectSlice'
import { InstrumentConfig } from '../../types'
import { useTransformContext } from '@pronestor/react-zoom-pan-pinch'

export const CanvasMenu: React.FC<Omit<ContextMenuProps, 'children'>> = (props) => {
    const instruments = useWorkspaceSelector((state: WorkspaceState) => state.project.instruments);

    const { state: transformState } = useTransformContext();

    const dispatch = useWorkspaceDispatch();

    const addInstrument = useCallback((instrument: InstrumentConfig) => {
        let [x, y] = clampElementPosition(
            (props.x - transformState.positionX) / transformState.scale,
            (props.y - transformState.positionY) / transformState.scale
        );
        dispatch(addElement({
            name: instrument.name,
            uuid: v4(),
            element: 'Instrument',
            width: instrument.dimensions.width,
            height: instrument.dimensions.height,
            x,
            y,
        }))
    }, [dispatch]);

    return (
        <ContextMenu {...props}>
            <div className="px-4 py-3 bg-midnight-700/50 border-b-2 border-b-midnight-700 font-medium">
                Instruments
            </div>
            {instruments.map((instrument) => (
                <button
                    key={instrument.name}
                    className="flex items-center gap-2 text-left px-3 py-2 pointer-events-auto"
                    onMouseDown={() => addInstrument(instrument)}
                >
                    <FiPlus size={18} />
                    {instrument.name}
                </button>
            ))}
        </ContextMenu>
    );
};
