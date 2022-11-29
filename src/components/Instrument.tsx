import React, { useCallback, useEffect, useRef } from 'react';
import { renderToString } from 'react-dom/server';
import { FiRefreshCcw } from 'react-icons/fi';
import { platform } from '@tauri-apps/api/os';
import { installShims } from '../shims';
import { useAsyncMemo } from '../utils/hooks';

interface InstrumentProps {
    name: string;
    x: number;
    y: number;
    width: number;
    height: number;
}

export const Instrument: React.FC<InstrumentProps> = ({ name, x, y, width, height }) => {
    const ref = useRef<HTMLIFrameElement>(null);
    const updateInterval = useRef<number>();

    const baseURL = useAsyncMemo<string | undefined>(async () => {
        switch (await platform()) {
            case 'win32': return 'https://ace.localhost';
            default: return 'ace://localhost';
        }
    }, [], undefined);

    const setupInstrument = useCallback(() => {
        clearInterval(updateInterval.current);

        const iframe = ref.current;
        if (iframe && iframe.contentWindow) {
            installShims(iframe.contentWindow);
            updateInterval.current = window.setInterval(() => (
                iframe.contentDocument?.getElementById('ROOT_ELEMENT')?.dispatchEvent(new CustomEvent('update'))
            ), 50);
        }
    }, [ref]);

    const refresh = useCallback(() => {
        if (ref.current && ref.current.contentWindow) {
            ref.current.contentWindow.location.reload();
            window.setTimeout(() => setupInstrument(), 10);
        }
    }, [ref, setupInstrument]);

    useEffect(() => setupInstrument(), [setupInstrument]);

    if (baseURL === undefined) return null;

    return (
        <div className="absolute shadow-2xl" style={{ left: x, top: y, width, height }}>
            <div className="absolute bottom-full w-full box-content border-2 border-b-0 border-midnight-800 bg-midnight-800 rounded-t-xl">
                <div className="px-4 py-2 flex gap-4 items-center">
                    <h4 className="font-medium">{name}</h4>
                    <FiRefreshCcw className="cursor-pointer active:stroke-yellow-400 mt-0.5" size={22} onClick={refresh} />
                </div>
            </div>
            <div className="absolute w-full h-full box-content border-2 border-midnight-800 bg-black">
                <iframe
                    title={name}
                    ref={ref}
                    width={width}
                    height={height}
                    className="pointer-events-none"
                    srcDoc={renderToString(
                        <html>
                            <head>
                                <script type="text/javascript" defer crossOrigin="anonymous" src={`${baseURL}/project/${name}/bundle.js`} />
                                <link rel="stylesheet" href={`${baseURL}/project/${name}/bundle.css`} />
                            </head>
                            <body style={{ overflow: 'hidden', margin: 0 }}>
                                <div id="ROOT_ELEMENT">
                                    <div id="MSFS_REACT_MOUNT" />
                                </div>
                            </body>
                        </html>,
                    )}
                />
            </div>
        </div>
    );
};
