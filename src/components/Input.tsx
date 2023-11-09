import React, { forwardRef, HTMLProps, InputHTMLAttributes, ReactElement, useCallback, useState } from 'react';
import { FiAlertCircle } from 'react-icons/fi';
import classNames from 'classnames';
import { open, OpenDialogOptions } from '@tauri-apps/api/dialog';
import Slider, { SliderProps } from 'rc-slider';
import 'rc-slider/assets/index.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className, ...props }) => (
    <div className="relative flex flex-col gap-1">
        {label && <label htmlFor={props.name}>{label}</label>}
        <input
            id={props.name}
            className={classNames(
                'px-4 py-2 rounded-md bg-transparent outline-0 ring-0 border-2 block',
                'duration-300 focus:ring-4 focus:ring-opacity-50',
                { 'border-silver-600': !error, 'border-red-500': error, 'ring-silver-600': !error, 'ring-red-500': error },
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

export const NumberInput: React.FC<Omit<InputProps, 'onChange'> & { onChange?: (value: number) => void }> = ({ onChange, label, error, className, ...props }) => (
    <div className="relative flex flex-col gap-1">
        {label && <label htmlFor={props.name}>{label}</label>}
        <input
            type="number"
            id={props.name}
            className={classNames(
                'px-1 rounded-md bg-transparent outline-0 ring-0 border-2 block',
                'duration-300 focus:ring-4 focus:ring-opacity-50',
                { 'border-midnight-600': !error, 'border-red-500': error, 'ring-midnight-600': !error, 'ring-red-500': error },
                className,
            )}
            {...props}
            onChange={(e) => {
                onChange?.(parseFloat(e.target.value));
            }}
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

interface DropdownProps<T> {
    children: ReactElement<HTMLProps<HTMLOptionElement>>[];
    onChange: (value: T) => void;
    value: T;
}

export const Dropdown = <T extends string | number>({ value, onChange, children }: DropdownProps<T>) => {
    const onSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onChange(e.target.value as T);
    };

    return (
        <select onChange={onSelect} value={value}>
            {children}
        </select>
    );
};

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
        // TODO: Replace with type="file"
        <Input
            readOnly
            value={currentValue && !Array.isArray(currentValue) ? currentValue : ''}
            className="cursor-pointer"
            onClick={handleClick}
            {...props}
        />
    );
};

export const SliderInput: React.FC<SliderProps<number>> = ({ ...props }) => (
    <Slider
        {...props as SliderProps}
    />
);

export const ToggleInput: React.FC<InputHTMLAttributes<HTMLInputElement>> = forwardRef(
    ({ className, ...props }, ref: React.ForwardedRef<HTMLDivElement>) => (
        <div className="relative w-10 h-5" ref={ref}>
            <input
                type="checkbox"
                className={classNames('opacity-0 w-full h-full cursor-pointer peer', className)}
                {...props}
            />
            <div className="absolute top-0 left-0 w-full h-full rounded-full bg-silver-700 pointer-events-none" />
            <div
                className={classNames(
                    'absolute top-1 left-1 w-3 h-3 rounded-full bg-silver-600 duration-100 pointer-events-none',
                    'peer-checked:bg-amethyst-400 peer-checked:left-6',
                )}
            />
        </div>
    ),
);
