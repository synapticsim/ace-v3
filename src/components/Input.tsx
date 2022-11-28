import React, { InputHTMLAttributes, useCallback, useState } from 'react';
import { FiAlertCircle } from 'react-icons/fi';
import classNames from 'classnames';
import { open, OpenDialogOptions } from '@tauri-apps/api/dialog';
import Slider, { SliderProps } from 'rc-slider';
import 'rc-slider/assets/index.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className, ...props }) => (
    <div className="relative flex flex-col gap-1">
        <label htmlFor={props.name}>{label}</label>
        <input
            id={props.name}
            className={classNames(
                'px-4 py-2 rounded-md bg-transparent outline-0 ring-0 border-2 block',
                'duration-300 focus:ring-4 focus:ring-opacity-50',
                { 'border-midnight-600': !error, 'border-red-500': error, 'ring-midnight-600': !error, 'ring-red-500': error },
                className,
            )}
            {...props}
        />
        {error && (
            <div className="absolute right-3 bottom-3">
                <FiAlertCircle size={22} className="peer stroke-red-500" />
                <span
                    className={classNames(
                        'absolute -top-1 left-7 px-2 py-1 bg-red-500 rounded-md opacity-0 pointer-events-none',
                        'peer-hover:opacity-100 duration-200',
                    )}
                >
                    {error}
                </span>
            </div>
        )}
    </div>
);

interface FileInputProps extends InputProps {
    options: OpenDialogOptions;
    onFileSelect: (path: any) => void;
}

export const FileInput: React.FC<FileInputProps> = ({ options, onFileSelect, ...props }) => {
    const [currentValue, setCurrentValue] = useState<string | string[] | null>();

    const handleClick = useCallback(() => {
        open(options).then((res) => {
            if (res !== null) {
                setCurrentValue(res);
                onFileSelect(res);
            }
        });
    }, [options, onFileSelect]);

    return (
        <Input
            readOnly
            value={currentValue && !Array.isArray(currentValue) ? currentValue : ''}
            className="cursor-pointer"
            onClick={handleClick}
            {...props}
        />
    );
};

export const SliderInput: React.FC<SliderProps> = ({ ...props }) => {
    return (
        <Slider
            {...props}
        />
    );
};
