import React, { HTMLProps } from 'react';
import classNames from 'classnames';

export const Card: React.FC<HTMLProps<HTMLDivElement>> = ({ className, children, ...props }) => (
    <div
        className={
            classNames(
                'bg-silver-800 rounded-xl drop-shadow px-5 py-4',
                { 'cursor-pointer hover:-translate-y-1 hover:drop-shadow-lg transition duration-200': props.onClick },
                className,
            )
        }
        {...props}
    >
        {children}
    </div>
);
