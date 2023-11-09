import React, { useState } from 'react';
import { MdRadioButtonChecked } from 'react-icons/md';
import { useWorkspaceSelector, WorkspaceState } from '../../redux/workspace';
import { Menu } from './index';
import { Input } from '../Input';

interface EventsMenuProps {
    show?: boolean;
    onClick?: () => void;
    onExit?: () => void;
}

export const EventsMenu: React.FC<EventsMenuProps> = ({ ...props }) => {
    const events = useWorkspaceSelector((state: WorkspaceState) => state.interactionEvents.foundEvents);

    const [filter, setFilter] = useState('');

    return (
        <Menu title="Events" icon={<MdRadioButtonChecked size={25} />} {...props}>
            <div className="px-6 py-5 space-y-5">
                <Input
                    label=""
                    placeholder="Filter Events"
                    onChange={(e) => setFilter(e.target.value)}
                />
                <div className="flex flex-col gap-3 mb-8 max-h-96 overflow-y-scroll scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-silver-700/25">
                    {events.filter((event) => event.toLowerCase().includes(filter.toLowerCase())).map((event) => (
                        <button
                            className="flex items-center px-5 py-2 rounded-xl bg-silver-900/50 mr-2 group relative"
                            onClick={() => window.dispatchEvent(new CustomEvent('triggerInteractionEvent', { detail: event }))}
                        >
                            <span>{event}</span>
                        </button>
                    ))}
                </div>
            </div>
        </Menu>
    );
};
