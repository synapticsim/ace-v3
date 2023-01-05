import React from 'react';
import classNames from 'classnames';

interface ToggleProps {
    icon: React.ReactNode;
    enabled: boolean;
    onClick?: () => void;
}

export const Toggle: React.FC<ToggleProps> = ({ icon, enabled, onClick }) => (
    <button
        className={classNames(
            'w-14 h-14 flex items-center justify-center bg-midnight-700 rounded-xl cursor-pointer ring-midnight-700 ring-opacity-50 duration-200',
            { 'ring-0': !enabled, 'ring-4': enabled },
        )}
        onClick={onClick}
    >
        {icon}
    </button>
);
