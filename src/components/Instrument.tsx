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
    const iframeRef = useRef<HTMLIFrameElement>(null);

    const updateInterval = useRef<number>();

    const interactionMode = useRef(false);

    const baseURL = useAsyncMemo<string | undefined>(async () => {
        switch (await platform()) {
            case 'win32': return 'https://ace.localhost';
            default: return 'ace://localhost';
        }
    }, [], undefined);

    const setupInstrument = useCallback(() => {
        clearInterval(updateInterval.current);

        const iframe = iframeRef.current;
        if (iframe && iframe.contentWindow) {
            installShims(iframe.contentWindow);
            updateInterval.current = window.setInterval(() => (
                iframe.contentDocument?.getElementById('ROOT_ELEMENT')?.dispatchEvent(new CustomEvent('update'))
            ), 50);
        }
    }, [iframeRef]);

    const refresh = useCallback(() => {
        const iframe = iframeRef.current;
        if (iframe && iframe.contentWindow) {
            iframe.contentWindow.location.reload();
            window.setTimeout(() => setupInstrument(), 10);
        }
    }, [iframeRef, setupInstrument]);

    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        if (event.key === 'Enter' && iframeRef.current) {
            interactionMode.current = !interactionMode.current;
            if (interactionMode.current) {
                iframeRef.current.style.pointerEvents = 'auto';
            } else {
                iframeRef.current.style.pointerEvents = 'none';
            }
        }
    }, [iframeRef]);

    const handleMouseEnter = useCallback(() => {
        document.addEventListener('keydown', handleKeyDown);
        iframeRef.current?.contentWindow?.addEventListener('keydown', handleKeyDown);
    }, [iframeRef, handleKeyDown]);

    const handleMouseLeave = useCallback(() => {
        document.removeEventListener('keydown', handleKeyDown);
        iframeRef.current?.contentWindow?.removeEventListener('keydown', handleKeyDown);
    }, [iframeRef, handleKeyDown]);

    useEffect(() => setupInstrument(), [iframeRef, setupInstrument]);

    if (baseURL === undefined) return null;

    return (
        <div
            className="absolute shadow-2xl"
            style={{ left: x, top: y, width, height }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className="absolute bottom-full w-full box-content border-2 border-b-0 border-midnight-800 bg-midnight-800 rounded-t-xl">
                <div className="px-4 py-2 flex gap-4 items-center">
                    <h4 className="font-medium">{name}</h4>
                    <FiRefreshCcw className="cursor-pointer active:stroke-yellow-400 mt-0.5" size={22} onClick={refresh} />
                </div>
            </div>
            <div className="absolute w-full h-full box-content border-2 border-midnight-800 bg-black">
                <iframe
                    name={name}
                    title={name}
                    ref={iframeRef}
                    width={width}
                    height={height}
                    tabIndex={-1}
                    style={{ pointerEvents: 'none' }}
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
