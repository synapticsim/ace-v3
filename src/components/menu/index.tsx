import React from 'react';
import { FiX } from 'react-icons/fi';
import { AnimatePresence } from 'framer-motion';
import classNames from 'classnames';

interface MenuProps {
    title: string;
    icon: React.ReactNode;
    show?: boolean;
    onClick?: () => void;
    onExit?: () => void;
    children?: React.ReactNode[];
}

export const Menu: React.FC<MenuProps> = ({ title, icon, show, onClick, onExit, children }) => {
    return (
        <>
            <button
                className={classNames(
                    'w-14 h-14 flex items-center justify-center bg-midnight-700 rounded-xl cursor-pointer ring-midnight-700 ring-opacity-50 duration-200',
                    { 'ring-0': !show, 'ring-4': show },
                )}
                onClick={show ? onExit : onClick}
            >
                {icon}
            </button>
            <AnimatePresence>
                {show && (
                    <div className="absolute left-28 top-4 w-96 bg-midnight-800 shadow-2xl rounded-2xl z-30">
                        <div className="px-6 py-4 bg-midnight-700 rounded-t-2xl flex justify-between items-center">
                            <h4 className="font-medium">{title}</h4>
                            <FiX size={30} className="text-midnight-400 cursor-pointer" onClick={onExit} />
                        </div>
                        {children}
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};
