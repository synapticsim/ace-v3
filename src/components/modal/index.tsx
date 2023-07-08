import React, { useCallback, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import { AnimatePresence, motion, Variants } from 'framer-motion';

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
    // Close modal on Esc press
    const handleEscKey = useCallback((event: KeyboardEvent) => {
        if (event.key === 'Escape') {
            onExit();
        }
    }, [onExit]);

    useEffect(() => {
        document.addEventListener('keyup', handleEscKey);
        return () => document.removeEventListener('keyup', handleEscKey);
    }, [handleEscKey]);

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
                    onClick={onExit}
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
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="px-8 py-5 bg-silver-700 rounded-t-2xl flex justify-between items-center">
                            <h3 className="font-medium">{title}</h3>
                            <FiX
                                size={30}
                                className="text-silver-400 cursor-pointer hover:text-silver-200"
                                onClick={onExit}
                            />
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
