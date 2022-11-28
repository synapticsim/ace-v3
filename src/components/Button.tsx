import React, { ButtonHTMLAttributes } from 'react';
import { CgSpinner } from 'react-icons/cg';
import classNames from 'classnames';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ loading, className, children, ...props }) => (
    <button
        className={classNames(
            'px-4 py-2 rounded-md ring-0 ring-opacity-50 ring-inherit',
            'duration-300 focus:ring-4',
            className,
        )}
        {...props}
    >
        {loading ? <CgSpinner className="animate-spin" /> : children}
    </button>
);
