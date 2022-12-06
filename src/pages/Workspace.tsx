import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Provider } from 'react-redux';
import { TransformComponent, TransformWrapper } from '@pronestor/react-zoom-pan-pinch';
import { DndContext, DragEndEvent, useDndContext } from '@dnd-kit/core';
import { invoke } from '@tauri-apps/api/tauri';
import { GlobalState, globalStore, useGlobalSelector } from '../redux/global';
import { setInstruments, updateElementPosition } from '../redux/global/projectSlice';
import { useWorkspaceDispatch, useWorkspaceSelector, WorkspaceState, workspaceStore, WorkspaceStoreContext } from '../redux/workspace';
import { setMenu } from '../redux/workspace/contextMenuSlice';
import { initializeSimVars } from '../redux/workspace/simVarSlice';
import { Instrument } from '../components/Instrument';
import { SimVarsMenu } from '../components/menu/SimVarsMenu';
import { CanvasMenu } from '../components/contextmenu/CanvasMenu';
import { InstrumentConfig, SimVarMap } from '../types';

enum MenuTabs {
    SimVars,
}

export const Workspace: React.FC = () => {
    const [currentMenuTab, setMenuTab] = useState<MenuTabs | undefined>(undefined);

    const projectName = useGlobalSelector((state: GlobalState) => state.project.active?.name);

    const handleDragEnd = useCallback((e: DragEndEvent) => {
        const scale = e.active.data.current?.scale ?? 1;
        globalStore.dispatch(updateElementPosition({
            uuid: e.active.id.toString(),
            dx: e.delta.x / scale,
            dy: e.delta.y / scale,
        }));
    }, []);

    useEffect(() => {
        invoke<SimVarMap>('load_simvars')
            .then((simVars) => {
                workspaceStore.dispatch(initializeSimVars({ simVars }));
                console.info(`[${projectName}] Loaded SimVars from project configuration`);
            });
        invoke<InstrumentConfig[]>('load_instruments')
            .then((instruments) => {
                globalStore.dispatch(setInstruments({ instruments }));
                console.info(`[${projectName}] Loaded available instruments`);
            });
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <Provider store={workspaceStore} context={WorkspaceStoreContext}>
            <DndContext onDragEnd={handleDragEnd}>
                <Canvas />
                <ContextMenuLayer />
                <div className="absolute left-0 top-0 h-screen bg-midnight-800 shadow-2xl p-4 flex flex-col gap-4 z-20">
                    <SimVarsMenu
                        show={currentMenuTab === MenuTabs.SimVars}
                        onClick={() => setMenuTab(MenuTabs.SimVars)}
                        onExit={() => setMenuTab(undefined)}
                    />
                </div>
            </DndContext>
        </Provider>
    );
};

const Canvas: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    const project = useGlobalSelector((state: GlobalState) => state.project.active);

    const dispatch = useWorkspaceDispatch();

    const dndContext = useDndContext();

    return (
        <TransformWrapper
            disabled={dndContext.active !== null}
            centerOnInit
            minScale={0.25}
            initialScale={0.25}
            wheel={{ step: 0.15 }}
            velocityAnimation={{ equalToMove: false }}
        >
            <TransformComponent wrapperClass="w-screen h-screen overflow-hidden">
                <div
                    ref={containerRef}
                    className="w-[15000px] h-[5000px] bg-grid"
                    onClick={() => (document.activeElement as HTMLElement)?.blur()}
                    onContextMenu={(e) => {
                        e.preventDefault();

                        if (e.target === containerRef.current) {
                            dispatch(setMenu(<CanvasMenu x={e.clientX} y={e.clientY} />));
                        }
                    }}
                >
                    {project?.elements?.map((props) => (
                        <Instrument {...props} />
                    ))}
                </div>
            </TransformComponent>
        </TransformWrapper>
    );
};

const ContextMenuLayer: React.FC = () => {
    const activeMenu = useWorkspaceSelector((state: WorkspaceState) => state.contextMenu.active);

    return (
        <div className="absolute top-0 left-0 w-screen h-screen pointer-events-none">
            {activeMenu}
        </div>
    );
};
