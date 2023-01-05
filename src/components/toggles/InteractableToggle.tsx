import React, { useState, useCallback } from 'react';
import { FaRegHandPointer } from 'react-icons/fa';
import { Toggle } from './index';
import { setInteractable } from '../../redux/workspace/projectSlice';
import { useWorkspaceDispatch, useWorkspaceSelector, WorkspaceState } from '../../redux/workspace';

export const InteractableToggle: React.FC = () => {
    const [enabled, setEnabled] = useState<boolean>(false);
    const dispatch = useWorkspaceDispatch();

    const interactable = useWorkspaceSelector((state: WorkspaceState) => [state.project.interactable]);

    const handleClick = useCallback(() => {
        setEnabled(!enabled);
        dispatch(setInteractable({ interactable: enabled }));
    }, [dispatch, enabled]);

    return (
        <Toggle icon={<FaRegHandPointer size={25} />} enabled={interactable[0] || false} onClick={handleClick} />
    );
};
