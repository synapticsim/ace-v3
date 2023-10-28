import React, { ForwardedRef, forwardRef, memo, Ref, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { renderToString } from 'react-dom/server';
import { HiRefresh } from 'react-icons/hi';
import { useTransformContext } from 'react-zoom-pan-pinch';
import classNames from 'classnames';
import Tippy from '@tippyjs/react';
import { invoke } from '@tauri-apps/api/tauri';
import { listen, UnlistenFn } from '@tauri-apps/api/event';
import { useDraggable } from '@dnd-kit/core';
import { GlobalState, useGlobalSelector } from '../redux/global';
import { useWorkspaceDispatch, useWorkspaceSelector, WorkspaceState } from '../redux/workspace';
import { Element } from '../types';
import { ToggleInput } from './Input';
import { setMenu } from '../redux/workspace/contextMenuSlice';
import { ElementMenu } from './contextmenu/ElementMenu';

interface InstrumentFrameProps {
    name: string;
    width: number;
    height: number;
    ref: Ref<HTMLIFrameElement>;
}

const InstrumentFrame: React.FC<InstrumentFrameProps> = memo(forwardRef(
    ({ name, width, height }, ref: ForwardedRef<HTMLIFrameElement>) => {
        const platform = useGlobalSelector((state: GlobalState) => state.config.platform);

        const baseUrl = useMemo(() => (platform === 'win32' ? 'https://ace.localhost' : 'ace://localhost'), [platform]);

        if (platform === undefined) return null;

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
                            <title>{name}</title>
                            <script>
                                /* Backwards compatibility with ACE v2 */
                                window.ACE_ENGINE_HANDLE = true;

                                /* JS built-ins shims */
                                window.fetch = window.parent.aceFetch;

                                /* MSFS global shims */
                                window.SimVar = window.parent.SimVar;
                                window.Coherent = window.parent.Coherent;
                                window.GetStoredData = window.parent.GetStoredData;
                                window.SetStoredData = window.parent.SetStoredData;

                                /* MSFS Avionics Framework global shims */
                                window.simvar = window.parent.simvar;
                                window.BaseInstrument = window.parent.BaseInstrument;
                                window.registerInstrument = window.parent.registerInstrument;
                                window.RunwayDesignator = window.parent.RunwayDesignator;
                                window.GameState = window.parent.GameState;
                                window.Avionics = window.parent.Avionics;
                                window.LaunchFlowEvent = window.parent.LaunchFlowEvent;
                            </script>
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
    },
));

export const Instrument: React.FC<Element> = ({ uuid, name, element, x, y, width, height, onMouseEnter, onMouseLeave }) => {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const projectName = useWorkspaceSelector((state: WorkspaceState) => state.project.active?.config.name);
    const dispatch = useWorkspaceDispatch();

    const updateInterval = useRef<number>();

    const reloadUnlisten = useRef<UnlistenFn>();

    const { transformState } = useTransformContext();

    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: uuid,
        data: { scale: transformState.scale },
    });

    const [interactable, setInteractable] = useState(false);

    const setupInstrument = useCallback(() => {
        clearInterval(updateInterval.current);

        const iframe = iframeRef.current;
        if (iframe && iframe.contentWindow) {
            updateInterval.current = window.setInterval(() => (
                iframe.contentDocument
                    ?.getElementById('ROOT_ELEMENT')
                    ?.dispatchEvent(new CustomEvent('update'))
            ), 50);
        }
    }, [iframeRef]);

    const refresh = useCallback(() => {
        const iframe = iframeRef.current;
        if (iframe && iframe.contentWindow) {
            iframe.contentWindow.location.reload();
            setupInstrument();
            console.info(`[${projectName}] Reloaded instrument ${name}`);
        }
    }, [iframeRef, setupInstrument]);

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

    const handleElementMenu = useCallback((e: React.MouseEvent) => (
        dispatch(setMenu(
            <ElementMenu
                element={{ uuid, name, element, x, y, width, height }}
                x={e.clientX}
                y={e.clientY}
            />,
        ))
    ), [dispatch]);

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
            className={classNames('absolute shadow-2xl', { 'pointer-events-none': !interactable })}
            onContextMenu={handleElementMenu}
            style={{
                opacity: isDragging ? 0.5 : 1,
                left: x + (transform?.x ?? 0) / transformState.scale,
                top: y + (transform?.y ?? 0) / transformState.scale,
                width,
                height,
            }}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <div className="absolute bottom-full w-full box-content border-2 border-b-0 border-silver-800 bg-silver-800 rounded-t-xl pointer-events-auto">
                <div className="absolute -top-0.5 w-full flex justify-center">
                    <span
                        className="w-1/4 h-2 bg-silver-700 rounded-b-full outline-0"
                        ref={setNodeRef}
                        {...listeners}
                        {...attributes}
                    />
                </div>
                <div className="px-4 py-1.5 flex gap-3 items-center">
                    <h4 className="font-medium">{name}</h4>
                    <Tippy content="Toggle Interaction Mode" appendTo={document.body}>
                        <ToggleInput onClick={() => setInteractable(!interactable)} />
                    </Tippy>
                    <Tippy content="Refresh Instrument" appendTo={document.body}>
                        <button className="ml-auto" onClick={refresh}>
                            <HiRefresh className="cursor-pointer active:text-silver-500" size={22} />
                        </button>
                    </Tippy>
                    <Tippy content="Toggle Auto-Refresh" appendTo={document.body}>
                        <ToggleInput onClick={handleWatch} />
                    </Tippy>
                </div>
            </div>
            <div className="absolute w-full h-full box-content border-2 border-silver-700 bg-black">
                <InstrumentFrame ref={iframeRef} name={name} width={width} height={height} />
            </div>
        </div>
    );
};
