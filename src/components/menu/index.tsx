import React, { ReactNode } from 'react';
import { FiX } from 'react-icons/fi';
import { AnimatePresence } from 'framer-motion';
import classNames from 'classnames';

interface MenuProps extends MenuBodyProps {
    show?: boolean;
    icon: ReactNode;
    onClick?: () => void;
}

export const Menu: React.FC<MenuProps> = ({ title, icon, show, onClick, onExit, children }) => (
    <>
        <button
            className={classNames(
                'w-14 h-14 flex items-center justify-center bg-silver-700 rounded-xl cursor-pointer ring-amethyst-400 ring-opacity-50 duration-200',
                { 'ring-0': !show, 'ring-4': show },
            )}
            onClick={show ? onExit : onClick}
        >
            {icon}
        </button>
        {/* TODO: Don't unmount component, just hide */}
        <AnimatePresence>
            {show && (
                <div className="absolute left-28 top-4">
                    <MenuBody title={title} onExit={onExit}>
                        {children}
                    </MenuBody>
                </div>
            )}
        </AnimatePresence>
    </>
);

interface MenuBodyProps {
    title: string;
    onExit?: () => void;
    children?: ReactNode;
    className?: string;
}

export const MenuBody: React.FC<MenuBodyProps> = ({ title, onExit, className, children }) => (
    <div className={classNames('w-[26rem] bg-midnight-800 shadow-2xl rounded-2xl z-30 overflow-hidden', className)}>
        <div className="px-6 py-4 pt-8 bg-midnight-700 flex justify-between items-center">
            <h4 className="font-medium">{title}</h4>
            <button onClick={onExit}>
                <FiX size={30} className="text-midnight-400" />
            </button>
        </div>
        {children}
    </div>
);
