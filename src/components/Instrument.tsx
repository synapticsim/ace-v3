import React, { ForwardedRef, forwardRef, memo, Ref, useCallback, useEffect, useRef } from 'react';
import { renderToString } from 'react-dom/server';
import { HiRefresh } from 'react-icons/hi';
import { useTransformContext } from '@pronestor/react-zoom-pan-pinch';
import { invoke } from '@tauri-apps/api/tauri';
import { listen, UnlistenFn } from '@tauri-apps/api/event';
import { useDraggable } from '@dnd-kit/core';
import { GlobalState, useGlobalSelector } from '../redux/global';
import { useWorkspaceDispatch, useWorkspaceSelector, WorkspaceState } from '../redux/workspace';
import { installShims } from '../shims';
import { Element } from '../types';
import { ToggleInput } from './Input';
import { setMenu } from '../redux/workspace/contextMenuSlice'
import { ElementMenu } from './contextmenu/ElementMenu'

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

export const Instrument: React.FC<Element> = ({ uuid, name, element, x, y, width, height }) => {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const projectName = useWorkspaceSelector((state: WorkspaceState) => state.project.active?.name);
    const dispatch = useWorkspaceDispatch();

    const updateInterval = useRef<number>();

    const reloadUnlisten = useRef<UnlistenFn>();

    const { state: transformState } = useTransformContext();

    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: uuid,
        data: { scale: transformState.scale },
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

    const handleWatch = useCallback(async (event: React.MouseEvent<HTMLInputElement>) => {
        if (event.currentTarget.checked) {
            invoke('watch', { instrument: name }).catch(console.error);
            reloadUnlisten.current = await listen<string>('reload', (e) => {
                if (e.payload === name) {
                    refresh();
                }
            });
        } else {
            invoke('unwatch', { instrument: name }).catch(console.error);
            reloadUnlisten.current?.();
        }
    }, [name, refresh]);

    const handleElementMenu = useCallback((e: React.MouseEvent) => {
        dispatch(setMenu(<ElementMenu element={{ uuid, name, element, x, y, width, height }} x={e.clientX} y={e.clientY} />))
    }, [dispatch]);

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

    // Clean up reload event listener on unmount
    useEffect(() => () => reloadUnlisten.current?.(), []);

    return (
        <div
            ref={containerRef}
            className="absolute shadow-2xl"
            onContextMenu={handleElementMenu}
            style={{
                opacity: isDragging ? 0.5 : 1,
                left: x + (transform?.x ?? 0) / transformState.scale,
                top: y + (transform?.y ?? 0) / transformState.scale,
                width,
                height,
            }}
        >
            <div className="absolute bottom-full w-full box-content border-2 border-b-0 border-midnight-800 bg-midnight-800 rounded-t-xl">
                <div className="absolute -top-0.5 w-full flex justify-center">
                    <span
                        className="w-1/4 h-2 bg-midnight-700 rounded-b-full outline-0"
                        ref={setNodeRef}
                        {...listeners}
                        {...attributes}
                    />
                </div>
                <div className="px-4 py-1.5 flex gap-3 items-center">
                    <h4 className="font-medium">{name}</h4>
                    <button className="ml-auto" onClick={refresh}>
                        <HiRefresh className="cursor-pointer active:text-midnight-500" size={22} />
                    </button>
                    <ToggleInput onClick={handleWatch} />
                </div>
            </div>
            <div className="absolute w-full h-full box-content border-2 border-midnight-700 bg-black">
                <InstrumentFrame ref={iframeRef} name={name} width={width} height={height} />
            </div>
        </div>
    );
};
