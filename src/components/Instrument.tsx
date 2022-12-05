import React, { useCallback, useEffect, useRef } from 'react';
import { renderToString } from 'react-dom/server';
import { FiRefreshCcw } from 'react-icons/fi';
import { installShims } from '../shims';
import { ToggleInput } from './Input';
import { GlobalState, useGlobalSelector } from '../redux/global';

interface InstrumentProps {
    name: string;
    x: number;
    y: number;
    width: number;
    height: number;
}

export const Instrument: React.FC<InstrumentProps> = ({ name, x, y, width, height }) => {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const updateInterval = useRef<number>();

    const baseURL = useGlobalSelector((state: GlobalState) => state.config.baseUrl);

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

    useEffect(() => {
        setTimeout(() => setupInstrument(), 10);
    }, [iframeRef, setupInstrument]);

    if (baseURL === undefined) return null;

    return (
        <div ref={containerRef} className="absolute shadow-2xl" style={{ left: x, top: y, width, height }}>
            <div className="absolute bottom-full w-full box-content border-2 border-b-0 border-midnight-800 bg-midnight-800 rounded-t-xl">
                <div className="px-4 py-2 flex gap-4 items-center">
                    <h4 className="font-medium">{name}</h4>
                    <FiRefreshCcw className="cursor-pointer active:stroke-yellow-400" size={22} onClick={refresh} />
                    <ToggleInput onChange={(e) => console.log(e.target.checked)} />
                </div>
            </div>
            <div className="absolute w-full h-full box-content border-2 border-midnight-800 bg-midnight-900 pointer-events-none">
                <iframe
                    name={name}
                    title={name}
                    ref={iframeRef}
                    width={width}
                    height={height}
                    tabIndex={-1}
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
