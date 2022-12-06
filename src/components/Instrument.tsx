import React, { ForwardedRef, forwardRef, memo, Ref, useCallback, useEffect, useRef } from 'react';
import { renderToString } from 'react-dom/server';
import { FiRefreshCcw } from 'react-icons/fi';
import { useTransformContext } from '@pronestor/react-zoom-pan-pinch';
import { useDraggable } from '@dnd-kit/core';
import { GlobalState, useGlobalSelector } from '../redux/global';
import { installShims } from '../shims';
import { ToggleInput } from './Input';
import { Element } from '../types';

interface InstrumentFrameProps {
    name: string;
    width: number;
    height: number;
    ref: Ref<HTMLIFrameElement>;
}

const InstrumentFrame: React.FC<InstrumentFrameProps> = memo(forwardRef(({ name, width, height }, ref: ForwardedRef<HTMLIFrameElement>) => {
    const baseUrl = useGlobalSelector((state: GlobalState) => state.config.baseUrl);

    if (baseUrl === undefined) return null;

    return (
        <iframe
            name={name}
            title={name}
            ref={ref}
            width={width}
            height={height}
            tabIndex={-1}
            srcDoc={renderToString(
                <html>
                    <head>
                        <script type="text/javascript" defer crossOrigin="anonymous" src={`${baseUrl}/project/${name}/bundle.js`} />
                        <link rel="stylesheet" href={`${baseUrl}/project/${name}/bundle.css`} />
                    </head>
                    <body style={{ overflow: 'hidden', margin: 0 }}>
                        <div id="ROOT_ELEMENT">
                            <div id="MSFS_REACT_MOUNT" />
                        </div>
                    </body>
                </html>,
            )}
        />
    );
}));

export const Instrument: React.FC<Element> = ({ uuid, name, x, y, width, height }) => {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const updateInterval = useRef<number>();

    const { state: zoomState } = useTransformContext();

    const projectName = useGlobalSelector((state: GlobalState) => state.project.active?.name);

    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: uuid,
        data: { scale: zoomState.scale },
    });

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
            window.setTimeout(() => {
                setupInstrument();
                console.info(`[${projectName}] Reloaded instrument ${name}`);
            }, 10);
        }
    }, [iframeRef, setupInstrument]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (iframeRef.current) {
            // If we attach the shims immediately, they get cleared during the mounting phase.
            // The initial mount has to be timed after the DOM is loaded, but before the JS bundle loads.
            setTimeout(() => {
                setupInstrument();
                console.info(`[${projectName}] Loaded instrument ${name}`);
            }, 10);
        }
    }, [iframeRef, setupInstrument]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div
            ref={containerRef}
            className="absolute shadow-2xl"
            style={{
                opacity: isDragging ? 0.5 : 1,
                left: x + (transform?.x ?? 0) / zoomState.scale,
                top: y + (transform?.y ?? 0) / zoomState.scale,
                width,
                height,
            }}
        >
            <div
                className="absolute bottom-full w-full box-content border-2 border-b-0 border-midnight-800 bg-midnight-800 rounded-t-xl"
                ref={setNodeRef}
                {...listeners}
                {...attributes}
            >
                <div className="px-4 py-2 flex gap-4 items-center" data-no-dnd="true">
                    <h4 className="font-medium">{name}</h4>
                    <button onClick={refresh}>
                        <FiRefreshCcw className="cursor-pointer active:stroke-yellow-400" size={22} />
                    </button>
                    <ToggleInput onChange={(e) => console.log(e.target.checked)} />
                </div>
            </div>
            <div className="absolute w-full h-full box-content border-2 border-midnight-800 bg-black pointer-events-none">
                <InstrumentFrame ref={iframeRef} name={name} width={width} height={height} />
            </div>
        </div>
    );
};
