import React, { ReactNode } from 'react';
import { FiX } from 'react-icons/fi';
import { AnimatePresence } from 'framer-motion';
import classNames from 'classnames';

interface MenuProps {
    title: string;
    icon: ReactNode;
    show?: boolean;
    onClick?: () => void;
    onExit?: () => void;
    children?: ReactNode;
}

export const Menu: React.FC<MenuProps> = ({ title, icon, show, onClick, onExit, children }) => (
    <>
        <button
            className={classNames(
                'w-14 h-14 flex items-center justify-center bg-theme-workspace-padding rounded-xl cursor-pointer ring-theme-primary duration-200',
                { 'ring-0': !show, 'ring-4': show },
            )}
            onClick={show ? onExit : onClick}
        >
            {icon}
        </button>
        {/* TODO: Don't unmount component, just hide */}
        <AnimatePresence>
            {show && (
                <div className="absolute left-28 top-4 w-[26rem] bg-theme-padding shadow-2xl rounded-2xl z-30 overflow-hidden">
                    <div className="px-6 py-4 bg-theme-workspace-padding flex justify-between items-center">
                        <h4 className="font-medium">{title}</h4>
                        <button onClick={onExit}>
                            <FiX size={30} className="text-theme-workspace-padding cursor-pointer hover:text-theme-text" />
                        </button>
                    </div>
                    {children}
                </div>
            )}
        </AnimatePresence>
    </>
);
