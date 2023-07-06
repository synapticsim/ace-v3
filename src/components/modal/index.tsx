import React, { useCallback, useEffect, useRef } from 'react';
import { FiX } from 'react-icons/fi';
import { AnimatePresence, motion, Variants } from 'framer-motion';

const KEY_NAME_ESC = 'Escape';
const KEY_EVENT_TYPE = 'keyup';
const MOUSE_UP = 'mouseup';

const modalBgAnimation: Variants = {
    hidden: {
        opacity: 0,
        pointerEvents: 'none',
    },
    visible: {
        opacity: 1,
        pointerEvents: 'auto',
    },
};

const modalAnimation: Variants = {
    hidden: {
        y: '100px',
        opacity: 0,
    },
    visible: {
        y: '0',
        opacity: 1,
    },
};

export interface ModalProps {
    title: string;
    show: boolean;
    onExit: () => void;
    children?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ title, show, onExit, children }) => {
    const ref = useRef<HTMLDivElement>(null);
    // Close modal on Esc press
    const handleEscKey = useCallback((event: KeyboardEvent) => {
        if (event.key === KEY_NAME_ESC) {
            onExit();
        }
    }, [onExit]);

    // Close on outside click
    const handleClick = useCallback((event: MouseEvent) => {
        // @ts-ignore EventTarget is not mapping on Node but works just fine
        if (ref?.current?.contains && !ref.current.contains(event.target)) {
            onExit();
        }
    }, [onExit, ref]);

    useEffect(() => {
        document.addEventListener(KEY_EVENT_TYPE, handleEscKey, false);
        document.addEventListener(MOUSE_UP, handleClick);

        return () => {
            document.removeEventListener(KEY_EVENT_TYPE, handleEscKey, false);
            document.removeEventListener(MOUSE_UP, handleClick);
        };
    }, [handleClick, handleEscKey]);

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    className="absolute w-screen h-screen z-50 top-0 bg-black/20 flex place-items-center"
                    variants={modalBgAnimation}
                    transition={{ duration: 0.2 }}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                >
                    <motion.div
                        className="relative max-w-1/2 mx-auto bg-silver-800 rounded-2xl shadow-2xl"
                        variants={modalAnimation}
                        transition={{
                            duration: 0.2,
                            type: 'spring',
                            damping: 25,
                            stiffness: 200,
                        }}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        ref={ref}
                    >
                        <div className="px-8 py-5 bg-silver-700 rounded-t-2xl flex justify-between items-center">
                            <h3 className="font-medium">{title}</h3>
                            <FiX size={30} className="text-silver-400 cursor-pointer hover:text-silver-200" onClick={onExit} />
                        </div>
                        <div className="p-8">
                            {children}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
